import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { FeedbackProvider } from './components/ui/FeedbackProvider';
import { PageState } from './components/ui';

const AgencyApp = lazy(() => import('./AgencyApp'));
const TravelerApp = lazy(() => import('./TravelerApp'));
const AdminApp = lazy(() => import('./AdminApp'));

function App() {
  return (
    <BrowserRouter>
      <FeedbackProvider><Suspense fallback={<div className="page-shell py-12"><PageState kind="loading" title="Opening Tahwissa" description="Getting everything ready for your next adventure." /></div>}>
        <Routes>
          <Route path="/" element={<TravelerApp />} />
          <Route path="/agency/*" element={<AgencyApp />} />
          <Route path="/traveler/*" element={<TravelerApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense></FeedbackProvider>
    </BrowserRouter>
  );
}

export default App;
