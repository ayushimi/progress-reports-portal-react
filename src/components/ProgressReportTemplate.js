import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../styles/ProgressReportTemplate.css";
import ProgressReportTemplateQuestionForm from "./ProgressReportTemplateQuestionForm";
import hamburger from '../images/hamburger.png';

const ProgressReportTemplate = () => {

  const [initalized, setinitalized] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionsBeforeSave, setQuestionsBeforeSave] = useState([]);


  function handleQuestionChange(updatedQuestion) {
    const index = questions.map(q => q.id).indexOf(updatedQuestion.id);
    questions[index] = updatedQuestion;
    console.log(questions);
    console.log(questionsBeforeSave)
  }

  const setQuestionOrder = () => {
    let questionOrder = [];
    for(let i = 0; i < questions.length; i++) {
      questionOrder.push(questions[i].id);
    }
    fetch(`https://progress-reports-portal-node.herokuapp.com/set_current_question_order?order=${questionOrder}`).then((response) => {
      console.log(response);
    });

  };

  const onPublish = () => {
    setQuestionOrder();
  }

  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...questions];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setQuestions(updatedList);
  };

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
                setQuestionsBeforeSave(JSON.parse(JSON.stringify(questions)))
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
      <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="list-container">
        {(provided) => (
          <div
            className="list-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {questions.map((question, index) => (
              <Draggable key={question.id} draggableId={question.question} index={index}>
                {(provided) => (
                  <div
                    className="item-container"
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                  >
                    <img className="hamburger" src={hamburger} alt="hamburger"/>
                    <ProgressReportTemplateQuestionForm key={question.id} question={question} onChange={handleQuestionChange} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    <button onClick={onPublish} id="publish" type="submit">Publish</button>
  </div>
    // <div className="progress-report-template">
    //   <h1>Progress Report Template</h1>
    //   <div>
    //     {questions.map((question) => (
    //       <ProgressReportTemplateQuestionForm key={question.id} question={question} />
    //     ))}
    //   </div>
    // </div>
  );
};

export default ProgressReportTemplate;