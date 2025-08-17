import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Link,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  HamburgerIcon, 
  CloseIcon, 
  ChevronDownIcon,
  SearchIcon,
  BellIcon,
} from '@chakra-ui/icons';
import { FaLeaf, FaSearch, FaShoppingBag, FaUser, FaHeart } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

const NavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link
    as={RouterLink}
    to={href}
    px={4}
    py={2}
    rounded="lg"
    fontSize="md"
    fontWeight="600"
    color="neutral.700"
    _hover={{
      textDecoration: 'none',
      bg: 'primary.50',
      color: 'primary.600',
      transform: 'translateY(-1px)',
    }}
    transition="all 0.2s ease"
  >
    {children}
  </Link>
);

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, lg: false });
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
          <HStack spacing={{ base: 2, md: 4 }}>
            <Link
              as={RouterLink}
              to="/"
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              <BrandLogo size={{ base: 'sm', md: 'md' }} />
            </Link>
            {!isMobile && <ThemeSwitcher size="sm" />}
          </HStack>

          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack spacing={1}>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/products">Shop</NavLink>
              <NavLink href="/categories">Categories</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </HStack>
          )}

          {/* Search Bar - Desktop Only */}
          {!isMobile && (
            <Box flex="1" maxW="400px" mx={8}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  {/* @ts-ignore */}
                  <FaSearch color="gray" size="16px" />
                </InputLeftElement>
                <Input
                  placeholder={currentTheme.content.searchPlaceholder}
                  bg="gray.50"
                  border="none"
                  borderRadius="full"
                  _focus={{
                    bg: 'white',
                    boxShadow: 'outline',
                  }}
                />
              </InputGroup>
            </Box>
          )}

          {/* Right Side Actions */}
          <HStack spacing={{ base: 2, md: 4 }}>
            {/* Wishlist - Desktop Only */}
            {!isMobile && (
              <IconButton
                size="lg"
                variant="ghost"
                aria-label="Wishlist"
                // @ts-ignore
                icon={<FaHeart size="18px" />}
                color="neutral.600"
                _hover={{ 
                  bg: 'primary.50',
                  color: 'primary.600',
                }}
                borderRadius="xl"
              />
            )}

            {/* Cart */}
            <Box position="relative">
              <IconButton
                as={RouterLink}
                to="/cart"
                size={{ base: 'md', md: 'lg' }}
                variant="ghost"
                aria-label="Shopping Cart"
                // @ts-ignore
                icon={<FaShoppingBag size={{ base: '16px', md: '18px' }} />}
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

            {/* User Menu */}
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="ghost"
                  cursor="pointer"
                  minW={0}
                  _hover={{ bg: 'primary.50' }}
                  p={1}
                >
                  <Avatar
                    size="sm"
                    name={user ? `${user.firstName} ${user.lastName}` : 'User'}
                    bg="primary.600"
                    color="white"
                  />
                </MenuButton>
                <MenuList borderRadius="xl" border="none" shadow="xl" py={2}>
                  <MenuItem 
                    as={RouterLink} 
                    to="/profile"
                    borderRadius="lg"
                    mx={2}
                    my={1}
                  >
                    My Account
                  </MenuItem>
                  <MenuItem 
                    as={RouterLink} 
                    to="/orders"
                    borderRadius="lg"
                    mx={2}
                    my={1}
                  >
                    My Orders
                  </MenuItem>
                  <MenuItem 
                    as={RouterLink} 
                    to="/wishlist"
                    borderRadius="lg"
                    mx={2}
                    my={1}
                  >
                    Wishlist
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    onClick={handleLogout}
                    borderRadius="lg"
                    mx={2}
                    my={1}
                    color="red.500"
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={{ base: 2, md: 3 }} display={{ base: 'none', md: 'flex' }}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  size="md"
                  color="neutral.700"
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{
                    bg: 'primary.50',
                    color: 'primary.600',
                  }}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="md"
                  bg="primary.600"
                  color="white"
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{
                    bg: 'primary.700',
                    transform: 'translateY(-1px)',
                  }}
                  px={6}
                >
                  Sign Up
                </Button>
              </HStack>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                size="md"
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label="Open Menu"
                variant="ghost"
                onClick={isOpen ? onClose : onOpen}
                borderRadius="xl"
                color="neutral.600"
                _hover={{ 
                  bg: 'primary.50',
                  color: 'primary.600',
                }}
              />
            )}
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Navigation Drawer */}
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
            <VStack spacing={4} align="stretch">
              {/* Search Bar */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  {/* @ts-ignore */}
                  <FaSearch color="gray" size="16px" />
                </InputLeftElement>
                <Input
                  placeholder={currentTheme.content.searchPlaceholder}
                  bg="gray.50"
                  border="none"
                  borderRadius="xl"
                />
              </InputGroup>

              {/* Navigation Links */}
              <VStack spacing={2} align="stretch" pt={4}>
                <Link 
                  as={RouterLink} 
                  to="/" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  _hover={{ bg: 'primary.50' }}
                >
                  Home
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/products" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  _hover={{ bg: 'primary.50' }}
                >
                  Shop
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/categories" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  _hover={{ bg: 'primary.50' }}
                >
                  Categories
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/about" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  _hover={{ bg: 'primary.50' }}
                >
                  About
                </Link>
                <Link 
                  as={RouterLink} 
                  to="/contact" 
                  onClick={onClose}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  fontWeight="600"
                  _hover={{ bg: 'primary.50' }}
                >
                  Contact
                </Link>
              </VStack>

              {/* Action Buttons */}
              <VStack spacing={3} pt={6}>
                <Button
                  as={RouterLink}
                  to="/cart"
                  onClick={onClose}
                  w="full"
                  variant="outline"
                  borderRadius="xl"
                  // @ts-ignore
                  leftIcon={<FaShoppingBag />}
                  justifyContent="space-between"
                  rightIcon={
                    cartItems.length > 0 ? (
                      <Badge bg="primary.600" color="white" borderRadius="full">
                        {cartItems.length}
                      </Badge>
                    ) : undefined
                  }
                >
                  Shopping Cart
                </Button>
                
                <Button
                  as={RouterLink}
                  to="/wishlist"
                  onClick={onClose}
                  w="full"
                  variant="outline"
                  borderRadius="xl"
                  // @ts-ignore
                  leftIcon={<FaHeart />}
                >
                  Wishlist
                </Button>

                {!isAuthenticated && (
                  <VStack w="full" spacing={2} pt={4}>
                    <Button
                      as={RouterLink}
                      to="/login"
                      onClick={onClose}
                      w="full"
                      variant="outline"
                      borderRadius="xl"
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
                      _hover={{ bg: 'primary.700' }}
                    >
                      Sign Up
                    </Button>
                  </VStack>
                )}
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
