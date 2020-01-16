import URL from "./Settings";

const url = URL; //CHANGE WHEN PUT UP

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  /* Insert utility-methods from a latter step (d) here (REMEMBER to uncomment in the returned object when you do)*/

  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const getTokenInfo = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData;
  };

  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });
    return fetch(url + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };
  const fetchData = role => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(url + "/api/info/" + role, options).then(handleHttpErrors);
  };
  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };

  async function getCourses() {
    const data = await fetch(url + "generel/courselist").then(handleHttpErrors);
    return data;
  }

  async function getTeacher(name) {
    const data = await fetch(url + "generel/teacher/" + name).then(
      handleHttpErrors
    );
    return data;
  }

  async function getStudent(name) {
    const data = await fetch(url + "generel/student/" + name).then(
      handleHttpErrors
    );
    return data;
  }

  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    getTokenInfo,
    getCourses,
    getTeacher,
    getStudent
  };
}
const facade = apiFacade();
export default facade;
