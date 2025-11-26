import { Upload, Camera } from "lucide-react";

interface ProfileImageUploadProps {
  image: string;
  onImageChange: (image: string) => void;
  type?: "user" | "logo";
  size?: "sm" | "md" | "lg";
}

export function ProfileImageUpload({ 
  image, 
  onImageChange, 
  type = "user",
  size = "md" 
}: ProfileImageUploadProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300`}>
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className={`${size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'} text-gray-400`} />
          )}
        </div>
        <label
          htmlFor="profile-upload"
          className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg border-2 border-white"
        >
          <Upload className="w-4 h-4 text-white" />
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      <p className="text-sm text-gray-600 text-center">
        Upload your {type === "logo" ? "logo" : "profile picture"} (optional)
        <br />
        <span className="text-xs">JPG, PNG or GIF (Max. 5MB)</span>
      </p>
    </div>
  );
}