import React from 'react';

function Stars(props) {
	return (
  <div className="stars">
    <button className={`star-post-button ${props.starred ? 'starred' : 'not-starred'}`} onClick={props.onClick}>
      {!props.starred ? 'Star it!' : ''}
      <img alt="Star this post" id="star-image" src={'/images/' + (props.starred ? '' : 'empty_') + 'star.png'} />      
    </button>
    <span className="num-stars">{props.numStars}</span> Star{props.numStars === 1 ? '' : 's'}
  </div>		
		);
}

export default Stars;