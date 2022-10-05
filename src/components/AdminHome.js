import React from "react";
import Header from "./Header";
import { DataGrid } from '@mui/x-data-grid';
import "../styles/Admin.css";

const columns = [
  { field: "sessionDate", headerName: "Session Date", headerClassName: "table-header", width: 180 },
  { field: "reportTitle", headerName: "Report Title", headerClassName: "table-header", width: 700 },
  { field: "mentorName", headerName: "Mentor", headerClassName: "table-header", width: 250 },
  { field: "menteeName", headerName: "Mentee", headerClassName: "table-header", width: 250 }
];

const rows = [
  {
    id: 1,
    sessionDate: "09/03/2022",
    reportTitle: "Introductory Meeting",
    mentorName: "Uma Durairaj",
    menteeName: "Ayushi Mittal"
  },
  {
    id: 2,
    sessionDate: "09/06/2022",
    reportTitle: "Academic Mentorship",
    mentorName: "Chloe Kuo",
    menteeName: "Erica De Guzman"
  },
  {
    id: 3,
    sessionDate: "09/08/2022",
    reportTitle: "Mentorship Goals",
    mentorName: "Uma Durairaj",
    menteeName: "Ayushi Mittal"
  }
];

const AdminHome = () => {
  return (
  <div>
    
    <div id="admin-portal">
      <h1>Pending Progress Reports</h1>
      <div id="admin-grid" style={{ height: 525, width: "100%" }}>
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

export default AdminHome;