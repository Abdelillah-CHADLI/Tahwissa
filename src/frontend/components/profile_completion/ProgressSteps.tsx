import { CheckCircle } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  return (
    <div className="flex items-center gap-4 mt-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <div key={stepNum} className="flex items-center gap-2 flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              stepNum <= currentStep
                ? "bg-white text-primary border-white"
                : "bg-white/20 text-white border-white/20"
            }`}
          >
            {stepNum < currentStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="font-medium">{stepNum}</span>
            )}
          </div>
          {stepNum < totalSteps && (
            <div
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                stepNum < currentStep ? "bg-white" : "bg-white/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}