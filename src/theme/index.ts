// theme.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e9ebf5',
      100: '#c3c8e3',
      200: '#9da5d1',
      300: '#7782bf',
      400: '#515fad',
      500: '#343c75', // your key color
      600: '#2a305e',
      700: '#1f2448',
      800: '#151831',
      900: '#0a0c1a',
    },
    // Semantic light‑theme tokens
    light: {
      bg: '#ebedf0',
      sidebar: '#ffffff',
      card: '#ffffff',
      border: '#e2e8f0',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#ebedf0',    // page background
        color: '#1a202c', // dark text
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;