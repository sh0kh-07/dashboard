import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, useToken, Badge, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Input, InputGroup, InputLeftElement, InputRightElement,
  Select, IconButton, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, MapPin, Search, X, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ------------------------------
// QARSHI SHAHRI MAHALLALARI - DOIMIY ISH O'RINLARI 2026
// ------------------------------
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

const totalLegalJobsInCity = 10517;

const mahallaWeights: Record<string, number> = {
  "Batosh": 2.5, "Ishonch": 1.8, "Amir Temur": 1.5, "Alisher Navoiy": 1.4, "Nasaf": 1.3,
  "Qat": 2.0, "Qarliqbog‘": 1.9, "Cho‘lquvar": 1.7, "Eski Anxor": 1.6, "Yangi hayot": 1.5,
};
const defaultWeight = 1.0;

const totalWeight = mahallaNames.reduce((sum, name) => sum + (mahallaWeights[name] || defaultWeight), 0);
const jobsPerWeight = totalLegalJobsInCity / totalWeight;

interface MahallaJobData {
  name: string;
  legalJobs: number;
  status: "Xavf ostida" | "O‘rtacha" | "Yaxshi";
  willReachTarget: boolean;
}

function generateMahallaData(): MahallaJobData[] {
  const results: MahallaJobData[] = [];
  const goodMahallas = new Set(["Batosh", "Ishonch", "Amir Temur", "Alisher Navoiy", "Nasaf"]);
  const badMahallas = new Set(["Qat", "Qarliqbog‘", "Cho‘lquvar", "Eski Anxor", "Yangi hayot"]);

  for (const name of mahallaNames) {
    const weight = mahallaWeights[name] || defaultWeight;
    let jobs = Math.round(jobsPerWeight * weight);

    const avgJobs = totalLegalJobsInCity / mahallaNames.length;
    let status: "Xavf ostida" | "O‘rtacha" | "Yaxshi";
    if (jobs < avgJobs * 0.8) status = "Xavf ostida";
    else if (jobs > avgJobs * 1.2) status = "Yaxshi";
    else status = "O‘rtacha";

    if (goodMahallas.has(name)) status = "Yaxshi";
    if (badMahallas.has(name)) status = "Xavf ostida";

    const willReachTarget = status !== "Xavf ostida";

    results.push({ name, legalJobs: jobs, status, willReachTarget });
  }
  return results;
}

const mahallaData = generateMahallaData();

const sortedForTable = [...mahallaData].sort((a, b) => {
  if (a.name === "Batosh") return -1;
  if (b.name === "Batosh") return 1;
  const order = { bad: 0, moderate: 1, good: 2 };
  return order[a.status] - order[b.status];
});

const chartData = [...mahallaData]
  .sort((a, b) => {
    const order = { bad: 0, moderate: 1, good: 2 };
    return order[a.status] - order[b.status];
  })
  .map(m => ({
    name: m.name,
    "Doimiy ish o'rin": m.legalJobs,
  }));

