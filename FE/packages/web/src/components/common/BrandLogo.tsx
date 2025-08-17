import React from 'react';
import { HStack, VStack, Text, Box } from '@chakra-ui/react';
import { FaLeaf, FaMicrochip } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
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

  const sizeConfig = {
    sm: { iconSize: '16px', fontSize: 'md', taglineSize: '2xs' },
    md: { iconSize: '20px', fontSize: 'xl', taglineSize: 'xs' },
    lg: { iconSize: '24px', fontSize: '2xl', taglineSize: 'sm' },
  };

  const config = sizeConfig[size];

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
        <IconComponent size={config.iconSize} />
      </Box>
    );
  }

  return (
    <HStack spacing={3}>
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
        <IconComponent size={config.iconSize} />
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
