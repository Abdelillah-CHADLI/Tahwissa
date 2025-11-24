import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProgressSteps } from "../../components/profile_completion/ProgressSteps";
import { StepForms } from "../../components/profile_completion/StepForms";
import { Navigation } from "../../components/profile_completion/Navigation";
import type {
  ProfileFormData,
  ProfileCompletionPageProps,
} from "../../types/profile";

export function ProfileCompletionPage({
  accountType: propAccountType,
  signupData,
  onComplete,
  onBack,
  initialData = {},
}: ProfileCompletionPageProps) {
  const accountType = signupData?.accountType || propAccountType || "traveler";
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string>("");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    bio: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    yearsExperience: "",
    services: "",
    description: "",
    interests: [],
    ...initialData,
  });

  const isTraveler = accountType === "traveler";
  const isAgencyOrGuide = accountType === "agency" || accountType === "guide";
  const totalSteps = isTraveler ? 1 : 3;

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const handleSkip = () => onComplete(formData);

  const canProceed = () => {
    if (isTraveler) return true;
    switch (step) {
      case 1:
        return !!(formData.name && formData.bio && formData.location);
      case 2:
        return !!(formData.yearsExperience && formData.services);
      case 3:
        return !!(formData.email && formData.phone);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-[#348086] to-[#2a6970] p-8 text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold mb-2">
                {isTraveler
                  ? "Welcome! Let's personalize your experience"
                  : "Complete Your Profile"}
              </h1>
              <p className="opacity-90">
                {isTraveler
                  ? "Help us tailor your travel experience (optional)"
                  : "Provide essential information to start offering your services"}
              </p>
            </motion.div>

            {isAgencyOrGuide && (
              <ProgressSteps currentStep={step} totalSteps={totalSteps} />
            )}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <StepForms
                step={step}
                formData={formData}
                accountType={accountType}
                profileImage={profileImage}
                onUpdate={updateFormData}
                onImageChange={setProfileImage}
                onToggleInterest={toggleInterest}
              />
            </AnimatePresence>

            <Navigation
              currentStep={step}
              totalSteps={totalSteps}
              isTraveler={isTraveler}
              canProceed={canProceed()}
              onBack={handleBack}
              onNext={handleNext}
              onSkip={handleSkip}
              onBackAvailable={!!onBack}
            />
          </div>
        </div>

        {isAgencyOrGuide && step === 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4 text-sm text-gray-600"
          >
            Note: You must complete your profile before offering services
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}