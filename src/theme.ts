import { extendTailwindMerge } from 'nativewind';

export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      colors: {
        // Primary colors from CAPIRE design
        primary: {
          50: '#E6F4EA',
          100: '#CDE9D5',
          200: '#A7D9B8',
          300: '#7BC999',
          400: '#4EB97A',
          500: '#2EA95B', // Main green
          600: '#268547',
          700: '#1E6133',
          800: '#163E20',
          900: '#0E2A16',
        },
        secondary: {
          50: '#FFF9EB',
          100: '#FFF2C7',
          200: '#FFE59C',
          300: '#FFD970',
          400: '#FFCD43',
          500: '#FFC107', // Gold/amber
          600: '#E6AC00',
          700: '#CC8A00',
          800: '#B27300',
          900: '#995C00',
        },
        // Neutrals
        background: '#FFFFFF',
        surface: '#F8F9FA',
        border: '#E0E0E0',
        text: {
          primary: '#212121',
          secondary: '#757575',
          disabled: '#BDBDBD',
          hint: '#9E9E9E',
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'none': '0px',
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
    },
  },
});
