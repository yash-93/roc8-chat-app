import React from "react";

import profile from "../../../images/profile.png";
import "./Friend.css";

const Friend = (props) => {
  return (
    <div>
      <div className="friend-container">
        <img className="profile-pic" src={profile} alt="pic" />
        <label
          className="username"
          onClick={() =>
            props.messageSectionHandler(`${props.username}`, `${props.id}`)
          }
        >
          {props.username}
        </label>
      </div>
      <br></br>
    </div>
  );
};

export default Friend;
