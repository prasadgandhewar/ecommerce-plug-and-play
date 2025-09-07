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
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useContent } from '../../hooks/useContent';
import productService from '../../services/productService';
import { Product, SpecialProductsResponse } from '../../types';

const HomePage: React.FC = () => {
  const { t } = useContent('homepage');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [specialProducts, setSpecialProducts] = useState<SpecialProductsResponse>({
    newArrivals: [],
    productsWithOffers: [],
    bestSellers: []
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get hero slider data from content
  const heroSlides = t('hero.slides', { returnObjects: true }) as any[];

  // Fetch special products from API
  useEffect(() => {
    const fetchSpecialProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setError(null);
        
        // Fetch special products using the new API (5 products each type)
        const specialProductsData = await productService.getSpecialProductsGrouped(5);
        setSpecialProducts(specialProductsData);
        
        console.log('Special products loaded:', specialProductsData);
      } catch (error) {
        console.error('Error fetching special products:', error);
        setError('Failed to load products. Please try again later.');
        
        // Fallback to empty arrays if API fails - the error component will handle the display
        setSpecialProducts({
          newArrivals: [],
          productsWithOffers: [],
          bestSellers: []
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchSpecialProducts();
  }, []); // Remove 't' dependency to prevent infinite loop

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

  // Get service features data from content
  const serviceFeatures = t('serviceFeatures', { returnObjects: true }) as any[];

  // Loading component for product sections
  const ProductSectionLoader = () => (
    <Center py={8}>
      <VStack spacing={4}>
        <Spinner size="lg" color="gray.600" />
        <Text color="gray.600">Loading products...</Text>
      </VStack>
    </Center>
  );

  // Empty state component for when no products are available
  const ProductSectionEmpty: React.FC<{ sectionName: string }> = ({ sectionName }) => (
    <Center py={12}>
      <VStack spacing={4}>
        <Box
          p={6}
          borderRadius="full"
          bg="gray.100"
          color="gray.400"
          fontSize="3xl"
        >
          📦
        </Box>
        <VStack spacing={2}>
          <Heading size="md" color="gray.600">
            No {sectionName} Available
          </Heading>
          <Text color="gray.500" textAlign="center" maxW="300px">
            We're working on adding more {sectionName.toLowerCase()} to our collection. Check back soon!
          </Text>
        </VStack>
        <Button
          as={RouterLink}
          to="/products"
          size="sm"
          colorScheme="gray"
          variant="outline"
        >
          Browse All Products
        </Button>
      </VStack>
    </Center>
  );

  // Error component for product sections with static fallback
  const ProductSectionError: React.FC<{ fallbackProducts?: any[] }> = ({ fallbackProducts = [] }) => (
    <Center py={8}>
      <VStack spacing={4}>
        {fallbackProducts.length > 0 ? (
          <>
            <Text color="orange.500" textAlign="center" fontSize="sm">
              Using offline content
            </Text>
            <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="full">
              {fallbackProducts.map((product, index) => (
                <ProductCard key={`fallback-${index}`} product={product} isApiProduct={false} />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <>
            <Text color="red.500" textAlign="center">
              {error}
            </Text>
            <Button
              size="sm"
              onClick={() => window.location.reload()}
              colorScheme="red"
              variant="outline"
            >
              Retry
            </Button>
          </>
        )}
      </VStack>
    </Center>
  );

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
                        {String(t('hero.badgeText'))}
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
                            {String(t('hero.pricePrefix'))} <Text as="span" color="yellow.400" fontWeight="800">{slide.price}</Text>
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
              aria-label={String(t('navigation.previousSlide'))}
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
              aria-label={String(t('navigation.nextSlide'))}
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
            {String(t('sections.newArrivals.title'))}
          </Heading>

          {isLoadingProducts ? (
            <ProductSectionLoader />
          ) : error && specialProducts.newArrivals.length === 0 ? (
            <ProductSectionError fallbackProducts={(t('products.featured', { returnObjects: true }) as any[])?.slice(0, 5) || []} />
          ) : specialProducts.newArrivals.length === 0 ? (
            <ProductSectionEmpty sectionName="New Arrivals" />
          ) : (
            <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="full">
              {specialProducts.newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} isApiProduct={true} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      {/* Our Bestsellers Section */}
      <Container maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          <Heading size="xl" color="gray.900" textAlign="center">
            {String(t('sections.bestsellers.title'))}
          </Heading>

          {isLoadingProducts ? (
            <ProductSectionLoader />
          ) : error && specialProducts.bestSellers.length === 0 ? (
            <ProductSectionError fallbackProducts={(t('products.bestsellers', { returnObjects: true }) as any[])?.slice(0, 5) || []} />
          ) : specialProducts.bestSellers.length === 0 ? (
            <ProductSectionEmpty sectionName="Best Sellers" />
          ) : (
            <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="full">
              {specialProducts.bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} isApiProduct={true} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      {/* Special Offers Section */}
      <Container maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          <Heading size="xl" color="gray.900" textAlign="center">
            {String(t('sections.specialOffers.title'))}
          </Heading>

          {isLoadingProducts ? (
            <ProductSectionLoader />
          ) : error && specialProducts.productsWithOffers.length === 0 ? (
            <ProductSectionError fallbackProducts={(t('products.bestsellers', { returnObjects: true }) as any[])?.slice(0, 3) || []} />
          ) : specialProducts.productsWithOffers.length === 0 ? (
            <ProductSectionEmpty sectionName="Special Offers" />
          ) : (
            <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="full">
              {specialProducts.productsWithOffers.map((product) => (
                <ProductCard key={product.id} product={product} isApiProduct={true} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      {/* Service Features Section */}
      <Box bg="gray.50" py={{ base: 6, md: 8 }}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }}>
            {serviceFeatures.map((feature, index) => (
              <HStack key={index} spacing={3} p={3} textAlign="left">
                <Box
                  p={2}
                  borderRadius="lg"
                  bg="white"
                  color="primary.600"
                  boxShadow="sm"
                  fontSize="lg"
                  flexShrink={0}
                >
                  {feature.emoji}
                </Box>
                <VStack spacing={1} align="start" flex={1}>
                  <Text fontWeight="600" fontSize="sm" color="gray.900" lineHeight="1.2">
                    {feature.title}
                  </Text>
                  <Text color="gray.600" fontSize="xs" lineHeight="1.3">
                    {feature.description}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: any; isApiProduct?: boolean }> = ({ product, isApiProduct = false }) => {
  const { t } = useContent('homepage');

  // Extract product data based on source (API vs static content)
  const productData = isApiProduct ? {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: null, // Could be calculated from offers
    image: product.mainImageUrl || product.imageUrl || (product.images && product.images[0]) || '/placeholder-image.jpg',
    isNew: product.specialProperties?.newArrival || false,
    hasOffer: product.specialProperties?.hasOffer || false,
    isBestSeller: product.specialProperties?.bestSeller || false,
    badge: product.specialProperties?.hasOffer ? 'OFFER' : (product.specialProperties?.newArrival ? 'NEW' : (product.specialProperties?.bestSeller ? 'BESTSELLER' : null)),
    stock: product.stockQuantity || product.totalStock || 0,
    rating: product.averageRating || product.rating || 0,
    reviewCount: product.totalReviews || product.reviewCount || 0
  } : {
    // Static content format
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    isNew: product.isNew || false,
    hasOffer: product.discount || false,
    badge: product.badge,
    stock: product.stock || 0,
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0
  };

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
            src={productData.image}
            alt={productData.name}
            objectFit="cover"
            transition="transform 0.3s ease"
            _hover={{ transform: 'scale(1.05)' }}
            fallbackSrc="/placeholder-image.jpg"
          />
        </AspectRatio>
        
        {/* Badges */}
        <VStack position="absolute" top={3} left={3} spacing={1} align="start">
          {productData.hasOffer && (
            <Badge
              bg="red.500"
              color="white"
              px={2}
              py={1}
              fontSize="xs"
              fontWeight="600"
              borderRadius="sm"
            >
              {productData.badge || 'OFFER'}
            </Badge>
          )}
          {productData.isNew && !productData.hasOffer && (
            <Badge
              bg="green.500"
              color="white"
              px={2}
              py={1}
              fontSize="xs"
              fontWeight="600"
              borderRadius="sm"
            >
              {String(t('buttons.newBadge', { defaultValue: 'NEW' }))}
            </Badge>
          )}
          {productData.isBestSeller && !productData.hasOffer && !productData.isNew && (
            <Badge
              bg="blue.500"
              color="white"
              px={2}
              py={1}
              fontSize="xs"
              fontWeight="600"
              borderRadius="sm"
            >
              BESTSELLER
            </Badge>
          )}
        </VStack>

        {/* Out of Stock Overlay */}
        {productData.stock === 0 && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Badge
              bg="red.500"
              color="white"
              px={3}
              py={2}
              fontSize="sm"
              fontWeight="600"
            >
              OUT OF STOCK
            </Badge>
          </Box>
        )}

        {/* Hover overlay with Quick Look button */}
        {productData.stock > 0 && (
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
              as={RouterLink}
              to={`/products/${productData.id}`}
              size="sm"
              bg="white"
              color="gray.900"
              fontSize="xs"
              fontWeight="600"
              _hover={{ bg: 'gray.100' }}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {String(t('buttons.quickLook', { defaultValue: 'QUICK LOOK' }))}
            </Button>
          </Box>
        )}
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
            {productData.name}
          </Heading>
          
          {/* Rating */}
          {productData.rating > 0 && (
            <HStack spacing={1}>
              <Text fontSize="sm" color="gray.600">
                ★ {productData.rating.toFixed(1)}
              </Text>
              {productData.reviewCount > 0 && (
                <Text fontSize="xs" color="gray.500">
                  ({productData.reviewCount})
                </Text>
              )}
            </HStack>
          )}
          
          <HStack justify="space-between" w="full" align="center">
            <VStack spacing={0} align="start">
              {productData.originalPrice ? (
                <HStack spacing={2} align="baseline">
                  <Text fontSize="sm" color="gray.400" textDecoration="line-through">
                    ${productData.originalPrice.toFixed(2)}
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="gray.900">
                    ${productData.price.toFixed(2)}
                  </Text>
                </HStack>
              ) : (
                <Text fontSize="lg" fontWeight="700" color="gray.900">
                  ${productData.price.toFixed(2)}
                </Text>
              )}
            </VStack>
          </HStack>
          
          {/* Add to Cart Button - Full Width */}
          <Button
            w="full"
            size="sm"
            bg={productData.stock > 0 ? "gray.900" : "gray.400"}
            color="white"
            _hover={productData.stock > 0 ? { bg: 'gray.800' } : {}}
            fontSize="xs"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wide"
            py={6}
            isDisabled={productData.stock === 0}
            cursor={productData.stock === 0 ? "not-allowed" : "pointer"}
          >
            {productData.stock === 0 ? 'OUT OF STOCK' : String(t('buttons.addToCart', { defaultValue: 'ADD TO CART' }))}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;
