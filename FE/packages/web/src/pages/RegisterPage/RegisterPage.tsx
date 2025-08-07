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
  Progress,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return '';
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return 'red';
    if (strength <= 50) return 'orange';
    if (strength <= 75) return 'yellow';
    return 'green';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(clearError());

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    try {
      await dispatch(registerUser(userData)).unwrap();
      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error will be handled by Redux state
      console.error('Registration failed:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="calc(100vh - 80px)" bg={bgColor} py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="primary.500">
              Create Account
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Join us and start your shopping journey
            </Text>
          </VStack>

          <Card w="full" bg={cardBg} shadow="xl">
            <CardBody p={8}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <HStack spacing={4} w="full">
                    <FormControl isInvalid={!!errors.firstName}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        size="lg"
                        focusBorderColor="primary.500"
                      />
                      <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        size="lg"
                        focusBorderColor="primary.500"
                      />
                      <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      size="lg"
                      focusBorderColor="primary.500"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a password"
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
                    {formData.password && (
                      <VStack spacing={2} mt={2} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">
                            Password strength:
                          </Text>
                          <Text
                            fontSize="sm"
                            color={`${getPasswordStrengthColor(passwordStrength)}.500`}
                            fontWeight="semibold"
                          >
                            {getPasswordStrengthText(passwordStrength)}
                          </Text>
                        </HStack>
                        <Progress
                          value={passwordStrength}
                          size="sm"
                          colorScheme={getPasswordStrengthColor(passwordStrength)}
                          bg="gray.200"
                        />
                      </VStack>
                    )}
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        size="lg"
                        focusBorderColor="primary.500"
                      />
                      <InputRightElement h="full">
                        <IconButton
                          variant="ghost"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          icon={showConfirmPassword ? <Text>👁️</Text> : <Text>👁️‍🗨️</Text>}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <HStack mt={2}>
                        <Text color="green.500" fontSize="sm">✓</Text>
                        <Text fontSize="sm" color="green.500">
                          Passwords match
                        </Text>
                      </HStack>
                    )}
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.terms}>
                    <Checkbox
                      isChecked={agreeToTerms}
                      onChange={(e) => {
                        setAgreeToTerms(e.target.checked);
                        if (errors.terms) {
                          setErrors(prev => ({ ...prev, terms: '' }));
                        }
                      }}
                      colorScheme="primary"
                    >
                      <Text fontSize="sm">
                        I agree to the{' '}
                        <Link color="primary.500" textDecoration="underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link color="primary.500" textDecoration="underline">
                          Privacy Policy
                        </Link>
                      </Text>
                    </Checkbox>
                    <FormErrorMessage>{errors.terms}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    colorScheme="primary"
                    isLoading={isLoading}
                    loadingText="Creating Account..."
                    _hover={{
                      transform: 'translateY(-1px)',
                      shadow: 'lg',
                    }}
                  >
                    Create Account
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
                      Sign up with Google
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
                      Sign up with Facebook
                    </Button>
                  </VStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          <HStack spacing={1}>
            <Text color="gray.600">Already have an account?</Text>
            <Link
              as={RouterLink}
              to="/login"
              color="primary.500"
              fontWeight="semibold"
              _hover={{ textDecoration: 'underline' }}
            >
              Sign in here
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default RegisterPage;
