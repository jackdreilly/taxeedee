import React from 'react';

function Humburger(props) {
  return (
    <div id="humburger" onClick={props.onClick}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>    
    );
}

export default Humburger;