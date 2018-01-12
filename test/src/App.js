import React, { Component } from 'react';
import ThreadQueue from './ThreadQueue';
import Thread from './Thread'
import './App.css';
import base from './base';
import animals from './animals.js';
import Cookie from 'universal-cookie'

// test
class App extends Component {

    constructor() {
        super();
        this.addThread = this.addThread.bind(this);
        this.updateThread = this.updateThread.bind(this);
        this.deleteThread = this.deleteThread.bind(this);
        this.addPost = this.addPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.openThread = this.openThread.bind(this);
        this.gotothreads = this.gotothreads.bind(this);

        this.state = {
            threads: {}, // threads, each containing a bunch of posts
            userids: [] // potential IDS
        }
        this.currentThread = ''; // key of thread currently openend
        this.idobtained = false; // true when id has been obtained
    }

    // resets all claimed IDs to unclaimed
    resetIds() {
        this.setState((prevstate) => {
            return {
                threads: prevstate.threads,
                userids: [...animals]
            }
        });
    }

    componentWillMount() {
        document.title = "The Watering Hole"; // set title

        this.ref = base.syncState(`a7/threads`, { //synch with threads
            context: this,
            state: 'threads'
        });

        
        this.ref2 = base.syncState(`a7/userids`, { // synch with IDs
            context: this,
            state: 'userids'
        });
        
        
    }

    // gets the ID cookie if one is stored
    getIDCookie() {
        const cookies = new Cookie();
        return { username: cookies.get('username'), id: cookies.get('id') };
    }
    // sets an ID cookie
    setIDCookie(name, id) {
        const cookies = new Cookie();
        cookies.set('id', id, { path: './' })
        cookies.set('username', name, {path: './' })
    }

    // removes references
    componentWillUnMount() {
        base.removeBinding(this.ref);
    
        base.removeBinding(this.ref2);
    }

    
    componentDidUpdate() {

        // if an ID has not been obtained, attempt to get one
        if (!this.idobtained) {

            // first see if a cookie is stored
            var cookies = this.getIDCookie();
            if (cookies.id && cookies.username) { // use the cookie for the id
                this.username = cookies.username;
                this.userid = cookies.id;
                this.idobtained = true;
            }
            // otherwise, if the userids have been synched with firebase, claim one of them
            else if (this.state.userids.length > 0) {
                this.obtainID();
            }
            //this.resetIds();
        }
        
    }

    // gets an avaible ID from the database
    obtainID() {
        // grab array of ids
        const userids = [...this.state.userids];
        // generate a random number for an index
        var randomnum = Math.floor(Math.random() * userids.length);

        // loop until all ids in the array have been checked
        // each time seeing if the id at the index is taken
        // if not, take it and return
        // if all taken, reset ids (meaning now duplicate uesrids exist)
        for (var i = 0; i < userids.length; i++) {
            var index = randomnum + i;
            if (index >= userids.length) { // loop around when past end of array
                index -= userids.length;
            }
            var animalid = userids[index];
            if (!animalid.taken) {
                animalid.taken = true; // claim id
                userids[index] = animalid;
                this.setState((prevstate) => {
                    return {
                        threads: prevstate.threads,
                        userids: [...userids]
                    }
                });
                this.userid = Date.now();
                this.username = animalid.animal; // set this as userid
                this.setIDCookie(this.username, this.userid); // save a cookie
                this.idobtained = true; // stop looking for ids
                return;
            }
        }
        // reset ids and attempt to claim one
        console.log("No IDs remaining, resetting ids (duplicate ids can now be used).");
        this.resetIds();
        this.obtainID();
        
        
    }

    // add a thread to the database
    addThread(thread) {
        const threads = { ...this.state.threads };
        threads[`thread-${Date.now()}`] = thread;
        this.setState({ threads });
    }

    // delete a thread
    deleteThread(key) {
        const threads = { ...this.state.threads }
        threads[key] = null;
        if (key === this.currentThread) {
            this.currentThread = '';
        }
        //delete posts[key];
        this.setState({ threads });
    }

    // update a thread's contents
    updateThread(key, newcontents) {
        const threads = { ...this.state.threads }
        threads[key].content = newcontents;
        this.setState({ threads });
    }

    // add a post
    addPost(post, threadkey) {
        // grab thread
        const threads = { ...this.state.threads }
        // grab that thread's posts
        const posts = { ...(threads[threadkey].posts) };
        // insert
        posts[`post-${Date.now()}`] = post;
        // save
        threads[threadkey].posts = posts;
        this.setState({ threads }, this.state.userids);
        
    }

    // udpate a post
    updatePost(key, threadkey, newtext) {
        // get thread
        const threads = { ...this.state.threads }
        // get thread's posts
        const posts = { ...(threads[threadkey].posts) }
        // update
        posts[key].text = newtext;
        // save
        threads[threadkey].posts = posts;
        this.setState({ threads }, this.state.userids);

    }

    // delete a post
    deletePost(key, threadkey) {
        // get thread
        const threads = { ...this.state.threads }
        // get thread's posts
        const posts = { ...(threads[threadkey].posts) }
        // delete
        posts[key] = null;
        // save
        threads[threadkey].posts = posts;
        this.setState({ threads }, this.state.userids);
        
    }

    // opens a thread
    openThread(key) {
        // set open thread to the key
        this.currentThread = key;
        // reload page
        this.forceUpdate();
    }

    // goes back to thread selection page
    gotothreads() {
        // wipe current thread
        this.currentThread = '';
        // reload page
        this.forceUpdate();
    }

    // draws the body of the page
    renderPage() {
        // just show a loading message if no userid has been obtained yet
        if (!this.idobtained) {
            return (
                <h1>Loading...</h1>
                )
        }
        // show a list of discussion threads if no thread is open
        else if (this.currentThread === '') {
            return (
                
                    <ThreadQueue
                        threads={this.state.threads}
                        username={this.username}
                        userid={this.userid}
                        addThread={this.addThread}
                        openThread={this.openThread}
                        deleteThread={this.deleteThread}
                    />
            );
        }
        // display the thread if a thread is open
        else {
            return (
                <Thread
                    thread={this.state.threads[this.currentThread]}
                    threadid={this.currentThread}
                    username={this.username}
                    userid={this.userid}
                    addPost={this.addPost}
                    updatePost={this.updatePost}
                    deletePost={this.deletePost}
                    updateThread={this.updateThread}
                    deleteThread={this.deleteThread}
                    gotothreads={this.gotothreads}
                    />
            );
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 id="LOGO" className="App-title">The Watering Hole</h1>
                </header>
                <div>{this.renderPage()}</div>
           </div>
        )
    }
}

export default App;
