import "../styles/Profile.css";
import React from "react";
import closebtn from '../images/close-btn.png';
import $ from "jquery";

const AdminProfile = (props) => {
  return (
    <div className="admin-profile-popup">
      <img 
        className="close-btn"
        src={closebtn}
        alt="Close"
        width="40px"
        onClick={() => {
          $(".admin-profile-popup").css("display", "none");
          $(".blur").css("filter", "blur(0px)");
        }}
        />
      <h1 className="profile-name">{props.profile.name}</h1>
      <div className="container">
        <div className="row">
          <div className="text-center">
            <p className="profile-content"><strong>Email:</strong> {props.profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;