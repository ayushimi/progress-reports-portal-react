import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import TextInput from '../reusable/TextInput';
import "../styles/ExportProgressReports.css"
import $ from "jquery";

function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: '100%',
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

GridCellExpand.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}

renderCellExpand.propTypes = {
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.string,
};


// delete_reports_for_date_range


const ExportProgressReports = () => {
  const [ rows, setRows ] = useState([]);
  const [ columns, setColumns ] = useState([]);
  const [ startend, setStartEnd ] = useState([]);
  const navigate = useNavigate();

  function onFilter() {
    let startDateQuestion = document.getElementById("start-date");
    let endDateQuestion = document.getElementById("end-date");
    if (startDateQuestion.value != "" && endDateQuestion.value != "") {
      setStartEnd(startDateQuestion.value+endDateQuestion.value);
    }
  }

  function onReset() {
    document.getElementById("end-date").value = "";
    document.getElementById("start-date").value = "";
    setStartEnd("");
  }

  function onReset() {
    document.getElementById("end-date").value = "";
    document.getElementById("start-date").value = "";
    setStartEnd("");
  }

  function onDelete() {
    let startDateQuestion = document.getElementById("start-date");
    let endDateQuestion = document.getElementById("end-date");
    let endpoint = "https://progress-reports-portal-node.herokuapp.com/delete_all_reports";
    if (startDateQuestion.value != "" && endDateQuestion.value != "" && startDateQuestion.value != undefined && endDateQuestion.value != undefined) {
      endpoint = `https://progress-reports-portal-node.herokuapp.com/delete_reports_for_date_range?start=${startDateQuestion.value}&end=${endDateQuestion.value}`
    }
    fetch(endpoint)
    .then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data)
    });
  }

  useEffect(() => {
    let idCount = 1;
    let maxQuestionCols = 0;
    let startDateQuestion = document.getElementById("start-date");
    let endDateQuestion = document.getElementById("end-date");
    let endpoint = "https://progress-reports-portal-node.herokuapp.com/get_all_progress_reports";
    if (startDateQuestion.value != "" && endDateQuestion.value != "" && startDateQuestion.value != undefined && endDateQuestion.value != undefined) {
      endpoint = `https://progress-reports-portal-node.herokuapp.com/get_all_progress_reports_in_date_range?start=${startDateQuestion.value}&end=${endDateQuestion.value}`
    }
    fetch(endpoint)
    .then((response) => {
      return response.json();
    }).then((data) => {
      let reports = []
      for (let i = 0; i < data.report_info.length; i++) {
        const report = data.report_info[i];
        const order = report.question_order;
        let row = {};
        if (order.length > maxQuestionCols) {
          maxQuestionCols = order.length;
        }
        for (let j = 0; j < order.length; j++) {
          const q = order[j];
          console.log(q)
          for (let k = 0; k < data.questions_answers.length; k++) {
            const qa = data.questions_answers[k];
            if (qa.report_id === report.id && qa.question_id === q) {
              const formattedQA = `Question: ${qa.question}${qa.description != null ? " - " + qa.description : qa.description}        Answer: ${qa.answer}`;
              row = {
                ...row,
                ["q"+(j+1)]: formattedQA
              }
              break;
            }
          }
        }
        console.log(row)
        row = {
          ...row,
          id: idCount++,
          reportId: report.id,
          session_date: report.session_date.substring(0, 10),
          mentee_name: report.mentee_name,
          mentor_name: report.mentor_name,
          name: report.name
        }
        reports.push(row);
        console.log(row);
      }
      let cols = [
        { field: "session_date",
          headerName: "Session Date",
          headerClassName: "table-header",
          flex: 1,
          minWidth: 150,
          align: "center",
          headerAlign: "center",
        },
        { field: "name",
          headerName: "Report Title",
          headerClassName: "table-header", 
          flex: 1.5,
          align: "left",
          minWidth: 250,
          headerAlign: "center",
        },
        { field: "mentor_name",
          headerName: "Mentor",
          headerClassName: "table-header",
          flex: 1,
          align: "left",
          minWidth: 150,
          headerAlign: "center"
        },
        { field: "mentee_name",
          headerName: "Mentee",
          headerClassName: "table-header",
          flex: 1,
          align: "left",
          minWidth: 150,
          headerAlign: "center"
        }
      ];
      
      for (let i = 1; i <= maxQuestionCols; i++) {
        cols.push(
          {
            field: "q"+i,
            headerName: "Question "+i,
            headerClassName: "table-header",
            flex: 2,
            headerAlign: "center",
            minWidth: 150,
            renderCell: renderCellExpand
          }
        )
      }
      setColumns(cols);
      setRows(reports);
    });
  }, [startend]);

  const utcDate = new Date();
  const offset = utcDate.getTimezoneOffset()
  const today = new Date(utcDate.getTime() - (offset*60*1000)).toISOString().split('T')[0];
  
  return (
  <div>
    <div id="admin-portal">
      <h1>Export Progress Reports</h1>
      <div className="my-3">
        <div className="start-date-picker">
          <TextInput label={"Start date"} id={"start-date"} maxDate={today} onChange={""} type="date" required={true}/>
        </div>
        <div className="end-date-picker">
          <TextInput label={"End date"} id={"end-date"} maxDate={today} onChange={""} type="date" required={true}/>
        </div>
        <button onClick={onFilter} className="btn filter-btn" type="button"> Filter </button>
        <button type="button" className="btn reset-btn" onClick={onReset}> Reset </button>
        <button type="button" className="btn delete-btn" onClick={onDelete}> Permanently Delete Reports </button>
      </div>
      <div id="admin-grid" style={{ height: 525, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          components={{Toolbar: GridToolbar}}
          onRowClick={(params) => {
            navigate(`/admin-portal/review-progress-reports/details/${params.row.reportId}`);
          }}
          autoHeight={true}
          sx={{
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
  </div>
  );
};

export default ExportProgressReports;