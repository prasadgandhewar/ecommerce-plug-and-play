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
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);

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
      await dispatch(addToCartAsync({
        productId: product.id,
        quantity: quantity,
      })).unwrap();

      toast({
        title: 'Added to cart!',
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

  const productImages = [
    product.imageUrl,
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
  ];

  const features = [
    'Active Noise Cancellation',
    '30-hour battery life',
    'Premium leather finish',
    'Wireless charging case',
    'Voice assistant support',
    'Water resistant IPX4',
  ];

  const specifications = [
    { label: 'Driver Size', value: '40mm' },
    { label: 'Frequency Response', value: '20Hz - 20kHz' },
    { label: 'Impedance', value: '32 Ohms' },
    { label: 'Weight', value: '250g' },
    { label: 'Bluetooth Version', value: '5.2' },
    { label: 'Charging Time', value: '2 hours' },
  ];

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
                      color={i < Math.floor(product.rating || 4.5) ? 'yellow.400' : 'gray.300'}
                      fontSize="md"
                    >
                      ★
                    </Text>
                  ))}
                </HStack>
                <Text color="gray.600">
                  {product.rating || 4.5} ({product.reviewCount || 0} reviews)
                </Text>
              </HStack>

              <Text fontSize="3xl" fontWeight="bold" color="primary.500">
                ${product.price}
              </Text>

              <Text color="gray.600" lineHeight="tall">
                {product.description}
              </Text>
            </VStack>

            <Divider />

            {/* Options */}
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Text fontWeight="semibold" minW="80px">Color:</Text>
                <Select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  maxW="150px"
                >
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Silver">Silver</option>
                  <option value="Blue">Blue</option>
                </Select>
              </HStack>

              <HStack>
                <Text fontWeight="semibold" minW="80px">Size:</Text>
                <Select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  maxW="150px"
                >
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                </Select>
              </HStack>

              <HStack>
                <Text fontWeight="semibold" minW="80px">Quantity:</Text>
                <NumberInput
                  value={quantity}
                  onChange={(_, value) => setQuantity(value)}
                  min={1}
                  max={product.stockQuantity || 1}
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
                colorScheme={product.stockQuantity > 0 ? 'green' : 'red'}
                variant="solid"
              >
                {product.stockQuantity > 0 ? `${product.stockQuantity} units` : 'Out of Stock'}
              </Badge>
            </HStack>

            {/* Action Buttons */}
            <VStack spacing={3}>
              <Button
                size="lg"
                colorScheme="primary"
                w="full"
                onClick={handleAddToCart}
                isDisabled={product.stockQuantity === 0}
                isLoading={cartLoading}
                loadingText="Adding to Cart..."
                _hover={{
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                }}
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
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
                <Text fontSize="sm">2-year manufacturer warranty</Text>
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
          <Tab>Reviews ({product.reviewCount})</Tab>
          <Tab>Shipping & Returns</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Text lineHeight="tall">
                Experience premium audio quality with our flagship wireless headphones. 
                Featuring advanced active noise cancellation technology, these headphones 
                deliver crystal-clear sound while blocking out ambient noise for an 
                immersive listening experience.
              </Text>
              
              <Heading size="md">Key Features</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                {features.map((feature, index) => (
                  <HStack key={index}>
                    <Box w={2} h={2} bg="primary.500" borderRadius="full" />
                    <Text>{feature}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </VStack>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {specifications.map((spec, index) => (
                <HStack key={index} justify="space-between">
                  <Text fontWeight="semibold">{spec.label}:</Text>
                  <Text>{spec.value}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              {[1, 2, 3].map((review) => (
                <Card key={review}>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text fontWeight="semibold">Customer {review}</Text>
                        <HStack>
                          {[...Array(5)].map((_, i) => (
                            <Text
                              key={i}
                              color={i < 5 ? 'yellow.400' : 'gray.300'}
                              fontSize="sm"
                            >
                              ★
                            </Text>
                          ))}
                        </HStack>
                      </HStack>
                      <Text color="gray.600">
                        Amazing quality and comfort. The noise cancellation works perfectly 
                        and the battery life is excellent. Highly recommended!
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
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
