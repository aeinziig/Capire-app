/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    // Explicit Design Tokens
    colors: {
      // Primary Palette
      primaryDark: '#1B4332', // Dark Green
      primarySage: '#2D6A4F', // Sage Green
      primaryLight: '#52B788', // Light Green
      primaryPale: '#D8F3DC', // Pale Green

      // Secondary Palette
      secondaryAmber: '#E9C46A', // Amber Gold
      secondaryDeep: '#D4A017', // Deep Gold
      secondaryPale: '#FFF3CD', // Pale Gold

      // Neutral Palette
      neutralWhite: '#FFFFFF', // Pure White
      neutralOffWhite: '#F8F9FA', // Off White
      neutralLightGray: '#E9ECEF', // Light Gray
      neutralMediumGray: '#6C757D', // Medium Gray
      neutralDarkGray: '#212529', // Dark Gray

      // Status Colors
      statusSuccess: '#40916C', // Success Green
      statusWarning: '#F4A261', // Warning Orange
      statusDanger: '#E76F51', // Danger Red
      statusCritical: '#C1121F', // Critical Red

      // Similarity Score Colors
      similarityOriginal: '#40916C',
      similarityOriginalBg: '#D8F3DC',
      similarityModerate: '#D4A017',
      similarityModerateBg: '#FFF3CD',
      similarityHigh: '#E76F51',
      similarityHighBg: '#FFE8D6',
      similarityDuplicate: '#C1121F',
      similarityDuplicateBg: '#FFE0DB',
    },
    fontFamily: {
      // Typography Tokens
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
    // Typography settings as design tokens
    fontSize: {
      // Screen Title: 20px, 700 weight
      'screen-title': ['20px', { lineHeight: '24px', fontWeight: '700', letterSpacing: '0px' }],
      // Section Heading: 18px, 700 weight
      'section-heading': ['18px', { lineHeight: '22px', fontWeight: '700', letterSpacing: '0.5px' }],
      // Card Title: 16px, 600 weight
      'card-title': ['16px', { lineHeight: '19px', fontWeight: '600', letterSpacing: '0.5px' }],
      // Body Text: 14px, 400 weight
      'body': ['14px', { lineHeight: '21px', fontWeight: '400', letterSpacing: '0px' }],
      // Label: 12px, 600 weight
      'label': ['12px', { lineHeight: '14px', fontWeight: '600', letterSpacing: '0.5px' }],
      // Caption: 12px, 400 weight
      'caption': ['12px', { lineHeight: '14px', fontWeight: '400', letterSpacing: '0px' }],
      // Micro Text: 11px, 400 weight
      'micro': ['11px', { lineHeight: '13px', fontWeight: '400', letterSpacing: '0px' }],
      // Button Text: 16px, 600 weight
      'button': ['16px', { lineHeight: '19px', fontWeight: '600', letterSpacing: '0px' }],
    },
    // Spacing Tokens (8px base grid)
    spacing: {
      '0': '0px',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '13': '52px',
      '14': '56px',
      '15': '60px',
      '16': '64px',
      '17': '68px',
      '18': '72px',
      '19': '76px',
      '20': '80px',
    },
    // Border Radius Tokens
    borderRadius: {
      none: '0px',
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '10px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      pill: '50%',
      full: '9999px',
    },
    // Shadow Tokens
    boxShadow: {
      none: '0px 0px 0px rgba(0,0,0,0)',
      sm: '0px 1px 2px rgba(0,0,0,0.05)',
      base: '0px 2px 8px rgba(0,0,0,0.06)',
      lg: '0px 4px 12px rgba(45,106,79,0.30)',
      xl: '0px 4px 16px rgba(233,196,106,0.40)',
      '2xl': '0px 8px 24px rgba(0,0,0,0.12)',
      inner: 'inset 0px 2px 4px rgba(0,0,0,0.06)',
    },
  },
  plugins: [],
}