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
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  HamburgerIcon, 
  CloseIcon, 
  ChevronDownIcon,
  SearchIcon,
  BellIcon,
} from '@chakra-ui/icons';

import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const NavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link
    as={RouterLink}
    to={href}
    px={3}
    py={2}
    rounded="md"
    fontSize="md"
    fontWeight="medium"
    color={useColorModeValue('gray.700', 'gray.200')}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('primary.50', 'gray.700'),
      color: useColorModeValue('primary.600', 'white'),
      transform: 'translateY(-1px)',
    }}
    transition="all 0.2s"
  >
    {children}
  </Link>
);

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.900')} 
      px={4} 
      shadow="lg"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">
        {/* Logo */}
        <Box>
          <Link
            as={RouterLink}
            to="/"
            fontSize="2xl"
            fontWeight="bold"
            color="primary.500"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            <HStack spacing={2}>
              <Text fontSize="3xl">🛒</Text>
              <Text 
                bgGradient="linear(to-r, primary.500, accent.500)"
                bgClip="text"
                fontSize="xl"
                fontWeight="extrabold"
              >
                E-Store
              </Text>
            </HStack>
          </Link>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <HStack spacing={8} alignItems="center">
            <HStack as="nav" spacing={4}>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/products">Products</NavLink>
              <NavLink href="/categories">Categories</NavLink>
              <NavLink href="/deals">Deals</NavLink>
            </HStack>
          </HStack>
        )}

        {/* Right Side Actions */}
        <Flex alignItems="center">
          <HStack spacing={3}>
            {/* Search Icon */}
            <IconButton
              size="md"
              variant="ghost"
              aria-label="Search"
              icon={<SearchIcon />}
              _hover={{ bg: useColorModeValue('primary.50', 'gray.700') }}
            />

            {/* Notifications */}
            <IconButton
              size="md"
              variant="ghost"
              aria-label="Notifications"
              icon={<BellIcon />}
              _hover={{ bg: useColorModeValue('primary.50', 'gray.700') }}
            />

            {/* Cart */}
            <Box position="relative">
              <IconButton
                as={RouterLink}
                to="/cart"
                size="md"
                variant="ghost"
                aria-label="Shopping Cart"
                icon={<Text fontSize="xl">🛒</Text>}
                _hover={{ bg: useColorModeValue('primary.50', 'gray.700') }}
              />
              {cartItems.length > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="accent.500"
                  color="white"
                  borderRadius="full"
                  fontSize="xs"
                  minW="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
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
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar
                    size="sm"
                    name={user?.name}
                    bg="primary.500"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/orders">
                    Orders
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/settings">
                    Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={2}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  colorScheme="primary"
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="sm"
                  colorScheme="primary"
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
                display={{ md: 'none' }}
                onClick={isOpen ? onClose : onOpen}
              />
            )}
          </HStack>
        </Flex>
      </Flex>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Link as={RouterLink} to="/" onClick={onClose}>
                Home
              </Link>
              <Link as={RouterLink} to="/products" onClick={onClose}>
                Products
              </Link>
              <Link as={RouterLink} to="/categories" onClick={onClose}>
                Categories
              </Link>
              <Link as={RouterLink} to="/deals" onClick={onClose}>
                Deals
              </Link>
              <Link as={RouterLink} to="/cart" onClick={onClose}>
                Cart ({cartItems.length})
              </Link>
              {!isAuthenticated && (
                <>
                  <Link as={RouterLink} to="/login" onClick={onClose}>
                    Sign In
                  </Link>
                  <Link as={RouterLink} to="/register" onClick={onClose}>
                    Sign Up
                  </Link>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
