import React from 'react';
import moment from 'moment';


function Comment(props) {
	return (
		<div className="comment">
		  <h4>
		    <span className="comment-title">{props.name}</span>
		    <span className="time">{moment(props.timestamp.toDate()).calendar()}</span>
		  </h4>
		  <div className="content">
		  	{props.comment}
		  </div>
		</div>
		);
}

export default Comment;