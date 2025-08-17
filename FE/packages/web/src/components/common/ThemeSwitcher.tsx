import React from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  HStack,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTheme } from '../../context/ThemeContext';
import { getAllThemes } from '../../config/themes';

interface ThemeSwitcherProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'menu';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  size = 'md',
  variant = 'menu'
}) => {
  const { currentTheme, setTheme } = useTheme();
  const allThemes = getAllThemes();

  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonBorder = useColorModeValue('gray.200', 'gray.600');

  if (variant === 'button') {
    return (
      <HStack spacing={2}>
        {allThemes.map((theme) => (
          <Button
            key={theme.id}
            size={size}
            variant={currentTheme.id === theme.id ? 'solid' : 'outline'}
            onClick={() => setTheme(theme.id)}
            colorScheme={currentTheme.id === theme.id ? 'primary' : 'gray'}
          >
            {theme.name}
          </Button>
        ))}
      </HStack>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        size={size}
        variant="outline"
        bg={buttonBg}
        borderColor={buttonBorder}
        _hover={{ bg: 'primary.50' }}
      >
        <HStack spacing={2}>
          <Box
            w={3}
            h={3}
            borderRadius="full"
            bg={currentTheme.colors.primary[500]}
          />
          <Text>{currentTheme.name}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {allThemes.map((theme) => (
          <MenuItem
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            bg={currentTheme.id === theme.id ? 'primary.50' : 'transparent'}
            _hover={{ bg: 'primary.50' }}
          >
            <HStack spacing={3} w="full">
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg={theme.colors.primary[500]}
              />
              <Box flex="1">
                <Text fontWeight={currentTheme.id === theme.id ? '600' : '400'}>
                  {theme.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {theme.description}
                </Text>
              </Box>
              {currentTheme.id === theme.id && (
                <Badge colorScheme="primary" size="sm">
                  Active
                </Badge>
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
