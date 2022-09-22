import { useState, useEffect } from 'react';
import './App.css';

function App() {

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
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );
  }, []);

  return loginSuccess ? 
  (
    <div className="App">
      <div>Logged in!</div>
    </div>
  )
  :
  (
    <div className="App">
      <div id="signInDiv"></div>
    </div>
  );
}

export default App;
