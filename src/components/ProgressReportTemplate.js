import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../styles/ProgressReportTemplate.css";
import ProgressReportTemplateQuestionForm from "./ProgressReportTemplateQuestionForm";

const ProgressReportTemplate = () => {

  const [initalized, setinitalized] = useState(false);
  const [questions, setQuestions] = useState([]);

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
    

    if(!initalized) {
      fetchCurrentQuestionOrder().then((questionIds) => {
        (questionIds.question_order).forEach((questionId) => {
          fetchQuestionFromId(questionId).then((question) => {
            if(questions.length < questionIds.question_order.length) {
              questions.push(question);
              if(questions.length == questionIds.question_order.length) {
                setinitalized(true);
              }
            }
          })
        })
      })
    }

  }, [initalized]);

  return (
    <div className="progress-report-template">
      <h1>Progress Report Template</h1>
      <div>
        {questions.map((question) => (
          <ProgressReportTemplateQuestionForm key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default ProgressReportTemplate;