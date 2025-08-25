import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  SimpleGrid,
  Card,
  CardBody,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Product } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { fetchProductById } from '../../store/slices/productSlice';
import { addToCartAsync } from '../../store/slices/cartSlice';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentProduct: product, isLoading, error } = useSelector((state: RootState) => state.products);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLoading: cartLoading } = useSelector((state: RootState) => state.cart);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Extract unique colors and sizes from variations
  const availableColors = product?.variations 
    ? Array.from(new Set(product.variations.filter(v => v.isActive && v.color).map(v => v.color))).filter(Boolean) as string[]
    : [];
  const availableSizes = product?.variations 
    ? Array.from(new Set(product.variations.filter(v => v.isActive && v.size).map(v => v.size))).filter(Boolean) as string[]
    : [];

  // Set default variation on product load
  useEffect(() => {
    if (product?.variations && product.variations.length > 0) {
      const firstActiveVariation = product.variations.find(v => v.isActive);
      if (firstActiveVariation) {
        setSelectedVariation(firstActiveVariation.sku);
      }
    }
  }, [product]);

  // Get current selected variation details
  const currentVariation = product?.variations?.find(v => v.sku === selectedVariation);
  const currentPrice = currentVariation?.price || product?.price || 0;
  const currentStock = currentVariation?.stockQuantity ?? product?.stockQuantity ?? 0;

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const shippingBgColor = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id)); // Remove parseInt since id is now string
    }
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!product) return;

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
      const cartData: any = {
        productId: product.id,
        quantity: quantity,
      };

      // Add variation SKU if a variation is selected
      if (selectedVariation) {
        cartData.variationSku = selectedVariation;
      }

      await dispatch(addToCartAsync(cartData)).unwrap();

      const variationText = currentVariation 
        ? ` (${currentVariation.color || ''} ${currentVariation.size || ''})`.trim()
        : '';

      toast({
        title: 'Added to cart!',
        description: `${product.name}${variationText} has been added to your cart.`,
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

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      status: isWishlisted ? 'info' : 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <Box textAlign="center" py={20}>
          <Text>Loading product...</Text>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Product not found
        </Alert>
      </Container>
    );
  }

  // Use images from API response with fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl || product.mainImageUrl || 'https://via.placeholder.com/400x400?text=No+Image'];

  // Extract features from specifications if available
  const features = product.specifications ? [
    ...(product.specifications.noiseCancellation ? ['Active Noise Cancellation'] : []),
    ...(product.specifications.batteryLifeHours ? [`${product.specifications.batteryLifeHours}-hour battery life`] : []),
    ...(product.specifications.material ? [`Premium ${product.specifications.material} finish`] : []),
    ...(product.specifications.connectivity === 'Wireless' ? ['Wireless charging case'] : []),
    ...(product.specifications.warranty ? [`${product.specifications.warranty} warranty`] : []),
    // Add any additional specs as features
    ...Object.entries(product.specifications.additionalSpecs || {}).map(([key, value]) => `${key}: ${value}`)
  ] : [];

  // Convert specifications object to display format
  const specifications = product.specifications ? [
    ...(product.specifications.connectivity ? [{ label: 'Connectivity', value: product.specifications.connectivity }] : []),
    ...(product.specifications.batteryLifeHours ? [{ label: 'Battery Life', value: `${product.specifications.batteryLifeHours} hours` }] : []),
    ...(product.specifications.weight ? [{ label: 'Weight', value: product.specifications.weight }] : []),
    ...(product.specifications.dimensions ? [{ label: 'Dimensions', value: product.specifications.dimensions }] : []),
    ...(product.specifications.warranty ? [{ label: 'Warranty', value: product.specifications.warranty }] : []),
    ...(product.specifications.material ? [{ label: 'Material', value: product.specifications.material }] : []),
    // Add any additional specs
    ...Object.entries(product.specifications.additionalSpecs || {}).map(([key, value]) => ({ label: key, value: String(value) }))
  ] : [];

  return (
    <Container maxW="7xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} mb={8}>
        {/* Product Images */}
        <GridItem>
          <VStack spacing={4}>
            <Box
              position="relative"
              w="full"
              h="400px"
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
            >
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                w="full"
                h="full"
                objectFit="cover"
              />
              <Button
                position="absolute"
                top={4}
                right={4}
                variant="ghost"
                bg="white"
                _hover={{ bg: 'gray.50' }}
                onClick={handleWishlist}
              >
                <Text color={isWishlisted ? 'red.500' : 'gray.500'} fontSize="lg">
                  ❤️
                </Text>
              </Button>
            </Box>
            
            <SimpleGrid columns={4} spacing={2} w="full">
              {productImages.map((image, index) => (
                <Box
                  key={index}
                  w="full"
                  h="80px"
                  border="2px"
                  borderColor={selectedImage === index ? 'primary.500' : borderColor}
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </GridItem>

        {/* Product Info */}
        <GridItem>
          <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={3}>
              <Badge colorScheme="primary" w="fit-content">
                {product.category}
              </Badge>
              
              <Heading size="xl">{product.name}</Heading>
              
              <HStack>
                <HStack spacing={1}>
                  {[...Array(5)].map((_, i) => (
                    <Text
                      key={i}
                      color={i < Math.floor(product.averageRating || product.rating || 0) ? 'yellow.400' : 'gray.300'}
                      fontSize="md"
                    >
                      ★
                    </Text>
                  ))}
                </HStack>
                <Text color="gray.600">
                  {(product.averageRating || product.rating || 0).toFixed(1)} ({product.totalReviews || product.reviewCount || 0} reviews)
                </Text>
              </HStack>

              <Text fontSize="3xl" fontWeight="bold" color="primary.500">
                ${currentPrice.toFixed(2)}
                {product.currency && product.currency !== 'USD' && (
                  <Text as="span" fontSize="sm" color="gray.500" ml={2}>
                    {product.currency}
                  </Text>
                )}
              </Text>

              <Text color="gray.600" lineHeight="tall">
                {product.description}
              </Text>
            </VStack>

            <Divider />

            {/* Variation Selection */}
            <VStack align="stretch" spacing={4}>
              {product.variations && product.variations.length > 0 && (
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="semibold">Select Variation:</Text>
                  <Select
                    value={selectedVariation}
                    onChange={(e) => setSelectedVariation(e.target.value)}
                    placeholder="Choose a variation"
                  >
                    {product.variations
                      .filter(v => v.isActive)
                      .map((variation) => (
                        <option key={variation.sku} value={variation.sku}>
                          {variation.color && variation.size 
                            ? `${variation.color} - ${variation.size}` 
                            : variation.color || variation.size || variation.sku}
                          {variation.price !== product.price && (
                            ` - $${variation.price.toFixed(2)}`
                          )}
                        </option>
                      ))}
                  </Select>
                </VStack>
              )}

              {/* Legacy color/size selection if no variations but specifications have color options */}
              {(!product.variations || product.variations.length === 0) && product.specifications?.colorOptions && (
                <HStack>
                  <Text fontWeight="semibold" minW="80px">Color:</Text>
                  <Select maxW="150px" placeholder="Select color">
                    {product.specifications.colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </Select>
                </HStack>
              )}

              <HStack>
                <Text fontWeight="semibold" minW="80px">Quantity:</Text>
                <NumberInput
                  value={quantity}
                  onChange={(_, value) => setQuantity(value)}
                  min={1}
                  max={currentStock}
                  maxW="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            </VStack>

            <Divider />

            {/* Stock Status */}
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Stock Available:
              </Text>
              <Badge 
                colorScheme={currentStock > 0 ? 'green' : 'red'}
                variant="solid"
              >
                {currentStock > 0 ? `${currentStock} units` : 'Out of Stock'}
              </Badge>
            </HStack>

            {/* Action Buttons */}
            <VStack spacing={3}>
              <Button
                size="lg"
                colorScheme="primary"
                w="full"
                onClick={handleAddToCart}
                isDisabled={currentStock === 0}
                isLoading={cartLoading}
                loadingText="Adding to Cart..."
                _hover={{
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                }}
              >
                Add to Cart - ${(currentPrice * quantity).toFixed(2)}
              </Button>

              <HStack w="full" spacing={3}>
                <Button variant="outline" flex={1} leftIcon={<Text>📤</Text>}>
                  Share
                </Button>
                <Button
                  variant="outline"
                  flex={1}
                  leftIcon={<Text>❤️</Text>}
                  onClick={handleWishlist}
                >
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
              </HStack>
            </VStack>

            {/* Shipping Info */}
            <VStack
              spacing={3}
              p={4}
              bg={shippingBgColor}
              borderRadius="md"
            >
              <HStack>
                <Text fontSize="lg">🚚</Text>
                <Text fontSize="sm">Free shipping on orders over $50</Text>
              </HStack>
              <HStack>
                <Text fontSize="lg">🛡️</Text>
                <Text fontSize="sm">
                  {product.specifications?.warranty || '2-year manufacturer warranty'}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="lg">🔄</Text>
                <Text fontSize="sm">30-day return policy</Text>
              </HStack>
            </VStack>
          </VStack>
        </GridItem>
      </Grid>

      {/* Product Details Tabs */}
      <Tabs variant="enclosed" colorScheme="primary">
        <TabList>
          <Tab>Description</Tab>
          <Tab>Specifications</Tab>
          <Tab>Reviews ({product.totalReviews || product.reviewCount || 0})</Tab>
          <Tab>Shipping & Returns</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Text lineHeight="tall">
                {product.description || 'No detailed description available for this product.'}
              </Text>
              
              {features.length > 0 && (
                <>
                  <Heading size="md">Key Features</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    {features.map((feature, index) => (
                      <HStack key={index}>
                        <Box w={2} h={2} bg="primary.500" borderRadius="full" />
                        <Text>{feature}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            {specifications.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {specifications.map((spec, index) => (
                  <HStack key={index} justify="space-between">
                    <Text fontWeight="semibold">{spec.label}:</Text>
                    <Text>{spec.value}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            ) : (
              <Text color="gray.500" textAlign="center" py={8}>
                No detailed specifications available for this product.
              </Text>
            )}
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews
                  .filter(review => review.isApproved)
                  .map((review, index) => (
                    <Card key={index}>
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="semibold">
                                {review.userId || `Customer ${index + 1}`}
                              </Text>
                              <HStack spacing={1}>
                                <Text fontSize="xs" color="gray.500">
                                  {new Date(review.date).toLocaleDateString()}
                                </Text>
                                {review.isVerifiedPurchase && (
                                  <Badge size="sm" colorScheme="green">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </HStack>
                            </VStack>
                            <HStack>
                              {[...Array(5)].map((_, i) => (
                                <Text
                                  key={i}
                                  color={i < review.rating ? 'yellow.400' : 'gray.300'}
                                  fontSize="sm"
                                >
                                  ★
                                </Text>
                              ))}
                            </HStack>
                          </HStack>
                          {review.comment && (
                            <Text color="gray.600">
                              {review.comment}
                            </Text>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
              ) : (
                <Text color="gray.500" textAlign="center" py={8}>
                  No reviews yet. Be the first to review this product!
                </Text>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Shipping Information</Heading>
              <Text>
                We offer free standard shipping on all orders over $50. Orders are processed 
                within 1-2 business days and typically arrive within 3-7 business days.
              </Text>
              
              <Heading size="md">Return Policy</Heading>
              <Text>
                We accept returns within 30 days of purchase. Items must be in original 
                condition with all accessories and packaging. Return shipping is free for 
                defective items.
              </Text>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProductDetailPage;
