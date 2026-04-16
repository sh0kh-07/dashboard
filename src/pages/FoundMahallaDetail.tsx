// src/pages/FoundMahallaDetail.tsx
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
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  DollarSign,
  FileText,
  XCircle,
  ArrowRight,
  Lock,
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

// --- Данные для Jamgʻarma (Found) Batosh ---
// Целевая сумма Batosh для направления "Davlat va maqsadli jamg‘armalar" (млрд сум)
// Рассчитана из FoundMahalla: ~4.68 млрд сум
const targetBatoshBudget = 4.68; // млрд сум

// Базовые контракты (социальная тематика)
const contractsRaw = [
  {
    id: 3,
    name: "Yoshlar tadbirkorlik markazini tashkil etish",
    type: "Yoshlar loyihalari",
    amount: 2.81,
    date: "2025-02-10",
    status: "Bajarilmoqda",
    checkPassed: true,
    failedStages: [2],
  },
  {
    id: 4,
    name: "Ayollar hunarmandchilik kurslari",
    type: "Ayollar loyihalari",
    amount: 1.87,
    date: "2025-01-15",
    status: "Bajarildi",
    checkPassed: true,
    failedStages: [],
  },
  {
    id: 32,
    name: "Nogironlar uchun reabilitatsiya markazi",
    type: "Ijtimoiy himoya",
    amount: 0.95,
    date: "2025-03-01",
    status: "Bajarildi",
    checkPassed: true,
    failedStages: [],
  },
  {
    id: 43,
    name: "Yosh tadbirkorlarga grant",
    type: "Yoshlar loyihalari",
    amount: 1.23,
    date: "2025-02-20",
    status: "Bajarilmoqda",
    checkPassed: false,
    failedStages: [5],
  },
  {
    id: 5,
    name: "Hunarmandchilik ko‘rgazmasi",
    type: "Ayollar loyihalari",
    amount: 0.67,
    date: "2025-03-10",
    status: "Tugatilgan",
    checkPassed: true,
    failedStages: [],
  },
  {
    id: 6,
    name: "Ijtimoiy oshxona",
    type: "Ijtimoiy himoya",
    amount: 1.56,
    date: "2025-01-28",
    status: "Bajarildi",
    checkPassed: false,
    failedStages: [8],
  },
  {
    id: 7,
    name: "Yoshlar inkubatori",
    type: "Yoshlar loyihalari",
    amount: 2.12,
    date: "2025-02-25",
    status: "Rejalashtirilgan",
    checkPassed: true,
    failedStages: [],
  },
];

// Считаем эталонную сумму
const rawTotal = contractsRaw.reduce((sum, c) => sum + c.amount, 0);
const scaleFactor = targetBatoshBudget / rawTotal; // ~0.387

// Масштабируем контракты
const contracts = contractsRaw.map(c => ({
  ...c,
  amount: +(c.amount * scaleFactor).toFixed(2)
}));

const uniqueTypes = [...new Set(contracts.map(c => c.type))];

