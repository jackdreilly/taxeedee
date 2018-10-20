import React from 'react';
import {Link} from "react-router-dom";

function Dropdown(props) {
  const display = props.active ? "block" : "none";
  const style = {
    display: display
  };
  return (
      <span id="dropdown" style={style} onClick={props.onClick}>
         <Link to="/">Home</Link><br />
         <Link to="/about">About Us</Link><br />
         <Link to="/guestbook">Guestbook</Link><br />
         <Link to="/map">Map</Link><br />
      </span> 
    );
}

export default Dropdown;