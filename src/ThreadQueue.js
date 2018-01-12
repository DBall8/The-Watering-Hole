import React from 'react';
import ThreadHead from './ThreadHead'

// displays all discussion threads, as well as allows the user to create a new thread
class ThreadQueue extends React.Component {

    constructor() {
        super();
        
        this.state = {
            divShown: false // whether or not the add thread div is shown
        }
    }

    // hides and shows the add thread form
    toggleHiddenDiv() {
        const s = this.state.divShown;
        this.setState({ divShown: !s });
    }

    // draws the add thread form if it is shown
    makeForm(b) {
        if (b) {
            return (
                <form ref={(input) => this.addThreadForm = input} className="addthreadform" onSubmit={(e) => this.sendThread(e)}>
                    <button className="bigbutton" type="button" onClick={() => this.toggleHiddenDiv()}>Cancel</button>
                    <br />
                    <input className="input" placeholder="Title" name="title" ref={(input) => this.title = input} />
                    <br />
                    <textarea cols="50" rows="10" className="input" placeholder="Write here..." ref={(input) => this.text = input} />
                    <br />
                    <button className="bigbutton" type="submit">Create</button>
                </form>
                );
        }
        else {
            return (
                <form ref={(input) => this.addThreadForm = input} className="addthreadform" onSubmit={(e) => this.sendThread(e)}>
                    <button className="bigbutton" type="button" onClick={() => this.toggleHiddenDiv()}>Start Discussion</button>
                    
                </form>
                
                )
        }
    }

    // sends a new thread to be added
    sendThread(event) {
        event.preventDefault();

        const thread = {
            posterid: this.props.userid,
            postername: this.props.username,
            title: this.title.value,
            content: this.text.value,
            posts: {}
        }

        this.props.addThread(thread);
        this.toggleHiddenDiv(); // rehides form
        this.addThreadForm.reset(); // resets form values
    }

    render() {
        return (
            <div className="thread">
                <h1 className="title">Discussions:</h1>
                {this.makeForm(this.state.divShown)}
                {
                    Object.keys(this.props.threads).reverse().map(key => 
                        
                        <ThreadHead
                            key={key}
                            arraykey={key}
                            title={this.props.threads[key].title}
                            openThread={this.props.openThread}
                            deleteThread={this.props.deleteThread}
                        />
                    )
                }
                
                <div ref={(input) => this.scrollview = input}></div>
            </div>
            )
    }
}

export default ThreadQueue;