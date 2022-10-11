import React, { useEffect, useState } from "react";
import "../styles/ManageMentorships.css";
import { DataGrid } from "@mui/x-data-grid";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const columns = [
  {
    field: "mentorName",
    headerName: "Mentor",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  {
    field: "menteeName",
    headerName: "Mentees",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  {
    field: "action",
    headerName: "View Mentorship",
    sortable: false,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header",
    renderCell: (params) => {
      // const onClick = (e) => {
      // e.stopPropagation(); // don't select this row after clicking

      // const api: GridApi = params.api;
      // const thisRow: Record<string, GridCellValue> = {};

      // api
      //   .getAllColumns()
      //   .filter((c) => c.field !== "__check__" && !!c)
      //   .forEach(
      //     (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
      //   );

      //   return alert(JSON.stringify(thisRow, null, 4));
      // };
      console.log(params.row);

      // return <Button href={`/admin-portal/manage-mentorships?mentee_id=${params.row.id}`}>View</Button>;
      return (
        <Link
          to={`/admin-portal/manage-mentorships/details/mentee_id=${params.row.mentee_id}&mentor_id=${params.row.mentor_id}`}
        >
          <button type="button">View</button>
        </Link>
      );
    }
  }
];

const ManageMentorships = () => {
  const [rows, setRows] = useState([]);
  const [initalized, setinitalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menteeToMentor] = useState(new Map());
 

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
  }, [initalized, menteeToMentor]);

  return (
    <div className="mentor-portal-page">
      <h1>Manage Mentorships</h1>
      <div style={{ height: 525, width: "100%" }}>
        {loading ? (
          <ClipLoader color={"#123abc"} loading={loading} size={50} />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        )}
      </div>
    </div>
  );
};

export default ManageMentorships;
