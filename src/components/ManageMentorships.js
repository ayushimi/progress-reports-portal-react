import React, { useEffect, useState } from "react";
import "../styles/ManageMentorships.css";
import { DataGrid } from "@mui/x-data-grid";
import ClipLoader from "react-spinners/ClipLoader";

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
  }
];

const ManageMentorships = () => {
  const [rows, setRows] = useState([]);
  const [initalized, setinitalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const menteeToMentor = new Map();
  let id = 0;
  useEffect(() => {
    const fetchMentors = async () => {
      const mentors = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/select_table?table_name=mentor_info`
      );
      const mentorsJson = await mentors.json();
      return mentorsJson;
    };

    const fetchMenteesFromMentors = async (mentorId) => {
      const mentees = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_mentees_of_mentor_id?id=${mentorId}`
      );
      const menteesJson = await mentees.json();
      return menteesJson;
    };

    if (!initalized) {
      setLoading(true);
      fetchMentors().then((mentors) => {
        mentors.forEach((mentor) => {
          fetchMenteesFromMentors(mentor.id).then((mentees) => {
            if (mentees.length > 0) {
              mentees.forEach((mentee) => {
                // check if mentor already exists in table
                if (!menteeToMentor.has(mentee.name)) {
                  menteeToMentor.set(mentee.name, mentor.name);
                  // add new mentee / mentor row to table
                  setRows((rows) => [
                    ...rows,
                    {
                      id: id++,
                      mentorName: `${mentor.name}`,
                      menteeName: `${mentee.name}`
                    }
                  ]);
                }
              });
            }
            setinitalized(true);
            setLoading(false);
          });
        });
      });
    }
  }, []);

  return (
    <div>
      <div id="manage-mentorships">
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
    </div>
  );
};

export default ManageMentorships;
