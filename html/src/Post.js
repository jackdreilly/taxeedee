import React from 'react';
import 'whatwg-fetch';
import moment from 'moment';
import LazyLoad from 'react-lazyload';
import Content from './Content';
import Comments from './Comments';
import Stars from './Stars';
import Photo from './Photo';

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
        <div className="text read-section">
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