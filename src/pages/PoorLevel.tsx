import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    useToken,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";
import { AlertTriangle, CheckCircle, MinusCircle, TrendingDown, TrendingUp } from "lucide-react";

// ------------------------------
// MA'LUMOTLAR (faqat 1 kasrli)
// ------------------------------
interface RegionPovertyData {
    name: string;
    targetEndYear: number;
    startYear: number;
}

const rawData: RegionPovertyData[] = [
    { name: "Buxoro", targetEndYear: 2.6, startYear: 4.5 },
    { name: "Jizzax", targetEndYear: 2.8, startYear: 4.6 },
    { name: "Qashqadaryo", targetEndYear: 3.3, startYear: 4.6 },
    { name: "Navoiy", targetEndYear: 2.1, startYear: 3.9 },
    { name: "Namangan", targetEndYear: 2.7, startYear: 4.6 },
    { name: "Samarqand", targetEndYear: 2.0, startYear: 4.5 },
    { name: "Sirdaryo", targetEndYear: 3.0, startYear: 4.6 },
    { name: "Surxondaryo", targetEndYear: 2.8, startYear: 4.6 },
    { name: "Toshkent viloyati", targetEndYear: 2.6, startYear: 4.5 },
    { name: "Fargʻona", targetEndYear: 2.7, startYear: 4.5 },
    { name: "Xorazm", targetEndYear: 3.0, startYear: 4.5 },
    { name: "Toshkent shahri", targetEndYear: 1.7, startYear: 3.8 },
    { name: "Andijon", targetEndYear: 2.7, startYear: 4.6 },
    { name: "Qoraqalpogʻiston", targetEndYear: 2.9, startYear: 4.3 },
];

// ------------------------------
// REGION HOLATINI HISOBLASH
// ------------------------------
interface RegionCurrent {
    name: string;
    targetEndYear: number;
    startYear: number;
    expectedAfter4Months: number;
    actualCurrent: number;
    status: "bad" | "moderate" | "good";
    willMeetTarget: boolean;
}

function roundOne(num: number): number {
    return Math.round(num * 10) / 10;
}

function computeRegions(): RegionCurrent[] {
    const results: RegionCurrent[] = [];
    for (const r of rawData) {
        const { startYear, targetEndYear, name } = r;
        const totalReductionNeeded = startYear - targetEndYear;
        const monthlyNeeded = totalReductionNeeded / 12;
        const expectedAfter4Months = roundOne(startYear - monthlyNeeded * 4);

        let actualCurrent: number;
        let status: "bad" | "moderate" | "good";

        const badRegions = ["Qashqadaryo", "Sirdaryo", "Surxondaryo", "Jizzax", "Xorazm"];
        const goodRegions = ["Toshkent shahri", "Samarqand", "Navoiy", "Buxoro"];

        if (badRegions.includes(name)) {
            const lag = roundOne(0.5 + Math.random() * 0.4);
            actualCurrent = roundOne(Math.min(startYear, expectedAfter4Months + lag));
            status = "bad";
        } else if (goodRegions.includes(name)) {
            const boost = roundOne(0.3 + Math.random() * 0.3);
            actualCurrent = roundOne(Math.max(targetEndYear, expectedAfter4Months - boost));
            status = "good";
        } else {
            const variation = roundOne((Math.random() - 0.5) * 0.3);
            actualCurrent = roundOne(expectedAfter4Months + variation);
            status = "moderate";
        }
        let clampedActual = Math.min(startYear, Math.max(targetEndYear, actualCurrent));
        clampedActual = roundOne(clampedActual);
        const currentMonthlyReduction = roundOne((startYear - clampedActual) / 4);
        const projectedFinal = roundOne(clampedActual - currentMonthlyReduction * 8);
        const willMeetTarget = projectedFinal <= targetEndYear;

        results.push({
            name,
            targetEndYear: roundOne(targetEndYear),
            startYear: roundOne(startYear),
            expectedAfter4Months,
            actualCurrent: clampedActual,
            status,
            willMeetTarget,
        });
    }
    return results;
}

const regionDataDetailed = computeRegions();

