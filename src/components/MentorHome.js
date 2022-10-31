import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../styles/Mentor.css";
import { useLocation } from "react-router-dom";
import $ from "jquery";
import MenteeProfileSimple from "./MenteeProfileSimple";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorHome = () => {
  console.log(useLocation().state)
  const mentorEmail = useLocation().state.email.currMentorEmail;
  const showToast = useLocation().state.showToast;
  const toastMessage = useLocation().state.toastMessage;
  const [mentorId, setMentorId] = useState(-1);
  const [rows, setRows] = useState([]);
  const [profile, setProfile] = useState({
    email: "",
    id: "",
    major: "",
    name: "",
    phone_number: "",
    usc_id: "",
    semester_entered: "",
    freshman: "",
    meetings: ""
  });

  const columns = [
    {
      field: "name",
      headerName: "Mentee Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header"
    },
    {
      field: "number_of_meetings",
      headerName: "# of Meetings",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header"
    },
    {
      field: "submitReport",
      headerName: "Submit Report",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header",
      renderCell: (params) => <a href={`mentor-portal/submit-progress-report/mentor_id=${mentorId}&mentee_id=${params.row.userId}`}>Submit</a>
    },
    {
      field: "viewReportHistory",
      headerName: "View History",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header",
      renderCell: (params) => (
        <a
          href={`mentor-portal/progress-report-history/mentee_id=${params.row.userId}&mentor_id=${mentorId}`}
        >
          History
        </a>
      )
    }
  ];

  const fetchMentorId = async (mentorEmail) => {
    const mentorInfo = await fetch(
      `https://progress-reports-portal-node.herokuapp.com/get_user_roles?email=${mentorEmail}`
    );
    const mentorJson = await mentorInfo.json();
    return mentorJson.id;
  };

  useEffect(() => {
    if (mentorEmail !== "") {
      fetchMentorId(mentorEmail).then((mentorId) => {
        if (mentorId !== -1) {
          setMentorId(mentorId);
          fetch(
            `https://progress-reports-portal-node.herokuapp.com/get_mentee_info_of_mentor?id=${mentorId}`
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              let idCount = 1;
              const menteeInfo = data.map(({ id: userId, ...rest }) => ({
                userId,
                id: idCount++,
                ...rest
              }));
              setRows(menteeInfo);
            });
        }
      });
    }
  }, [mentorEmail]);

  useEffect(() => {
    if (showToast) {
      toast.success(toastMessage, {className: 'toast-message'});
    }
  }, [showToast]);

  return (
    <div>
      <div id="mentor-portal" className="blur">
        <h1>Mentor Program Portal Home</h1>
        <div style={{ height: 525, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onCellClick={(cellInfo) => {
              if (cellInfo.field === "name") {
                fetch(
                  `https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${cellInfo.row.userId}&role=mentee`
                )
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  setProfile(data);
                  $(".mentee-profile-simple-popup").css("display", "block");
                  $(".blur").css("filter", "blur(2px)");
                });
              }
            }}
          />
        </div>
      </div>
      <MenteeProfileSimple profile={profile} />
      <ToastContainer />
    </div>
  );
};

export default MentorHome;
