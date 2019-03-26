import React from 'react';
import 'whatwg-fetch';
import moment from 'moment';
import LazyLoad from 'react-lazyload';
import {Link} from "react-router-dom";
import Content from './Content';
import Comments from './Comments';
import Stars from './Stars';
import Photo from './Photo';
import sendMetric from './Metrics';

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
        onClick={() => {
      sendMetric('post_expanded', {post_id: this.props.post.id});
      this.setState({expanded : true});
        }}
        >Read More</button>
      );
    const content = (<Content post={this.props.post} expanded={this.state.expanded} />);
    const commentsElement = (this.props.enableComments === undefined || this.props.enableComments) ? (
            <Comments
        comments={this.state.comments}
        name={this.props.name}
        onExpand={() => sendMetric('comments_expanded', {post_id: this.props.post.id})}
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

  const header = (
    <div
      className="post-header">
        <h2 className="title-text">
          {this.props.post.title}
        </h2>
        <span className="post-time time">
          {moment(this.props.post.timestamp).calendar()}
        </span>
      </div>
    );

  const {link} = this.props;
  const linkHeader = (link === undefined) ? header : (
      <Link 
        to={link}
        className="post-header-link"
        onClick={() => sendMetric('post_clicked', {post_id: this.props.post.id})}
        >
        {header}
      </Link>
    );
  const textClasses = `text read-section ${this.state.expanded ? 'expanded' : 'not-expanded'}`;
  return (
    <LazyLoad
      height={800}
      offset={600}
      once
      >
    <div className="post">
      {linkHeader}
      <Photo
        onClick={() => sendMetric('photo_clicked', {post_id: this.props.post.id, photo: this.props.post.photo.url})}
        url={this.props.post.photo.url}
        title={this.props.post.location.city + ", " + this.props.post.location.country}
        />
      {stars}
      <div className="text-container read-more-container">
        <div className={textClasses}
            onClick={
              () => {
                sendMetric('post_expanded', {post_id: this.props.post.id});
                this.setState({expanded : true});
              }
            }>
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

export default Post;
