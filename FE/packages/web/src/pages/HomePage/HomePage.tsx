import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  Icon,
  Flex,
  useColorModeValue,
  Center,
  Stack,
  Grid,
  GridItem,
  AspectRatio,
  Divider,
  Avatar,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaShieldAlt, FaShippingFast, FaHeart, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const HomePage: React.FC = () => {
  const { currentTheme } = useTheme();
  
  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Starlight Succulent',
      price: 95.00,
      originalPrice: 120.00,
      image: 'https://images.unsplash.com/photo-1509423350716-97f2360af622?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 24,
      badge: 'Trending',
      category: 'Indoor Plants',
    },
    {
      id: 2,
      name: 'Silver Mist',
      price: 92.00,
      originalPrice: 115.00,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 18,
      badge: 'Popular',
      category: 'Indoor Plants',
    },
    {
      id: 3,
      name: 'Golden Glow',
      price: 85.00,
      originalPrice: 105.00,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 31,
      badge: 'Sale',
      category: 'Indoor Plants',
    },
    {
      id: 4,
      name: 'Desert Bloom',
      price: 70.00,
      originalPrice: 90.00,
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 15,
      badge: 'New',
      category: 'Succulents',
    },
  ];

  const categories = currentTheme.content.categories;

  const features = currentTheme.content.features.map((feature, index) => ({
    ...feature,
    icon: [FaShieldAlt, FaShippingFast, FaHeart, FaStar][index] || FaShieldAlt
  }));

  const testimonials = [
    {
      text: "I am absolutely thrilled with the service I received from their company! They were attentive, responsive, and genuinely cared about meeting my needs. I highly recommend them.",
      author: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c88c70a7?w=100&h=100&fit=crop",
      rating: 5,
    },
    {
      text: "Their team exceeded our expectations. Their creative approach and attention to detail brought our vision to life. Highly recommended!",
      author: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 5,
    },
    {
      text: "Outstanding quality and customer service. The plants arrived in perfect condition and have thrived in our home. Will definitely order again!",
      author: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 5,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgImage="linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%), url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        color="white"
        py={{ base: 20, md: 32 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <VStack spacing={8} align={{ base: 'center', lg: 'start' }} textAlign={{ base: 'center', lg: 'left' }}>
              <Text
                fontSize="lg"
                fontWeight="600"
                letterSpacing="wider"
                textTransform="uppercase"
                opacity={0.9}
              >
                Welcome to {currentTheme.branding.companyName}
              </Text>
              <Heading
                fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                fontWeight="800"
                lineHeight="1.1"
                letterSpacing="-0.02em"
              >
                {currentTheme.content.heroTitle}
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl" opacity={0.95} lineHeight="1.7">
                {currentTheme.content.heroSubtitle}
              </Text>
              <HStack spacing={4} pt={4}>
                <Button
                  as={RouterLink}
                  to="/products"
                  size="xl"
                  bg="white"
                  color="primary.600"
                  _hover={{
                    bg: 'gray.50',
                    transform: 'translateY(-2px)',
                  }}
                  px={8}
                  py={6}
                  borderRadius="xl"
                  fontWeight="700"
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  borderColor="white"
                  color="white"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    transform: 'translateY(-2px)',
                  }}
                  px={8}
                  py={6}
                  borderRadius="xl"
                  borderWidth="2px"
                  fontWeight="700"
                >
                  Learn More
                </Button>
              </HStack>
            </VStack>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={16} bg="gray.50">
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8}>
            {features.map((feature, index) => (
              <VStack key={index} spacing={4} textAlign="center">
                <Box
                  p={4}
                  borderRadius="full"
                  bg="primary.100"
                  color="primary.600"
                >
                  {/* @ts-ignore */}
                  <feature.icon size="24px" />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md" color="neutral.800">
                    {feature.title}
                  </Heading>
                  <Text color="neutral.600" fontSize="sm">
                    {feature.description}
                  </Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Trending Products Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={12}>
          <Box textAlign="center" maxW="3xl">
            <Heading size="3xl" mb={4} color="neutral.800">
              Trending Products
            </Heading>
            <Text fontSize="xl" color="neutral.600">
              Discover our most popular plants loved by garden enthusiasts worldwide
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8} w="full">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                variant="elevated"
                cursor="pointer"
                overflow="hidden"
                bg="white"
                borderRadius="2xl"
              >
                <Box position="relative">
                  <AspectRatio ratio={1}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      objectFit="cover"
                    />
                  </AspectRatio>
                  <Badge
                    position="absolute"
                    top={4}
                    left={4}
                    bg="accent.500"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="700"
                  >
                    {product.badge}
                  </Badge>
                  <Button
                    position="absolute"
                    top={4}
                    right={4}
                    size="sm"
                    variant="ghost"
                    bg="whiteAlpha.900"
                    color="gray.600"
                    borderRadius="full"
                    _hover={{ bg: 'white', color: 'red.500' }}
                  >
                    {/* @ts-ignore */}
                    <FaHeart />
                  </Button>
                </Box>
                <CardBody p={6}>
                  <VStack align="start" spacing={4}>
                    <VStack align="start" spacing={1} w="full">
                      <Text fontSize="sm" color="primary.600" fontWeight="600">
                        {product.category}
                      </Text>
                      <Heading size="md" color="neutral.800" lineHeight="1.3">
                        {product.name}
                      </Heading>
                    </VStack>
                    
                    <HStack spacing={2}>
                      <HStack spacing={1}>
                        {[...Array(5)].map((_, i) => (
                          // @ts-ignore
                          <FaStar
                            key={i}
                            color={i < product.rating ? 'var(--chakra-colors-accent-400)' : 'var(--chakra-colors-gray-300)'}
                            size="12px"
                          />
                        ))}
                      </HStack>
                      <Text fontSize="sm" color="neutral.500" fontWeight="500">
                        ({product.reviews})
                      </Text>
                    </HStack>

                    <HStack justify="space-between" w="full" align="center">
                      <VStack spacing={0} align="start">
                        <Text fontSize="xl" fontWeight="800" color="primary.600">
                          ${product.price.toFixed(2)}
                        </Text>
                        {product.originalPrice && (
                          <Text
                            fontSize="sm"
                            color="neutral.400"
                            textDecoration="line-through"
                          >
                            ${product.originalPrice.toFixed(2)}
                          </Text>
                        )}
                      </VStack>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="primary"
                        borderRadius="lg"
                        px={4}
                        _hover={{
                          bg: 'primary.600',
                          color: 'white',
                          borderColor: 'primary.600',
                        }}
                      >
                        Add to Cart
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Flash Sale Section */}
      <Box bg="primary.600" color="white" py={16}>
        <Container maxW="5xl" textAlign="center">
          <VStack spacing={6}>
            <Heading size="2xl" fontWeight="800">
              Flash Sale: Up to 50% Off On Select Items!
            </Heading>
            <Text fontSize="xl" opacity={0.9} maxW="3xl">
              Don't miss out on our flash sale event! For a limited time, enjoy up to 50% off
              on a selection of our best-selling products.
            </Text>
            <Button
              size="xl"
              bg="white"
              color="primary.600"
              _hover={{
                bg: 'gray.50',
                transform: 'translateY(-2px)',
              }}
              px={10}
              py={6}
              borderRadius="xl"
              fontWeight="700"
              mt={4}
            >
              Shop Now
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading size="3xl" mb={4} color="neutral.800">
              Our Categories
            </Heading>
            <Text fontSize="xl" color="neutral.600">
              Explore our diverse collection of plants for every space and style
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} w="full">
            {categories.map((category, index) => (
              <Card
                key={index}
                cursor="pointer"
                overflow="hidden"
                borderRadius="2xl"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '2xl',
                }}
                transition="all 0.3s ease"
              >
                <AspectRatio ratio={1}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    objectFit="cover"
                  />
                </AspectRatio>
                <CardBody p={6} textAlign="center">
                  <VStack spacing={2}>
                    <Heading size="md" color="neutral.800">
                      {category.name}
                    </Heading>
                    <Text color="neutral.500" fontSize="sm">
                      {category.count}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* About Section */}
      <Box bg="sage.50" py={20}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
            <VStack spacing={8} align="start">
              <Heading size="3xl" color="neutral.800" lineHeight="1.2">
                Your Premier Destination for All Green.
              </Heading>
              <Text fontSize="lg" color="neutral.600" lineHeight="1.8">
                At Urban Jungle Co., we believe in the transformative power of plants. Whether
                you're a seasoned gardener or just starting your green journey, our curated
                selection of plants will inspire and enrich your living space.
              </Text>
              <SimpleGrid columns={2} spacing={8} w="full">
                <VStack spacing={2} align="start">
                  <Heading size="xl" color="primary.600" fontWeight="800">
                    98%
                  </Heading>
                  <Text color="neutral.600" fontWeight="600">
                    Customer Satisfaction
                  </Text>
                </VStack>
                <VStack spacing={2} align="start">
                  <Heading size="xl" color="primary.600" fontWeight="800">
                    103K
                  </Heading>
                  <Text color="neutral.600" fontWeight="600">
                    Plants Sold
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1586093248969-3d8ea0c76a99?w=600&h=600&fit=crop"
                alt="Beautiful plants"
                borderRadius="2xl"
                boxShadow="2xl"
              />
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading size="3xl" mb={4} color="neutral.800">
              What Our Customers Say
            </Heading>
            <Text fontSize="xl" color="neutral.600">
              Discover the reasons why people love us and become your go-to partner.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} w="full">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="elevated" p={8} borderRadius="2xl">
                <VStack spacing={6} align="start">
                  {/* @ts-ignore */}
                  <FaQuoteLeft size="32px" color="var(--chakra-colors-primary-300)" />
                  <Text fontSize="lg" lineHeight="1.7" color="neutral.700">
                    {testimonial.text}
                  </Text>
                  <HStack spacing={4}>
                    <Avatar src={testimonial.avatar} size="md" />
                    <VStack spacing={1} align="start">
                      <Text fontWeight="700" color="neutral.800">
                        {testimonial.author}
                      </Text>
                      <HStack spacing={1}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          // @ts-ignore
                          <FaStar key={i} color="var(--chakra-colors-accent-400)" size="12px" />
                        ))}
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="neutral.800" color="white" py={20}>
        <Container maxW="5xl" textAlign="center">
          <VStack spacing={8}>
            <Heading size="3xl" fontWeight="800">
              Ready to Find your Perfect Plant?
            </Heading>
            <Text fontSize="xl" opacity={0.9} maxW="3xl">
              Browse our online store or visit us in person to experience the beauty of
              nature.
            </Text>
            <Button
              size="xl"
              bg="primary.600"
              color="white"
              _hover={{
                bg: 'primary.700',
                transform: 'translateY(-2px)',
              }}
              px={10}
              py={6}
              borderRadius="xl"
              fontWeight="700"
              mt={4}
            >
              Shop Now
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
