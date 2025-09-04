import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: cartItems, totalAmount, totalItems } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(id);
    } else {
      handleUpdateQuantity(id, quantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Box minH="calc(100vh - 80px)" bg={bgColor} py={{ base: 8, md: 12 }}>
        <Container maxW="4xl" px={{ base: 4, md: 6 }}>
          <VStack spacing={8} textAlign="center" py={{ base: 8, md: 12 }}>
            <VStack spacing={4}>
              <Heading size={{ base: "lg", md: "xl" }} color="gray.600">
                Your Cart is Empty
              </Heading>
              <Text 
                color="gray.500" 
                fontSize={{ base: "md", md: "lg" }}
                px={{ base: 4, md: 0 }}
              >
                Looks like you haven't added any items to your cart yet.
              </Text>
            </VStack>
            
            <VStack spacing={4}>
              <Button
                as={RouterLink}
                to="/products"
                colorScheme="primary"
                size={{ base: "md", md: "lg" }}
                leftIcon={<Text>←</Text>}
                w={{ base: "full", sm: "auto" }}
                maxW="300px"
              >
                Continue Shopping
              </Button>
              <Text 
                color="gray.500" 
                fontSize="sm"
                px={{ base: 4, md: 0 }}
                textAlign="center"
              >
                Discover our amazing products and add them to your cart
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 80px)" bg={bgColor} py={{ base: 4, md: 8 }}>
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 6, md: 8 }}>
          {/* Header */}
          <VStack 
            w="full" 
            spacing={{ base: 3, md: 4 }}
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            justify={{ base: "start", md: "space-between" }}
          >
            <VStack align="start" spacing={1}>
              <Heading size={{ base: "lg", md: "xl" }}>Shopping Cart</Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/products"
              variant="ghost"
              leftIcon={<Text>←</Text>}
              size={{ base: "sm", md: "md" }}
              w={{ base: "auto", md: "auto" }}
            >
              Continue Shopping
            </Button>
          </VStack>

          <Grid 
            templateColumns={{ base: '1fr', lg: '2fr 1fr' }} 
            gap={{ base: 6, md: 8 }} 
            w="full"
          >
            {/* Cart Items */}
            <GridItem>
              <VStack spacing={4}>
                {cartItems.map((item) => (
                  <Card key={item.id} w="full" bg={cardBg}>
                    <CardBody>
                      <Grid
                        templateColumns={{ base: '80px 1fr', md: '120px 1fr auto auto' }}
                        gap={4}
                        alignItems="center"
                      >
                        {/* Product Image */}
                        <Box
                          w={{ base: '80px', md: '120px' }}
                          h={{ base: '80px', md: '120px' }}
                          borderRadius="md"
                          overflow="hidden"
                          border="1px"
                          borderColor={borderColor}
                        >
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                        </Box>

                        {/* Product Info */}
                        <VStack align="start" spacing={2}>
                          <Heading size="md" noOfLines={2}>
                            {item.name}
                          </Heading>
                          <Text color="gray.600" fontSize="lg" fontWeight="semibold">
                            ${item.price.toFixed(2)}
                          </Text>
                          <Badge colorScheme="green" variant="subtle">
                            In Stock
                          </Badge>
                        </VStack>

                        {/* Quantity Controls */}
                        <VStack spacing={2} display={{ base: 'none', md: 'flex' }}>
                          <Text fontSize="sm" color="gray.600">
                            Quantity
                          </Text>
                          <NumberInput
                            value={item.quantity}
                            onChange={(_, value) => handleQuantityChange(item.id, value)}
                            min={0}
                            max={99}
                            w="100px"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </VStack>

                        {/* Actions */}
                        <VStack spacing={2} align="end">
                          <Text fontSize="lg" fontWeight="bold" color="primary.500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                          <IconButton
                            aria-label="Remove item"
                            icon={<Text>🗑️</Text>}
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.id)}
                          />
                        </VStack>

                        {/* Mobile Quantity Controls */}
                        <GridItem colSpan={2} display={{ base: 'block', md: 'none' }}>
                          <HStack justify="space-between">
                            <VStack spacing={1}>
                              <Text fontSize="sm" color="gray.600">
                                Quantity
                              </Text>
                              <NumberInput
                                value={item.quantity}
                                onChange={(_, value) => handleQuantityChange(item.id, value)}
                                min={0}
                                max={99}
                                w="100px"
                                size="sm"
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </VStack>
                            <VStack align="end">
                              <Text fontSize="sm" color="gray.600">
                                Total
                              </Text>
                              <Text fontSize="lg" fontWeight="bold" color="primary.500">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Text>
                            </VStack>
                          </HStack>
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </GridItem>

            {/* Order Summary */}
            <GridItem>
              <Card bg={cardBg} position="sticky" top="20px">
                <CardBody>
                  <VStack spacing={6}>
                    <Heading size="lg" textAlign="center">
                      Order Summary
                    </Heading>

                    <VStack spacing={4} w="full">
                      <HStack justify="space-between" w="full">
                        <Text>Subtotal ({totalItems} items):</Text>
                        <Text fontWeight="semibold">${totalAmount.toFixed(2)}</Text>
                      </HStack>

                      <HStack justify="space-between" w="full">
                        <Text>Shipping:</Text>
                        <Text fontWeight="semibold" color="green.500">
                          {totalAmount > 50 ? 'FREE' : '$5.99'}
                        </Text>
                      </HStack>

                      <HStack justify="space-between" w="full">
                        <Text>Tax:</Text>
                        <Text fontWeight="semibold">
                          ${(totalAmount * 0.08).toFixed(2)}
                        </Text>
                      </HStack>

                      <Divider />

                      <HStack justify="space-between" w="full">
                        <Text fontSize="lg" fontWeight="bold">
                          Total:
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color="primary.500">
                          ${(
                            totalAmount +
                            (totalAmount > 50 ? 0 : 5.99) +
                            totalAmount * 0.08
                          ).toFixed(2)}
                        </Text>
                      </HStack>
                    </VStack>

                    {totalAmount < 50 && (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="semibold">
                            Add ${(50 - totalAmount).toFixed(2)} more for free shipping!
                          </Text>
                        </VStack>
                      </Alert>
                    )}

                    <VStack spacing={3} w="full">
                      <Button
                        size="lg"
                        colorScheme="primary"
                        w="full"
                        onClick={handleCheckout}
                        _hover={{
                          transform: 'translateY(-1px)',
                          shadow: 'lg',
                        }}
                      >
                        Proceed to Checkout
                      </Button>

                      <Button
                        as={RouterLink}
                        to="/products"
                        variant="outline"
                        w="full"
                        size="lg"
                      >
                        Continue Shopping
                      </Button>
                    </VStack>

                    <VStack spacing={2} w="full" fontSize="sm" color="gray.600">
                      <Text textAlign="center">
                        🔒 Secure checkout with SSL encryption
                      </Text>
                      <Text textAlign="center">
                        💳 We accept all major credit cards
                      </Text>
                      <Text textAlign="center">
                        📦 Free returns within 30 days
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default CartPage;
