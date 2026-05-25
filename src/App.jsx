import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home_New.jsx';

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Camera</Link>
        <Link to="/dictionary" style={{ marginRight: "1rem" }}>Learn Signs</Link>
        <Link to="/profile">My Library</Link>
      </nav>

      {/* Page Routing Logic */}
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;