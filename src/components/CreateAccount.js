import React, { useEffect, useState } from "react";
import "../styles/CreateAccount.css";
import TextInput from "../reusable/TextInput";
import RadioButtons from "../reusable/RadioButtons";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";
import { Navigate } from "react-router-dom";

const CreateAccount = () => {
  const [ accountType, setAccountType ] = useState("mentor");
  const [ name, setName ] = useState("");
  const [ uscID, setUscID ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ major, setMajor ] = useState("");

  const [ errorInputMissing, setErrorInputMissing ] = useState(false);
  const [ errorUscID, setErrorUscID ] = useState(false);
  const [ errorEmailFormat, setErrorEmailFormat ] = useState(false);
  const [ errorPhoneFormat, setErrorPhoneFormat ] = useState(false);

  const [ mentorCreationSuccess, setMentorCreationSuccess ] = useState(false);
  const [ adminCreationSuccess, setAdminCreationSuccess ] = useState(false);
  const [ creationSuccess, setCreationSuccess ] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

  // ERROR CHECKING
    if (accountType === "mentor") {
      if (name === "" || uscID === "" || email === "" || phoneNumber === "" || major === "") {
        setErrorInputMissing(true);
      }
      else {
        setErrorInputMissing(false);
      }

      if (!(/^[0-9]+$/).test(uscID) || uscID.length !== 10 || uscID[0] === "0") {
        setErrorUscID(true);
      }
      else {
        setErrorUscID(false);
      }

      if (email.indexOf("@usc.edu") === -1) {
        setErrorEmailFormat(true);
      }
      else {
        setErrorEmailFormat(false);
      }

      if (!(/^[0-9]+$/).test(phoneNumber) || phoneNumber.length !== 10 || phoneNumber[0] === "0") {
        setErrorPhoneFormat(true);
      }
      else {
        setErrorPhoneFormat(false);
      }
    }
    else if (accountType === "admin") {
      if (name === "" || email === "") {
        setErrorInputMissing(true);
      }
      else {
        setErrorInputMissing(false);
      }

      if (email.indexOf("@usc.edu") === -1) {
        setErrorEmailFormat(true);
      }
      else {
        setErrorEmailFormat(false);
      }

      setErrorUscID(false);
      setErrorPhoneFormat(false);
    }

    if (!(errorInputMissing || errorUscID || errorEmailFormat || errorPhoneFormat)) {
      // Add user to db
      if (accountType === "mentor") {
        fetch(`https://progress-reports-portal-node.herokuapp.com/add_mentor` + 
          `?name=${encodeURIComponent(name)}&usc_id=${uscID}&email=${email}&phone_number=${phoneNumber}&major=${encodeURIComponent(major)}`).then((response) => {
          return response.json();
        }).then((data) => {
          if (data.filter(user => (user.name === `${name}` && user.usc_id === `${uscID}` 
            && user.email === `${email}` && user.phone_number === `${phoneNumber}` 
            && user.major === `${major}`)).length > 0) {
            setMentorCreationSuccess(true);
          }
        });
      }
      else if (accountType === "admin") {
        fetch(`https://progress-reports-portal-node.herokuapp.com/add_admin` + 
          `?name=${name}&email=${email}`).then((response) => {
          return response.json();
        }).then((data) => {
          if (data.filter(user => (user.name === `${name}` && user.email === `${email}`).length > 0)) {
            setAdminCreationSuccess(true);
          }
        });
      }
    }
  }

  useEffect((accountType, name, uscID, email, phoneNumber, major) => {
    let errorText = "Error(s): <ul>";
    if(errorInputMissing) {
      errorText += "<li>Please input all fields.</li>"
    }
    if(errorUscID) {
      errorText += "<li>Please ensure USC ID # is valid.</li>";
    }
    if(errorEmailFormat) {
      errorText += "<li>Please ensure email address is a valid USC account.</li>";
    }
    if(errorPhoneFormat) {
      errorText += "<li>Please ensure phone number is a valid US (+1) number.</li>";
    }

    if (errorInputMissing || errorUscID || errorEmailFormat || errorPhoneFormat) {
      errorText += "</ul>";
    }
    else {
      errorText = "";
    }
    $("#error-div-admin").html(errorText);
    $("#error-div-mentor").html(errorText);
  }, [errorInputMissing, errorUscID, errorEmailFormat, errorPhoneFormat]);

  useEffect(() => {
    if (mentorCreationSuccess || adminCreationSuccess) {
      setCreationSuccess(true);
    }
  }, [mentorCreationSuccess, adminCreationSuccess]);

  return creationSuccess ?
  (<Navigate to="/admin-portal/manage-accounts" />)
  :
  (accountType === "mentor") ?
  (
    <div>
      <div className="create-account-header">
        <h1>Create Account</h1>
      </div>
      <div className="container">
        <form className="create-account-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <p><strong>Account Type:</strong></p>
            <RadioButtons
              name="account-type"
              options={[
                { value: "mentor", label: "Mentor" },
                { value: "admin", label: "Admin" },
              ]}
              value={accountType}
              onChange={(updatedAccountType) => {
                $("#error-div-mentor").html("");
                $("#error-div-admin").html("");
                setErrorInputMissing(false);
                setErrorUscID(false);
                setErrorEmailFormat(false);
                setErrorPhoneFormat(false);
                setAccountType(updatedAccountType);
              }}
            />
          </div>
          <div className="my-3">
            <strong><TextInput label="Name:" id="name-mentor" value={name} type="text" onChange={(updatedName) => {
              setName(updatedName);
            }}/></strong>
          </div>
          <div className="my-3">
            <strong><TextInput label="USC ID #:" id="usc-id-mentor" value={uscID} type="number" onChange={(updatedUscID) => {
              setUscID(updatedUscID);
            }}/></strong>
          </div>
          <div className="my-3">
            <strong><TextInput label="Email:" id="email-mentor" value={email} type="email" onChange={(updatedEmail) => {
              setEmail(updatedEmail);
            }}/></strong>
          </div>
          <div className="my-3">
            <strong><TextInput label="Phone Number:" id="phone-number-mentor" type="tel" value={phoneNumber} onChange={(updatedPhoneNumber) => {
              setPhoneNumber(updatedPhoneNumber);
            }}/></strong>
          </div>
          <div className="my-3">
            <strong><TextInput label="Major:" id="major-mentor" value={major} type="text" onChange={(updatedMajor) => {
              setMajor(updatedMajor);
            }}/></strong>
          </div>
          <button type="submit" id="submit-btn" className="btn">
            Submit
          </button>
          <div className="my-3 text-danger" id="error-div-mentor"></div>
        </form>
      </div>
    </div>
  )
  :
  (
    <div>
      <div className="create-account-header">
        <h1>Create Account</h1>
      </div>
      <div className="container">
        <form className="create-account-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <p><strong>Account Type:</strong></p>
            <RadioButtons
              name="account-type"
              options={[
                { value: "mentor", label: "Mentor" },
                { value: "admin", label: "Admin" },
              ]}
              value={accountType}
              onChange={(updatedAccountType) => {
                $("#error-div-mentor").html("");
                $("#error-div-admin").html("");
                setErrorInputMissing(false);
                setErrorUscID(false);
                setErrorEmailFormat(false);
                setErrorPhoneFormat(false);
                setAccountType(updatedAccountType);
              }}
            />
          </div>
          <div className="my-3">
            <strong><TextInput label="Name:" id="name-admin" value={name} type="text" onChange={(updatedName) => {
              setName(updatedName);
            }}/></strong>
          </div>
          <div className="my-3">
            <strong><TextInput label="Email:" id="email-admin" value={email} type="email" onChange={(updatedEmail) => {
              setEmail(updatedEmail);
            }}/></strong>
          </div>
          <button type="submit" id="submit-btn" className="btn">
            Submit
          </button>
        <div className="my-3 text-danger" id="error-div-admin"></div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
