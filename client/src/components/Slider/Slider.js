import React, { useState, useEffect } from "react";

import User from "./User";
import "./Slider.css";

const Slider = (props) => {
  const [showSlider, setShowSlider] = useState(props.showSlider);
  const [users, setUsers] = useState();
  let me;
  let allUsers;

  const checkUser = (user) => {
    return user.username !== me.username;
  };

  const getUsers = async () => {
    try {
      allUsers = await fetch(`${process.env.REACT_APP_DOMAIN}/api/users`);
      const responseData = await allUsers.json();
      let temp = responseData.filter(checkUser);
      setUsers(temp);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    me = JSON.parse(localStorage.getItem("userData"));
    console.log(me.username); //
    getUsers();
  }, []);

  const handleSlider = () => {
    props.handleSlider();
  };

  return (
    <div id="slider" className={showSlider && "slide-in"}>
      <div id="slider_header">
        <h3>Add Friends</h3>
        <div id="close_slider">
          <i className="fas fa-times fa-2x" onClick={handleSlider}></i>
        </div>
      </div>
      <hr></hr>
      {users &&
        users.map((u) => (
          <React.Fragment key={u._id}>
            <User id={u.id} uname={u.username} />
            <div id="hr"></div>
          </React.Fragment>
        ))}
    </div>
  );
};
export default Slider;
