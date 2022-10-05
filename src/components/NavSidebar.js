import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import "../styles/NavSidebar.css";


const NavSidebar = () => {
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

export default NavSidebar;