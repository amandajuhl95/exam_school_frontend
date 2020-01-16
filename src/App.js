import React, { useState } from "react";
import "./App.css";
import Login from "./login";
import Welcome from "./Welcome";
import Course from "./Components/Course";
import Teacher from "./Components/Teacher";
import Student from "./Components/Student";
import facade from "./apiFacade";
import Admin from "./admin";
import User from "./user";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";

function App(props) {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("jwtToken") !== null ? true : false
  );

  const allowed = role => {
    if (!loggedIn) return false;
    return facade.getTokenInfo().roles.includes(role);
  };

  return (
    <div className="App">
      <Router>
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Switch>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route path="/Course">
            <Course courses={props.courses} />
          </Route>
          <Route path="/Teacher">
            <Teacher teachers={props.teachers} />
          </Route>
          <Route path="/Student">
            <Student students={props.students} />
          </Route>
          <Route path="/login">
            <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          </Route>
          <Route path="/admin">
            {allowed("admin") ? (
              <Admin />
            ) : (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            )}
          </Route>
          <Route path="/user">
            {allowed("user") ? (
              <User />
            ) : (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            )}
          </Route>
        </Switch>
      </Router>
      <div>{}</div>
    </div>
  );
}

const Header = ({ loggedIn, setLoggedIn }) => {
  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  };

  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Welcome
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/course">
          School courses
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/teacher">
          Teacher
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/student">
          Student
        </NavLink>
      </li>
      <li>
        <NavLink onClick={logout} activeClassName="active" to="/login">
          <LoggedInOrOut loggedIn={loggedIn} />
        </NavLink>
      </li>
      <ShowInfoRole loggedIn={loggedIn} />

      <li className="username">
        <UserHeaders loggedIn={loggedIn} />
      </li>
    </ul>
  );
};

const UserHeaders = ({ loggedIn }) => {
  return loggedIn ? (
    <p>
      {facade.getTokenInfo().username}, is loggedin as{" "}
      {facade.getTokenInfo().roles}
    </p>
  ) : (
    ""
  );
};

function LoggedInOrOut({ loggedIn }) {
  return loggedIn ? "Logout" : "Login";
}

function ShowInfoRole({ loggedIn }) {
  if (!loggedIn) {
    return "";
  }

  const isUser = facade.getTokenInfo().roles.includes("user");
  const isAdmin = facade.getTokenInfo().roles.includes("admin");

  return (
    <div>
      {isUser && (
        <li>
          <NavLink activeClassName="active" to="/user">
            User info
          </NavLink>
        </li>
      )}

      {isAdmin && (
        <li>
          <NavLink activeClassName="active" to="/admin">
            Admin info
          </NavLink>
        </li>
      )}
    </div>
  );
}

export default App;
