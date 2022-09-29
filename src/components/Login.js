import React from "react";
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import "../styles/Login.css";
import Header from "./Header";
  
const Login = () => {

  const [ loginSuccess, setLoginSuccess ] = useState(false);
  const [ useAdmin, setUseAdmin ] = useState(false);

  function handleCallbackResponse(response) {
    console.log(response);
    if (response.credential.split('.')[0] === "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJhMDc5YjQyMDI2NDFlNTRhYmNlZDhmYjEzNTRjZTAzOTE5ZmIyOTQiLCJ0eXAiOiJKV1QifQ") {  
      setUseAdmin(false);
    }
    setLoginSuccess(true);
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

  return !loginSuccess ? 
  (
    <div className="Login">
      <Header />
      <div id="login-div">
        <h1>Login</h1>
        <div id="sign-in-div"></div>
        <button type="button">Request Account</button>
      </div>
    </div>
  )
  :
  useAdmin ?
  (<Navigate to="/admin-home"/>) : (<Navigate to="/mentor-home"/>)
  ;
};
  
export default Login;