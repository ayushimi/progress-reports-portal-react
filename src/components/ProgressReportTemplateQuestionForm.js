import React, { useState } from "react";
import "../styles/ProgressReportTemplate.css";
import closeIcon from "../images/close-btn.png"

const ProgressReportTemplateQuestionForm = (props) => {
  const [question, setQuestion] = useState(props.question);

  const question_title = "question_title";
  const question_description = "question_description";
  const question_type = "question_type";
  const question_options = "question_options";
  const question_delete = "question_delete";

  const [toggle, setToggle] = useState(false);

  const [selected, setSelected] = useState(question.type);

  const [choices, setChoices] = useState(question.options ? question.options : []);

  const showDropdown = (e) => {
    setToggle(!toggle);
  };

  const handleNumChoiceChange = (event) => {
    const newChoices = [];
    for (let i = 0; i < event.target.value; i++) {
      newChoices.push("");
    }
    setChoices(newChoices);
  };
  
  const handleQuestionChange = (source, index) => (event) => {
    let updatedQuestion = question;

    if(source == question_options && index >=0) {
      updatedQuestion.options = choices;
      updatedQuestion.options[index] = event.target.value;
    }
    
    if (source == question_title) {
      updatedQuestion.question = event.target.value;
    }
    if (source == question_description) {
      updatedQuestion.description = event.target.value;
    }
    if (source == question_type) {
      setSelected(event.target.value);
      updatedQuestion.type = event.target.value;
    }
    props.onChange(updatedQuestion);
    
  };

  return (
    <div className="dropdown">
      <div>
        <button onClick={showDropdown} className="dropbtn question-button">
          {question.question} 
        </button>
        {/* <div className="clearfloat"></div> */}
        <button id="delete-button" className="question-button" onClick={props.onDelete(question.id)}><img id="delete-icon" src={closeIcon}/></button>
      </div>
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
              onChange={handleQuestionChange(question_title, -1)}
            />
            <br />
            <label className="question-label">Description:</label>
            <input
              className="question-input"
              type="text"
              name="question_description"
              defaultValue={question.description}
              onChange={handleQuestionChange(question_description, -1)}
            />
            <br />
            <label className="question-label">Question Type:</label>
            <label className="radio-inline">
              <input
                type="radio"
                name="optradio"
                value="Multiple choice"
                checked={selected == "Multiple choice"}
                onChange={handleQuestionChange(question_type, -1)}
              />
              Multiple Choice
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name="optradio"
                value="Short answer"
                checked={selected == "Short answer"}
                onChange={handleQuestionChange(question_type, -1)}
              />
              Short Answer
            </label>
            {selected == "Multiple choice" ? (
              <div>
                <label className="question-label">Choice Count:</label>
                <input
                  className="choice-input"
                  type="number"
                  name="question_num_choices"
                  defaultValue={choices.length > 0 ? choices.length : ""}
                  onChange={handleNumChoiceChange}
                  min="1"
                />
                {choices.map((choice, index) => (
                  <input
                  className="question-input"
                  type="text"
                  name="choice"
                  defaultValue={choice}
                  placeholder={"Option " + (index+1)}
                  key={index}
                  onChange={handleQuestionChange(question_options, index)}
                  />
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportTemplateQuestionForm;
