import React, { useState } from "react";
import {
    Box, Text, Heading, useToken, Flex, Table, Thead, Tbody, Tr, Th, Td,
    Badge, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
    Tabs, TabList, TabPanels, Tab, TabPanel, TableContainer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
    ResponsiveContainer, CartesianGrid, Legend, Cell,
} from "recharts";
import { Briefcase, Building, Landmark, Truck, Home, Camera, TrendingUp, AlertTriangle, CheckCircle, Users } from "lucide-react";

// ------------------------------
// MA'LUMOTLAR: HUDUDLAR KESIMIDA LEGALLASHTIRILADIGAN ISH O'RINLARI
// ------------------------------
interface RegionJobs {
    name: string;
    total: number;
    soliq: number;
    ijtimoiy: number;
    bandlik: number;
    qishloq: number;
    transport: number;
    qurilish: number;
    turizm: number;
}

const regionsData: RegionJobs[] = [
    { name: "Qoraqalpogʻiston Respublikasi", total: 46578, soliq: 17305, ijtimoiy: 5710, bandlik: 5950, qishloq: 6781, transport: 4326, qurilish: 6306, turizm: 200 },
    { name: "Andijon viloyati", total: 66390, soliq: 27065, ijtimoiy: 11335, bandlik: 7930, qishloq: 9814, transport: 2551, qurilish: 7295, turizm: 400 },
    { name: "Buxoro viloyati", total: 60747, soliq: 20656, ijtimoiy: 5182, bandlik: 8047, qishloq: 8575, transport: 7512, qurilish: 9575, turizm: 1200 },
    { name: "Jizzax viloyati", total: 48968, soliq: 19998, ijtimoiy: 4933, bandlik: 4050, qishloq: 7672, transport: 7296, qurilish: 4719, turizm: 300 },
    { name: "Qashqadaryo viloyati", total: 77737, soliq: 26750, ijtimoiy: 9030, bandlik: 9640, qishloq: 15800, transport: 7836, qurilish: 8231, turizm: 450 },
    { name: "Navoiy viloyati", total: 35138, soliq: 15284, ijtimoiy: 1243, bandlik: 4520, qishloq: 5292, transport: 4544, qurilish: 3905, turizm: 350 },
    { name: "Namangan viloyati", total: 60631, soliq: 26710, ijtimoiy: 8781, bandlik: 8165, qishloq: 7341, transport: 2432, qurilish: 6752, turizm: 450 },
    { name: "Samarqand viloyati", total: 66797, soliq: 32776, ijtimoiy: 6519, bandlik: 10228, qishloq: 6580, transport: 2212, qurilish: 7282, turizm: 1200 },
    { name: "Sirdaryo viloyati", total: 36028, soliq: 17362, ijtimoiy: 2117, bandlik: 2970, qishloq: 5893, transport: 3026, qurilish: 4410, turizm: 250 },
    { name: "Surxondaryo viloyati", total: 50883, soliq: 21873, ijtimoiy: 6633, bandlik: 7280, qishloq: 5046, transport: 3869, qurilish: 5722, turizm: 460 },
    { name: "Toshkent viloyati", total: 111630, soliq: 57310, ijtimoiy: 7452, bandlik: 11470, qishloq: 10185, transport: 4020, qurilish: 20143, turizm: 1050 },
    { name: "Fargʻona viloyati", total: 73886, soliq: 28165, ijtimoiy: 12384, bandlik: 10330, qishloq: 8500, transport: 5177, qurilish: 8130, turizm: 1200 },
    { name: "Xorazm viloyati", total: 50065, soliq: 18218, ijtimoiy: 4408, bandlik: 7380, qishloq: 7521, transport: 6152, qurilish: 5186, turizm: 1200 },
    { name: "Toshkent shahri", total: 214522, soliq: 130528, ijtimoiy: 14273, bandlik: 27040, qishloq: 0, transport: 14047, qurilish: 27344, turizm: 1290 },
];

