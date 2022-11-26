import React from "react";

import "./Button.css";

const Button = (props) => {
  return (
    <button
      type={props.type}
      onSubmit={props.onSubmit}
      onClick={props.onClick}
      id={props.id}
    >
      {props.children}
    </button>
  );
};

export default Button;
