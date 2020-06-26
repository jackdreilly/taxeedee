import React from "react";
import "whatwg-fetch";
import { firestore } from "./App";
import Comments from "./Comments";

function guestbookRef() {
  return firestore.doc("posts/SLPrbv0t7sFAVYkmlEd7");
}

class Guestbook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      comments: [],
    };
    this.setup();
  }

  async setup() {
    firestore
      .collection("comments")
      .where("post", "==", guestbookRef())
      .onSnapshot((s) => {
        const comments = s.docs.map((d) => d.data());
        comments.sort((a, b) => a.date > b.date);
        this.setState({ comments });
      });
  }

  render() {
    return (
      <div id="stream">
        <div className="post">
          <div className="post-header">
            <h2 className="title-text">Guestbook</h2>
          </div>
          <div className="img">
            <img
              alt="guestbook with mail flying"
              className="square-image"
              src="/images/guestbook.png"
            />
            <p className="text">
              Please leave us a note! It will make our day :)
            </p>
          </div>
          <Comments
            numShow={5}
            comments={this.state.comments}
            name={this.props.name}
            showBanner={false}
            onSubmit={(data) => {
              firestore.collection("comments").add({
                date: new Date(),
                name: data.name,
                comment: data.comment,
                post: guestbookRef(),
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default Guestbook;
