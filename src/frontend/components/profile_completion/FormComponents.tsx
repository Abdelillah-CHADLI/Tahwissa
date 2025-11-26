import type { ReactNode } from "react";

export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "primary",
  className = "" 
}: { 
  children: ReactNode; 
  onClick: () => void; 
  disabled?: boolean;
  variant?: "primary" | "outline";
  className?: string;
}) => {
  const baseClasses = "px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1";
  const variants = {
    primary: "bg-[#348086] text-white hover:bg-[#2a6970] disabled:bg-gray-400 disabled:cursor-not-allowed",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 disabled:border-gray-200 disabled:text-gray-400"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  className = "" 
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent ${className}`}
  />
);

export const Textarea = ({ 
  placeholder, 
  value, 
  onChange,
  rows = 4,
  className = "" 
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent resize-none ${className}`}
  />
);

export const Badge = ({ 
  children, 
  active = false, 
  onClick 
}: { 
  children: ReactNode; 
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border transition-all hover:scale-105 select-none ${
      active 
        ? "bg-[#348086] text-white border-[#348086]" 
        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
    }`}
  >
    {children}
  </button>
);

export const FormField = ({ 
  label, 
  icon: Icon, 
  children, 
  required = false 
}: { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);