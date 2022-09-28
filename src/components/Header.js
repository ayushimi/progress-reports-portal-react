import React from 'react'
import usc_viterbi from '../images/usc_viterbi.jpg'
import hamburger from '../images/hamburger.png'
import "../styles/Header.css";

function Header() {
  return (
    <div>
      <div id="header-div">
        <img id="hamburger" src={hamburger} alt="navigation menu" />
        <img id="logo" src={usc_viterbi} alt="USC Viterbi"></img>
        <h2 id="title">Center for Engineering Diversity Peer Mentor Portal</h2>
      </div>
      <div className="clearfloat"></div>
      <hr></hr>
    </div>
  )
}

export default Header;