import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import moment from 'moment';
import DOMPurify from 'dompurify';
import Truncate from 'react-truncate-html';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import LazyLoad from 'react-lazyload';

import './index.css';

function Comment(props) {
	return (
		<div className="comment">
		  <h4>
		    <span className="comment-title">{props.name}</span>
		    <span className="time">{moment(props.timestamp).calendar()}</span>
		  </h4>
		  <div className="content">
		  	{props.comment}
		  </div>
		</div>
		);
}

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
        <label htmlFor='user'>Name</label>
        <input 
        	name="user" 
        	type="text" 
        	placeholder="Your name..."
        	onChange={event => this.setState({name: event.target.value})}
        	value={this.state.name} 
        	required
        	/>
        <br />
        <label htmlFor='content'>Comment</label>
        <input 
        	name="content" 
        	type="text" 
        	placeholder="Add your comment..." 
        	onChange={event => this.setState({comment: event.target.value})}
        	value={this.state.comment}
        	required
        	/>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>			
			);
	}
}

class Comments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: props.comments.length <=2,
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.comments.length > 0) {
			return;
		}
		if (this.props.comments.length === 0) {
			return;
		}
		this.setState({expanded: this.props.comments.length <=2});
	}

	render() {
		const props = this.props;
		const allComments = props.comments.slice();
		allComments.sort((a,b) => {return a.timestamp > b.timestamp ? -1 : 1});
		const comments = this.state.expanded ? allComments : allComments.slice(0,2);
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
				onClick={()=>{this.setState({expanded:true})}}
				>{props.comments.length - 2} More Comment{props.comments.length - 2 > 1 ? 's' : ''}</button>
		);

		const banner = (this.props.showBanner === undefined || this.props.showBanner) ? (<h3>Comments</h3>) : (<hr />);

		return (
	  <div className="comments-container read-more-container">
	    {banner}
	    <CommentSubmit 
	      onSubmit={props.onSubmit}
	      name={props.name}
	    />
		    <div className="comments">
		      {commentElements}
		      {button}
		    </div>
	  </div>
			);
	}
}

function Stars(props) {
	return (
  <div className="stars">
    <button className="star-post-button" onClick={props.onClick}>
      {!props.starred ? 'Star it!' : ''}
      <img id="star-image" src={'/images/' + (props.starred ? '' : 'empty_') + 'star.png'} />      
    </button>
    <span className="num-stars">{props.numStars}</span> Star{props.numStars === 1 ? '' : 's'}
  </div>		
		);
}

function Photo(props) {
		return (
		  <div className="img">
  			<LazyLoad
				  height={400}
				  offset={400}
				  once
			  >
			    <img className="square-image" src={props.url} />
  		  </LazyLoad>
		    <h3 className="location-text">
		      {props.title}
		    </h3>
		  </div>
			);
}

function Video(props) {
	return (
		<iframe
		  src={props.url}
		  width={600}
		  height={400}
		>
		</iframe>
		);
}

function Paragraph(props) {
	return (
		<p
		dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(props.text)}}
		>
		</p>
		);
}

function parseNode(node) {
	if (node.video) {
		return (
			<Video url={node.video.url} />
			);
	}
	if (node.photo) {
		return (
			<Photo url={node.photo.url} title={node.photo.title}/>
			);
	}
	return (
		<Paragraph text={node.paragraph.text} />
		);
}

function ToNode(node, i) {
	return (<span className="node" key={i}>
	{parseNode(node)}
	</span>);
}

function Content(props) {
	const isStructured = props.post.structuredContent && props.post.structuredContent.nodes.length > 0;
	const isExpanded = props.expanded;
	if (isStructured) {
		const allNodes = props.post.structuredContent.nodes;
		const nodes = isExpanded ? allNodes : allNodes.slice(0,1);
		return (<span className="content">{nodes.map(ToNode)}</span>);
	} else {
		if (!isExpanded) {
			return (<Truncate lines={6} dangerouslySetInnerHTML={{__html: props.post.content}} />);
		} else {
			return (<span dangerouslySetInnerHTML={{__html: props.post.content}}></span>);
		}
	}
}

