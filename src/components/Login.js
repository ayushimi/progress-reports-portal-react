import $ from "jquery";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import "../styles/Login.css";
  
const Login = () => {

  const [ loginSuccess, setLoginSuccess ] = useState(false);
  const [ userIsAdmin, setUserIsAdmin ] = useState(false);
  const [ user, setUser ] = useState({
    email: ""
  });

  function handleCallbackResponse(response) {
    const userObj = jwt_decode(response.credential);
    setUser(userObj);
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
        client_id: "995337919354-dk9o64uqm1g3g5t5chjdtd674b7r0bal.apps.googleusercontent.com",
        callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("sign-in-div"),
        { theme: "outline", size: "large"}
    );
  }, []);

  useEffect(() => {
    if (user.email !== "") {
      fetch(`https://progress-reports-portal-node.herokuapp.com/get_user_roles?email=${user.email}`).then((response) => {
        return response.json();
      }).then((data) => {
        if(data.role === "administrator") {
          setUserIsAdmin(true);
          setLoginSuccess(true);
        }
        else if (data.role === "mentor") {
          setUserIsAdmin(false);
          setLoginSuccess(true);
        }
        else {
          setLoginSuccess(false);
          $("#login-error-div").css("display", "block");
        }
      });
    }
  }, [user]);

  return !loginSuccess ? 
  (
    <div className="Login">
      <div id="login-div">
        <h1 id="login-title">Login</h1>
        <div id="sign-in-div"></div>
        <div id="login-error-div">Account not found. Please request account below or contact CED for assistance.</div>
        <button type="button">Request Account</button>
      </div>
    </div>
  )
  :
  userIsAdmin ?
  (<Navigate to="/admin-portal/review-progress-reports"/>) : (<Navigate to="/mentor-portal"/>)
  ;
};
  
export default Login;