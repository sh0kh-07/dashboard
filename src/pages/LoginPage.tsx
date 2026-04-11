import React, { useState } from 'react';
import {
  Box, Flex, VStack, Heading, Text, Input, Button,
  InputGroup, InputLeftElement, InputRightElement,
  FormControl, FormLabel, useToast, Image,
  HStack, Divider, IconButton
} from '@chakra-ui/react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo.jpg';

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
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box
        maxW="400px"
        w="full"
        bg="white"
        p={10}
        borderRadius="3xl"
        boxShadow="xl"
        border="1px solid"
        borderColor="gray.200"
      >
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="center">
            <Image src={Logo} alt="Logo" h="80px" w="auto" objectFit="contain" />
            <Box textAlign="center">
              <Heading size="lg" fontWeight="extrabold" color="gray.800" letterSpacing="tight">
                Kirish
              </Heading>
              <Text color="gray.500" fontSize="sm" mt={1}>
                Ijtimoiy Himoya Nazorat Paneli
              </Text>
            </Box>
          </VStack>

          <form onSubmit={handleLogin}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel color="gray.700" fontSize="sm" fontWeight="semibold">Foydalanuvchi nomi</FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <User size={20} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Loginni kiriting"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    fontSize="md"
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #343c75' }}
                    color="gray.800"
                    borderRadius="xl"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.700" fontSize="sm" fontWeight="semibold">Parol</FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Lock size={20} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    fontSize="md"
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #343c75' }}
                    color="gray.800"
                    borderRadius="xl"
                  />
                  <InputRightElement width="3.5rem">
                    <IconButton
                      aria-label="Toggle Password"
                      variant="ghost"
                      size="sm"
                      icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      onClick={() => setShowPassword(!showPassword)}
                      color="gray.400"
                      _hover={{ color: 'brand.500', bg: 'transparent' }}
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
                mt={4}
                height="56px"
                borderRadius="xl"
                fontSize="md"
                fontWeight="bold"
                boxShadow="lg"
                _hover={{ transform: 'translateY(-1px)', boxShadow: 'xl' }}
                _active={{ transform: 'translateY(0)' }}
              >
                Kirish
              </Button>
            </VStack>
          </form>

          <VStack spacing={4}>
            <HStack w="full">
              <Divider borderColor="gray.200" />
              <Text fontSize="xs" color="gray.400" whiteSpace="nowrap" fontWeight="medium" letterSpacing="widest">SUPPORT</Text>
              <Divider borderColor="gray.200" />
            </HStack>
            <Text fontSize="xs" color="gray.500" textAlign="center" px={4} lineHeight="tall">
              Agar tizimga kirishda muammo bo'lsa, ma'muriyat bilan bog'laning.
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
