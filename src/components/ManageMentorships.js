import React from "react";
import "../styles/ManageMentorships.css";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: "mentorName",
    headerName: "Mentor",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "menteeName",
    headerName: "Mentees",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header" }
];

const rows = [
  {
    id: 1,
    mentorName: "Uma Durairaj",
    menteeName: "Student A",
  },
  {
    id: 2,
    mentorName: "Chloe Kuo",
    menteeName: "Student B",
  },
  {
    id: 3,
    mentorName: "Ayushi Mittal",
    menteeName: "Student C",
  },
  {
    id: 4,
    mentorName: "Erica De Guzman",
    menteeName: "Student D",
  }
];

const ManageMentorships = () => {
  return (
    <div>
    <div id="manage-mentorships">
      <h1>Manage Mentorships</h1>
      <div style={{ height: 525, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
    </div>
  </div>
  );
};

export default ManageMentorships;