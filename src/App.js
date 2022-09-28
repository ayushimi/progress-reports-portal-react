import './App.css';

import Login from './components/Login';
import MentorHome from './components/MentorHome';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import AdminHome from './components/AdminHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/mentor-home" element={<MentorHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
