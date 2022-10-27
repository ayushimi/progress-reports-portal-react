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
  const [errorSemesterYearEntered, setErrorSemesterYearEntered] = useState(false);

  const [mentorshipCreationSuccess, setMentorshipCreationSuccess] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const [validationCompleted, setValidationCompleted] = useState(false);

  const [myOptions, setMyOptions] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();

    // ERROR CHECKING
    if (name === "" || uscID === "" || email === "" || phoneNumber === "" || major === "" || mentorAssigned === "" || isFreshman ==="" ||  semesterSeasonEntered === "" || semesterYearEntered === "") {
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

    if(!/^[0-9]+$/.test(semesterYearEntered) || semesterYearEntered.length !== 4) {
      setErrorSemesterYearEntered(true);
    } else {
      setErrorSemesterYearEntered(false);
    }

    setValidationCompleted(true);


  }

  useEffect(() => {
    if (validationCompleted) {
      if (
        !(errorInputMissing || errorUscID || errorEmailFormat || errorPhoneFormat ||  errorSemesterYearEntered)
      ) {
        // Add mentee to db
        fetch(
          `https://progress-reports-portal-node.herokuapp.com/add_mentee` +
            `?name=${encodeURIComponent(name)}&usc_id=${uscID}&email=${email}&phone_number=${phoneNumber}&major=${encodeURIComponent(major)}&freshman=${isFreshman}&semester_entered=${encodeURIComponent(semesterSeasonEntered)}_${encodeURIComponent(semesterYearEntered)}`
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
              const newMenteeId = data[data.length - 1].id;
              fetch(
                `https://progress-reports-portal-node.herokuapp.com/add_mentorship?mentee_id=${newMenteeId}&mentor_id=${mentorAssigned}`
              )
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  setMentorshipCreationSuccess(true);
                });
            }
          });
      }
    }
    setValidationCompleted(false);
  }, [validationCompleted]);

  useEffect(
    (name, uscID, email, phoneNumber, major) => {
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
      if (errorSemesterYearEntered) {
        errorText += "<li>Please ensure the entry year is a four digit number.</li>";
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
      $("#error-div-mentee").html(errorText);
    },
    [errorInputMissing, errorUscID, errorEmailFormat, errorPhoneFormat]
  );

  useEffect(() => {
    if (mentorshipCreationSuccess) {
      setCreationSuccess(true);
    }
  }, [mentorshipCreationSuccess]);

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
          value: opt.id
        }));
        setMyOptions(formattedData);
      });
  }, []);

  return creationSuccess ? (
    <Navigate to="/admin-portal/manage-mentorships" />
  ) : (
    <div>
      <div className="add-mentorship-header">
        <h1>Add Mentorship</h1>
      </div>
      <div className="container">
        <form className="add-mentorship-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <p className="mb-2 question-title"><strong>Assign Mentor:</strong></p>
            <Select
              options={myOptions}
              onChange={(opt) => setMentorAssigned(opt.value)}
            />
          </div>
          <div className="my-3">
            <strong><TextInput
              label="Mentee Name:"
              id="name-mentee"
              value={name}
              type="text"
              onChange={(updatedName) => {
                setName(updatedName);
              }}
            /></strong>
          </div>
          <div className="my-3">
            <strong><TextInput
              label="USC ID #:"
              id="usc-id-mentee"
              value={uscID}
              type="number"
              onChange={(updatedUscID) => {
                setUscID(updatedUscID);
              }}
            /></strong>
          </div>
          <div className="my-3">
            <strong><TextInput
              label="Email:"
              id="email-mentee"
              value={email}
              type="email"
              onChange={(updatedEmail) => {
                setEmail(updatedEmail);
              }}
            /></strong>
          </div>
          <div className="my-3">
            <strong><TextInput
              label="Phone Number:"
              id="phone-number-mentee"
              type="tel"
              value={phoneNumber}
              onChange={(updatedPhoneNumber) => {
                setPhoneNumber(updatedPhoneNumber);
              }}
            /></strong>
          </div>
          <div className="my-3">
            <strong><TextInput
              label="Major:"
              id="major-mentee"
              value={major}
              type="text"
              onChange={(updatedMajor) => {
                setMajor(updatedMajor);
              }}
            /></strong>
          </div>
          <div className="mb-3">
            <p className="mb-2 question-title"><strong>Status:</strong></p>
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
            <p className="mb-2 question-title"><strong>Semester Entered:</strong></p>
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
          </div>
          <div className="mb-3">
            <strong><TextInput
              label="Year:"
              id="semester-year-entered"
              type="text"
              onChange={(year) => {
                setSemesterYearEntered(year);
              }}
            /></strong>
          </div>
          <button type="submit" id="submit-btn" className="btn">
            Submit
          </button>
          <div className="my-3 text-danger" id="error-div-mentee"></div>
        </form>
      </div>
    </div>
  );
};

export default AddMentorship;