// Umumiy ma'lumotlar
const totalJobs = 1000000; // jadvalda 1 000 000
const ministryData = [
    { name: "Soliq qoʻmitasi", value: 460000, icon: Landmark, color: "#3182CE" },
    { name: "Ijtimoiy himoya agentligi", value: 100000, icon: Users, color: "#38A169" },
    { name: "Bandlik vazirligi", value: 125000, icon: Briefcase, color: "#DD6B20" },
    { name: "Qishloq xoʻjaligi vazirligi", value: 105000, icon: Home, color: "#805AD5" },
    { name: "Transport vazirligi", value: 75000, icon: Truck, color: "#D53F8C" },
    { name: "Qurilish vazirligi", value: 125000, icon: Building, color: "#ED8936" },
    { name: "Turizm qoʻmitasi", value: 10000, icon: Camera, color: "#9F7AEA" },
];

// Xarita mapping (avvalgi kabi)
const regionNameMap: Record<string, string> = {
    "Karakalpakstan": "Qoraqalpogʻiston Respublikasi",
    "Qoraqalpog‘iston": "Qoraqalpogʻiston Respublikasi",
    "Andijan": "Andijon viloyati",
    "Bukhara": "Buxoro viloyati",
    "Jizzakh": "Jizzax viloyati",
    "Qashqadaryo": "Qashqadaryo viloyati",
    "Navoi": "Navoiy viloyati",
    "Namangan": "Namangan viloyati",
    "Samarkand": "Samarqand viloyati",
    "Sirdaryo": "Sirdaryo viloyati",
    "Surxondaryo": "Surxondaryo viloyati",
    "Toshkent viloyati": "Toshkent viloyati",
    "Fergana": "Fargʻona viloyati",
    "Xorazm": "Xorazm viloyati",
    "Tashkent": "Toshkent shahri",
};

const getRegionTotal = (svgName: string): number => {
    const normalized = svgName.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').trim();
    let regionKey = regionNameMap[svgName] || regionNameMap[normalized];
    if (!regionKey) {
        const found = regionsData.find(r => r.name.includes(normalized));
        return found ? found.total : 0;
    }
    const found = regionsData.find(r => r.name === regionKey);
    return found ? found.total : 0;
};

const getRegionName = (svgName: string): string | null => {
    const normalized = svgName.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').trim();
    return regionNameMap[svgName] || regionNameMap[normalized] || null;
};

// Ranglar: legallashtirilgan ish o‘rinlari soniga qarab
const getRegionColor = (total: number, maxTotal: number): string => {
    const ratio = total / maxTotal;
    if (ratio > 0.7) return "#2B6CB0"; // to'q ko'k
    if (ratio > 0.4) return "#4299E1";
    if (ratio > 0.2) return "#63B3ED";
    return "#90CDF4";
};

