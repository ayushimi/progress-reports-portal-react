import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../styles/ProgressReportTemplate.css";
import ProgressReportTemplateQuestionForm from "./ProgressReportTemplateQuestionForm";
import hamburgerIcon from '../images/hamburger.png';
import plusIcon from '../images/plus-btn.png';

const ProgressReportTemplate = () => {

  const [initalized, setinitalized] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionsBeforeSave, setQuestionsBeforeSave] = useState([]);


  function handleQuestionChange(updatedQuestion) {
    const index = questions.map(q => q.id).indexOf(updatedQuestion.id);
    questions[index] = updatedQuestion;
  }

  const setQuestionOrder = async () => {
    let questionOrder = [];
    for(let i = 0; i < questions.length; i++) {
      const matchingIndex = questionsBeforeSave.map(q => q.id).indexOf(questions[i].id);
      console.log(matchingIndex);
      if(matchingIndex != null) {
        //if question exists and is unchanged, push the question id to the order
        if(JSON.stringify(questionsBeforeSave[matchingIndex]) === JSON.stringify(questions[i])) {
          questionOrder.push(questions[i].id);
        } else { //if existing question is updated or new question is added, retrieve new question id and push id to the order
          // console.log(questions[i])
          let endpoint = `https://progress-reports-portal-node.herokuapp.com/add_question?question=${questions[i].question}&description=${questions[i].description}&type=${questions[i].type}`;
          if(questions[i].options != null) {
            for(let j = 0; j < questions[i].options.length; j++) {
            endpoint += `&option=${questions[i].options[j]}`;
            }
          }
          // console.log(endpoint)
          const newId = await fetch(endpoint);
          const newIdJson = await newId.json();
          questionOrder.push(newIdJson.id);

        }
      }
    }
    // console.log(questionOrder);

    //update question order
    fetch(`https://progress-reports-portal-node.herokuapp.com/set_current_question_order?order=${questionOrder}`).then((response) => {
      // console.log(response);
    });
  };

  const onPublish = () => {
    setQuestionOrder();
  }

  const onAddQuestion = () => {
    const newQuestion = {
      //unique id necessary
      id: "new_question" + questions.length + 1,
      question: "New Question",
      description: "",
      type: "text",
      options: null,
    };
    setQuestions([...questions, newQuestion]);
  }

  const onDeleteQuestion = (questionId) => (e) => {
    const index = questions.map(q => q.id).indexOf(questionId);
    let questionsModify = [...questions];
    questionsModify.splice(index, 1);
    setQuestions([...questionsModify]);
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
              
              if(questions.length === questionIds.question_order.length) {

                //sort to ensure question order is correct after async fetches
                questions.sort(function (a, b) {
                  return questionIds.question_order.indexOf(a.id) - questionIds.question_order.indexOf(b.id);
                });

                setQuestionsBeforeSave(JSON.parse(JSON.stringify(questions)))
                setinitalized(true);
                console.log(questions)
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
      <div className="template-container">
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
                    <img id="hamburger-icon" src={hamburgerIcon} alt="hamburger"/>
                    <ProgressReportTemplateQuestionForm key={question.id} question={question} onChange={handleQuestionChange} onDelete={onDeleteQuestion} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    
    <button onClick={onAddQuestion} id="add-question-button" type="submit"><img id="plus-icon" src={plusIcon}/> Add Question</button>
    </div>
    <button onClick={onPublish} id="publish-button" type="submit">Publish</button>   
  </div>
  );
};

export default ProgressReportTemplate;