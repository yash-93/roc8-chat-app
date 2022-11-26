import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import Input from "../Shared/Input";
import Button from "../Shared/Button";
import LoadingSpinner from "../Shared/LoadingSpinner";
import "./Home.css";

const Home = () => {
  const [loginForm, setLoginForm] = useState(false);
  const [signupForm, setSignupForm] = useState(false);
  const [displayText, setDisplayText] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (loginForm) {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData);
        setIsLoading(false);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            userId: responseData.id,
            token: responseData.token,
            friends: responseData.friends,
            username: responseData.username,
          })
        );
        window.location.replace(`/${responseData.id}`);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err.message || "Something went wrong.");
      }
    } else if (signupForm) {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/users/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            email: email,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err.message || "Something went wrong.");
      }
    }
  };

  const switchHandler = (event) => {
    if (loginForm) {
      setLoginForm(false);
      setSignupForm(true);
    } else {
      setSignupForm(false);
      setLoginForm(true);
    }
  };

  return (
    <React.Fragment>
      <NavLink to="/" id="logo">
        CHAT APP
      </NavLink>
      {isLoading && <LoadingSpinner asOverlay />}
      <form onSubmit={submitHandler} id="login-form">
        {(loginForm || signupForm) && (
          <React.Fragment>
            <Input
              type="text"
              placeholder="Username"
              onChange={(event) => setUsername(event.target.value)}
            />
            <br></br>
            <br></br>
          </React.Fragment>
        )}
        {(loginForm || signupForm) && (
          <React.Fragment>
            <Input
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <br></br>
            <br></br>
          </React.Fragment>
        )}
        {signupForm && (
          <React.Fragment>
            <Input
              type="email"
              placeholder="E-mail"
              onChange={(event) => setEmail(event.target.value)}
            />
            <br></br>
            <br></br>
          </React.Fragment>
        )}
        {loginForm && <Button type="submit">LOG IN</Button>}
        {signupForm && <Button type="submit">SIGNUP</Button>}
      </form>

      {displayText && (
        <div id="home-text">
          <h1>WELCOME</h1>
          <p>Please Log In or Sign Up to continue</p>
          <br></br>
          <br></br>
          <i
            className="fas fa-arrow-right"
            id="fwd-icon"
            onClick={() => {
              setLoginForm(true);
              setDisplayText(false);
            }}
          ></i>
        </div>
      )}
      {!displayText && (
        <React.Fragment>
          <br></br>
          <Button onClick={switchHandler} id="switchBtn">
            SWITCH TO {loginForm ? "SIGNUP" : "LOGIN"}
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Home;
