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
import CreateAccount from './components/CreateAccount';
import ManageMentorshipsDetails from './components/ManageMentorshipsDetails';
import ViewProgressReport from './components/ViewProgressReport';
import SubmitProgressReport from './components/SubmitProgressReport';
import React, { useState } from "react";
import AddMentorship from './components/AddMentorship';
import ProgressReportHistory from './components/ProgressReportHistory';
import Profile from './components/Profile';
import ExportProgressReports from './components/ExportProgressReports';

function App() {
  return (
    <div>
      <div>
        <div id="page-wrap">
          <Header id="header" />
        </div>
        <NavSidebar/>
      </div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/mentor-portal" element={<MentorHome />} />
          <Route path="/mentor-portal/submit-progress-report/mentor_id=:mentor_id&mentee_id=:mentee_id" element={<SubmitProgressReport />} />
          <Route path="/mentor-portal/progress-report-history/mentee_id=:mentee_id&mentor_id=:mentor_id" element={<ProgressReportHistory />} />
          <Route path="/mentor-portal/view-progress-report/report_id=:reportId" element={<ViewProgressReport />} />
          <Route path="/admin-portal/review-progress-reports" element={<AdminHome />} />
          <Route path="/admin-portal/review-progress-reports/details/report_id=:reportId" element={<ViewProgressReport/>}/>
          <Route path="/admin-portal/progress-report-template" element={<ProgressReportTemplate/>}/>
          <Route path="/admin-portal/manage-mentorships" element={<ManageMentorships/>}/>
          <Route path="/admin-portal/manage-mentorships/details/mentee_id=:mentee_id&mentor_id=:mentor_id" element={<ManageMentorshipsDetails/>}/>
          <Route path="/admin-portal/manage-mentorships/add-mentorship" element={<AddMentorship/>}/>
          <Route path="/admin-portal/manage-accounts" element={<ManageAccounts/>}/>
          <Route path="/admin-portal/manage-accounts/create-account" element={<CreateAccount/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/export" element={<ExportProgressReports/>}/>
        </Routes>
      </Router>
  </div>

  );
}

export default App;
