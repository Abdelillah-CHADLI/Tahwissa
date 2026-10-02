import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const AgencyApp = lazy(() => import('./AgencyApp'));
const TravelerApp = lazy(() => import('./TravelerApp'));
const AdminApp = lazy(() => import('./AdminApp'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="grid min-h-screen place-items-center text-teal-800">Loading Tahwissa…</div>}>
        <Routes>
          <Route path="/" element={<TravelerApp />} />
          <Route path="/agency/*" element={<AgencyApp />} />
          <Route path="/traveler/*" element={<TravelerApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
