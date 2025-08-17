import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeConfig, getTheme, defaultTheme } from '../config/themes';
import { createChakraTheme } from '../styles/chakraThemeBuilder';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme 
}) => {
  // Get theme from environment variable, props, localStorage, or default
  const getInitialTheme = (): string => {
    // Priority: 1. Environment variable, 2. Props, 3. localStorage, 4. Default
    const envTheme = process.env.REACT_APP_THEME;
    const storedTheme = localStorage.getItem('app-theme');
    
    return envTheme || initialTheme || storedTheme || defaultTheme.id;
  };

  const [currentThemeId, setCurrentThemeId] = useState<string>(getInitialTheme);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => 
    getTheme(getInitialTheme())
  );

  const setTheme = (themeId: string) => {
    const newTheme = getTheme(themeId);
    setCurrentThemeId(themeId);
    setCurrentTheme(newTheme);
    localStorage.setItem('app-theme', themeId);
  };

  useEffect(() => {
    setCurrentTheme(getTheme(currentThemeId));
  }, [currentThemeId]);

  // Create Chakra UI theme from current theme config
  const chakraTheme = createChakraTheme(currentTheme);

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: ['plant', 'tech'],
  };

  return (
    <ThemeContext.Provider value={value}>
      <ChakraProvider theme={chakraTheme}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};