class Post extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			starred: props.post.starred,
			stars: props.post.stars,
			comments: props.post.comments,
			expanded: (props.expanded === undefined ? false : props.expanded),
		}
	}

	render() {
		const readMoreButton = this.state.expanded ? undefined : (
		    <button 
		    className="more-text"
		    onClick={() => this.setState({expanded:true})}
		    >Read More</button>
			);
		const content = (<Content post={this.props.post} expanded={this.state.expanded} />);
		const commentsElement = (this.props.enableComments === undefined || this.props.enableComments) ? (
					  <Comments
		    comments={this.state.comments}
		    name={this.props.name}
		    onSubmit={(data) => {
			    fetch('/add_post_comment', {
			      method: 'post',
			      headers: {
			        'Content-Type': 'application/json; charset=utf-8',
			      },
			      body: JSON.stringify({
			        post_id: this.props.post.id,
			        name: data.name,
			        comment: data.comment,
			      })
			    })
			        .then(response => response.json())
			        .then(response => this.setState({comments: response.comments}));		    	
		    }}
		    />
			) : undefined;

	const stars = (this.props.enableStars === undefined || this.props.enableStars) ? (
				  <Stars
		    numStars={this.state.stars}
		    starred={this.state.starred}
		    onClick={() => {
		    	if (this.state.starred) {
		    		return;
		    	}
		    	this.setState({starred: true});
			    fetch('/star_post', {
			      method: 'post',
			      headers: {
			        'Content-Type': 'application/json; charset=utf-8',
			      },
			      body: JSON.stringify({
			        'post_id': this.props.post.id,
			      })
			    })
			        .then(response => response.json())
			        .then(response => this.setState({stars: response.stars}));
			    }}
		  />
		) : undefined;

	return (
		<LazyLoad
		  height={800}
		  offset={600}
		  once
		  >
		<div className="post">
		  <div className="post-header">
		    <h2 className="title-text">
		    	{this.props.post.title}
		    </h2>
		    <span className="post-time time">
		      {moment(this.props.post.timestamp).calendar()}
		    </span>
		  </div>
		  <Photo
		    url={this.props.post.photo.url}
		    title={this.props.post.location.city + ", " + this.props.post.location.country}
		    />
		  {stars}
		  <div className="text-container read-more-container">
		    <div className="text">
		      {content}
		    </div>
		    {readMoreButton}
		  </div>
		  {commentsElement}
		</div>		
		</LazyLoad>
		);
	}
}

export function AboutUs(props) {
	return (
		<Stream
		enableComments={false}
		enableStars={false}
		expanded={true}
		posts={[
		{
				content: `
                <p>
                Hi Friends!</p>
                <p>We are Jack and Olga and we are here to share photos and stories of our traveling adventures!</p>
                <p>We left Berkeley, CA on July 2018 after finishing our engineering PhDs and taking a "sabbatical" from our jobs to experience new things and travel around the world. We cleared our wonderful tiny studio apartment (a lot of goodwill trips and friend donations took place) and packed everything else in our backpacks.</p>
                <p> We love spending time with each other, going on adventures, and finding new activities to do together. We want to use this opportunity to get inspired, try new things and gain new skills. At the same time, we want to motivate others to do the same thing: never settle and keep pushing to live new experiences.</p>
                <p> Our plan is to:
                  <ul>
                    <li>travel as much as we can,</li>
                    <li>experience new cultures,</li>
                    <li>get off the beaten path,</li>
                    <li>step out of our comfort zone,</li>
                    <li>meet other travelers and locals,</li>
                    <li>share our experiences, and</li>
                    <li>get inspired!</li>
                  </ul>
                We have never done extended traveling before, so this is hopefully going to be a great experience for not only us, but you as well, as we wish to share all the ups and downs of newbie couple traveling.</p>
                <p>If you want to contact us while we are on the road, please leave us a note in our <a href='/guestbook/guestbook.html'">guestbook</a> or email us at our email:</br>
                <a href="mailto:taxeedeetravels@gmail.com"><i>taxeedeetravels@gmail.com</i></a></br>
                <p>For more travel photos you can also follow <a target="_blank" href='https://www.instagram.com/taxeedee/?hl=en'">our instagram</a> page.
				`,
				photo: {
					url: "https://lh3.googleusercontent.com/r_9AMLGjqJ59y8D5qjIb3-YmDCWEHgaIe1LXqp40ZM471dV1TyG0pZFKWn0bDhfnNyLqT9szzgHqlIFjSfExKVzXjFdF163CvrK47P77K0laHPzWezAGEYy49lV6vgXYAV4LFZbrf5c=w600-h315-p-k"
				},
				id: "Fake",
				location: {
					city: "Clear Lake, California",
					country: "USA",
				},
				title: "About Us",
				comments: [],
		}]}
		/>
		);
}

