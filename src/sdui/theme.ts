import { useColorScheme } from 'react-native';

/**
 * The server sends semantic tokens ("brand", "cardNavy"), never hex values.
 * That keeps dark mode, rebrands and accessibility tweaks as app-side concerns
 * instead of requiring a server deploy.
 */
export interface SduiTheme {
  brand: string;
  onBrand: string;
  onBrandMuted: string;
  searchField: string;
  searchBorder: string;

  background: string;
  surface: string;
  border: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  /** Category-card fills the payload can ask for by name. */
  cardNavy: string;
  cardGreen: string;
  onCard: string;

  offer: string;
  badge: string;
  onBadge: string;

  navActive: string;
  navInactive: string;
  navSurface: string;

  placeholder: string;
}

const light: SduiTheme = {
  brand: '#333E9C',
  onBrand: '#FFFFFF',
  onBrandMuted: '#B9C0E8',
  searchField: 'rgba(255,255,255,0.12)',
  searchBorder: 'rgba(255,255,255,0.28)',

  background: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#E3E7EF',

  text: '#12193F',
  textSecondary: '#5A6178',
  textMuted: '#9AA1B4',

  cardNavy: '#1E2A78',
  cardGreen: '#136B50',
  onCard: '#FFFFFF',

  offer: '#F4511E',
  badge: '#E53935',
  onBadge: '#FFFFFF',

  navActive: '#333E9C',
  navInactive: '#8A90A6',
  navSurface: '#FFFFFF',

  placeholder: '#DFE4EF',
};

const dark: SduiTheme = {
  ...light,
  brand: '#252E77',
  onBrandMuted: '#A3ABDB',

  background: '#0D1120',
  surface: '#161C2E',
  border: '#242C42',

  text: '#F5F7FC',
  textSecondary: '#A9B0C4',
  textMuted: '#6E7793',

  cardNavy: '#1A2464',
  cardGreen: '#0F5942',

  navActive: '#8E9BFF',
  navInactive: '#6E7793',
  navSurface: '#161C2E',

  placeholder: '#242C42',
};

export function useSduiTheme(): SduiTheme {
  return useColorScheme() === 'dark' ? dark : light;
}

/** Resolve a token name from JSON to a real colour, with a safe fallback. */
export function color(
  theme: SduiTheme,
  token: string | undefined,
  fallback: keyof SduiTheme = 'text',
): string {
  if (token && token in theme) {
    return theme[token as keyof SduiTheme];
  }
  return theme[fallback];
}
