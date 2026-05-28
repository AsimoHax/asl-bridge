import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home_New.jsx';
import Library from './components/Library.jsx';
import './styles/App.nav.css';

function NavBar() {
  const location = useLocation();
  return (
    <nav className="app-nav">
      <div className="app-nav-brand">🤟 ASL Bridge</div>
      <div className="app-nav-links">
        <Link to="/" className={`app-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Camera
        </Link>
        <Link to="/dictionary" className={`app-nav-link ${location.pathname === '/dictionary' ? 'active' : ''}`}>
          Learn Signs
        </Link>
        <Link to="/library" className={`app-nav-link ${location.pathname === '/library' ? 'active' : ''}`}>
          My Library
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </Router>
  );
}

export default App;