const JobPlacementVilDetail = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "bad" | "moderate" | "good">("all");

  const handleDetailClick = (mahallaName: string) => {
    if (mahallaName === "Batosh") {
      navigate("/job-placement/vil/qarshi/batosh");
    }
  };

  const filteredUnsorted = sortedForTable.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMahallas = filteredUnsorted.sort((a, b) => {
    if (a.name === "Batosh") return -1;
    if (b.name === "Batosh") return 1;
    return 0;
  });

  const stats = {
    totalJobs: mahallaData.reduce((s, m) => s + m.legalJobs, 0),
    good: mahallaData.filter(m => m.status === "Yaxshi").length,
    moderate: mahallaData.filter(m => m.status === "O‘rtacha").length,
    bad: mahallaData.filter(m => m.status === "Xavf ostida").length,
  };

  return (
    <Box minH="100vh">
      <Flex direction="column" gap={4}>
        <Flex alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
              Qarshi shahri - Aholini doimiy ish o'rinlariga joylashtirish
            </Heading>
            <Text fontSize="md" color="brand.300" mt={1}>
              2026-yil maqsadli ko'rsatkichlar tahlili
            </Text>
          </Box>
          <Flex alignItems="center" gap={2} textAlign="right">
            <Text fontSize="lg" fontWeight="medium" color="gray.600">
              Shahar bo‘yicha jami:
            </Text>
            <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
              {stats.totalJobs.toLocaleString()} nafar
            </Text>
          </Flex>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={2}>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
            <StatLabel>Yaxshi holat</StatLabel>
            <StatNumber color="green.400">{stats.good}</StatNumber>
            <StatHelpText>Yuqori bandlik</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
            <StatLabel>O‘rtacha holat</StatLabel>
            <StatNumber color="yellow.400">{stats.moderate}</StatNumber>
            <StatHelpText>O‘rtacha ko‘rsatkich</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
            <StatLabel>Xavf ostida</StatLabel>
            <StatNumber color="red.400">{stats.bad}</StatNumber>
            <StatHelpText>Kam bandlik</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6}>
          <InputGroup maxW="400px">
            <InputLeftElement><Search size={18} color="gray.600" /></InputLeftElement>
            <Input placeholder="Mahalla nomi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} bg="white" borderColor="gray.200" color="gray.800" />
            {searchTerm && <InputRightElement><IconButton aria-label="Tozalash" icon={<X size={16} />} size="xs" variant="ghost" color="gray.600" onClick={() => setSearchTerm("")} /></InputRightElement>}
          </InputGroup>
          <Select width="220px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} bg="white" borderColor="gray.200" color="gray.800">
            <option value="all">Barcha holatlar</option>
            <option value="good">Yaxshi (yashil)</option>
            <option value="moderate">O‘rtacha (sariq)</option>
            <option value="bad">Xavf ostida (qizil)</option>
          </Select>
        </Flex>

        <TableContainer bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" mb={10}>
          <Table variant="unstyled">
            <Thead bg="gray.50" color="gray.700">
              <Tr>
                <Th color="gray.700">#</Th><Th color="gray.700">Mahalla</Th>
                <Th isNumeric color="gray.700">Doimiy ish o'rinlari (2026)</Th>
                <Th textAlign="center" color="gray.700">Holat</Th>
                <Th textAlign="center" color="gray.700">Bajarilish prognozi</Th>
                <Th textAlign="center" color="gray.700">Harakat</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredMahallas.map((m, idx) => {
                const isActive = m.name === "Batosh";
                return (
                  <Tr key={idx} bg={isActive ? "blue.50" : "transparent"} _hover={{ bg: isActive ? "blue.100" : "gray.50" }} cursor={isActive ? "pointer" : "default"} onClick={() => isActive && handleDetailClick(m.name)}>
                    <Td color="gray.800">{idx + 1}</Td>
                    <Td color="gray.800"><Flex align="center" gap={2}><MapPin size={14} color={brand600} />{m.name}</Flex></Td>
                    <Td isNumeric fontWeight="bold" color={brand600}>{m.legalJobs}</Td>
                    <Td textAlign="center" color="gray.800"><Badge colorScheme={m.status === "Yaxshi" ? "green" : m.status === "O‘rtacha" ? "yellow" : "red"}>{m.status}</Badge></Td>
                    <Td textAlign="center" color="gray.800">{m.willReachTarget ? <Flex align="center" gap={1} color="green.300" justify="center"><TrendingUp size={14} /><Text fontSize="sm">Bajariladi</Text></Flex> : <Flex align="center" gap={1} color="red.300" justify="center"><TrendingDown size={14} /><Text fontSize="sm">Bajarilmaydi</Text></Flex>}</Td>
                    <Td textAlign="center" color="gray.800">{isActive ? <IconButton aria-label="Batafsil" icon={<ArrowRight size={16} />} size="xs" variant="ghost" color={brand600} onClick={(e) => { e.stopPropagation(); handleDetailClick(m.name); }} /> : <Lock size={14} color="gray" />}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <Box mt={6}>
          <Heading size="lg" mb={4} color="gray.800">Mahallalar kesimida doimiy bandlik (nafar)</Heading>
          <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" overflowX="auto">
            <ResponsiveContainer width="100%" height={Math.max(500, chartData.length * 35)}>
              <BarChart layout="vertical" data={chartData} margin={{ left: 140 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: "#4a5568" }} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fill: "#4a5568" }} interval={0} />
                <Tooltip />
                <Bar dataKey="Doimiy ish o'rin" fill={brand600} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default JobPlacementVilDetail;
