import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  Badge,
  Grid,
  AspectRatio,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useContent } from '../../hooks/useContent';

const HomePage: React.FC = () => {
  const { t } = useContent('homepage');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get hero slider data from content
  const heroSlides = t('hero.slides', { returnObjects: true }) as any[];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Get product and service data from content
  const featuredProducts = t('products.featured', { returnObjects: true }) as any[];
  const bestsellerProducts = t('products.bestsellers', { returnObjects: true }) as any[];
  const serviceFeatures = t('serviceFeatures', { returnObjects: true }) as any[];

  return (
    <Box>
      {/* Hero Slider Section */}
      <Box
        bg="gray.50"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, md: 0 }}
      >
        <Container maxW="7xl">
          {/* Main Hero Slider */}
          <Box
            position="relative"
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            mb={8}
          >
            {/* Slider Container */}
            <Box position="relative" minH="400px" overflow="hidden">
              {heroSlides.map((slide, index) => (
                <Box
                  key={slide.id}
                  position="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  opacity={index === currentSlide ? 1 : 0}
                  transform={`translateX(${(index - currentSlide) * 100}%)`}
                  transition="all 0.5s ease-in-out"
                  zIndex={index === currentSlide ? 1 : 0}
                >
                  <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={0} alignItems="center" minH="400px">
                    <VStack 
                      spacing={6} 
                      align={{ base: 'center', lg: 'start' }} 
                      textAlign={{ base: 'center', lg: 'left' }}
                      p={{ base: 8, md: 12 }}
                      bg={slide.bgColor}
                      color="white"
                      h="full"
                      justify="center"
                    >
                      <Badge 
                        colorScheme="red" 
                        fontSize="sm" 
                        px={4} 
                        py={2} 
                        borderRadius="full"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        bg="red.500"
                        color="white"
                      >
                        {t('hero.badgeText')}
                      </Badge>
                      <Heading
                        fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                        fontWeight="800"
                        lineHeight="1.1"
                      >
                        {slide.title}
                      </Heading>
                      <Text fontSize={{ base: 'lg', md: 'xl' }} opacity={0.9}>
                        {slide.subtitle}
                      </Text>
                      <Text fontSize="md" opacity={0.8}>
                        {slide.description}
                      </Text>
                      <VStack spacing={3} align={{ base: 'center', lg: 'start' }}>
                        <HStack spacing={3}>
                          <Badge colorScheme="yellow" fontSize="lg" px={3} py={1} bg="yellow.400" color="gray.900">
                            {slide.discount}
                          </Badge>
                          <Text fontSize="lg" fontWeight="600">
                            {t('hero.pricePrefix')} <Text as="span" color="yellow.400" fontWeight="800">{slide.price}</Text>
                          </Text>
                        </HStack>
                      </VStack>
                      <Button
                        as={RouterLink}
                        to="/products"
                        size="lg"
                        bg="white"
                        color="gray.900"
                        _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                        px={8}
                        py={6}
                        borderRadius="sm"
                        fontWeight="600"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        mt={4}
                        transition="all 0.3s ease"
                      >
                        {slide.buttonText}
                      </Button>
                    </VStack>
                    <Box h="400px" overflow="hidden">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        w="full"
                        h="full"
                        objectFit="cover"
                        transition="transform 0.5s ease"
                        _hover={{ transform: 'scale(1.05)' }}
                      />
                    </Box>
                  </Grid>
                </Box>
              ))}
            </Box>

            {/* Navigation Arrows */}
            <IconButton
              aria-label={t('navigation.previousSlide')}
              icon={<ChevronLeftIcon />}
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              bg="whiteAlpha.800"
              color="gray.900"
              _hover={{ bg: 'white' }}
              size="lg"
              borderRadius="full"
              onClick={prevSlide}
            />
            <IconButton
              aria-label={t('navigation.nextSlide')}
              icon={<ChevronRightIcon />}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              bg="whiteAlpha.800"
              color="gray.900"
              _hover={{ bg: 'white' }}
              size="lg"
              borderRadius="full"
              onClick={nextSlide}
            />

            {/* Slide Indicators */}
            <Flex
              position="absolute"
              bottom={4}
              left="50%"
              transform="translateX(-50%)"
              zIndex={2}
              gap={2}
            >
              {heroSlides.map((_, index) => (
                <Box
                  key={index}
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={index === currentSlide ? 'white' : 'whiteAlpha.500'}
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{ bg: 'white' }}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </Flex>
          </Box>
        </Container>
      </Box>

      {/* New Arrivals Section */}
      <Container maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          <Heading size="xl" color="gray.900" textAlign="center">
            {t('sections.newArrivals.title')}
          </Heading>

          <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="full">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Product of the Year Banner */}
      <Box bg="gray.100" py={16}>
        <Container maxW="5xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} alignItems="center">
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1586093248969-3d8ea0c76a99?w=500&h=400&fit=crop"
                alt="Product of the Year"
                borderRadius="lg"
                w="full"
                h="300px"
                objectFit="cover"
              />
            </Box>
            <VStack spacing={6} align="start" textAlign="left">
              <Heading size="lg" color="gray.900">
                {t('sections.productOfYear.title')}
              </Heading>
              <Text color="gray.600" fontSize="md" lineHeight="1.6">
                {t('sections.productOfYear.description')}
              </Text>
              <Button
                as={RouterLink}
                to="/products"
                size="md"
                colorScheme="blackAlpha"
                bg="gray.900"
                color="white"
                _hover={{ bg: 'gray.800' }}
                borderRadius="sm"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {t('sections.productOfYear.buttonText')}
              </Button>
            </VStack>
          </Grid>
        </Container>
      </Box>

      {/* Our Bestsellers Section */}
      <Container maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          <Heading size="xl" color="gray.900" textAlign="center">
            {t('sections.bestsellers.title')}
          </Heading>

          <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="full">
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Special Offers Section */}
      <Container maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          <Heading size="xl" color="gray.900" textAlign="center">
            {t('sections.specialOffers.title')}
          </Heading>

          <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="full">
            {bestsellerProducts.slice(0, 3).map((product) => (
              <ProductCard key={`offer-${product.id}`} product={product} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Service Features Section */}
      <Box bg="gray.50" py={{ base: 12, md: 16 }}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 8, md: 6 }}>
            {serviceFeatures.map((feature, index) => (
              <VStack key={index} spacing={4} textAlign="center" p={6}>
                <Box
                  p={4}
                  borderRadius="full"
                  bg="white"
                  color="gray.700"
                  boxShadow="sm"
                  fontSize="2xl"
                >
                  {feature.emoji}
                </Box>
                <VStack spacing={2}>
                  <Heading size="md" color="gray.900">
                    {feature.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    {feature.description}
                  </Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { t } = useContent('homepage');
  return (
    <Box
      cursor="pointer"
      bg="white"
      borderRadius="sm"
      overflow="hidden"
      _hover={{
        shadow: 'lg',
      }}
      transition="all 0.2s ease"
      h="fit-content"
      border="1px solid"
      borderColor="gray.100"
    >
      <Box position="relative" bg="gray.50" overflow="hidden">
        <AspectRatio ratio={1}>
          <Image
            src={product.image}
            alt={product.name}
            objectFit="cover"
            transition="transform 0.3s ease"
            _hover={{ transform: 'scale(1.05)' }}
          />
        </AspectRatio>
        
        {/* Badges */}
        <VStack position="absolute" top={3} left={3} spacing={1} align="start">
          {product.discount && (
            <Badge
              bg="red.500"
              color="white"
              px={2}
              py={1}
              fontSize="xs"
              fontWeight="600"
              borderRadius="sm"
            >
              {product.badge}
            </Badge>
          )}
          {product.isNew && !product.discount && (
            <Badge
              bg="green.500"
              color="white"
              px={2}
              py={1}
              fontSize="xs"
              fontWeight="600"
              borderRadius="sm"
            >
              {t('buttons.newBadge', { defaultValue: 'NEW' })}
            </Badge>
          )}
        </VStack>

        {/* Hover overlay with Quick Look button */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          opacity={0}
          _hover={{ opacity: 1 }}
          transition="opacity 0.3s ease"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            size="sm"
            bg="white"
            color="gray.900"
            fontSize="xs"
            fontWeight="600"
            _hover={{ bg: 'gray.100' }}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {t('buttons.quickLook')}
          </Button>
        </Box>
      </Box>
      
      <Box p={4}>
        <VStack align="start" spacing={3}>
          <Heading 
            size="sm" 
            color="gray.900" 
            lineHeight="1.3"
            textTransform="uppercase"
            fontWeight="600"
            letterSpacing="wide"
            fontSize="sm"
            noOfLines={2}
          >
            {product.name}
          </Heading>
          
          <HStack justify="space-between" w="full" align="center">
            <VStack spacing={0} align="start">
              {product.originalPrice ? (
                <HStack spacing={2} align="baseline">
                  <Text fontSize="sm" color="gray.400" textDecoration="line-through">
                    ${product.originalPrice.toFixed(2)}
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="gray.900">
                    ${product.price.toFixed(2)}
                  </Text>
                </HStack>
              ) : (
                <Text fontSize="lg" fontWeight="700" color="gray.900">
                  ${product.price.toFixed(2)}
                </Text>
              )}
            </VStack>
          </HStack>
          
          {/* Add to Cart Button - Full Width */}
          <Button
            w="full"
            size="sm"
            bg="gray.900"
            color="white"
            _hover={{ bg: 'gray.800' }}
            fontSize="xs"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wide"
            py={6}
          >
            {t('buttons.addToCart')}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;
