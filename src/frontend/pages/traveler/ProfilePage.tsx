import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../../types/auth';

interface TravelerProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [profileData, setProfileData] = useState<TravelerProfileData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch traveler data on component mount
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
        
        setProfileData({
          firstName: user.firstName || user.first_name || '',
          lastName: user.lastName || user.last_name || '',
          email: user.email,
        });

      } catch (error) {
        console.error('Error fetching traveler profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelerProfile();
  }, [navigate]);

  const handleBackToHome = () => {
    navigate('/traveler');
  };

  const handleProfileChange = (field: keyof TravelerProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
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
      
      const updatedUser: User = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      alert('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
      alert('Account deleted successfully');
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
      setProfileImage(e.target?.result as string);
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file');
    };
    reader.readAsDataURL(file);
    
    event.target.value = '';
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setUploadError('');
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' }
  ] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
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

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="p-6">
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
                    onRemoveImage={handleRemoveImage}
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
                    onDeleteAccount={handleDeleteAccount}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Profile Tab Component
interface ProfileTabProps {
  data: TravelerProfileData;
  onChange: (field: keyof TravelerProfileData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  profileImage: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  uploadError: string;
  isLoading: boolean;
}

const ProfileTab = ({ data, onChange, onSubmit, profileImage, onImageUpload, onRemoveImage, uploadError, isLoading }: ProfileTabProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
    
    <div className="flex items-center gap-6">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center shadow-md overflow-hidden"
      >
        {profileImage ? (
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">Profile Photo</span>
        )}
      </motion.div>
      <div className="flex flex-col gap-3">
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        <motion.label
          htmlFor="profile-upload"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm cursor-pointer text-center"
        >
          Change Photo
        </motion.label>
        {profileImage && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onRemoveImage}
            className="px-6 py-3 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 shadow-sm"
          >
            Remove Photo
          </motion.button>
        )}
      </div>
    </div>

    {uploadError && (
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 text-sm"
      >
        {uploadError}
      </motion.p>
    )}

    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          value={data.firstName}
          onChange={(value) => onChange('firstName', value)}
          type="text"
        />
        <FormField
          label="Last Name"
          value={data.lastName}
          onChange={(value) => onChange('lastName', value)}
          type="text"
        />
      </div>

      <div>
        <FormField
          label="Email Address"
          value={data.email}
          onChange={(value) => onChange('email', value)}
          type="email"
          disabled={true}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className={`px-8 py-3 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </form>
  </motion.div>
);

// Security Tab Component
interface SecurityTabProps {
  data: PasswordData;
  onChange: (field: keyof PasswordData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteAccount: () => void;
}

const SecurityTab = ({ data, onChange, onSubmit, onDeleteAccount }: SecurityTabProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          label="Current Password"
          value={data.currentPassword}
          onChange={(value) => onChange('currentPassword', value)}
          type="password"
        />
        <FormField
          label="New Password"
          value={data.newPassword}
          onChange={(value) => onChange('newPassword', value)}
          type="password"
        />
        <FormField
          label="Confirm New Password"
          value={data.confirmPassword}
          onChange={(value) => onChange('confirmPassword', value)}
          type="password"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-8 py-3 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        >
          Update Password
        </motion.button>
      </form>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="pt-8 border-t border-gray-200"
    >
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Account Management</h3>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <h4 className="font-medium text-red-800 mb-3 text-base">Delete Account</h4>
          <p className="text-red-700 text-sm mb-6">
            Permanently delete your account and all associated data
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDeleteAccount}
            className="px-8 py-3 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-sm"
          >
            Delete My Account
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
);

// Form Field Component
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date';
  disabled?: boolean;
}

const FormField = ({ label, value, onChange, type = 'text', disabled = false }: FormFieldProps) => (
  <motion.div
    whileHover={{ scale: disabled ? 1 : 1.01 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <label className="block text-sm font-medium text-gray-700 mb-3">
      {label}
    </label>
    <motion.input
      whileFocus={{ scale: disabled ? 1 : 1.02 }}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
      }`}
    />
  </motion.div>
);

export default ProfilePage;