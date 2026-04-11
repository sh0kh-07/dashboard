// src/pages/FamaliyVilDetail.tsx – Qarshi shahri mahallalarida kambag‘al oilalar monitoringi
import React, { useState } from "react";
import {
    Box, Text, Heading, Flex, useToken, Badge, Table, Thead, Tbody, Tr, Th, Td,
    TableContainer, Input, InputGroup, InputLeftElement, InputRightElement,
    Select, IconButton, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, MapPin, Search, X, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ------------------------------
// QARSHI SHAHRI MAHALLALARI
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

// Qarshi shahri bo‘yicha jami kambag‘al oilalar (viloyat tahlilidan olingan)
const totalPoorFamiliesInCity = 3217; // 3217 ta oila

// Har bir mahallaning og‘irlik koeffitsiyenti (aholi zichligi va kambag‘allik ehtimoli)
const mahallaWeights: Record<string, number> = {
    "Batosh": 2.5, "Ishonch": 1.8, "Amir Temur": 1.5, "Alisher Navoiy": 1.4, "Nasaf": 1.3,
    "Qat": 2.0, "Qarliqbog‘": 1.9, "Cho‘lquvar": 1.7, "Eski Anxor": 1.6, "Yangi hayot": 1.5,
    // qolganlariga o‘rtacha 1.0
};
const defaultWeight = 1.0;

// Umumiy og‘irlikni hisoblash
const totalWeight = mahallaNames.reduce((sum, name) => sum + (mahallaWeights[name] || defaultWeight), 0);
const familiesPerWeight = totalPoorFamiliesInCity / totalWeight;

// Har bir mahalla uchun kambag‘al oilalar sonini hisoblash
interface MahallaFamilyData {
    name: string;
    poorFamilies: number;
    coveredByServices: number;   // xizmatlar bilan qamrab olingan oilalar (odatda 80-100%)
    riskFamilies: number;        // xavf ostidagi oilalar (daromadi pasayishi mumkin)
    status: "bad" | "moderate" | "good";
    willReachTarget: boolean;    // yil oxirigacha yaxshilanish prognozi
}

function generateMahallaData(): MahallaFamilyData[] {
    const results: MahallaFamilyData[] = [];
    // Yaxshi va yomon mahallalar (oilalar soni ko‘p yoki kamligi)
    const goodMahallas = new Set(["Batosh", "Ishonch", "Amir Temur", "Alisher Navoiy", "Nasaf"]);
    const badMahallas = new Set(["Qat", "Qarliqbog‘", "Cho‘lquvar", "Eski Anxor", "Yangi hayot"]);

    for (const name of mahallaNames) {
        const weight = mahallaWeights[name] || defaultWeight;
        let families = Math.round(familiesPerWeight * weight);
        // Oilalar soni 30 dan 150 gacha bo‘lsin (realistik)
        families = Math.min(180, Math.max(20, families));
        
        // Xizmatlar bilan qamrov (odatda yuqori)
        let covered = Math.round(families * (0.85 + Math.random() * 0.1));
        covered = Math.min(families, covered);
        
        // Xavf ostidagi oilalar (daromadi pasayishi mumkin)
        let risk = Math.round(families * (0.1 + Math.random() * 0.2));
        risk = Math.min(families, risk);
        
        // Holat: agar oilalar soni o‘rtachadan 20% ko‘p bo‘lsa "bad", kam bo‘lsa "good"
        const avgFamilies = totalPoorFamiliesInCity / mahallaNames.length; // ~73
        let status: "bad" | "moderate" | "good";
        if (families > avgFamilies * 1.2) status = "bad";
        else if (families < avgFamilies * 0.8) status = "good";
        else status = "moderate";
        
        // Agar mahalla "good" ro‘yxatida bo‘lsa, statusni yaxshilab qo‘yamiz
        if (goodMahallas.has(name)) status = "good";
        if (badMahallas.has(name)) status = "bad";
        
        // Prognoz: yomon mahallalar yaxshilanish ehtimoli past
        const willReachTarget = status !== "bad";
        
        results.push({
            name,
            poorFamilies: families,
            coveredByServices: covered,
            riskFamilies: risk,
            status,
            willReachTarget,
        });
    }
    return results;
}

const mahallaData = generateMahallaData();

// Jadval uchun tartiblash: Batosh birinchi, qolganlari holat bo‘yicha (yomon -> o‘rtacha -> yaxshi)
const sortedForTable = [...mahallaData].sort((a, b) => {
    if (a.name === "Batosh") return -1;
    if (b.name === "Batosh") return 1;
    const order = { bad: 0, moderate: 1, good: 2 };
    return order[a.status] - order[b.status];
});

// Grafik uchun ma’lumotlar (eng yomon holatdan eng yaxshiga)
const chartData = [...mahallaData]
    .sort((a, b) => {
        const order = { bad: 0, moderate: 1, good: 2 };
        return order[a.status] - order[b.status];
    })
    .map(m => ({
        name: m.name,
        "Kambag‘al oilalar": m.poorFamilies,
        "Xizmat bilan qamrov": m.coveredByServices,
        "Xavf ostidagilar": m.riskFamilies,
    }));

// Maksimal qiymat (grafik o‘qi uchun)
const maxFamilies = Math.max(...chartData.flatMap(d => [d["Kambag‘al oilalar"], d["Xizmat bilan qamrov"], d["Xavf ostidagilar"]])) + 20;

// ------------------------------
// ASOSIY KOMPONENT
// ------------------------------
const FamaliyVilDetail = () => {
    const [brand600, red400, yellow400, green400] = useToken("colors", [
        "brand.600", "red.500", "yellow.500", "green.500",
    ]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "bad" | "moderate" | "good">("all");

    const handleDetailClick = (mahallaName: string) => {
        if (mahallaName === "Batosh") {
            navigate("/family/vil/qarshi/batosh");
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

    const clearSearch = () => setSearchTerm("");

    const stats = {
        totalPoor: mahallaData.reduce((s, m) => s + m.poorFamilies, 0),
        totalCovered: mahallaData.reduce((s, m) => s + m.coveredByServices, 0),
        totalRisk: mahallaData.reduce((s, m) => s + m.riskFamilies, 0),
        good: mahallaData.filter(m => m.status === "good").length,
        moderate: mahallaData.filter(m => m.status === "moderate").length,
        bad: mahallaData.filter(m => m.status === "bad").length,
    };

    return (
        <Box minH="100vh">
            <Flex direction="column" gap={4}>
                <Flex alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={4}>
                    <Box>
                        <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
                            Qarshi shahri mahallalarida kambag‘al oilalar monitoringi
                        </Heading>
                        <Text fontSize="md" color="brand.300" mt={1}>
                            Har bir mahalladagi kambag‘al oilalar soni, xizmatlar bilan qamrov va xavf darajasi
                        </Text>
                    </Box>
                    <Flex alignItems="center" gap={2} textAlign="right">
                        <Text fontSize="lg" fontWeight="medium" color="gray.600">
                            Shahar bo‘yicha jami kambag‘al oilalar
                        </Text>
                        <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                            {stats.totalPoor}
                        </Text>
                    </Flex>
                </Flex>

                <Text color="gray.600">
                    Ranglar: <strong style={{ color: green400 }}>Yashil</strong> — kam oila (yaxshi),{" "}
                    <strong style={{ color: yellow400 }}>Sariq</strong> — o‘rtacha,{" "}
                    <strong style={{ color: red400 }}>Qizil</strong> — ko‘p oila (xavf yuqori).
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={2}>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Yaxshi holatdagi mahallalar</StatLabel>
                        <StatNumber color="green.400">{stats.good}</StatNumber>
                        <StatHelpText>Kam kambag‘al oila</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>O‘rtacha holat</StatLabel>
                        <StatNumber color="yellow.400">{stats.moderate}</StatNumber>
                        <StatHelpText>O‘rtacha ko‘rsatkich</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Xavf ostidagi mahallalar</StatLabel>
                        <StatNumber color="red.400">{stats.bad}</StatNumber>
                        <StatHelpText>Ko‘p kambag‘al oila</StatHelpText>
                    </Stat>
                </SimpleGrid>

                {/* Tushuntirish bloki */}
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mb={2}>
                    <Heading size="sm" mb={2} color="gray.800">📊 Ma’lumotlar qanday hisoblandi?</Heading>
                    <Text fontSize="sm" color="gray.600">
                        • <strong>Kambag‘al oilalar</strong> – mahalladagi jami kam ta’minlangan oilalar soni.<br />
                        • <strong>Xizmat bilan qamrov</strong> – bandlik, tadbirkorlik, ta’lim va ijtimoiy yordam bilan qamrab olingan oilalar.<br />
                        • <strong>Xavf ostidagilar</strong> – daromadi pasayish ehtimoli yuqori bo‘lgan oilalar.<br />
                        • <strong>Holat</strong> – yashil (yaxshi), sariq (o‘rtacha), qizil (xavf ostida).
                    </Text>
                </Box>

                {/* Qidiruv va filtr */}
                <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6}>
                    <InputGroup maxW="400px">
                        <InputLeftElement><Search size={18} color="gray.600" /></InputLeftElement>
                        <Input placeholder="Mahalla nomi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} bg="white" borderColor="gray.200" color="gray.800" _focus={{ borderColor: brand600 }} />
                        {searchTerm && <InputRightElement><IconButton aria-label="Tozalash" icon={<X size={16} />} size="xs" variant="ghost" color="gray.600" onClick={clearSearch} /></InputRightElement>}
                    </InputGroup>
                    <Select width="220px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} bg="white" borderColor="gray.200" color="gray.800" _focus={{ borderColor: brand600 }}>
                        <option value="all">Barcha holatlar</option>
                        <option value="good">Yaxshi (yashil)</option>
                        <option value="moderate">O‘rtacha (sariq)</option>
                        <option value="bad">Xavf ostida (qizil)</option>
                    </Select>
                </Flex>

                {/* Jadval */}
                <TableContainer bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" overflowX="auto" mb={10}>
                    <Table variant="unstyled">
                        <Thead bg="gray.50" color="gray.700">
                            <Tr>
                                <Th color="gray.700">#</Th><Th color="gray.700">Mahalla</Th><Th isNumeric color="gray.700">Kambag‘al oilalar</Th>
                                <Th isNumeric color="gray.700">Xizmat bilan qamrov</Th><Th isNumeric color="gray.700">Xavf ostidagilar</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredMahallas.length === 0 ? <Tr><Td colSpan={8} textAlign="center" py={8} color="gray.800">Hech narsa topilmadi</Td></Tr> :
                                filteredMahallas.map((m, idx) => {
                                    const isActive = m.name === "Batosh";
                                    let statusText = "", statusColor = "";
                                    if (m.status === "good") { statusText = "Yaxshi"; statusColor = "green"; }
                                    else if (m.status === "moderate") { statusText = "O‘rtacha"; statusColor = "yellow"; }
                                    else { statusText = "Xavf ostida"; statusColor = "red"; }
                                    return (
                                        <Tr key={idx} bg={isActive ? "blue.50" : "transparent"} _hover={{ bg: isActive ? "blue.100" : "gray.50" }} cursor={isActive ? "pointer" : "default"} onClick={() => isActive && handleDetailClick(m.name)}>
                                            <Td color="gray.800">{idx + 1}</Td>
                                            <Td color="gray.800"><Flex align="center" gap={2}><MapPin size={14} color={brand600} />{m.name}</Flex></Td>
                                            <Td isNumeric fontWeight="bold" color={m.status === "bad" ? "red.300" : m.status === "good" ? "green.300" : "yellow.300"}>{m.poorFamilies}</Td>
                                            <Td isNumeric color="gray.800">{m.coveredByServices}</Td>
                                            <Td isNumeric color="gray.800">{m.riskFamilies}</Td>
                                            <Td textAlign="center" color="gray.800">{m.willReachTarget ? <Flex align="center" gap={1} color="green.300" justify="center"><TrendingUp size={14} /><Text fontSize="sm">Yaxshilanadi</Text></Flex> : <Flex align="center" gap={1} color="red.300" justify="center"><TrendingDown size={14} /><Text fontSize="sm">Yaxshilanmaydi</Text></Flex>}</Td>
                                            <Td textAlign="center" color="gray.800">{isActive ? <IconButton aria-label="Batafsil" icon={<ArrowRight size={16} />} size="xs" variant="ghost" color={brand600} onClick={(e) => { e.stopPropagation(); handleDetailClick(m.name); }} /> : <IconButton aria-label="Yopiq" icon={<Lock size={14} />} size="xs" variant="ghost" color="gray.600" isDisabled />}</Td>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* Gorizontal diagramma – oilalar soni taqsimoti */}
                <Box mt={6}>
                    <Heading size="lg" mb={4} color="gray.800">Mahallalar kesimida kambag‘al oilalar, qamrov va xavf</Heading>
                    <Text mb={4} color="gray.600">Eng yomon holatdan eng yaxshiga tartiblangan (o‘ng tomonda yaxshilar)</Text>
                    <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" overflowX="auto">
                        <ResponsiveContainer width="100%" height={Math.max(500, chartData.length * 38)}>
                            <BarChart
                                layout="vertical"
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, maxFamilies]} tick={{ fill: "#4a5568" }} label={{ value: "Oilalar soni", position: "insideBottom", offset: -5, fill: "#4a5568" }} />
                                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fill: "#4a5568" }} interval={0} />
                                <Tooltip formatter={(value: number) => value.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1a202c" }} />
                                <Legend wrapperStyle={{ color: "#1a202c" }} verticalAlign="top" height={36} />
                                <Bar dataKey="Kambag‘al oilalar" fill={red400} />
                                <Bar dataKey="Xizmat bilan qamrov" fill={brand600} />
                                <Bar dataKey="Xavf ostidagilar" fill={yellow400} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>

                {/* Xulosa */}
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mt={6}>
                    <Flex gap={3} align="center"><AlertTriangle size={20} color={red400} /><Text fontWeight="medium">Xulosa: Qizil mahallalar (Qat, Qarliqbog‘, Cho‘lquvar, Eski Anxor, Yangi hayot) – kambag‘al oilalar soni eng yuqori va xavf katta.</Text></Flex>
                    <Flex gap={3} align="center" mt={2}><CheckCircle size={20} color={green400} /><Text>Batosh, Ishonch, Amir Temur, Alisher Navoiy, Nasaf kabi mahallalarda kambag‘al oilalar kam va yaxshi qamrov mavjud.</Text></Flex>
                    <Flex gap={3} align="center" mt={2}><Text fontSize="sm" color="gray.600">💡 Batosh mahallasiga bossangiz, batafsil chora-tadbirlar sahifasiga o‘tasiz.</Text></Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default FamaliyVilDetail;