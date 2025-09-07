import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Link,
  Button,
  useDisclosure,
  Text,
  Badge,
  Avatar,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaSearch, FaShoppingBag, FaHeart } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import LanguageSwitcher from '../LanguageSwitcher';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <Box 
      bg="white" 
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
      borderBottom="1px"
      borderColor="gray.100"
    >
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <Flex h={{ base: 16, md: 20 }} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Link
            as={RouterLink}
            to="/"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            <BrandLogo size={{ base: 'sm', md: 'md' }} />
          </Link>

          {/* Big Search Bar - Always visible */}
          <Box flex="1" maxW="600px" mx={{ base: 4, md: 8 }}>
            <InputGroup size={{ base: 'md', md: 'lg' }}>
              <InputLeftElement pointerEvents="none">
                {/* @ts-ignore */}
                <FaSearch color="gray" size="18px" />
              </InputLeftElement>
              <Input
                placeholder={currentTheme.content.searchPlaceholder || "Search products..."}
                bg="gray.50"
                border="2px solid"
                borderColor="gray.200"
                borderRadius="full"
                fontSize={{ base: 'md', md: 'lg' }}
                _focus={{
                  bg: 'white',
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
                _hover={{
                  borderColor: 'gray.300',
                }}
              />
            </InputGroup>
          </Box>

          {/* Right Side Actions */}
          <HStack spacing={{ base: 1, md: 2 }}>
            {/* Cart */}
            <Box position="relative">
              <IconButton
                as={RouterLink}
                to="/cart"
                size={{ base: 'md', md: 'lg' }}
                variant="ghost"
                aria-label="Shopping Cart"
                // @ts-ignore
                icon={<FaShoppingBag size={{ base: '18px', md: '20px' }} />}
                color="neutral.600"
                _hover={{ 
                  bg: 'primary.50',
                  color: 'primary.600',
                }}
                borderRadius="xl"
              />
              {cartItems.length > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="primary.600"
                  color="white"
                  borderRadius="full"
                  fontSize="xs"
                  minW={{ base: '18px', md: '22px' }}
                  h={{ base: '18px', md: '22px' }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="700"
                  border="2px solid white"
                >
                  {cartItems.length}
                </Badge>
              )}
            </Box>

            {/* User Account */}
            {isAuthenticated ? (
              <Button
                as={RouterLink}
                to="/profile"
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                borderRadius="xl"
                _hover={{ bg: 'primary.50' }}
                p={{ base: 1, md: 2 }}
              >
                <Avatar
                  size={{ base: 'sm', md: 'sm' }}
                  name={user ? `${user.firstName} ${user.lastName}` : 'User'}
                  bg="primary.600"
                  color="white"
                />
              </Button>
            ) : (
              <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  color="neutral.700"
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{
                    bg: 'primary.50',
                    color: 'primary.600',
                  }}
                  px={3}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="sm"
                  bg="primary.600"
                  color="white"
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{
                    bg: 'primary.700',
                  }}
                  px={3}
                >
                  Sign Up
                </Button>
              </HStack>
            )}

            {/* Hamburger Menu - Always visible */}
            <IconButton
              size={{ base: 'md', md: 'lg' }}
              icon={<HamburgerIcon />}
              aria-label="Open Menu"
              variant="ghost"
              onClick={onOpen}
              borderRadius="xl"
              color="neutral.600"
              _hover={{ 
                bg: 'primary.50',
                color: 'primary.600',
              }}
            />
          </HStack>
        </Flex>
      </Container>

      {/* Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay bg="blackAlpha.600" />
        <DrawerContent borderTopLeftRadius="2xl" borderBottomLeftRadius="2xl">
          <DrawerCloseButton 
            size="lg" 
            borderRadius="full"
            top={6}
            right={6}
          />
          <DrawerHeader pt={8} pb={4}>
            <BrandLogo size="lg" />
          </DrawerHeader>
          
          <DrawerBody px={6}>
            <VStack spacing={6} align="stretch">
              {/* Navigation Links */}
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                  Navigation
                </Text>
                <Link 
                  as={RouterLink} 
                  to="/" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  fontSize="lg"
                  _hover={{ bg: 'primary.50', color: 'primary.600' }}
                  transition="all 0.2s ease"
                >
                  🏠 Home
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/products" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  fontSize="lg"
                  _hover={{ bg: 'primary.50', color: 'primary.600' }}
                  transition="all 0.2s ease"
                >
                  🛍️ Shop
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/categories" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  fontSize="lg"
                  _hover={{ bg: 'primary.50', color: 'primary.600' }}
                  transition="all 0.2s ease"
                >
                  📂 Categories
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/wishlist" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  fontSize="lg"
                  _hover={{ bg: 'primary.50', color: 'primary.600' }}
                  transition="all 0.2s ease"
                >
                  ❤️ Favorites
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/about" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  fontSize="lg"
                  _hover={{ bg: 'primary.50', color: 'primary.600' }}
                  transition="all 0.2s ease"
                >
                  ℹ️ About
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/contact" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  fontSize="lg"
                  _hover={{ bg: 'primary.50', color: 'primary.600' }}
                  transition="all 0.2s ease"
                >
                  📞 Contact
                </Link>
              </VStack>

              {/* Settings Section */}
              <VStack spacing={3} align="stretch">
                <Text fontSize="sm" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                  Preferences
                </Text>
                <HStack justify="space-between" px={4} py={3} borderRadius="xl" _hover={{ bg: 'gray.50' }}>
                  <HStack>
                    <Text>🎨</Text>
                    <Text fontWeight="600" fontSize="md">Theme</Text>
                  </HStack>
                  <ThemeSwitcher size="sm" />
                </HStack>
                <HStack justify="space-between" px={4} py={3} borderRadius="xl" _hover={{ bg: 'gray.50' }}>
                  <HStack>
                    <Text>🌐</Text>
                    <Text fontWeight="600" fontSize="md">Language</Text>
                  </HStack>
                  <LanguageSwitcher />
                </HStack>
              </VStack>

              {/* Additional Account Options for Mobile when not authenticated */}
              {!isAuthenticated && (
                <VStack spacing={3} align="stretch" display={{ base: 'flex', md: 'none' }}>
                  <Text fontSize="sm" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    Account
                  </Text>
                  <Button
                    as={RouterLink}
                    to="/login"
                    onClick={onClose}
                    w="full"
                    variant="outline"
                    borderRadius="xl"
                    py={6}
                    fontSize="lg"
                    leftIcon={<Text fontSize="lg">👤</Text>}
                  >
                    Sign In
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    onClick={onClose}
                    w="full"
                    bg="primary.600"
                    color="white"
                    borderRadius="xl"
                    py={6}
                    fontSize="lg"
                    _hover={{ bg: 'primary.700' }}
                    leftIcon={<Text fontSize="lg">✨</Text>}
                  >
                    Sign Up
                  </Button>
                </VStack>
              )}

              {/* Additional Account Options for Authenticated Users */}
              {isAuthenticated && (
                <VStack spacing={3} align="stretch">
                  <Text fontSize="sm" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    My Account
                  </Text>
                  <Link 
                    as={RouterLink} 
                    to="/orders" 
                    onClick={onClose}
                    px={4}
                    py={3}
                    borderRadius="xl"
                    fontWeight="600"
                    fontSize="lg"
                    _hover={{ bg: 'primary.50', color: 'primary.600' }}
                    transition="all 0.2s ease"
                  >
                    📦 My Orders
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    w="full"
                    variant="outline"
                    borderColor="red.300"
                    color="red.500"
                    borderRadius="xl"
                    py={4}
                    fontSize="md"
                    leftIcon={<Text fontSize="lg">🚪</Text>}
                    _hover={{ bg: 'red.50', borderColor: 'red.400' }}
                  >
                    Sign Out
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
