import { motion } from "motion/react";
import type { ProfileFormData, AccountType } from "../../types/profile";
import { User, MapPin, Briefcase, Mail, Phone, Globe, FileText, Calendar, Heart, CheckCircle } from "lucide-react";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { Input, Textarea, FormField, Badge } from "./FormComponents";

const TRAVELER_INTERESTS = [
  "Desert Adventures", "Mountain Hiking", "Cultural Tours", "Beach & Coast",
  "Historical Sites", "Food & Cuisine", "Photography", "Wildlife", "Local Markets", "Traditional Crafts",
];

const MAX_BIO_LENGTH = 500;

interface StepFormsProps {
  step: number;
  formData: ProfileFormData;
  accountType: AccountType;
  profileImage: string;
  onUpdate: (field: string, value: string | string[]) => void; 
  onImageChange: (image: string) => void;
  onToggleInterest: (interest: string) => void;
}

export function StepForms({ 
  step, 
  formData, 
  accountType, 
  profileImage, 
  onUpdate, 
  onImageChange, 
  onToggleInterest 
}: StepFormsProps) {
  
  if (accountType === "traveler") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
        <ProfileImageUpload image={profileImage} onImageChange={onImageChange} type="user" size="lg" />

        <FormField label="What interests you? (Select all that apply)" icon={Heart}>
          <div className="flex flex-wrap gap-2">
            {TRAVELER_INTERESTS.map(interest => (
              <Badge key={interest} active={formData.interests.includes(interest)} onClick={() => onToggleInterest(interest)}>
                {interest}
              </Badge>
            ))}
          </div>
        </FormField>
      </motion.div>
    );
  }

  switch (step) {
    case 1:
      return (
        <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Basic Information</h3>
            <p className="text-sm text-gray-600">Tell us about your {accountType === "agency" ? "agency" : "services"}</p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <ProfileImageUpload image={profileImage} onImageChange={onImageChange} type={accountType === "agency" ? "logo" : "user"} />
          </div>

          <FormField label={`${accountType === "agency" ? "Agency" : "Your"} Name`} icon={User} required>
            <Input placeholder={`Enter ${accountType === "agency" ? "agency" : "your"} name`} value={formData.name} onChange={e => onUpdate("name", e.target.value)} />
          </FormField>

          <FormField label="Bio / Description" icon={FileText} required>
            <Textarea placeholder="Tell travelers about your expertise, experience, and what makes your services unique..." value={formData.bio} onChange={e => onUpdate("bio", e.target.value)} />
            <p className="text-xs text-gray-500">{formData.bio.length}/{MAX_BIO_LENGTH} characters</p>
          </FormField>

          <FormField label="Location" icon={MapPin} required>
            <Input placeholder="City, Algeria (e.g., Algiers, Oran, Tamanrasset)" value={formData.location} onChange={e => onUpdate("location", e.target.value)} />
          </FormField>
        </motion.div>
      );

    case 2:
      return (
        <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Professional Details</h3>
            <p className="text-sm text-gray-600">Share your experience and services</p>
          </div>

          <FormField label="Years of Experience" icon={Calendar} required>
            <Input type="number" placeholder="e.g., 5" value={formData.yearsExperience} onChange={e => onUpdate("yearsExperience", e.target.value)} />
          </FormField>

          <FormField label="Tours / Services Offered" icon={Briefcase} required>
            <Textarea placeholder="Describe the types of tours and services you offer..." value={formData.services} onChange={e => onUpdate("services", e.target.value)} />
          </FormField>

          <FormField label="Additional Details (Optional)" icon={FileText}>
            <Textarea placeholder="Any certifications, languages spoken, special equipment, or unique offerings..." value={formData.description} onChange={e => onUpdate("description", e.target.value)} rows={3} />
          </FormField>
        </motion.div>
      );

    case 3:
      return (
        <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Contact Information</h3>
            <p className="text-sm text-gray-600">How can travelers reach you?</p>
          </div>

          <FormField label="Email Address" icon={Mail} required>
            <Input type="email" placeholder="contact@example.com" value={formData.email} onChange={e => onUpdate("email", e.target.value)} />
          </FormField>

          <FormField label="Phone Number" icon={Phone} required>
            <Input type="tel" placeholder="+213 XXX XXX XXX" value={formData.phone} onChange={e => onUpdate("phone", e.target.value)} />
          </FormField>

          <FormField label="Website (Optional)" icon={Globe}>
            <Input type="url" placeholder="www.yourwebsite.com" value={formData.website} onChange={e => onUpdate("website", e.target.value)} />
          </FormField>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Almost done!</p>
                <p className="text-xs text-gray-600 mt-1">Once you complete your profile, travelers will be able to find and contact you. You can always edit your information later.</p>
              </div>
            </div>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
}