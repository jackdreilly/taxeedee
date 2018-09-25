import React from 'react';

function InstagramBanner(props) {
	return (
		<a
		  className="instagram-banner"		
		  target="_blank" 
		  href="http://instagram.com/taxeedee"
		  rel="noopener noreferrer"
		  ><img alt="instragram logo" src="/images/instagram.png" />Follow us <span id="taxeedee-link">@taxeedee</span></a>
		);
}

export default InstagramBanner;