// ------------------------------
// XARITA MAPPING (to‘liq va mustahkam)
// ------------------------------
// Barcha SVG nomlarini region nomlariga moslash
const buildNameMap = (): Map<string, string> => {
    const map = new Map<string, string>();
    // Asosiy mapping
    const mappings: [string, string][] = [
        ["Tashkent", "Toshkent shahri"],
        ["Toshkent viloyati", "Toshkent viloyati"],
        ["Samarkand", "Samarqand"],
        ["Samarqand viloyati", "Samarqand"],
        ["Bukhara", "Buxoro"],
        ["Buxoro viloyati", "Buxoro"],
        ["Qashqadaryo", "Qashqadaryo"],
        ["Qashqadaryo viloyati", "Qashqadaryo"],
        ["Fergana", "Fargʻona"],
        ["Farg‘ona viloyati", "Fargʻona"],
        ["Andijan", "Andijon"],
        ["Andijon viloyati", "Andijon"],
        ["Namangan", "Namangan"],
        ["Namangan viloyati", "Namangan"],
        ["Surxondaryo", "Surxondaryo"],
        ["Surxondaryo viloyati", "Surxondaryo"],
        ["Jizzakh", "Jizzax"],
        ["Jizzax viloyati", "Jizzax"],
        ["Sirdaryo", "Sirdaryo"],
        ["Sirdaryo viloyati", "Sirdaryo"],
        ["Navoiy", "Navoiy"],
        ["Navoiy viloyati", "Navoiy"],
        ["Xorazm", "Xorazm"],
        ["Xorazm viloyati", "Xorazm"],
        ["Karakalpakstan", "Qoraqalpogʻiston"],
        ["Karakalpakstan Respublikasi", "Qoraqalpogʻiston"],
    ];
    for (const [svgName, regionName] of mappings) {
        map.set(svgName, regionName);
        // Apostrof variatsiyalari
        map.set(svgName.replace(/‘/g, "'"), regionName);
        map.set(svgName.replace(/ʻ/g, "'"), regionName);
    }
    return map;
};

const svgToRegionMap = buildNameMap();

const getRegionKey = (svgName: string): string | null => {
    // To‘g‘ridan-to‘g‘ri moslik
    if (svgToRegionMap.has(svgName)) return svgToRegionMap.get(svgName)!;
    // “viloyati” va “shahri”ni olib tashlab tekshirish
    const normalized = svgName
        .replace(/ viloyati$/i, '')
        .replace(/ shahri$/i, '')
        .replace(/ Respublikasi$/i, '')
        .replace(/[‘ʻ]/g, "'")
        .trim();
    for (const [key, value] of svgToRegionMap.entries()) {
        const keyNorm = key.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').replace(/[‘ʻ]/g, "'").trim();
        if (keyNorm === normalized) return value;
    }
    // Agar topilmasa, regionDataDetailed ichidan qidirish
    const found = regionDataDetailed.find(r => r.name === normalized);
    return found ? found.name : null;
};

const getRegionStatus = (regionName: string): "bad" | "moderate" | "good" | undefined => {
    const region = regionDataDetailed.find(r => r.name === regionName);
    return region?.status;
};

const getRegionData = (regionName: string): RegionCurrent | undefined => {
    return regionDataDetailed.find(r => r.name === regionName);
};

