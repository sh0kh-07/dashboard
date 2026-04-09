// src/pages/Reports.tsx
import React from "react";
import {
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Text, Flex, useToken, Divider,
} from "@chakra-ui/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Users, Home, Briefcase, AlertTriangle, TrendingDown, CheckCircle,
} from "lucide-react";

// ------------------------------
// UMUMIY STATISTIK MA'LUMOTLAR
// ------------------------------

// Asosiy ko'rsatkichlar (jadval va oldingi ma'lumotlardan)
const totalHeavyMahallas = 903;
const totalPopulation = 3533725;  // 3,533,725
const totalHouseholds = 695937;
const totalFamilies = 908800;
const totalPoorFamilies = 263215;   // kambag'al oilalar
const totalLegalJobsUzb = 1000000;  // 1 million
const totalLegalJobsQashqadaryo = 77737;

// Viloyatlar bo'yicha kambag'allik va ishsizlik (o'rtacha)
const povertyByRegion = [
  { name: "Qoraqalpog'iston", value: 3.2 },
  { name: "Andijon", value: 2.7 },
  { name: "Buxoro", value: 2.6 },
  { name: "Jizzax", value: 2.8 },
  { name: "Qashqadaryo", value: 3.3 },
  { name: "Navoiy", value: 2.1 },
  { name: "Namangan", value: 2.7 },
  { name: "Samarqand", value: 2.0 },
  { name: "Sirdaryo", value: 3.0 },
  { name: "Surxondaryo", value: 2.8 },
  { name: "Toshkent vil.", value: 2.6 },
  { name: "Farg'ona", value: 2.7 },
  { name: "Xorazm", value: 3.0 },
  { name: "Toshkent sh.", value: 1.7 },
];

const unemploymentByRegion = [
  { name: "Qoraqalpog'iston", value: 4.8 },
  { name: "Andijon", value: 4.5 },
  { name: "Buxoro", value: 4.5 },
  { name: "Jizzax", value: 4.6 },
  { name: "Qashqadaryo", value: 4.6 },
  { name: "Navoiy", value: 3.9 },
  { name: "Namangan", value: 4.6 },
  { name: "Samarqand", value: 4.5 },
  { name: "Sirdaryo", value: 4.6 },
  { name: "Surxondaryo", value: 4.6 },
  { name: "Toshkent vil.", value: 4.5 },
  { name: "Farg'ona", value: 4.5 },
  { name: "Xorazm", value: 4.5 },
  { name: "Toshkent sh.", value: 3.8 },
];

// O'rtacha qiymatlar
const avgPoverty = (povertyByRegion.reduce((s, r) => s + r.value, 0) / povertyByRegion.length).toFixed(1);
const avgUnemployment = (unemploymentByRegion.reduce((s, r) => s + r.value, 0) / unemploymentByRegion.length).toFixed(1);

// Qashqadaryo tumanlaridagi legallashtiriladigan ish o'rinlari (oldindan hisoblangan)
const legalJobsDistricts = [
  { name: "Qarshi shahri", jobs: 485 },
  { name: "Shahrisabz shahri", jobs: 420 },
  { name: "Kitob tumani", jobs: 310 },
  { name: "Qamashi tumani", jobs: 180 },
];

