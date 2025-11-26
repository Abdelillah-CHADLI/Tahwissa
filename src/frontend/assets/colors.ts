export const colors = {
  primary: {
    green: '#348086',
    teal: '#37b1bc',
    darkTeal: '#2a6970',
  },
  
  secondary: {
    green: '#c8f688',
    caramel: '#c3be92',
  },
  
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    black: '#000000',
  },
  
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  status: {
    active: '#10b981',
    pending: '#f59e0b',
    inactive: '#6b7280',
    featured: '#c8eb81',
  },

  ui: {
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af',
    },
    background: {
      light: '#f9fafb',
      card: '#ffffff',
      hover: '#f3f4f6',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverted: '#ffffff',
    }
  }
} as const;

export const {
  primary,
  secondary,
  neutral,
  semantic,
  status,
  ui
} = colors;

export const colorClasses = {
  primary: {
    bg: 'bg-[#348086]',
    text: 'text-[#348086]',
    border: 'border-[#348086]',
    hover: 'hover:bg-[#2a6970]',
  },
  secondary: {
    bg: 'bg-[#c8eb81]',
    text: 'text-[#c8eb81]',
    border: 'border-[#c8eb81]',
  },
  teal: {
    bg: 'bg-[#37b1bc]',
    text: 'text-[#37b1bc]',
    border: 'border-[#37b1bc]',
    hover: 'hover:bg-[#2d8f99]',
  },
  caramel: {
    bg: 'bg-[#c3be92]',
    text: 'text-[#c3be92]',
    border: 'border-[#c3be92]',
  },
} as const;

export type ColorPalette = typeof colors;
export type ColorClasses = typeof colorClasses;