// ------------------------------
// ASOSIY KOMPONENT
// ------------------------------
const PoorLevelDashboard = () => {
    const navigate = useNavigate();
    const [brand600, red400, yellow400, green400] = useToken("colors", [
        "brand.600",
        "red.500",
        "yellow.500",
        "green.500",
    ]);

    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        data: { name: string; regionKey: string | null; status?: string } | null;
    }>({
        visible: false,
        x: 0,
        y: 0,
        data: null,
    });

    const chartComparison = regionDataDetailed.map(r => ({
        name: r.name,
        "Yil boshi (%)": r.startYear,
        "Hozirgi (4 oy)": r.actualCurrent,
        "Yil oxiri maqsadi (%)": r.targetEndYear,
    }));

    const handleRegionClick = (locId: string, regionName?: string) => {
        if (regionName === "Qashqadaryo" || locId === "qashqadaryo") {
            navigate("/poor-level/vil");
        }
    };

    const renderTable = () => (
        <Box overflowX="auto" mt={8} bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" p={4}>
            <Heading size="md" mb={4} color="gray.800">Viloyatlar kesimida tahlil (kambag‘allik foizi)</Heading>
            <Table variant="simple" colorScheme="gray">
                <Thead color="gray.700">
                    <Tr>
                        <Th color="gray.700">Viloyat</Th>
                        <Th isNumeric color="gray.700">Yil boshi (%)</Th>
                        <Th isNumeric color="gray.700">Maqsad (yil oxiri)</Th>
                        <Th isNumeric color="gray.700">Hozirgi real (%)</Th>
                        <Th color="gray.700">Holat</Th>
                        <Th color="gray.700">Bashorat</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {regionDataDetailed.map((row) => {
                        let statusText = "";
                        let statusIcon = null;
                        if (row.status === "bad") {
                            statusText = "Xavf ostida";
                            statusIcon = <AlertTriangle size={16} color={red400} />;
                        } else if (row.status === "moderate") {
                            statusText = "O‘rtacha";
                            statusIcon = <MinusCircle size={16} color={yellow400} />;
                        } else {
                            statusText = "Yaxshi";
                            statusIcon = <CheckCircle size={16} color={green400} />;
                        }
                        return (
                            <Tr key={row.name}>
                                <Td fontWeight="medium" color="gray.800">{row.name}</Td>
                                <Td isNumeric color="gray.800">{row.startYear.toFixed(1)}%</Td>
                                <Td isNumeric color="gray.800">{row.targetEndYear.toFixed(1)}%</Td>
                                <Td isNumeric fontWeight="bold" color={row.status === "bad" ? "red.300" : row.status === "good" ? "green.300" : "yellow.300"}>
                                    {row.actualCurrent.toFixed(1)}%
                                </Td>
                                <Td color="gray.800">
                                    <Flex align="center" gap={2}>
                                        {statusIcon}
                                        <Badge colorScheme={row.status === "bad" ? "red" : row.status === "good" ? "green" : "yellow"}>
                                            {statusText}
                                        </Badge>
                                    </Flex>
                                </Td>
                                <Td color="gray.800">
                                    {!row.willMeetTarget ? (
                                        <Flex align="center" gap={1} color="red.300">
                                            <TrendingDown size={14} />
                                            <Text fontSize="sm">Bajara olmaydi</Text>
                                        </Flex>
                                    ) : (
                                        <Flex align="center" gap={1} color="green.300">
                                            <TrendingUp size={14} />
                                            <Text fontSize="sm">Bajaradi</Text>
                                        </Flex>
                                    )}
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Box>
    );

    const renderMap = () => (
        <Box position="relative" display="flex" justifyContent="center" my={6}>
            <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
                {Uzbekistan.locations.map((loc: any) => {
                    const regionKey = getRegionKey(loc.name);
                    const status = regionKey ? getRegionStatus(regionKey) : undefined;
                    let fillColor = brand600;
                    if (status === "bad") fillColor = red400;
                    else if (status === "moderate") fillColor = yellow400;
                    else if (status === "good") fillColor = green400;

                    return (
                        <path
                            key={loc.id}
                            d={loc.path}
                            onMouseEnter={(e) => {
                                setTooltip({
                                    visible: true,
                                    x: e.clientX,
                                    y: e.clientY,
                                    data: { name: loc.name, regionKey, status: status || "unknown" },
                                });
                            }}
                            onMouseMove={(e) =>
                                setTooltip((prev) => ({
                                    ...prev,
                                    x: e.clientX,
                                    y: e.clientY,
                                }))
                            }
                            onMouseLeave={() =>
                                setTooltip({ visible: false, x: 0, y: 0, data: null })
                            }
                            onClick={() => {
                                if (regionKey === "Qashqadaryo") {
                                    handleRegionClick(loc.id, regionKey);
                                }
                            }}
                            style={{
                                fill: fillColor,
                                stroke: "#1a202c",
                                strokeWidth: 1.2,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                opacity: 0.85,
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.opacity = "1";
                                e.currentTarget.style.strokeWidth = "2.5";
                                e.currentTarget.style.stroke = "#2b6cb0";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.opacity = "0.85";
                                e.currentTarget.style.strokeWidth = "1.2";
                                e.currentTarget.style.stroke = "#1a202c";
                            }}
                        />
                    );
                })}
            </svg>
            {tooltip.visible && tooltip.data && (
                <Box
                    position="fixed"
                    top={tooltip.y + 12}
                    left={tooltip.x + 12}
                    bg="gray.50"
                    color="gray.800"
                    px={4}
                    py={2}
                    borderRadius="md"
                    boxShadow="lg"
                    zIndex={1000}
                    pointerEvents="none"
                    
                    
                >
                    <Text fontWeight="bold" mb={1}>{tooltip.data.name}</Text>
                    {tooltip.data.regionKey ? (
                        (() => {
                            const reg = getRegionData(tooltip.data.regionKey!);
                            if (!reg) return <Text>Maʼlumot mavjud emas</Text>;
                            return (
                                <>
                                    <Text fontSize="sm">
                                        Holat:{" "}
                                        {reg.status === "bad"
                                            ? "⚠️ Xavf ostida"
                                            : reg.status === "moderate"
                                                ? "🟡 O‘rtacha"
                                                : "✅ Yaxshi"}
                                    </Text>
                                    <Text fontSize="xs">Yil boshi: {reg.startYear.toFixed(1)}%</Text>
                                    <Text fontSize="xs">Hozirgi: {reg.actualCurrent.toFixed(1)}%</Text>
                                    <Text fontSize="xs">Maqsad: {reg.targetEndYear.toFixed(1)}%</Text>
                                    <Text fontSize="xs" fontWeight="bold" color={reg.willMeetTarget ? "green.300" : "red.300"}>
                                        {reg.willMeetTarget ? "Maqsad bajariladi ✅" : "Bajarilmaydi ❌"}
                                    </Text>
                                </>
                            );
                        })()
                    ) : (
                        <Text fontSize="sm">Maʼlumot topilmadi</Text>
                    )}
                </Box>
            )}
        </Box>
    );

    const stats = {
        badCount: regionDataDetailed.filter(r => r.status === "bad").length,
        moderateCount: regionDataDetailed.filter(r => r.status === "moderate").length,
        goodCount: regionDataDetailed.filter(r => r.status === "good").length,
        failProjection: regionDataDetailed.filter(r => !r.willMeetTarget).length,
    };

    return (
        <Box>
            <Flex direction="column" gap={4}>
                <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
                    Kambag‘allik darajasi monitoringi
                </Heading>
                <Text color="gray.600">
                    Xaritada viloyatlar holati: <strong style={{ color: green400 }}>Yashil</strong> — yaxshi,{" "}
                    <strong style={{ color: yellow400 }}>Sariq</strong> — o‘rtacha,{" "}
                    <strong style={{ color: red400 }}>Qizil</strong> — xavf ostida.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={2}>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Yaxshi holat</StatLabel>
                        <StatNumber color="green.400">{stats.goodCount}</StatNumber>
                        <StatHelpText>Maqsadga ishonchli</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>O‘rtacha holat</StatLabel>
                        <StatNumber color="yellow.400">{stats.moderateCount}</StatNumber>
                        <StatHelpText>Harakat kerak</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <StatLabel>Xavf ostida</StatLabel>
                        <StatNumber color="red.400">{stats.badCount}</StatNumber>
                        <StatHelpText>Rejani bajarmaslik xavfi</StatHelpText>
                    </Stat>
                </SimpleGrid>

                {renderMap()}

                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" p={5} mt={4}>
                    <Heading size="md" mb={2} color="gray.800">Pasayish dinamikasi (foiz)</Heading>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                        Yil boshi, hozirgi (4 oy) va yil oxiri maqsadi
                    </Text>
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart data={chartComparison} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#4a5568", fontSize: 11 }}
                                angle={-35}
                                textAnchor="end"
                                height={70}
                            />
                            <YAxis
                                tick={{ fill: "#4a5568" }}
                                label={{ value: "Kambag‘allik %", angle: -90, position: "insideLeft", fill: "#4a5568" }}
                            />
                            <RechartsTooltip contentStyle={{ backgroundColor: "#ffffff", color: "#1a202c", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                            <Legend wrapperStyle={{ color: "#1a202c" }} />
                            <Bar dataKey="Yil boshi (%)" fill="#4A5568" />
                            <Bar dataKey="Hozirgi (4 oy)" fill={brand600} />
                            <Bar dataKey="Yil oxiri maqsadi (%)" fill="#38A169" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                {renderTable()}
            </Flex>
        </Box>
    );
};

export default PoorLevelDashboard;