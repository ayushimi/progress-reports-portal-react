import React from "react";
import "../styles/ManageMentorships.css";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: "menteeName",
    headerName: "Mentor",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "meetingCount",
    headerName: "Mentees",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header" }
];

const rows = [
  {
    id: 1,
    menteeName: "Uma Durairaj",
    meetingCount: "2",
  },
  {
    id: 2,
    menteeName: "Chloe Kuo",
    meetingCount: "4",
  },
  {
    id: 3,
    menteeName: "Ayushi Mittal",
    meetingCount: "1",
  },
  {
    id: 4,
    menteeName: "Erica De Guzman",
    meetingCount: "3",
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