const FoundMahallaDetail = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredContracts = contracts.filter(
    c => selectedType === "all" || c.type === selectedType
  );

  const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);
  const totalContracts = contracts.length;
  const failedContracts = contracts.filter(c => !c.checkPassed).length;

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

  const handleRowClick = (contractId: number) => {
    // Только контракты с id 1 и 2 кликабельны
    if (contractId === 3 || contractId === 4) {
      navigate(`/kashkadarya/mahalla/batosh/contract/${contractId}`);
    }
  };

  const isClickable = (id: number) => id === 3 || id === 4;

  return (
    <Box minH="100vh">
      <Box mx="auto">
        <Flex alignItems="baseline" justifyContent="space-between" mb={6}>
          <Box>
            <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
              Batosh mahallasi – Jamgʻarma kontraktlari
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Tomorqa yer egalariga yengil konstruksiyali issiqxonalar o‘rnatish uchun
            </Text>
            <Text fontSize="md" color="brand.300" mt={1}>
              Qarshi shahri, ijtimoiy va yoshlar loyihalari
            </Text>
          </Box>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat bg="white" p={5} borderRadius="xl" boxShadow="lg">
            <Flex align="center" gap={2}>
              <Icon as={DollarSign} boxSize={5} color={brand600} />
              <StatLabel fontSize="lg" color="gray.600">Umumiy summa</StatLabel>
            </Flex>
            <StatNumber fontSize="3xl" fontWeight="bold" color={brand600}>
              {totalAmount.toFixed(2)} mlrd so‘m
            </StatNumber>
            <StatHelpText color="gray.600">barcha kontraktlar</StatHelpText>
          </Stat>

          <Stat bg="white" p={5} borderRadius="xl" boxShadow="lg">
            <Flex align="center" gap={2}>
              <Icon as={FileText} boxSize={5} color={brand600} />
              <StatLabel fontSize="lg" color="gray.600">Jami kontraktlar</StatLabel>
            </Flex>
            <StatNumber fontSize="3xl" fontWeight="bold" color={brand600}>
              {totalContracts}
            </StatNumber>
            <StatHelpText color="gray.600">ta loyiha</StatHelpText>
          </Stat>

          <Stat bg="white" p={5} borderRadius="xl" boxShadow="lg">
            <Flex align="center" gap={2}>
              <Icon as={XCircle} boxSize={5} color="red.400" />
              <StatLabel fontSize="lg" color="gray.600">Rad etilgan kontraktlar</StatLabel>
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
                  label={{ value: "mlrd so‘m", position: "insideBottom", offset: -5, fill: "#4a5568" }}
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
                    const item = chartData.find(d => d.name === label);
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
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
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
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </HStack>

        <TableContainer bg="white" borderRadius="xl" overflow="hidden" boxShadow="lg">
          <Table variant="unstyled">
            <Thead bg="gray.50" color="gray.700">
              <Tr>
                <Th color="gray.600">Kontrakt nomi</Th>
                <Th color="gray.600">Turi</Th>
                <Th color="gray.600" textAlign="right">Summa (mlrd so‘m)</Th>
                <Th color="gray.600">Holati</Th>
                <Th color="gray.600">Tekshiruv</Th>
                <Th color="gray.600" textAlign="center">Harakat</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredContracts.map(contract => {
                const clickable = isClickable(contract.id);
                return (
                  <Tr
                    key={contract.id}
                    _hover={{ bg: clickable ? "gray.50" : "gray.100" }}
                    cursor={clickable ? "pointer" : "default"}
                    onClick={() => clickable && handleRowClick(contract.id)}
                  >
                    <Td fontWeight="medium" color="gray.800">{contract.name}</Td>
                    <Td color="gray.600">{contract.type}</Td>
                    <Td textAlign="right" fontWeight="semibold" color={brand600}>{contract.amount}</Td>
                    <Td color="gray.800">
                      <Badge
                        colorScheme={
                          contract.status === "Bajarildi" ? "green" :
                            contract.status === "Bajarilmoqda" ? "blue" :
                              contract.status === "Rejalashtirilgan" ? "orange" : "purple"
                        }
                      >
                        {contract.status}
                      </Badge>
                    </Td>
                    <Td color="gray.800">
                      {!contract.checkPassed ? (
                        <HStack spacing={1}>
                          <AlertTriangle size={16} color="#e53e3e" />
                          <Text fontSize="xs" color="red.400">Rad etilgan</Text>
                        </HStack>
                      ) : (
                        <HStack spacing={1}>
                          <CheckCircle size={16} color="#38a169" />
                          <Text fontSize="xs" color="green.400">Tasdiqlangan</Text>
                        </HStack>
                      )}
                    </Td>
                    <Td textAlign="center" color="gray.800">
                      {clickable ? (
                        <IconButton
                          aria-label="Batafsil"
                          icon={<ArrowRight size={16} />}
                          size="xs"
                          variant="ghost"
                          color={brand600}
                          _hover={{ bg: "rgba(49,130,206,0.2)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(contract.id);
                          }}
                        />
                      ) : (
                        <IconButton
                          aria-label="Yopiq"
                          icon={<Lock size={14} />}
                          size="xs"
                          variant="ghost"
                          color="gray.600"
                          isDisabled
                          _hover={{}}
                        />
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <Text fontSize="xs" mt={4} color="gray.600" textAlign="left">
          * Rad etilgan kontraktlar 10 bosqichli tekshiruvdan o‘tmagan. Faqat birinchi ikkita kontrakt (id 1 va 2) uchun batafsil maʼlumot mavjud.
        </Text>
      </Box>
    </Box>
  );
};

export default FoundMahallaDetail;