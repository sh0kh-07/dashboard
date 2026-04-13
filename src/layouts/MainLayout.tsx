import React, { useState } from 'react';
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
  User
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
  { type: 'item', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { type: 'item', label: 'Xisobotlar', icon: ChartColumnBig, path: '/reports' },
  {
    type: 'accordion',
    label: 'Byudjet',
    icon: BadgeDollarSign,
    children: [
      { type: 'item', label: 'Davlat budjeti', icon: ChevronRight, path: '/budget' },
      { type: 'item', label: 'Jamgʻarma', icon: ChevronRight, path: '/fund' },
      { type: 'item', label: 'Kreditlar', icon: ChevronRight, path: '/loans' },
      { type: 'item', label: 'Tashqi moliya manbalari', icon: ChevronRight, path: '/external' },
    ],
  },
  {
    type: 'accordion',
    label: 'Kambagʻalik',
    icon: Users,
    children: [
      { type: 'item', label: 'Kambagʻalik darajasi', icon: ChevronRight, path: '/poor-level' },
      { type: 'item', label: 'Kambagʻal oilalar ', icon: ChevronRight, path: '/family' },
      { type: 'item', label: 'Kambagʻal oilalarni qamrab olish', icon: ChevronRight, path: '/poor-services' },
    ],
  },
  {
    type: 'accordion',
    label: 'Ishsizlik',
    icon: BriefcaseBusiness,
    children: [
      { type: 'item', label: 'Ishsizlik darajasi', icon: ChevronRight, path: '/work' },
      { type: 'item', label: 'Ish oʻrinlarini legallashtirish', icon: ChevronRight, path: '/swork' },
      { type: 'item', label: 'Aholini ishga joylashtirish', icon: ChevronRight, path: '/job-placement' },
    ],
  },
  {
    type: 'accordion',
    label: 'Og`ir toifa',
    icon: MapPin,
    children: [
      { type: 'item', label: 'Og`ir toifadagi tumanlar', icon: ChevronRight, path: '/regions' },
      { type: 'item', label: 'Og`ir toifadagi mahallalar', icon: ChevronRight, path: '/mahalla' },
    ],
  },
];

// AccordionItem component adapted for light theme
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

// Helper for breadcrumbs (unchanged)
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

const getUzbekDate = (): string => {
  const today = new Date();
  const day = today.getDate();
  const year = today.getFullYear();
  const months: Record<number, string> = {
    0: 'Yanvar', 1: 'Fevral', 2: 'Mart', 3: 'Aprel', 4: 'May', 5: 'Iyun',
    6: 'Iyul', 7: 'Avgust', 8: 'Sentabr', 9: 'Oktabr', 10: 'Noyabr', 11: 'Dekabr'
  };
  const monthName = months[today.getMonth()];
  return `${day} ${monthName} ${year}`;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const showBackButton = location.pathname !== '/';

  const isActivePath = (pathname: string, to: string) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  const toggleAccordion = (label: string) => {
    setOpenAccordions(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const uzbekDate = getUzbekDate();
  const adminName = "Хасанов Фозилжон";

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
          {/* Logo */}
          <Flex px={4} py={6}  alignItems={'center'} justifyContent={'center'}>
            <HStack spacing={3}>
              <img className='w-[70px]' src={Logo} alt="Logo" />
            </HStack>
          </Flex>

          {/* Scrollable menu */}
          <Box flex="1" overflowY="auto" px={4}>
            <VStack w="full" spacing={2} align="stretch">
              {menuConfig.map((item, idx) => renderMenuItem(item, idx))}
            </VStack>
          </Box>

          {/* Help block - light theme */}
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
        >
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
          </HStack>

          <HStack spacing={4}>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              {uzbekDate}
            </Text>
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
        <Box p={6} w="full" overflowY="auto" flex="1" bg="#ebedf0">
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