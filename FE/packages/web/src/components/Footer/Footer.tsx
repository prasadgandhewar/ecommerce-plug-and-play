import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  Heading,
  useColorModeValue,
  HStack,
  Icon,
  VStack,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  EmailIcon,
  PhoneIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight="500" fontSize="lg" mb={2}>
      {children}
    </Text>
  );
};

const Footer: React.FC = () => {
  return (
    <Box
      bg={useColorModeValue('gray.900', 'gray.900')}
      color={useColorModeValue('white', 'gray.200')}
      mt="auto"
    >
      <Container as={Stack} maxW="7xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {/* Company Info */}
          <Stack spacing={6}>
            <Box>
              <HStack spacing={2} mb={4}>
                <Text fontSize="3xl" color="primary.400">🛒</Text>
                <Text 
                  fontSize="xl"
                  fontWeight="bold"
                  bgGradient="linear(to-r, primary.400, accent.400)"
                  bgClip="text"
                >
                  E-Store
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.400">
                Your one-stop destination for quality products at competitive prices. 
                Shop with confidence and enjoy exceptional customer service.
              </Text>
            </Box>
            <Stack direction="row" spacing={6}>
              <IconButton
                aria-label="Facebook"
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'white', bg: 'gray.700' }}
                icon={<Icon viewBox="0 0 24 24" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </Icon>}
              />
              <IconButton
                aria-label="Twitter"
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'white', bg: 'gray.700' }}
                icon={<Icon viewBox="0 0 24 24" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </Icon>}
              />
              <IconButton
                aria-label="Instagram"
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'white', bg: 'gray.700' }}
                icon={<Icon viewBox="0 0 24 24" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </Icon>}
              />
            </Stack>
          </Stack>

          {/* Shop Links */}
          <Stack align="flex-start">
            <ListHeader>Shop</ListHeader>
            <Link as={RouterLink} to="/products" _hover={{ color: 'primary.400' }}>All Products</Link>
            <Link as={RouterLink} to="/categories" _hover={{ color: 'primary.400' }}>Categories</Link>
            <Link as={RouterLink} to="/deals" _hover={{ color: 'primary.400' }}>Deals & Offers</Link>
            <Link as={RouterLink} to="/new-arrivals" _hover={{ color: 'primary.400' }}>New Arrivals</Link>
            <Link as={RouterLink} to="/bestsellers" _hover={{ color: 'primary.400' }}>Best Sellers</Link>
          </Stack>

          {/* Customer Service */}
          <Stack align="flex-start">
            <ListHeader>Customer Service</ListHeader>
            <Link as={RouterLink} to="/contact" _hover={{ color: 'primary.400' }}>Contact Us</Link>
            <Link as={RouterLink} to="/shipping" _hover={{ color: 'primary.400' }}>Shipping Info</Link>
            <Link as={RouterLink} to="/returns" _hover={{ color: 'primary.400' }}>Returns & Exchanges</Link>
            <Link as={RouterLink} to="/faq" _hover={{ color: 'primary.400' }}>FAQ</Link>
            <Link as={RouterLink} to="/size-guide" _hover={{ color: 'primary.400' }}>Size Guide</Link>
          </Stack>

          {/* Contact Info */}
          <Stack align="flex-start">
            <ListHeader>Contact Info</ListHeader>
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={EmailIcon} color="primary.400" />
                <Text fontSize="sm">support@estore.com</Text>
              </HStack>
              <HStack>
                <Icon as={PhoneIcon} color="primary.400" />
                <Text fontSize="sm">+1 (555) 123-4567</Text>
              </HStack>
              <Text fontSize="sm" color="gray.400">
                Mon-Fri: 9AM-6PM PST<br />
                Sat: 10AM-4PM PST<br />
                Sun: Closed
              </Text>
            </VStack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box py={6}>
        <Divider mb={6} borderColor="gray.700" />
        <Container maxW="7xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}
          >
            <Text fontSize="sm" color="gray.400">
              © {new Date().getFullYear()} E-Store. All rights reserved.
            </Text>
            <Stack direction="row" spacing={6}>
              <Link href="#" fontSize="sm" color="gray.400" _hover={{ color: 'white' }}>
                Privacy Policy
              </Link>
              <Link href="#" fontSize="sm" color="gray.400" _hover={{ color: 'white' }}>
                Terms of Service
              </Link>
              <Link href="#" fontSize="sm" color="gray.400" _hover={{ color: 'white' }}>
                Cookie Policy
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
