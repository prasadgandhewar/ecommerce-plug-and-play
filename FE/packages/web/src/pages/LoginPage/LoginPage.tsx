import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  Link,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  Checkbox,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    // Validation
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    dispatch(clearError());

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error will be handled by Redux state
      console.error('Login failed:', err);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box 
      minH="calc(100vh - 80px)" 
      bg={bgColor} 
      py={{ base: 6, md: 12 }}
      px={{ base: 4, md: 0 }}
    >
      <Container maxW="md">
        <VStack spacing={{ base: 6, md: 8 }}>
          <VStack spacing={4} textAlign="center">
            <Heading 
              size={{ base: "lg", md: "xl" }} 
              color="primary.500"
            >
              Welcome Back
            </Heading>
            <Text 
              color="gray.600" 
              fontSize={{ base: "md", md: "lg" }}
              px={{ base: 4, md: 0 }}
            >
              Sign in to your account to continue shopping
            </Text>
          </VStack>

          <Card w="full" bg={cardBg} shadow="xl" borderRadius={{ base: "lg", md: "xl" }}>
            <CardBody p={{ base: 6, md: 8 }}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={{ base: 5, md: 6 }}>
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <FormControl isInvalid={!!emailError}>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      size={{ base: "md", md: "lg" }}
                      focusBorderColor="primary.500"
                      fontSize={{ base: "16px", md: "md" }}
                      className="mobile-input"
                    />
                    <FormErrorMessage fontSize="sm">{emailError}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!passwordError}>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        size="lg"
                        focusBorderColor="primary.500"
                      />
                      <InputRightElement h="full">
                        <IconButton
                          variant="ghost"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <Text>👁️</Text> : <Text>👁️‍🗨️</Text>}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{passwordError}</FormErrorMessage>
                  </FormControl>

                  <HStack w="full" justify="space-between">
                    <Checkbox
                      isChecked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      colorScheme="primary"
                    >
                      Remember me
                    </Checkbox>
                    <Link color="primary.500" fontSize="sm">
                      Forgot password?
                    </Link>
                  </HStack>

                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    colorScheme="primary"
                    isLoading={isLoading}
                    loadingText="Signing In..."
                    _hover={{
                      transform: 'translateY(-1px)',
                      shadow: 'lg',
                    }}
                  >
                    Sign In
                  </Button>

                  <Box w="full">
                    <Divider />
                    <Text
                      position="relative"
                      top="-12px"
                      bg={cardBg}
                      px={4}
                      textAlign="center"
                      color="gray.500"
                      fontSize="sm"
                    >
                      OR
                    </Text>
                  </Box>

                  <VStack spacing={3} w="full">
                    <Button
                      variant="outline"
                      w="full"
                      size="lg"
                      leftIcon={
                        <Box w="20px" h="20px">
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        </Box>
                      }
                    >
                      Continue with Google
                    </Button>

                    <Button
                      variant="outline"
                      w="full"
                      size="lg"
                      leftIcon={
                        <Box w="20px" h="20px">
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path
                              fill="#1877F2"
                              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            />
                          </svg>
                        </Box>
                      }
                    >
                      Continue with Facebook
                    </Button>
                  </VStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          <HStack spacing={1}>
            <Text color="gray.600">Don't have an account?</Text>
            <Link
              as={RouterLink}
              to="/register"
              color="primary.500"
              fontWeight="semibold"
              _hover={{ textDecoration: 'underline' }}
            >
              Sign up here
            </Link>
          </HStack>

          <Box
            p={4}
            bg="blue.50"
            borderRadius="md"
            border="1px"
            borderColor="blue.200"
            w="full"
          >
            <Text fontSize="sm" color="blue.700" textAlign="center">
              <strong>Demo Account:</strong> Use email: demo@example.com, password: password
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;
