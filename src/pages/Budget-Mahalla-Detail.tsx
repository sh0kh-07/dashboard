// src/pages/BatoshContracts.tsx
import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  Flex,
  useToken,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Select,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  DollarSign,
  FileText,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// --- Реальные данные контрактов Batosh (из MainBatosh) ---
const contractsRaw = [
  {
    id: "1",
    name: "Mahalla yo‘llarini asfaltlash",
    type: "Yo‘l qurilishi",
    amount: 63.56,
    date: "15 Yanvar 2025",
    status: "Bajarildi",
    checkPassed: false,
    failedStages: [3, 7],
  },
  {
    id: "2",
    name: "Ko‘cha yoritish tizimini modernizatsiya qilish",
    type: "Yo‘l qurilishi",
    amount: 42.37,
    date: "25 Fevral 2025",
    status: "Bajarilmoqda",
    checkPassed: true,
    failedStages: [],
  },
  {
    id: "1",
    name: "Yoshlar tadbirkorlik markazini tashkil etish",
    type: "Jamgʻarma",
    amount: 2.81,
    date: "15 Mart 2025",
    status: "Bajarildi",
    checkPassed: false,
    failedStages: [2],
  },
  {
    id: "2",
    name: "Ayollar hunarmandchilik kurslari",
    type: "Jamgʻarma",
    amount: 1.87,
    date: "25 Mart 2025",
    status: "Bajarilmoqda",
    checkPassed: true,
    failedStages: [],
  },
  {
    id: "1",
    name: "Kichik biznes uchun imtiyozli kredit",
    type: "Kredit",
    amount: 331.95,
    date: "15 Aprel 2025",
    status: "Bajarildi",
    checkPassed: false,
    failedStages: [1, 9],
  },
  {
    id: "2",
    name: "Startap loyihalarni moliyalashtirish",
    type: "Kredit",
    amount: 221.30,
    date: "25 Aprel 2025",
    status: "Bajarilmoqda",
    checkPassed: true,
    failedStages: [],
  },
  {
    id: "1",
    name: "Quyosh panellarini o‘rnatish",
    type: "Tashqi moliya",
    amount: 237.04,
    date: "15 May 2025",
    status: "Bajarildi",
    checkPassed: true,
    failedStages: [],
  },
  {
    id: "2",
    name: "Energiya samaradorligi loyihasi",
    type: "Tashqi moliya",
    amount: 158.02,
    date: "25 May 2025",
    status: "Bajarilmoqda",
    checkPassed: false,
    failedStages: [4, 6],
  },
];

const targetBatoshTotal = 110;
const scaleFactor = targetBatoshTotal / contractsRaw.reduce((sum, c) => sum + c.amount, 0);

const contracts = contractsRaw.map(c => ({
    ...c,
    amount: +(c.amount * scaleFactor).toFixed(2)
}));

// Уникальные типы для фильтра
const uniqueTypes = [...new Set(contracts.map((c) => c.type))];

