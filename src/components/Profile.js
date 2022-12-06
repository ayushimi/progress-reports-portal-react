import "../styles/Profile.css";
import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
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


const Profile = () => {
  let id = 1;
  let role = "mentee";
  const [profile, setProfile] = useState("");
  const [ rows, setRows ] = useState([]);
  const [ mentee_mentorId, setMenteeMentorId ] = useState("");
  const navigate = useNavigate();

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

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  useEffect(() => {
    if (role == "mentee") {
      fetch(`https://progress-reports-portal-node.herokuapp.com/get_mentor_of_mentee_id?id=${id}`)
        .then((response) => {
          return response.json();
        }).then((data) => {
          setMenteeMentorId(data.mentor_id);
        })
      }
}, [id, role]);


  useEffect(() => {
    let idCount = 1;
    if (role == "mentee") {
    fetch(`https://progress-reports-portal-node.herokuapp.com/find_progress_reports_by_id?mentor_id=${mentee_mentorId}&mentee_id=${id}`)
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
}, [mentee_mentorId]);




  return (
    <div className="profile">
      <h1 className="profile-name">{profile.name}</h1>
      <div className="container">
        <div className="row">
          <div className="text-center">
            <p className="profile-content"><strong>Role:</strong> {role.charAt(0).toUpperCase() + role.slice(1)}</p>
            {["mentor", "mentee"].includes(role) && <p className="profile-content"><strong>USC ID:</strong> #{profile.usc_id}</p>}
            <p className="profile-content"><strong>Email:</strong> {profile.email}</p>
            {["mentor", "mentee"].includes(role) && <p className="profile-content"><strong>Phone number:</strong> {formatPhoneNumber(profile.phone_number)}</p>}
            {["mentor", "mentee"].includes(role) && <p className="profile-content"><strong>Major:</strong> {profile.major}</p>}
            {role == "mentor" && <p className="profile-content"><strong>Status:</strong> {profile.active ? "Active" : "Inactive"}</p>}
            {role == "mentee" && <p className="profile-content"><strong>Status:</strong> {profile.freshman ? "Freshman" : "Transfer"}</p>}
            {role == "mentee" && <p className="profile-content"><strong>Semester entered:</strong> {profile.semester_entered}</p>}
            {role == "mentee" && <p className="profile-content"><strong>Number of meetings:</strong> {profile.meetings}</p>}
            <div className="row">
            {role == "mentee" && 
                <div className="progress-report-list">
                  <div id="accounts-grid" style={{ width: "100%" }}>
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
          }
          </div>
          </div>
        </div>
      </div>
      <div className="row">
      <div className="profile-back">
        <button type="button" className="btn profile-back-btn"
          onClick={() => {
            navigate(-1);
          }}
        >Back</button>
      </div>
      </div>
    </div>
  );
};

export default Profile;