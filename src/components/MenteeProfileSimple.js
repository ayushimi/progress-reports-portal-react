import "../styles/Profile.css";
import React, { useEffect, useState } from "react";
import closebtn from '../images/close-btn.png';
import $ from "jquery";

const MenteeProfileSimple = (props) => {
  const [ studentType, setStudentType ] = useState("");

  useEffect(() => {
    if (props.profile.freshman) {
      setStudentType("Freshman");
    }
    else {
      setStudentType("Transfer");
    }
  }, [props.profile]);

  return (
    <div className="mentee-profile-simple-popup">
      <img 
        className="close-btn-simple"
        src={closebtn}
        alt="Close"
        width="40px"
        onClick={() => {
          $(".mentee-profile-simple-popup").css("display", "none");
          $(".blur").css("filter", "blur(0px)");
        }}
        />
      <h1 className="profile-name mb-0">{props.profile.name}</h1>
      <div className="container mt-0 pt-0 pb-1">
        <div className="row">
          <div className="profile-content-left col-6 text-center">
            <p className="profile-content"><strong>USC ID:</strong> #{props.profile.usc_id}</p>
            <p className="profile-content"><strong>Email:</strong> {props.profile.email}</p>
            <p className="profile-content"><strong>Phone:</strong> {props.profile.phone_number}</p>
          </div>
          <div className="profile-content-right col-6 text-center">
            <p className="profile-content"><strong>Major:</strong> {props.profile.major}</p>
            <p className="profile-content"><strong>Semester Entered:</strong> {props.profile.semester_entered}</p>
            <p className="profile-content"><strong>Student:</strong> {studentType}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfileSimple;