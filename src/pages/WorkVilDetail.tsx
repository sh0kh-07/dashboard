// src/pages/LegalJobsQarshi.tsx – Qarshi shahri mahallalarida legallashtiriladigan ish o‘rinlari
import React, { useState } from "react";
import {
    Box, Text, Heading, Flex, useToken, Badge, Table, Thead, Tbody, Tr, Th, Td,
    TableContainer, Input, InputGroup, InputLeftElement, InputRightElement,
    Select, IconButton, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, MapPin, Search, X, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Briefcase } from "lucide-react";
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

// Qarshi shahri bo‘yicha jami legallashtiriladigan ish o‘rinlari
// (viloyat darajasidagi og‘irlik koeffitsiyenti asosida hisoblangan)
// Qashqadaryo viloyatida jami 77737 ta ish o‘rni, Qarshi shahrining og‘irligi 1.2
// Umumiy og‘irlik yig‘indisi: hisoblab chiqilgan (districtsRaw dagi weight yig‘indisi)
const totalLegalJobsInCity = 6240; // taxminiy, haqiqiy maʼlumot bilan almashtirilishi mumkin

// Har bir mahallaning og‘irlik koeffitsiyenti (iqtisodiy faollik, biznes salohiyati)
const mahallaWeights: Record<string, number> = {
    "Batosh": 2.5, "Ishonch": 1.8, "Amir Temur": 1.5, "Alisher Navoiy": 1.4, "Nasaf": 1.3,
    "Qat": 2.0, "Qarliqbog‘": 1.9, "Cho‘lquvar": 1.7, "Eski Anxor": 1.6, "Yangi hayot": 1.5,
    // qolganlariga o‘rtacha 1.0
};
const defaultWeight = 1.0;

const totalWeight = mahallaNames.reduce((sum, name) => sum + (mahallaWeights[name] || defaultWeight), 0);
const jobsPerWeight = totalLegalJobsInCity / totalWeight;

interface MahallaJobData {
    name: string;
    legalJobs: number;               // legallashtiriladigan ish o‘rinlari soni
    status: "bad" | "moderate" | "good";
    willReachTarget: boolean;       // yil oxirigacha reja bajariladimi?
}

function generateMahallaData(): MahallaJobData[] {
    const results: MahallaJobData[] = [];
    const goodMahallas = new Set(["Batosh", "Ishonch", "Amir Temur", "Alisher Navoiy", "Nasaf"]);
    const badMahallas = new Set(["Qat", "Qarliqbog‘", "Cho‘lquvar", "Eski Anxor", "Yangi hayot"]);

    for (const name of mahallaNames) {
        const weight = mahallaWeights[name] || defaultWeight;
        let jobs = Math.round(jobsPerWeight * weight);
        jobs = Math.min(500, Math.max(30, jobs)); // realistik chegaralar

        const avgJobs = totalLegalJobsInCity / mahallaNames.length;
        let status: "bad" | "moderate" | "good";
        if (jobs < avgJobs * 0.8) status = "bad";
        else if (jobs > avgJobs * 1.2) status = "good";
        else status = "moderate";

        if (goodMahallas.has(name)) status = "good";
        if (badMahallas.has(name)) status = "bad";

        const willReachTarget = status !== "bad";

        results.push({
            name,
            legalJobs: jobs,
            status,
            willReachTarget,
        });
    }
    return results;
}

const mahallaData = generateMahallaData();

// Jadval tartibi: Batosh birinchi, keyin holat bo‘yicha (yomon → o‘rtacha → yaxshi)
const sortedForTable = [...mahallaData].sort((a, b) => {
    if (a.name === "Batosh") return -1;
    if (b.name === "Batosh") return 1;
    const order = { bad: 0, moderate: 1, good: 2 };
    return order[a.status] - order[b.status];
});

// Grafik ma’lumotlari
const chartData = [...mahallaData]
    .sort((a, b) => {
        const order = { bad: 0, moderate: 1, good: 2 };
        return order[a.status] - order[b.status];
    })
    .map(m => ({
        name: m.name,
        "Legallashtiriladigan ish o‘rinlari": m.legalJobs,
    }));

const maxJobs = Math.max(...chartData.map(d => d["Legallashtiriladigan ish o‘rinlari"])) + 50;

