import { useBreakpointValue } from '@chakra-ui/react';

/**
 * Custom hook for responsive design with predefined breakpoints
 * Provides consistent breakpoint values across the application
 */
export const useResponsive = () => {
  // Device type detection
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  
  // Common responsive values
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const sectionPadding = useBreakpointValue({ base: 8, md: 12, lg: 16 });
  const cardSpacing = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const fontSize = {
    xs: useBreakpointValue({ base: 'xs', md: 'sm' }),
    sm: useBreakpointValue({ base: 'sm', md: 'md' }),
    md: useBreakpointValue({ base: 'md', md: 'lg' }),
    lg: useBreakpointValue({ base: 'lg', md: 'xl' }),
    xl: useBreakpointValue({ base: 'xl', md: '2xl' }),
    '2xl': useBreakpointValue({ base: 'xl', md: '2xl', lg: '3xl' }),
  };
  
  // Grid columns for different screen sizes
  const gridColumns = {
    products: useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
    categories: useBreakpointValue({ base: 1, sm: 2, lg: 4 }),
    features: useBreakpointValue({ base: 1, sm: 2, lg: 4 }),
    testimonials: useBreakpointValue({ base: 1, md: 2, lg: 3 }),
  };
  
  // Spacing values
  const spacing = {
    section: useBreakpointValue({ base: 12, md: 16, lg: 20 }),
    container: useBreakpointValue({ base: 4, md: 6, lg: 8 }),
    card: useBreakpointValue({ base: 4, md: 6 }),
    stack: useBreakpointValue({ base: 4, md: 6, lg: 8 }),
  };
  
  // Button sizes
  const buttonSize = {
    sm: useBreakpointValue({ base: 'sm', md: 'md' }),
    md: useBreakpointValue({ base: 'md', md: 'lg' }),
    lg: useBreakpointValue({ base: 'lg', md: 'xl' }),
  };
  
  // Icon sizes
  const iconSize = {
    sm: useBreakpointValue({ base: '16px', md: '18px' }),
    md: useBreakpointValue({ base: '18px', md: '20px' }),
    lg: useBreakpointValue({ base: '20px', md: '24px' }),
  };
  
  return {
    // Device detection
    isMobile,
    isTablet,
    isDesktop,
    
    // Responsive values
    containerPadding,
    sectionPadding,
    cardSpacing,
    fontSize,
    gridColumns,
    spacing,
    buttonSize,
    iconSize,
    
    // Utility functions
    getResponsiveValue: useBreakpointValue,
  };
};

/**
 * Hook for responsive image sizes
 */
export const useResponsiveImages = () => {
  const imageSizes = {
    avatar: useBreakpointValue({ base: 'sm', md: 'md' }),
    productCard: useBreakpointValue({ base: '200px', md: '250px', lg: '300px' }),
    hero: useBreakpointValue({ base: '300px', md: '400px', lg: '500px' }),
    categoryCard: useBreakpointValue({ base: '150px', md: '200px' }),
  };
  
  return imageSizes;
};

/**
 * Hook for responsive layout configurations
 */
export const useResponsiveLayout = () => {
  const layouts = {
    // Stack direction for flex layouts
    stackDirection: useBreakpointValue({ base: 'column', md: 'row' }),
    
    // Text alignment
    textAlign: useBreakpointValue({ base: 'center', lg: 'left' }),
    
    // Container max widths
    containerMaxW: useBreakpointValue({ base: 'full', sm: 'container.sm', md: 'container.md', lg: 'container.lg', xl: 'container.xl' }),
    
    // Modal sizes
    modalSize: useBreakpointValue({ base: 'full', md: 'md', lg: 'lg' }),
    
    // Drawer sizes
    drawerSize: useBreakpointValue({ base: 'full', md: 'md' }),
  };
  
  return layouts;
};
