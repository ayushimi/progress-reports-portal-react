import React from "react";
import "../styles/ProgressReportTemplate.css";

const ProgressReportTemplateQuestionForm = ({ question }) => {
  const [toggle, setToggle] = React.useState(false);

  const showDropdown = (e) => {
    setToggle(!toggle);
  };
  return (
    <div className="dropdown">
      <button onClick={showDropdown} className="dropbtn">
        Dropdown
      </button>
      <div
        style={{ display: toggle ? "block" : "none" }}
        className="dropdown-content"
      >
      <div class="container">
        <form>
          <label>First Name</label>
          <input type="text" name="first"/><br />
          <label>Last Name</label>
          <input type="text" name="last"/><br />
          <label>Email</label>
          <input type="text" name="email"/><br />
          <input type="submit" value="Submit" />
        </form>
      </div>
      </div>
    </div>
  );
};

export default ProgressReportTemplateQuestionForm;
