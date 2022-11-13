import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../styles/ProgressReportTemplate.css";
import ProgressReportTemplateQuestionForm from "./ProgressReportTemplateQuestionForm";
import hamburgerIcon from "../images/hamburger.png";
import plusIcon from "../images/plus-btn.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProgressReportTemplate = () => {
  const [initalized, setinitalized] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionsBeforeSave, setQuestionsBeforeSave] = useState([]);
  const [published, setPublished] = useState(false);

  function handleQuestionChange(updatedQuestion) {
    const index = questions.map((q) => q.id).indexOf(updatedQuestion.id);
    questions[index] = updatedQuestion;
  }

  const setQuestionOrder = async () => {
    let questionOrder = [];
    for (let i = 0; i < questions.length; i++) {
      const matchingIndex = questionsBeforeSave
        .map((q) => q.id)
        .indexOf(questions[i].id);
      console.log(matchingIndex);
      if (matchingIndex != -1) {
        //if question exists and is unchanged, push the question id to the order
        if (
          JSON.stringify(questionsBeforeSave[matchingIndex]) ===
          JSON.stringify(questions[i])
        ) {
          questionOrder.push(questions[i].id);
        } else { //if only change made to question is to make it required/not required, set required/not required via endpoint
          // console.log(questions[i].question);
          console.log(questionsBeforeSave[i]);
          if (
            questions[i].question === questionsBeforeSave[i].question &&
            questions[i].description === questionsBeforeSave[i].description &&
            questions[i].type === questionsBeforeSave[i].type &&
            questions[i].options === questionsBeforeSave[i].options &&
            questions[i].required !== questionsBeforeSave[i].required
          ) {
            if(questions[i].required) {
              fetch(`https://progress-reports-portal-node.herokuapp.com/question_required?id=${questions[i].id}`).then((response) => {
              });
            }else {
              fetch(`https://progress-reports-portal-node.herokuapp.com/question_not_required?id=${questions[i].id}`).then((response) => {
              });
            }
            questionOrder.push(questions[i].id);
          } else { //if existing question is updated or new question is added, retrieve new question id and push id to the order
            let endpoint = `https://progress-reports-portal-node.herokuapp.com/add_question?question=${encodeURIComponent(questions[i].question)}&description=${encodeURIComponent(questions[i].description)}&type=${questions[i].type}&required=${questions[i].required}`;
            if (questions[i].options != null) {
              for (let j = 0; j < questions[i].options.length; j++) {
                endpoint += `&option=${questions[i].options[j]}`;
              }
            }
            // console.log(endpoint)
            const newId = await fetch(endpoint);
            const newIdJson = await newId.json();
            questionOrder.push(newIdJson.id);
          }
        }
      } else { //if existing question is updated or new question is added, retrieve new question id and push id to the order
        let endpoint = `https://progress-reports-portal-node.herokuapp.com/add_question?question=${encodeURIComponent(questions[i].question)}&description=${encodeURIComponent(questions[i].description)}&type=${questions[i].type}&required=${questions[i].required}`;
        if (questions[i].options != null) {
          for (let j = 0; j < questions[i].options.length; j++) {
            endpoint += `&option=${questions[i].options[j]}`;
          }
        }
        console.log(endpoint)
        const newId = await fetch(endpoint);
        const newIdJson = await newId.json();
        console.log(newIdJson)
        questionOrder.push(newIdJson.id);
      }
    }
    fetch(
      `https://progress-reports-portal-node.herokuapp.com/set_current_question_order?order=${questionOrder}`
    ).then((response) => {
      console.log(questionOrder);
    });
  };

  const onPublish = () => {
    setQuestionOrder();
    setPublished(true);
  };

  useEffect(() => {
    if(published) {
      toast.success("Progress report template updated successfully!", {className: 'toast-message'});
    }
  }, [published]);

  const onAddQuestion = () => {
    const newQuestion = {
      //unique id necessary
      id: "new_question" + questions.length + 1,
      question: "New Question",
      description: "",
      type: "text",
      options: null
    };
    setQuestions([...questions, newQuestion]);
  };

  const onDeleteQuestion = (questionId) => (e) => {
    const index = questions.map((q) => q.id).indexOf(questionId);
    let questionsModify = [...questions];
    questionsModify.splice(index, 1);
    setQuestions([...questionsModify]);
  };

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

                setQuestionsBeforeSave(JSON.parse(JSON.stringify(questions)));
                setinitalized(true);
                console.log(questions);
              }
            }
          });
        });
      });
    }
  }, [initalized, questions]);

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
                  <Draggable
                    key={question.id}
                    draggableId={question.question}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="item-container"
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <img
                          id="hamburger-icon"
                          src={hamburgerIcon}
                          alt="hamburger"
                        />
                        <ProgressReportTemplateQuestionForm
                          key={question.id}
                          question={question}
                          onChange={handleQuestionChange}
                          onDelete={onDeleteQuestion}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button onClick={onAddQuestion} id="add-question-button" type="submit">
          <img id="plus-icon" alt="" src={plusIcon} /> Add Question
        </button>
      </div>
      <button onClick={onPublish} id="publish-button" type="submit">
        Publish
      </button>
      <ToastContainer />
    </div>
  );
};

export default ProgressReportTemplate;