const BatoshContracts = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredContracts = contracts.filter(
    (c) => selectedType === "all" || c.type === selectedType
  );

  const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);
  const totalContracts = contracts.length;
  const failedContracts = contracts.filter((c) => !c.checkPassed).length;

  // Группировка по типам для графика
  const typeSummary = contracts.reduce((acc, c) => {
    if (!acc[c.type]) acc[c.type] = 0;
    acc[c.type] += c.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(typeSummary).map(([name, value]) => ({
    name: name.length > 15 ? name.substring(0, 12) + "..." : name,
    fullName: name,
    value,
  }));

  const barColors = [
    brand600,
    "#3182CE",
    "#DD6B20",
    "#38A169",
    "#D53F8C",
    "#805AD5",
    "#00A3C4",
  ];

  const handleRowClick = (contractId: string) => {
    navigate(`/kashkadarya/mahalla/batosh/contract/${contractId}`);
  };

  return (
    <Box minH="100vh">
      <Box mx="auto">
        <Flex alignItems="baseline" justifyContent="space-between" mb={6}>
          <Box>
            <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
              Batosh mahallasi – Kontraktlar
            </Heading>
            <Text fontSize="md" color="brand.300" mt={1}>
              Qarshi shahri, infratuzilma loyihalari
            </Text>
          </Box>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat bg="white" p={5} borderRadius="xl" boxShadow="lg">
            <Flex align="center" gap={2}>
              <Icon as={DollarSign} boxSize={5} color={brand600} />
              <StatLabel fontSize="lg" color="gray.600">
                Umumiy summa
              </StatLabel>
            </Flex>
            <StatNumber fontSize="3xl" fontWeight="bold" color={brand600}>
              {totalAmount.toFixed(2)} mlrd so‘m
            </StatNumber>
            <StatHelpText color="gray.600">barcha kontraktlar</StatHelpText>
          </Stat>

          <Stat bg="white" p={5} borderRadius="xl" boxShadow="lg">
            <Flex align="center" gap={2}>
              <Icon as={FileText} boxSize={5} color={brand600} />
              <StatLabel fontSize="lg" color="gray.600">
                Jami kontraktlar
              </StatLabel>
            </Flex>
            <StatNumber fontSize="3xl" fontWeight="bold" color={brand600}>
              {totalContracts}
            </StatNumber>
            <StatHelpText color="gray.600">ta loyiha</StatHelpText>
          </Stat>

          <Stat bg="white" p={5} borderRadius="xl" boxShadow="lg">
            <Flex align="center" gap={2}>
              <Icon as={XCircle} boxSize={5} color="red.400" />
              <StatLabel fontSize="lg" color="gray.600">
                Rad etilgan kontraktlar
              </StatLabel>
            </Flex>
            <StatNumber fontSize="3xl" fontWeight="bold" color="red.400">
              {failedContracts}
            </StatNumber>
            <StatHelpText color="gray.600">tekshiruvdan o‘tmagan</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4} color="gray.800">
            Summalarning turlar bo‘yicha taqsimoti (mlrd so‘m)
          </Heading>
          <Text mb={6} color="gray.600">
            Har bir turdagi kontraktlar bo‘yicha ajratilgan umumiy mablag‘
          </Text>
          <Box bg="white" p={4} borderRadius="xl" boxShadow="lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, right: 30, left: 130, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  label={{
                    value: "mlrd so‘m",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#4a5568",
                  }}
                  tick={{ fill: "#4a5568" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#4a5568" }}
                  width={120}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} mlrd so‘m`, "Summa"]}
                  labelFormatter={(label) => {
                    const item = chartData.find((d) => d.name === label);
                    return item ? item.fullName : label;
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    color: "#1a202c",
                  }}
                  itemStyle={{ color: "#1a202c" }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[index % barColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <HStack mb={6} spacing={4}>
          <Icon as={Filter} color="gray.600" />
          <Select
            width="280px"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            bg="white"
            borderColor="gray.200"
            color="gray.800"
            _hover={{ borderColor: "gray.600" }}
            _focus={{ borderColor: brand600 }}
          >
            <option value="all">Barcha turlar</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </HStack>

        <TableContainer
          bg="white"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
        >
          <Table variant="unstyled">
            <Thead bg="gray.50" color="gray.700">
              <Tr>
                <Th color="gray.600">Kontrakt nomi</Th>
                <Th color="gray.600">Turi</Th>
                <Th color="gray.600" textAlign="right">
                  Summa (mlrd so‘m)
                </Th>
                <Th color="gray.600">Holati</Th>
                <Th color="gray.600">Tekshiruv</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredContracts.map((contract) => (
                <Tr
                  key={contract.id}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                  onClick={() => handleRowClick(contract.id)}
                >
                  <Td fontWeight="medium" color="gray.800">
                    {contract.name}
                  </Td>
                  <Td color="gray.600">{contract.type}</Td>
                  <Td textAlign="right" fontWeight="semibold" color={brand600}>
                    {contract.amount}
                  </Td>
                  <Td color="gray.800">
                    <Badge
                      colorScheme={
                        contract.status === "Bajarildi"
                          ? "green"
                          : contract.status === "Bajarilmoqda"
                          ? "blue"
                          : "orange"
                      }
                    >
                      {contract.status}
                    </Badge>
                  </Td>
                  <Td color="gray.800">
                    {!contract.checkPassed ? (
                      <HStack spacing={1}>
                        <AlertTriangle size={16} color="#e53e3e" />
                        <Text fontSize="xs" color="red.400">
                          Rad etilgan
                        </Text>
                      </HStack>
                    ) : (
                      <HStack spacing={1}>
                        <CheckCircle size={16} color="#38a169" />
                        <Text fontSize="xs" color="green.400">
                          Tasdiqlangan
                        </Text>
                      </HStack>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Text fontSize="xs" mt={4} color="gray.600" textAlign="left">
          * Rad etilgan kontraktlar 10 bosqichli tekshiruvdan o‘tmagan. Batafsil
          ma’lumot uchun kontrakt ustiga bosing.
        </Text>
      </Box>
    </Box>
  );
};

export default BatoshContracts;