import React, { useState } from "react";
import {
    Box, Text, Heading, useToken, Flex, Table, Thead, Tbody, Tr, Th, Td,
    SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
    Tabs, TabList, TabPanels, Tab, TabPanel, TableContainer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
    ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { Briefcase, Building, Landmark, Home, Camera, TrendingUp, AlertTriangle, Users, BookOpen } from "lucide-react";

// ------------------------------
// MA'LUMOTLAR: KAMBAG'AL OILALARNI QAMRAB OLISH (2026)
// ------------------------------
interface RegionServices {
    name: string;
    total: number;
    ish: number;
    tadbir: number;
    daromad: number;
    legal: number;
    kasb: number;
    xavf: number;
}

const regionsData: RegionServices[] = [
    { name: "Qoraqalpogʻiston Respublikasi", total: 15947, ish: 5580, tadbir: 5105, daromad: 2551, legal: 1754, kasb: 957, xavf: 2896 },
    { name: "Andijon viloyati", total: 26009, ish: 9103, tadbir: 8322, daromad: 4162, legal: 2862, kasb: 1560, xavf: 4774 },
    { name: "Buxoro viloyati", total: 16106, ish: 5639, tadbir: 5149, daromad: 2579, legal: 1772, kasb: 967, xavf: 2931 },
    { name: "Jizzax viloyati", total: 10504, ish: 3677, tadbir: 3363, daromad: 1680, legal: 1155, kasb: 629, xavf: 1925 },
    { name: "Qashqadaryo viloyati", total: 27877, ish: 9757, tadbir: 8922, daromad: 4461, legal: 3065, kasb: 1672, xavf: 5160 },
    { name: "Navoiy viloyati", total: 5756, ish: 2015, tadbir: 1839, daromad: 922, legal: 633, kasb: 347, xavf: 1051 },
    { name: "Namangan viloyati", total: 20958, ish: 7336, tadbir: 6704, daromad: 3355, legal: 2305, kasb: 1258, xavf: 3856 },
    { name: "Samarqand viloyati", total: 30959, ish: 10834, tadbir: 9911, daromad: 4951, legal: 3404, kasb: 1859, xavf: 5680 },
    { name: "Sirdaryo viloyati", total: 7255, ish: 2540, tadbir: 2321, daromad: 1160, legal: 797, kasb: 437, xavf: 1321 },
    { name: "Surxondaryo viloyati", total: 20527, ish: 7186, tadbir: 6570, daromad: 3283, legal: 2257, kasb: 1231, xavf: 3744 },
    { name: "Toshkent viloyati", total: 21414, ish: 7495, tadbir: 6853, daromad: 3425, legal: 2357, kasb: 1284, xavf: 3933 },
    { name: "Fargʻona viloyati", total: 29178, ish: 10213, tadbir: 9333, daromad: 4670, legal: 3211, kasb: 1751, xavf: 5367 },
    { name: "Xorazm viloyati", total: 16363, ish: 5726, tadbir: 5238, daromad: 2617, legal: 1801, kasb: 981, xavf: 2955 },
    { name: "Toshkent shahri", total: 14362, ish: 5026, tadbir: 4601, daromad: 2297, legal: 1578, kasb: 860, xavf: 2628 }
];

const totalFamilies = 263215; 
const ministryData = [
    { name: "Doimiy ish oʻrni", value: 92127, icon: Building, color: "#3182CE" },
    { name: "Tadbirkorlik", value: 84231, icon: Landmark, color: "#38A169" },
    { name: "Daromadni oshirish", value: 42113, icon: TrendingUp, color: "#DD6B20" },
    { name: "Legalizatsiya", value: 28951, icon: BookOpen, color: "#805AD5" },
    { name: "Kasb-hunar", value: 15793, icon: Users, color: "#D53F8C" },
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
    const regionKey = regionNameMap[svgName] || regionNameMap[normalized];
    const found = regionsData.find(r => r.name.includes(normalized) || r.name === regionKey);
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

const PoorServices = () => {
    const navigate = useNavigate();
    const [brand600, green400, yellow400] = useToken("colors", ["brand.600", "green.500", "yellow.500"]);
    const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, data: null });

    const maxTotal = Math.max(...regionsData.map(r => r.total));
    const topRegion = regionsData.reduce((max, r) => r.total > max.total ? r : max, regionsData[0]);
    const bottomRegion = regionsData.reduce((min, r) => r.total < min.total ? r : min, regionsData[0]);

    const regionsChartData = [...regionsData].sort((a, b) => b.total - a.total).map(r => ({ name: r.name, total: r.total }));
    const ministryChartData = ministryData.map(m => ({ name: m.name, value: m.value, icon: m.icon, color: m.color }));

    const handleRegionClick = (regionFull: string | null) => {
        if (regionFull === "Qashqadaryo viloyati") {
            navigate("/poor-services/vil");
        }
    };

    return (
        <Box>
            <Flex direction="column" gap={4}>
                <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">Kambagʻal oilalarni ularning daromadini oshirishga qaratilgan xizmatlar bilan qamrab olish (2026)</Heading>
                <Text color="gray.600">Maqsadli ko'rsatkichlar: {totalFamilies.toLocaleString()} oila daromadini oshirishga ko'maklashish.</Text>

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
                                        fill: fillColor, stroke: "#1a202c", strokeWidth: 1.2, cursor: "pointer",
                                        transition: "all 0.2s ease", opacity: 0.85,
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2.5"; e.currentTarget.style.stroke = "#2b6cb0"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1.2"; e.currentTarget.style.stroke = "#1a202c"; }}
                                />
                            );
                        })}
                    </svg>
                    {tooltip.visible && tooltip.data && (
                        <Box position="fixed" top={tooltip.y + 12} left={tooltip.x + 12} bg="gray.50" color="gray.800" px={4} py={2} borderRadius="md" boxShadow="lg" border="1px solid" borderColor="gray.200" zIndex={1000} pointerEvents="none"  >
                            <Text fontWeight="bold">{tooltip.data.name}</Text>
                            <Text fontSize="sm">Qamrab olinadigan oilalar: <strong>{tooltip.data.total.toLocaleString()}</strong></Text>
                            {tooltip.data.regionFull === "Qashqadaryo viloyati" && <Text fontSize="xs" color="brand.300">💡 Bosing – batafsil maʼlumot</Text>}
                        </Box>
                    )}
                </Box>

                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} my={2}>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><Briefcase size={20} color={brand600} /><StatLabel>Jami qamrov (I. bo'lim)</StatLabel></Flex>
                        <StatNumber>{totalFamilies.toLocaleString()}</StatNumber><StatHelpText>oilalar soni</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><TrendingUp size={20} color={green400} /><StatLabel>Eng ko'p – {topRegion.name}</StatLabel></Flex>
                        <StatNumber>{topRegion.total.toLocaleString()}</StatNumber><StatHelpText>oila</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><AlertTriangle size={20} color={yellow400} /><StatLabel>Eng kam – {bottomRegion.name}</StatLabel></Flex>
                        <StatNumber>{bottomRegion.total.toLocaleString()}</StatNumber><StatHelpText>oila</StatHelpText>
                    </Stat>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
                        <Flex align="center" gap={2}><Landmark size={20} color={brand600} /><StatLabel>Asosiy yo'nalish</StatLabel></Flex>
                        <StatNumber>Ish joyi</StatNumber><StatHelpText>92 127 oila</StatHelpText>
                    </Stat>
                </SimpleGrid>

                <Tabs variant="soft-rounded" colorScheme="blue" mt={4}>
                    <TabList bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" p={2}>
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }}>Sohalar kesimida</Tab>
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }}>Hududlar kesimida</Tab>
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }}>Batafsil ma'lumot</Tab>
                    </TabList>

                    <TabPanels mt={6}>
                        <TabPanel p={0}>
                            <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" p={5} mb={6}>
                                <Heading size="md" mb={4} color="gray.800">Xizmat turlari bo'yicha taqsimot</Heading>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={ministryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                                        <YAxis tick={{ fill: "#4a5568" }} />
                                        <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {ministryChartData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </TabPanel>

                        <TabPanel p={0}>
                            <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" p={5} mb={6}>
                                <Heading size="md" mb={4} color="gray.800">Hududlar bo'yicha kambag'al oilalarni qamrab olish</Heading>
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart layout="vertical" data={regionsChartData} margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis type="number" tick={{ fill: "#4a5568" }} />
                                        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#4a5568" }} />
                                        <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                                        <Bar dataKey="total" fill={brand600} radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </TabPanel>

                        <TabPanel p={0}>
                            <TableContainer bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" overflowX="auto">
                                <Table variant="simple" size="sm">
                                    <Thead bg="gray.50" color="gray.700">
                                        <Tr>
                                            <Th color="gray.700">Hudud</Th>
                                            <Th isNumeric color="gray.700">Jami oila (I. bo'lim)</Th>
                                            <Th isNumeric color="gray.700">Ishga joy.</Th>
                                            <Th isNumeric color="gray.700">Tadbirkor</Th>
                                            <Th isNumeric color="gray.700">Daromad osh.</Th>
                                            <Th isNumeric color="gray.700">Legal</Th>
                                            <Th isNumeric color="gray.700">Kasb</Th>
                                            <Th isNumeric color="gray.700">Xavf guruhi (II. bo'lim)</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {regionsData.map(r => (
                                            <Tr key={r.name}>
                                                <Td fontWeight="medium" color="gray.800">{r.name}</Td>
                                                <Td isNumeric fontWeight="bold" color="brand.400">{r.total.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.800">{r.ish.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.800">{r.tadbir.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.800">{r.daromad.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.800">{r.legal.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.800">{r.kasb.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.600">{r.xavf.toLocaleString()}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Box>
    );
};

export default PoorServices;
