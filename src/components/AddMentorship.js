import React, { useEffect, useState } from "react";
import "../styles/AddMentorship.css";
import TextInput from "../reusable/TextInput";
import RadioButtons from "../reusable/RadioButtons";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";
import { Navigate } from "react-router-dom";
import Select from "react-select";

const AddMentorship = () => {
  const [accountType, setAccountType] = useState("mentor");
  const [name, setName] = useState("");
  const [uscID, setUscID] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [major, setMajor] = useState("");
  const [mentorAssigned, setMentorAssigned] = useState("");
  const [isFreshman, setIsFreshman] = useState(true);
  const [semesterSeasonEntered, setSemesterSeasonEntered] = useState("");
  const [semesterYearEntered, setSemesterYearEntered] = useState("");

  const [errorInputMissing, setErrorInputMissing] = useState(false);
  const [errorUscID, setErrorUscID] = useState(false);
  const [errorEmailFormat, setErrorEmailFormat] = useState(false);
  const [errorPhoneFormat, setErrorPhoneFormat] = useState(false);
  const [errorIsFreshman, setErrorIsFreshman] = useState(false);
  const [errorSemesterEntered, setErrorSemesterEntered] = useState(false);

  const [menteeCreationSuccess, setMenteeCreationSuccess] = useState(false);
  const [adminCreationSuccess, setAdminCreationSuccess] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const [myOptions, setMyOptions] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();

    // ERROR CHECKING
    if (mentorAssigned === "" || mentorAssigned === null) {
      setErrorInputMissing(true);
    } else {
      setErrorInputMissing(false);
    }

    if (!/^[0-9]+$/.test(uscID) || uscID.length !== 10 || uscID[0] === "0") {
      setErrorUscID(true);
    } else {
      setErrorUscID(false);
    }

    if (email.indexOf("@usc.edu") === -1) {
      setErrorEmailFormat(true);
    } else {
      setErrorEmailFormat(false);
    }

    if (
      !/^[0-9]+$/.test(phoneNumber) ||
      phoneNumber.length !== 10 ||
      phoneNumber[0] === "0"
    ) {
      setErrorPhoneFormat(true);
    } else {
      setErrorPhoneFormat(false);
    }

    if (
      !(errorInputMissing || errorUscID || errorEmailFormat || errorPhoneFormat)
    ) {
      // Add mentee to db
      fetch(
        `https://progress-reports-portal-node.herokuapp.com/add_mentee` +
          `?name=${name}&usc_id=${uscID}&email=${email}&phone_number=${phoneNumber}&major=${major}&freshman=${isFreshman}&semester_entered=${semesterSeasonEntered}_${semesterYearEntered}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (
            data.filter(
              (user) =>
                user.name === `${name}` &&
                user.usc_id === `${uscID}` &&
                user.email === `${email}` &&
                user.phone_number === `${phoneNumber}` &&
                user.major === `${major}`
            ).length > 0
          ) {
            console.log(data[data.length - 1].id);
            const newMenteeId = data[data.length - 1].id;
            fetch(
              `https://progress-reports-portal-node.herokuapp.com/add_mentorship?mentee_id=${newMenteeId}&mentor_id=${mentorAssigned}`
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                console.log("completed");
              });
            // setMenteeCreationSuccess(true);
          }
        });
    }
  }

  useEffect(
    (accountType, name, uscID, email, phoneNumber, major) => {
      let errorText = "Error(s): <ul>";
      if (errorInputMissing) {
        errorText += "<li>Please input all fields.</li>";
      }
      if (errorUscID) {
        errorText += "<li>Please ensure USC ID # is valid.</li>";
      }
      if (errorEmailFormat) {
        errorText +=
          "<li>Please ensure email address is a valid USC account.</li>";
      }
      if (errorPhoneFormat) {
        errorText +=
          "<li>Please ensure phone number is a valid US (+1) number.</li>";
      }

      if (
        errorInputMissing ||
        errorUscID ||
        errorEmailFormat ||
        errorPhoneFormat
      ) {
        errorText += "</ul>";
      } else {
        errorText = "";
      }
      $("#error-div-admin").html(errorText);
      $("#error-div-mentor").html(errorText);
    },
    [errorInputMissing, errorUscID, errorEmailFormat, errorPhoneFormat]
  );

  useEffect(() => {
    if (menteeCreationSuccess) {
      setCreationSuccess(true);
    }
  }, [menteeCreationSuccess]);

  useEffect(() => {
    fetch(
      `https://progress-reports-portal-node.herokuapp.com/get_active_mentors`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const formattedData = data.map((opt) => ({
          label: opt.name,
          value: opt.mentor_id
        }));
        setMyOptions(formattedData);
      });
  }, []);

  return creationSuccess ? (
    <Navigate to="/admin-portal/manage-accounts" />
  ) : (
    <div>
      <div className="add-mentorship-header">
        <h1>Add Mentorship</h1>
      </div>
      <div className="container">
        <form className="add-mentorship-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <p className="question-title">Assign Mentor:</p>
            <Select
              options={myOptions}
              onChange={(opt) => setMentorAssigned(opt.value)}
            />
          </div>
          <div className="my-3">
            <TextInput
              label="Mentee Name:"
              id="name-mentee"
              value={name}
              type="text"
              onChange={(updatedName) => {
                setName(updatedName);
              }}
            />
          </div>
          <div className="my-3">
            <TextInput
              label="USC ID #:"
              id="usc-id-mentee"
              value={uscID}
              type="number"
              onChange={(updatedUscID) => {
                setUscID(updatedUscID);
              }}
            />
          </div>
          <div className="my-3">
            <TextInput
              label="Email:"
              id="email-mentee"
              value={email}
              type="email"
              onChange={(updatedEmail) => {
                setEmail(updatedEmail);
              }}
            />
          </div>
          <div className="my-3">
            <TextInput
              label="Phone Number:"
              id="phone-number-mentee"
              type="tel"
              value={phoneNumber}
              onChange={(updatedPhoneNumber) => {
                setPhoneNumber(updatedPhoneNumber);
              }}
            />
          </div>
          <div className="my-3">
            <TextInput
              label="Major:"
              id="major-mentee"
              value={major}
              type="text"
              onChange={(updatedMajor) => {
                setMajor(updatedMajor);
              }}
            />
          </div>
          <div className="mb-3">
            <p className="question-title">Status:</p>
            <RadioButtons
              name="status"
              options={[
                { value: "freshman", label: "Freshman" },
                { value: "transfer", label: "Transfer" }
              ]}
              value={isFreshman ? "freshman" : "transfer"}
              onChange={(status) => {
                if (status === "freshman") {
                  setIsFreshman(true);
                } else {
                  setIsFreshman(false);
                }
              }}
            />
          </div>
          <div className="mb-3">
            <p className="question-title">Semester Entered:</p>
            <RadioButtons
              name="semester-season-entered"
              options={[
                { value: "Fall", label: "Fall" },
                { value: "Spring", label: "Spring" }
              ]}
              value={semesterSeasonEntered}
              onChange={(season) => {
                setSemesterSeasonEntered(season);
              }}
            />
            <TextInput
              label="Year:"
              id="semester-year-entered"
              type="text"
              onChange={(year) => {
                setSemesterYearEntered(year);
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <div className="my-3 text-danger" id="error-div-mentee"></div>
        </form>
      </div>
    </div>
  );
};

export default AddMentorship;
