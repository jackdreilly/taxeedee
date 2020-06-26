import React from "react";
import sendMetric from "./Metrics";
import Paragraph from "./Paragraph";
import Photo from "./Photo";
import Video from "./Video";

function parseNode(post, node) {
  if (node.video) {
    return <Video url={node.video.url} />;
  }
  if (node.photo) {
    return (
      <Photo
        url={node.photo.url}
        title={node.photo.title}
        onClick={() => {
          sendMetric("photo_clicked", {
            post_id: post.id,
            photo: node.photo.url,
          });
        }}
      />
    );
  }
  return <Paragraph text={node.paragraph.text} />;
}

function ToNode(post, node, i) {
  return (
    <span className="node" key={i}>
      {parseNode(post, node)}
    </span>
  );
}

function Content(props) {
  const isExpanded = props.expanded;
  const allNodes = props.post.structured_content.nodes;
  const nodes = isExpanded ? allNodes : allNodes.slice(0, 1);
  return (
    <span className="content">
      {nodes.map((node, i) => ToNode(props.post, node, i))}
    </span>
  );
}

export default Content;
