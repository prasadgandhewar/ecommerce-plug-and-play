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
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useContent } from '../hooks/useContent';

const LanguageSwitcher: React.FC = () => {
  const { changeLanguage, getCurrentLanguage, getAvailableLanguages } = useContent();

  const languageNames: { [key: string]: string } = {
    en: 'English',
    es: 'Español',
  };

  const languageFlags: { [key: string]: string } = {
    en: '🇺🇸',
    es: '🇪🇸',
  };

  const currentLang = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="ghost"
        size="sm"
        _hover={{ bg: 'gray.100' }}
      >
        <HStack spacing={2}>
          <Text fontSize="lg">{languageFlags[currentLang]}</Text>
          <Text fontSize="sm" fontWeight="medium">
            {languageNames[currentLang]}
          </Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {availableLanguages.map((lang) => (
          <MenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            bg={lang === currentLang ? 'gray.100' : 'white'}
            _hover={{ bg: 'gray.50' }}
          >
            <HStack spacing={3}>
              <Text fontSize="lg">{languageFlags[lang]}</Text>
              <Text fontSize="sm">{languageNames[lang]}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
