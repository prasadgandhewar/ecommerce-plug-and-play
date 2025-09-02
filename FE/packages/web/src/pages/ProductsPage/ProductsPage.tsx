import React, { useState, useEffect, useCallback } from 'react';
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
  fetchMoreProducts,
  searchProducts, 
  fetchProductsByCategory, 
  fetchProductsByPriceRange,
  fetchCategories,
  setFilters
} from '../../store/slices/productSlice';
import {
  fetchCategoryFilters,
  fetchFiltersForCategory,
  addSelectedFilter,
  removeSelectedFilter,
  clearSelectedFilters,
} from '../../store/slices/categoryFilterSlice';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { Product, SelectedFilter } from '../../types';
import DynamicFilters from '../../components/DynamicFilters';

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
  const { 
    availableFilters, 
    selectedFilters, 
    isLoading: filtersLoading, 
    error: filtersError 
  } = useSelector((state: RootState) => state.categoryFilters);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLoading: cartLoading } = useSelector((state: RootState) => state.cart);

  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [sortOption, setSortOption] = useState('featured'); // Track the dropdown selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values
  const filterBgColor = useColorModeValue('white', 'gray.800');
  const filterBorderColor = useColorModeValue('gray.200', 'gray.700');

  // Load initial data
  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 20, sortBy: 'averageRating', sortDir: 'desc' }));
    dispatch(fetchCategories());
    dispatch(fetchCategoryFilters());
  }, [dispatch]);

  // Load filters when category changes
  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchFiltersForCategory(selectedCategory));
    } else {
      // Clear selected filters when no category is selected
      dispatch(clearSelectedFilters());
    }
  }, [selectedCategory, dispatch]);

  // Infinite scroll implementation
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    const newFilters = {
      ...filters,
      page: nextPage,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
      category: selectedCategory || undefined
    };

    try {
      const result = await dispatch(fetchMoreProducts(newFilters)).unwrap();
      
      setCurrentPage(nextPage);
      
      // Check if we have more pages
      if (result.last || result.numberOfElements < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [dispatch, currentPage, hasMore, isLoading, isLoadingMore, filters, sortBy, sortDir, searchTerm, selectedCategory]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      // Load more when user reaches 80% of the page
      if (scrollPercentage >= 0.8) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts]);

  // Handle sort change - updated to handle combined sort options
  const handleSortChange = (value: string) => {
    let newSortBy = 'name';
    let newSortDir: 'asc' | 'desc' = 'asc';

    switch (value) {
      case 'price-low':
        newSortBy = 'price';
        newSortDir = 'asc';
        break;
      case 'price-high':
        newSortBy = 'price';
        newSortDir = 'desc';
        break;
      case 'rating':
        newSortBy = 'averageRating';
        newSortDir = 'desc';
        break;
      case 'newest':
        newSortBy = 'createdAt';
        newSortDir = 'desc';
        break;
      case 'alphabetical':
        newSortBy = 'name';
        newSortDir = 'asc';
        break;
      case 'featured':
      default:
        newSortBy = 'averageRating';
        newSortDir = 'desc';
        break;
    }

    setSortOption(value);
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setCurrentPage(0);
    setHasMore(true);

    const newFilters = { 
      ...filters, 
      page: 0, 
      sortBy: newSortBy, 
      sortDir: newSortDir,
      query: searchTerm || undefined,
      category: selectedCategory || undefined
    };
    
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(0);
    setHasMore(true);
    const newFilters = {
      page: 0,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
      category: selectedCategory || undefined
    };
    
    dispatch(setFilters(newFilters));
    
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm.trim()));
    } else {
      dispatch(fetchProducts(newFilters));
    }
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    setHasMore(true);
    
    // Clear selected filters when category changes
    dispatch(clearSelectedFilters());
    
    const newFilters = {
      page: 0,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
      category: category || undefined
    };
    
    dispatch(setFilters(newFilters));
    
    if (category) {
      dispatch(fetchProductsByCategory(category));
    } else {
      dispatch(fetchProducts(newFilters));
    }
  };

  // Handle dynamic filter changes
  const handleDynamicFiltersChange = useCallback((filters: SelectedFilter[]) => {
    setCurrentPage(0);
    setHasMore(true);
    
    // Convert selected filters to API format
    const filterParams: any = {};
    
    filters.forEach(filter => {
      const filterName = filter.name.toLowerCase();
      
      // Map common filter names to backend parameters
      if (filter.type === 'string' && filter.selectedValues && filter.selectedValues.length > 0) {
        switch (filterName) {
          case 'subcategory':
          case 'sub-category':
          case 'sub category':
            filterParams.subCategory = filter.selectedValues[0]; // Take first value for single-select
            break;
          case 'brand':
          case 'brands':
            filterParams.brand = filter.selectedValues[0]; // Take first value for single-select
            break;
          case 'size':
          case 'sizes':
            // For now, pass as generic parameter (could be expanded later)
            filterParams[filter.name] = filter.selectedValues.join(',');
            break;
          case 'color':
          case 'colors':
            // For now, pass as generic parameter (could be expanded later)
            filterParams[filter.name] = filter.selectedValues.join(',');
            break;
          default:
            // Pass other string filters as comma-separated values
            filterParams[filter.name] = filter.selectedValues.join(',');
            break;
        }
      } else if (filter.type === 'range' && filter.selectedRange) {
        switch (filterName) {
          case 'price':
          case 'pricerange':
          case 'price range':
            filterParams.minPrice = filter.selectedRange[0];
            filterParams.maxPrice = filter.selectedRange[1];
            break;
          case 'weight':
            filterParams.minWeight = filter.selectedRange[0];
            filterParams.maxWeight = filter.selectedRange[1];
            break;
          default:
            // Pass other range filters with Min/Max suffix
            filterParams[`${filter.name}Min`] = filter.selectedRange[0];
            filterParams[`${filter.name}Max`] = filter.selectedRange[1];
            break;
        }
      }
    });

    const newFilters = {
      page: 0,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
      category: selectedCategory || undefined,
      ...filterParams
    };
    
    console.log('Applying filters:', newFilters); // Debug log
    
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  }, [dispatch, sortBy, sortDir, searchTerm, selectedCategory]);

  // Handle price range filter
  const handlePriceRangeFilter = () => {
    setCurrentPage(0);
    setHasMore(true);
    
    const newFilters = {
      page: 0,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
      category: selectedCategory || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    };
    
    dispatch(setFilters(newFilters));
    dispatch(fetchProductsByPriceRange({ 
      minPrice: priceRange[0], 
      maxPrice: priceRange[1] 
    }));
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

  // Handle product click - updated for string ID
  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };
  const cardBgColor = useColorModeValue('white', 'gray.800');

  // Get current category filters
  const currentCategoryFilters = selectedCategory 
    ? availableFilters.find(filter => filter.category === selectedCategory)?.filters || []
    : [];

  const FilterPanel = () => (
    <VStack spacing={8} align="stretch" w="280px">
      {/* Category Selection - Only show when no category is selected */}
      {!selectedCategory && (
        <Box>
          <Heading size="md" mb={4} color="neutral.800">Categories</Heading>
          <VStack align="start" spacing={3}>
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                colorScheme="green"
                size="sm"
                justifyContent="flex-start"
                w="full"
                onClick={() => handleCategoryChange(category)}
                fontWeight="500"
                textTransform="capitalize"
                _hover={{ bg: 'green.50' }}
              >
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </Button>
            ))}
          </VStack>
        </Box>
      )}

      {/* Selected Category Header with Back Button */}
      {selectedCategory && (
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="md" color="neutral.800" textTransform="capitalize">
              {selectedCategory.replace(/([A-Z])/g, ' $1').trim()}
            </Heading>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleCategoryChange('')}
              fontWeight="600"
            >
              ← All Categories
            </Button>
          </HStack>
          
          {/* Loading state for filters */}
          {filtersLoading && (
            <VStack spacing={4}>
              <Spinner size="md" color="primary.500" />
              <Text fontSize="sm" color="neutral.600">Loading filters...</Text>
            </VStack>
          )}

          {/* Error state for filters */}
          {filtersError && !filtersLoading && (
            <Alert status="warning" borderRadius="md" size="sm">
              <AlertIcon />
              <Text fontSize="sm">Could not load filters for this category</Text>
            </Alert>
          )}

          {/* Dynamic Filters for Selected Category */}
          {!filtersLoading && !filtersError && currentCategoryFilters.length > 0 && (
            <DynamicFilters
              filters={currentCategoryFilters}
              selectedFilters={selectedFilters}
              onFiltersChange={handleDynamicFiltersChange}
              isLoading={filtersLoading}
              error={filtersError}
              title="Filters"
            />
          )}

          {/* No filters message */}
          {!filtersLoading && !filtersError && currentCategoryFilters.length === 0 && (
            <Text fontSize="sm" color="neutral.500" textAlign="center" py={4}>
              No specific filters available for this category
            </Text>
          )}
        </Box>
      )}

      {/* Fallback Price Range Filter - Show when no category is selected or when category has no specific filters */}
      {(!selectedCategory || (!filtersLoading && currentCategoryFilters.length === 0)) && (
        <>
          {selectedCategory && <Divider borderColor="neutral.200" />}
          
          <Box>
            <Heading size="md" mb={4} color="neutral.800">Price Range</Heading>
            <VStack spacing={4}>
              <RangeSlider
                value={priceRange}
                onChange={setPriceRange}
                min={0}
                max={200}
                step={5}
                colorScheme="green"
              >
                <RangeSliderTrack bg="neutral.200">
                  <RangeSliderFilledTrack bg="primary.500" />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} bg="primary.600" />
                <RangeSliderThumb index={1} bg="primary.600" />
              </RangeSlider>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" fontWeight="600" color="neutral.600">${priceRange[0]}</Text>
                <Text fontSize="sm" fontWeight="600" color="neutral.600">${priceRange[1]}</Text>
              </HStack>
              <Button
                size="sm"
                colorScheme="green"
                variant="outline"
                w="full"
                onClick={handlePriceRangeFilter}
                borderRadius="lg"
                fontWeight="600"
              >
                Apply Price Filter
              </Button>
            </VStack>
          </Box>
        </>
      )}
    </VStack>
  );

  return (
    <Container maxW="7xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        {/* Header */}
        <Box textAlign="center" mb={{ base: 6, md: 8 }}>
          <Heading 
            size={{ base: 'xl', md: '2xl' }} 
            mb={4}
            bgGradient="linear(to-r, primary.600, primary.400)"
            bgClip="text"
            fontWeight="800"
          >
            Shop Plants
          </Heading>
          <Text 
            color="neutral.600" 
            fontSize={{ base: 'md', md: 'lg' }}
            maxW="2xl"
            mx="auto"
            lineHeight="1.6"
            px={{ base: 4, md: 0 }}
          >
            Transform your space with our carefully curated collection of premium plants. 
            From air-purifying houseplants to statement botanical pieces.
          </Text>
        </Box>

        {/* Search and Controls */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 3, md: 4 }}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
        >
          <InputGroup maxW={{ base: 'full', md: '400px' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="neutral.400" />
            </InputLeftElement>
            <Input
              placeholder="Search for plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              onBlur={handleSearch}
              bg="white"
              borderColor="neutral.200"
              borderRadius="xl"
              _focus={{
                borderColor: 'primary.400',
                boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)',
              }}
              _placeholder={{ color: 'neutral.400' }}
            />
          </InputGroup>

          <HStack spacing={4}>
            {isMobile && (
              <IconButton
                aria-label="Open filters"
                icon={<SettingsIcon />}
                onClick={onOpen}
                variant="outline"
                colorScheme="green"
                borderRadius="xl"
                borderColor="neutral.200"
                _hover={{ bg: 'primary.50' }}
              />
            )}
            
            <Select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              w="200px"
              bg="white"
              borderRadius="xl"
              borderColor="neutral.200"
              _focus={{
                borderColor: 'primary.400',
                boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)',
              }}
            >
              <option value="featured">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">New Arrivals</option>
              <option value="alphabetical">A-Z</option>
            </Select>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Flex gap={{ base: 0, lg: 8 }} align="start" direction={{ base: 'column', lg: 'row' }}>
          {/* Desktop Filters */}
          {!isMobile && (
            <Box
              bg="white"
              p={{ base: 4, md: 8 }}
              borderRadius="2xl"
              shadow="sm"
              border="1px"
              borderColor="neutral.200"
              h="fit-content"
              position="sticky"
              top="6"
              minW="280px"
            >
              <FilterPanel />
            </Box>
          )}

          {/* Products Grid */}
          <Box flex="1" w="full">
            {isLoading ? (
              <Center py={{ base: 16, md: 20 }}>
                <VStack spacing={4}>
                  <Spinner size="xl" color="primary.500" thickness="4px" />
                  <Text color="neutral.600">Loading plants...</Text>
                </VStack>
              </Center>
            ) : error ? (
              <Alert status="error" borderRadius="xl">
                <AlertIcon />
                {error}
              </Alert>
            ) : (
              <>
                <Box mb={{ base: 4, md: 6 }}>
                  <Text color="neutral.600" fontSize="sm">
                    Showing {products.length} plants
                  </Text>
                </Box>
                
                <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} spacing={{ base: 4, md: 6, lg: 8 }}>
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      cursor="pointer"
                      onClick={() => handleProductClick(product.id)}
                      _hover={{
                        transform: 'translateY(-8px)',
                        shadow: '2xl',
                      }}
                      transition="all 0.3s ease"
                      bg="white"
                      borderRadius="2xl"
                      overflow="hidden"
                      border="1px"
                      borderColor="neutral.100"
                    >
                      <Box position="relative">
                        <Image
                          src={product.imageUrl || product.images?.[0] || product.mainImageUrl || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"}
                          alt={product.name}
                          h="280px"
                          w="full"
                          objectFit="cover"
                        />
                        {product.category && (
                          <Badge
                            position="absolute"
                            top={4}
                            left={4}
                            bg="white"
                            color="primary.600"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="600"
                            textTransform="capitalize"
                            shadow="sm"
                          >
                            {product.category}
                          </Badge>
                        )}
                        {product.brand && (
                          <Badge
                            position="absolute"
                            top={4}
                            right={product.category ? 20 : 4}
                            bg="accent.500"
                            color="white"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="600"
                            textTransform="capitalize"
                            shadow="sm"
                          >
                            {product.brand}
                          </Badge>
                        )}
                        <HStack
                          position="absolute"
                          top={4}
                          right={4}
                          spacing={2}
                        >
                          <IconButton
                            size="sm"
                            variant="ghost"
                            bg="whiteAlpha.900"
                            _hover={{ bg: 'white', color: 'red.500' }}
                            aria-label="Add to wishlist"
                            icon={<Text fontSize="md">♡</Text>}
                            borderRadius="full"
                            shadow="sm"
                          />
                        </HStack>
                        
                        <Box
                          position="absolute"
                          bottom={4}
                          right={4}
                          bg="primary.600"
                          color="white"
                          px={3}
                          py={2}
                          borderRadius="full"
                          fontSize="sm"
                          fontWeight="700"
                          shadow="lg"
                        >
                          ${product.price}
                        </Box>
                      </Box>
                      
                      <CardBody p={6}>
                        <VStack align="start" spacing={4}>
                          <Box w="full">
                            <Heading 
                              size="md" 
                              noOfLines={2} 
                              mb={2}
                              color="neutral.800"
                              fontWeight="700"
                            >
                              {product.name}
                            </Heading>
                            <Text 
                              fontSize="sm" 
                              color="neutral.500"
                              noOfLines={2}
                            >
                              {product.description || "Perfect for brightening any indoor space with natural beauty"}
                            </Text>
                          </Box>
                          
                          {/* Stock status */}
                          <HStack spacing={2}>
                            <Badge colorScheme={product.inStock ? "green" : "red"} variant="subtle">
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            {product.totalStock && (
                              <Text fontSize="xs" color="neutral.500">
                                {product.totalStock} available
                              </Text>
                            )}
                          </HStack>
                          
                          {(product.rating || product.averageRating) && (
                            <HStack spacing={2}>
                              <HStack spacing={1}>
                                {[...Array(5)].map((_, i) => (
                                  <Text
                                    key={i}
                                    color={i < Math.floor(product.rating || product.averageRating || 0) ? 'accent.400' : 'neutral.300'}
                                    fontSize="sm"
                                  >
                                    ★
                                  </Text>
                                ))}
                              </HStack>
                              <Text fontSize="sm" color="neutral.500" fontWeight="500">
                                ({product.reviewCount || product.totalReviews || 0})
                              </Text>
                            </HStack>
                          )}

                          <Button
                            colorScheme="green"
                            size="md"
                            w="full"
                            borderRadius="xl"
                            fontWeight="600"
                            _hover={{
                              transform: 'translateY(-2px)',
                              shadow: 'lg',
                            }}
                            transition="all 0.2s"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            isLoading={cartLoading}
                            isDisabled={!product.inStock}
                          >
                            {product.inStock ? "Add to Cart" : "Out of Stock"}
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>

                {/* Infinite Scroll Loading Indicator */}
                {isLoadingMore && (
                  <Center py={8}>
                    <VStack spacing={4}>
                      <Spinner size="lg" color="primary.500" thickness="3px" />
                      <Text color="neutral.600" fontSize="sm">Loading more products...</Text>
                    </VStack>
                  </Center>
                )}

                {/* End of results indicator */}
                {!hasMore && products.length > 0 && (
                  <Center py={8}>
                    <Text color="neutral.500" fontSize="sm">
                      You've reached the end of our collection!
                    </Text>
                  </Center>
                )}
              </>
            )}
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
