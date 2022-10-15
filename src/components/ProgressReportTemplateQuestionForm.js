import React, { useState } from "react";
import "../styles/ProgressReportTemplate.css";

const ProgressReportTemplateQuestionForm = ({ question }) => {
  const [toggle, setToggle] = useState(false);

  const [selected, setSelected] = useState(question.type);

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const showDropdown = (e) => {
    setToggle(!toggle);
  };

  return (
    <div className="dropdown">
      <button onClick={showDropdown} className="dropbtn">
        {question.question}
      </button>
      <div
        style={{ display: toggle ? "block" : "none" }}
        className="dropdown-content"
      >
        <div className="form-input-container">
          <form>
            <label className="question-label">Question Title:</label>
            <input
              className="question-input"
              type="text"
              name="question_title"
              defaultValue={question.question}
            />
            <br />
            <label className="question-label">Description:</label>
            <input
              className="question-input"
              type="text"
              name="question_description"
              defaultValue={question.description}
            />
            <br />
            <label className="question-label">Question Type:</label>
            <label className="radio-inline">
              <input
                type="radio"
                name="optradio"
                value="Multiple choice"
                checked={selected == "Multiple choice"}
                onChange={handleChange}
              />
              Multiple Choice
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name="optradio"
                value="Short answer"
                checked={selected == "Short answer"}
                onChange={handleChange}
              />
              Short Answer
            </label>
            {selected == "Multiple choice" ?
            (<div>

            </div>) : (<div></div>)}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportTemplateQuestionForm;
