import React from "react";
import Header from "./Header";
import { DataGrid } from '@mui/x-data-grid';
import "../styles/Mentor.css";
  

const columns = [
  { field: "menteeName",
    headerName: "Mentee Name",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  { field: "meetingCount",
    headerName: "Meeting Count",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header" },
  {
    field: "submitReport",
    headerName: "",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header",
    renderCell: ((params) => 
    <a href="insert_link_with_params">Submit Progress Report</a>),
  },
  {
    field: "viewReportHistory",
    headerName: "",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header",
    renderCell: ((params) => 
    <a href="insert_link_with_params">View Progress Report History</a>),
  }
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

const MentorHome = () => {
    return (
      <div>
        <Header></Header>
        <div id="mentor-home">
          <h1>Mentor Program Portal Home</h1>
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


  
export default MentorHome;