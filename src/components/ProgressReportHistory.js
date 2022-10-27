import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Admin.css";
import "../styles/Mentor.css";

const columns = [
  {
    field: "session_date",
    headerName: "Session Date",
    headerClassName: "table-header",
    width: 180
  },
  {
    field: "name",
    headerName: "Report Title",
    headerClassName: "table-header",
    width: 700
  },
  {
    field: "approval_status",
    headerName: "Feedback Received",
    headerClassName: "table-header",
    width: 250
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
          id: idCount++,
          reportId: row.id
        }));
        setRows(reports);
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
                `/admin-portal/review-progress-reports/details/report_id=${params.row.reportId}`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressReportHistory;
