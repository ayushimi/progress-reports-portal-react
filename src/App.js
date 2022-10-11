import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminHome from './components/AdminHome';
import Header from './components/Header';
import Login from './components/Login';
import ManageAccounts from './components/ManageAccounts';
import ManageMentorships from './components/ManageMentorships';
import MentorHome from './components/MentorHome';
import NavSidebar from './components/NavSidebar';
import ProgressReportTemplate from './components/ProgressReportTemplate';
import ManageMentorshipsDetails from './components/ManageMentorshipsDetails';

function App() {
  return (
    <div>
      {/* <div id="page-wrap"> */}
        {/* <Header id="header" /> */}
      {/* </div> */}
      
      <div className="App" id="outer-container">
        <NavSidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        <div id="page-wrap">
          <Header id="header" />
          <Router>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/mentor-portal" element={<MentorHome />} />
              <Route path="/admin-portal/review-progress-reports" element={<AdminHome />} />
              <Route path="/admin-portal/progress-report-template" element={<ProgressReportTemplate/>}/>
              <Route path="/admin-portal/manage-mentorships" element={<ManageMentorships/>}/>
              <Route path="/admin-portal/manage-mentorships/details/mentee_id=:mentee_id&mentor_id=:mentor_id" element={<ManageMentorshipsDetails/>}/>
              <Route path="/admin-portal/manage-accounts" element={<ManageAccounts/>}/>
            </Routes>
          </Router>
        </div>
      </div>
  </div>

  );
}

export default App;
