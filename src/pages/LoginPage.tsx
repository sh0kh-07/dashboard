// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import {
  Box, Flex, VStack, Heading, Text, Input, Button,
  InputGroup, InputLeftElement, InputRightElement,
  FormControl, FormLabel, useToast, Image,
  HStack, Divider, IconButton
} from '@chakra-ui/react';
import { User, Lock, Eye, EyeOff, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication logic
    setTimeout(() => {
      if (username === 'usd_admin' && password === '123456') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ name: 'Shoxrux T.', role: 'Administrator' }));
        
        toast({
          title: 'Muvaffaqiyatli kirish',
          description: 'Hush kelibsiz, Shoxrux T.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        
        navigate('/');
      } else {
        toast({
          title: 'Xatolik',
          description: 'Login yoki parol notoʻgʻri',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="dark.bg" p={4}>
      <Box
        maxW="450px"
        w="full"
        bg="dark.card"
        p={8}
        borderRadius="2xl"
        boxShadow="2xl"
        borderWidth="1px"
        borderColor="dark.border"
      >
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} align="center">
            <Box bg="brand.500" p={3} borderRadius="xl" mb={2}>
              <Wallet color="white" size={32} />
            </Box>
            <Heading size="lg" textAlign="center" color="white">
              Ijtimoiy Himoya
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Nazorat paneliga kirish
            </Text>
          </VStack>

          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm">Login</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <User size={18} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="none"
                    _focus={{ ring: 2, ringColor: 'brand.500', bg: 'rgba(255, 255, 255, 0.08)' }}
                    color="white"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm">Parol</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Lock size={18} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="none"
                    _focus={{ ring: 2, ringColor: 'brand.500', bg: 'rgba(255, 255, 255, 0.08)' }}
                    color="white"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle Password"
                      variant="ghost"
                      size="sm"
                      icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      onClick={() => setShowPassword(!showPassword)}
                      color="gray.500"
                      _hover={{ color: 'white' }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                w="full"
                isLoading={isLoading}
                loadingText="Kirish..."
                mt={2}
                height="50px"
              >
                Tizimga kirish
              </Button>
            </VStack>
          </form>

          <VStack spacing={4}>
            <HStack w="full">
              <Divider borderColor="gray.700" />
              <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">YORDAM</Text>
              <Divider borderColor="gray.700" />
            </HStack>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Parolni unutgan boʻlsangiz, tizim administratoriga murojaat qiling
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
