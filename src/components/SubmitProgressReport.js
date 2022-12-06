import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProgressReportTemplate.css";
import "../styles/SubmitProgressReport.css";
import TextInput from "../reusable/TextInput";
import Textarea from "../reusable/Textarea";
import RadioButtons2 from "../reusable/RadioButtons2";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/SubmitProgressReport.css";

const SubmitProgressReport = () => {
  const { mentor_id, mentee_id } = useParams();
  const [initalized, setinitalized] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [ errorInputMissing, setErrorInputMissing ] = useState(false);

  const navigate = useNavigate();


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
      if (question == null || question.value == "" || question.value == undefined) {
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
          `?name=${encodeURIComponent(title)}&mentor_id=${mentor_id}&mentee_id=${mentee_id}&session_date=${date}`).then((response) => {
            return response.json();
          }).then((data) => {
            var id = data.id;
          questions.forEach(function (q, i) {
            fetch(`https://progress-reports-portal-node.herokuapp.com/add_report_content` + 
              `?report_id=${id}&question_id=${q.id}&answer=${encodeURIComponent(answers[i])}`)
          });       
      });
      let currMentorEmail = "";
      fetch(`https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${mentor_id}&role=mentor`).then((response) => {
          return response.json();    
        }).then((data) => {
          currMentorEmail = data.email;
          console.log(currMentorEmail)
          navigate(`/mentor-portal`, {state:{showToast:true,toastMessage:'Progress report successfully submitted!',email:currMentorEmail}});
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
      <TextInput label={"Report Title"} id={"report-title"} type="text" required={true}/>
    </div>)
    questionDivs.push(<div className="my-3">
      <TextInput label={"Session Date"} id={"session-date"} type="date" required={true}/>
    </div>)
    if (document.getElementById("session-date") != null) {
      document.getElementById("session-date").valueAsDate = new Date();
    }
    questions.forEach(function (q, i) {
      if (q.type == "Short answer") {
        questionDivs.push(<div className="my-3">
          <Textarea label={q.question} description={q.description} id={q.id} type="text" required={q.required}/>
        </div>)
      } else if (q.type == "Multiple choice") {
        let options = []
        q.options.forEach(function (option, i) {
          options.push({value:option, label:option})
        });
        questionDivs.push(<div className="mb-3">
          <label htmlFor={q.id} className="form-label">
            <div className={"question-title " + (q.required ? "required" : "")}>{q.question}</div>
            <div className="question-description">{q.description}</div>
          </label>
          <RadioButtons2 id={q.id} name={q.question} options={options} required={q.required}/>
        </div>);
      } else {
        console.log("wrong question type: " + q.type)
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
  );
};

export default SubmitProgressReport;

