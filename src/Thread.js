import React from 'react';
import Post from './Post';

// displays a thread and all posts posted in that thread
class Thread extends React.Component {

    constructor() {
        super();
        this.deletePost = this.deletePost.bind(this)
        this.updatePost = this.updatePost.bind(this)

        // watches state for when it should be editing or when it should just be displaying
        this.state = {
            editing: false
        }
    }

    // intercepts the posts update to insert the thread's key, so the post can be updated from this thread
    updatePost(key, newtext) {
        this.props.updatePost(key, this.props.threadid, newtext);
    }

    // intercepts the posts delete to insert the thread's key, so the post can be delete from this thread
    deletePost(key) {
        this.props.deletePost(key, this.props.threadid);
    }

    // sends a new post to be added to the thread
    sendPost(event) {
        event.preventDefault();

        // will not send blank posts
        if (this.text.value === '') {
            return;
        }

        const post = {
            poster: this.props.username,
            id: this.props.userid,
            text: this.text.value
        }

        this.props.addPost(post, this.props.threadid);
        this.addForm.reset();
    }

    // adds a post when the eneter key pressed
    myKeyPress(k) {
        if (k.key === 'Enter') {
            this.sendPost(k)
        }
    }

    sendUpdate(e) {
        e.preventDefault();

        this.props.updateThread(this.props.threadid, this.editInput.value);
        this.editForm.reset();
        this.setState({ editing: false });
    }

    // adds a delete button if the current user made the post
    addButton() {
        if (this.props.thread.posterid == this.props.userid && this.props.thread.postername === this.props.username) {
            return (
                <div>
                    <p className="editbutton" style={{ float: 'none' }} onClick={() => this.setState({ editing: true })}>edit</p>
                </div>
            )
        }
    }

    // either displays the content of the thread, or a form for editing the thread
    drawContent(editing) {
        // editing form
        if (editing) {
            return (
                <form onSubmit={(e) => this.sendUpdate(e)} ref={(input) => this.editForm = input}>
                    <textarea type="text" className="input" cols="50" rows="10" ref={(input) => this.editInput = input} defaultValue={this.props.thread.content} />
                    <br />
                    <button type="submit" className="button">Save</button>
                    <button type="button" className="button" onClick={() => this.props.deleteThread(this.props.threadid)}>Delete</button>
                    <button type="button" className="button" onClick={() => this.setState({ editing: false })}>Cancel</button>
                </form>
                )
        }
        // just the display
        else {
            return (
                <p className="threadcontent">{this.props.thread.content}</p>
                )
        }
    }

    // loads all posts if posts exist
    loadPosts() {
        if (this.props.thread.posts) {
            return (
                Object.keys(this.props.thread.posts).map(key =>
                    <Post
                        key={key}
                        arraykey={key}
                        post={this.props.thread.posts[key]}
                        username={this.props.username}
                        userid={this.props.userid}
                        opname={this.props.thread.postername}
                        opid={this.props.thread.posterid}
                        updatePost={this.updatePost}
                        deletePost={this.deletePost}
                    />
                ))
        }
    }

    render() {
        if (!this.props.thread.title) {
            this.props.gotothreads()
        }

        return (
            <div className="thread">
                <button className="backbutton" onClick={() => this.props.gotothreads()}>Back</button>
                <div className="brownbox">
                    <h1 className="title">{this.props.thread.title}</h1>
                    <p className="postedby">Posted by: {this.props.thread.postername}</p>
                    <div className="threadtop">
                        {this.drawContent(this.state.editing)}
                        
                    </div>
                    {this.addButton()}
                    
                </div>
                {this.loadPosts()}
                <form ref={(input) => this.addForm = input} className="addForm" onSubmit={(e) => this.sendPost(e)}>
                    <button className="postbutton" type="submit">Post</button>
                    <textarea cols="90" rows="1" className="postinput" placeholder="Type your message here..." ref={(input) => this.text = input} name="newpost" onKeyDown={(k) => this.myKeyPress(k) }/>
                        
                    </form>
            </div>
        );
    }
}

export default Thread;
