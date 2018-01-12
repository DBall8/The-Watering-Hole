import React from 'react';

// this class holds a clickable object that takes the user to a thread's page
class ThreadHead extends React.Component {

    // deletes a thread
    deleteThread(e, key) {
        e.stopPropagation();
        this.props.deleteThread(key)
    }

    render() {
        return (
            <div className="threadhead" onClick={() => this.props.openThread(this.props.arraykey) }>
                <h2 className="titlename" >{this.props.title}</h2>
            </div>
        );
    }
}

export default ThreadHead;