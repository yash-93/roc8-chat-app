import React, { useState } from "react";

import profile from "../../images/profile.png";
import "./User.css";

const User = (props) => {
  const [addUser, setAddUser] = useState(false);

  const handleSendRequest = () => {
    setAddUser(!addUser);
  };

  return (
    <div id="user_slider">
      <img
        id="profilepic_user_slider"
        className="profile-pic"
        src={profile}
        alt="pic"
      />
      <label id="username_user_slider">{props.uname}</label>

      {addUser ? (
        <i
          className="add_user_slider fas fa-check fa-2x"
          style={{ color: "green" }}
          onClick={handleSendRequest}
        ></i>
      ) : (
        <i
          className="add_user_slider fas fa-plus fa-2x"
          style={{ color: "grey" }}
          onClick={handleSendRequest}
        ></i>
      )}
    </div>
  );
};

export default User;
