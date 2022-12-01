import "../styles/Profile.css";
import React from "react";
import closebtn from '../images/close-btn.png';
import { useState, useEffect } from "react";

const Profile = () => {
  let id = 2;
  let role = "administrator";
  const [profile, setProfile] = useState("");

  useEffect(() => {
    console.log(id)
      fetch(`https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${id}&role=${role}`)
        .then((response) => {
          return response.json();
        }).then((data) => {
            console.log(data)
            setProfile(data);
        });
  }, [id]);



  return (
    <div className="admin-profile-popup">
      <img 
        className="close-btn"
        src={closebtn}
        alt="Close"
        width="40px"
        onClick={() => {
          // Route back
        }}
        />
      <h1 className="profile-name">{profile.name}</h1>
      <div className="container">
        <div className="row">
          <div className="text-center">
            <p className="profile-content"><strong>Email:</strong> {profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;