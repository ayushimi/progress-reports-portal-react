import React, { useState } from "react";
import "../styles/ProgressReportTemplate.css";
import closeIcon from "../images/close-btn.png";
import Textarea from "../reusable/Textarea";

const ProgressReportTemplateQuestionForm = (props) => {
  const [question] = useState(props.question);

  const question_title = "question_title";
  const question_description = "question_description";
  const question_type = "question_type";
  const question_options = "question_options";
  const question_required = "question_required";

  const [toggle, setToggle] = useState(false);

  const [selected, setSelected] = useState(question.type);

  const [choices, setChoices] = useState(
    question.options ? question.options : []
  );

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

    if (source === question_options && index >= 0) {
      updatedQuestion.options = choices;
      updatedQuestion.options[index] = event.target.value;
    }
    if (source === question_required) {
      console.log(event.target.checked)
      updatedQuestion.required = event.target.checked;
    }
    if (source === question_title) {
      updatedQuestion.question = event.target.value;
    }
    if (source === question_description) {
      updatedQuestion.description = event.target.value;
    }
    if (source === question_type) {
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
        <button
          id="delete-button"
          className="question-button"
          onClick={props.onDelete(question.id)}
        >
          <img id="delete-icon" alt="delete" src={closeIcon} />
        </button>
      </div>
      <div
        style={{ display: toggle ? "block" : "none" }}
        className="dropdown-content"
      >
        <div className="form-input-container">
          <form>
            <div class="form-group row">
              <div class="col">
              <Textarea label={"Question Title"}
                  description={""}
                  id={question.question}
                  type="text" required={true}
                  defaultValue={question.question}
                  onChange={handleQuestionChange(question_title, -1)}
                  />
              </div>
            </div>

            <br />
            <div class="form-group row">
              {/* <label className="question-label col-md-4 col-lg-3 col-xl-2 col-form-label">Description:</label> */}
              <div class="col">
                <Textarea label={"Description"}
                  description={""}
                  id={question.id}
                  type="text" required={true}
                  defaultValue={question.description}
                  onChange={handleQuestionChange(question_description, -1)}
                  />
              </div>
            </div>
            <br />

            <div class="form-group row">
              <label className="question-label col-md-4 col-lg-3 col-xl-2 col-form-label">Question Type:</label>
              <div class="col">
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="optradio"
                    value="Multiple choice"
                    checked={selected === "Multiple choice"}
                    onChange={handleQuestionChange(question_type, -1)}
                  />
                  Multiple Choice
                </label>
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="optradio"
                    value="Short answer"
                    checked={selected === "Short answer"}
                    onChange={handleQuestionChange(question_type, -1)}
                  />
                  Short Answer
                </label>
              </div>
            </div>
            {selected === "Multiple choice" ? (
              <div>
                <div class="form-group row">
                  <label className="question-label col-md-4 col-lg-3 col-xl-2 col-form-label">Choices:</label>
                  <div class="col">
                    <input
                      className="choice-input w-100"
                      type="number"
                      name="question_num_choices"
                      defaultValue={choices.length > 0 ? choices.length : ""}
                      onChange={handleNumChoiceChange}
                      min="1"
                    />
                    {choices.map((choice, index) => (
                      <input
                        className="question-input w-100"
                        type="text"
                        name="choice"
                        defaultValue={choice}
                        placeholder={"Option " + (index + 1)}
                        key={index}
                        onChange={handleQuestionChange(question_options, index)}
                      />
                    ))}

                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <br />
            <div class="form-group row">
              <label className="question-label col-auto col-md-4 col-lg-3 col-xl-2 col-form-label">Required:</label>
              <div class="col">
                <input
                  className="h-100"
                  type="checkbox"
                  defaultChecked={question.required}
                  onChange={handleQuestionChange(question_required, -1)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportTemplateQuestionForm;