const Reports = () => {
  const [brand600, green400, red400, yellow400] = useToken("colors", [
    "brand.600", "green.500", "red.500", "yellow.500",
  ]);

  return (
    <Box>
      <Heading as="h1" size="xl" mb={2}>Hisobotlar – Umumiy statistika</Heading>
      <Text fontSize="md" color="gray.400" mb={6}>
        O‘zbekiston bo‘yicha kambag‘allik, ishsizlik, og‘ir mahallalar va legallashtiriladigan ish o‘rinlari tahlili
      </Text>

      {/* Asosiy kartalar */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat bg="dark.card" p={5} borderRadius="xl" boxShadow="md">
          <Flex align="center" gap={2} mb={2}>
            <AlertTriangle size={24} color={red400} />
            <StatLabel fontSize="lg">Og‘ir mahallalar</StatLabel>
          </Flex>
          <StatNumber fontSize="3xl">{totalHeavyMahallas.toLocaleString()}</StatNumber>
          <StatHelpText>ta mahalla (2025)</StatHelpText>
        </Stat>

        <Stat bg="dark.card" p={5} borderRadius="xl" boxShadow="md">
          <Flex align="center" gap={2} mb={2}>
            <Users size={24} color={brand600} />
            <StatLabel fontSize="lg">Aholi (og‘ir mahallalarda)</StatLabel>
          </Flex>
          <StatNumber fontSize="3xl">{totalPopulation.toLocaleString()}</StatNumber>
          <StatHelpText>nafar</StatHelpText>
        </Stat>

        <Stat bg="dark.card" p={5} borderRadius="xl" boxShadow="md">
          <Flex align="center" gap={2} mb={2}>
            <Home size={24} color={green400} />
            <StatLabel fontSize="lg">Xonadonlar / Oilalar</StatLabel>
          </Flex>
          <StatNumber fontSize="3xl">{totalHouseholds.toLocaleString()} / {totalFamilies.toLocaleString()}</StatNumber>
          <StatHelpText>xonadon / oila</StatHelpText>
        </Stat>

        <Stat bg="dark.card" p={5} borderRadius="xl" boxShadow="md">
          <Flex align="center" gap={2} mb={2}>
            <Briefcase size={24} color={brand600} />
            <StatLabel fontSize="lg">Kambag‘al oilalar</StatLabel>
          </Flex>
          <StatNumber fontSize="3xl">{totalPoorFamilies.toLocaleString()}</StatNumber>
          <StatHelpText>ta oila (daromadi past)</StatHelpText>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Stat bg="dark.card" p={5} borderRadius="xl" boxShadow="md">
          <Flex align="center" gap={2} mb={2}>
            <TrendingDown size={24} color={brand600} />
            <StatLabel fontSize="lg">Legallashtiriladigan ish o‘rinlari (O‘zbekiston)</StatLabel>
          </Flex>
          <StatNumber fontSize="3xl">{totalLegalJobsUzb.toLocaleString()}</StatNumber>
          <StatHelpText>reja 2025</StatHelpText>
        </Stat>

        <Stat bg="dark.card" p={5} borderRadius="xl" boxShadow="md">
          <Flex align="center" gap={2} mb={2}>
            <CheckCircle size={24} color={green400} />
            <StatLabel fontSize="lg">O‘rtacha kambag‘allik</StatLabel>
          </Flex>
          <StatNumber fontSize="3xl">{avgPoverty}%</StatNumber>
          <StatHelpText>respublika bo‘yicha</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Divider my={6} borderColor="gray.700" />

      {/* Viloyatlar kesimida kambag‘allik va ishsizlik */}
      <Heading size="lg" mb={4}>Viloyatlar kesimida kambag‘allik va ishsizlik (2025 yil boshi)</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Box bg="dark.card" p={4} borderRadius="xl">
          <Text fontSize="md" fontWeight="bold" mb={3} textAlign="center">Kambag‘allik darajasi (%)</Text>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={povertyByRegion} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" tick={{ fill: "#cbd5e0", fontSize: 11 }} angle={-40} textAnchor="end" height={70} />
              <YAxis tick={{ fill: "#cbd5e0" }} domain={[0, 5]} />
              <Tooltip contentStyle={{ backgroundColor: "#1a202c", border: "none" }} />
              <Bar dataKey="value" fill={brand600} radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box bg="dark.card" p={4} borderRadius="xl">
          <Text fontSize="md" fontWeight="bold" mb={3} textAlign="center">Ishsizlik darajasi (%)</Text>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={unemploymentByRegion} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" tick={{ fill: "#cbd5e0", fontSize: 11 }} angle={-40} textAnchor="end" height={70} />
              <YAxis tick={{ fill: "#cbd5e0" }} domain={[3, 5]} />
              <Tooltip contentStyle={{ backgroundColor: "#1a202c", border: "none" }} />
              <Bar dataKey="value" fill={green400} radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>

      {/* Qashqadaryo tumanlari bo‘yicha legallashtiriladigan ish o‘rinlari */}
      <Heading size="lg" mb={4}>Qashqadaryo viloyati – Legallashtiriladigan ish o‘rinlari (tanlangan tumanlar)</Heading>
      <Box bg="dark.card" p={4} borderRadius="xl" mb={6}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={legalJobsDistricts} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="name" tick={{ fill: "#cbd5e0" }} />
            <YAxis tick={{ fill: "#cbd5e0" }} />
            <Tooltip contentStyle={{ backgroundColor: "#1a202c", border: "none" }} />
            <Bar dataKey="jobs" fill={brand600} radius={[8,8,0,0]}>
              {legalJobsDistricts.map((_, idx) => (
                <Cell key={idx} fill={idx === 0 ? brand600 : idx === 1 ? green400 : idx === 2 ? yellow400 : red400} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Text fontSize="xs" color="gray.400" mt={2}>* Qarshi shahri eng ko‘p ish o‘rni, Qamashi tumida eng kam.</Text>
      </Box>

      {/* Xulosa */}
      <Box bg="dark.card" p={5} borderRadius="xl">
        <Flex gap={3} align="center" mb={3}>
          <AlertTriangle size={20} color={yellow400} />
          <Heading size="sm">Asosiy xulosalar</Heading>
        </Flex>
        <Text fontSize="sm" color="gray.300">
          • Mamlakat bo‘yicha <strong>{totalHeavyMahallas}</strong> ta og‘ir mahalla mavjud bo‘lib, ularda <strong>{totalPopulation.toLocaleString()}</strong> nafar aholi yashaydi.<br/>
          • Kambag‘al oilalar soni <strong>{totalPoorFamilies.toLocaleString()}</strong> tani tashkil etadi. Eng yuqori kambag‘allik Qashqadaryo (3.3%) va Qoraqalpog‘istonda (3.2%), eng pasti Toshkent shahrida (1.7%).<br/>
          • Ishsizlik darajasi eng yuqori Qashqadaryo, Surxondaryo va boshqa bir qator viloyatlarda (4.6%), eng past Toshkent shahri (3.8%) va Navoiyda (3.9%).<br/>
          • Legallashtiriladigan ish o‘rinlari rejasi 1 millionni tashkil etadi, Qashqadaryo viloyatida esa 77,737 ta ish o‘rni rejalashtirilgan.
        </Text>
      </Box>
    </Box>
  );
};

export default Reports;