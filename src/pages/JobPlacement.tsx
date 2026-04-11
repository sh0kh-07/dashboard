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
// MA'LUMOTLAR: AHOLINI DOIMIY ISH O'RINLARIGA JOYLASHTIRISH (2026)
// ------------------------------
interface RegionJobs {
    name: string;
    total: number;
    investitsiya: number;
    xizmat: number;
    qishloq: number;
    qurilish: number;
    bosh: number;
    moliya: number;
}

const regionsData: RegionJobs[] = [
    { name: "Qoraqalpogʻiston Respublikasi", total: 47738, investitsiya: 5035, xizmat: 10290, qishloq: 8070, qurilish: 1616, bosh: 7727, moliya: 15000 },
    { name: "Andijon viloyati", total: 86674, investitsiya: 12340, xizmat: 25043, qishloq: 3117, qurilish: 2798, bosh: 13376, moliya: 30000 },
    { name: "Buxoro viloyati", total: 51050, investitsiya: 6250, xizmat: 12302, qishloq: 5773, qurilish: 1682, bosh: 8043, moliya: 17000 },
    { name: "Jizzax viloyati", total: 37823, investitsiya: 5330, xizmat: 5528, qishloq: 6850, qurilish: 1225, bosh: 5890, moliya: 13000 },
    { name: "Qashqadaryo viloyati", total: 86763, investitsiya: 11977, xizmat: 20151, qishloq: 7718, qurilish: 2753, bosh: 13164, moliya: 31000 },
    { name: "Navoiy viloyati", total: 28536, investitsiya: 3977, xizmat: 6729, qishloq: 2490, qurilish: 915, bosh: 4425, moliya: 10000 },
    { name: "Namangan viloyati", total: 80325, investitsiya: 15980, xizmat: 16998, qishloq: 2271, qurilish: 2435, bosh: 11641, moliya: 31000 },
    { name: "Samarqand viloyati", total: 96702, investitsiya: 11979, xizmat: 24274, qishloq: 10251, qurilish: 3220, bosh: 15428, moliya: 31550 },
    { name: "Sirdaryo viloyati", total: 24303, investitsiya: 3285, xizmat: 4817, qishloq: 2834, qurilish: 755, bosh: 3612, moliya: 9000 },
    { name: "Surxondaryo viloyati", total: 67327, investitsiya: 7832, xizmat: 17786, qishloq: 5192, qurilish: 2207, bosh: 10310, moliya: 24000 },
    { name: "Toshkent viloyati", total: 84793, investitsiya: 11150, xizmat: 19062, qishloq: 7725, qurilish: 2731, bosh: 12625, moliya: 31500 },
    { name: "Fargʻona viloyati", total: 98205, investitsiya: 13500, xizmat: 29782, qishloq: 4309, qurilish: 3307, bosh: 15807, moliya: 31500 },
    { name: "Xorazm viloyati", total: 49653, investitsiya: 7225, xizmat: 13424, qishloq: 3400, qurilish: 1662, bosh: 7942, moliya: 16000 },
    { name: "Toshkent shahri", total: 160153, investitsiya: 14500, xizmat: 72949, qishloq: 0, qurilish: 3694, bosh: 20010, moliya: 49000 }
];

