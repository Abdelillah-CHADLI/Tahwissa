import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AgencyDashboard } from './pages/AgencyDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgencyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
