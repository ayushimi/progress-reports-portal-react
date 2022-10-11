import "../styles/Profile.css";
import React from "react";
import closebtn from '../images/close-btn.png';
import { DataGrid } from "@mui/x-data-grid";
import $ from "jquery";

const columns = [
  { field: "date",
    headerName: "Session Date",
    flex: 1,
    align: "left",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "report",
    headerName: "Report Title",
    flex: 1,
    align: "left",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "status",
    headerName: "Status",
    flex: 1,
    align: "right",
    headerAlign: "center",
    headerClassName: "table-header"
  }
];

const rows = [
  {
    id: 1,
    date: "09/03/2022",
    report: "Introductory Meeting",
    status: "Approved",
  },
  {
    id: 2,
    date: "09/06/2022",
    report: "Mentorship Goals",
    status: "Pending",
  },
  {
    id: 3,
    date: "09/08/2022",
    report: "Extracurricular Discussion",
    status: "Pending",
  },
];

const MenteeProfile = () => {
  return (
  <div className="mentee-profile-popup">
    <img 
      className="close-btn"
      src={closebtn}
      alt="Close"
      width="40px"
      onClick={() => {
        $(".mentee-profile-popup").css("display", "none");
        $(".blur").css("filter", "blur(0px)");
      }}
      />
    <h1 className="profile-name">Ayushi Mittal</h1>
    <div className="container">
      <div className="row">
        <div className="profile-content-left col-6 text-center">
          <p className="profile-content">USC ID: #7398204829</p>
          <p className="profile-content">Email: ayushimi@usc.edu</p>
          <p className="profile-content">Phone: 293-282-2831</p>
        </div>
        <div className="profile-content-right col-6 text-center">
          <p className="profile-content">Major: Computer Engineering & Computer Science</p>
          <p className="profile-content">Semester Entered: Fall 2019</p>
          <p className="profile-content">Student: Transfer</p>
        </div>
      </div>
    </div>
    <div className="progress-report-list">
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

export default MenteeProfile;