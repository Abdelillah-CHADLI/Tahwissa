import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api, { profileService } from '../../services/api';
import type { User } from '../../types/auth';

interface TravelerProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  location: string;
  bio: string;
  profile_picture: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DZ_PHONE_REGEX = /^\+213[0-9]{9}$/;

const normalizePhoneInput = (value: string): string => {
  const trimmed = value.trim();
  const compact = trimmed.replace(/[\s\-()]/g, '');
  if (compact.startsWith('+')) {
    return `+${compact.slice(1).replace(/\D/g, '')}`;
  }
  return compact.replace(/\D/g, '');
};

const MIN_NAME_LENGTH = 2;
const MIN_LOCATION_LENGTH = 3;
const MIN_BIO_LENGTH = 10;

const PROFILE_PIC_STORAGE_KEY_PREFIX = 'traveler_profile_picture:';

const extractBackendErrorMessage = (error: unknown): string => {
  const err = error as any;
  if (err?.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (typeof err?.message === 'string' && !err?.response) return err.message;

  const data = err?.response?.data;
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.details === 'string') return data.details;

  try {
    return JSON.stringify(data);
  } catch {
    return '';
  }
};

const toUserFriendlyBackendError = (rawMessage: string): string => {
  const msg = rawMessage.trim();
  const lower = msg.toLowerCase();

  if (!msg) return 'Request failed. Please try again.';

  if (msg.startsWith('<!doctype html') || msg.startsWith('<html')) {
    if (lower.includes('payloadtoolargeerror') || lower.includes('request entity too large')) {
      return 'Image is too large to upload. Please choose a smaller image (or reduce its resolution) and try again.';
    }
    return 'Request failed. Please try again.';
  }

  if (lower.includes('payloadtoolargeerror') || lower.includes('request entity too large')) {
    return 'Image is too large to upload. Please choose a smaller image (or reduce its resolution) and try again.';
  }

  return msg;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'account'>('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'}>({text: '', type: 'success'});
  
  const [profileData, setProfileData] = useState<TravelerProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    location: '',
    bio: '',
    profile_picture: ''
  });
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deleteAccountPassword, setDeleteAccountPassword] = useState<string>('');

  useEffect(() => {
    const fetchTravelerProfile = async () => {
      try {
        setIsLoading(true);
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          navigate('/signin');
          return;
        }

        const user: User = JSON.parse(userStr);

        const travellerId = user.profileId || user.userId || user.id;
        if (!travellerId) {
          setMessage({ text: 'Missing user id; please sign in again.', type: 'error' });
          navigate('/signin');
          return;
        }
        
        const profile = await profileService.getTravellerInfo(travellerId);

        const storedProfilePic = localStorage.getItem(`${PROFILE_PIC_STORAGE_KEY_PREFIX}${travellerId}`) || '';

        setProfileData({
          firstName: profile?.traveller_fn ?? '',
          lastName: profile?.traveller_ls ?? '',
          email: profile?.email ?? user.email ?? '',
          phone_number: profile?.phone_number ?? '',
          location: profile?.location ?? '',
          bio: profile?.bio ?? '',
          profile_picture: storedProfilePic
        });
      } catch {
        setMessage({text: 'Failed to load profile data', type: 'error'});
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelerProfile();
  }, [navigate]);

  const handleBackToHome = () => {
    navigate('/traveler');
  };

  const handleProfileChange = (field: keyof Omit<TravelerProfileData, 'profile_picture'>, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: field === 'phone_number' ? normalizePhoneInput(value) : value
    }));
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user: User = JSON.parse(userStr);
      const travellerId = user.profileId || user.userId || user.id;
      if (!travellerId) {
        setMessage({ text: 'Missing user id; please sign in again.', type: 'error' });
        navigate('/signin');
        return;
      }

      const firstName = profileData.firstName.trim();
      const lastName = profileData.lastName.trim();
      const email = profileData.email.trim();
      const location = profileData.location.trim();
      const bio = profileData.bio.trim();
      const phone = profileData.phone_number.trim();

      if (firstName.length < MIN_NAME_LENGTH) {
        setMessage({ text: `First name must be at least ${MIN_NAME_LENGTH} characters.`, type: 'error' });
        return;
      }
      if (lastName.length < MIN_NAME_LENGTH) {
        setMessage({ text: `Last name must be at least ${MIN_NAME_LENGTH} characters.`, type: 'error' });
        return;
      }
      if (!EMAIL_REGEX.test(email)) {
        setMessage({ text: 'Please enter a valid email address.', type: 'error' });
        return;
      }
      if (!DZ_PHONE_REGEX.test(phone)) {
        setMessage({ text: 'Phone number must be in the format +213 followed by 9 digits.', type: 'error' });
        return;
      }
      if (location.length < MIN_LOCATION_LENGTH) {
        setMessage({ text: `Location must be at least ${MIN_LOCATION_LENGTH} characters.`, type: 'error' });
        return;
      }
      if (bio.length < MIN_BIO_LENGTH) {
        setMessage({ text: `Bio must be at least ${MIN_BIO_LENGTH} characters.`, type: 'error' });
        return;
      }

      try {
        await profileService.updateTravellerInfo(travellerId, {
          traveller_fn: firstName,
          traveller_ls: lastName,
          phone_number: phone,
          location,
          bio,
          email,
        });
      } catch (error: any) {
        const backendError = toUserFriendlyBackendError(extractBackendErrorMessage(error));
        setMessage({
          text: backendError || 'Failed to update profile. Please try again.',
          type: 'error'
        });
        return;
      }

      let photoUploadError: string | null = null;
      if (profileImage && profileImage.startsWith('data:')) {
        const base64 = profileImage.split(',')[1] || '';
        const mimeType = profileImage.split(';')[0]?.split(':')[1] || '';

        if (!base64 || !mimeType) {
          photoUploadError = 'Invalid image data. Please try uploading again.';
        } else {
          try {
            const uploadResponse = await api.post(`/pst/travellers/${travellerId}/update`, {
              traveller_fn: firstName,
              traveller_ls: lastName,
              bio,
              phone_number: phone,
              location,
              profile_picture: {
                base64,
                mimeType,
              }
            });

            if (uploadResponse.data?.success && uploadResponse.data?.data?.profile_picture) {
              const newUrl = String(uploadResponse.data.data.profile_picture);
              setProfileData(prev => ({ ...prev, profile_picture: newUrl }));
              localStorage.setItem(`${PROFILE_PIC_STORAGE_KEY_PREFIX}${travellerId}`, newUrl);
              setProfileImage(null);
            } else {
              photoUploadError = 'Photo upload failed. Please try again.';
            }
          } catch (error: any) {
            const backendError = toUserFriendlyBackendError(extractBackendErrorMessage(error));
            if (backendError.toLowerCase().includes('bucket not found')) {
              photoUploadError = 'Profile picture upload is not available.';
            } else {
              photoUploadError = backendError || 'Photo upload failed. Please try again.';
            }
          }
        }
      }

      setMessage({
        text: photoUploadError ? `Profile updated, but photo upload failed: ${photoUploadError}` : 'Profile updated successfully!',
        type: photoUploadError ? 'error' : 'success'
      });

      const updatedUser: User = {
        ...user,
        email,
        firstName,
        lastName,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => setMessage({text: '', type: 'success'}), 3000);
      
    } catch (error: any) {
      const backendError = toUserFriendlyBackendError(extractBackendErrorMessage(error));
      setMessage({
        text: backendError || 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({text: 'New passwords do not match', type: 'error'});
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({text: 'New password must be at least 6 characters long', type: 'error'});
      return;
    }

    try {
      setPasswordLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/signin');
        return;
      }

      await api.post(
        '/auth/changePass',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        { withCredentials: true }
      );

      setMessage({text: 'Password updated successfully!', type: 'success'});
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setMessage({text: '', type: 'success'}), 3000);
      
    } catch (error: any) {
      const backendError = toUserFriendlyBackendError(extractBackendErrorMessage(error));
      setMessage({text: backendError || 'Failed to change password. Please try again.', type: 'error'});
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountPassword.trim()) {
      setMessage({ text: 'Please enter your current password to delete your account.', type: 'error' });
      return;
    }

    try {
      setDeleteLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/signin');
        return;
      }

      await api.post(
        '/auth/deleteAcc',
        { currentPassword: deleteAccountPassword },
        { withCredentials: true }
      );
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
      alert('Account deleted successfully');
      
    } catch (error: any) {
      const backendError = toUserFriendlyBackendError(extractBackendErrorMessage(error));
      setMessage({text: backendError || 'Failed to delete account. Please try again.', type: 'error'});
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError('');
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileImage(result);
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file');
    };
    reader.readAsDataURL(file);
    
    event.target.value = '';
  };


  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'account', label: 'Account' }
  ] as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.button
          variants={itemVariants}
          onClick={handleBackToHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </motion.button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>
        
        <div className="flex border-b mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message.text}
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow p-6"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ProfileTab 
                  data={profileData}
                  onChange={handleProfileChange}
                  onSubmit={handleProfileSubmit}
                  profileImage={profileImage}
                  onImageUpload={handleImageUpload}
                  uploadError={uploadError}
                  isLoading={saveLoading}
                />
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SecurityTab 
                  data={passwordData}
                  onChange={handlePasswordChange}
                  onSubmit={handlePasswordSubmit}
                  isLoading={passwordLoading}
                />
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div
                key="account"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AccountTab 
                  onDeleteAccount={handleDeleteAccount}
                  currentPassword={deleteAccountPassword}
                  onCurrentPasswordChange={setDeleteAccountPassword}
                  isLoading={deleteLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

interface ProfileTabProps {
  data: TravelerProfileData;
  onChange: (field: keyof Omit<TravelerProfileData, 'profile_picture'>, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  profileImage: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadError: string;
  isLoading: boolean;
}

const ProfileTab = ({ data, onChange, onSubmit, profileImage, onImageUpload, uploadError, isLoading }: ProfileTabProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    <div className="flex items-center mb-6">
      <div className="relative">
        <img
          src={profileImage || data.profile_picture || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
          <label htmlFor="profile-upload" className="cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </label>
        </button>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>
      <div className="ml-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <p className="text-gray-600">Update your photo and personal details</p>
      </div>
    </div>

    {uploadError && (
      <p className="text-red-600 text-sm">{uploadError}</p>
    )}

    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          value={data.firstName}
          onChange={(value) => onChange('firstName', value)}
          type="text"
          required
          minLength={MIN_NAME_LENGTH}
        />
        <FormField
          label="Last Name"
          value={data.lastName}
          onChange={(value) => onChange('lastName', value)}
          type="text"
          required
          minLength={MIN_NAME_LENGTH}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            label="Email Address"
            value={data.email}
            onChange={(value) => onChange('email', value)}
            type="email"
            disabled={false}
            required
          />
        </div>
        <div>
          <FormField
            label="Phone Number"
            value={data.phone_number}
            onChange={(value) => onChange('phone_number', value)}
            type="tel"
            placeholder="+213XXXXXXXXX"
            required
            pattern="\\+213[0-9]{9}"
            inputMode="tel"
            minLength={13}
            maxLength={13}
          />
        </div>
      </div>

      <div>
        <FormField
          label="Location"
          value={data.location}
          onChange={(value) => onChange('location', value)}
          type="text"
          placeholder="Algiers, Algeria"
          required
          minLength={MIN_LOCATION_LENGTH}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          rows={3}
          placeholder="Adventure seeker exploring the beauty of Algeria"
          required
          minLength={MIN_BIO_LENGTH}
        />
      </div>

      <div className="pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50`}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>
    </form>
  </motion.div>
);

interface SecurityTabProps {
  data: PasswordData;
  onChange: (field: keyof PasswordData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SecurityTab = ({ data, onChange, onSubmit, isLoading }: SecurityTabProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
    
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField
        label="Current Password"
        value={data.currentPassword}
        onChange={(value) => onChange('currentPassword', value)}
        type="password"
        required
      />
      
      <FormField
        label="New Password"
        value={data.newPassword}
        onChange={(value) => onChange('newPassword', value)}
        type="password"
        required
        minLength={8}
      />
      
      <FormField
        label="Confirm New Password"
        value={data.confirmPassword}
        onChange={(value) => onChange('confirmPassword', value)}
        type="password"
        required
        minLength={8}
      />

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </motion.button>
      </div>
    </form>
  </motion.div>
);

interface AccountTabProps {
  onDeleteAccount: () => void;
  currentPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  isLoading: boolean;
}

const AccountTab = ({ onDeleteAccount, currentPassword, onCurrentPasswordChange, isLoading }: AccountTabProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Account</h2>
    <p className="text-gray-600 mb-6">
      Permanently delete your account and all associated data. This action cannot be undone.
    </p>

    <FormField
      label="Current Password"
      value={currentPassword}
      onChange={onCurrentPasswordChange}
      type="password"
      required
    />
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onDeleteAccount}
      disabled={isLoading || !currentPassword.trim()}
      className="px-6 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
    >
      {isLoading ? 'Deleting...' : 'Delete My Account'}
    </motion.button>
  </motion.div>
);

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date';
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

const FormField = ({ label, value, onChange, type = 'text', disabled = false, placeholder, required, minLength, maxLength, pattern, inputMode }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <motion.input
      whileFocus={{ scale: disabled ? 1 : 1.02 }}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      inputMode={inputMode}
      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

export default ProfilePage;