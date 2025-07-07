export const colors = {
    system: {
      white: '#FFFFFF',
      black: '#000000',
    },
    grayscale: {
      0: '#FFFFFF',
      50: '#F3F4F5',
      100: '#E9EAED',
      150: '#DEE0E3',
      200: '#DDEFE3',
      300: '#8F96A3',
      400: '#5B6270',
      500: '#41464F',
      600: '#2F3238',
      700: '#25272C',
      800: '#1B1D22',
      900: '#0E0F11',
    },
    core: {
      100: '#F2ECFE',
      200: '#C4A9FA',
      300: '#864EF6',
      400: '#7032ED',
      500: '#52368A',
      600: '#3E2D5F',
    },
    solid: {
      green: '#59DB40',
      yellow: '#EAC50D',
      red: '#F42B5E',
    },
    translucent: {
      green: { color: '#59DB40', opacity: 10 },
      yellow: { color: '#EAC50D', opacity: 10 },
      red: { color: '#F42B5E', opacity: 10 },
      core: {
        100: { color: '#864EF6', opacity: 10 },
        200: { color: '#864EF6', opacity: 20 },
      }
    }
  } as const;