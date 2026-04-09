import React, { useState } from 'react';
import {
  Box, Flex, HStack, Text, IconButton, Avatar, VStack,
  Button
} from '@chakra-ui/react';
import {
  LayoutDashboard, Wallet, Landmark, Bell, Menu,
  BanknoteArrowDown, HandCoins, ArrowLeft, BadgeDollarSign,
  ChevronRight, ChevronDown,
  Users,
  BriefcaseBusiness,
  MapPin,
  ChartColumnBig
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarItem from '../components/SidebarItem';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Типы для пунктов меню
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

// Конфигурация меню (объектная версия)
const menuConfig: MenuItem[] = [
  {
    type: 'item',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    type: 'item',
    label: 'Xisobotlar',
    icon: ChartColumnBig,
    path: '/reports',
  },
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
      {
        type: 'item', label: 'Kambagʻalik darajasi', icon: ChevronRight, path: '/poor-level'
      },
      { type: 'item', label: 'Kambagʻal oilalar ', icon: ChevronRight, path: '/family' },
    ],
  },
  {
    type: 'accordion',
    label: 'Ishsizlik',
    icon: BriefcaseBusiness,
    children: [
      {
        type: 'item', label: 'Ishsizlik darajasi', icon: ChevronRight, path: '/work'
      },
      { type: 'item', label: 'Ishga joylashtirilgan aholi', icon: ChevronRight, path: '/swork' },
    ],
  },
  {
    type: 'accordion',
    label: 'Og`ir toifa',
    icon: MapPin,
    children: [
      {
        type: 'item', label: 'Og`ir toifadagi tumanlar', icon: ChevronRight, path: '/regions'
      },
      { type: 'item', label: 'Og`ir toifadagi mahallalar', icon: ChevronRight, path: '/mahalla' },
    ],
  },
];

// Компонент аккордеона (с анимацией через framer-motion)
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
        color="gray.300"
        _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
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
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
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

// Маппинг путей для хлебных крошек (остаётся без изменений)
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

// Функция для получения даты в узбекской латинице (день, месяц, год)
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

  const currentRoute = routeConfig[location.pathname] || { title: 'Nomaʼlum', breadcrumbs: ['Sahifa'] };

  const handleBack = () => navigate(-1);
  const showBackButton = location.pathname !== '/';

  const isActivePath = (pathname: string, to: string) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  const toggleAccordion = (label: string) => {
    setOpenAccordions(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Получаем текущую дату на узбекской латинице
  const uzbekDate = getUzbekDate();

  // Имя администратора
  const adminName = "Shoxrux T.";

  // Рендер пункта меню на основе конфигурации
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
      // accordion
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
            {menuConfig.map((item, idx) => renderMenuItem(item, idx))}
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

          <HStack spacing={4}>
            {/* Текущая дата на узбекской латинице */}
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              {uzbekDate}
            </Text>
            <IconButton
              aria-label="Notifications"
              icon={<Bell size={18} />}
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'brand.500', bg: 'gray.700' }}
            />
            <HStack spacing={2} cursor="pointer">
              <VStack align="end" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                <Text fontSize="sm" fontWeight="bold" color="white">{adminName}</Text>
                <Text fontSize="xs" color="gray.500">Administrator</Text>
              </VStack>
              <Avatar size="sm" name={adminName} />
            </HStack>
          </HStack>
        </Flex>

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