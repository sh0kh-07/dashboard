import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e0f7fa',
      100: '#b2ebf2',
      200: '#80deea',
      300: '#4dd0e1',
      400: '#26c6da',
      500: '#00bcd4', // Cyan
      600: '#00acc1',
      700: '#0097a7',
      800: '#00838f',
      900: '#006064',
    },
    dark: {
      bg: '#0a0b0d',
      sidebar: '#121417',
      card: '#1a1d23',
      border: '#2d3139',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'dark.bg',
        color: 'white',
      },
    },
  },
});

export default theme;
