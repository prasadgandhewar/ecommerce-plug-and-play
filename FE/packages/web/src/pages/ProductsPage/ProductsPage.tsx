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
import { SearchIcon, SettingsIcon, ArrowBackIcon } from '@chakra-ui/icons';

import { RootState, AppDispatch } from '../../store';
import { 
  fetchProducts, 
  fetchMoreProducts,
  fetchProductsWithAttributeFilters,
  fetchMoreProductsWithAttributeFilters,
  searchProducts, 
  fetchProductsByCategory, 
  fetchProductsByPriceRange,
  fetchCategories,
  setFilters,
  clearProducts 
} from '../../store/slices/productSlice';
import {
  fetchCategoryFilters,
  fetchFiltersForCategory,
  addSelectedFilter,
  removeSelectedFilter,
  clearSelectedFilters,
  setSelectedFilters,
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

    const filterParams = {
      page: nextPage,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
      category: selectedCategory || undefined,
    };

    // Convert current selected filters to attribute filters
    const attributeFilters: Record<string, any> = {};
    selectedFilters.forEach(filter => {
      if (filter.type === 'string' && filter.selectedValues && filter.selectedValues.length > 0) {
        attributeFilters[filter.name] = filter.selectedValues.length === 1 ? 
          filter.selectedValues[0] : 
          filter.selectedValues;
      } else if (filter.type === 'range' && filter.selectedRange) {
        const [min, max] = filter.selectedRange;
        if (filter.name.toLowerCase() === 'price') {
          attributeFilters['minPrice'] = min;
          attributeFilters['maxPrice'] = max;
        } else {
          attributeFilters[`${filter.name}_min`] = min;
          attributeFilters[`${filter.name}_max`] = max;
        }
      }
    });

    try {
      const result = await dispatch(fetchMoreProductsWithAttributeFilters({
        filters: filterParams,
        attributeFilters: attributeFilters
      })).unwrap();
      
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
  }, [dispatch, currentPage, hasMore, isLoading, isLoadingMore, sortBy, sortDir, searchTerm, selectedCategory, selectedFilters]);

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
    
    const filterParams = {
      page: 0,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
      category: selectedCategory || undefined,
    };
    
    // Convert current selected filters to attribute filters
    const attributeFilters: Record<string, any> = {};
    selectedFilters.forEach(filter => {
      if (filter.type === 'string' && filter.selectedValues && filter.selectedValues.length > 0) {
        attributeFilters[filter.name] = filter.selectedValues.length === 1 ? 
          filter.selectedValues[0] : 
          filter.selectedValues;
      } else if (filter.type === 'range' && filter.selectedRange) {
        const [min, max] = filter.selectedRange;
        if (filter.name.toLowerCase() === 'price') {
          attributeFilters['minPrice'] = min;
          attributeFilters['maxPrice'] = max;
        } else {
          attributeFilters[`${filter.name}_min`] = min;
          attributeFilters[`${filter.name}_max`] = max;
        }
      }
    });

    // Use the attribute-based filtering to maintain current filters
    dispatch(fetchProductsWithAttributeFilters({
      filters: {
        ...filterParams,
        category: selectedCategory || undefined,
      },
      attributeFilters: attributeFilters
    }));
    
    dispatch(setFilters({
      ...filterParams,
      category: selectedCategory || undefined,
    }));
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
    
    const filterParams = {
      page: 0,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      query: searchTerm.trim() || undefined,
    };
    
    if (category) {
      // Use attribute-based filtering for category
      dispatch(fetchProductsWithAttributeFilters({
        filters: {
          ...filterParams,
          category: category,
        },
        attributeFilters: {}
      }));
      
      // Load filters for the selected category
      dispatch(fetchFiltersForCategory(category));
    } else {
      // Fetch all products when no category is selected
      dispatch(fetchProducts({
        ...filterParams,
        category: undefined
      }));
    }
    
    dispatch(setFilters({
      ...filterParams,
      category: category || undefined,
    }));
  };

  // Handle dynamic filter changes
  const handleDynamicFiltersChange = useCallback((filters: SelectedFilter[]) => {
    console.log('Filter change received:', filters); // Debug log
    
    // Update Redux state with selected filters
    dispatch(setSelectedFilters(filters));
    
    setCurrentPage(0);
    setHasMore(true);
    
    // Convert selected filters to attribute filters format
    const attributeFilters: Record<string, any> = {};
    
    filters.forEach(filter => {
      if (filter.type === 'string' && filter.selectedValues && filter.selectedValues.length > 0) {
        // For string filters, use the values directly
        attributeFilters[filter.name] = filter.selectedValues.length === 1 ? 
          filter.selectedValues[0] : 
          filter.selectedValues;
      } else if (filter.type === 'range' && filter.selectedRange) {
        // For range filters, use min/max format
        const [min, max] = filter.selectedRange;
        if (filter.name.toLowerCase() === 'price') {
          attributeFilters['minPrice'] = min;
          attributeFilters['maxPrice'] = max;
        } else {
          attributeFilters[`${filter.name}_min`] = min;
          attributeFilters[`${filter.name}_max`] = max;
        }
      }
    });

    const filterParams = {
      page: 0,
      size: 20,
      sortBy: sortBy,
      sortDir: sortDir,
      category: selectedCategory || undefined,
    };
    
    console.log('Applying attribute filters:', attributeFilters); // Debug log
    
    // Use the new attribute-based filtering
    dispatch(fetchProductsWithAttributeFilters({
      filters: filterParams,
      attributeFilters: attributeFilters
    }));
    
    // Update the filters in Redux for consistency
    dispatch(setFilters({
      ...filterParams,
      category: selectedCategory || undefined,
      query: searchTerm.trim() || undefined,
    }));
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
    <Box w="full" h="calc(100vh - 180px)" display="flex" flexDirection="column" px={2}>
      {/* Category Selection - Only show when no category is selected */}
      {!selectedCategory && (
        <Box mb={4}>
          <Heading size="sm" mb={3} color="neutral.800" fontSize="md">Categories</Heading>
          <VStack align="stretch" spacing={2} maxH="200px" overflowY="auto" css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a1a1a1',
            },
          }}>
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
                fontSize="sm"
                py={2}
                h="auto"
                textAlign="left"
              >
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </Button>
            ))}
          </VStack>
        </Box>
      )}

      {/* Selected Category Header with Back Button */}
      {selectedCategory && (
        <Box mb={4}>
          <Box mb={3}>
            <Heading size="sm" color="neutral.800" fontSize="md" textTransform="capitalize">
              {selectedCategory.replace(/([A-Z])/g, ' $1').trim()}
            </Heading>
          </Box>
          
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowBackIcon />}
            onClick={() => handleCategoryChange('')}
            color="neutral.600"
            _hover={{ bg: 'neutral.50' }}
            fontSize="xs"
            px={2}
            py={1}
            h="auto"
            justifyContent="flex-start"
            w="auto"
          >
            All Categories
          </Button>
        </Box>
      )}
      
      {/* Filter Content */}
      <Box flex="1" overflowY="hidden">
        {/* Loading state for filters */}
        {selectedCategory && filtersLoading && (
          <VStack spacing={3} py={6} align="center">
            <Spinner size="md" color="primary.500" />
            <Text fontSize="sm" color="neutral.600" textAlign="center">Loading filters...</Text>
          </VStack>
        )}

        {/* Error state for filters */}
        {selectedCategory && filtersError && !filtersLoading && (
          <Alert status="warning" borderRadius="md" size="sm">
            <AlertIcon />
            <Text fontSize="sm">Could not load filters for this category</Text>
          </Alert>
        )}

        {/* Dynamic Filters for Selected Category */}
        {selectedCategory && !filtersLoading && !filtersError && currentCategoryFilters.length > 0 && (
          <Box w="full">
            <DynamicFilters
              filters={currentCategoryFilters}
              selectedFilters={selectedFilters}
              onFiltersChange={handleDynamicFiltersChange}
              isLoading={filtersLoading}
              error={filtersError}
              title="Filters"
            />
          </Box>
        )}

        {/* No filters message for selected category */}
        {selectedCategory && !filtersLoading && !filtersError && currentCategoryFilters.length === 0 && (
          <Text color="neutral.500" fontSize="sm" textAlign="center" py={6}>
            No specific filters available for this category
          </Text>
        )}

        {/* Fallback Price Range Filter - Show when no category is selected or when category has no specific filters */}
        {(!selectedCategory || (!filtersLoading && currentCategoryFilters.length === 0)) && (
          <Box flex="1" display="flex" flexDirection="column">
            {selectedCategory && <Divider borderColor="neutral.200" mb={4} />}
            
            <Box w="full">
              <Heading size="sm" mb={3} color="neutral.800" fontSize="md">Price Range</Heading>
              <VStack spacing={3} align="stretch">
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
                  fontSize="sm"
                  py={2}
                  h="auto"
                >
                  Apply Price Filter
                </Button>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Container maxW="7xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        {/* Header */}
        <Box textAlign="center" mb={{ base: 6, md: 8 }}>
          <Heading 
            size={{ base: 'lg', md: '2xl' }} 
            mb={{ base: 3, md: 4 }}
            bgGradient="linear(to-r, primary.600, primary.400)"
            bgClip="text"
            fontWeight="800"
          >
            Shop Plants
          </Heading>
          <Text 
            color="neutral.600" 
            fontSize={{ base: 'sm', md: 'lg' }}
            maxW={{ base: "90%", md: "2xl" }}
            mx="auto"
            lineHeight="1.6"
            px={{ base: 2, md: 0 }}
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
          <InputGroup maxW={{ base: 'full', md: '400px' }} order={{ base: 1, md: 1 }}>
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

          <HStack spacing={4} order={{ base: 2, md: 2 }} justify={{ base: 'space-between', md: 'flex-end' }}>
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
                size="md"
              />
            )}
            
            <Select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              w={{ base: "auto", md: "200px" }}
              minW={{ base: "140px", md: "200px" }}
              bg="white"
              borderRadius="xl"
              borderColor="neutral.200"
              fontSize={{ base: "sm", md: "md" }}
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
        <Flex gap={{ base: 0, lg: 6 }} align="start" direction={{ base: 'column', lg: 'row' }}>
          {/* Desktop Filters */}
          {!isMobile && (
            <Box
              bg="white"
              p={{ base: 4, md: 6 }}
              borderRadius="2xl"
              shadow="sm"
              border="1px"
              borderColor="neutral.200"
              h="calc(100vh - 200px)"
              position="sticky"
              top="6"
              minW="280px"
              maxW="280px"
              w="280px"
              display="flex"
              flexDirection="column"
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
                
                <SimpleGrid 
                  columns={{ base: 2, sm: 2, md: 3, lg: 3, xl: 4 }} 
                  spacing={{ base: 3, sm: 4, md: 5, lg: 6 }}
                  w="full"
                >
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      cursor="pointer"
                      onClick={() => handleProductClick(product.id)}
                      _hover={{
                        transform: { base: 'none', md: 'translateY(-8px)' },
                        shadow: { base: 'md', md: '2xl' },
                      }}
                      transition="all 0.3s ease"
                      bg="white"
                      borderRadius={{ base: 'xl', md: '2xl' }}
                      overflow="hidden"
                      border="1px"
                      borderColor="neutral.100"
                      h="fit-content"
                    >
                      <Box position="relative">
                        <Image
                          src={product.imageUrl || product.images?.[0] || product.mainImageUrl || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"}
                          alt={product.name}
                          h={{ base: "180px", sm: "200px", md: "220px", lg: "240px" }}
                          w="full"
                          objectFit="cover"
                        />
                        {product.category && (
                          <Badge
                            position="absolute"
                            top={{ base: 2, md: 4 }}
                            left={{ base: 2, md: 4 }}
                            bg="white"
                            color="primary.600"
                            px={{ base: 2, md: 3 }}
                            py={1}
                            borderRadius="full"
                            fontSize={{ base: "2xs", md: "xs" }}
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
                            top={{ base: 2, md: 4 }}
                            right={product.category ? { base: 16, md: 20 } : { base: 2, md: 4 }}
                            bg="accent.500"
                            color="white"
                            px={{ base: 2, md: 3 }}
                            py={1}
                            borderRadius="full"
                            fontSize={{ base: "2xs", md: "xs" }}
                            fontWeight="600"
                            textTransform="capitalize"
                            shadow="sm"
                          >
                            {product.brand}
                          </Badge>
                        )}
                        <HStack
                          position="absolute"
                          top={{ base: 2, md: 4 }}
                          right={{ base: 2, md: 4 }}
                          spacing={2}
                        >
                          <IconButton
                            size={{ base: "xs", md: "sm" }}
                            variant="ghost"
                            bg="whiteAlpha.900"
                            _hover={{ bg: 'white', color: 'red.500' }}
                            aria-label="Add to wishlist"
                            icon={<Text fontSize={{ base: "sm", md: "md" }}>♡</Text>}
                            borderRadius="full"
                            shadow="sm"
                          />
                        </HStack>
                        
                        <Box
                          position="absolute"
                          bottom={{ base: 2, md: 4 }}
                          right={{ base: 2, md: 4 }}
                          bg="primary.600"
                          color="white"
                          px={{ base: 2, md: 3 }}
                          py={{ base: 1, md: 2 }}
                          borderRadius="full"
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="700"
                          shadow="lg"
                        >
                          ${product.price}
                        </Box>
                      </Box>
                      
                      <CardBody p={{ base: 3, md: 6 }}>
                        <VStack align="start" spacing={{ base: 2, md: 4 }}>
                          <Box w="full">
                            <Heading 
                              size={{ base: "sm", md: "md" }}
                              noOfLines={2} 
                              mb={{ base: 1, md: 2 }}
                              color="neutral.800"
                              fontWeight="700"
                              lineHeight="short"
                            >
                              {product.name}
                            </Heading>
                            <Text 
                              fontSize={{ base: "xs", md: "sm" }}
                              color="neutral.500"
                              noOfLines={2}
                              display={{ base: "none", sm: "block" }}
                            >
                              {product.description || "Perfect for brightening any indoor space with natural beauty"}
                            </Text>
                          </Box>
                          
                          {/* Stock status */}
                          <HStack spacing={2} w="full">
                            <Badge 
                              colorScheme={product.inStock ? "green" : "red"} 
                              variant="subtle"
                              fontSize={{ base: "2xs", md: "xs" }}
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            {product.totalStock && (
                              <Text fontSize={{ base: "2xs", md: "xs" }} color="neutral.500">
                                {product.totalStock} available
                              </Text>
                            )}
                          </HStack>
                          
                          {(product.rating || product.averageRating) && (
                            <HStack spacing={2} display={{ base: "none", sm: "flex" }}>
                              <HStack spacing={1}>
                                {[...Array(5)].map((_, i) => (
                                  <Text
                                    key={i}
                                    color={i < Math.floor(product.rating || product.averageRating || 0) ? 'accent.400' : 'neutral.300'}
                                    fontSize={{ base: "xs", md: "sm" }}
                                  >
                                    ★
                                  </Text>
                                ))}
                              </HStack>
                              <Text fontSize={{ base: "xs", md: "sm" }} color="neutral.500" fontWeight="500">
                                ({product.reviewCount || product.totalReviews || 0})
                              </Text>
                            </HStack>
                          )}

                          <Button
                            colorScheme="green"
                            size={{ base: "sm", md: "md" }}
                            w="full"
                            borderRadius={{ base: "lg", md: "xl" }}
                            fontWeight="600"
                            fontSize={{ base: "xs", md: "sm" }}
                            _hover={{
                              transform: { base: 'none', md: 'translateY(-2px)' },
                              shadow: { base: 'md', md: 'lg' },
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
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size={{ base: "sm", sm: "md" }}>
        <DrawerOverlay bg="blackAlpha.600" />
        <DrawerContent borderTopRightRadius="2xl" borderBottomRightRadius="2xl">
          <DrawerCloseButton 
            size="lg" 
            borderRadius="full"
            top={4}
            right={4}
          />
          <DrawerHeader pb={4} pt={6}>
            <Text fontSize="lg" fontWeight="bold" color="neutral.800">
              Filters
            </Text>
          </DrawerHeader>
          <DrawerBody px={4} pb={6}>
            <Box w="full">
              <FilterPanel />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default ProductsPage;
