import React from 'react';
import './HorizontalScroller.css';

export default function HorizontalScroller(props) {
  return (
    <div className="scroller">
      {props.items}
    </div>
  );
};