// src/pages/MainQarshi.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Flex,
  useToken,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
} from "@chakra-ui/react";
import { Search, Landmark, Wallet, CreditCard, Globe, TrendingUp } from "lucide-react";
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

// Список махаллей города Карши
const mahallaNames = [
  "Alisher Navoiy", "Amir Temur", "Arabxona", "Barkamol avlod", "Batosh",
  "Bog‘zor", "Buyuk Turon", "Vatanparvar", "G‘afur G‘ulom", "Geolog",
  "Gulshan", "Dasht", "Jayxun", "Zebuniso", "Ipak yo‘li", "Ishonch",
  "Qat", "Qarliqbog‘", "Qunchiqar", "Mag‘zon", "Ma’rifat", "Mustaqillik",
  "Navo", "Navbahor", "Navro‘z", "Nasaf", "Nuriston", "Oydin", "Otchopar",
  "Paxtazor", "Ravoq", "Sabo", "Samarqand", "Sohil", "Tabassum", "Tinchlik",
  "To‘lqin", "Xonobod", "Xudoizod", "Cho‘lquvar", "Shayxali", "Shodlik",
  "Eski Anxor", "Yangi hayot",
];

// --- Обновлённые суммы для Qarshi shahri (из MainKashkadarya с реальными цифрами) ---
// Вес Qarshi shahri в Davlat byudjeti = 750 / 4530 ≈ 0.1656
const qarshiBudget = {
  budget: 750.0,      // млрд сум (Davlat byudjeti)
  funds: 33.12,       // млрд сум (Jamgʻarma)
  credits: 3917.0,    // млрд сум (Kreditlar)
  external: 2797.0,   // млрд сум (Tashqi moliya) – теперь в млрд сум, не в долларах
};

// Определим, какие махалли получают финансирование: добавим Ishonch и Batosh обязательно
const baseReceiving = new Set(
  mahallaNames.filter((_, idx) => idx % 3 === 0 || idx % 5 === 0)
);
baseReceiving.add("Batosh");
baseReceiving.add("Ishonch");
const receivingMahallas = baseReceiving;

// Функция распределения с весами (Batosh – много, Ishonch – средне, остальные – меньше)
const distributeWithWeights = (total: number) => {
  const receivingList = Array.from(receivingMahallas);
  const weights: Record<string, number> = {};
  receivingList.forEach(name => {
    if (name === "Batosh") weights[name] = 2.5;
    else if (name === "Ishonch") weights[name] = 1.2;
    else weights[name] = 0.7;
  });
  const totalWeight = receivingList.reduce((sum, name) => sum + weights[name], 0);
  const perUnit = total / totalWeight;
  const result: Record<string, number> = {};
  receivingList.forEach(name => {
    result[name] = +(perUnit * weights[name]).toFixed(2);
  });
  return result;
};

const budgetPerMahalla = distributeWithWeights(qarshiBudget.budget);
const fundsPerMahalla = distributeWithWeights(qarshiBudget.funds);
const creditsPerMahalla = distributeWithWeights(qarshiBudget.credits);
const externalPerMahalla = distributeWithWeights(qarshiBudget.external);

// Формирование полного массива данных по всем махаллям
let allMahallaData = mahallaNames.map(name => {
  const receives = receivingMahallas.has(name);
  const budget = receives ? budgetPerMahalla[name] : 0;
  const funds = receives ? fundsPerMahalla[name] : 0;
  const credits = receives ? creditsPerMahalla[name] : 0;
  const external = receives ? externalPerMahalla[name] : 0;
  const total = budget + funds + credits;
  return {
    name,
    receives,
    budget,
    funds,
    credits,
    external,
    total,
  };
});

// Сортировка: Batosh всегда на первом месте, затем остальные по убыванию total
allMahallaData.sort((a, b) => {
  if (a.name === "Batosh") return -1;
  if (b.name === "Batosh") return 1;
  return b.total - a.total;
});

