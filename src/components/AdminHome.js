import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Admin.css";

const columns = [
  { field: "session_date",
    headerName: "Session Date",
    headerClassName: "table-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  { field: "name",
    headerName: "Report Title",
    headerClassName: "table-header", 
    flex: 1.5,
    align: "left",
    headerAlign: "center",
  },
  { field: "mentor_name",
    headerName: "Mentor",
    headerClassName: "table-header",
    flex: 1,
    align: "center",
    headerAlign: "center"
  },
  { field: "mentee_name",
    headerName: "Mentee",
    headerClassName: "table-header",
    flex: 1,
    align: "center",
    headerAlign: "center", }
];


const AdminHome = () => {
  const [ rows, setRows ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let idCount = 1;
    fetch("https://progress-reports-portal-node.herokuapp.com/get_pending_progress_reports")
    .then((response) => {
      return response.json();
    }).then((data) => {
      const reports = data.map((row) => (
        {
          ...row,
          session_date: row.session_date.substring(0, 10),
          id: idCount++,
          reportId: row.id,
        }
      ));
      setRows(reports);
    });
  }, []);

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
          onRowClick={(params) => {
            navigate(`/admin-portal/review-progress-reports/details/report_id=${params.row.reportId}`);
          }}
          autoHeight={true}   sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
                overflow: "visible",
                whiteSpace: "break-spaces",
                lineHeight: 1,
                fontSize: "1.1rem",
            }}}
        />
      </div>
    </div>
  </div>
  );
};

export default AdminHome;