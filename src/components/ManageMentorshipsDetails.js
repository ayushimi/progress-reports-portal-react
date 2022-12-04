import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ManageMentorships.css";

const columns = [
  {
    field: "sessionDate",
    headerName: "Session Date",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  {
    field: "reportTitle",
    headerName: "Report Title",
    flex: 4,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header"
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "table-header",
  },
];

const ManageMentorshipsDetails = () => {
  const [rows, setRows] = useState([]);
  const { mentee_id, mentor_id } = useParams();
  const [mentee, setMentee] = useState("");
  const [mentor, setMentor] = useState("");
  const [initalized, setinitalized] = useState(false);
  const [progressReportSet] = useState(new Set());
  

  useEffect(() => {
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

    const fetchProgressReports = async (mentorId, menteeId) => {
      const progressReports = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/find_progress_reports_by_id?mentor_id=${mentorId}&mentee_id=${menteeId}`
      );
      const progressReportsJson = await progressReports.json();
      return progressReportsJson;
    }

    if(!initalized){
      
      let id = 0;
      fetchMentee(mentee_id).then((student) => {
        setMentee(student);
      });
      fetchMentor(mentor_id).then((student) => {
        setMentor(student);
      });
      fetchProgressReports(mentor_id, mentee_id).then((progressReports) => {
        progressReports.forEach((progressReport) => {
          if(!progressReportSet.has(progressReport.name)) {
            progressReportSet.add(progressReport.name);
            setRows((rows) => [
              ...rows,
              {
                id: id++,
                sessionDate: progressReport.session_date,
                reportTitle: progressReport.name,
                status: progressReport.approved ? "Approved" : "Pending",
              }
            ]);
          }
          if(progressReportSet.size === progressReports.size) {
            setinitalized(true);
          }
        });
      });
    }

  }, [mentee_id, mentor_id, initalized, progressReportSet]);

  return (
    <div className="manage-mentorships">
      <h1>Manage Mentorships</h1>
      <div id="mentorship-header">
        <h3>Mentor: {mentor.name}</h3>
        <h3>Mentee: {mentee.name}</h3>
        <br></br>
        <h2>Progress Report History</h2>
      </div>
      <div className="clearfloat"></div>
      <div style={{ height: 525, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight={true}   sx={{
              '@media only screen and (max-width: 768px)': {
                /* For mobile phones: */
                '& .MuiDataGrid-columnHeaderTitle': {
                  overflow: "visible",
                  whiteSpace: "break-spaces",
                  lineHeight: 1,
                  fontSize: "0.70rem",
              }}}
            }
          />
      </div>
    </div>
  );
};

export default ManageMentorshipsDetails;
