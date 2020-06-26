import moment from "moment";
import React from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import { firestore, uid } from "./App";
import Comments from "./Comments";
import Content from "./Content";
import sendMetric from "./Metrics";
import Photo from "./Photo";
import Stars from "./Stars";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starred: props.post.starred,
      expanded: props.expanded === undefined ? false : props.expanded,
    };
  }

  expandPost = () => {
    sendMetric("post_expanded", { post_id: this.props.post.id });
    this.setState({ expanded: true });
  };

  render() {
    const readMoreButton = this.state.expanded ? undefined : (
      <button className="more-text" onClick={this.expandPost}>
        Read More
      </button>
    );
    const content = (
      <Content post={this.props.post} expanded={this.state.expanded} />
    );
    const commentsElement =
      this.props.enableComments === undefined || this.props.enableComments ? (
        <Comments
          comments={this.props.post.comments}
          name={this.props.name}
          onExpand={() =>
            sendMetric("comments_expanded", { post_id: this.props.post.id })
          }
          onSubmit={(data) => {
            firestore.collection("comments").add({
              post: this.props.post.ref,
              name: data.name,
              comment: data.comment,
              date: new Date(),
            });
          }}
        />
      ) : undefined;
    if (!this.props.post.stars) {
      this.props.post.stars = [];
    }
    if (!this.props.post.comments) {
      this.props.post.comments = [];
    }
    const starred = this.props.post.stars.some((s) => s.user === uid());
    const stars =
      this.props.enableStars === undefined || this.props.enableStars ? (
        <Stars
          numStars={this.props.post.stars.length}
          starred={starred}
          onClick={() => {
            if (starred) {
              return;
            }
            firestore.collection("stars").add({
              user: uid(),
              post: this.props.post.ref,
              date: new Date(),
            });
          }}
        />
      ) : undefined;

    const header = (
      <div className="post-header">
        <h2 className="title-text">{this.props.post.title}</h2>
        <span className="post-time time">
          {moment(this.props.post.timestamp).calendar()}
        </span>
      </div>
    );

    const { link } = this.props;
    const linkHeader =
      link === undefined ? (
        header
      ) : (
        <Link
          to={link}
          className="post-header-link"
          onClick={() =>
            sendMetric("post_clicked", { post_id: this.props.post.id })
          }
        >
          {header}
        </Link>
      );
    const textClasses = `text read-section ${
      this.state.expanded ? "expanded" : "not-expanded"
    }`;
    return (
      <LazyLoad height={800} offset={600} once>
        <div className="post">
          {linkHeader}
          <Photo
            onClick={() =>
              sendMetric("photo_clicked", {
                post_id: this.props.post.id,
                photo: this.props.post.photo.url,
              })
            }
            url={this.props.post.photo.url}
            title={
              this.props.post.location.city +
              ", " +
              this.props.post.location.country
            }
          />
          {stars}
          <div className="text-container read-more-container">
            <div className={textClasses} onClick={this.expandPost}>
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
