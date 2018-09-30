import React from 'react';
import 'whatwg-fetch';
import Post from './Post';

class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {posts: (props.posts === undefined ? [] : props.posts), name: undefined};
    fetch('/myname').then(response => response.json()).then(response => this.setState({name: response.name}));
    if (this.props.posts === undefined) {
      this.fetchPosts();
    }
  }

  fetchPosts() {
      const url = this.props.post_id === undefined ? '/posts' : `/posts?id=${this.props.post_id}`;
      fetch(url).then(response => response.json()).then(response => {
        const posts = response.posts.slice();
        posts.sort((a,b) => {return a.timestamp > b.timestamp ? -1 : 1});
        this.setState({posts: posts})
      });    
  }

  render() {
    if (this.state.posts.length === 0) {
      return (<div className="loading">Loading Posts...</div>);
    }
    const posts = this.state.posts.map((post, i)=> {
      return (
        <Post
          post={post}
          name={this.state.name}
          link={`/post/${post.id}`}
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

export default Stream;