const Work = () => {
    const navigate = useNavigate();
    const [brand600, red400, yellow400, green400] = useToken("colors", [
        "brand.600", "red.500", "yellow.500", "green.500",
    ]);
    const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, data: null });

    const maxTotal = Math.max(...regionsData.map(r => r.total));
    const topRegion = regionsData.reduce((max, r) => r.total > max.total ? r : max, regionsData[0]);
    const bottomRegion = regionsData.reduce((min, r) => r.total < min.total ? r : min, regionsData[0]);

    // Grafiklar uchun ma'lumotlar
    const regionsChartData = [...regionsData].sort((a, b) => b.total - a.total).map(r => ({ name: r.name, total: r.total }));
    const ministryChartData = ministryData.map(m => ({ name: m.name, value: m.value, icon: m.icon, color: m.color }));

    const handleRegionClick = (regionFull: string | null) => {
        if (regionFull === "Qashqadaryo viloyati") {
            navigate("/swork/vil");
        }
    };

    const renderMap = () => (
        <Box position="relative" display="flex" justifyContent="center" my={6}>
            <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
                {Uzbekistan.locations.map((loc: any) => {
                    const total = getRegionTotal(loc.name);
                    const fillColor = getRegionColor(total, maxTotal);
                    const regionFull = getRegionName(loc.name);
                    return (
                        <path
                            key={loc.id}
                            d={loc.path}
                            onMouseEnter={(e) => {
                                setTooltip({
                                    visible: true,
                                    x: e.clientX, y: e.clientY,
                                    data: { name: loc.name, total, regionFull },
                                });
                            }}
                            onMouseMove={(e) => setTooltip((p: any) => ({ ...p, x: e.clientX, y: e.clientY }))}
                            onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}
                            onClick={() => handleRegionClick(regionFull)}
                            style={{
                                fill: fillColor,
                                stroke: "#1a202c",
                                strokeWidth: 1.2,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                opacity: 0.85,
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2.5"; e.currentTarget.style.stroke = "#ffffff"; }}
                            onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1.2"; e.currentTarget.style.stroke = "#1a202c"; }}
                        />
                    );
                })}
            </svg>
            {tooltip.visible && tooltip.data && (
                <Box position="fixed" top={tooltip.y + 12} left={tooltip.x + 12} bg="gray.800" color="white" px={4} py={2} borderRadius="md" zIndex={1000} pointerEvents="none" backdropFilter="blur(4px)" bgColor="rgba(0,0,0,0.85)">
                    <Text fontWeight="bold">{tooltip.data.name}</Text>
                    <Text fontSize="sm">Legallashtiriladigan ish o‘rinlari: <strong>{tooltip.data.total.toLocaleString()}</strong></Text>
                    {tooltip.data.regionFull === "Qashqadaryo viloyati" && <Text fontSize="xs" color="brand.300">💡 Bosing – batafsil maʼlumot</Text>}
                </Box>
            )}
        </Box>
    );

    return (
        <Box>
            <Flex direction="column" gap={4}>
                <Heading as="h1" size="xl" fontWeight="bold">Legallashtiriladigan ish o‘rinlari monitoringi</Heading>
                <Text color="gray.300">2025-yil, vazirlik va qo‘mitalar kesimida. Maqsad: 1 000 000 ish o‘rnini legallashtirish.</Text>

                {/* Xarita birinchi */}
                {renderMap()}

                {/* Statistik kartalar */}
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} my={2}>
                    <Stat bg="dark.card" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><Briefcase size={20} color={brand600} /><StatLabel>Jami legallashtiriladigan ish o‘rinlari</StatLabel></Flex>
                        <StatNumber>{totalJobs.toLocaleString()}</StatNumber><StatHelpText>davlat maqsadi</StatHelpText>
                    </Stat>
                    <Stat bg="dark.card" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><TrendingUp size={20} color={green400} /><StatLabel>Eng ko‘p – {topRegion.name}</StatLabel></Flex>
                        <StatNumber>{topRegion.total.toLocaleString()}</StatNumber><StatHelpText>ish o‘rni</StatHelpText>
                    </Stat>
                    <Stat bg="dark.card" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><AlertTriangle size={20} color={yellow400} /><StatLabel>Eng kam – {bottomRegion.name}</StatLabel></Flex>
                        <StatNumber>{bottomRegion.total.toLocaleString()}</StatNumber><StatHelpText>ish o‘rni</StatHelpText>
                    </Stat>
                    <Stat bg="dark.card" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><Landmark size={20} color={brand600} /><StatLabel>Eng faol vazirlik</StatLabel></Flex>
                        <StatNumber>Soliq qo‘mitasi</StatNumber><StatHelpText>460 000 ish o‘rni</StatHelpText>
                    </Stat>
                </SimpleGrid>

                <Tabs variant="soft-rounded" colorScheme="blue" mt={4}>
                    <TabList bg="dark.card" borderRadius="xl" p={2}>
                        <Tab _selected={{ bg: brand600, color: "white" }}>Vazirliklar kesimi</Tab>
                        <Tab _selected={{ bg: brand600, color: "white" }}>Hududlar kesimi</Tab>
                        <Tab _selected={{ bg: brand600, color: "white" }}>Batafsil jadval</Tab>
                    </TabList>

                    <TabPanels mt={6}>
                        {/* Panel 1: Vazirliklar bo‘yicha taqsimot */}
                        <TabPanel p={0}>
                            <Box bg="dark.card" borderRadius="xl" p={5} mb={6}>
                                <Heading size="md" mb={4}>Vazirlik va qo‘mitalar bo‘yicha legallashtiriladigan ish o‘rinlari</Heading>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={ministryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                        <XAxis dataKey="name" tick={{ fill: "#cbd5e0", fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                                        <YAxis tick={{ fill: "#cbd5e0" }} label={{ value: "Ish o‘rinlari soni", angle: -90, position: "insideLeft", fill: "#cbd5e0" }} />
                                        <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#1a202c", border: "none" }} />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {ministryChartData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                            <TableContainer bg="dark.card" borderRadius="xl" overflowX="auto">
                                <Table variant="simple">
                                    <Thead bg="gray.800"><Tr><Th>Vazirlik / Qo‘mita</Th><Th isNumeric>Ish o‘rinlari soni</Th></Tr></Thead>
                                    <Tbody>
                                        {ministryData.map(m => (
                                            <Tr key={m.name}>
                                                <Td><Flex gap={2}><m.icon size={16} />{m.name}</Flex></Td>
                                                <Td isNumeric>{m.value.toLocaleString()}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* Panel 2: Hududlar bo‘yicha taqsimot (grafik) */}
                        <TabPanel p={0}>
                            <Box bg="dark.card" borderRadius="xl" p={5} mb={6}>
                                <Heading size="md" mb={4}>Hududlar bo‘yicha legallashtiriladigan ish o‘rinlari</Heading>
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart layout="vertical" data={regionsChartData} margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                        <XAxis type="number" tick={{ fill: "#cbd5e0" }} label={{ value: "Ish o‘rinlari soni", position: "insideBottom", offset: -5, fill: "#cbd5e0" }} />
                                        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#cbd5e0" }} />
                                        <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#1a202c", border: "none" }} />
                                        <Bar dataKey="total" fill={brand600} radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </TabPanel>

                        {/* Panel 3: Batafsil jadval (hududlar va vazirliklar kesimi) */}
                        <TabPanel p={0}>
                            <TableContainer bg="dark.card" borderRadius="xl" overflowX="auto">
                                <Table variant="simple">
                                    <Thead bg="gray.800">
                                        <Tr>
                                            <Th>Hudud</Th>
                                            <Th isNumeric>Jami</Th>
                                            <Th isNumeric>Soliq</Th>
                                            <Th isNumeric>Ijtimoiy</Th>
                                            <Th isNumeric>Bandlik</Th>
                                            <Th isNumeric>Qishloq</Th>
                                            <Th isNumeric>Transport</Th>
                                            <Th isNumeric>Qurilish</Th>
                                            <Th isNumeric>Turizm</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {regionsData.map(r => (
                                            <Tr key={r.name}>
                                                <Td fontWeight="medium">{r.name}</Td>
                                                <Td isNumeric>{r.total.toLocaleString()}</Td>
                                                <Td isNumeric>{r.soliq.toLocaleString()}</Td>
                                                <Td isNumeric>{r.ijtimoiy.toLocaleString()}</Td>
                                                <Td isNumeric>{r.bandlik.toLocaleString()}</Td>
                                                <Td isNumeric>{r.qishloq.toLocaleString()}</Td>
                                                <Td isNumeric>{r.transport.toLocaleString()}</Td>
                                                <Td isNumeric>{r.qurilish.toLocaleString()}</Td>
                                                <Td isNumeric>{r.turizm.toLocaleString()}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                {/* Xulosa */}
                <Box bg="dark.card" p={5} borderRadius="xl" mt={6}>
                    <Flex gap={3} align="center"><TrendingUp size={20} color={green400} /><Heading size="sm">Asosiy xulosalar</Heading></Flex>
                    <Text fontSize="sm" color="gray.300" mt={2}>
                        • Jami <strong>1 000 000</strong> ish o‘rnini legallashtirish rejalashtirilgan.<br />
                        • Eng ko‘p ish o‘rinlari <strong>Toshkent shahri</strong> (214 522) va <strong>Toshkent viloyati</strong> (111 630) da legallashtiriladi.<br />
                        • Eng faol vazirlik – <strong>Soliq qo‘mitasi</strong> (460 000 ish o‘rni).<br />
                        • Qishloq xo‘jaligi vazirligi (105 000) va Bandlik vazirligi (125 000) ham katta hissa qo‘shmoqda.<br />
                        • Qashqadaryo viloyati xaritasiga bossangiz, tumanlar darajasidagi maʼlumotga o‘tishingiz mumkin.
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default Work;