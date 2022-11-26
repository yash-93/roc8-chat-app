import React from "react";

import "./Input.css";

const Input = (props) => {
  return (
    <React.Fragment>
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </React.Fragment>
  );
};

export default Input;
