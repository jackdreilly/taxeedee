import React from 'react';
import 'whatwg-fetch';
import Comments from './Comments';

class Guestbook extends React.Component {

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
        <img alt="guestbook with mail flying" className="square-image" src="/images/guestbook.png" />
        <p className='text'>Please leave us a note! It will make our day :)</p>
      </div>
      <Comments
        numShow={5}
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

export default Guestbook;