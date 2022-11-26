import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import { AuthContext } from "../src/components/Shared/Context/auth-context";
import "./App.css";

function App() {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();

  const login = useCallback((uid, token, friends) => {
    setToken(token);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token, storedData.friends);
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        login,
        logout,
      }}
    >
      <Router>
        <Switch>
          {!token && (
            <Route path="/" exact>
              <Home />
            </Route>
          )}
          <Redirect to={`/${userId}`} />
        </Switch>

        {token && (
          <Route path={`/${userId}`} exact>
            <Chat />
          </Route>
        )}
        <Redirect to="/" />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
