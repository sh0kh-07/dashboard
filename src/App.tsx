/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  extendTheme,
  ColorModeScript,
  Progress,
  Tooltip,
  useColorMode,
  Button,
  Select,
  Heading,
  Divider,
  Switch,
  FormControl,
  FormLabel,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import {
  LayoutDashboard,
  Map,
  MapPin,
  Wallet,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  Search,
  Bell,
  Menu,
  Download,
  Eye,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// --- Theme Configuration ---
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e0f7fa',
      100: '#b2ebf2',
      200: '#80deea',
      300: '#4dd0e1',
      400: '#26c6da',
      500: '#00bcd4', // Cyan
      600: '#00acc1',
      700: '#0097a7',
      800: '#00838f',
      900: '#006064',
    },
    dark: {
      bg: '#0a0b0d',
      sidebar: '#121417',
      card: '#1a1d23',
      border: '#2d3139',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'dark.bg',
        color: 'white',
      },
    },
  },
});

// --- Mock Data ---
const lineData = [
  { name: 'Yan', usage: 4000, budget: 4500 },
  { name: 'Feb', usage: 3000, budget: 4500 },
  { name: 'Mar', usage: 5000, budget: 5500 },
  { name: 'Apr', usage: 4500, budget: 5500 },
  { name: 'May', usage: 6000, budget: 7000 },
  { name: 'Iyun', usage: 5500, budget: 7000 },
];

const barData = [
  { name: 'Toshkent', budget: 4500, used: 3800 },
  { name: 'Samarqand', budget: 3200, used: 2100 },
  { name: 'Farg\'ona', budget: 2800, used: 2400 },
  { name: 'Andijon', budget: 2400, used: 1900 },
  { name: 'Buxoro', budget: 2100, used: 1200 },
];

const pieData = [
  { name: 'Ijtimoiy yordam', value: 400 },
  { name: 'Sog\'liqni saqlash', value: 300 },
  { name: 'Ta\'lim', value: 300 },
  { name: 'Infratuzilma', value: 200 },
];

const COLORS = ['#00bcd4', '#0097a7', '#00838f', '#006064'];

const regionsData = [
  { id: 1, name: 'Toshkent shahri', budget: 1200000000, used: 850000000, percent: 70.8 },
  { id: 2, name: 'Samarqand viloyati', budget: 950000000, used: 420000000, percent: 44.2 },
  { id: 3, name: 'Farg\'ona viloyati', budget: 880000000, used: 510000000, percent: 57.9 },
  { id: 4, name: 'Andijon viloyati', budget: 720000000, used: 380000000, percent: 52.7 },
  { id: 5, name: 'Buxoro viloyati', budget: 650000000, used: 210000000, percent: 32.3 },
  { id: 6, name: 'Namangan viloyati', budget: 600000000, used: 300000000, percent: 50.0 },
  { id: 7, name: 'Qashqadaryo viloyati', budget: 580000000, used: 250000000, percent: 43.1 },
];

const districtsData = [
  { id: 1, region: 'Toshkent shahri', name: 'Yunusobod tumani', budget: 150000000, used: 120000000 },
  { id: 2, region: 'Toshkent shahri', name: 'Mirzo Ulug\'bek tumani', budget: 140000000, used: 110000000 },
  { id: 3, region: 'Samarqand viloyati', name: 'Samarqand tumani', budget: 120000000, used: 60000000 },
  { id: 4, region: 'Samarqand viloyati', name: 'Urgut tumani', budget: 130000000, used: 70000000 },
  { id: 5, region: 'Farg\'ona viloyati', name: 'Marg\'ilon shahri', budget: 100000000, used: 80000000 },
  { id: 6, region: 'Farg\'ona viloyati', name: 'Qo\'qon shahri', budget: 110000000, used: 90000000 },
];

