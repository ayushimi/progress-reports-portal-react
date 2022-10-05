import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import {Link} from 'react-router-dom';
import "../styles/NavSidebar.css";


export default props => {
  return (
    <Menu>
      <a className="menu-item" href="/admin-portal/review-progress-reports">
        Review Progress Reports
      </a>
      <a className="menu-item" href="/admin-portal/progress-report-template">
        Progress Report Template
      </a>
      <a className="menu-item" href="/admin-portal/manage-mentorships">
        Manage Mentorships
      </a>
      <a className="menu-item" href="/admin-portal/manage-accounts">
        Manage Accounts
      </a>
    </Menu>
  );
};