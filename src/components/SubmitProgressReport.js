import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../styles/ProgressReportTemplate.css";
import ProgressReportTemplateQuestionForm from "./ProgressReportTemplateQuestionForm";
import hamburgerIcon from "../images/hamburger.png";
import plusIcon from "../images/plus-btn.png";
import "../styles/SubmitProgressReport.css";
import TextInput from "../reusable/TextInput";
import Textarea from "../reusable/Textarea";
import RadioButtons2 from "../reusable/RadioButtons2";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";
import { Navigate } from "react-router-dom";
import "../styles/SubmitProgressReport.css";

const SubmitProgressReport = () => {
  const [initalized, setinitalized] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [ errorInputMissing, setErrorInputMissing ] = useState(false);

  const onSubmit = () => {
    // setQuestionOrder();
  };

  function handleSubmit(event) {
    event.preventDefault();

    var answers = [];
    var error = false;
    var title;
    var date;

    var titleQuestion = document.getElementById("report-title");
    if (titleQuestion.value == "") {
      setErrorInputMissing(true);
      error = true;
    }
    else {
      title = titleQuestion.value;
    }

    var dateQuestion = document.getElementById("session-date");
    console.log(dateQuestion.value);
    if (dateQuestion.value == "") {
      setErrorInputMissing(true);
      error = true;
    }
    else {
      date = dateQuestion.value;
    }

    questions.forEach(function (q, i) {
      var question;
      if (q.type == "Multiple choice") {
        question = document.getElementsByName(q.question);
      }
      else {
        question = document.getElementById(q.id);
      }
      if (question == null || question.value == "") {
        if (q.required) {
          setErrorInputMissing(true);
          error = true;
        }
        else {
          answers[answers.length] = "";
        }
      }
      else {
        if (q.type == "Multiple choice") {
          for (var i = 0; i < question.length; i++) {
            if (question[i].checked) {
              answers[answers.length] = question[i].value;
            }
          }
        }
        else {
          answers[answers.length] = question.value;
        }
      }
    });
    if (!error) {
      fetch(`https://progress-reports-portal-node.herokuapp.com/add_progress_report` + 
          `?name=${title}&mentor_id=1&mentee_id=1&session_date=${date}`).then((response) => {
            return response.json();
          }).then((data) => {
            var id = data.id;
          questions.forEach(function (q, i) {
            fetch(`https://progress-reports-portal-node.herokuapp.com/add_report_content` + 
              `?report_id=${id}&question_id=${q.id}&answer=${answers[i]}`)
          });       
      });
    }
  }

  useEffect(() => {
    let errorText = "";
    if (errorInputMissing) {
      errorText += "Error(s): <ul><li>Please input all fields.</li></ul>";
    }
    $("#error-div-mentor").html(errorText);
  }, [errorInputMissing]);

  useEffect(() => {
    const fetchCurrentQuestionOrder = async () => {
      const current_question_order = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_current_question_order`
      );
      const currentQuestionOrderJson = await current_question_order.json();
      return currentQuestionOrderJson;
    };

    const fetchQuestionFromId = async (questionId) => {
      const current_question_order = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_question_by_id?id=${questionId}`
      );
      const currentQuestionOrderJson = await current_question_order.json();
      return currentQuestionOrderJson;
    };

    if (!initalized) {
      fetchCurrentQuestionOrder().then((questionIds) => {
        questionIds.question_order.forEach((questionId) => {
          fetchQuestionFromId(questionId).then((question) => {
            if (questions.length < questionIds.question_order.length) {
              questions.push(question);

              if (questions.length === questionIds.question_order.length) {
                //sort to ensure question order is correct after async fetches
                questions.sort(function (a, b) {
                  return (
                    questionIds.question_order.indexOf(a.id) -
                    questionIds.question_order.indexOf(b.id)
                  );
                });

                setinitalized(true);
                console.log(questions);
              }
            }
          });
        });
      });
    }
  }, [initalized]);

  function renderQuestions() {
    let questionDivs = [];
    questionDivs.push(<div className="my-3">
      <TextInput label={"Report Title"} id={"report-title"} type="text" />
    </div>)
    questionDivs.push(<div className="my-3">
      <TextInput label={"Session Date"} id={"session-date"} type="date" />
    </div>)
    if (document.getElementById("session-date") != null) {
      document.getElementById("session-date").valueAsDate = new Date();
    }
    questions.forEach(function (q, i) {
      if (q.type == "Short answer") {
        questionDivs.push(<div className="my-3">
          <TextInput label={q.question} description={q.description} id={q.id} type="text" />
        </div>)
      } else if (q.type == "Multiple choice") {
        let options = []
        q.options.forEach(function (option, i) {
          options.push({value:option, label:option})
        });
        questionDivs.push(<div className="mb-3">
          <label htmlFor={q.id} className="form-label">
            <div className="question-title">{q.question}</div>
            <div className="question-description">{q.description}</div>
          </label>
          <RadioButtons2 id={q.id} name={q.question} options={options} />
        </div>);
      } else if (q.type == "Long answer") {
        questionDivs.push(<div className="my-3">
          <Textarea label={q.question} id={q.id} type="text" />
        </div>)
      } else if (q.type == "Date") {
        console.log(q, i);
      } else {
        console.log("wrong question type")
      }
    });
    return questionDivs;
  }

  return (
    <div>
    <div className="submit-report-header">
      <h1>Submit Progress Report</h1>
    </div>
    <div className="container">
      <form className="submit-report-form" onSubmit={handleSubmit}>
        {renderQuestions()}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <div className="my-3 text-danger" id="error-div-mentor"></div>
      </form>
    </div>
    </div>
    // <div className="progress-report-template">
    //   <h1>Progress Report Template</h1>
    //   <div className="template-container">
    //     <DragDropContext onDragEnd={handleDrop}>
    //       <Droppable droppableId="list-container">
    //         {(provided) => (
    //           <div
    //             className="list-container"
    //             {...provided.droppableProps}
    //             ref={provided.innerRef}
    //           >
    //             {questions.map((question, index) => (
    //               <Draggable
    //                 key={question.id}
    //                 draggableId={question.question}
    //                 index={index}
    //               >
    //                 {(provided) => (
    //                   <div
    //                     className="item-container"
    //                     ref={provided.innerRef}
    //                     {...provided.dragHandleProps}
    //                     {...provided.draggableProps}
    //                   >
    //                     <img
    //                       id="hamburger-icon"
    //                       src={hamburgerIcon}
    //                       alt="hamburger"
    //                     />
    //                     <ProgressReportTemplateQuestionForm
    //                       key={question.id}
    //                       question={question}
    //                       onChange={handleQuestionChange}
    //                       onDelete={onDeleteQuestion}
    //                     />
    //                   </div>
    //                 )}
    //               </Draggable>
    //             ))}
    //             {provided.placeholder}
    //           </div>
    //         )}
    //       </Droppable>
    //     </DragDropContext>

    //     <button onClick={onAddQuestion} id="add-question-button" type="submit">
    //       <img id="plus-icon" src={plusIcon} /> Add Question
    //     </button>
    //   </div>
    //   <button onClick={onPublish} id="publish-button" type="submit">
    //     Publish
    //   </button>
    // </div>
  );
};

export default SubmitProgressReport;

