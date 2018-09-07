import React from 'react';
import Video from './Video';
import Photo from './Photo';
import Paragraph from './Paragraph';


function parseNode(node) {
  if (node.video) {
    return (
      <Video url={node.video.url} />
      );
  }
  if (node.photo) {
    return (
      <Photo url={node.photo.url} title={node.photo.title}/>
      );
  }
  return (
    <Paragraph text={node.paragraph.text} />
    );
}

function ToNode(node, i) {
  return (<span className="node" key={i}>
  {parseNode(node)}
  </span>);
}

function Content(props) {
  const isExpanded = props.expanded;
  const allNodes = props.post.structuredContent.nodes;
  const nodes = isExpanded ? allNodes : allNodes.slice(0,1);
  return (<span className="content">{nodes.map(ToNode)}</span>);
}

export default Content;