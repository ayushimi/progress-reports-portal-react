import React from 'react';
import usc_viterbi from '../images/usc_viterbi.jpg';
import "../styles/Header.css";

function Header() {
  return (
    <div>
      <div id="header-div">
        <div class="center">
          <img id="logo" src={usc_viterbi} alt="USC Viterbi"></img>
        </div>
        <h2 id="title">Center for Engineering Diversity Peer Mentor Portal</h2>
        <div className="clearfloat"></div>
      </div> 
    </div>
  )
}

export default Header;