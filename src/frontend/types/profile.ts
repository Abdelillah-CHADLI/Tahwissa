export type AccountType = "traveler" | "agency" | "guide";

export interface ProfileFormData {
  name: string;
  bio: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  yearsExperience: string;
  services: string;
  description: string;
  interests: string[];
}

export interface ProfileCompletionPageProps {
  accountType?: AccountType;
  signupData?: { accountType: AccountType } | null;
  onComplete: (data: ProfileFormData) => void;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
  initialData?: Partial<ProfileFormData>;
}