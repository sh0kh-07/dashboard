// src/pages/DWorkVilDetail.tsx
import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    Flex,
    useToken,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Select,
    IconButton,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, MapPin, Search, X, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, MinusCircle } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// ------------------------------
// MAHALLALAR RO‘YXATI
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

// ------------------------------
// MAHALLA DARAJASIDAGI ishsizlik MA’LUMOTLARI
// Qarshi shahri ma’lumotlariga moslashtirilgan
// ------------------------------
interface MahallaPoverty {
    name: string;
    startYear: number;        // yil boshi (foiz)
    targetEndYear: number;    // yil oxiri maqsadi
    actualCurrent: number;    // 4 oydan keyingi real
    status: "bad" | "moderate" | "good";
    willMeetTarget: boolean;
}

function roundOne(num: number): number {
    return Math.round(num * 10) / 10;
}

function generateMahallaData(): MahallaPoverty[] {
    const results: MahallaPoverty[] = [];

    // Qarshi shahri uchun realistik bazaviy ko‘rsatkichlar (oldingi sahifalardan kelib chiqib)
    // Shahar o‘rtacha yil boshi: 3.8%, maqsad: 3.9%
    const cityStartAvg = 3.8;
    const cityTargetAvg = 2.0;

    // Yaxshi va yomon mahallalar to‘plami
    const goodMahallas = new Set(["Batosh", "Ishonch", "Amir Temur", "Alisher Navoiy", "Nasaf"]);
    const badMahallas = new Set(["Qat", "Qarliqbog‘", "Cho‘lquvar", "Eski Anxor", "Yangi hayot"]);

    for (const name of mahallaNames) {
        // Yil boshi: shahar o‘rtachasiga yaqin, +/- 0.6
        let start = cityStartAvg + (Math.random() - 0.5) * 1.2;
        start = roundOne(Math.min(4.5, Math.max(3.0, start)));

        // Maqsad: shahar maqsadiga yaqin, +/- 0.5
        let target = cityTargetAvg + (Math.random() - 0.5) * 1.0;
        target = roundOne(Math.min(2.8, Math.max(1.4, target)));

        // Maqsad yil boshidan past bo‘lishi kerak
        if (start <= target) target = roundOne(start - 0.3);

        const neededReduction = start - target;
        const monthlyNeeded = neededReduction / 12;
        const expectedAfter4 = roundOne(start - monthlyNeeded * 4);

        let actual: number;
        let status: "bad" | "moderate" | "good";

        if (badMahallas.has(name)) {
            // Yomon mahallalar – sekin pasayadi
            actual = roundOne(Math.min(start, expectedAfter4 + 0.6));
            status = "bad";
        } else if (goodMahallas.has(name)) {
            // Yaxshi mahallalar – tez pasayadi
            actual = roundOne(Math.max(target, expectedAfter4 - 0.5));
            status = "good";
        } else {
            // O‘rtacha mahallalar
            actual = roundOne(expectedAfter4 + (Math.random() - 0.5) * 0.4);
            status = "moderate";
        }
        actual = Math.min(start, Math.max(target, actual));
        actual = roundOne(actual);

        const currentMonthlyReduction = (start - actual) / 4;
        const projectedFinal = roundOne(actual - currentMonthlyReduction * 8);
        const willMeetTarget = projectedFinal <= target;

        results.push({
            name,
            startYear: start,
            targetEndYear: target,
            actualCurrent: actual,
            status,
            willMeetTarget,
        });
    }
    return results;
}

const mahallaData = generateMahallaData();

// Jadval uchun tartiblash: Batosh birinchi, qolganlari status bo‘yicha (yomon -> o‘rtacha -> yaxshi)
const sortedForTable = [...mahallaData].sort((a, b) => {
    if (a.name === "Batosh") return -1;
    if (b.name === "Batosh") return 1;
    const order = { bad: 0, moderate: 1, good: 2 };
    return order[a.status] - order[b.status];
});

