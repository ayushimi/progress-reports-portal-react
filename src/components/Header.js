import React from 'react'
import usc_viterbi from '../images/usc_viterbi.jpg'
import "../styles/Header.css";
import NavSidebar from './NavSidebar';

function Header() {
  return (
    <div>
      <div id="header-div">
        <img id="logo" src={usc_viterbi} alt="USC Viterbi"></img>
        <h2 id="title">Center for Engineering Diversity Peer Mentor Portal</h2>
      </div>
      <div className="clearfloat"></div>
    </div>
  )
}

export default Header;