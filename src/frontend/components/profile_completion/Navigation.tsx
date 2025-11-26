import { ArrowLeft } from "lucide-react";
import { Button } from "./FormComponents";

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  isTraveler: boolean;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onBackAvailable?: boolean;
}

export function Navigation({ 
  currentStep, 
  totalSteps, 
  isTraveler, 
  canProceed, 
  onBack, 
  onNext, 
  onSkip, 
  onBackAvailable = true 
}: NavigationProps) {
  if (isTraveler) {
    return (
      <div className="flex gap-3 pt-6">
        <Button variant="outline" onClick={onSkip}>Skip for now</Button>
        <Button onClick={onNext}>Complete Setup</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 pt-6">
      <Button variant="outline" onClick={onBack} disabled={currentStep === 1 && !onBackAvailable}>
        {currentStep === 1 && <ArrowLeft className="w-4 h-4 mr-2" />}
        {currentStep === 1 ? "Back" : "Previous"}
      </Button>
      <Button onClick={onNext} disabled={!canProceed}>
        {currentStep === totalSteps ? "Complete Profile" : "Next Step"}
      </Button>
    </div>
  );
}