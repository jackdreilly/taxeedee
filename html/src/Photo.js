import React from 'react';
import LazyLoad from 'react-lazyload';

function Photo(props) {
		return (
		  <div className="img">
  			<LazyLoad
				  height={400}
				  offset={400}
				  once
			  >
			    <img alt={props.title} className="square-image" src={props.url} />
  		  </LazyLoad>
		    <h3 className="location-text">
		      {props.title}
		    </h3>
		  </div>
			);
}

export default Photo;