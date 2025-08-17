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
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  EmailIcon,
  PhoneIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { 
  FaLeaf, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight="700" fontSize="lg" mb={4} color="white">
      {children}
    </Text>
  );
};

const Footer: React.FC = () => {
  const { currentTheme } = useTheme();
  
  return (
    <Box
      bg="neutral.800"
      color="neutral.300"
      mt="auto"
    >
      <Container as={Stack} maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 8, md: 10 }}>
          {/* Company Info */}
          <Stack spacing={6}>
            <Box>
              <Box mb={6}>
                <BrandLogo size={{ base: "sm", md: "md" }} />
              </Box>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="neutral.400" lineHeight="1.6">
                {currentTheme.content.footer?.description || 'Transform your space with our curated collection of premium products.'}
              </Text>
            </Box>
            <Stack direction="row" spacing={{ base: 3, md: 4 }} flexWrap="wrap">
              <IconButton
                aria-label="Facebook"
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                  transform: 'translateY(-2px)',
                }}
                // @ts-ignore
                icon={<FaFacebook size="20px" />}
                borderRadius="xl"
              />
              <IconButton
                aria-label="Instagram"
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                  transform: 'translateY(-2px)',
                }}
                // @ts-ignore
                icon={<FaInstagram size="20px" />}
                borderRadius="xl"
              />
              <IconButton
                aria-label="Twitter"
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                  transform: 'translateY(-2px)',
                }}
                // @ts-ignore
                icon={<FaTwitter size="20px" />}
                borderRadius="xl"
              />
              <IconButton
                aria-label="LinkedIn"
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                  transform: 'translateY(-2px)',
                }}
                // @ts-ignore
                icon={<FaLinkedin size="20px" />}
                borderRadius="xl"
              />
            </Stack>
          </Stack>

          {/* Quick Links */}
          <Stack align="flex-start">
            <ListHeader>Quick Links</ListHeader>
            <VStack align="start" spacing={3}>
              <Link 
                as={RouterLink} 
                to="/" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                Home
              </Link>
              <Link 
                as={RouterLink} 
                to="/products" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                Shop
              </Link>
              <Link 
                as={RouterLink} 
                to="/about" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                About Us
              </Link>
              <Link 
                as={RouterLink} 
                to="/contact" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                Contact
              </Link>
              <Link 
                as={RouterLink} 
                to="/blog" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                {currentTheme.content.footer?.quickLinks.blog || 'Blog'}
              </Link>
            </VStack>
          </Stack>

          {/* Customer Care */}
          <Stack align="flex-start">
            <ListHeader>Customer Care</ListHeader>
            <VStack align="start" spacing={3}>
              <Link 
                as={RouterLink} 
                to="/shipping" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                Shipping Info
              </Link>
              <Link 
                as={RouterLink} 
                to="/returns" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                Returns & Exchanges
              </Link>
              <Link 
                as={RouterLink} 
                to="/faq" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                FAQ
              </Link>
              <Link 
                as={RouterLink} 
                to="/plant-care" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                Plant Care Guide
              </Link>
              <Link 
                as={RouterLink} 
                to="/support" 
                _hover={{ color: 'primary.400' }}
                fontSize="sm"
                transition="all 0.2s"
              >
                Customer Support
              </Link>
            </VStack>
          </Stack>

          {/* Newsletter & Contact */}
          <Stack align="flex-start" spacing={4}>
            <ListHeader>{currentTheme.content.footer?.newsletter.title || 'Stay Connected'}</ListHeader>
            <VStack align="start" spacing={4} w="full">
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="neutral.400">
                {currentTheme.content.footer?.newsletter.description || 'Subscribe to get special offers and exclusive deals.'}
              </Text>
              
              <VStack w="full" spacing={3}>
                <InputGroup size={{ base: 'sm', md: 'md' }}>
                  <Input
                    placeholder="Enter your email"
                    bg="neutral.700"
                    border="none"
                    color="white"
                    fontSize={{ base: 'sm', md: 'md' }}
                    _placeholder={{ color: 'neutral.400' }}
                    _focus={{
                      bg: 'neutral.600',
                      boxShadow: 'outline',
                    }}
                    borderRadius="xl"
                  />
                  <InputRightElement width={{ base: '4rem', md: '4.5rem' }}>
                    <Button 
                      h={{ base: '1.5rem', md: '1.75rem' }} 
                      size="sm" 
                      bg="primary.600"
                      color="white"
                      _hover={{ bg: 'primary.700' }}
                      borderRadius="lg"
                      fontSize={{ base: '2xs', md: 'xs' }}
                    >
                      Subscribe
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </VStack>

              <VStack align="start" spacing={3} pt={4}>
                <HStack spacing={3}>
                  {/* @ts-ignore */}
                  <FaMapMarkerAlt color="var(--chakra-colors-primary-400)" />
                  <Text fontSize={{ base: 'xs', md: 'sm' }}>{currentTheme.content.footer?.contact.address || '123 Main Street, City, ST 12345'}</Text>
                </HStack>
                <HStack spacing={3}>
                  {/* @ts-ignore */}
                  <FaPhone color="var(--chakra-colors-primary-400)" />
                  <Text fontSize={{ base: 'xs', md: 'sm' }}>{currentTheme.content.footer?.contact.phone || '+1 (555) 123-4567'}</Text>
                </HStack>
                <HStack spacing={3}>
                  {/* @ts-ignore */}
                  <FaEnvelope color="var(--chakra-colors-primary-400)" />
                  <Text fontSize={{ base: 'xs', md: 'sm' }}>{currentTheme.content.footer?.contact.email || 'hello@example.com'}</Text>
                </HStack>
              </VStack>
            </VStack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box py={{ base: 6, md: 8 }} bg="neutral.900">
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 3, md: 4 }}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="neutral.500">
              © {new Date().getFullYear()} {currentTheme.content.footer?.copyright || currentTheme.branding.companyName}. All rights reserved.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: 2, sm: 6 }}>
              <Link 
                href="#" 
                fontSize={{ base: 'xs', md: 'sm' }} 
                color="neutral.500" 
                _hover={{ color: 'primary.400' }}
                transition="all 0.2s"
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                fontSize={{ base: 'xs', md: 'sm' }} 
                color="neutral.500" 
                _hover={{ color: 'primary.400' }}
                transition="all 0.2s"
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                fontSize={{ base: 'xs', md: 'sm' }} 
                color="neutral.500" 
                _hover={{ color: 'primary.400' }}
                transition="all 0.2s"
              >
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
