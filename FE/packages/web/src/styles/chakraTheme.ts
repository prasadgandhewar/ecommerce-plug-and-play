import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    accent: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    sage: {
      50: '#f6f7f6',
      100: '#e3e7e3',
      200: '#c7d0c7',
      300: '#a3b5a3',
      400: '#7d977d',
      500: '#5f7b5f',
      600: '#4a634a',
      700: '#3d523d',
      800: '#344434',
      900: '#2d3a2d',
    }
  },
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: '0 0 0 3px rgba(34, 197, 94, 0.5)',
    inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
    none: 'none',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
        transition: 'all 0.2s',
        _focus: {
          boxShadow: 'outline',
        },
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 4,
          py: 2,
          h: '2rem',
        },
        md: {
          fontSize: 'md',
          px: 6,
          py: 3,
          h: '2.5rem',
        },
        lg: {
          fontSize: 'lg',
          px: 8,
          py: 4,
          h: '3rem',
        },
        xl: {
          fontSize: 'xl',
          px: 10,
          py: 5,
          h: '3.5rem',
        },
      },
      variants: {
        solid: {
          bg: 'primary.600',
          color: 'white',
          _hover: {
            bg: 'primary.700',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'primary.800',
            transform: 'translateY(0)',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'primary.600',
          color: 'primary.600',
          bg: 'transparent',
          _hover: {
            bg: 'primary.50',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
        },
        ghost: {
          color: 'primary.600',
          _hover: {
            bg: 'primary.50',
          },
        },
        accent: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
        },
      },
      defaultProps: {
        variant: 'solid',
        size: 'md',
      },
    },
    Card: {
      baseStyle: {
        p: 0,
        bg: 'white',
        borderRadius: 'xl',
        boxShadow: 'card',
        transition: 'all 0.3s ease',
        _hover: {
          boxShadow: 'cardHover',
          transform: 'translateY(-4px)',
        },
      },
      variants: {
        elevated: {
          boxShadow: 'lg',
          _hover: {
            boxShadow: '2xl',
            transform: 'translateY(-6px)',
          },
        },
        outline: {
          border: '1px solid',
          borderColor: 'gray.200',
          boxShadow: 'none',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        letterSpacing: '-0.025em',
        lineHeight: '1.2',
        color: 'neutral.800',
      },
      sizes: {
        '4xl': {
          fontSize: ['2xl', '3xl', '4xl', '5xl'],
          lineHeight: '1.1',
        },
        '3xl': {
          fontSize: ['xl', '2xl', '3xl', '4xl'],
          lineHeight: '1.15',
        },
        '2xl': {
          fontSize: ['lg', 'xl', '2xl', '3xl'],
          lineHeight: '1.2',
        },
        'xl': {
          fontSize: ['md', 'lg', 'xl', '2xl'],
          lineHeight: '1.25',
        },
      },
    },
    Text: {
      baseStyle: {
        lineHeight: '1.6',
        color: 'neutral.600',
      },
      variants: {
        subtle: {
          color: 'neutral.500',
        },
        accent: {
          color: 'primary.600',
          fontWeight: '600',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          border: '2px solid',
          borderColor: 'gray.200',
          _focus: {
            borderColor: 'primary.500',
            boxShadow: 'outline',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: '600',
        fontSize: 'xs',
        px: 2,
        py: 1,
      },
      variants: {
        solid: {
          bg: 'primary.100',
          color: 'primary.800',
        },
        accent: {
          bg: 'accent.100',
          color: 'accent.800',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'neutral.800',
        fontSize: 'md',
        lineHeight: '1.6',
      },
      '*': {
        borderColor: 'gray.200',
      },
      html: {
        scrollBehavior: 'smooth',
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export { theme };
