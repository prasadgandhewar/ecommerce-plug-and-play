import React from 'react';
import { HStack, VStack, Text, Box } from '@chakra-ui/react';
import { FaLeaf, FaMicrochip } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | { base: string; md?: string };
  showText?: boolean;
  iconOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  iconOnly = false 
}) => {
  const { currentTheme } = useTheme();
  
  const getIconComponent = () => {
    switch (currentTheme.branding.logoIcon) {
      case 'FaLeaf':
        return FaLeaf;
      case 'FaMicrochip':
        return FaMicrochip;
      default:
        return FaLeaf;
    }
  };

  const IconComponent = getIconComponent();

  // Handle responsive size or string size
  const getResponsiveConfig = () => {
    if (typeof size === 'object') {
      return {
        iconSize: { base: '16px', md: '20px' },
        fontSize: { base: 'md', md: 'xl' },
        taglineSize: { base: '2xs', md: 'xs' },
        spacing: { base: 2, md: 3 }
      };
    }

    const sizeConfig = {
      sm: { iconSize: '16px', fontSize: 'md', taglineSize: '2xs', spacing: 2 },
      md: { iconSize: '20px', fontSize: 'xl', taglineSize: 'xs', spacing: 3 },
      lg: { iconSize: '24px', fontSize: '2xl', taglineSize: 'sm', spacing: 3 },
    };

    return sizeConfig[size];
  };

  const config = getResponsiveConfig();

  if (iconOnly) {
    return (
      <Box 
        p={2} 
        borderRadius="xl" 
        bg="primary.600" 
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* @ts-ignore */}
        <IconComponent size={typeof config.iconSize === 'object' ? config.iconSize.base : config.iconSize} />
      </Box>
    );
  }

  return (
    <HStack spacing={config.spacing}>
      <Box 
        p={2} 
        borderRadius="xl" 
        bg="primary.600" 
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* @ts-ignore */}
        <IconComponent size={typeof config.iconSize === 'object' ? config.iconSize.base : config.iconSize} />
      </Box>
      {showText && (
        <VStack spacing={0} align="start">
          <Text 
            fontSize={config.fontSize}
            fontWeight="800"
            color="white"
            lineHeight="1"
          >
            {currentTheme.branding.companyName}
          </Text>
          <Text 
            fontSize={config.taglineSize}
            color="neutral.400"
            lineHeight="1"
            letterSpacing="wider"
            textTransform="uppercase"
          >
            {currentTheme.branding.tagline}
          </Text>
        </VStack>
      )}
    </HStack>
  );
};
