import React from "react";
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import "../styles/Login.css";
  
const Login = () => {

  const [ loginSuccess, setLoginSuccess ] = useState(false);

  function handleCallbackResponse(response) {
    console.log(response);
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

  return loginSuccess ? 
  (
    <Navigate to="/mentor-home"/>
  )
  :
  (
    <div className="Login" id="login-div">
      <h1>Center for Engineering Diversity</h1>
      <h3>Peer Mentor Portal</h3>
      <h5>Sign in:</h5>
      <div id="sign-in-div"></div>
    </div>
  );
};
  
export default Login;