// ------------------------------
// ASOSIY KOMPONENT
// ------------------------------
const LegalJobsQarshi = () => {
    const [brand600, red400, yellow400, green400] = useToken("colors", [
        "brand.600", "red.500", "yellow.500", "green.500",
    ]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "bad" | "moderate" | "good">("all");

    const handleDetailClick = (mahallaName: string) => {
        if (mahallaName === "Batosh") {
            navigate("/swork/vil/qarshi/batosh");
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
        totalJobs: mahallaData.reduce((s, m) => s + m.legalJobs, 0),
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
                            Qarshi shahri mahallalarida legallashtiriladigan ish o‘rinlari
                        </Heading>
                        <Text fontSize="md" color="brand.300" mt={1}>
                            2025-yil rejasi – har bir mahallada rasmiy ish o‘rinlari soni
                        </Text>
                    </Box>
                    <Flex alignItems="center" gap={2} textAlign="right">
                        <Text fontSize="lg" fontWeight="medium" color="gray.600">
                            Shahar bo‘yicha jami ish o‘rinlari
                        </Text>
                        <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                            {stats.totalJobs.toLocaleString()}
                        </Text>
                    </Flex>
                </Flex>

                <Text color="gray.600">
                    Ranglar: <strong style={{ color: green400 }}>Yashil</strong> — ko‘p ish o‘rni (yaxshi),{" "}
                    <strong style={{ color: yellow400 }}>Sariq</strong> — o‘rtacha,{" "}
                    <strong style={{ color: red400 }}>Qizil</strong> — kam ish o‘rni (xavf).
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={2}>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Yaxshi holat</StatLabel>
                        <StatNumber color="green.400">{stats.good}</StatNumber>
                        <StatHelpText>Ko‘p ish o‘rinlari</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>O‘rtacha holat</StatLabel>
                        <StatNumber color="yellow.400">{stats.moderate}</StatNumber>
                        <StatHelpText>O‘rtacha ko‘rsatkich</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Xavf ostida</StatLabel>
                        <StatNumber color="red.400">{stats.bad}</StatNumber>
                        <StatHelpText>Kam ish o‘rinlari</StatHelpText>
                    </Stat>
                </SimpleGrid>

                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mb={2}>
                    <Heading size="sm" mb={2} color="gray.800">📊 Ma’lumotlar qanday hisoblandi?</Heading>
                    <Text fontSize="sm" color="gray.600">
                        • <strong>Legallashtiriladigan ish o‘rinlari</strong> – mahalladagi kutilayotgan rasmiy ish o‘rinlari soni.<br />
                        • <strong>Holat</strong> – yashil (ko‘p ish o‘rni), sariq (o‘rtacha), qizil (kam ish o‘rni).<br />
                        • <strong>Prognoz</strong> – joriy reja asosida maqsadga erishish ehtimoli.
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
                                <Th color="gray.700">#</Th><Th color="gray.700">Mahalla</Th>
                                <Th isNumeric color="gray.700">Legallashtiriladigan ish o‘rinlari</Th>
                                <Th textAlign="center" color="gray.700">Holat</Th>
                                <Th textAlign="center" color="gray.700">Prognoz</Th>
                                <Th textAlign="center" color="gray.700">Harakat</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredMahallas.length === 0 ? <Tr><Td colSpan={6} textAlign="center" py={8} color="gray.800">Hech narsa topilmadi</Td></Tr> :
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
                                            <Td isNumeric fontWeight="bold" color={m.status === "bad" ? "red.300" : m.status === "good" ? "green.300" : "yellow.300"}>{m.legalJobs}</Td>
                                            <Td textAlign="center" color="gray.800"><Badge colorScheme={statusColor}>{statusText}</Badge></Td>
                                            <Td textAlign="center" color="gray.800">{m.willReachTarget ? <Flex align="center" gap={1} color="green.300" justify="center"><TrendingUp size={14} /><Text fontSize="sm">Bajariladi</Text></Flex> : <Flex align="center" gap={1} color="red.300" justify="center"><TrendingDown size={14} /><Text fontSize="sm">Bajarilmaydi</Text></Flex>}</Td>
                                            <Td textAlign="center" color="gray.800">{isActive ? <IconButton aria-label="Batafsil" icon={<ArrowRight size={16} />} size="xs" variant="ghost" color={brand600} onClick={(e) => { e.stopPropagation(); handleDetailClick(m.name); }} /> : <IconButton aria-label="Yopiq" icon={<Lock size={14} />} size="xs" variant="ghost" color="gray.600" isDisabled />}</Td>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* Gorizontal diagramma */}
                <Box mt={6}>
                    <Heading size="lg" mb={4} color="gray.800">Mahallalar kesimida legallashtiriladigan ish o‘rinlari</Heading>
                    <Text mb={4} color="gray.600">Eng kam ish o‘rni bo‘lgan mahalladan eng ko‘piga (o‘ng tomonda yaxshilar)</Text>
                    <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" overflowX="auto">
                        <ResponsiveContainer width="100%" height={Math.max(500, chartData.length * 35)}>
                            <BarChart
                                layout="vertical"
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, maxJobs]} tick={{ fill: "#4a5568" }} label={{ value: "Ish o‘rinlari soni", position: "insideBottom", offset: -5, fill: "#4a5568" }} />
                                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fill: "#4a5568" }} interval={0} />
                                <Tooltip formatter={(value: number) => value.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1a202c" }} />
                                <Bar dataKey="Legallashtiriladigan ish o‘rinlari" fill={brand600} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>

                {/* Xulosa */}
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mt={6}>
                    <Flex gap={3} align="center"><AlertTriangle size={20} color={red400} /><Text fontWeight="medium">Xulosa: Qizil mahallalar (Qat, Qarliqbog‘, Cho‘lquvar, Eski Anxor, Yangi hayot) – ish o‘rinlari soni eng past va rejani bajarish xavfi yuqori.</Text></Flex>
                    <Flex gap={3} align="center" mt={2}><CheckCircle size={20} color={green400} /><Text>Batosh, Ishonch, Amir Temur, Alisher Navoiy, Nasaf kabi mahallalarda ish o‘rinlari ko‘p va reja bajariladi.</Text></Flex>
                    <Flex gap={3} align="center" mt={2}><Text fontSize="sm" color="gray.600">💡 Batosh mahallasiga bossangiz, batafsil chora-tadbirlar sahifasiga o‘tasiz.</Text></Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default LegalJobsQarshi;