export class Guestbook extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			name: undefined,
		}
	  fetch('/comments').then(response => response.json()).then(response => {
	  	const comments = response.comments.slice();
			comments.sort((a,b) => {return a.timestamp > b.timestamp ? -1 : 1});
	  	this.setState({comments: comments})
	  });
	  fetch('/myname').then(response => response.json()).then(response => this.setState({name: response.name}));
	}

	render() {
	return (
	  <div id="stream">
		<div className="post">
		  <div className="post-header">
		    <h2 className="title-text">
		      Guestbook
		    </h2>
		  </div>
		  <div className="img">
		    <img className="square-image" src="/images/guestbook.png" />
        <p className='text'>Please leave us a note! It will make our day :)</p>
		  </div>
		  <Comments
		    comments={this.state.comments}
		    name={this.props.name}
		    showBanner={false}
		    onSubmit={(data) => {
			    fetch('/add_comment', {
			      method: 'post',
			      headers: {
			        'Content-Type': 'application/json; charset=utf-8',
			      },
			      body: JSON.stringify({
			        name: data.name,
			        comment: data.comment,
			      })
			    })
			        .then(response => response.json())
			        .then(response => this.setState({comments: response.comments}));		    	
		    }}
		    />
			</div>
	  </div>
		);
	}
}

export class Stream extends React.Component {
	constructor(props) {
		super(props);
		this.state = {posts: (props.posts === undefined ? [] : props.posts), name: undefined};
	  fetch('/myname').then(response => response.json()).then(response => this.setState({name: response.name}));		
	  if (props.posts === undefined) {
		  fetch('/posts').then(response => response.json()).then(response => {
		  	const posts = response.posts.slice();
				posts.sort((a,b) => {return a.timestamp > b.timestamp ? -1 : 1});
		  	this.setState({posts: posts})
		  });
	  }
	}

	render() {
		if (this.state.posts.length == 0) {
			return (<div className="loading">Loading Posts...</div>);
		}
		const posts = this.state.posts.map((post, i)=> {
			return (
				<Post
				  post={post}
				  name={this.state.name}
				  key={post.id}
				  enableComments={this.props.enableComments}
				  enableStars={this.props.enableStars}
				  expanded={this.props.expanded}
				/>
				);
		});
		return (
			<div id="stream">
			{posts}
			</div>
		);
	}
}

function Humburger(props) {
	return (
    <div id="humburger" onClick={props.onClick}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>		
		);
}

function Dropdown(props) {
	const display = props.active ? "block" : "none";
	const style = {
		display: display
	};
	return (
	    <span id="dropdown" style={style} onClick={props.onClick}>
		     <Link to="/">Home</Link><br />
		     <Link to="/about">About Us</Link><br />
		     <Link to="/guestbook">Guestbook</Link><br />
	    </span>	
		);
}

export class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {dropdownActive: false};
	}

	render() {
		return (
		<Router>			  			
			<div id="app">
			  <header>
			    <Humburger 
			      onClick={() => this.setState({dropdownActive: !this.state.dropdownActive})}
			    />
			    <div id="header-text">
			      <Link to="/">
			        <h1>Taxeedee: 
			          <span id="subtitle">Travels of Olga and Jack</span>
			        </h1>
			      </Link>      
			    </div>
			  </header>

			  <main>				
			    <Dropdown 
			      active={this.state.dropdownActive}
			      onClick={() => this.setState({dropdownActive: false})}
			    />
		    		<Route exact path="/" component={Stream} />
		        	<Route path="/about" component={AboutUs} />
			        <Route path="/guestbook" component={Guestbook} />			  
			  </main>			        
			  <footer>
			    Ταξίδι: Greek for Travel
			  </footer>
			</div>
		</Router>			    			
			);
	}
}

ReactDOM.render(
  <Page 
  />,
  document.getElementById('root')
);