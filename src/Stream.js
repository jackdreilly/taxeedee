import React from "react";
import { combineLatest, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { firestore } from "./App";
import Post from "./Post";
import Search from "./Search";

class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.posts === undefined ? [] : props.posts,
      name: undefined,
    };
    if (this.props.posts === undefined) {
      this.fetchPosts();
    }
  }

  async fetchPosts() {
    const posts = Observable.create((observer) =>
      firestore
        .collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot(observer)
    );
    const comments = Observable.create((observer) =>
      firestore
        .collection("comments")
        .orderBy("date", "desc")
        .onSnapshot(observer)
    ).pipe(
      map((s) => s.docs.map((d) => d.data())),
      startWith([])
    );
    const stars = Observable.create((observer) =>
      firestore.collection("stars").onSnapshot(observer)
    ).pipe(
      map((s) => s.docs.map((d) => d.data())),
      startWith([])
    );
    combineLatest(posts, comments, stars).subscribe(([s, comments, stars]) => {
      const posts = s.docs;
      const m = new Map();
      posts.forEach((p) => m.set(p.ref.path, { ...p.data(), ref: p.ref }));
      Array.from(m.entries()).forEach(([k, v]) => (v.comments = []));
      Array.from(m.entries()).forEach(([k, v]) => (v.stars = []));
      comments.forEach((c) =>
        m.has(c.post.path) ? m.get(c.post.path).comments.push(c) : null
      );
      stars.forEach((c) =>
        m.has(c.post.path) ? m.get(c.post.path).stars.push(c) : null
      );
      let results = Array.from(m.values());
      results.sort((a, b) => a.timestamp > b.timestamp);
      if (this.props.post_id) {
        results = results.filter((d) => d.id === this.props.post_id);
      }
      this.setState({ posts: results });
    });
  }

  render() {
    if (this.state.posts.length === 0) {
      return <div className="loading">Loading Posts...</div>;
    }
    let search =
      this.props.post_id === undefined && !this.props.disableSearch ? (
        <Search
          posts={this.state.posts}
          onSelect={(post) => {
            this.props.history.push("/post/" + post.key);
          }}
        />
      ) : null;
    const posts = this.state.posts.map((post, i) => {
      const link = post.id === undefined ? undefined : `/post/${post.id}`;
      return (
        <Post
          post={post}
          name={this.state.name}
          link={link}
          key={post.id}
          enableComments={this.props.enableComments}
          enableStars={this.props.enableStars}
          expanded={this.props.expanded}
        />
      );
    });
    return (
      <div id="stream">
        {search}
        {posts}
      </div>
    );
  }
}

export default Stream;
