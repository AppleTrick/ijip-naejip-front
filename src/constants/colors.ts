export interface Colors {
  primary: string
  primaryHover: string
  primaryLight: string
  softRed: string
  secondary: string
  secondaryHover: string
  secondaryLight: string
  accent: string
  accentHover: string
  background: string
  backgroundDark: string
  text: string
  textLight: string
  white: string
  gray100: string
  gray200: string
  gray400: string
  gray500: string
  gray700: string
  danger: string
  dangerHover: string
  primaryTransparent10: string
  primaryTransparent20: string
  primaryTransparent30: string
  secondaryTransparent20: string
  secondaryTransparent30: string
  accentTransparent20: string
}

export const colors: Colors = {
  primary: '#E84545',        // Bright Red
  primaryHover: '#D63939',   // Darker Red for hover
  primaryLight: '#FFE5E5',   // Light Red (Solid)
  softRed: '#FF6B6B',        // Soft Red for markers
  secondary: '#903749',      // Wine Red
  secondaryHover: '#7A2F3E', // Darker Wine Red
  secondaryLight: '#90374933', // Wine Red with transparency
  accent: '#53354A',         // Dark Purple
  accentHover: '#3E2838',    // Darker Purple
  background: '#F5F5F5',     // Light Gray Background
  backgroundDark: '#2B2E4A', // Dark Navy
  text: '#2B2E4A',           // Dark Navy for text
  textLight: '#6B7280',      // Gray for secondary text
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray700: '#374151',
  danger: '#E84545',         // Using primary red as danger
  dangerHover: '#D63939',
  
  // Transparent versions for specific UI elements
  primaryTransparent10: 'rgba(232, 69, 69, 0.1)',
  primaryTransparent20: 'rgba(232, 69, 69, 0.2)',
  primaryTransparent30: 'rgba(232, 69, 69, 0.3)',
  secondaryTransparent20: 'rgba(144, 55, 73, 0.2)',
  secondaryTransparent30: 'rgba(144, 55, 73, 0.3)',
  accentTransparent20: 'rgba(83, 53, 74, 0.2)',
}
