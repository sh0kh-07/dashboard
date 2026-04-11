// src/pages/MainBatosh.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Text, Heading, Flex, useToken, Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Icon, Input, InputGroup,
  InputLeftElement, Select, Badge, SimpleGrid, Stat, StatLabel, StatNumber,
  StatHelpText, HStack,
} from "@chakra-ui/react";
import { Search, Landmark, Wallet, CreditCard, Globe, TrendingUp, Calendar, Building, AlertTriangle, CheckCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// --- Обновлённые суммы для Batosh (из MainQarshi) ---
// Рассчитано: Batosh вес 2.5, всего получателей 22, totalWeight = 17.7
// budget = 750 млрд, funds = 33.12 млрд, credits = 3917 млрд, external = 2797 млрд
const batoshTotals = {
  budget: 105.93,   // млрд сум
  funds: 4.68,      // млрд сум
  credits: 553.25,  // млрд сум
  external: 395.06, // млрд сум (ранее были млн $, теперь млрд сум)
};

// Генерация 2 контрактов на направление с red flag
const generateContracts = (type: string, total: number, unit: string) => {
  const templates: Record<string, { name: string; contractor: string }[]> = {
    budget: [
      { name: "Mahalla yo‘llarini asfaltlash", contractor: "Qarshi Yo‘l Qurilish" },
      { name: "Ko‘cha yoritish tizimini qilish", contractor: "Shaharlar Energo" },
    ],
    funds: [
      { name: "Yoshlar markazini tashkil etish", contractor: "Yoshlar Ittifoqi" },
      { name: "Ayollar hunarmandchilik kurslari", contractor: "Ayollar Qo‘mitasi" },
    ],
    credits: [
      { name: "Kichik biznes uchun imtiyozli kredit", contractor: "Agrobank" },
      { name: "Startap loyihalarni moliyalashtirish", contractor: "Turon Bank" },
    ],
    external: [
      { name: "Quyosh panellarini o‘rnatish", contractor: "Tiklanish jamg‘armasi" },
      { name: "Energiya loyihasi", contractor: "Jahon banki" },
    ],
  };
  const items = templates[type];
  const amounts = [total * 0.6, total * 0.4];
  const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun"];
  const statuses = ["Bajarildi", "Bajarilmoqda"];
  // Red flag: первый контракт – с ошибками, второй – чистый
  const failedStagesList: number[][] = [
    [3, 7],   // первый контракт – red flag
    []        // второй – ok
  ];
  return items.map((item, idx) => ({
    id: `${type}-${idx+1}`,
    name: item.name,
    contractor: item.contractor,
    amount: +amounts[idx].toFixed(2),
    unit,
    date: `${15 + idx*10} ${months[idx]} 2025`,
    status: statuses[idx % statuses.length],
    failedStages: failedStagesList[idx],
    hasRedFlag: failedStagesList[idx].length > 0,
  }));
};

const budgetContracts = generateContracts("budget", batoshTotals.budget, "mlrd so‘m");
const fundsContracts = generateContracts("funds", batoshTotals.funds, "mlrd so‘m");
const creditsContracts = generateContracts("credits", batoshTotals.credits, "mlrd so‘m");
const externalContracts = generateContracts("external", batoshTotals.external, "mlrd so‘m"); // теперь млрд сум

const MainBatosh = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Bajarildi" | "Bajarilmoqda">("all");
  const [redFlagFilter, setRedFlagFilter] = useState<"all" | "red" | "ok">("all");
  const [tabIndex, setTabIndex] = useState(0);

  const getCurrentContracts = () => {
    switch (tabIndex) {
      case 0: return budgetContracts;
      case 1: return fundsContracts;
      case 2: return creditsContracts;
      default: return externalContracts;
    }
  };

  const currentContracts = getCurrentContracts();
  const currentUnit = "mlrd so‘m"; // все направления теперь в млрд сум
  const currentLabel = tabIndex === 0 ? "Davlat byudjeti" : tabIndex === 1 ? "Jamgʻarma" : tabIndex === 2 ? "Kreditlar" : "Tashqi moliya";
  const currentTotal = tabIndex === 0 ? batoshTotals.budget : tabIndex === 1 ? batoshTotals.funds : tabIndex === 2 ? batoshTotals.credits : batoshTotals.external;

  const filteredContracts = currentContracts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.contractor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchRedFlag = redFlagFilter === "all" ? true : (redFlagFilter === "red" ? c.hasRedFlag : !c.hasRedFlag);
    return matchSearch && matchStatus && matchRedFlag;
  });

  const chartData = filteredContracts.map(c => ({
    name: c.name.length > 25 ? c.name.slice(0, 22) + "..." : c.name,
    fullName: c.name,
    value: c.amount,
  }));

  const barColors = [brand600, "#3182CE", "#DD6B20", "#38A169"];

  const summaryCards = [
    { title: "Davlat byudjeti", amount: batoshTotals.budget, unit: "mlrd so‘m", icon: Landmark },
    { title: "Jamgʻarma", amount: batoshTotals.funds, unit: "mlrd so‘m", icon: Wallet },
    { title: "Kreditlar", amount: batoshTotals.credits, unit: "mlrd so‘m", icon: CreditCard },
    { title: "Tashqi moliya", amount: batoshTotals.external, unit: "mlrd so‘m", icon: Globe },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const color = status === "Bajarildi" ? "green" : "blue";
    return <Badge colorScheme={color} borderRadius="full" px={3}>{status}</Badge>;
  };

  const handleRowClick = (id: string) => {
    navigate(`/kashkadarya/qarshi-detail/batosh/contract/${id}`);
  };

  return (
    <Box minH="100vh">
      <Box>
        <Flex align="center" gap={3} mb={6}>
          <Icon as={TrendingUp} boxSize={7} color={brand600} />
          <Heading size="xl" color="gray.800">Batosh mahallasi – kontraktlar</Heading>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {summaryCards.map((card, idx) => (
            <Stat key={idx} bg="white" p={5} borderRadius="xl">
              <Flex align="center" gap={2} mb={2}>
                <Icon as={card.icon} boxSize={5} color={brand600} />
                <StatLabel color="gray.600">{card.title}</StatLabel>
              </Flex>
              <StatNumber fontSize="2xl" color={brand600}>{card.amount.toFixed(2)} {card.unit}</StatNumber>
              <StatHelpText color="gray.600">Batosh uchun jami</StatHelpText>
            </Stat>
          ))}
        </SimpleGrid>

        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6} wrap="wrap">
          <InputGroup maxW="300px">
            <InputLeftElement><Icon as={Search} color="gray.600" /></InputLeftElement>
            <Input placeholder="Qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} bg="white" borderColor="gray.200" color="gray.800" _focus={{ borderColor: brand600 }} />
          </InputGroup>
          <Select width="200px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} bg="white" borderColor="gray.200" color="gray.800">
            <option value="all">Barcha holatlar</option>
            <option value="Bajarildi">Bajarildi</option>
            <option value="Bajarilmoqda">Bajarilmoqda</option>
          </Select>
          <Select width="200px" value={redFlagFilter} onChange={(e) => setRedFlagFilter(e.target.value as any)} bg="white" borderColor="gray.200" color="gray.800">
            <option value="all">Barcha kontraktlar</option>
            <option value="red">Red flag (rad etilgan)</option>
            <option value="ok">Tekshiruvdan o‘tgan</option>
          </Select>
        </Flex>

        <Tabs variant="soft-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex} mb={8}>
          <TabList bg="white" borderRadius="xl" p={2}>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }}><HStack><Icon as={Landmark} /><Text>Davlat byudjeti</Text></HStack></Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }}><HStack><Icon as={Wallet} /><Text>Jamgʻarma</Text></HStack></Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }}><HStack><Icon as={CreditCard} /><Text>Kreditlar</Text></HStack></Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }}><HStack><Icon as={Globe} /><Text>Tashqi moliya</Text></HStack></Tab>
          </TabList>
          <TabPanels mt={6}>
            {[0,1,2,3].map(idx => {
              const contractsArr = idx===0 ? budgetContracts : idx===1 ? fundsContracts : idx===2 ? creditsContracts : externalContracts;
              const filtered = contractsArr.filter(c => {
                const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.contractor.toLowerCase().includes(searchTerm.toLowerCase());
                const matchStatus = statusFilter === "all" || c.status === statusFilter;
                const matchRed = redFlagFilter === "all" ? true : (redFlagFilter === "red" ? c.hasRedFlag : !c.hasRedFlag);
                return matchSearch && matchStatus && matchRed;
              });
              const chartLocal = filtered.map(c => ({ name: c.name.length>25?c.name.slice(0,22)+"...":c.name, fullName: c.name, value: c.amount }));
              return (
                <TabPanel key={idx} p={0}>
                  <TableContainer bg="white" borderRadius="xl" mb={8}>
                    <Table variant="unstyled">
                      <Thead bg="gray.50" color="gray.700">
                        <Tr>
                          <Th color="gray.700">Kontrakt nomi</Th>
                          <Th color="gray.700">Podryadchi</Th>
                          <Th textAlign="right" color="gray.700">Summa ({currentUnit})</Th>
                          <Th color="gray.700">Sana</Th>
                          <Th textAlign="center" color="gray.700">Holati</Th>
                          <Th textAlign="center" color="gray.700">10 bosqich</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filtered.map(contract => (
                          <Tr key={contract.id} _hover={{ bg: "gray.50", cursor: "pointer" }} onClick={() => handleRowClick(contract.id)}>
                            <Td color="gray.800">{contract.name}</Td>
                            <Td color="gray.600"><Icon as={Building} size={14} /> {contract.contractor}</Td>
                            <Td textAlign="right" fontWeight="bold" color={brand600}>{contract.amount}</Td>
                            <Td color="gray.600"><Icon as={Calendar} size={14} /> {contract.date}</Td>
                            <Td textAlign="center" color="gray.800"><StatusBadge status={contract.status} /></Td>
                            <Td textAlign="center" color="gray.800">
                              {contract.hasRedFlag ? (
                                <HStack justify="center" spacing={1}>
                                  <Icon as={AlertTriangle} color="red.500" boxSize={4} />
                                  <Text fontSize="xs" color="red.400">Rad etilgan</Text>
                                </HStack>
                              ) : (
                                <HStack justify="center" spacing={1}>
                                  <Icon as={CheckCircle} color="green.500" boxSize={4} />
                                  <Text fontSize="xs" color="green.400">Tasdiqlangan</Text>
                                </HStack>
                              )}
                            </Td>
                          </Tr>
                        ))}
                        {filtered.length === 0 && <Tr><Td colSpan={6} textAlign="center" py={8} color="gray.600">Kontrakt topilmadi</Td></Tr>}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Box bg="white" p={4} borderRadius="xl">
                    <Heading size="md" mb={2} color="gray.800">Kontrakt summalari taqsimoti ({currentUnit})</Heading>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart layout="vertical" data={chartLocal} margin={{ left: 150 }}>
                        <CartesianGrid stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fill: "#4a5568" }} />
                        <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#4a5568", fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#1a202c" }} />
                        <Bar dataKey="value" fill={brand600} radius={[0,8,8,0]}>
                          {chartLocal.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default MainBatosh;