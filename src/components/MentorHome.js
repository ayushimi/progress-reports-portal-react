import React from "react";
import Header from "./Header";
import { DataGrid } from '@mui/x-data-grid';
  

const columns = [
  { field: "menteeName", headerName: "Mentor Name", width: 130 },
  { field: "meetingCount", headerName: "Meeting Count", width: 130 },
  {
    field: "submitReport",
    headerName: "",
    width: 90
  },
  {
    field: "viewReportHistory",
    headerName: "",
    width: 160
  }
];

const rows = [
  {
    id: 1,
    menteeName: "Chloe",
    meetingCount: "1",
    submitReport: "submit",
    viewReportHistory: "history"
  }
];

const MentorHome = () => {
    return (
      <div>
      <Header></Header>
      <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
      </div>
    );
};


  
export default MentorHome;