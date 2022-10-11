import "../styles/Profile.css";
import React from "react";
import closebtn from '../images/close-btn.png';
import { DataGrid } from "@mui/x-data-grid";
import $ from "jquery";

const columns = [
  { field: "name",
    headerName: "Mentee Name",
    flex: 1,
    align: "left",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "email",
    headerName: "Email",
    flex: 1,
    align: "left",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "meetings",
    headerName: "# of Meetings",
    flex: 1,
    align: "left",
    headerAlign: "center",
    headerClassName: "table-header"
  }
];

const rows = [
  {
    id: 1,
    name: "Ayushi Mittal",
    email: "ayushimi@usc.edu",
    meetings: "2",
  },
  {
    id: 2,
    name: "Becca Finkel",
    email: "bfinkel@usc.edu",
    meetings: "1",
  },
];

const MentorProfile = () => {
  return (
  <div className="mentor-profile-popup">
    <img 
      className="close-btn"
      src={closebtn}
      alt="Close"
      width="40px"
      onClick={() => {
        $(".mentor-profile-popup").css("display", "none");
        $(".blur").css("filter", "blur(0px)");
      }}
      />
    <h1 className="profile-name">Chloe Kuo</h1>
    <div className="container">
      <div className="row">
        <div className="profile-content-left col-6 text-center">
          <p className="profile-content">USC ID: #4398427495</p>
          <p className="profile-content">Email: cmkuo@usc.edu</p>
        </div>
        <div className="profile-content-right col-6 text-center">
          <p className="profile-content">Phone: 293-282-2831</p>
          <p className="profile-content">Major: Computer Science</p>
        </div>
      </div>
    </div>
    <div className="mentees-list">
      <div id="accounts-grid" style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </div>
    </div>
  );
};

export default MentorProfile;