const MainQarshi = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "receives" | "not">("all");
  const [tabIndex, setTabIndex] = useState(0);

  const filteredData = allMahallaData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : statusFilter === "receives" ? item.receives : !item.receives;
    return matchesSearch && matchesStatus;
  });

  const getValue = (item: any) => {
    switch (tabIndex) {
      case 0: return item.budget;
      case 1: return item.funds;
      case 2: return item.credits;
      default: return item.external;
    }
  };

  const getUnit = () => {
    switch (tabIndex) {
      case 0: return "mlrd so‘m";
      case 1: return "mlrd so‘m";
      case 2: return "mlrd so‘m";
      default: return "mlrd so‘m"; // внешний тоже в млрд сум
    }
  };

  const getLabel = () => {
    switch (tabIndex) {
      case 0: return "Davlat byudjeti";
      case 1: return "Jamgʻarma";
      case 2: return "Kreditlar";
      default: return "Tashqi moliya";
    }
  };

  const chartData = filteredData.map(item => ({
    name: item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name,
    fullName: item.name,
    value: getValue(item),
  }));

  const barColors = [brand600, "#3182CE", "#DD6B20", "#38A169", "#D53F8C", "#805AD5", "#00A3C4", "#C53030", "#2C7A7B", "#6B46C1", "#E53E3E", "#319795", "#D69E2E"];

  const summaryCards = [
    { title: "Davlat byudjeti", amount: qarshiBudget.budget, unit: "mlrd so‘m", icon: Landmark, color: brand600 },
    { title: "Jamgʻarma", amount: qarshiBudget.funds, unit: "mlrd so‘m", icon: Wallet, color: brand600 },
    { title: "Kreditlar", amount: qarshiBudget.credits, unit: "mlrd so‘m", icon: CreditCard, color: brand600 },
    { title: "Tashqi moliya", amount: qarshiBudget.external, unit: "mlrd so‘m", icon: Globe, color: brand600 },
  ];

  const handleRowClick = (mahallaName: string) => {
    if (mahallaName === "Batosh") {
      navigate("/kashkadarya/qarshi-detail/batosh");
    }
  };

  return (
    <Box minH="100vh">
      <Box mx="auto">
        <Flex align="center" gap={3} mb={6}>
          <Icon as={TrendingUp} boxSize={7} color={brand600} />
          <Heading size="xl" color="gray.800">Qarshi shahri – mahallalar kesimida taqsimot</Heading>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {summaryCards.map((card, idx) => (
            <Stat key={idx} bg="white" p={5} borderRadius="xl" boxShadow="lg">
              <Flex align="center" gap={2} mb={2}>
                <Icon as={card.icon} boxSize={5} color={card.color} />
                <StatLabel fontSize="lg" color="gray.600">{card.title}</StatLabel>
              </Flex>
              <StatNumber fontSize="2xl" fontWeight="bold" color={card.color}>
                {card.amount.toFixed(2)} {card.unit}
              </StatNumber>
              <StatHelpText color="gray.600">Qarshi shahri uchun jami</StatHelpText>
            </Stat>
          ))}
        </SimpleGrid>

        {/* Фильтры */}
        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6}>
          <InputGroup maxW={{ base: "100%", md: "300px" }}>
            <InputLeftElement pointerEvents="none"><Icon as={Search} color="gray.600" /></InputLeftElement>
            <Input
              placeholder="Mahalla nomi bo‘yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white" borderColor="gray.200" color="gray.800"
              _focus={{ borderColor: brand600 }}
            />
          </InputGroup>
          <Select
            width={{ base: "100%", md: "200px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            bg="white" borderColor="gray.200" color="gray.800"
          >
            <option value="all">Barcha mahallalar</option>
            <option value="receives">Mablag‘ oluvchilar</option>
            <option value="not">Mablag‘ olmaganlar</option>
          </Select>
        </Flex>

        <Tabs variant="soft-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex} mb={8}>
          <TabList bg="white" borderRadius="xl" p={2}>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <HStack><Icon as={Landmark} boxSize={4} /><Text>Davlat byudjeti</Text></HStack>
            </Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <HStack><Icon as={Wallet} boxSize={4} /><Text>Jamgʻarma</Text></HStack>
            </Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <HStack><Icon as={CreditCard} boxSize={4} /><Text>Kreditlar</Text></HStack>
            </Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <HStack><Icon as={Globe} boxSize={4} /><Text>Tashqi moliya</Text></HStack>
            </Tab>
          </TabList>

          <TabPanels mt={6}>
            {[0, 1, 2, 3].map(idx => (
              <TabPanel key={idx} p={0}>
                <TableContainer
                  bg="white"
                  borderRadius="xl"
                  overflowX="auto"
                  mb={8}
                  boxShadow="lg"
                  sx={{ "&::-webkit-scrollbar": { height: "6px" }, "&::-webkit-scrollbar-track": { bg: "gray.700" }, "&::-webkit-scrollbar-thumb": { bg: brand600, borderRadius: "full" } }}
                >
                  <Table variant="unstyled" minWidth="600px">
                    <Thead bg="gray.50" position="sticky" top={0} zIndex={1} color="gray.700">
                      <Tr>
                        <Th color="gray.600" width="200px">Mahalla nomi</Th>
                        <Th color="gray.600" textAlign="right" width="150px">{getLabel()} ({getUnit()})</Th>
                        <Th color="gray.600" textAlign="center" width="120px">Holat</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredData.map((item, idx) => {
                        const value = getValue(item);
                        const isBatosh = item.name === "Batosh";
                        return (
                          <Tr
                            key={idx}
                            _hover={{ bg: "gray.50", cursor: isBatosh ? "pointer" : "default" }}
                            opacity={item.receives ? 1 : 0.6}
                            onClick={() => handleRowClick(item.name)}
                          >
                            <Td color="gray.800" fontWeight={item.receives || isBatosh ? "bold" : "normal"}>{item.name}</Td>
                            <Td textAlign="right" fontWeight="bold" color={brand600}>{value.toFixed(2)}</Td>
                            <Td textAlign="center" color="gray.800">
                              {item.receives ? (
                                <Badge colorScheme="green" borderRadius="full" px={2}>Mablag‘ ajratilgan</Badge>
                              ) : (
                                <Badge colorScheme="gray" borderRadius="full" px={2}>Mablag‘ ajratilmagan</Badge>
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
                      {filteredData.length === 0 && <Tr><Td colSpan={3} textAlign="center" py={8} color="gray.600">Hech qanday mahalla topilmadi</Td></Tr>}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Box bg="white" p={4} borderRadius="xl" boxShadow="lg">
                  <Heading as="h2" size="lg" mb={2} color="gray.800">{getLabel()} – mahallalar kesimida</Heading>
                  <Text mb={6} color="gray.600">{getUnit()} – barcha mahallalar (nol qiymatli mahallalar ham ko‘rsatilgan)</Text>
                  <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 30)}>
                    <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 140, bottom: 20 }}>
                      <CartesianGrid stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fill: "#4a5568" }} label={{ value: getUnit(), position: "insideBottom", offset: -5, fill: "#4a5568" }} />
                      <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: "#4a5568" }} />
                      <Tooltip
                        formatter={(value: number) => `${value} ${getUnit()}`}
                        labelFormatter={(label) => chartData.find(d => d.name === label)?.fullName || label}
                        contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#1a202c" }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {chartData.map((_, index) => <Cell key={index} fill={barColors[index % barColors.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        <Text fontSize="xs" textAlign="center" color="gray.600" mt={6}>
          * Batosh mahallasiga ustunlik berilgan (2.5 baravar ko‘p), Ishonch mahallasi ham qo‘shimcha mablag‘ olgan. Qolgan mahallalar standart ulushga ega.
        </Text>
      </Box>
    </Box>
  );
};

export default MainQarshi;