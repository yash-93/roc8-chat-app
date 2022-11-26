import React from "react";

import Friend from "./Friend";
import "./FriendList.css";

const FriendList = (props) => {
  return (
    <div id={props.id}>
      {props.friendList &&
        props.friendList.map((friend) => (
          <Friend
            key={friend.id}
            id={friend.id}
            username={friend.username}
            messageSectionHandler={props.messageSectionHandler}
          ></Friend>
        ))}
    </div>
  );
};

export default FriendList;
