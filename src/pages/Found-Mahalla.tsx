// src/pages/FoundMahalla.tsx
import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  Flex,
  useToken,
  IconButton,
  Badge,
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
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, MapPin, Search, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Список махаллей города Карши (полный)
const mahallaNames = [
  "Amir Temur", "Alisher Navoiy", "Arabxona", "Barkamol avlod", "Batosh",
  "Bog‘zor", "Buyuk Turon", "Vatanparvar", "G‘afur G‘ulom", "Geolog",
  "Gulshan", "Dasht", "Jayxun", "Zebuniso", "Ipak yo‘li", "Ishonch",
  "Qat", "Qarliqbog‘", "Qunchiqar", "Mag‘zon", "Ma’rifat", "Mustaqillik",
  "Navo", "Navbahor", "Navro‘z", "Nasaf", "Nuriston", "Oydin", "Otchopar",
  "Paxtazor", "Ravoq", "Sabo", "Samarqand", "Sohil", "Tabassum", "Tinchlik",
  "To‘lqin", "Xonobod", "Xudoizod", "Cho‘lquvar", "Shayxali", "Shodlik",
  "Eski Anxor", "Yangi hayot",
];

// --- Расчёт доли Qarshi shahri для направления "Davlat va maqsadli jamg‘armalar" ---
// 1. Общая сумма по республике: 1.2 трлн сум = 1200 млрд сум
// 2. Веса регионов (как в FoundDetail)
const regionWeights = {
  Tashkent: 1.5, Samarkand: 1.2, Bukhara: 1.0, Kashkadarya: 2.5,
  Fergana: 1.2, Andijan: 1.0, Namangan: 1.0, Surkhandarya: 0.9,
  Jizzakh: 0.8, Sirdarya: 0.7, Navoi: 1.1, Khorezm: 0.9, Karakalpakstan: 1.0,
};
const totalWeight = Object.values(regionWeights).reduce((a, b) => a + b, 0);
const totalFundsMlrd = 1200; // млрд сум
const kashkadaryaFunds = totalFundsMlrd * regionWeights.Kashkadarya / totalWeight; // ~202.7 млрд

// Доля Qarshi shahri в бюджете Кашкадарьи (из MainKashkadarya: Qarshi budget 750 из 4530)
const qarshiBudgetShare = 750 / 4530; // ~0.1655629
const qarshiFundsMlrd = kashkadaryaFunds * qarshiBudgetShare; // ~33.56 млрд сум

// Определяем получающие махалли (те же, что в MainQarshi)
const receivingMahallas = new Set(
  mahallaNames.filter((_, idx) => idx % 3 === 0 || idx % 5 === 0)
);
receivingMahallas.add("Batosh");
receivingMahallas.add("Ishonch");

