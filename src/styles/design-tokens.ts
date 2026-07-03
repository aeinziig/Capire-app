// Design Tokens for CAPIRE App
// Exported values for consistent usage across the application

// Color Tokens
export const colorTokens = {
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
  statusDangerBg: '#FFE8D6', // Danger Background
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
} as const;

// Typography Tokens
export const typographyTokens = {
  // Font Family
  fontFamily: '"Inter", system-ui, -apple-system, sans-serif',

  // Type Scale
  screenTitle: {
    fontSize: '20px',
    fontWeight: '700' as const,
    lineHeight: '1.2',
    letterSpacing: '0px',
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: '700' as const,
    lineHeight: '1.2',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600' as const,
    lineHeight: '1.2',
    letterSpacing: '0.5px',
  },
  bodyText: {
    fontSize: '14px',
    fontWeight: '400' as const,
    lineHeight: '1.5',
    letterSpacing: '0px',
  },
  body: {
    fontSize: '14px',
    fontWeight: '400' as const,
    lineHeight: '1.5',
    letterSpacing: '0px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600' as const,
    lineHeight: '1.2',
    letterSpacing: '0.5px',
  },
  caption: {
    fontSize: '12px',
    fontWeight: '400' as const,
    lineHeight: '1.2',
    letterSpacing: '0px',
  },
  microText: {
    fontSize: '11px',
    fontWeight: '400' as const,
    lineHeight: '1.2',
    letterSpacing: '0px',
  },
  micro: {
    fontSize: '11px',
    fontWeight: '400' as const,
    lineHeight: '1.2',
    letterSpacing: '0px',
  },
  buttonText: {
    fontSize: '16px',
    fontWeight: '600' as const,
    lineHeight: '1.2',
    letterSpacing: '0px',
  },
  button: {
    fontSize: '16px',
    fontWeight: '600' as const,
    lineHeight: '1.2',
    letterSpacing: '0px',
  },
} as const;

// Spacing Tokens (8px base grid)
export const spacingTokens = {
  '0': '0px',
  '0.5': '2px',
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
} as const;

// Border Radius Tokens
export const borderRadiusTokens = {
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
};

// Shadow Tokens
export const shadowTokens = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  lg: {
    shadowColor: '#2D6A4F', // rgba(45,106,79,0.30) approximated
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 6,
  },
  xl: {
    shadowColor: '#E9C46A', // rgba(233,196,106,0.40) approximated
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
  },
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  inner: {
    // Note: React Native doesn't natively support inset shadows
    // This would require a custom implementation or workaround
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
} as const;

// Z-index Tokens
export const zIndexTokens = {
  auto: 'auto',
  base: '0',
  docked: '10',
  dropdown: '1000',
  sticky: '1100',
  banner: '1200',
  overlay: '1300',
  modal: '1400',
  popover: '1500',
  skipLink: '1600',
  toast: '1700',
  tooltip: '1800',
};