// Grafik uchun ma’lumotlar (Batosh birinchi bo‘lishi shart emas, lekin status bo‘yicha tartiblangan)
const chartData = [...mahallaData]
    .sort((a, b) => {
        const order = { bad: 0, moderate: 1, good: 2 };
        return order[a.status] - order[b.status];
    })
    .map(m => ({
        name: m.name.length > 18 ? m.name.substring(0, 16) + "…" : m.name,
        fullName: m.name,
        startYear: m.startYear,
        current: m.actualCurrent,
        target: m.targetEndYear,
    }));

// ------------------------------
// ASOSIY KOMPONENT
// ------------------------------
const DWorkVilDetail = () => {
    const [brand600, red400, yellow400, green400] = useToken("colors", [
        "brand.600", "red.500", "yellow.500", "green.500",
    ]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "bad" | "moderate" | "good">("all");

    const handleDetailClick = (mahallaName: string) => {
        if (mahallaName === "Batosh") {
            navigate("/work/vil/qarshi/batosh");
        }
    };

    // Filtrlash (Batosh har doim birinchi bo‘lishi uchun alohida)
    const filteredUnsorted = sortedForTable.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" ? true : m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Batoshni birinchi qilib saqlash (agar filterdan o‘tgan bo‘lsa)
    const filteredMahallas = filteredUnsorted.sort((a, b) => {
        if (a.name === "Batosh") return -1;
        if (b.name === "Batosh") return 1;
        return 0;
    });

    const clearSearch = () => setSearchTerm("");

    const stats = {
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
                            Qarshi shahri mahallalarida ishsizlik monitoringi
                        </Heading>
                        <Text fontSize="md" color="brand.300" mt={1}>
                            Yil boshi, 4 oylik real holat va yil oxiri maqsadlari
                        </Text>
                    </Box>
                    <Flex alignItems="center" gap={2} textAlign="right">
                        <Text fontSize="lg" fontWeight="medium" color="gray.600">
                            Shahar bo‘yicha o‘rtacha maqsad
                        </Text>
                        <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                            3.9%
                        </Text>
                    </Flex>
                </Flex>

                <Text color="gray.600">
                    Xaritadagi ranglar: <strong style={{ color: green400 }}>Yashil</strong> — yaxshi (maqsadga erishadi),{" "}
                    <strong style={{ color: yellow400 }}>Sariq</strong> — o‘rtacha,{" "}
                    <strong style={{ color: red400 }}>Qizil</strong> — xavf ostida (maqsadga erisha olmasligi mumkin).
                </Text>

                {/* 3 ta statistik karta */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={2}>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Yaxshi holat</StatLabel>
                        <StatNumber color="green.400">{stats.good}</StatNumber>
                        <StatHelpText>Maqsadga ishonchli</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>O‘rtacha holat</StatLabel>
                        <StatNumber color="yellow.400">{stats.moderate}</StatNumber>
                        <StatHelpText>Harakat kerak</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Xavf ostida</StatLabel>
                        <StatNumber color="red.400">{stats.bad}</StatNumber>
                        <StatHelpText>Rejani bajarmaslik xavfi</StatHelpText>
                    </Stat>
                </SimpleGrid>

                {/* Tushuntirish bloki */}
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mb={2}>
                    <Heading size="sm" mb={2} color="gray.800">📊 Foizlar qanday hisoblandi?</Heading>
                    <Text fontSize="sm" color="gray.600">
                        • <strong>Yil boshi</strong> – Qarshi shahri mahallalarining ishsizlik darajasi (o‘rtacha 3.5%).<br />
                        • <strong>Maqsad (yil oxiri)</strong> – shahar bo‘yicha reja (3.9%).<br />
                        • <strong>Hozirgi (4 oy)</strong> – real pasayish sur’ati. Yaxshi mahallalar (Batosh, Ishonch, Nasaf) tezroq pasaygan, xavf ostidagilar (Qat, Qarliqbog‘) sekinroq.<br />
                        • <strong>Holat</strong> – yashil (yaxshi), sariq (o‘rtacha), qizil (xavf ostida).
                    </Text>
                </Box>

                {/* Qidiruv va filtr */}
                <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6}>
                    <InputGroup maxW="400px">
                        <InputLeftElement pointerEvents="none">
                            <Search size={18} color="gray.600" />
                        </InputLeftElement>
                        <Input
                            placeholder="Mahalla nomi bo‘yicha qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.600" }}
                            _focus={{ borderColor: brand600 }}
                            color="gray.800"
                        />
                        {searchTerm && (
                            <InputRightElement>
                                <IconButton
                                    aria-label="Tozalash"
                                    icon={<X size={16} />}
                                    size="xs"
                                    variant="ghost"
                                    color="gray.600"
                                    onClick={clearSearch}
                                    _hover={{ color: "brand.600" }}
                                />
                            </InputRightElement>
                        )}
                    </InputGroup>
                    <Select
                        width="220px"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        bg="white"
                        borderColor="gray.200"
                        color="gray.800"
                        _focus={{ borderColor: brand600 }}
                    >
                        <option value="all">Barcha holatlar</option>
                        <option value="good">Yaxshi (yashil)</option>
                        <option value="moderate">O‘rtacha (sariq)</option>
                        <option value="bad">Xavf ostida (qizil)</option>
                    </Select>
                </Flex>

                {/* Jadval */}
                <TableContainer bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" overflow="hidden" mb={10}>
                    <Table variant="unstyled">
                        <Thead bg="gray.50" color="gray.700">
                            <Tr>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200">#</Th>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200">Mahalla nomi</Th>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200" textAlign="right">Yil boshi (%)</Th>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200" textAlign="right">Maqsad (%)</Th>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200" textAlign="right">Hozirgi (%)</Th>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200" textAlign="center">Holat</Th>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200" textAlign="center">Bashorat</Th>
                                <Th color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200" textAlign="center">Harakat</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredMahallas.length === 0 ? (
                                <Tr>
                                    <Td colSpan={8} textAlign="center" py={8} color="gray.600">
                                        Hech qanday mahalla topilmadi
                                    </Td>
                                </Tr>
                            ) : (
                                filteredMahallas.map((mahalla, idx) => {
                                    const isActive = mahalla.name === "Batosh";
                                    let statusText = "", statusColor = "";
                                    if (mahalla.status === "good") { statusText = "Yaxshi"; statusColor = "green"; }
                                    else if (mahalla.status === "moderate") { statusText = "O‘rtacha"; statusColor = "yellow"; }
                                    else { statusText = "Xavf ostida"; statusColor = "red"; }
                                    return (
                                        <Tr
                                            key={idx}
                                            _hover={{ bg: "gray.50" }}
                                            cursor={isActive ? "pointer" : "default"}
                                            onClick={() => isActive && handleDetailClick(mahalla.name)}
                                        >
                                            <Td color="gray.600" fontSize="sm" borderBottom="1px solid" borderColor="gray.200">{idx + 1}</Td>
                                            <Td fontWeight="medium" borderBottom="1px solid" borderColor="gray.200" color="gray.800">
                                                <Flex align="center" gap={2}>
                                                    <MapPin size={14} color={brand600} />
                                                    {mahalla.name}
                                                </Flex>
                                            </Td>
                                            <Td textAlign="right" borderBottom="1px solid" borderColor="gray.200" color="gray.800">{mahalla.startYear.toFixed(1)}%</Td>
                                            <Td textAlign="right" borderBottom="1px solid" borderColor="gray.200" color="gray.800">{mahalla.targetEndYear.toFixed(1)}%</Td>
                                            <Td textAlign="right" fontWeight="bold" color={mahalla.status === "bad" ? "red.300" : mahalla.status === "good" ? "green.300" : "yellow.300"} borderBottom="1px solid" borderColor="gray.200">
                                                {mahalla.actualCurrent.toFixed(1)}%
                                            </Td>
                                            <Td textAlign="center" borderBottom="1px solid" borderColor="gray.200" color="gray.800">
                                                <Badge colorScheme={statusColor} borderRadius="full" px={2}>{statusText}</Badge>
                                            </Td>
                                            <Td textAlign="center" borderBottom="1px solid" borderColor="gray.200" color="gray.800">
                                                {mahalla.willMeetTarget ? (
                                                    <Flex align="center" gap={1} color="green.300" justify="center">
                                                        <TrendingUp size={14} />
                                                        <Text fontSize="sm">Bajaradi</Text>
                                                    </Flex>
                                                ) : (
                                                    <Flex align="center" gap={1} color="red.300" justify="center">
                                                        <TrendingDown size={14} />
                                                        <Text fontSize="sm">Bajara olmaydi</Text>
                                                    </Flex>
                                                )}
                                            </Td>
                                            <Td textAlign="center" borderBottom="1px solid" borderColor="gray.200" color="gray.800">
                                                {isActive ? (
                                                    <IconButton
                                                        aria-label="Batafsil"
                                                        icon={<ArrowRight size={16} />}
                                                        size="xs"
                                                        variant="ghost"
                                                        color={brand600}
                                                        _hover={{ bg: "rgba(0,188,212,0.2)" }}
                                                        onClick={(e) => { e.stopPropagation(); handleDetailClick(mahalla.name); }}
                                                    />
                                                ) : (
                                                    <IconButton
                                                        aria-label="Yopiq"
                                                        icon={<Lock size={14} />}
                                                        size="xs"
                                                        variant="ghost"
                                                        color="gray.600"
                                                        isDisabled
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

                {/* Gorizontal diagramma */}
                <Box mt={6}>
                    <Heading as="h2" size="lg" mb={4} color="gray.800">ishsizlik darajasi (yil boshi, hozirgi, maqsad)</Heading>
                    <Text mb={4} color="gray.600">Mahallalar bo‘yicha solishtirma tahlil (eng yomon holatdan eng yaxshiga)</Text>
                    <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
                        <ResponsiveContainer width="100%" height={Math.max(500, chartData.length * 32)}>
                            <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, 5]} tick={{ fill: "#4a5568" }} label={{ value: "ishsizlik %", position: "insideBottom", offset: -5, fill: "#4a5568" }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#4a5568" }} width={110} />
                                <Tooltip
                                    formatter={(value: number) => `${value.toFixed(1)}%`}
                                    labelFormatter={(label) => {
                                        const item = chartData.find(d => d.name === label);
                                        return item ? item.fullName : label;
                                    }}
                                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#1a202c" }}
                                />
                                <Bar dataKey="startYear" fill="#4A5568" name="Yil boshi" />
                                <Bar dataKey="current" fill={brand600} name="Hozirgi (4 oy)" />
                                <Bar dataKey="target" fill="#38A169" name="Maqsad" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>

                {/* Xulosa */}
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mt={6}>
                    <Flex gap={3} align="center">
                        <AlertTriangle size={20} color={red400} />
                        <Text fontWeight="medium">
                            Xulosa: Qizil rangdagi mahallalar (Qat, Qarliqbog‘, Cho‘lquvar, Eski Anxor, Yangi hayot) hozirgi pasayish sur’atida yil oxirigacha maqsadli darajaga yeta olmaydi.
                        </Text>
                    </Flex>
                    <Flex gap={3} align="center" mt={2}>
                        <CheckCircle size={20} color={green400} />
                        <Text>Batosh, Ishonch, Amir Temur, Alisher Navoiy, Nasaf kabi mahallalar yaxshi natija ko‘rsatmoqda.</Text>
                    </Flex>
                    <Flex gap={3} align="center" mt={2}>
                        <Text fontSize="sm" color="gray.600">💡 Eslatma: Batosh mahallasiga bossangiz, batafsil sahifaga o‘tasiz.</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default DWorkVilDetail;