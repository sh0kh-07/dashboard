import React, { useState, useMemo } from 'react';
import { Box, Flex, HStack, Text, IconButton, Avatar, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useMediaQuery, Heading, Button } from '@chakra-ui/react';
import { LayoutDashboard, Wallet, Landmark, Bell, Menu, BanknoteArrowDown, HandCoins, ChevronRight, ArrowLeft, BadgeDollarSign } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarItem from '../components/SidebarItem';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Маппинг путей для заголовков и хлебных крошек
const routeConfig: Record<string, { title: string; breadcrumbs: string[] }> = {
  '/': { title: 'Dashboard', breadcrumbs: ['Asosiy'] },
  '/budget': { title: 'Davlat byudjeti', breadcrumbs: ['Budjet'] },
  '/fund': { title: 'Jamgʻarma', breadcrumbs: ['Jamgʻarma'] },
  '/loans': { title: 'Kreditlar', breadcrumbs: ['Kreditlar'] },
  '/external': { title: 'Tashqi moliya manbalari', breadcrumbs: ['Tashqi moliya'] },
  '/kashkadarya': { title: 'Qashqadaryo viloyati', breadcrumbs: ['Budjet', 'Qashqadaryo'] },
  '/kashkadarya/qarshi-detail': { title: 'Qarshi shahri', breadcrumbs: ['Budjet', 'Qashqadaryo', 'Qarshi'] },
  '/kashkadarya/mahalla/batosh': { title: 'Batosh mahallasi', breadcrumbs: ['Budjet', 'Qashqadaryo', 'Qarshi', 'Batosh'] },
  '/contract/budget-1': { title: 'Kontrakt detali', breadcrumbs: ['Budjet', 'Qashqadaryo', 'Qarshi', 'Batosh', 'Kontrakt'] },
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute = useMemo(() => {
    return routeConfig[location.pathname] || { title: 'Nomaʼlum', breadcrumbs: ['Sahifa'] };
  }, [location.pathname]);

  const handleBack = () => {
    navigate(-1);
  };

  const showBackButton = location.pathname !== '/';

  // Функция для определения активного пункта меню (по началу пути)
  const isActivePath = (pathname: string, to: string) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  return (
    <Flex h="100vh" w="100vw" overflow="hidden">
      {/* Sidebar */}
      <Box
        w={isSidebarOpen ? '280px' : '0px'}
        bg="dark.sidebar"
        borderRightWidth="1px"
        borderColor="dark.border"
        transition="all 0.3s"
        overflow="hidden"
        display={{ base: 'none', lg: 'block' }}
      >
        <VStack h="full" py={8} px={4} align="start" spacing={8}>
          <HStack px={4} spacing={3}>
            <Box bg="brand.500" p={2} borderRadius="lg">
              <Wallet color="white" size={24} />
            </Box>
            <Text fontWeight="bold" fontSize="lg" lineHeight="1.2">
              Ijtimoiy Himoya<br />
              <Text as="span" color="brand.500" fontSize="sm">Nazorat Paneli</Text>
            </Text>
          </HStack>

          <VStack w="full" spacing={2} align="start">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              to="/" 
              active={isActivePath(location.pathname, '/')} 
            />
            <SidebarItem 
              icon={Landmark} 
              label="Davlat byudjeti" 
              to="/budget" 
              active={isActivePath(location.pathname, '/budget')} 
            />
            <SidebarItem 
              icon={BanknoteArrowDown} 
              label="Jamgʻarma" 
              to="/fund" 
              active={isActivePath(location.pathname, '/fund')} 
            />
            <SidebarItem 
              icon={HandCoins} 
              label="Kreditlar" 
              to="/loans" 
              active={isActivePath(location.pathname, '/loans')} 
            />
            <SidebarItem 
              icon={BadgeDollarSign} 
              label="Tashqi moliya manbalari" 
              to="/external" 
              active={isActivePath(location.pathname, '/external')} 
            />
          </VStack>

          <Box mt="auto" w="full" px={4}>
            <Box bg="whiteAlpha.100" p={4} borderRadius="xl" borderWidth="1px" borderColor="dark.border">
              <Text fontSize="xs" color="gray.400" mb={2}>Yordam kerakmi?</Text>
              <Text fontSize="sm" fontWeight="bold">Texnik qo'llab-quvvatlash</Text>
            </Box>
          </Box>
        </VStack>
      </Box>

      {/* Main Content Area */}
      <Flex flex={1} direction="column">
        {/* Header */}
        <Flex
          bg="dark.sidebar"
          borderBottomWidth="1px"
          borderColor="dark.border"
          align="center"
          justify="space-between"
          px={6}
          py={4}
          minH="72px"
        >
          {/* Левая часть: кнопка меню (на мобильных) и кнопка назад */}
          <HStack spacing={4}>
            <IconButton
              aria-label="Toggle Sidebar"
              icon={<Menu size={20} />}
              variant="ghost"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              display={{ base: 'flex', lg: 'none' }}
            />
            {showBackButton && (
              <Button
                leftIcon={<ArrowLeft size={20} />}
                size="sm"
                variant="ghost"
                color="gray.400"
                onClick={handleBack}
                _hover={{ color: 'brand.500', bg: 'gray.700' }}
                borderRadius="full"
              >
                Ortga
              </Button>
            )}
          </HStack>

          {/* Правая часть: уведомления и профиль (убрали поиск) */}
          <HStack spacing={4}>
            <IconButton
              aria-label="Notifications"
              icon={<Bell size={18} />}
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'brand.500', bg: 'gray.700' }}
            />
            <HStack spacing={2} cursor="pointer">
              <VStack align="end" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                <Text fontSize="sm" fontWeight="bold" color="white">Shoxrux T.</Text>
                <Text fontSize="xs" color="gray.500">Administrator</Text>
              </VStack>
              <Avatar size="sm" name="Shoxrux T." />
            </HStack>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box p={6} w="full" overflowY="auto" flex="1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;