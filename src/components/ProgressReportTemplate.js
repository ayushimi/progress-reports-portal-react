import React from "react";
import "../styles/ProgressReportTemplate.css";
import ProgressReportTemplateQuestionForm from "./ProgressReportTemplateQuestionForm";

const ProgressReportTemplate = () => {
  return (
    <div className="progress-report-template">
      <h1>Progress Report Template</h1>
      <ProgressReportTemplateQuestionForm question={""} />
      <div> potato</div>
    </div>
  );
};

export default ProgressReportTemplate;