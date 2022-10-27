import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Textarea from "../reusable/Textarea";
import "../styles/ProgressReport.css";
import $ from "jquery";
import MentorProfile from "./MentorProfile";
import MenteeProfileSimple from "./MenteeProfileSimple";

export default function ViewProgressReport() {
  const { reportId } = useParams();
  const [initalized, setinitalized] = useState(false);
  const [reportQA, setReportQA] = useState([
    [
      {
        question_id: "",
        question: ""
      }
    ]
  ]);
  const [reportInfo, setReportInfo] = useState({
    name: ""
  });
  const [mentee, setMentee] = useState("");
  const [mentor, setMentor] = useState("");
  const [feedback, setFeedback] = useState("");
  const [approved, setApproved] = useState("");
  const mentorPortalView = useLocation().pathname.includes("mentor-portal");
  const navigate = useNavigate();
  const [ profile, setProfile ] = useState({
    email: "",
    id: "",
    major: "",
    name: "",
    phone_number: "",
    usc_id: "",
    semester_entered: "",
    freshman: "",
    meetings: "",
  });
  // const [ mentee_mentorId, setMenteeMentorId ] = useState("");

  useEffect(() => {
    const fetchMentor = async (mentorId) => {
      const mentors = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${mentorId}&role=mentor`
      );
      const mentorsJson = await mentors.json();
      return mentorsJson;
    };

    const fetchMentee = async (menteeId) => {
      const mentees = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_user_info?id=${menteeId}&role=mentee`
      );
      const menteesJson = await mentees.json();
      return menteesJson;
    };

    const fetchProgressReportInfo = async (reportId) => {
      const reportInfo = await fetch(
        `https://progress-reports-portal-node.herokuapp.com/get_progress_report?id=${reportId}`
      );
      const reportInfoJson = await reportInfo.json();
      return reportInfoJson;
    };

    if (!initalized) {
      fetchProgressReportInfo(reportId).then((info) => {
        setReportInfo(info.report_info);
        setFeedback(info.report_info.feedback);
        setApproved(info.report_info.approved);
        const orderedQuestionsAnswers = info.report_info.question_order.map(
          (question_id) => {
            return info.questions_answers.filter((qa) => {
              return qa.question_id === question_id;
            });
          }
        );
        setReportQA(orderedQuestionsAnswers);
        fetchMentee(info.report_info.mentee_id).then((student) => {
          setMentee(student);
        });
        fetchMentor(info.report_info.mentor_id).then((student) => {
          setMentor(student);
        });
      });
    }
  }, []);
  // console.log(mentorPortalView);

  return (
    <div>
    <div className="blur">
      <h1>Progress Report</h1>
      <div id="report-display" className="ps-5 pe-5 pt-4">
        <h2 className="display-4 pb-3">{reportInfo.name}</h2>
        <p className="less-space ment-name">
          <strong>Mentor: </strong> 
          <span 
            className="red-text"
            onClick={() => {
              $(".mentor-profile-popup").css("display", "block");
              $(".blur").css("filter", "blur(2px)");
              setProfile(mentor);
            }}
            >
            {mentor.name}
          </span>
        </p>
        <p className="pb-1 ment-name">
          <strong>Mentee: </strong> 
          <span 
            className="red-text"
            onClick={() => {
              $(".mentee-simple-profile-popup").css("display", "block");
              $(".blur").css("filter", "blur(2px)");
              setProfile(mentee);
            }}
            >
            {mentee.name}
          </span>
        </p>
        <div id="questions">
          {reportQA.map((q) => {
            const currQA = q[0];
            return (
              <div key={currQA.question_id}>
                <p className="less-space">
                  <strong>{currQA.question}:</strong>
                </p>
                <p className="pb-1">{currQA.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
      <hr />
      <div id="feedback-div" className="ps-5 pe-5">
        <h3 className="mb-0">Feedback:</h3>
        {mentorPortalView && !approved ? (
          <p>Pending approval</p>
        ) : approved ? (
          <p>{feedback}</p>
        ) : (
          <form>
            <Textarea
              id="feedback"
              value={feedback}
              type="text"
              onChange={(updatedFeedback) => {
                setFeedback(updatedFeedback);
                fetch(
                  `https://progress-reports-portal-node.herokuapp.com/approve_report?id=${reportId}`
                );
              }}
            />
            <button
              type="submit"
              className="btn btn-custom1"
              onClick={() => {
                fetch(
                  `https://progress-reports-portal-node.herokuapp.com/add_feedback?id=${reportId}&feedback=${encodeURIComponent(feedback)}`
                );
                navigate(`/admin-portal/review-progress-reports`);
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-custom2"
              onClick={() => {
                navigate(`/admin-portal/review-progress-reports`);
              }}
            >
              Back
            </button>
            <div className="clearfloat"></div>
          </form>
        )}
      </div>
    </div>
    <MentorProfile profile={profile} />
    <MenteeProfileSimple profile={profile} />
    </div>
  );
}
