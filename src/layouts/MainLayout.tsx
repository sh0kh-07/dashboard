import React, { useState, useEffect } from 'react';
import {
  Box, Flex, HStack, Text, IconButton, Avatar, VStack,
  Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider
} from '@chakra-ui/react';
import {
  LayoutDashboard, Wallet, Landmark, Bell, Menu as MenuIcon,
  BanknoteArrowDown, HandCoins, ArrowLeft, BadgeDollarSign,
  ChevronRight, ChevronDown,
  Users,
  BriefcaseBusiness,
  MapPin,
  ChartColumnBig,
  LogOut,
  User,
  MonitorCloud,
  Home,
  HandHelping
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarItem from '../components/SidebarItem';
import Logo from '../Logo/Logo.jpg';
import Foto from '../Logo/Foto.jpg';

interface MainLayoutProps {
  children: React.ReactNode;
}

type MenuItemType = 'item' | 'accordion';

interface BaseMenuItem {
  type: MenuItemType;
  label: string;
  icon: React.ElementType;
}

interface SimpleMenuItem extends BaseMenuItem {
  type: 'item';
  path: string;
}

interface AccordionMenuItem extends BaseMenuItem {
  type: 'accordion';
  children: SimpleMenuItem[];
}

type MenuItem = SimpleMenuItem | AccordionMenuItem;

const menuConfig: MenuItem[] = [
  { type: 'item', label: 'Bosh sahifa', icon: Home, path: '/' },
  { type: 'item', label: 'Hisobotlar', icon: ChartColumnBig, path: '/reports' },
  { type: 'item', label: 'Ajratilgan mablag`lar', icon: Wallet, path: '/budget' },
  { type: 'item', label: 'Kambag`galik darajasi', icon: Users, path: '/poor-level' },
  { type: 'item', label: 'Bandlik darajasi', icon: BriefcaseBusiness, path: '/job-placement' },
  { type: 'item', label: 'Og\'ir toifadagi hududlar', icon: MapPin, path: '/regions' },
  { type: 'item', label: 'Ko\'rsatilgan xizmatlar', icon: HandHelping, path: '/mahalla' },
];

// ------------------------------
// ДАННЫЕ ДЛЯ АГРЕГИРОВАННЫХ ПОКАЗАТЕЛЕЙ (копия из DashboardPage)
// ------------------------------
const regionKeys = [
  "Tashkent", "Toshkent viloyati", "Samarkand", "Bukhara", "Qashqadaryo",
  "Fergana", "Andijan", "Namangan", "Surxondaryo", "Jizzakh", "Sirdaryo",
  "Navoiy", "Xorazm", "Karakalpakstan"
];

const populationBase = {
  "Tashkent": 2600000, "Toshkent viloyati": 2900000, "Samarkand": 3900000, "Bukhara": 1900000,
  "Qashqadaryo": 3300000, "Fergana": 3800000, "Andijan": 3300000, "Namangan": 2800000,
  "Surxondaryo": 2700000, "Jizzakh": 1400000, "Sirdaryo": 880000, "Navoiy": 1000000,
  "Xorazm": 1900000, "Karakalpakstan": 1900000
};

const avgFamilySize = 4.5;

const totalPopulation = Object.values(populationBase).reduce((a, b) => a + b, 0);
const totalFamilies = Math.round(totalPopulation / avgFamilySize);

const formatNumber = (num: number): string => {
  if (isNaN(num) || num === undefined || num === null) return "0";
  return new Intl.NumberFormat('ru-RU').format(Math.round(num));
};

// ------------------------------
// ОСТАЛЬНАЯ ЛОГИКА (маршруты, часы)
// ------------------------------
const routeConfig: Record<string, { title: string; breadcrumbs: string[] }> = {
  '/': { title: 'Ijtimoiy himoya monitoringi', breadcrumbs: ['Asosiy'] },
  '/reports': { title: 'Hisobotlar', breadcrumbs: ['Hisobotlar'] },
  '/budget': { title: 'Ajratilgan mablag`lar', breadcrumbs: ['Ajratilgan mablag`lar'] },
  '/poor-level': { title: 'Kambagʻalik darajasi', breadcrumbs: ['Kambagʻalik darajasi'] },
  '/job-placement': { title: 'Bandlik darajasi', breadcrumbs: ['Bandlik darajasi'] },
  '/regions': { title: 'Ogʻir toifadagi hududlar', breadcrumbs: ['Ogʻir toifadagi hududlar'] },
  '/mahalla': { title: 'Ko‘rsatilgan xizmatlar', breadcrumbs: ['Ko‘rsatilgan xizmatlar'] },
  '/kashkadarya': { title: 'Qashqadaryo viloyati', breadcrumbs: ['Budjet', 'Qashqadaryo'] },
  '/kashkadarya/qarshi-detail': { title: 'Qarshi shahri', breadcrumbs: ['Budjet', 'Qashqadaryo', 'Qarshi'] },
  '/kashkadarya/mahalla/batosh': { title: 'Batosh mahallasi', breadcrumbs: ['Budjet', 'Qashqadaryo', 'Qarshi', 'Batosh'] },
  '/contract/budget-1': { title: 'Kontrakt detali', breadcrumbs: ['Budjet', 'Qashqadaryo', 'Qarshi', 'Batosh', 'Kontrakt'] },
};

const getPageTitle = (pathname: string): string => {
  if (routeConfig[pathname]) return routeConfig[pathname].title;
  const matchedKey = Object.keys(routeConfig).find(key => pathname.startsWith(key) && key !== '/');
  if (matchedKey) return routeConfig[matchedKey].title;
  const lastSegment = pathname.split('/').filter(Boolean).pop();
  if (lastSegment) {
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  }
  return 'Dashboard';
};

const getUzbekDateTime = (): { date: string; time: string } => {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const months: Record<number, string> = {
    0: 'Yanvar', 1: 'Fevral', 2: 'Mart', 3: 'Aprel', 4: 'May', 5: 'Iyun',
    6: 'Iyul', 7: 'Avgust', 8: 'Sentabr', 9: 'Oktabr', 10: 'Noyabr', 11: 'Dekabr'
  };
  const monthName = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return {
    date: `${day} ${monthName} ${year}`,
    time: `${hours}:${minutes}`
  };
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const [currentDateTime, setCurrentDateTime] = useState(getUzbekDateTime());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getUzbekDateTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => navigate(-1);
  const showBackButton = location.pathname !== '/';
  const isHomePage = location.pathname === '/' || location.pathname === '/poor-level';

  const isActivePath = (pathname: string, to: string) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  const toggleAccordion = (label: string) => {
    setOpenAccordions(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const adminName = "Хасанов Фозилжон";
  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.type === 'item') {
      return (
        <SidebarItem
          key={index}
          icon={item.icon}
          label={item.label}
          to={item.path}
          active={isActivePath(location.pathname, item.path)}
        />
      );
    } else {
      const isOpen = openAccordions[item.label] || false;
      return (
        <AccordionItem
          key={index}
          icon={item.icon}
          label={item.label}
          isOpen={isOpen}
          onToggle={() => toggleAccordion(item.label)}
        >
          {item.children.map((child, childIndex) => (
            <SidebarItem
              key={childIndex}
              icon={child.icon}
              label={child.label}
              to={child.path}
              active={isActivePath(location.pathname, child.path)}
            />
          ))}
        </AccordionItem>
      );
    }
  };

  return (
    <Flex h="100vh" w="100vw" overflow="hidden">
      {/* Sidebar - light theme */}
      <Box
        w={isSidebarOpen ? '280px' : '0px'}
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        transition="all 0.3s"
        overflow="hidden"
        display={{ base: 'none', lg: 'block' }}
      >
        <Flex direction="column" h="full">
          <Flex px={4} py={6} alignItems={'center'} justifyContent={'center'}>
            <HStack spacing={3}>
              <img className='w-[70px]' src={Logo} alt="Logo" />
            </HStack>
          </Flex>
          <Box flex="1" overflowY="auto" px={4}>
            <VStack w="full" spacing={2} align="stretch">
              {menuConfig.map((item, idx) => renderMenuItem(item, idx))}
            </VStack>
          </Box>
          <Box px={4} py={6} mt="auto">
            <Box bg="gray.50" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500" mb={2}>Yordam kerakmi?</Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.800">Texnik qo'llab-quvvatlash</Text>
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Main Content Area */}
      <Flex flex={1} direction="column">
        {/* Header */}
        <Flex
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          align="center"
          justify="space-between"
          px={6}
          py={4}
          minH="72px"
          wrap="wrap"
          gap={3}
        >
          {/* Левая часть: кнопки и заголовок */}
          <HStack spacing={4}>
            <IconButton
              aria-label="Toggle Sidebar"
              icon={<MenuIcon size={20} />}
              variant="ghost"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              display={{ base: 'flex', lg: 'none' }}
              color="gray.600"
              _hover={{ bg: 'gray.100', color: 'gray.900' }}
            />
            {showBackButton && (
              <Button
                leftIcon={<ArrowLeft size={20} />}
                size="sm"
                variant="ghost"
                color="gray.600"
                onClick={handleBack}
                _hover={{ color: 'brand.500', bg: 'gray.100' }}
                borderRadius="full"
              >
                Ortga
              </Button>
            )}
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              {pageTitle}
            </Text>
          </HStack>

          {/* Правая часть: дата/время + три показателя (только на главной) */}
          <HStack spacing={6} wrap="wrap">
            {/* Три показателя: Jami aholi, Jami oila, Jami honodon (только на главной) */}
            {isHomePage && (
              <HStack spacing={4} divider={<Box w="1px" h="30px" bg="gray.200" />}>
                <HStack spacing={2}>
                  <Users size={18} color="#3182CE" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Jami aholi</Text>
                    <Text fontSize="md" fontWeight="bold" color="gray.800">{formatNumber(totalPopulation)}</Text>
                  </VStack>
                </HStack>
                <HStack spacing={2}>
                  <Home size={18} color="#38B2AC" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Jami oila</Text>
                    <Text fontSize="md" fontWeight="bold" color="gray.800">{formatNumber(totalFamilies)}</Text>
                  </VStack>
                </HStack>
                <HStack spacing={2}>
                  <Home size={18} color="#805AD5" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Jami honodon</Text>
                    <Text fontSize="md" fontWeight="bold" color="gray.800">{formatNumber(totalFamilies)}</Text>
                  </VStack>
                </HStack>
              </HStack>
            )}

            {/* Дата и время */}
            <HStack spacing={1}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {currentDateTime.date}
              </Text>
              <Text fontSize="sm" color="gray.400">|</Text>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {currentDateTime.time}
              </Text>
            </HStack>

            <IconButton
              aria-label="Notifications"
              icon={<Bell size={18} />}
              variant="ghost"
              color="gray.600"
              _hover={{ color: 'brand.500', bg: 'gray.100' }}
            />
            <Menu>
              <MenuButton>
                <HStack spacing={2} cursor="pointer">
                  <VStack align="end" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">{adminName}</Text>
                    <Text fontSize="xs" color="gray.500">Прокурор</Text>
                  </VStack>
                  <Avatar size="md" name={adminName} src={Foto} bg="brand.500" color="white" />
                </HStack>
              </MenuButton>
              <MenuList bg="white" borderColor="gray.200" boxShadow="lg">
                <MenuItem bg="transparent" _hover={{ bg: 'gray.100' }} icon={<User size={16} />}>
                  Profil
                </MenuItem>
                <MenuDivider borderColor="gray.200" />
                <MenuItem
                  bg="transparent"
                  _hover={{ bg: 'red.50', color: 'red.600' }}
                  icon={<LogOut size={16} />}
                  onClick={handleLogout}
                  color="red.500"
                >
                  Tizimdan chiqish
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Page content */}
        <Box p='10px' w="full" overflowY="auto" flex="1" bg="#ebedf0">
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

// AccordionItem component (unchanged)
interface AccordionItemProps {
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  icon: Icon,
  label,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <Box w="full">
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2.5}
        borderRadius="lg"
        cursor="pointer"
        color="gray.700"
        _hover={{ bg: 'gray.100', color: 'gray.900' }}
        onClick={onToggle}
        transition="all 0.2s"
      >
        <HStack spacing={3}>
          <Icon size={20} />
          <Text fontSize="sm" fontWeight="medium">{label}</Text>
        </HStack>
        <IconButton
          aria-label="Toggle"
          icon={isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          size="xs"
          variant="ghost"
          color="currentColor"
          _hover={{ bg: 'transparent' }}
        />
      </Flex>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <VStack pl={'20px'} mt={1} spacing={1} align="stretch">
              {children}
            </VStack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MainLayout;