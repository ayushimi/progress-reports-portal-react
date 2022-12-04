import "../styles/Profile.css";
import React, { useEffect, useState } from "react";
import closebtn from '../images/close-btn.png';
import { DataGrid } from "@mui/x-data-grid";
import $ from "jquery";

const columns = [
  { field: "name",
    headerName: "Mentee Name",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "email",
    headerName: "Email",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "number_of_meetings",
    headerName: "# of Meetings",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  }
];

const MentorProfile = (props) => {
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    if (props.profile.id !== "") {
      fetch(`https://progress-reports-portal-node.herokuapp.com/get_mentee_info_of_mentor?id=${props.profile.id}`)
      .then((response) => {
        return response.json();
      }).then((data) => {
        let idCount = 1;
        const menteeInfo = data.map(({
          id: userId,
          ...rest
        }) => ({
          userId,
          id: idCount++,
          ...rest
        }));
        setRows(menteeInfo);
      });
    }
  }, [props.profile]);

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
    <h1 className="profile-name">{props.profile.name}</h1>
    <div className="container">
      <div className="row">
        <div className="profile-content-left col-6 text-center">
          <p className="profile-content"><strong>USC ID:</strong> #{props.profile.usc_id}</p>
          <p className="profile-content"><strong>Email:</strong> {props.profile.email}</p>
        </div>
        <div className="profile-content-right col-6 text-center">
          <p className="profile-content"><strong>Phone:</strong> {props.profile.phone_number}</p>
          <p className="profile-content"><strong>Major:</strong> {props.profile.major}</p>
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

export default MentorProfile;