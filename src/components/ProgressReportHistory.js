import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Mentor.css";

const columns = [
  {
    field: "session_date",
    headerName: "Session Date",
    headerClassName: "table-header",
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "submission_date",
    headerName: "Submission Date",
    headerClassName: "table-header",
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Report Title",
    headerClassName: "table-header",
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "approved",
    headerName: "Feedback Received",
    headerClassName: "table-header",
    align: "center",
    headerAlign: "center",
    flex: 1,
  }
];

const ProgressReportHistory = () => {
  const { mentor_id, mentee_id } = useParams();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let idCount = 1;
    fetch(
      `https://progress-reports-portal-node.herokuapp.com/find_progress_reports_by_id?mentor_id=${mentor_id}&mentee_id=${mentee_id}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const reports = data.map((row) => ({
          ...row,
          session_date: row.session_date.substring(0, 10),
          submission_date: row.submission_date.substring(0, 10),
          id: idCount++,
          reportId: row.id,
          approved: row.feedback_received ? "Yes" : "No"
        }));
        setRows(reports);
        console.log(data)
      });
  }, []);

  return (
    <div>
      <div id="mentor-portal">
        <h1>Progress Report History</h1>
        <div id="admin-grid" style={{ height: 525, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowClick={(params) => {
              navigate(
                `/mentor-portal/view-progress-report/report_id=${params.row.reportId}`
              );
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

export default ProgressReportHistory;
