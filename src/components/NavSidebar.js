import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import "../styles/NavSidebar.css";


const NavSidebar = () => {

  function getUser() {
    switch(window.location.pathname.split('/')[1]){
      case 'admin-portal':
        return 'admin';
      case 'mentor-portal':
        return 'mentor';
    }
  }

  return (
    getUser() == 'admin' ?
      <Menu id="sidebar">
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
    :
      <Menu id="sidebar">
        <a className="menu-item" href="/mentor-portal/submit-progress-report">
          Submit Progress Report
        </a>
      </Menu>
  );
};

export default NavSidebar;