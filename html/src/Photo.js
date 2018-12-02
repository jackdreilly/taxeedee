import React from 'react';
import LazyLoad from 'react-lazyload';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

class Photo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen : false,
      wasOpened: false,
    };
  }

  clickable() {
  	return this.props.url.includes("googleusercontent");
  }

  largeUrl() {
    return this.props.url.replace(/[hw]\d+$/, 'w1800');
  }

  render() {
  	const props = this.props;
  	const className = this.clickable() ? "square-image clickable" : "square-image";
  	const onClick = this.clickable() ? () => {
      this.props.onClick && this.props.onClick();
      this.setState({isOpen: true, wasOpened: true});
    } : undefined;
		return (
		  <div className="img">
  			<LazyLoad
				  height={400}
				  offset={400}
				  once
			  >
			    <img 
			    	alt={props.title} 
			    	className={className}
			    	onClick={onClick}
			    	src={this.state.wasOpened ? this.largeUrl() : props.url} />
  		  </LazyLoad>
		    <h3 className="location-text">
		      {props.title}
		    </h3>
		    {this.state.isOpen && this.clickable() &&
		    (
		    	<Lightbox
		    	  mainSrc={this.largeUrl()}
		    	  imageCaption={this.props.title}
		    	  onCloseRequest={() => this.setState({ isOpen: false })} />
		    	)
		    }
		  </div>
			);
  }
}

export default Photo;
