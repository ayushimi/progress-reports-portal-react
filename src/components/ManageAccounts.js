import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../styles/ManageAccounts.css";
import $ from "jquery";
import MentorProfile from "./MentorProfile";
import MenteeProfile from "./MenteeProfile";
import AdminProfile from "./AdminProfile";

const ManageAccounts = () => {
  const [ createAccountClicked, setCreateAccountClicked ] = useState(false);
  const [ rows, setRows ] = useState([
    {
      id: "",
      name: "",
      email: "",
      role: "",
      userId: "",
    },
  ]);
  const [ profile, setProfile ] = useState({
    email: "",
    id: "",
    major: "",
    name: "",
    phone_number: "",
    usc_id: "",
    semester_entered: "",
    freshman: "",
    meetings: "",
  });
  const [ mentee_mentorId, setMenteeMentorId ] = useState("");
  // const [ searchInput, setSearchInput ] = useState("");

  const columns = [
    { field: "name",
      headerName: "Name",
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
    { field: "role",
      headerName: "Role",
      flex: 1,
      align: "left",
      headerAlign: "center",
      headerClassName: "table-header"
    }
  ];

  useEffect(() => {
    fetch("https://progress-reports-portal-node.herokuapp.com/search_users_by_email?email=").then((response) => {
      return response.json();
    }).then((data) => {
      let idCount = 1;
      const admins = data.administrator.map((admin) => ({
        ...admin,
        role: "Administrator",
      }));
      const mentees = data.mentee.map((mentee) => ({
        ...mentee,
        role: "Mentee",
      }));
      const mentors = data.mentor.map((mentor) => ({
        ...mentor,
        role: "Mentor",
      }));
      let accounts = [...admins, ...mentees, ...mentors];
      accounts.sort(function (a, b) {
        const aInitial = a.name.substring(a.name.indexOf(" ")+1);
        const bInitial = b.name.substring(b.name.indexOf(" ")+1);
        if (aInitial > bInitial) {
          return 1;
        }
        else if (aInitial < bInitial) {
          return -1;
        }
        else {
          return 0;
        }
      });
      accounts = accounts.map(({
        id: userId,
        ...rest
      }) => ({
        userId,
        id: idCount++,
        ...rest
      }));

      setRows(accounts);
    });
  }, []);

  return (createAccountClicked ? 
  (<Navigate to="/admin-portal/manage-accounts/create-account"/>)
  :
  (<div>
    <div id="manage-accounts-page" className="blur">
      <div id="manage-accounts-header">
        <h1>Manage Accounts</h1>
      </div>
      <div className="container-fluid">
        <div className="row" id="manage-accounts-top">
          {/* <div className="col-md-5 col-sm-7">
            <TextInput label="Search by name/email:" id="search-input" value={searchInput} type="search" onChange={(updatedSearchInput) => {
              setSearchInput(updatedSearchInput);
            }}/>
          </div>
          <div className="col-md-4 col-sm-5">
            <button id="search-accounts-btn" className="float-md-start float-sm-end float-xs-end" type="submit">
              Search
            </button>
          </div> */}
          <div className="col-12">
            <button id="create-account-btn" className="float-end"onClick={() => {
              setCreateAccountClicked(true);
            }}>
              + Create Account
            </button>
          </div>
        </div>
      </div>
      <div id="accounts-grid">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowClick={(rowInfo) => {
              fetch(`https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${rowInfo.row.userId}&role=${rowInfo.row.role}`)
              .then((response) => {
                return response.json();
              }).then((data) => {
                console.log(data);
                setProfile(data);
                if (rowInfo.row.role === "Mentor") {
                  $(".mentor-profile-popup").css("display", "block");
                  $(".blur").css("filter", "blur(2px)");
                }
                else if (rowInfo.row.role === "Mentee") {
                  $(".mentee-profile-popup").css("display", "block");
                  $(".blur").css("filter", "blur(2px)");
                  fetch(`https://progress-reports-portal-node.herokuapp.com/get_mentor_of_mentee_id?id=${rowInfo.row.userId}`)
                  .then((response) => {
                    return response.json();
                  }).then((data) => {
                    setMenteeMentorId(data.mentor_id);
                  })
                }
                else if (rowInfo.row.role === "Administrator") {
                  $(".admin-profile-popup").css("display", "block");
                  $(".blur").css("filter", "blur(2px)");
                }
              });
            }}
          />
        </div>
      </div>
      <AdminProfile profile={profile} />
      <MentorProfile profile={profile} />
      <MenteeProfile profile={profile} mentor={mentee_mentorId} />
    </div>)
  );
};

export default ManageAccounts;