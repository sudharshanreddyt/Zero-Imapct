import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInEmailPassword from './SignInEmailPassword';
import SignUpEmailPassword from './SignUpEmailPassword';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignInEmailPassword />} />
        <Route path="/signup" element={<SignUpEmailPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<SignInEmailPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
