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

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider data
  const heroSlides = [
    {
      id: 1,
      title: "Household Chairs",
      subtitle: "The best deals on Chairs",
      description: "Professional-grade chairs for creatives and professionals",
      discount: "$250 off",
      price: "$2,349.99",
      buttonText: "EXPLORE HOME DECOR",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      bgColor: "gray.900"
    },
    {
      id: 2,
      title: "Modern Furniture",
      subtitle: "Transform your living space",
      description: "Stylish and comfortable furniture for every room",
      discount: "Up to 40% off",
      price: "$1,999.99",
      buttonText: "SHOP FURNITURE",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
      bgColor: "blue.900"
    },
    {
      id: 3,
      title: "Home Accessories",
      subtitle: "Complete your home design",
      description: "Beautiful accessories and decor items",
      discount: "Free shipping",
      price: "$199.99",
      buttonText: "DISCOVER MORE",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop",
      bgColor: "green.900"
    }
  ];

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

  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'TABLE LAMP',
      price: 350.00,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 24,
      badge: 'NEW',
      isNew: true,
      discount: null,
    },
    {
      id: 2,
      name: 'BASKET WITH HANDLES',
      price: 150.00,
      originalPrice: 165.00,
      image: 'https://images.unsplash.com/photo-1586093248969-3d8ea0c76a99?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 18,
      badge: '-10%',
      isNew: true,
      discount: 10,
    },
    {
      id: 3,
      name: 'SMART WATCH',
      price: 45.00,
      originalPrice: 49.50,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 31,
      badge: '-10%',
      isNew: true,
      discount: 10,
    },
    {
      id: 4,
      name: 'SUN GLASSES',
      price: 35.00,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 15,
      badge: 'NEW',
      isNew: true,
      discount: null,
    },
  ];

  const bestsellerProducts = [
    {
      id: 5,
      name: 'TEA TABLE',
      price: 69.00,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 12,
      badge: 'NEW',
      isNew: true,
    },
    {
      id: 6,
      name: 'FLOWER VASE',
      price: 55.00,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 22,
      badge: 'NEW',
      isNew: true,
    },
    {
      id: 7,
      name: 'HEADPHONES',
      price: 145.00,
      originalPrice: 159.50,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 35,
      badge: '-10%',
      discount: 10,
    },
    {
      id: 8,
      name: 'HOUSEHOLD MATERIALS',
      price: 18.00,
      originalPrice: 21.60,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 8,
      badge: '-20%',
      discount: 20,
    },
  ];

  const serviceFeatures = [
    {
      title: "Free Delivery",
      description: "Free shipping on all orders over $50",
      emoji: "🚚"
    },
    {
      title: "Easy Returns", 
      description: "30-day return guarantee",
      emoji: "↩️"
    },
    {
      title: "24/7 Support",
      description: "Expert support anytime", 
      emoji: "🎧"
    },
    {
      title: "Secure Payment",
      description: "100% secure transactions",
      emoji: "🔒"
    }
  ];

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
                        SPECIAL OFFER
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
                            Starting from <Text as="span" color="yellow.400" fontWeight="800">{slide.price}</Text>
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
              aria-label="Previous slide"
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
              aria-label="Next slide"
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
            New Arrivals
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
                Product of The Year
              </Heading>
              <Text color="gray.600" fontSize="md" lineHeight="1.6">
                Discover our most innovative and popular product that has captured hearts worldwide. Experience excellence in every detail.
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
                Shop Now
              </Button>
            </VStack>
          </Grid>
        </Container>
      </Box>

      {/* Our Bestsellers Section */}
      <Container maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          <Heading size="xl" color="gray.900" textAlign="center">
            Our Bestsellers
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
            Special Offers
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
              NEW
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
            QUICK LOOK
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
            ADD TO CART
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;
