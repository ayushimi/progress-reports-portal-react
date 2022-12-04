import "../styles/Profile.css";
import React, { useEffect, useState } from "react";
import closebtn from '../images/close-btn.png';
import { DataGrid } from "@mui/x-data-grid";
import $ from "jquery";
import { useNavigate, useParams } from "react-router-dom";

const columns = [
  {
    field: "session_date",
    headerName: "Session Date",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  {
    field: "name",
    headerName: "Report Title",
    flex: 4,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header",
  },
];

const MenteeProfile = (props) => {
  const navigate = useNavigate();
  const [ studentType, setStudentType ] = useState("");
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    let idCount = 1;

    if (props.profile.freshman) {
      setStudentType("Freshman");
    }
    else {
      setStudentType("Transfer");
    }

    if (props.mentor !== "") {
      fetch(`https://progress-reports-portal-node.herokuapp.com/find_progress_reports_by_id?mentor_id=${props.mentor}&mentee_id=${props.profile.id}`)
      .then((response) => {
        return response.json();
      }).then((data) => {
        const reports = data.map((row) => (
          {
            ...row,
            status: row.approved ? "Approved" : "Pending",
            session_date: row.session_date.substring(0, 10),
            id: idCount++,
            reportId: row.id,
          }
        ));
        setRows(reports);
      });
    }
  }, [props.mentor, props.profile]);

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
    <h1 className="profile-name">{props.profile.name}</h1>
    <div className="container">
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
    <div className="progress-report-list">
      <div id="accounts-grid" style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={(params) => {
                navigate(`/admin-portal/review-progress-reports/details/report_id=${params.row.reportId}`);
              }}
              autoHeight={true}   sx={{
                '@media only screen and (max-width: 768px)': {
                  /* For mobile phones: */
                  '& .MuiDataGrid-columnHeaderTitle': {
                    overflow: "visible",
                    whiteSpace: "break-spaces",
                    lineHeight: 1,
                    fontSize: "0.70rem",
                }}}
              }
            />
          </div>
        </div>
    </div>
  );
};

export default MenteeProfile;