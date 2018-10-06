import React from 'react';
import Comment from "./Comment";
import CommentSubmit from "./CommentSubmit";

class Comments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: props.comments.length <=this.numShow(),
		};
	}

	numShow() {
		if (this.props.numShow !== undefined) {
	    return this.props.numShow;
		}
		return 2;
	}

	componentDidUpdate(prevProps) {
		if (prevProps.comments.length > 0) {
			return;
		}
		if (this.props.comments.length === 0) {
			return;
		}
		this.setState({expanded: this.props.comments.length <=this.numShow()});
	}

	render() {
		const props = this.props;
		const allComments = props.comments.slice();
		allComments.sort((a,b) => {return a.timestamp > b.timestamp ? -1 : 1});
		const comments = this.state.expanded ? allComments : allComments.slice(0,this.numShow());
		const commentElements = comments.map((comment, i) => {
			return (
				<Comment 
				  name={comment.name}
				  timestamp={comment.timestamp}
				  comment={comment.comment}
				  key={i}
				/>
				);
		});

		const button = this.state.expanded ? undefined : (
			<button 
				className='more-text'
				onClick={()=>{
					this.props.onExpand && this.props.onExpand();
					this.setState({expanded:true});
				}}
				>{props.comments.length - this.numShow()} More Comment{props.comments.length - this.numShow() > 1 ? 's' : ''}</button>
		);

		const banner = (this.props.showBanner === undefined || this.props.showBanner) ? (
			<h3
			  className="comments-header"
			  >Comments</h3>
			) : (<hr />);

		return (
	  <div className="comments-container read-more-container">
	    {banner}
	    <CommentSubmit 
	      onSubmit={props.onSubmit}
	      name={props.name}
	    />
		    <div className="comments read-section">
		      {commentElements}
		      {button}
		    </div>
	  </div>
			);
	}
}

export default Comments;