const reportsData = [
  { id: 1, name: 'Yillik moliyaviy hisobot 2025', date: '2026-01-15', status: 'Tayyor' },
  { id: 2, name: 'Hududiy taqsimot tahlili Q1', date: '2026-03-30', status: 'Jarayonda' },
  { id: 3, name: 'Ijtimoiy yordam samaradorligi', date: '2026-02-10', status: 'Tayyor' },
  { id: 4, name: 'Tumanlar bo\'yicha xarajatlar', date: '2026-04-01', status: 'Yangi' },
];

// --- Components ---

const SidebarItem = ({ icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => {
  return (
    <Link to={to} style={{ width: '100%' }}>
      <HStack
        w="full"
        px={4}
        py={3}
        cursor="pointer"
        bg={active ? 'brand.500' : 'transparent'}
        color={active ? 'white' : 'gray.400'}
        borderRadius="lg"
        transition="all 0.2s"
        _hover={{
          bg: active ? 'brand.600' : 'whiteAlpha.100',
          color: 'white',
        }}
      >
        <Icon as={icon} size={20} />
        <Text fontWeight="medium" fontSize="sm">{label}</Text>
      </HStack>
    </Link>
  );
};

const StatCard = ({ label, value, helpText, type = 'increase' }: { label: string, value: string, helpText: string, type?: 'increase' | 'decrease' }) => {
  return (
    <Box
      as={motion.div}
      whileHover={{ y: -5 }}
      bg="dark.card"
      p={6}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="dark.border"
      boxShadow="xl"
    >
      <Stat>
        <StatLabel color="gray.400" fontSize="sm">{label}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold" mt={1}>{value}</StatNumber>
        <StatHelpText mb={0}>
          <StatArrow type={type} />
          {helpText}
        </StatHelpText>
      </Stat>
    </Box>
  );
};

const PageHeader = ({ title, breadcrumbs }: { title: string, breadcrumbs: string[] }) => {
  return (
    <Box mb={8}>
      <Breadcrumb spacing="8px" separator={<ChevronRight size={14} color="#718096" />} mb={2}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/" color="gray.500" fontSize="xs">Asosiy</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((bc, idx) => (
          <BreadcrumbItem key={idx} isCurrentPage={idx === breadcrumbs.length - 1}>
            <BreadcrumbLink color={idx === breadcrumbs.length - 1 ? 'brand.500' : 'gray.500'} fontSize="xs">
              {bc}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Heading size="lg">{title}</Heading>
    </Box>
  );
};

// --- Pages ---

const DashboardPage = () => {
  return (
    <Box>
      <PageHeader title="Asosiy Dashboard" breadcrumbs={['Dashboard']} />
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard label="Umumiy Budjet" value="5,480,000,000 UZS" helpText="12% o'sish" />
        <StatCard label="Ishlatilgan Mablag'lar" value="2,150,000,000 UZS" helpText="5.4% o'sish" />
        <StatCard label="Qolgan Mablag'lar" value="3,330,000,000 UZS" helpText="2.1% kamayish" type="decrease" />
        <StatCard label="Loyihalar Soni" value="1,248" helpText="18 ta yangi" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Box bg="dark.card" p={6} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Text fontWeight="bold" mb={4}>Mablag'lar sarflanishi (Oylik)</Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00bcd4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" vertical={false} />
                <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                <YAxis stroke="#718096" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#2d3139', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#00bcd4" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box bg="dark.card" p={6} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Text fontWeight="bold" mb={4}>Hududlar bo'yicha taqsimot</Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" vertical={false} />
                <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                <YAxis stroke="#718096" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#2d3139', borderRadius: '8px' }}
                />
                <Bar dataKey="budget" fill="#00bcd4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" fill="#0097a7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        <Box bg="dark.card" p={6} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Text fontWeight="bold" mb={4}>So'nggi faollik</Text>
          <VStack align="start" spacing={4}>
            {[
              { title: 'Yangi budjet tasdiqlandi', time: '2 soat avval', color: 'blue' },
              { title: 'Toshkent hisoboti tayyor', time: '5 soat avval', color: 'green' },
              { title: 'Tizim yangilanishi', time: '1 kun avval', color: 'orange' },
              { title: 'Yangi foydalanuvchi qo\'shildi', time: '2 kun avval', color: 'purple' },
            ].map((item, idx) => (
              <HStack key={idx} spacing={3} w="full">
                <Box w={2} h={2} borderRadius="full" bg={`${item.color}.400`} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium">{item.title}</Text>
                  <Text fontSize="xs" color="gray.500">{item.time}</Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box bg="dark.card" p={6} borderRadius="2xl" borderWidth="1px" borderColor="dark.border" gridColumn={{ lg: "span 2" }}>
          <Text fontWeight="bold" mb={4}>Mablag'lar yo'nalishi</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box h="200px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#2d3139', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <VStack align="start" justify="center" spacing={3}>
              {pieData.map((item, idx) => (
                <HStack key={idx} w="full" justify="space-between">
                  <HStack>
                    <Box w={3} h={3} borderRadius="full" bg={COLORS[idx]} />
                    <Text fontSize="sm" color="gray.400">{item.name}</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold">{item.value} mlrd</Text>
                </HStack>
              ))}
            </VStack>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

const RegionsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = regionsData.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <PageHeader title="Hududlar Monitoringi" breadcrumbs={['Hududlar']} />
      
      <Box bg="dark.card" borderRadius="2xl" borderWidth="1px" borderColor="dark.border" overflow="hidden">
        <Box p={6} borderBottomWidth="1px" borderColor="dark.border">
          <HStack justify="space-between">
            <InputGroup maxW="300px">
              <InputLeftElement><Search size={18} color="#718096" /></InputLeftElement>
              <Input 
                placeholder="Hudud qidirish..." 
                bg="whiteAlpha.50" 
                border="none" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            <Button leftIcon={<Filter size={18} />} variant="outline" size="sm">Filtrlar</Button>
          </HStack>
        </Box>
        <Table variant="simple">
          <Thead bg="whiteAlpha.50">
            <Tr>
              <Th color="gray.500">Hudud nomi</Th>
              <Th color="gray.500">Ajratilgan budjet</Th>
              <Th color="gray.500">Ishlatilgan</Th>
              <Th color="gray.500">Qolgan mablag'</Th>
              <Th color="gray.500">Progress</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((region) => (
              <Tr key={region.id} _hover={{ bg: 'whiteAlpha.50' }}>
                <Td fontWeight="bold">{region.name}</Td>
                <Td>{region.budget.toLocaleString()} UZS</Td>
                <Td color="brand.500">{region.used.toLocaleString()} UZS</Td>
                <Td>{(region.budget - region.used).toLocaleString()} UZS</Td>
                <Td w="250px">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" fontWeight="bold">{region.percent}%</Text>
                    <Progress 
                      value={region.percent} 
                      size="xs" 
                      w="full" 
                      borderRadius="full" 
                      colorScheme={region.percent > 60 ? 'cyan' : 'blue'} 
                      bg="whiteAlpha.100"
                    />
                  </VStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

const DistrictsPage = () => {
  const grouped = useMemo(() => {
    return districtsData.reduce((acc: any, curr) => {
      if (!acc[curr.region]) acc[curr.region] = [];
      acc[curr.region].push(curr);
      return acc;
    }, {});
  }, []);

  return (
    <Box>
      <PageHeader title="Tumanlar bo'yicha tahlil" breadcrumbs={['Tumanlar']} />
      
      <VStack spacing={8} align="start">
        {Object.keys(grouped).map((region) => (
          <Box key={region} w="full">
            <Heading size="md" mb={4} color="brand.500">{region}</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {grouped[region].map((district: any) => (
                <Box 
                  key={district.id} 
                  bg="dark.card" 
                  p={6} 
                  borderRadius="2xl" 
                  borderWidth="1px" 
                  borderColor="dark.border"
                  as={motion.div}
                  whileHover={{ scale: 1.02 }}
                >
                  <Text fontWeight="bold" fontSize="lg" mb={4}>{district.name}</Text>
                  <Stack spacing={3}>
                    <HStack justify="space-between">
                      <Text color="gray.500" fontSize="sm">Budjet:</Text>
                      <Text fontWeight="bold" fontSize="sm">{district.budget.toLocaleString()} UZS</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.500" fontSize="sm">Ishlatilgan:</Text>
                      <Text fontWeight="bold" fontSize="sm" color="brand.500">{district.used.toLocaleString()} UZS</Text>
                    </HStack>
                    <Divider borderColor="dark.border" />
                    <VStack align="start" spacing={1}>
                      <HStack w="full" justify="space-between">
                        <Text fontSize="xs" color="gray.500">Sarflanish darajasi</Text>
                        <Text fontSize="xs" fontWeight="bold">{((district.used / district.budget) * 100).toFixed(1)}%</Text>
                      </HStack>
                      <Progress 
                        value={(district.used / district.budget) * 100} 
                        size="xs" 
                        w="full" 
                        borderRadius="full" 
                        colorScheme="cyan" 
                        bg="whiteAlpha.100"
                      />
                    </VStack>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

const FundsPage = () => {
  return (
    <Box>
      <PageHeader title="Mablag'lar tahlili" breadcrumbs={['Mablag\'lar']} />
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box bg="dark.card" p={8} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Heading size="md" mb={6}>Xarajatlar kategoriyasi</Heading>
          <VStack spacing={6} align="start">
            {[
              { label: 'Kam ta\'minlangan oilalar', amount: '1.2 trln', percent: 85, color: 'cyan' },
              { label: 'Nogironligi bor shaxslar', amount: '850 mlrd', percent: 72, color: 'blue' },
              { label: 'Bolalar nafaqasi', amount: '2.1 trln', percent: 94, color: 'teal' },
              { label: 'Uy-joy subsidiyalari', amount: '450 mlrd', percent: 45, color: 'orange' },
            ].map((item, idx) => (
              <Box key={idx} w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="medium">{item.label}</Text>
                  <Text fontWeight="bold" color="brand.500">{item.amount}</Text>
                </HStack>
                <Progress value={item.percent} size="sm" borderRadius="full" colorScheme={item.color} bg="whiteAlpha.100" />
                <Text fontSize="xs" color="gray.500" mt={1}>O'zlashtirish: {item.percent}%</Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box bg="dark.card" p={8} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Heading size="md" mb={6}>Moliyaviy ko'rsatkichlar</Heading>
          <VStack divider={<StackDivider borderColor="dark.border" />} spacing={4} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text color="gray.500" fontSize="sm">O'rtacha oylik xarajat</Text>
                <Text fontSize="xl" fontWeight="bold">420,000,000 UZS</Text>
              </VStack>
              <Badge colorScheme="green" p={1} borderRadius="md">+12.5%</Badge>
            </HStack>
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text color="gray.500" fontSize="sm">Eng yuqori xarajat (May)</Text>
                <Text fontSize="xl" fontWeight="bold">600,000,000 UZS</Text>
              </VStack>
              <Icon as={TrendingUp} color="green.400" />
            </HStack>
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text color="gray.500" fontSize="sm">Kutilayotgan xarajatlar</Text>
                <Text fontSize="xl" fontWeight="bold">1.5 trln UZS</Text>
              </VStack>
              <Badge colorScheme="blue" p={1} borderRadius="md">Reja</Badge>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

const AnalyticsPage = () => {
  return (
    <Box>
      <PageHeader title="Analitika va Bashorat" breadcrumbs={['Analitika']} />
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <Box bg="dark.card" p={6} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Text fontWeight="bold" mb={6}>Budjet vs Xarajat (Trend)</Text>
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" vertical={false} />
                <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                <YAxis stroke="#718096" fontSize={12} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#2d3139', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="budget" stroke="#718096" strokeWidth={2} strokeDasharray="5 5" name="Reja" />
                <Line type="monotone" dataKey="usage" stroke="#00bcd4" strokeWidth={3} name="Amalda" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box bg="dark.card" p={6} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Text fontWeight="bold" mb={6}>O'sish sur'ati (Hududlar)</Text>
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" horizontal={false} />
                <XAxis type="number" stroke="#718096" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#718096" fontSize={12} width={100} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#2d3139', borderRadius: '8px' }} />
                <Bar dataKey="used" fill="#00bcd4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </SimpleGrid>

      <Box bg="dark.card" p={8} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
        <Heading size="md" mb={6}>Bashoratli tahlil (AI)</Heading>
        <Text color="gray.400" mb={8}>
          Sun'iy intellekt tahliliga ko'ra, keyingi chorakda ijtimoiy yordamga bo'lgan talab 15% ga oshishi kutilmoqda. 
          Bu asosan mavsumiy omillar va yangi loyihalar ishga tushishi bilan bog'liq.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box p={4} borderRadius="xl" bg="whiteAlpha.50" borderLeftWidth="4px" borderLeftColor="cyan.400">
            <Text fontSize="xs" color="gray.500">Kutilayotgan o'sish</Text>
            <Text fontSize="xl" fontWeight="bold">+15.2%</Text>
          </Box>
          <Box p={4} borderRadius="xl" bg="whiteAlpha.50" borderLeftWidth="4px" borderLeftColor="blue.400">
            <Text fontSize="xs" color="gray.500">Budjet yetishmovchiligi xavfi</Text>
            <Text fontSize="xl" fontWeight="bold">Past (2%)</Text>
          </Box>
          <Box p={4} borderRadius="xl" bg="whiteAlpha.50" borderLeftWidth="4px" borderLeftColor="teal.400">
            <Text fontSize="xs" color="gray.500">Samaradorlik ko'rsatkichi</Text>
            <Text fontSize="xl" fontWeight="bold">98.4%</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

const ReportsPage = () => {
  return (
    <Box>
      <PageHeader title="Hisobotlar va Hujjatlar" breadcrumbs={['Hisobotlar']} />
      
      <Box bg="dark.card" borderRadius="2xl" borderWidth="1px" borderColor="dark.border" overflow="hidden">
        <Table variant="simple">
          <Thead bg="whiteAlpha.50">
            <Tr>
              <Th color="gray.500">Hisobot nomi</Th>
              <Th color="gray.500">Sana</Th>
              <Th color="gray.500">Holat</Th>
              <Th color="gray.500" textAlign="right">Amallar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reportsData.map((report) => (
              <Tr key={report.id} _hover={{ bg: 'whiteAlpha.50' }}>
                <Td fontWeight="medium">
                  <HStack>
                    <Icon as={FileText} color="brand.500" />
                    <Text>{report.name}</Text>
                  </HStack>
                </Td>
                <Td color="gray.400">{report.date}</Td>
                <Td>
                  <Badge 
                    colorScheme={report.status === 'Tayyor' ? 'green' : report.status === 'Jarayonda' ? 'blue' : 'gray'}
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                  >
                    {report.status}
                  </Badge>
                </Td>
                <Td textAlign="right">
                  <HStack justify="end" spacing={2}>
                    <IconButton aria-label="View" icon={<Eye size={16} />} size="sm" variant="ghost" />
                    <IconButton aria-label="Download" icon={<Download size={16} />} size="sm" variant="ghost" colorScheme="cyan" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

const SettingsPage = () => {
  return (
    <Box>
      <PageHeader title="Tizim Sozlamalari" breadcrumbs={['Sozlamalar']} />
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box bg="dark.card" p={8} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Heading size="md" mb={6}>Profil Sozlamalari</Heading>
          <VStack spacing={6} align="stretch">
            <HStack spacing={4}>
              <Avatar size="xl" name="Shoxrux T." src="https://bit.ly/broken-link" />
              <VStack align="start" spacing={1}>
                <Button size="sm" colorScheme="cyan">Rasmni o'zgartirish</Button>
                <Button size="sm" variant="ghost">O'chirish</Button>
              </VStack>
            </HStack>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.500">Ism</FormLabel>
                <Input defaultValue="Shoxrux" bg="whiteAlpha.50" border="none" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.500">Familiya</FormLabel>
                <Input defaultValue="Tuxtanazarov" bg="whiteAlpha.50" border="none" />
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.500">Email</FormLabel>
              <Input defaultValue="shoxrux@gov.uz" bg="whiteAlpha.50" border="none" />
            </FormControl>
            <Button colorScheme="cyan" w="fit-content">Saqlash</Button>
          </VStack>
        </Box>

        <Box bg="dark.card" p={8} borderRadius="2xl" borderWidth="1px" borderColor="dark.border">
          <Heading size="md" mb={6}>Tizim va Bildirishnomalar</Heading>
          <VStack spacing={6} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb="0" fontSize="sm">Qorong'u mavzu (Dark Mode)</FormLabel>
              <Switch colorScheme="cyan" isChecked={true} />
            </FormControl>
            <Divider borderColor="dark.border" />
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb="0" fontSize="sm">Email bildirishnomalari</FormLabel>
              <Switch colorScheme="cyan" defaultChecked />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb="0" fontSize="sm">Haftalik hisobotlar</FormLabel>
              <Switch colorScheme="cyan" defaultChecked />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb="0" fontSize="sm">Tizim yangilanishlari</FormLabel>
              <Switch colorScheme="cyan" />
            </FormControl>
            <Divider borderColor="dark.border" />
            <VStack align="start" spacing={4}>
              <Text fontWeight="bold" fontSize="sm">Xavfsizlik</Text>
              <Button size="sm" variant="outline" colorScheme="red">Parolni o'zgartirish</Button>
              <Button size="sm" variant="ghost" colorScheme="red">Hisobni o'chirish</Button>
            </VStack>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

// --- Main Layout ---

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

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
            <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} />
            <SidebarItem icon={Map} label="Hududlar" to="/regions" active={location.pathname === '/regions'} />
            <SidebarItem icon={MapPin} label="Tumanlar" to="/districts" active={location.pathname === '/districts'} />
            <SidebarItem icon={Wallet} label="Mablag'lar" to="/funds" active={location.pathname === '/funds'} />
            <SidebarItem icon={BarChart3} label="Analitika" to="/analytics" active={location.pathname === '/analytics'} />
            <SidebarItem icon={FileText} label="Hisobotlar" to="/reports" active={location.pathname === '/reports'} />
            <SidebarItem icon={SettingsIcon} label="Sozlamalar" to="/settings" active={location.pathname === '/settings'} />
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
          h="72px"
          bg="dark.sidebar"
          borderBottomWidth="1px"
          borderColor="dark.border"
          align="center"
          px={8}
          justify="space-between"
        >
          <HStack spacing={4}>
            <IconButton
              aria-label="Toggle Sidebar"
              icon={<Menu size={20} />}
              variant="ghost"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              display={{ base: 'flex', lg: 'none' }}
            />
            <InputGroup w="400px" display={{ base: 'none', md: 'flex' }}>
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="#718096" />
              </InputLeftElement>
              <Input
                placeholder="Qidiruv..."
                bg="whiteAlpha.50"
                border="none"
                _focus={{ bg: 'whiteAlpha.100', boxShadow: 'none' }}
              />
            </InputGroup>
          </HStack>

          <HStack spacing={6}>
            <IconButton
              aria-label="Notifications"
              icon={<Bell size={20} />}
              variant="ghost"
              position="relative"
            >
              <Box
                position="absolute"
                top="2"
                right="2"
                w="2"
                h="2"
                bg="brand.500"
                borderRadius="full"
              />
            </IconButton>
            <HStack spacing={3} cursor="pointer">
              <VStack align="end" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                <Text fontSize="sm" fontWeight="bold">Shoxrux T.</Text>
                <Text fontSize="xs" color="gray.500">Administrator</Text>
              </VStack>
              <Avatar size="sm" name="Shoxrux T." src="https://bit.ly/broken-link" />
            </HStack>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box p={8} w="full" overflowY="auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/regions" element={<RegionsPage />} />
                <Route path="/districts" element={<DistrictsPage />} />
                <Route path="/funds" element={<FundsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Flex>
    </Flex>
  );
};

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <MainLayout />
      </Router>
    </ChakraProvider>
  );
}
