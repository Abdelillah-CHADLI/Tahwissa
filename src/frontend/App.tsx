import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AgencyApp from './AgencyApp';
import TravelerApp from './TravelerApp';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agency/*" element={<AgencyApp />} />
        <Route path="/traveler/*" element={<TravelerApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
