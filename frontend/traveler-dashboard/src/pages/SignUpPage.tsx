import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, User, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routes';

export default function SignUpPage() {
  const [accountType, setAccountType] = useState('traveler');
  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    console.log('Create account with:', {
      accountType,
      agencyName,
      contactPerson,
      phoneNumber,
      email,
      password,
      confirmPassword
    });
  };



  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleSignIn = () => {
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 py-12">
      <div className="w-full max-w-2xl mb-8">
        <button 
          onClick={handleBackToHome}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
            <p className="text-gray-600">Join thousands of travelers exploring Algeria</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-1 grid grid-cols-2 gap-1 mb-6">
            <button
              onClick={() => setAccountType('traveler')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all ${
                accountType === 'traveler'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Traveler
            </button>
            
            <button
              onClick={() => setAccountType('agency')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all ${
                accountType === 'agency'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Agency/Guide
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {accountType === 'agency' && (
              <>
                <div>
                  <label htmlFor="agencyName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Agency/Guide Name
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="agencyName"
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Your Agency or Guide Name"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Person
                    </label>
                    <input
                      id="contactPerson"
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+213 XXX XXX XXX"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={accountType === 'agency' ? 'agency@example.com' : 'your.email@example.com'}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleCreateAccount}
              className="w-full bg-[#348086] hover:bg-[#2a6970] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              <Users className="w-5 h-5" />
              {accountType === 'agency' ? 'Create Agency Account' : 'Create Account'}
            </button>
          </div>



          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={handleSignIn}
              className="text-[#348086] hover:text-[#2a6970] font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>


    </div>
  );
}