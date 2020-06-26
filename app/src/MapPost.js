import React from 'react';
import './MapPost.css';
import {Link} from 'react-router-dom';

export default function Post(props) {
  const postClass = "map-post";
  let className = postClass;
  if (props.active) {
    className += " active";
  }
  let url = props.post.photo.url;
  if (url.includes("googleusercontent")) {
    url = url.replace(/w\d+$/, 'h200');
  }
  const postButton = props.active ? <div className="button">Read Post</div> : undefined;
  const panel = (
    <div className={className} data-post-id={props.post.id} key={props.post.id} onClick={props.onClick}>
      <div className="title">{props.post.title}</div>
      <img alt={props.post.title} src={url} />
      {postButton}
    </div>
  );
  return props.active ? <Link to={`/post/${props.post.id}`}>{panel}</Link> : panel;
}