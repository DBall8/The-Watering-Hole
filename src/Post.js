import React from 'react';

// class for a post made on a discussion thread
class Post extends React.Component {

    constructor() {
        super();
        // watches whether or not the post is being edited
        this.state = {
            editing: false
        }
    }

    // adds a delete button if the current user made the post
    addButton() {
        if (this.props.post.id == this.props.userid && this.props.post.poster === this.props.username) {
            return (
                <div>
                    <p className="editbutton" onClick={() => this.setState({editing: true})}>edit</p>
                </div>
                )
        }
    }

    // sends the updated post to the thread
    sendUpdate(e) {
        e.preventDefault();
        this.props.updatePost(this.props.arraykey, this.editInput.value);
        // reset form
        this.editForm.reset();
        // stop editing
        this.setState({ editing: false });
    }

    // either draws the post, or draws the edit form for the post
    drawPost() {
        if (this.state.editing) {
            // edit form
            return (
                <form onSubmit={(e) => this.sendUpdate(e)} ref={(input) => this.editForm = input}>
                    <input type="text" className="postinput" ref={(input) => this.editInput = input} defaultValue={this.props.post.text} />
                    <br />
                    <button type="submit" className="button">Save</button>
                    <button type="button" className="button" onClick={() => this.props.deletePost(this.props.arraykey)}>Delete</button>
                    <button type="button" className="button" onClick={() => this.setState({ editing: false }) }>Cancel</button>
                </form>
                )
        }
        // post
        else {
            return (
                <p className="text">{this.props.post.text}</p>
            )
        }
    }


    // adds an (OP) tag to username if the post is by the poster of the thread
    isOP() {
        if (this.props.post.id == this.props.opid && this.props.post.poster === this.props.opname) {
            return ('(OP)')
        }
    }

    // adds a (ME) tag is post made by the current user
    isMe() {
        if (this.props.post.id == this.props.userid && this.props.post.poster === this.props.username) {
            return ('(ME)')
        }
    }

    render() {
        return (
            <div className="brownbox">
                <h2 className="id">{this.props.post.poster}{this.isOP()}{this.isMe()}: </h2>
                {this.addButton()}
                {this.drawPost()}
            </div>
        );
    }
}

export default Post;