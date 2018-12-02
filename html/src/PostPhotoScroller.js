import React from 'react';
import './PostPhotoScroller.css';
import HorizontalScroller from './HorizontalScroller';
import Photo from './Photo';

export default function PostPhotoScroller(props) {
  return <HorizontalScroller 
            items={
              props.post.structured_content.nodes
                .filter(node => node.photo)
                .map(node => {
                  const url = node.photo.url.replace(/w\d+$/, 'h200');
                  return <Photo key={url} url={url} title={node.photo.title} />;
                })}
          />;
}