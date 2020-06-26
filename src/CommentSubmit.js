import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

class CommentSubmit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.name === undefined ? '' : props.name,
			comment: '',
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.name === undefined && this.props.name !== undefined) {
			this.setState({name: this.props.name});
		}
	}

	render() {
		return (
    <div className='add-comment'>
      <form name='comment_form' onSubmit={event => {
      	event.preventDefault();
      	this.props.onSubmit({
      		name: this.state.name,
      		comment: this.state.comment,
      	});
      	this.setState({comment: ''});
      }}>
        <div className="block">
	        <label htmlFor='user'>Name</label>
	        <input 
	        	name="user" 
	        	type="text" 
	        	placeholder="Your name..."
	        	onChange={event => this.setState({name: event.target.value})}
	        	value={this.state.name} 
	        	required
	        	/>
	      </div>
	      <div className="block">
	        <label htmlFor='content'>Comment</label>
	        <TextareaAutosize
	        	name="content" 
	        	placeholder="Add your comment..." 
	        	onChange={event => this.setState({comment: event.target.value})}
	        	value={this.state.comment}
	        	required
	        	/>
	      </div>
        <input className="submit-button" type="submit" value="Submit" />
      </form>
    </div>			
			);
	}
}

export default CommentSubmit;