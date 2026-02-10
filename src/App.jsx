import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import JobApplications from './pages/JobApplications';
import Resumes from './pages/Resumes';
import Subscriptions from './pages/Subscriptions';
import Archive from './pages/Archive';
import Settings from './pages/Settings';

function App({ isDarkMode, onToggleTheme }) {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Layout isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />}
        >
          <Route index element={<JobApplications />} />
          <Route path="resumes" element={<Resumes />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="archive" element={<Archive />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
