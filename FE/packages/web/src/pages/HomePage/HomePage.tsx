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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';


const HomePage: React.FC = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, primary.400, accent.400)',
    'linear(to-r, primary.600, accent.600)'
  );

  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 128,
      badge: 'Best Seller',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 89,
      badge: 'New',
    },
    {
      id: 3,
      name: 'Laptop Stand',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 45,
      badge: 'Sale',
    },
    {
      id: 4,
      name: 'Coffee Maker',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 76,
      badge: 'Popular',
    },
  ];

  const categories = [
    {
      name: 'Electronics',
      icon: '📱',
      count: '1,234 items',
      color: 'blue.500',
    },
    {
      name: 'Fashion',
      icon: '👕',
      count: '856 items',
      color: 'pink.500',
    },
    {
      name: 'Home & Garden',
      icon: '🏠',
      count: '642 items',
      color: 'green.500',
    },
    {
      name: 'Sports',
      icon: '⚽',
      count: '423 items',
      color: 'orange.500',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight="extrabold"
              lineHeight="shorter"
            >
              Discover Amazing Products
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl" opacity={0.9}>
              Shop the latest trends and find everything you need in one place.
              Quality products, competitive prices, and exceptional service.
            </Text>
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/products"
                size="lg"
                bg="white"
                color="primary.500"
                _hover={{
                  bg: 'gray.100',
                  transform: 'translateY(-2px)',
                }}
                rightIcon={<Text>🛒</Text>}
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                borderColor="white"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-2px)',
                }}
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              Shop by Category
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Explore our wide range of product categories
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
            {categories.map((category, index) => (
              <Card
                key={index}
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                }}
                transition="all 0.2s"
              >
                <CardBody textAlign="center">
                  <VStack spacing={4}>
                    <Box fontSize="3xl">{category.icon}</Box>
                    <VStack spacing={1}>
                      <Heading size="md">{category.name}</Heading>
                      <Text color="gray.500" fontSize="sm">
                        {category.count}
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Featured Products Section */}
      <Box bg="gray.50" py={16}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <Box textAlign="center">
              <Heading size="xl" mb={4}>
                Featured Products
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Hand-picked products just for you
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  cursor="pointer"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'xl',
                  }}
                  transition="all 0.2s"
                  bg="white"
                >
                  <Box position="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      borderTopRadius="lg"
                      h="200px"
                      w="full"
                      objectFit="cover"
                    />
                    <Badge
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme="accent"
                      variant="solid"
                    >
                      {product.badge}
                    </Badge>
                    <HStack
                      position="absolute"
                      top={2}
                      right={2}
                      spacing={1}
                    >
                      <Button size="sm" variant="ghost" bg="whiteAlpha.800">
                        <Text>❤️</Text>
                      </Button>
                      <Button size="sm" variant="ghost" bg="whiteAlpha.800">
                        <Text>👁️</Text>
                      </Button>
                    </HStack>
                  </Box>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm">{product.name}</Heading>
                      
                      <HStack>
                        <HStack spacing={1}>
                          {[...Array(5)].map((_, i) => (
                            <Text
                              key={i}
                              color={i < Math.floor(product.rating) ? 'yellow.400' : 'gray.300'}
                              fontSize="sm"
                            >
                              ★
                            </Text>
                          ))}
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          ({product.reviews})
                        </Text>
                      </HStack>

                      <HStack>
                        <Text fontSize="lg" fontWeight="bold" color="primary.500">
                          ${product.price}
                        </Text>
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          textDecoration="line-through"
                        >
                          ${product.originalPrice}
                        </Text>
                      </HStack>

                      <Button
                        colorScheme="primary"
                        size="sm"
                        w="full"
                        leftIcon={<Text>🛒</Text>}
                      >
                        Add to Cart
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            <Center>
              <Button
                as={RouterLink}
                to="/products"
                size="lg"
                variant="outline"
                colorScheme="primary"
              >
                View All Products
              </Button>
            </Center>
          </VStack>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box py={16} bg="primary.500" color="white">
        <Container maxW="4xl" textAlign="center">
          <VStack spacing={6}>
            <Heading size="lg">Stay Updated</Heading>
            <Text fontSize="lg" opacity={0.9}>
              Subscribe to our newsletter and get exclusive deals and updates
            </Text>
            <HStack spacing={4} w="full" maxW="md">
              <Box flex="1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                  }}
                />
              </Box>
              <Button colorScheme="accent" size="lg">
                Subscribe
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
