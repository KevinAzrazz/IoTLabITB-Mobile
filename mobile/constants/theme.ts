/**
 * Theme colors matching the web app design system
 * Primary: Green (#22c55e - green-500) - Matches Tailwind green-500
 * Secondary: Yellow (#eab308 - yellow-500) - Matches Tailwind yellow-500
 * 
 * Web App Gradient Reference:
 * Light: linear-gradient(135deg, #a9caac 25%, #74b787 75%)
 * Dark: linear-gradient(135deg, #060040 15%, #1d0039 85%)
 */

import { Platform } from 'react-native';

// Primary green colors - different for light/dark for better contrast
const primaryGreenLight = '#15803d';  // green-700 - darker for light mode contrast
const primaryGreenDark = '#22c55e';   // green-500 - brighter for dark mode

// Gradient colors from web CSS
export const GradientColors = {
  light: ['#a9caac', '#74b787'] as const, // 135deg gradient
  dark: ['#060040', '#1d0039'] as const,   // 135deg gradient
};

export const Colors = {
  light: {
    // Text colors (matching web foreground/muted-foreground)
    text: '#1a1a1a',           // text-foreground
    textMuted: '#4b5563',      // gray-600 - darker for better contrast
    
    // Background colors
    background: '#ffffff',      // bg-background
    backgroundSecondary: '#f3f4f6', // gray-100
    
    // Gradient colors for background
    gradientStart: '#a9caac',
    gradientEnd: '#74b787',
    
    // Primary colors (green - darker for light mode contrast)
    tint: primaryGreenLight,
    primary: primaryGreenLight,
    primaryDark: '#166534',     // green-800
    
    // Accent color for eyebrow text like "TENTANG KAMI"
    accent: '#166534',          // green-800 - very dark green for contrast
    
    // Secondary colors
    secondary: '#ca8a04',       // yellow-600 - darker for contrast
    
    // UI element colors
    icon: '#4b5563',            // gray-600
    tabIconDefault: '#4b5563',  // gray-600
    tabIconSelected: primaryGreenLight,
    
    // NavBar colors
    navBarBackground: 'rgba(255, 255, 255, 0.95)',
    
    // Border & Card colors
    border: '#d1d5db',          // gray-300
    card: '#ffffff',            // bg-card
    cardForeground: '#1a1a1a',  // text-card-foreground
    
    // Status colors
    success: '#16a34a',         // green-600
    error: '#dc2626',           // red-600
    warning: '#d97706',         // amber-600
    info: '#2563eb',            // blue-600
  },
  dark: {
    // Text colors
    text: '#f9fafb',            // text-foreground (gray-50)
    textMuted: '#9ca3af',       // text-muted-foreground (gray-400)
    
    // Background colors
    background: '#0a0a0a',      // bg-background dark
    backgroundSecondary: '#111827', // bg-secondary dark (gray-900)
    
    // Gradient colors for background
    gradientStart: '#060040',
    gradientEnd: '#1d0039',
    
    // Primary colors (brighter green for dark mode)
    tint: '#ffffff',
    primary: primaryGreenDark,
    primaryDark: '#16a34a',     // green-600
    
    // Accent color
    accent: '#4ade80',          // green-400 - bright for dark mode
    
    // Secondary colors
    secondary: '#eab308',       // yellow-500
    
    // UI element colors
    icon: '#9ca3af',            // gray-400
    tabIconDefault: '#9ca3af',
    tabIconSelected: primaryGreenDark,
    
    // NavBar colors
    navBarBackground: 'rgba(17, 24, 39, 0.95)',
    
    // Border & Card colors
    border: '#374151',          // gray-700
    card: '#1f2937',            // gray-800
    cardForeground: '#f9fafb',
    
    // Status colors
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
