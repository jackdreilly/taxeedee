import React from 'react';
import DOMPurify from 'dompurify';

function Paragraph(props) {
	return (
		<p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(props.text)}} />
		);
}

export default Paragraph;