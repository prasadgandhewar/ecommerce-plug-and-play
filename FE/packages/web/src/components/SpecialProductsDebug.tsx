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
  Badge,
  Spinner,
  Code,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import productService from '../services/productService';
import { SpecialProductsResponse, Product } from '../types';

const SpecialProductsDebug: React.FC = () => {
  const [specialProducts, setSpecialProducts] = useState<SpecialProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const fetchSpecialProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching special products...');
      const response = await productService.getSpecialProductsGrouped(5);
      console.log('Special products response:', response);
      
      setSpecialProducts(response);
      setApiResponse(response);
    } catch (error) {
      console.error('Error fetching special products:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testIndividualAPIs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Test each individual API
      const newArrivals = await productService.getProductsBySpecialProperty('newArrival', 3);
      const hasOffers = await productService.getProductsBySpecialProperty('hasOffer', 3);
      const bestSellers = await productService.getProductsBySpecialProperty('bestSeller', 3);
      
      console.log('New Arrivals:', newArrivals);
      console.log('Products with Offers:', hasOffers);
      console.log('Best Sellers:', bestSellers);
      
      setApiResponse({
        individual: {
          newArrivals,
          hasOffers,
          bestSellers
        }
      });
    } catch (error) {
      console.error('Error testing individual APIs:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testCombinedAPI = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Test the combined API
      const combined = await productService.getAllSpecialProducts(3);
      console.log('Combined API response:', combined);
      
      setApiResponse({
        combined
      });
    } catch (error) {
      console.error('Error testing combined API:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6}>
        <Heading size="lg">Special Products API Debug</Heading>
        
        <HStack spacing={4}>
          <Button onClick={fetchSpecialProducts} isLoading={isLoading} colorScheme="blue">
            Test Grouped API
          </Button>
          <Button onClick={testIndividualAPIs} isLoading={isLoading} colorScheme="green">
            Test Individual APIs
          </Button>
          <Button onClick={testCombinedAPI} isLoading={isLoading} colorScheme="purple">
            Test Combined API
          </Button>
        </HStack>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {isLoading && (
          <VStack>
            <Spinner size="lg" />
            <Text>Loading products...</Text>
          </VStack>
        )}

        {specialProducts && (
          <VStack spacing={4} w="full">
            <Heading size="md">Special Products (Grouped API)</Heading>
            
            <SimpleGrid columns={3} spacing={6} w="full">
              <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                <VStack>
                  <Badge colorScheme="green">New Arrivals</Badge>
                  <Text fontWeight="bold">{specialProducts.newArrivals.length} products</Text>
                  {specialProducts.newArrivals.map((product: Product) => (
                    <Text key={product.id} fontSize="sm">{product.name}</Text>
                  ))}
                </VStack>
              </Box>

              <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                <VStack>
                  <Badge colorScheme="red">Products with Offers</Badge>
                  <Text fontWeight="bold">{specialProducts.productsWithOffers.length} products</Text>
                  {specialProducts.productsWithOffers.map((product: Product) => (
                    <Text key={product.id} fontSize="sm">{product.name}</Text>
                  ))}
                </VStack>
              </Box>

              <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                <VStack>
                  <Badge colorScheme="blue">Best Sellers</Badge>
                  <Text fontWeight="bold">{specialProducts.bestSellers.length} products</Text>
                  {specialProducts.bestSellers.map((product: Product) => (
                    <Text key={product.id} fontSize="sm">{product.name}</Text>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        )}

        {apiResponse && (
          <Box w="full">
            <Heading size="md" mb={4}>Raw API Response</Heading>
            <Code p={4} w="full" borderRadius="md" bg="gray.50">
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            </Code>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default SpecialProductsDebug;
