import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  HStack,
  VStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Stack,
  useColorModeValue,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Divider,
  IconButton,
  Icon,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';

const ProductsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values
  const filterBgColor = useColorModeValue('white', 'gray.800');
  const filterBorderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 128,
      badge: 'Best Seller',
      category: 'Electronics',
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 89,
      badge: 'New',
      category: 'Electronics',
    },
    {
      id: 3,
      name: 'Ergonomic Laptop Stand',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 45,
      badge: 'Sale',
      category: 'Office',
    },
    {
      id: 4,
      name: 'Premium Coffee Maker',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 76,
      badge: 'Popular',
      category: 'Kitchen',
    },
    {
      id: 5,
      name: 'Mechanical Keyboard',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 234,
      badge: 'Hot',
      category: 'Electronics',
    },
    {
      id: 6,
      name: 'Yoga Mat Premium',
      price: 39.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1592432678016-e910d50d99b0?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 67,
      badge: 'Eco-Friendly',
      category: 'Sports',
    },
  ];

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Kitchen', 'Office'];

  const FilterPanel = () => (
    <VStack spacing={6} align="stretch" w="250px">
      <Box>
        <Heading size="sm" mb={3}>Categories</Heading>
        <CheckboxGroup
          value={selectedCategories}
          onChange={(values) => setSelectedCategories(values as string[])}
        >
          <VStack align="start" spacing={2}>
            {categories.map((category) => (
              <Checkbox key={category} value={category}>
                {category}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Box>

      <Divider />

      <Box>
        <Heading size="sm" mb={3}>Price Range</Heading>
        <VStack spacing={4}>
          <RangeSlider
            value={priceRange}
            onChange={setPriceRange}
            min={0}
            max={1000}
            step={10}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <HStack>
            <Text fontSize="sm">${priceRange[0]}</Text>
            <Text fontSize="sm">-</Text>
            <Text fontSize="sm">${priceRange[1]}</Text>
          </HStack>
        </VStack>
      </Box>

      <Divider />

      <Box>
        <Heading size="sm" mb={3}>Brand</Heading>
        <VStack align="start" spacing={2}>
          <Checkbox>Apple</Checkbox>
          <Checkbox>Samsung</Checkbox>
          <Checkbox>Sony</Checkbox>
          <Checkbox>Nike</Checkbox>
          <Checkbox>Adidas</Checkbox>
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>Products</Heading>
          <Text color="gray.600">Discover our amazing collection of products</Text>
        </Box>

        {/* Search and Controls */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
        >
          <InputGroup maxW={{ base: 'full', md: '400px' }}>
            <InputLeftElement pointerEvents="none">
              <Text color="gray.300">🔍</Text>
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <HStack spacing={4}>
            {isMobile && (
              <IconButton
                aria-label="Open filters"
                icon={<Text>🔧</Text>}
                onClick={onOpen}
                variant="outline"
              />
            )}
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              w="200px"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </Select>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Flex gap={8} align="start">
          {/* Desktop Filters */}
          {!isMobile && (
            <Box
              bg={filterBgColor}
              p={6}
              borderRadius="lg"
              shadow="sm"
              border="1px"
              borderColor={filterBorderColor}
            >
              <FilterPanel />
            </Box>
          )}

          {/* Products Grid */}
          <Box flex="1">
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
              {products.map((product) => (
                <Card
                  key={product.id}
                  cursor="pointer"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'xl',
                  }}
                  transition="all 0.2s"
                  bg={cardBgColor}
                >
                  <Box position="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      borderTopRadius="lg"
                      h="250px"
                      w="full"
                      objectFit="cover"
                    />
                    <Badge
                      position="absolute"
                      top={3}
                      left={3}
                      colorScheme="accent"
                      variant="solid"
                      fontSize="xs"
                    >
                      {product.badge}
                    </Badge>
                    <HStack
                      position="absolute"
                      top={3}
                      right={3}
                      spacing={1}
                    >
                      <IconButton
                        size="sm"
                        variant="ghost"
                        bg="whiteAlpha.800"
                        _hover={{ bg: 'whiteAlpha.900' }}
                        aria-label="Add to wishlist"
                                                        icon={<Text>❤️</Text>}
                      />
                      <IconButton
                        size="sm"
                        variant="ghost"
                        bg="whiteAlpha.800"
                        _hover={{ bg: 'whiteAlpha.900' }}
                        aria-label="Quick view"
                                                        icon={<Text>👁️</Text>}
                      />
                    </HStack>
                  </Box>
                  
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>
                          {product.category}
                        </Text>
                        <Heading size="sm" noOfLines={2}>
                          {product.name}
                        </Heading>
                      </Box>
                      
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

                      <HStack spacing={2}>
                        <Text fontSize="lg" fontWeight="bold" color="primary.500">
                          ${product.price}
                        </Text>
                        {product.originalPrice && (
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            textDecoration="line-through"
                          >
                            ${product.originalPrice}
                          </Text>
                        )}
                      </HStack>

                      <Button
                        colorScheme="primary"
                        size="sm"
                        w="full"
                        leftIcon={<Text>🛒</Text>}
                        _hover={{
                          transform: 'translateY(-1px)',
                        }}
                      >
                        Add to Cart
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {/* Load More Button */}
            <Flex justify="center" mt={12}>
              <Button size="lg" variant="outline" colorScheme="primary">
                Load More Products
              </Button>
            </Flex>
          </Box>
        </Flex>
      </VStack>

      {/* Mobile Filter Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <FilterPanel />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default ProductsPage;
