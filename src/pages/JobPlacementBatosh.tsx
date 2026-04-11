import React from "react";
import {
  Box, Text, Heading, Flex, useToken, SimpleGrid, Stat, StatLabel,
  StatNumber, StatHelpText, HStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Briefcase, TrendingUp, Users, Building,
  Landmark, Home, BookOpen,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";

// ------------------------------
// BATOSH MAHALLASI – DOIMIY ISH O'RINLARI 2026
// ------------------------------
const totalLegalJobs = 580;          
const plannedJobs = 580;             
const executedJobs = 120;            

const agencies = [
  { name: "Investitsiya loyihalari", jobs: 80, icon: Landmark, color: "#3182CE" },
  { name: "Xizmat/Servis", jobs: 140, icon: Briefcase, color: "#38A169" },
  { name: "Qishloq xoʻjaligi", jobs: 60, icon: Home, color: "#DD6B20" },
  { name: "Qurilish", jobs: 30, icon: Building, color: "#805AD5" },
  { name: "Boʻsh ish oʻrinlari", jobs: 80, icon: Users, color: "#D53F8C" },
  { name: "Moliyaviy koʻmak", jobs: 190, icon: BookOpen, color: "#ED8936" },
];

const districtComparison = [
  { name: "Batosh", jobs: 580 },
  { name: "Qat", jobs: 460 },
  { name: "Ishonch", jobs: 410 },
  { name: "Cho'lquvar", jobs: 390 },
];

const agencyChartData = agencies.map(a => ({ name: a.name, jobs: a.jobs }));

const JobPlacementBatosh = () => {
  const [brand600, green400, yellow400] = useToken("colors", ["brand.600", "green.500", "yellow.500"]);
  const navigate = useNavigate();

  const coveragePercent = Math.round((executedJobs / plannedJobs) * 100);

  return (
    <Box minH="100vh">
      <Flex direction="column" gap={4}>
        <Flex alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="xl" color="gray.800">Batosh mahallasi – Doimiy ish o‘rinlari</Heading>
            <Text fontSize="md" color="brand.300" mt={1}>Qarshi shahri, 2026-yil maqsadi</Text>
          </Box>
          <Flex align="center" gap={2}>
            <Text color="gray.600">Jami maqsad:</Text>
            <Text fontSize="3xl" fontWeight="bold" color={brand600}>{totalLegalJobs}</Text>
          </Flex>
        </Flex>

        <Text color="gray.600" mb={2}>
          Mahalla aholisini doimiy daromad manbai bilan ta'minlash 2026-yil ko'rsatkichlari.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl" boxShadow="md">
            <HStack spacing={3} mb={2}>
              <Briefcase size={28} color={brand600} />
              <StatLabel fontSize="lg" color="gray.600">Jami maqsadli ish o‘rinlari</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color={brand600}>{totalLegalJobs}</StatNumber>
            <StatHelpText>2026-yil rejasi</StatHelpText>
            <Text fontSize="sm" color="gray.600" mt={2}>Aholini ish bilan ta'minlash dasturi doirasida.</Text>
          </Stat>

          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl" boxShadow="md">
            <HStack spacing={3} mb={2}>
              <TrendingUp size={28} color={green400} />
              <StatLabel fontSize="lg" color="gray.600">Joriy holat</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color={green400}>{executedJobs}</StatNumber>
            <StatHelpText>bajarilgan qismi ({coveragePercent}%)</StatHelpText>
            <Text fontSize="sm" color="gray.600" mt={2}>Ayni paytda {executedJobs} nafar fuqaro ishga joylashtirildi.</Text>
          </Stat>
        </SimpleGrid>

        <Heading size="lg" mb={4} color="gray.800">Yo'nalishlar bo'yicha bandlik (joriy yil maqsadlari)</Heading>
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

        <Heading size="lg" mb={4} color="gray.800">Mahallalar bo'yicha tahlil</Heading>
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

export default JobPlacementBatosh;
