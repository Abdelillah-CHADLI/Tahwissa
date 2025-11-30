import { motion } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Briefcase,
  Users,
  MapPin,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import { authService } from "../../services/authService";
import type { SignupRequest, User as UserType } from "../../types/auth";

export default function SignUpPage() {
  const [accountType, setAccountType] = useState("traveler");
  const [agencyName, setAgencyName] = useState("");
  const [guideName, setGuideName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (
      accountType === "agency" &&
      (!agencyName || !location || !phoneNumber)
    ) {
      setError("Please fill in all agency details");
      return;
    }

    if (accountType === "guide" && (!guideName || !location || !phoneNumber)) {
      setError("Please fill in all guide details");
      return;
    }

    if (accountType === "traveler" && (!firstName || !lastName)) {
      setError("Please fill in your name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const baseData: SignupRequest = {
        email,
        password,
        confirmPassword,
        userType: (accountType === "traveler" ? "traveller" : accountType) as
          | "traveller"
          | "guide"
          | "agency",
      };

      let signupData: SignupRequest = { ...baseData };

      if (accountType === "traveler") {
        signupData = {
          ...signupData,
          firstName,
          lastName,
        };
      } else if (accountType === "guide") {
        signupData = {
          ...signupData,
          guideName,
          location,
          phoneNumber,
        };
      } else {
        signupData = {
          ...signupData,
          agencyName,
          location,
          phoneNumber,
        };
      }

      const response = await authService.signup(signupData);

      if (response.success) {

        navigate(ROUTES.SIGN_IN, {
          replace: true,
          state: {
            justSignedUp: true,
            email: email, 
            message: "Account created successfully! Please sign in."
          },
        });
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleSignIn = () => {
    navigate(ROUTES.SIGN_IN);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateAccount();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 xs:p-6 py-8 xs:py-12">
      <div className="w-full max-w-2xl mb-6 xs:mb-8">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm xs:text-base"
        >
          <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-6 xs:p-8">
          <div className="text-center mb-6 xs:mb-8">
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">
              Create an Account
            </h1>
            <p className="text-gray-600 text-sm xs:text-base">
              Join thousands of travelers exploring Algeria
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-1 grid grid-cols-3 gap-1 mb-6">
            <button
              onClick={() => setAccountType("traveler")}
              className={`flex items-center justify-center gap-1 xs:gap-2 px-2 xs:px-4 py-2 xs:py-2.5 rounded-md font-medium transition-all text-xs xs:text-sm ${
                accountType === "traveler"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-3 h-3 xs:w-4 xs:h-4" />
              Traveler
            </button>

            <button
              onClick={() => setAccountType("guide")}
              className={`flex items-center justify-center gap-1 xs:gap-2 px-2 xs:px-4 py-2 xs:py-2.5 rounded-md font-medium transition-all text-xs xs:text-sm ${
                accountType === "guide"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-3 h-3 xs:w-4 xs:h-4" />
              Guide
            </button>

            <button
              onClick={() => setAccountType("agency")}
              className={`flex items-center justify-center gap-1 xs:gap-2 px-2 xs:px-4 py-2 xs:py-2.5 rounded-md font-medium transition-all text-xs xs:text-sm ${
                accountType === "agency"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Briefcase className="w-3 h-3 xs:w-4 xs:h-4" />
              Agency
            </button>
          </div>

          <div className="space-y-4 xs:space-y-5" onKeyPress={handleKeyPress}>
            {accountType === "agency" && (
              <>
                <div>
                  <label
                    htmlFor="agencyName"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Agency Name *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                    <input
                      id="agencyName"
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Your Agency Name"
                      className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <label
                      htmlFor="agencyLocation"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Agency Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                      <input
                        id="agencyLocation"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="agencyPhone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                      <input
                        id="agencyPhone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+213 XXX XXX XXX"
                        className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {accountType === "guide" && (
              <>
                <div>
                  <label
                    htmlFor="guideName"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Guide Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                    <input
                      id="guideName"
                      type="text"
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      placeholder="Your Guide Name"
                      className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <label
                      htmlFor="guideLocation"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                      <input
                        id="guideLocation"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="guidePhone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                      <input
                        id="guidePhone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+213 XXX XXX XXX"
                        className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {accountType === "traveler" && (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                      disabled={isLoading}
                    />
                  </div>
                </div>

              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    accountType === "agency"
                      ? "agency@example.com"
                      : accountType === "guide"
                      ? "guide@example.com"
                      : "your.email@example.com"
                  }
                  className="w-full pl-10 xs:pl-11 pr-4 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 xs:pl-11 pr-11 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 xs:pl-11 pr-11 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all text-sm xs:text-base"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleCreateAccount}
              disabled={isLoading}
              className="w-full bg-[#348086] hover:bg-[#2a6970] disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg disabled:scale-100 disabled:shadow-md text-sm xs:text-base min-h-12"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Users className="w-4 h-4 xs:w-5 xs:h-5" />
              )}
              {isLoading
                ? "Creating Account..."
                : accountType === "agency"
                ? "Create Agency Account"
                : accountType === "guide"
                ? "Create Guide Account"
                : "Create Account"}
            </button>
          </div>

          <p className="text-center text-xs xs:text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              onClick={handleSignIn}
              className="text-[#348086] hover:text-[#2a6970] font-semibold transition-colors"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}