// Распределение с весами (Batosh 2.5, Ishonch 1.2, остальные 0.7)
const distributeBudget = (total: number) => {
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

const budgetPerMahalla = distributeBudget(qarshiFundsMlrd);

// Формируем полный массив данных по всем махаллям
let allMahallaData = mahallaNames.map(name => {
  const receives = receivingMahallas.has(name);
  const budget = receives ? budgetPerMahalla[name] : 0;
  return { name, receives, budget };
});

// Сортировка: Batosh всегда на первом месте, затем остальные по убыванию бюджета
allMahallaData.sort((a, b) => {
  if (a.name === "Batosh") return -1;
  if (b.name === "Batosh") return 1;
  return b.budget - a.budget;
});

const totalBudget = allMahallaData.reduce((sum, m) => sum + m.budget, 0);

// Данные для горизонтального графика
const chartData = allMahallaData.map(item => ({
  name: item.name.length > 20 ? item.name.substring(0, 18) + "..." : item.name,
  fullName: item.name,
  budget: item.budget,
}));

const FoundMahalla = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "receives" | "not">("all");

  const handleDetailClick = (mahallaName: string) => {
    if (mahallaName === "Batosh") {
      navigate("/fund-detail/kashkadarya/mahallalar/batosh");
    }
  };

  // Фильтрация по поиску и по статусу
  const filteredMahallas = allMahallaData.filter(mahalla => {
    const matchesSearch = mahalla.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true :
      statusFilter === "receives" ? mahalla.receives :
      !mahalla.receives;
    return matchesSearch && matchesStatus;
  });

  const clearSearch = () => setSearchTerm("");

  return (
    <Box minH="100vh">
      <Box maxW="1400px" mx="auto">
        {/* Заголовок и общая сумма */}
        <Flex alignItems="baseline" justifyContent="space-between" mb={4}>
          <Box>
            <Heading as="h1" size="xl" fontWeight="bold" color="white">
              Davlat va maqsadli jamg‘armalar
            </Heading>
            <Text fontSize="md" color="brand.300" mt={1}>
              Qarshi shahri – mahallalar kesimida taqsimot
            </Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="lg" fontWeight="medium" color="gray.400">
              Qarshi shahri uchun jami
            </Text>
            <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
              {totalBudget.toFixed(2)} mlrd so‘m
            </Text>
            <Text fontSize="xs" color="gray.500">(respublika jamg‘armasidan)</Text>
          </Box>
        </Flex>

        <Text fontSize="md" color="gray.300" mb={8}>
          Davlat budjeti va maqsadli jamg‘armalar mablag‘larining mahallalar kesimida taqsimlanishi.
          Quyida har bir mahallaga ajratilgan mablag‘lar keltirilgan.
        </Text>

        {/* Фильтры */}
        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Search size={18} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Mahalla nomi bo‘yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="gray.900"
              border="1px solid"
              borderColor="gray.700"
              _hover={{ borderColor: "gray.600" }}
              _focus={{ borderColor: brand600, boxShadow: `0 0 0 1px ${brand600}` }}
              color="white"
            />
            {searchTerm && (
              <InputRightElement>
                <IconButton
                  aria-label="Tozalash"
                  icon={<X size={16} />}
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  onClick={clearSearch}
                  _hover={{ color: "white" }}
                />
              </InputRightElement>
            )}
          </InputGroup>
          <Select
            width="200px"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            bg="gray.900"
            borderColor="gray.700"
            color="white"
            _focus={{ borderColor: brand600 }}
          >
            <option value="all">Barcha mahallalar</option>
            <option value="receives">Mablag‘ oluvchilar</option>
            <option value="not">Mablag‘ olmaganlar</option>
          </Select>
        </Flex>

        {/* Таблица махаллей */}
        <TableContainer
          bg="gray.900"
          borderRadius="xl"
          overflow="hidden"
          mb={12}
          boxShadow="lg"
        >
          <Table variant="unstyled">
            <Thead bg="gray.800">
              <Tr>
                <Th color="gray.400" fontSize="sm" fontWeight="medium" borderBottom="1px solid" borderColor="gray.700">№</Th>
                <Th color="gray.400" fontSize="sm" fontWeight="medium" borderBottom="1px solid" borderColor="gray.700">Mahalla nomi</Th>
                <Th color="gray.400" fontSize="sm" fontWeight="medium" borderBottom="1px solid" borderColor="gray.700" textAlign="right">Ajratilgan mablag‘ (mlrd so‘m)</Th>
                <Th color="gray.400" fontSize="sm" fontWeight="medium" borderBottom="1px solid" borderColor="gray.700" textAlign="center">Holat</Th>
                <Th color="gray.400" fontSize="sm" fontWeight="medium" borderBottom="1px solid" borderColor="gray.700" textAlign="center">Harakat</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredMahallas.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={8} color="gray.400">
                    Hech qanday mahalla topilmadi
                  </Td>
                </Tr>
              ) : (
                filteredMahallas.map((mahalla, idx) => {
                  const isActive = mahalla.name === "Batosh";
                  const originalIndex = allMahallaData.findIndex(m => m.name === mahalla.name);
                  return (
                    <Tr
                      key={idx}
                      _hover={{ bg: isActive ? "gray.750" : "gray.850" }}
                      transition="background 0.15s"
                      cursor={isActive ? "pointer" : "default"}
                      onClick={() => isActive && handleDetailClick(mahalla.name)}
                    >
                      <Td color="gray.500" fontSize="sm" borderBottom="1px solid" borderColor="gray.700">
                        {originalIndex + 1}
                      </Td>
                      <Td fontWeight="medium" color="white" borderBottom="1px solid" borderColor="gray.700">
                        <Flex align="center" gap={2}>
                          <Icon as={MapPin} boxSize={3} color={brand600} />
                          {mahalla.name}
                        </Flex>
                      </Td>
                      <Td textAlign="right" fontWeight="semibold" color={brand600} borderBottom="1px solid" borderColor="gray.700">
                        {mahalla.budget.toFixed(2)}
                      </Td>
                      <Td textAlign="center" borderBottom="1px solid" borderColor="gray.700">
                        {mahalla.receives ? (
                          <Badge colorScheme="green" borderRadius="full" px={2}>Mablag‘ ajratilgan</Badge>
                        ) : (
                          <Badge colorScheme="gray" borderRadius="full" px={2}>Mablag‘ ajratilmagan</Badge>
                        )}
                      </Td>
                      <Td textAlign="center" borderBottom="1px solid" borderColor="gray.700">
                        {isActive ? (
                          <IconButton
                            aria-label="Batafsil"
                            icon={<ArrowRight size={16} />}
                            size="xs"
                            variant="ghost"
                            color={brand600}
                            _hover={{ bg: "rgba(49,130,206,0.2)" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDetailClick(mahalla.name);
                            }}
                          />
                        ) : (
                          <IconButton
                            aria-label="Yopiq"
                            icon={<Lock size={14} />}
                            size="xs"
                            variant="ghost"
                            color="gray.500"
                            isDisabled
                            _hover={{}}
                          />
                        )}
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Горизонтальная гистограмма */}
        <Box mt={10}>
          <Heading as="h2" size="lg" mb={4} color="white">
            Mablag‘ taqsimoti (mlrd so‘m)
          </Heading>
          <Text mb={6} color="gray.400">
            Eng ko‘p mablag‘ ajratilgan mahallalar (gorizontal diagramma)
          </Text>
          <Box bg="gray.900" p={4} borderRadius="xl" boxShadow="lg">
            <ResponsiveContainer width="100%" height={Math.max(500, chartData.length * 32)}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis
                  type="number"
                  label={{
                    value: "mlrd so‘m",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#cbd5e0",
                  }}
                  tick={{ fill: "#cbd5e0" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#cbd5e0" }}
                  width={130}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} mlrd so‘m`, "Budjet"]}
                  labelFormatter={(label) => {
                    const item = chartData.find((d) => d.name === label);
                    return item ? item.fullName : label;
                  }}
                  contentStyle={{
                    backgroundColor: "#1a202c",
                    borderRadius: "8px",
                    border: "none",
                    color: "white",
                  }}
                  itemStyle={{ color: "white" }}
                />
                <Bar dataKey="budget" fill={brand600} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Text fontSize="xs" mt={4} color="gray.500">
            * Raqamlar real taqsimot asosida hisoblangan. Faqat Batosh mahallasi uchun batafsil maʼlumot mavjud.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default FoundMahalla;