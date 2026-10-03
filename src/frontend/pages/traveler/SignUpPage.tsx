import { motion } from "motion/react";
import {
  Compass, ArrowLeft,
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
import type { SignupRequest } from "../../types/auth";

export default function SignUpPage() {
  const [accountType, setAccountType] = useState<
    "traveller" | "guide" | "agency"
  >("traveller");
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
    if (isLoading) return;
    // Reset error
    setError("");

    // Common validation for all user types
    if (!email || !password || !confirmPassword) {
      setError("Email, password, and confirm password are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    // User type specific validation
    if (accountType === "traveller") {
      if (!firstName || !lastName) {
        setError("First name and last name are required for traveller signup");
        return;
      }
    } else if (accountType === "agency") {
      if (!agencyName || !location || !phoneNumber) {
        setError(
          "Agency name, phone number, and location are required for agency signup"
        );
        return;
      }

      // Phone number validation
      const phoneRegex = /^[+]?[0-9\s\-()]{8,}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("Please enter a valid phone number");
        return;
      }
    } else if (accountType === "guide") {
      if (!guideName || !location || !phoneNumber) {
        setError(
          "Guide name, phone number, and location are required for guide signup"
        );
        return;
      }

      // Phone number validation
      const phoneRegex = /^[+]?[0-9\s\-()]{8,}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("Please enter a valid phone number");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Prepare base data
      const baseData: SignupRequest = {
        email,
        password,
        confirmPassword,
        userType: accountType,
      };

      // Add type-specific fields
      let signupData: SignupRequest = { ...baseData };

      if (accountType === "traveller") {
        signupData = {
          ...signupData,
          firstName,
          lastName,
        };
      } else if (accountType === "agency") {
        signupData = {
          ...signupData,
          agencyName,
          location,
          phoneNumber,
        };
      } else if (accountType === "guide") {
        signupData = {
          ...signupData,
          guideName,
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
            message: "Account created successfully! Please sign in.",
          },
        });
      } else {
        setError(response.message || "Signup failed. Please try again.");
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



  // Update account type with proper typing
  const handleAccountTypeChange = (type: "traveller" | "guide" | "agency") => {
    setAccountType(type);
    // Clear previous errors when switching types
    setError("");
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4 xs:p-6 py-8 xs:py-12">
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
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl"
      >
        <div className="panel p-5 sm:p-7">
          <div className="text-center mb-6 xs:mb-8">
            <div className="mb-5 flex items-center justify-center gap-2 text-lg font-bold text-brand-ink"><Compass className="text-brand" size={25} />Tahwissa</div>
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">
              Create an Account
            </h1>
            <p className="text-gray-600 text-sm xs:text-base">
              Find your next adventure or share your local expertise.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-1 grid grid-cols-3 gap-1 mb-6">
            <button
              aria-pressed={accountType === "traveller"} disabled={isLoading} onClick={() => handleAccountTypeChange("traveller")}
              className={`flex items-center justify-center gap-1 xs:gap-2 px-2 xs:px-4 py-2 xs:py-2.5 rounded-md font-medium transition-all text-xs xs:text-sm ${
                accountType === "traveller"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-3 h-3 xs:w-4 xs:h-4" />
              Traveler
            </button>

            <button
              aria-pressed={accountType === "guide"} disabled={isLoading} onClick={() => handleAccountTypeChange("guide")}
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
              aria-pressed={accountType === "agency"} disabled={isLoading} onClick={() => handleAccountTypeChange("agency")}
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

          <form className="space-y-4 xs:space-y-5" onSubmit={event => { event.preventDefault(); void handleCreateAccount(); }}>
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
                      className="field bg-white pl-11"
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
                        className="field bg-white pl-11"
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
                        className="field bg-white pl-11"
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
                      className="field bg-white pl-11"
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
                        className="field bg-white pl-11"
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
                        className="field bg-white pl-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {accountType === "traveller" && (
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
                        className="field bg-white pl-11"
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
                      className="field bg-white"
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
                  id="email" autoComplete="email" required
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
                  className="field bg-white pl-11"
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
                  id="password" autoComplete="new-password" required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="field bg-white pl-11 pr-11"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:bg-brand-soft hover:text-brand"
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
                  id="confirmPassword" autoComplete="new-password" required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="field bg-white pl-11 pr-11"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:bg-brand-soft hover:text-brand"
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
              type="submit"
              disabled={isLoading}
              className="button button-primary min-h-12 w-full"
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
          </form>

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
