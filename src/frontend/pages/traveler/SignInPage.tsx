import { motion } from "motion/react";
import { ArrowLeft, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import { authService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import type { LoginRequest } from "../../types/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check for success message from signup redirect
  const justSignedUp = location.state?.justSignedUp;
  const signupEmail = location.state?.email;
  const signupMessage = location.state?.message;

  // Pre-fill email if coming from signup
  useState(() => {
    if (justSignedUp && signupEmail && !email) {
      setEmail(signupEmail);
    }
  });

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const loginData: LoginRequest = {
        email,
        password,
      };

      console.log(" SignInPage: Starting login process...");

      const response = await authService.login(loginData);

      console.log(" SignInPage: AuthService response:", response);

      if (response.success && response.user) {
        console.log(
          " SignInPage: Login successful, calling AuthContext login..."
        );

        // Store user in context and localStorage
        login(response.user);

        const user = response.user;

        console.log(" SignInPage: Current user after login:", user);
        console.log(" SignInPage: User type:", user.userType);
        console.log(" SignInPage: User ID:", user.id);
        console.log(" SignInPage: User role:", user.role);

        // ROUTING LOGIC
        if (user.userType === "agency" || user.userType === "guide") {
          console.log(
            " SignInPage: REDIRECTING TO AGENCY APP:",
            user.userType
          );
          window.location.href = "/agency";
        } else {
          console.log(" SignInPage: REDIRECTING TO HOME (TRAVELLER)");
          navigate(ROUTES.HOME, {
            state: {
              profileId: user.profileId,
              profileType: "traveller",
              userId: user.userId,
            },
          });
        }
      } else {
        console.log(" SignInPage: Login failed:", response.message);
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.log(" SignInPage: Login error:", err);
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleSignUp = () => {
    navigate(ROUTES.SIGN_UP);
  };

  const handleForgotPassword = () => {
    console.log("Navigate to forgot password");
    // TODO: Implement forgot password flow
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mb-8">
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
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue your journey
            </p>
          </div>

          {/* Success message from signup */}
          {justSignedUp && signupMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm text-center">
                {signupMessage}
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-5" onKeyPress={handleKeyPress}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#348086] hover:text-[#2a6970] font-medium transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-[#348086] hover:bg-[#2a6970] disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg disabled:scale-100 disabled:shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <button
              onClick={handleSignUp}
              className="text-[#348086] hover:text-[#2a6970] font-semibold transition-colors"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}