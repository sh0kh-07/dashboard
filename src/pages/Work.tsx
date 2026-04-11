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

const totalJobs = 1000000;
const ministryData = [
    { name: "Soliq qoʻmitasi", value: 460000, icon: Landmark, color: "#3182CE" },
    { name: "Ijtimoiy himoya agentligi", value: 100000, icon: Users, color: "#38A169" },
    { name: "Bandlik vazirligi", value: 125000, icon: Briefcase, color: "#DD6B20" },
    { name: "Qishloq xoʻjaligi vazirligi", value: 105000, icon: Home, color: "#805AD5" },
    { name: "Transport vazirligi", value: 75000, icon: Truck, color: "#D53F8C" },
    { name: "Qurilish vazirligi", value: 125000, icon: Building, color: "#ED8936" },
    { name: "Turizm qoʻmitasi", value: 10000, icon: Camera, color: "#9F7AEA" },
];

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

const getRegionColor = (total: number, maxTotal: number): string => {
    const ratio = total / maxTotal;
    if (ratio > 0.7) return "#2B6CB0";
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
                                stroke: "#cbd5e0",
                                strokeWidth: 1.2,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                opacity: 0.85,
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2.5"; e.currentTarget.style.stroke = "#4a5568"; }}
                            onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1.2"; e.currentTarget.style.stroke = "#cbd5e0"; }}
                        />
                    );
                })}
            </svg>
            {tooltip.visible && tooltip.data && (
                <Box position="fixed" top={tooltip.y + 12} left={tooltip.x + 12} bg="white" color="gray.800" px={4} py={2} borderRadius="md" boxShadow="lg" zIndex={1000} pointerEvents="none" border="1px solid" borderColor="gray.200">
                    <Text fontWeight="bold">{tooltip.data.name}</Text>
                    <Text fontSize="sm">Legallashtiriladigan ish o‘rinlari: <strong>{tooltip.data.total.toLocaleString()}</strong></Text>
                    {tooltip.data.regionFull === "Qashqadaryo viloyati" && <Text fontSize="xs" color={brand600}>💡 Bosing – batafsil maʼlumot</Text>}
                </Box>
            )}
        </Box>
    );

    return (
        <Box>
            <Flex direction="column" gap={4}>
                <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">Legallashtiriladigan ish o‘rinlari monitoringi</Heading>
                <Text color="gray.600">2025-yil, vazirlik va qo‘mitalar kesimida. Maqsad: 1 000 000 ish o‘rnini legallashtirish.</Text>

                {renderMap()}

                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} my={2}>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><Briefcase size={20} color={brand600} /><StatLabel color="gray.700">Jami legallashtiriladigan ish o‘rinlari</StatLabel></Flex>
                        <StatNumber color="gray.900">{totalJobs.toLocaleString()}</StatNumber><StatHelpText color="gray.600">davlat maqsadi</StatHelpText>
                    </Stat>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><TrendingUp size={20} color={green400} /><StatLabel color="gray.700">Eng ko‘p – {topRegion.name}</StatLabel></Flex>
                        <StatNumber color="gray.900">{topRegion.total.toLocaleString()}</StatNumber><StatHelpText color="gray.600">ish o‘rni</StatHelpText>
                    </Stat>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><AlertTriangle size={20} color={yellow400} /><StatLabel color="gray.700">Eng kam – {bottomRegion.name}</StatLabel></Flex>
                        <StatNumber color="gray.900">{bottomRegion.total.toLocaleString()}</StatNumber><StatHelpText color="gray.600">ish o‘rni</StatHelpText>
                    </Stat>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><Landmark size={20} color={brand600} /><StatLabel color="gray.700">Eng faol vazirlik</StatLabel></Flex>
                        <StatNumber color="gray.900">Soliq qo‘mitasi</StatNumber><StatHelpText color="gray.600">460 000 ish o‘rni</StatHelpText>
                    </Stat>
                </SimpleGrid>

                <Tabs variant="soft-rounded" colorScheme="blue" mt={4}>
                    <TabList bg="white" borderRadius="xl" p={2} border="1px solid" borderColor="gray.200">
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.700">Vazirliklar kesimi</Tab>
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.700">Hududlar kesimi</Tab>
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.700">Batafsil jadval</Tab>
                    </TabList>

                    <TabPanels mt={6}>
                        <TabPanel p={0}>
                            <Box bg="white" borderRadius="xl" p={5} mb={6} border="1px solid" borderColor="gray.200" boxShadow="sm">
                                <Heading size="md" mb={4} color="gray.800">Vazirlik va qo‘mitalar bo‘yicha legallashtiriladigan ish o‘rinlari</Heading>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={ministryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                                        <YAxis tick={{ fill: "#4a5568" }} label={{ value: "Ish o‘rinlari soni", angle: -90, position: "insideLeft", fill: "#4a5568" }} />
                                        <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1a202c" }} />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {ministryChartData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                            <TableContainer bg="white" borderRadius="xl" overflowX="auto" border="1px solid" borderColor="gray.200">
                                <Table variant="simple">
                                    <Thead bg="gray.50" color="gray.700">
                                        <Tr>
                                            <Th color="gray.700">Vazirlik / Qo‘mita</Th>
                                            <Th isNumeric color="gray.700">Ish o‘rinlari soni</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {ministryData.map(m => (
                                            <Tr key={m.name}>
                                                <Td color="gray.800"><Flex gap={2} color="gray.800"><m.icon size={16} />{m.name}</Flex></Td>
                                                <Td isNumeric color="gray.700">{m.value.toLocaleString()}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        <TabPanel p={0}>
                            <Box bg="white" borderRadius="xl" p={5} mb={6} border="1px solid" borderColor="gray.200" boxShadow="sm">
                                <Heading size="md" mb={4} color="gray.800">Hududlar bo‘yicha legallashtiriladigan ish o‘rinlari</Heading>
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart layout="vertical" data={regionsChartData} margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis type="number" tick={{ fill: "#4a5568" }} label={{ value: "Ish o‘rinlari soni", position: "insideBottom", offset: -5, fill: "#4a5568" }} />
                                        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#4a5568" }} />
                                        <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1a202c" }} />
                                        <Bar dataKey="total" fill={brand600} radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </TabPanel>

                        <TabPanel p={0}>
                            <TableContainer bg="white" borderRadius="xl" overflowX="auto" border="1px solid" borderColor="gray.200">
                                <Table variant="simple">
                                    <Thead bg="gray.50" color="gray.700">
                                        <Tr>
                                            <Th color="gray.700">Hudud</Th>
                                            <Th isNumeric color="gray.700">Jami</Th>
                                            <Th isNumeric color="gray.700">Soliq</Th>
                                            <Th isNumeric color="gray.700">Ijtimoiy</Th>
                                            <Th isNumeric color="gray.700">Bandlik</Th>
                                            <Th isNumeric color="gray.700">Qishloq</Th>
                                            <Th isNumeric color="gray.700">Transport</Th>
                                            <Th isNumeric color="gray.700">Qurilish</Th>
                                            <Th isNumeric color="gray.700">Turizm</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {regionsData.map(r => (
                                            <Tr key={r.name}>
                                                <Td fontWeight="medium" color="gray.800">{r.name}</Td>
                                                <Td isNumeric color="gray.700">{r.total.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.soliq.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.ijtimoiy.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.bandlik.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.qishloq.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.transport.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.qurilish.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.turizm.toLocaleString()}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                <Box bg="white" p={5} borderRadius="xl" mt={6} border="1px solid" borderColor="gray.200" boxShadow="sm">
                    <Flex gap={3} align="center"><TrendingUp size={20} color={green400} /><Heading size="sm" color="gray.800">Asosiy xulosalar</Heading></Flex>
                    <Text fontSize="sm" color="gray.600" mt={2}>
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