import React, { useEffect, useState } from "react";
import "../styles/ManageMentorships.css";
import { DataGrid } from "@mui/x-data-grid";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageMentorships = () => {
  const showToast = useLocation().state.showToast;
  const toastMessage = useLocation().state.toastMessage;

  const [ addMentorshipClicked, setAddMentorshipClicked ] = useState(false);
  const columns = [
    {
      field: "mentorName",
      headerName: "Mentor",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header"
    },
    {
      field: "menteeName",
      headerName: "Mentees",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header"
    },
    {
      field: "view",
      headerName: "View Mentorship",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header",
      renderCell: (params) => {
        return (
          <Link
            to={`/admin-portal/manage-mentorships/details/mentee_id=${params.row.mentee_id}&mentor_id=${params.row.mentor_id}`}
          >
            <button type="button">View</button>
          </Link>
        );
      }
    },
    {
      field: "deactivate",
      headerName: "Deactivate Mentorship",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "table-header",
      renderCell: (params) => {
        const deactivateMentorship = (e) => {
          fetch(
            `https://progress-reports-portal-node.herokuapp.com/deactivate_mentor_mentee?mentee_id=${params.row.mentee_id}&mentor_id=${params.row.mentor_id}`
          ).then((response) => {
            setDeactivated(true);
            setDeactivatedMenteeName(params.row.menteeName);
          });
        };
        return (
          <button onClick={deactivateMentorship} type="button">
            Deactivate
          </button>
        );
      }
    }
  ];

  const [rows, setRows] = useState([]);
  const [initalized, setinitalized] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menteeToMentor] = useState(new Map());
  const [deactivatedMenteeName, setDeactivatedMenteeName] = useState("");

  useEffect(() => {
    const fetchActiveMentorships = async () => {
      const mentorships = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_active_mentorships`
      );
      const mentorshipsJson = await mentorships.json();
      return mentorshipsJson;
    };

    const fetchMentor = async (mentorId) => {
      const mentors = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${mentorId}&role=mentor`
      );
      const mentorsJson = await mentors.json();
      return mentorsJson;
    };

    const fetchMentee = async (menteeId) => {
      const mentees = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${menteeId}&role=mentee`
      );
      const menteesJson = await mentees.json();
      return menteesJson;
    };

    if (!initalized) {
      fetchActiveMentorships().then((mentorships) => {
        mentorships.forEach((mentorship) => {
          Promise.all([
            fetchMentee(mentorship.mentee_id),
            fetchMentor(mentorship.mentor_id)
          ])
            .then((responses) => {
              return Promise.all(
                responses.map(function (response) {
                  return response;
                })
              );
            })
            .then(function (data) {
              let menteeName = data[0].name;
              let mentorName = data[1].name;
              if (mentorships.length > 0) {
                if (!menteeToMentor.has(menteeName)) {
                  menteeToMentor.set(menteeName, mentorName);
                  setRows((rows) => [
                    ...rows,
                    {
                      id: mentorship.mentee_id,
                      mentee_id: mentorship.mentee_id,
                      mentor_id: mentorship.mentor_id,
                      mentorName: `${mentorName}`,
                      menteeName: `${menteeName}`
                    }
                  ]);
                  // all rows loaded
                  if (menteeToMentor.size === mentorships.length) {
                    setinitalized(true);
                    setLoading(false);
                  }
                }
              }
            })
            .catch(function (error) {
              // if there's an error, log it
              console.log(error);
            });
        });
      });
    }

    if (deactivated) {
      const indexOfDeactivatedMentorship = rows.findIndex((object) => {
        return object.menteeName === deactivatedMenteeName;
      });

      menteeToMentor.delete(deactivatedMenteeName);
      let rowsModify = [...rows];
      rowsModify.splice(indexOfDeactivatedMentorship, 1);
      setRows((rows) => [...rowsModify]);
      setDeactivated(false);
    }
  }, [initalized, menteeToMentor, deactivated, deactivatedMenteeName, rows]);

  useEffect(() => {
    if (showToast) {
      toast.success(toastMessage, {className: 'toast-message'});
    }
  }, [showToast]);

  return (addMentorshipClicked ? 
    (<Navigate to="/admin-portal/manage-mentorships/add-mentorship"/>)
    :
    <div className="manage-mentorships">
      <h1>Manage Mentorships</h1>
      <div className="col-12">
        <button id="add-mentorship-button" className="float-end" onClick={() => {
              setAddMentorshipClicked(true);}}>+ Add Mentorship
        </button>
      </div>
      <div style={{ height: 525, width: "100%" }}>
        {loading ? (
          <div id="loader">
            <ClipLoader color={"#123abc"} loading={loading} size={80} />
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageMentorships;
