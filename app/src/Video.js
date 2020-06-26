import React from 'react';

function Video(props) {
	return (
		<iframe
		  src={props.url}
		  width={600}
		  height={400}
		  title="video"
		>
		</iframe>
		);
}

export default Video;