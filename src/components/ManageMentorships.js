import React, { useEffect, useState } from "react";
import "../styles/Mentor.css";
import { DataGrid } from "@mui/x-data-grid";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@mui/material";

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

      return <Button>View</Button>;
    }
  }
];

const ManageMentorships = () => {
  const [rows, setRows] = useState([]);
  const [initalized, setinitalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const menteeToMentor = new Map();
  let id = 0;

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
              // Log the data to the console
              // You would do something with both sets of data here
              let menteeName = data[0].name;
              let mentorName = data[1].name;
              if (mentorships.length > 0) {
                if (!menteeToMentor.has(menteeName)) {
                  menteeToMentor.set(data[0].name, mentorName);
                  setRows((rows) => [
                    ...rows,
                    {
                      id: mentorship.mentee_id,
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
  }, []);
  // useEffect(() => {
  //   const fetchMentors = async () => {
  //     const mentors = await fetch(
  //       `https://progress-reports-portal-node.herokuapp.com/select_table?table_name=mentor_info`
  //     );
  //     const mentorsJson = await mentors.json();
  //     return mentorsJson;
  //   };

  //   const fetchMenteesFromMentors = async (mentorId) => {
  //     const mentees = await fetch(
  //       `https://progress-reports-portal-node.herokuapp.com/get_mentees_of_mentor_id?id=${mentorId}`
  //     );
  //     const menteesJson = await mentees.json();
  //     return menteesJson;
  //   };

  //   if (!initalized) {
  //     setLoading(true);
  //     fetchMentors().then((mentors) => {
  //       mentors.forEach((mentor) => {
  //         fetchMenteesFromMentors(mentor.id).then((mentees) => {
  //           if (mentees.length > 0) {
  //             mentees.forEach((mentee) => {
  //               // check if mentor already exists in table
  //               if (!menteeToMentor.has(mentee.name)) {
  //                 menteeToMentor.set(mentee.name, mentor.name);
  //                 // add new mentee / mentor row to table
  //                 setRows((rows) => [
  //                   ...rows,
  //                   {
  //                     id: id++,
  //                     mentorName: `${mentor.name}`,
  //                     menteeName: `${mentee.name}`
  //                   }
  //                 ]);
  //               }
  //             });
  //           }
  //           setinitalized(true);
  //           setLoading(false);
  //         });
  //       });
  //     });
  //   }
  // }, []);

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
