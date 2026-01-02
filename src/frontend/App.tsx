import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgencyApp from "./AgencyApp";
import TravelerApp from "./TravelerApp";
import AdminApp from "./AdminApp";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TravelerApp />} />
        <Route path="/agency/*" element={<AgencyApp />} />
        <Route path="/traveler/*" element={<TravelerApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