const totalJobs = 1000045;
const ministryData = [
    { name: "Investitsiya (L. Qudratov)", value: 130360, icon: Landmark, color: "#3182CE" },
    { name: "Xizmat/Servis (I. Norqulov)", value: 279135, icon: Briefcase, color: "#38A169" },
    { name: "Qishloq xoʻjaligi (I. Abduraxmonov)", value: 70000, icon: Home, color: "#DD6B20" },
    { name: "Qurilish (Sh. Xidoyatov)", value: 31000, icon: Building, color: "#805AD5" },
    { name: "Boʻsh ish oʻrinlari (B. Zaxidov)", value: 150000, icon: Users, color: "#D53F8C" },
    { name: "Moliyaviy koʻmak (T. Ishmetov)", value: 339550, icon: BookOpen, color: "#ED8936" },
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

const JobPlacement = () => {
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
            navigate("/job-placement/vil");
        }
    };

    return (
        <Box>
            <Flex direction="column" gap={4}>
                <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">Doimiy ish o‘rinlariga joylashtirish</Heading>
                <Text color="gray.600">Maqsad: {totalJobs.toLocaleString()} aholini bandligini taʼminlash.</Text>

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
                                        fill: fillColor, stroke: "#cbd5e0", strokeWidth: 1.2, cursor: "pointer",
                                        transition: "all 0.2s ease", opacity: 0.85,
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
                            <Text fontSize="sm">Ishga joylashtirish: <strong>{tooltip.data.total.toLocaleString()}</strong></Text>
                            {tooltip.data.regionFull === "Qashqadaryo viloyati" && <Text fontSize="xs" color={brand600}>💡 Bosing – batafsil maʼlumot</Text>}
                        </Box>
                    )}
                </Box>

                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} my={2}>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><Briefcase size={20} color={brand600} /><StatLabel color="gray.700">Jami maqsadli ko'rsatkich</StatLabel></Flex>
                        <StatNumber color="gray.900">{totalJobs.toLocaleString()}</StatNumber><StatHelpText color="gray.600">aholi nafar</StatHelpText>
                    </Stat>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><TrendingUp size={20} color={green400} /><StatLabel color="gray.700">Eng yuqori – {topRegion.name}</StatLabel></Flex>
                        <StatNumber color="gray.900">{topRegion.total.toLocaleString()}</StatNumber><StatHelpText color="gray.600">ish o‘rni</StatHelpText>
                    </Stat>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><AlertTriangle size={20} color={yellow400} /><StatLabel color="gray.700">Eng kam – {bottomRegion.name}</StatLabel></Flex>
                        <StatNumber color="gray.900">{bottomRegion.total.toLocaleString()}</StatNumber><StatHelpText color="gray.600">ish o‘rni</StatHelpText>
                    </Stat>
                    <Stat bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Flex align="center" gap={2}><Landmark size={20} color={brand600} /><StatLabel color="gray.700">Asosiy manba</StatLabel></Flex>
                        <StatNumber color="gray.900">Moliyaviy ko'mak</StatNumber><StatHelpText color="gray.600">339 550 ish o‘rni</StatHelpText>
                    </Stat>
                </SimpleGrid>

                <Tabs variant="soft-rounded" colorScheme="blue" mt={4}>
                    <TabList bg="white" borderRadius="xl" p={2} border="1px solid" borderColor="gray.200">
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.700">Sohalar kesimida</Tab>
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.700">Hududlar kesimida</Tab>
                        <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.700">Batafsil ma'lumot</Tab>
                    </TabList>

                    <TabPanels mt={6}>
                        <TabPanel p={0}>
                            <Box bg="white" borderRadius="xl" p={5} mb={6} border="1px solid" borderColor="gray.200" boxShadow="sm">
                                <Heading size="md" mb={4} color="gray.800">Ishga joylashtirish yo‘nalishlari va masʼullar</Heading>
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
                        </TabPanel>

                        <TabPanel p={0}>
                            <Box bg="white" borderRadius="xl" p={5} mb={6} border="1px solid" borderColor="gray.200" boxShadow="sm">
                                <Heading size="md" mb={4} color="gray.800">Hududlar kesimida ishga joylashtiriladigan aholi</Heading>
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart layout="vertical" data={regionsChartData} margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis type="number" tick={{ fill: "#4a5568" }} />
                                        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#4a5568" }} />
                                        <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1a202c" }} />
                                        <Bar dataKey="total" fill={brand600} radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </TabPanel>

                        <TabPanel p={0}>
                            <TableContainer bg="white" borderRadius="xl" overflowX="auto" border="1px solid" borderColor="gray.200">
                                <Table variant="simple" size="sm">
                                    <Thead bg="gray.50" color="gray.700">
                                        <Tr>
                                            <Th color="gray.700">Hudud</Th>
                                            <Th isNumeric color="gray.700">Jami</Th>
                                            <Th isNumeric color="gray.700">Investitsiya</Th>
                                            <Th isNumeric color="gray.700">Xizmat koʻr.</Th>
                                            <Th isNumeric color="gray.700">Qishloq x.</Th>
                                            <Th isNumeric color="gray.700">Qurilish</Th>
                                            <Th isNumeric color="gray.700">Boʻsh oʻrinlar</Th>
                                            <Th isNumeric color="gray.700">Moliya koʻmak</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {regionsData.map(r => (
                                            <Tr key={r.name}>
                                                <Td fontWeight="medium" color="gray.800">{r.name}</Td>
                                                <Td isNumeric fontWeight="bold" color={brand600}>{r.total.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.investitsiya.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.xizmat.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.qishloq.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.qurilish.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.bosh.toLocaleString()}</Td>
                                                <Td isNumeric color="gray.700">{r.moliya.toLocaleString()}</Td>
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

export default JobPlacement;