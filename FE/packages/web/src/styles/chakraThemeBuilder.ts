import { extendTheme } from '@chakra-ui/react';
import { ThemeConfig } from '../config/themes';

export const createChakraTheme = (themeConfig: ThemeConfig) => {
  return extendTheme({
    // Enhanced breakpoints for better responsive design
    breakpoints: {
      base: '0px',
      sm: '480px',
      md: '768px',
      lg: '992px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      brand: themeConfig.colors.brand,
      primary: themeConfig.colors.primary,
      accent: themeConfig.colors.accent,
      neutral: themeConfig.colors.neutral,
      ...(themeConfig.colors.sage && { sage: themeConfig.colors.sage }),
    },
    fonts: {
      heading: themeConfig.fonts.heading,
      body: themeConfig.fonts.body,
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
      outline: `0 0 0 3px ${themeConfig.colors.primary[500]}80`,
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
      Container: {
        baseStyle: {
          px: { base: 4, md: 6, lg: 8 },
        },
      },
      Button: {
        baseStyle: {
          fontWeight: '600',
          borderRadius: 'lg',
          transition: 'all 0.2s',
          minH: { base: '44px', md: '48px' }, // Touch-friendly minimum
          minW: { base: '44px', md: '48px' },
          _focus: {
            boxShadow: 'outline',
          },
        },
        sizes: {
          sm: {
            fontSize: { base: 'sm', md: 'md' },
            px: { base: 3, md: 4 },
            py: { base: 2, md: 2 },
            h: { base: '2rem', md: '2.25rem' },
          },
          md: {
            fontSize: { base: 'md', md: 'lg' },
            px: { base: 4, md: 6 },
            py: { base: 3, md: 3 },
            h: { base: '2.5rem', md: '2.75rem' },
          },
          lg: {
            fontSize: { base: 'lg', md: 'xl' },
            px: { base: 6, md: 8 },
            py: { base: 4, md: 4 },
            h: { base: '3rem', md: '3.25rem' },
          },
          xl: {
            fontSize: { base: 'xl', md: '2xl' },
            px: { base: 8, md: 10 },
            py: { base: 5, md: 5 },
            h: { base: '3.5rem', md: '3.75rem' },
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
            fontSize: { base: '16px', md: 'md' }, // Prevents zoom on iOS
            minH: { base: '44px', md: '48px' },
            px: { base: 4, md: 6 },
            _focus: {
              borderColor: 'primary.500',
              boxShadow: 'outline',
            },
          },
        },
      },
      IconButton: {
        baseStyle: {
          minW: { base: '44px', md: '48px' },
          minH: { base: '44px', md: '48px' },
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
        '*': {
          borderColor: 'gray.200',
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
          WebkitTextSizeAdjust: '100%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          bg: 'white',
          color: 'neutral.800',
          fontSize: 'md',
          lineHeight: '1.6',
          minH: '100vh',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        },
        // Improve focus indicators for accessibility
        '*:focus': {
          outline: '2px solid',
          outlineColor: 'primary.500',
          outlineOffset: '2px',
        },
        // Better touch targets for mobile
        'button, a[role="button"], input, select, textarea': {
          minHeight: { base: '44px', md: 'auto' },
          minWidth: { base: '44px', md: 'auto' },
        },
      },
    },
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
  });
};
