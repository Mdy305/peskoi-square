// PESKOI Design System — Premium Apple-Style Tokens

export const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: 'rgba(255, 255, 255, 0.05)',
    100: 'rgba(255, 255, 255, 0.08)',
    200: 'rgba(255, 255, 255, 0.12)',
    300: 'rgba(255, 255, 255, 0.20)',
    400: 'rgba(255, 255, 255, 0.30)',
    500: 'rgba(255, 255, 255, 0.40)',
    600: 'rgba(255, 255, 255, 0.60)',
    700: 'rgba(255, 255, 255, 0.70)',
    800: 'rgba(255, 255, 255, 0.80)',
    900: 'rgba(255, 255, 255, 0.90)',
  },
  accent: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.6)',
    tertiary: 'rgba(255, 255, 255, 0.3)',
  },
  state: {
    success: '#00FF00',
    warning: '#FFAA00',
    error: '#FF0000',
    info: '#00AAFF',
  }
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  },
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.15em',
  }
};

export const SPACING = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

export const RADIUS = {
  none: '0',
  sm: '4px',
  base: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const SHADOW = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  base: '0 2px 8px rgba(0, 0, 0, 0.15)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.2)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.25)',
};

export const ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

export const LAYOUT = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  containerPadding: {
    mobile: SPACING[4],
    tablet: SPACING[6],
    desktop: SPACING[8],
  }
};