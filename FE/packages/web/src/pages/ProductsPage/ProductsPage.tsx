import React, { useState, useEffect } from 'react';
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
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, SettingsIcon } from '@chakra-ui/icons';

import { RootState, AppDispatch } from '../../store';
import { 
  fetchProducts, 
  searchProducts, 
  fetchProductsByCategory, 
  fetchProductsByPriceRange,
  fetchCategories,
  setFilters
} from '../../store/slices/productSlice';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { Product } from '../../types';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { 
    products, 
    categories, 
    pagination, 
    isLoading, 
    error, 
    filters 
  } = useSelector((state: RootState) => state.products);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLoading: cartLoading } = useSelector((state: RootState) => state.cart);

  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values
  const filterBgColor = useColorModeValue('white', 'gray.800');
  const filterBorderColor = useColorModeValue('gray.200', 'gray.700');

  // Load initial data
  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 20 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const newFilters = { 
      ...filters, 
      page: 0, 
      sortBy: value, 
      sortDir: sortDir 
    };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  };

  // Handle sort direction change
  const handleSortDirChange = (direction: 'asc' | 'desc') => {
    setSortDir(direction);
    const newFilters = { 
      ...filters, 
      page: 0, 
      sortBy: sortBy, 
      sortDir: direction 
    };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  };

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm.trim()));
    } else {
      dispatch(fetchProducts({ page: 0, size: 20 }));
    }
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    if (category) {
      dispatch(fetchProductsByCategory(category));
    } else {
      dispatch(fetchProducts({ page: 0, size: 20 }));
    }
  };

  // Handle price range filter
  const handlePriceRangeFilter = () => {
    dispatch(fetchProductsByPriceRange({ 
      minPrice: priceRange[0], 
      maxPrice: priceRange[1] 
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newFilters = { 
      ...filters, 
      page: page 
    };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  };

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCartAsync({
        productId: product.id,
        quantity: 1,
      })).unwrap();

      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle product click
  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };
  const cardBgColor = useColorModeValue('white', 'gray.800');

  const FilterPanel = () => (
    <VStack spacing={6} align="stretch" w="250px">
      <Box>
        <Heading size="sm" mb={3}>Categories</Heading>
        <Select
          placeholder="Select category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
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
                      src={product.imageUrl}
                      alt={product.name}
                      borderTopRadius="lg"
                      h="250px"
                      w="full"
                      objectFit="cover"
                    />
                    {product.category && (
                      <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        colorScheme="accent"
                        variant="solid"
                        fontSize="xs"
                      >
                        {product.category}
                      </Badge>
                    )}
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
                        {product.rating && (
                          <>
                            <HStack spacing={1}>
                              {[...Array(5)].map((_, i) => (
                                <Text
                                  key={i}
                                  color={i < Math.floor(product.rating || 0) ? 'yellow.400' : 'gray.300'}
                                  fontSize="sm"
                                >
                                  ★
                                </Text>
                              ))}
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                              ({product.reviewCount || 0})
                            </Text>
                          </>
                        )}
                      </HStack>

                      <HStack spacing={2}>
                        <Text fontSize="lg" fontWeight="bold" color="primary.500">
                          ${product.price}
                        </Text>
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
