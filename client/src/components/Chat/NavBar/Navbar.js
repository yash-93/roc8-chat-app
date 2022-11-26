import React, { useContext, useEffect, useState } from "react";

// import profile from "../../../images/profile.png";
import "./Navbar.css";
import { AuthContext } from "../../Shared/Context/auth-context";

const Navbar = (props) => {
  const [username, setUserName] = useState();

  const handleSlider = () => {
    props.handleSlider();
  };

  const auth = useContext(AuthContext);
  const logoutHandler = (event) => {
    auth.logout();
    // history.push("/");
    window.location.replace("/");
  };
  let user;
  useEffect(() => {
    user = JSON.parse(localStorage.getItem("userData"));
    setUserName(user.username);
  }, []);

  return (
    <div id="navbar">
      <ul>
        <li>
          <a href="/">CHAT APP</a>
        </li>

        <li style={{ float: "right" }}>
          <a onClick={logoutHandler} href="!">
            LOGOUT
          </a>
        </li>
        <li style={{ float: "right" }}>
          <a href="#username">{username}</a>
        </li>
        {/* <li style={{ float: "right" }} onClick={handleSlider}>
          <a href="#search">
            <i className="fas fa-search" style={{ color: "white" }}></i>
          </a>
        </li> */}
        {/* <li style={{ float: "right" }}>
          <a>
            <img className="profile-pic1" src={profile} alt="pic" />
          </a>
        </li> */}
      </ul>
    </div>
  );
};

export default Navbar;
