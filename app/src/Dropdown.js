import React from 'react';
import {Link} from "react-router-dom";

function Dropdown(props) {
  const display = props.active ? "block" : "none";
  const style = {
    display: display
  };
  function wrap(text) {
    return <div className="link-block">{text}</div>;
  }
  return (
      <span id="dropdown" style={style} onClick={props.onClick}>
         <Link to="/">{wrap("Home")}</Link>
         <Link to="/about">{wrap("About Us")}</Link>
         <Link to="/guestbook">{wrap("Guestbook")}</Link>
         <Link to="/map">{wrap("Mapeedee")}</Link>
      </span> 
    );
}

export default Dropdown;