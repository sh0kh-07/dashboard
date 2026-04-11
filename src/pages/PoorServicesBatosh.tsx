import React from "react";
import {
  Box, Text, Heading, Flex, useToken, SimpleGrid, Stat, StatLabel,
  StatNumber, StatHelpText, HStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Briefcase, TrendingUp, Users, Building,
  Landmark, Home, BookOpen, Camera
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";

// ------------------------------
// BATOSH MAHALLASI – KAMBAG'AL OILALARNI QAMRAB OLISH 2026
// ------------------------------
const totalFamilies = 186;          
const plannedFamilies = 186;             
const reachedFamilies = 45;            

const agencies = [
  { name: "Doimiy ish oʻrni", jobs: 60, icon: Building, color: "#3182CE" },
  { name: "Tadbirkorlik", jobs: 55, icon: Landmark, color: "#38A169" },
  { name: "Daromadni oshirish", jobs: 35, icon: TrendingUp, color: "#DD6B20" },
  { name: "Legalizatsiya", jobs: 25, icon: BookOpen, color: "#805AD5" },
  { name: "Kasb-hunar", jobs: 11, icon: Users, color: "#D53F8C" },
];

const districtComparison = [
  { name: "Batosh", jobs: 186 },
  { name: "Qat", jobs: 149 },
  { name: "Ishonch", jobs: 134 },
  { name: "Cho'lquvar", jobs: 126 },
];

const agencyChartData = agencies.map(a => ({ name: a.name, jobs: a.jobs }));

const PoorServicesBatosh = () => {
  const [brand600, green400, yellow400] = useToken("colors", ["brand.600", "green.500", "yellow.500"]);
  const navigate = useNavigate();

  const coveragePercent = Math.round((reachedFamilies / plannedFamilies) * 100);

  return (
    <Box minH="100vh">
      <Flex direction="column" gap={4}>
        <Flex alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="xl" color="gray.800">Batosh mahallasi – Kambagʻal oilalarni ularning daromadini oshirishga qaratilgan xizmatlar bilan qamrab olish</Heading>
            <Text fontSize="md" color="brand.300" mt={1}>Qarshi shahri, 2026-yil maqsadi</Text>
          </Box>
          <Flex align="center" gap={2}>
            <Text color="gray.600">Jami qamrov maqsadi:</Text>
            <Text fontSize="3xl" fontWeight="bold" color={brand600}>{totalFamilies}</Text>
          </Flex>
        </Flex>

        <Text color="gray.600" mb={2}>
          Mahalla darajasida kambag'al oilalar va xavf guruhidagi oilalarga daromadni oshirishga qaratilgan xizmatlar taqdim etish.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl" boxShadow="md">
            <HStack spacing={3} mb={2}>
              <Briefcase size={28} color={brand600} />
              <StatLabel fontSize="lg" color="gray.600">Jami qamrab olinadigan oilalar</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color={brand600}>{totalFamilies}</StatNumber>
            <StatHelpText>2026-yil rejasi</StatHelpText>
            <Text fontSize="sm" color="gray.600" mt={2}>Barqaror ish, tadbirkorlik va boshqa omillar orqali.</Text>
          </Stat>

          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl" boxShadow="md">
            <HStack spacing={3} mb={2}>
              <TrendingUp size={28} color={green400} />
              <StatLabel fontSize="lg" color="gray.600">Joriy holat</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color={green400}>{reachedFamilies}</StatNumber>
            <StatHelpText>bajarilgan qismi ({coveragePercent}%)</StatHelpText>
            <Text fontSize="sm" color="gray.600" mt={2}>Ayni paytda {reachedFamilies} oila xizmatlar bilan qamrab olindi.</Text>
          </Stat>
        </SimpleGrid>

        <Heading size="lg" mb={4} color="gray.800">Yo'nalishlar bo'yicha qamrov</Heading>
        <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={agencyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 12 }} angle={-30} textAnchor="end" height={70} />
              <YAxis tick={{ fill: "#4a5568" }} />
              <Tooltip />
              <Legend wrapperStyle={{ color: "#1a202c" }} />
              <Bar dataKey="jobs" fill={brand600} radius={[8, 8, 0, 0]}>
                {agencyChartData.map((_, idx) => <Cell key={idx} fill={agencies[idx].color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Heading size="lg" mb={4} color="gray.800">Boshqa mahallalar bilan solishtirma (Toptagilar)</Heading>
        <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={districtComparison} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#4a5568" }} />
              <YAxis tick={{ fill: "#4a5568" }} />
              <Tooltip />
              <Bar dataKey="jobs" fill={brand600} radius={[8, 8, 0, 0]}>
                <Cell fill={brand600} />
                <Cell fill="#3182CE" />
                <Cell fill="#DD6B20" />
                <Cell fill="#C53030" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    </Box>
  );
};

export default PoorServicesBatosh;
