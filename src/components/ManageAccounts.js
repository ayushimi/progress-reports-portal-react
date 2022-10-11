import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../styles/ManageAccounts.css";
import $ from "jquery";
import MentorProfile from "./MentorProfile";
import MenteeProfile from "./MenteeProfile";

const ManageAccounts = () => {
  const [ createAccountClicked, setCreateAccountClicked ] = useState(false);
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
  
  const rows = [
    {
      id: 1,
      name: "Uma Durairaj",
      email: "uduraira@usc.edu",
      role: "Administrator",
    },
    {
      id: 2,
      name: "Chloe Kuo",
      email: "cmkuo@usc.edu",
      role: "Mentor",
    },
    {
      id: 3,
      name: "Ayushi Mittal",
      email: "ayushimi@usc.edu",
      role: "Mentee",
    },
    {
      id: 4,
      name: "Erica De Guzman",
      email: "ed_139@usc.edu",
      role: "Mentor",
    },
  ];

  useEffect(() => {
    // fetch(`https://progress-reports-portal-node.herokuapp.com/add_mentor` + 
    //   `?name=${name}&usc_id=${uscID}&email=${email}&phone_number=${phoneNumber}&major=${major}`).then((response) => {
    //   return response.json();
    // }).then((data) => {
    //   if (data.filter(user => (user.name === `${name}` && user.usc_id === `${uscID}` 
    //     && user.email === `${email}` && user.phone_number === `${phoneNumber}` 
    //     && user.major === `${major}`)).length > 0) {
    //     setMentorCreationSuccess(true);
    //   }
    // });
  }, [])

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
      <div id="accounts-grid" style={{ height: 525, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowClick={(rowInfo) => {
                console.log(rowInfo.row.email);
                // FETCH USER INFO BY rowInfo.id and rowInfo.role
                if (rowInfo.id === 2) {
                  $(".mentor-profile-popup").css("display", "block");
                  $(".blur").css("filter", "blur(2px)");
                }
                if (rowInfo.id === 3) {
                  $(".mentee-profile-popup").css("display", "block");
                  $(".blur").css("filter", "blur(2px)");
                }
              }
            }
          />
        </div>
      </div>
      <MentorProfile />
      <MenteeProfile />
    </div>)
  );
};

export default ManageAccounts;