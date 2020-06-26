import React, { Component } from "react";
import "./MapPanel.css";
import "whatwg-fetch";
import Post from "./MapPost";
import HorizontalScroller from "./HorizontalScroller";
import PostPhotoScroller from "./PostPhotoScroller";
import Map from "./Map";
import { firestore } from "./App";

class MapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: undefined,
      posts: undefined,
      timeline: undefined,
    };
  }

  componentDidMount() {
    firestore
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get()
      .then((p) => this.setState({ posts: p.docs.map((d) => d.data()) }));
    firestore
      .doc("timeline/timeline")
      .get()
      .then((p) => this.setState({ timeline: p.data().timeline }));
  }

  render() {
    if (!this.state.posts) {
      return <div>Loading map posts...</div>;
    }
    const posts = this.state.posts;
    const timeline = this.state.timeline;
    const scroller = (
      <HorizontalScroller
        items={posts.map((post) => {
          return (
            <Post
              post={post}
              key={post.id}
              active={this.state.active === post.id}
              onClick={(event) => this.setState({ active: post.id })}
            />
          );
        })}
      />
    );
    let photoScroller;
    this.state.posts.forEach((post) => {
      if (post.id === this.state.active) {
        photoScroller = <PostPhotoScroller post={post} />;
      }
    });
    const activeClass = this.state.active ? "active" : "inactive";
    return (
      <div id="map-panel">
        <div id="map" className={activeClass}>
          <Map
            posts={posts}
            timeline={timeline}
            active={this.state.active}
            onClick={(id) => {
              this.setState({ active: id });
              const selector = `.map-post[data-post-id="${id}"]`;
              document.querySelector(selector).scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }}
          />
        </div>
        <div id="post-photo-scroller" className={activeClass}>
          {photoScroller}
        </div>
        <div id="posts" className={activeClass}>
          {scroller}
        </div>
      </div>
    );
  }
}

export default MapPanel;
