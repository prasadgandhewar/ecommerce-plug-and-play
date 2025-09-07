import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  HStack,
  Icon,
  VStack,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';

const Footer: React.FC = () => {
  const { currentTheme } = useTheme();
  
  return (
    <Box
      bg="neutral.800"
      color="neutral.300"
      mt="auto"
    >
      <Container as={Stack} maxW="7xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
        <Stack 
          direction={{ base: 'column', md: 'row' }} 
          spacing={{ base: 6, md: 8 }} 
          align={{ base: 'center', md: 'flex-start' }}
          textAlign={{ base: 'center', md: 'left' }}
        >
          {/* Company Info - Takes more space */}
          <Stack spacing={4} flex={2}>
            <Box>
              <Box mb={3}>
                <BrandLogo size={{ base: "sm", md: "md" }} />
              </Box>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="neutral.400" lineHeight="1.5">
                {currentTheme.content.footer?.description || 'Transform your space with our curated collection of premium products.'}
              </Text>
            </Box>
            <Stack direction="row" spacing={2} justify={{ base: 'center', md: 'flex-start' }}>
              <IconButton
                aria-label="Facebook"
                variant="ghost"
                size="sm"
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                }}
                // @ts-ignore
                icon={<FaFacebook size="16px" />}
                borderRadius="lg"
              />
              <IconButton
                aria-label="Instagram"
                variant="ghost"
                size="sm"
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                }}
                // @ts-ignore
                icon={<FaInstagram size="16px" />}
                borderRadius="lg"
              />
              <IconButton
                aria-label="Twitter"
                variant="ghost"
                size="sm"
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                }}
                // @ts-ignore
                icon={<FaTwitter size="16px" />}
                borderRadius="lg"
              />
              <IconButton
                aria-label="LinkedIn"
                variant="ghost"
                size="sm"
                color="neutral.400"
                _hover={{ 
                  color: 'white', 
                  bg: 'primary.600',
                }}
                // @ts-ignore
                icon={<FaLinkedin size="16px" />}
                borderRadius="lg"
              />
            </Stack>
          </Stack>

          {/* Navigation Links - Horizontal Layout */}
          <Stack spacing={4} flex={3}>
            <VStack spacing={4} align={{ base: 'center', md: 'flex-start' }}>
              {/* Quick Links Row */}
              <HStack 
                spacing={{ base: 4, md: 6 }} 
                align="flex-start" 
                w="full"
                flexWrap="wrap"
                justify={{ base: 'center', md: 'flex-start' }}
              >
                <Text fontWeight="600" fontSize="sm" color="white" minW="fit-content">
                  Quick Links:
                </Text>
                <HStack spacing={4} flexWrap="wrap">
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
                </HStack>
              </HStack>

              {/* Customer Care Row */}
              <HStack 
                spacing={{ base: 4, md: 6 }} 
                align="flex-start" 
                w="full"
                flexWrap="wrap"
                justify={{ base: 'center', md: 'flex-start' }}
              >
                <Text fontWeight="600" fontSize="sm" color="white" minW="fit-content">
                  Customer Care:
                </Text>
                <HStack spacing={4} flexWrap="wrap">
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
                    to="/support" 
                    _hover={{ color: 'primary.400' }}
                    fontSize="sm"
                    transition="all 0.2s"
                  >
                    Support
                  </Link>
                </HStack>
              </HStack>
            </VStack>
          </Stack>
        </Stack>
      </Container>

      <Box py={{ base: 4, md: 5 }} bg="neutral.900">
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 2, md: 3 }}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Text fontSize="xs" color="neutral.500">
              © {new Date().getFullYear()} {currentTheme.content.footer?.copyright || currentTheme.branding.companyName}. All rights reserved.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: 1, sm: 4 }}>
              <Link 
                href="#" 
                fontSize="xs" 
                color="neutral.500" 
                _hover={{ color: 'primary.400' }}
                transition="all 0.2s"
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                fontSize="xs" 
                color="neutral.500" 
                _hover={{ color: 'primary.400' }}
                transition="all 0.2s"
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                fontSize="xs" 
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
