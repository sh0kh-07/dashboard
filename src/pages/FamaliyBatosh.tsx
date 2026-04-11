// src/pages/BatoshMahallaDetail.tsx
import React from "react";
import {
  Box, Text, Heading, Flex, useToken, Badge, SimpleGrid, Stat, StatLabel,
  StatNumber, StatHelpText, IconButton, Progress, HStack, VStack, Divider,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Briefcase, TrendingUp, Scale, UserCheck,
  GraduationCap, Users, Home, ArrowRight, DollarSign, Clock, Calendar,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";

// ------------------------------
// BATOSH MAHALLASI MA’LUMOTLARI
// ------------------------------
// Kambag‘al oilalar soni (og‘irlik koeffitsiyentiga asosan)
const totalPoorFamilies = 185;
const coveredByServices = 170;
const riskFamilies = 25;
const newApproachFamilies = 42;

// Xizmatlar bo‘yicha qamrov (mahalladagi real ko‘rsatkichlar)
const services = [
  { name: "Doimiy ish oʻrinlariga joylashtirish", families: 68, icon: Briefcase, color: "#3182CE" },
  { name: "Tadbirkorlikka jalb qilish", families: 52, icon: TrendingUp, color: "#38A169" },
  { name: "Kambagʻal oila daromadini oshirish", families: 28, icon: Scale, color: "#DD6B20" },
  { name: "Norasmiy faoliyatni legallashtirish", families: 12, icon: UserCheck, color: "#805AD5" },
  { name: "Kasb-hunarga oʻrgatish", families: 10, icon: GraduationCap, color: "#D53F8C" },
];

// Mikrokreditlar (ExternalBatosh bilan sinxron)
interface Credit {
  id: number;
  borrowerName: string;
  amount: number;
  purpose: string;
  status: string;
  repaymentProgress: number;
  hasRedFlag: boolean;
}
const credits: Credit[] = [
  {
    id: 9,
    borrowerName: "Olimjon Norqobilov",
    amount: 30.0,
    purpose: "Qurilish materiallari savdosi",
    status: "Kechiktirilgan",
    repaymentProgress: 40,
    hasRedFlag: true,
  },
  {
    id: 8,
    borrowerName: "Feruza Xalilova",
    amount: 5.5,
    purpose: "Onlayn do‘kon ochish",
    status: "Qaytarilgan",
    repaymentProgress: 100,
    hasRedFlag: false,
  },
];

// Grafik uchun ma’lumotlar
const serviceChartData = services.map(s => ({ name: s.name, families: s.families }));
const comparisonChartData = [
  { name: "Kambag‘al oilalar", value: totalPoorFamilies },
  { name: "Xizmat bilan qamrov", value: coveredByServices },
  { name: "Xavf ostidagilar", value: riskFamilies },
];

const BatoshMahallaDetail = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();

  const totalCredits = credits.length;
  const activeCredits = credits.filter(c => c.status === "Faol").length;
  const delayedCredits = credits.filter(c => c.status === "Kechiktirilgan").length;
  const avgRepayment = credits.reduce((s, c) => s + c.repaymentProgress, 0) / totalCredits;

  const handleCreditClick = (id: number) => {
    navigate(`/kashkadarya/mahalla/batosh/contract/${id}`);
  };

  return (
    <Box minH="100vh">
      <Flex direction="column" gap={4}>
        <Flex alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="xl" color="gray.800">Batosh mahallasi – Kambag‘al oilalar monitoringi</Heading>
            <Text fontSize="md" color="brand.300" mt={1}>
              Qarshi shahri, 2025-yil 1-chorak
            </Text>
          </Box>
          <Flex align="center" gap={2}>
            <Text color="gray.600">Jami kambag‘al oilalar:</Text>
            <Text fontSize="3xl" fontWeight="bold" color={brand600}>{totalPoorFamilies}</Text>
          </Flex>
        </Flex>

        <Text color="gray.600" mb={2}>
          Batosh mahallasi Qarshi shahridagi eng yaxshi ko‘rsatkichli hududlardan biri. Kambag‘allikni qisqartirish bo‘yicha faol ishlar olib borilmoqda.
        </Text>

        {/* Statistik kartalar */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
            <HStack><Users size={20} color={brand600} /><StatLabel>Kambag‘al oilalar</StatLabel></HStack>
            <StatNumber>{totalPoorFamilies}</StatNumber>
            <StatHelpText>mahalla bo‘yicha</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
            <HStack><CheckCircle size={20} color={green400} /><StatLabel>Xizmat bilan qamrov</StatLabel></HStack>
            <StatNumber>{coveredByServices}</StatNumber>
            <StatHelpText>({Math.round(coveredByServices/totalPoorFamilies*100)}%)</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
            <HStack><AlertTriangle size={20} color={yellow400} /><StatLabel>Xavf ostidagilar</StatLabel></HStack>
            <StatNumber>{riskFamilies}</StatNumber>
            <StatHelpText>daromadi pasayishi mumkin</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
            <HStack><DollarSign size={20} color={brand600} /><StatLabel>Faol mikrokreditlar</StatLabel></HStack>
            <StatNumber>{activeCredits}</StatNumber>
            <StatHelpText>jami {totalCredits} ta kredit</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Xizmatlar taqsimoti */}
        <Heading size="lg" mb={4} color="gray.800">Kambag‘allikni qisqartirish xizmatlari</Heading>
        <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={serviceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 12 }} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#4a5568" }} label={{ value: "Qamrab olingan oilalar", angle: -90, position: "insideLeft", fill: "#4a5568" }} />
              <Tooltip formatter={(v: number) => v} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="families" fill={brand600} radius={[8,8,0,0]}>
                {serviceChartData.map((_, idx) => <Cell key={idx} fill={services[idx].color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Taqqoslash diagrammasi */}
        <Heading size="lg" mb={4} color="gray.800">Asosiy ko‘rsatkichlar</Heading>
        <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#4a5568" }} />
              <YAxis tick={{ fill: "#4a5568" }} />
              <Tooltip formatter={(v: number) => v} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="value" fill={brand600} radius={[8,8,0,0]}>
                <Cell fill={red400} />
                <Cell fill={brand600} />
                <Cell fill={yellow400} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Mikrokreditlar jadvali */}
        <Heading size="lg" mb={4} color="gray.800">Mikrokreditlar</Heading>
        <TableContainer bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" overflowX="auto" mb={8}>
          <Table variant="unstyled">
            <Thead bg="gray.50" color="gray.700">
              <Tr>
                <Th color="gray.700">Qarz oluvchi</Th><Th color="gray.700">Maqsad</Th><Th isNumeric color="gray.700">Summa (mln so‘m)</Th>
                <Th color="gray.700">Holati</Th><Th color="gray.700">Qaytarilish %</Th><Th color="gray.700">Red flag</Th><Th color="gray.700">Harakat</Th>
              </Tr>
            </Thead>
            <Tbody>
              {credits.map(credit => (
                <Tr key={credit.id} _hover={{ bg: "gray.50" }} cursor="pointer" onClick={() => handleCreditClick(credit.id)}>
                  <Td fontWeight="medium" color="gray.800">{credit.borrowerName}</Td>
                  <Td color="gray.800">{credit.purpose}</Td>
                  <Td isNumeric color="gray.800">{credit.amount.toFixed(1)}</Td>
                  <Td color="gray.800"><Badge colorScheme={credit.status === "Qaytarilgan" ? "green" : "yellow"}>{credit.status}</Badge></Td>
                  <Td color="gray.800"><Progress value={credit.repaymentProgress} size="sm" width="80px" colorScheme={credit.repaymentProgress > 70 ? "green" : "yellow"} borderRadius="full" /> {credit.repaymentProgress}%</Td>
                  <Td color="gray.800">{credit.hasRedFlag ? <AlertTriangle size={16} color="red.400" /> : <CheckCircle size={16} color="green.400" />}</Td>
                  <Td color="gray.800"><IconButton aria-label="Batafsil" icon={<ArrowRight size={16} />} size="xs" variant="ghost" color={brand600} onClick={(e) => { e.stopPropagation(); handleCreditClick(credit.id); }} /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Xulosa */}
        <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl">
          <Flex gap={3} align="center" mb={3}>
            <AlertTriangle size={20} color={yellow400} />
            <Heading size="sm" color="gray.800">Asosiy xulosalar</Heading>
          </Flex>
          <Text fontSize="sm" color="gray.600">
            • Batosh mahallasida <strong>{totalPoorFamilies}</strong> ta kambag‘al oila aniqlangan, ularning <strong>{coveredByServices}</strong> tasi (92%) xizmatlar bilan qamrab olingan.<br/>
            • Eng samarali yo‘nalishlar: doimiy ishga joylashtirish (68 oila) va tadbirkorlik (52 oila).<br/>
            • Xavf ostidagi oilalar soni <strong>{riskFamilies}</strong> ta bo‘lib, ular daromadi pasayishi mumkin bo‘lgan guruh.<br/>
            • Mikrokreditlarning 1 tasi kechikishda (red flag), 1 tasi to‘liq qaytarilgan. Muammoli kreditni qayta tuzish tavsiya etiladi.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default BatoshMahallaDetail;