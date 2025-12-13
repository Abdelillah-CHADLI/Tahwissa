import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
        <p className="text-gray-600 mb-8">Choose your dashboard to continue</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/traveler')}
            className="w-full bg-[#348086] hover:bg-[#2c6e73] text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <span className="text-lg">Traveler Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/agency')}
            className="w-full bg-white border-2 border-[#348086] text-[#348086] hover:bg-gray-50 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <span className="text-lg">Agency Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <span className="text-lg">Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
