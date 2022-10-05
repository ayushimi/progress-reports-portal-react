import './App.css';

import NavSidebar from './components/NavSidebar';
import Login from './components/Login';
import MentorHome from './components/MentorHome';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import AdminHome from './components/AdminHome';
import ProgressReportTemplate from './components/ProgressReportTemplate';
import ManageMentorships from './components/ManageMentorships';
import ManageAccounts from './components/ManageAccounts';

function App() {
  return (
    <div>
      <div>
        <div id="page-wrap">
          <Header id="header" />
        </div>
        <hr></hr>
        <NavSidebar id="sidebar" />
      </div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/mentor-portal" element={<MentorHome />} />
          <Route path="/admin-portal/review-progress-reports" element={<AdminHome />} />
          <Route path="/admin-portal/progress-report-template" element={<ProgressReportTemplate/>}/>
          <Route path="/admin-portal/manage-mentorships" element={<ManageMentorships/>}/>
          <Route path="/admin-portal/manage-accounts" element={<ManageAccounts/>}/>
        </Routes>
      </Router>
  </div>

  );
}

export default App;
