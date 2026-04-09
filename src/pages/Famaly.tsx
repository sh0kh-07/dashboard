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
        ResponsiveContainer, CartesianGrid, Legend,
    } from "recharts";
    import {
        Users, Briefcase, TrendingUp, Scale, GraduationCap, Home, Building,
        Leaf, Pill, Camera, Laptop, Wrench, FlaskConical, AlertTriangle,
        CheckCircle,
    } from "lucide-react";

    // ------------------------------
    // HUDUDLAR RO‘YXATI (14 ta)
    // ------------------------------
    const regions = [
        "Qoraqalpogʻiston Respublikasi", "Andijon viloyati", "Buxoro viloyati",
        "Jizzax viloyati", "Qashqadaryo viloyati", "Navoiy viloyati",
        "Namangan viloyati", "Samarqand viloyati", "Sirdaryo viloyati",
        "Surxondaryo viloyati", "Toshkent viloyati", "Fargʻona viloyati",
        "Xorazm viloyati", "Toshkent shahri",
    ];

    // ------------------------------
    // 1. KAMBAGʻAL OILALAR VA XIZMATLAR (I bo‘lim)
    // ------------------------------
    interface PovertyService {
        name: string;
        totalPeople: number;
        totalFamilies: number;
        icon: any;
    }

    const services: PovertyService[] = [
        { name: "Doimiy ish oʻrinlariga joylashtirish", totalPeople: 387.9, totalFamilies: 92127, icon: Briefcase },
        { name: "Tadbirkorlikka jalb qilish", totalPeople: 354.9, totalFamilies: 84231, icon: TrendingUp },
        { name: "Kambagʻal oila daromadini oshirish", totalPeople: 176.9, totalFamilies: 42113, icon: Scale },
        { name: "Norasmiy faoliyatni legallashtirish", totalPeople: 122.2, totalFamilies: 28951, icon: CheckCircle },
        { name: "Kasb-hunarga oʻrgatish", totalPeople: 66.5, totalFamilies: 15793, icon: GraduationCap },
    ];

    const totalPoorPeople = services.reduce((sum, s) => sum + s.totalPeople, 0);
    const totalPoorFamilies = services.reduce((sum, s) => sum + s.totalFamilies, 0);

    // ------------------------------
    // 2. XAVF OSTIDAGI OILALAR VA YANGI YONDASHUVLAR (II bo‘lim)
    // ------------------------------
    interface RiskService {
        name: string;
        families: number;
        icon: any;
    }

    const riskServices: RiskService[] = [
        { name: "Tadbirkorlik infratuzilmasini rivojlantirish", families: 25000, icon: Building },
        { name: "Oʻrmon va koʻchatxonalar tashkil etish", families: 2163, icon: Leaf },
        { name: "Farmatsevtika yoʻnalishida dorivor oʻsimliklar", families: 500, icon: Pill },
        { name: "Turizm xizmatlarini rivojlantirish", families: 560, icon: Camera },
        { name: "Axborot texnologiyalariga oʻqitish", families: 5000, icon: Laptop },
        { name: "Texnikumlarda kasb-hunarga oʻqitish", families: 3652, icon: Wrench },
        { name: "Ilm-fan va texnologiyalarni rivojlantirish", families: 260, icon: FlaskConical },
    ];

    const totalRiskFamilies = riskServices.reduce((sum, s) => sum + s.families, 0);
    const newApproachFamilies = 37135;

    // ------------------------------
    // HUDUDLAR KESIMIDA MA’LUMOTLAR (xavf ostidagi oilalar soni)
    // ------------------------------
    const riskFamiliesByRegion = [
        { region: "Qoraqalpogʻiston Respublikasi", families: 2710 },
        { region: "Andijon viloyati", families: 3844 },
        { region: "Buxoro viloyati", families: 1154 },
        { region: "Jizzax viloyati", families: 1715 },
        { region: "Qashqadaryo viloyati", families: 1563 },
        { region: "Navoiy viloyati", families: 991 },
        { region: "Namangan viloyati", families: 3695 },
        { region: "Samarqand viloyati", families: 1790 },
        { region: "Sirdaryo viloyati", families: 1601 },
        { region: "Surxondaryo viloyati", families: 3367 },
        { region: "Toshkent viloyati", families: 5296 },
        { region: "Fargʻona viloyati", families: 5250 },
        { region: "Xorazm viloyati", families: 3463 },
        { region: "Toshkent shahri", families: 696 },
    ];

    // Xarita mapping
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

    const getRegionFamilies = (svgName: string): number => {
        const normalized = svgName.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').trim();
        let regionKey = regionNameMap[svgName] || regionNameMap[normalized];
        if (!regionKey) {
            const found = riskFamiliesByRegion.find(r => r.region.includes(normalized));
            if (found) return found.families;
            return 0;
        }
        const found = riskFamiliesByRegion.find(r => r.region === regionKey);
        return found ? found.families : 0;
    };

    const getRegionFullName = (svgName: string): string | null => {
        const normalized = svgName.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').trim();
        return regionNameMap[svgName] || regionNameMap[normalized] || null;
    };

    // ------------------------------
    // ASOSIY KOMPONENT
    // ------------------------------
    const PoorFamilies = () => {
        const navigate = useNavigate();
        const [brand600, red400, yellow400, green400] = useToken("colors", [
            "brand.600", "red.500", "yellow.500", "green.500",
        ]);
        const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, data: null });

        const getRegionColor = (families: number): string => {
            if (families > 4000) return "#C53030";
            if (families > 3000) return "#E53E3E";
            if (families > 2000) return "#FC8181";
            if (families > 1000) return "#FEB2B2";
            return "#FED7D7";
        };

        const serviceChartData = services.map(s => ({ name: s.name, families: s.totalFamilies }));
        const riskChartData = riskServices.map(s => ({ name: s.name.length > 20 ? s.name.slice(0, 18) + "…" : s.name, families: s.families, fullName: s.name }));

        const stats = {
            totalPoorFamilies,
            totalPoorPeople: totalPoorPeople.toFixed(1),
            totalRiskFamilies,
            newApproachFamilies,
        };

        const handleRegionClick = (regionFullName: string | null) => {
            if (regionFullName === "Qashqadaryo viloyati") {
                navigate("/family/vil");
            }
        };

        const renderMap = () => (
            <Box position="relative" display="flex" justifyContent="center" my={6}>
                <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
                    {Uzbekistan.locations.map((loc: any) => {
                        const families = getRegionFamilies(loc.name);
                        const fillColor = families > 0 ? getRegionColor(families) : "#4A5568";
                        const regionFull = getRegionFullName(loc.name);
                        return (
                            <path
                                key={loc.id}
                                d={loc.path}
                                onMouseEnter={(e) => {
                                    setTooltip({
                                        visible: true,
                                        x: e.clientX, y: e.clientY,
                                        data: { name: loc.name, families, regionFull },
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
                        <Text fontSize="sm">Xavf ostidagi oilalar: <strong>{tooltip.data.families.toLocaleString()}</strong> ta</Text>
                        {tooltip.data.regionFull === "Qashqadaryo viloyati" && <Text fontSize="xs" color="brand.300">💡 Bosing – batafsil maʼlumot</Text>}
                    </Box>
                )}
            </Box>
        );

        return (
            <Box>
                <Flex direction="column" gap={4}>
                    <Heading as="h1" size="xl" fontWeight="bold">Kambag‘al oilalarni qo‘llab-quvvatlash monitoringi</Heading>
                    <Text color="gray.300">2025-yil, 1-chorak. Mutlaq ko‘rsatkichlar (minglab aholi, oilalar soni).</Text>

                    {/* KARTA BIRINCHI */}
                    {renderMap()}

                    {/* Asosiy kartalar */}
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} my={2}>
                        <Stat bg="dark.card" p={4} borderRadius="lg">
                            <Flex align="center" gap={2}><Users size={20} color={brand600} /><StatLabel>Jami kambag‘al aholi</StatLabel></Flex>
                            <StatNumber>{stats.totalPoorPeople} ming</StatNumber><StatHelpText>1 108 400 nafar</StatHelpText>
                        </Stat>
                        <Stat bg="dark.card" p={4} borderRadius="lg">
                            <Flex align="center" gap={2}><Home size={20} color={green400} /><StatLabel>Jami kambag‘al oilalar</StatLabel></Flex>
                            <StatNumber>{stats.totalPoorFamilies.toLocaleString()}</StatNumber><StatHelpText>ta oila</StatHelpText>
                        </Stat>
                        <Stat bg="dark.card" p={4} borderRadius="lg">
                            <Flex align="center" gap={2}><AlertTriangle size={20} color={yellow400} /><StatLabel>Xavf ostidagi oilalar</StatLabel></Flex>
                            <StatNumber>{stats.totalRiskFamilies.toLocaleString()}</StatNumber><StatHelpText>daromadi pasayishi mumkin</StatHelpText>
                        </Stat>
                        <Stat bg="dark.card" p={4} borderRadius="lg">
                            <Flex align="center" gap={2}><TrendingUp size={20} color={brand600} /><StatLabel>Yangi yondashuvlar bilan qamrab olingan</StatLabel></Flex>
                            <StatNumber>{stats.newApproachFamilies.toLocaleString()}</StatNumber><StatHelpText>ta oila</StatHelpText>
                        </Stat>
                    </SimpleGrid>

                    <Tabs variant="soft-rounded" colorScheme="blue" mt={4}>
                        <TabList bg="dark.card" borderRadius="xl" p={2}>
                            <Tab _selected={{ bg: brand600, color: "white" }}>I. Kambag‘al oilalar</Tab>
                            <Tab _selected={{ bg: brand600, color: "white" }}>II. Xavf ostidagilar</Tab>
                            <Tab _selected={{ bg: brand600, color: "white" }}>Hududlar jadvali</Tab>
                        </TabList>

                        <TabPanels mt={6}>
                            {/* Panel 1: Kambag‘al oilalarga xizmatlar */}
                            <TabPanel p={0}>
                                <Box bg="dark.card" borderRadius="xl" p={5} mb={6}>
                                    <Heading size="md" mb={4}>Kambag‘al aholi daromadini oshirishga qaratilgan xizmatlar</Heading>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={serviceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                            <XAxis dataKey="name" tick={{ fill: "#cbd5e0", fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                                            <YAxis tick={{ fill: "#cbd5e0" }} label={{ value: "Oilalar soni", angle: -90, position: "insideLeft", fill: "#cbd5e0" }} />
                                            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#1a202c", border: "none" }} />
                                            <Bar dataKey="families" fill={brand600} radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                                <TableContainer bg="dark.card" borderRadius="xl" overflowX="auto">
                                    <Table variant="simple">
                                        <Thead bg="gray.800"><Tr><Th>Xizmat turi</Th><Th isNumeric>Qamrab olingan aholi (ming)</Th><Th isNumeric>Qamrab olingan oilalar</Th></Tr></Thead>
                                        <Tbody>{services.map(s => (<Tr key={s.name}><Td><Flex gap={2}><s.icon size={16} />{s.name}</Flex></Td><Td isNumeric>{s.totalPeople}</Td><Td isNumeric>{s.totalFamilies.toLocaleString()}</Td></Tr>))}</Tbody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            {/* Panel 2: Xavf ostidagi oilalar va yangi yondashuvlar */}
                            <TabPanel p={0}>
                                <Box bg="dark.card" borderRadius="xl" p={5} mb={6}>
                                    <Heading size="md" mb={4}>Yangi yondashuvlar bo‘yicha qamrab olingan oilalar</Heading>
                                    <ResponsiveContainer width="100%" height={450}>
                                        <BarChart layout="vertical" data={riskChartData} margin={{ left: 160 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                            <XAxis type="number" tick={{ fill: "#cbd5e0" }} />
                                            <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#cbd5e0", fontSize: 11 }} />
                                            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} labelFormatter={(l) => riskChartData.find(d => d.name === l)?.fullName || l} contentStyle={{ backgroundColor: "#1a202c" }} />
                                            <Bar dataKey="families" fill={brand600} radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                                <TableContainer bg="dark.card" borderRadius="xl" overflowX="auto">
                                    <Table variant="simple">
                                        <Thead bg="gray.800"><Tr><Th>Yangi yondashuv</Th><Th isNumeric>Qamrab olingan oilalar</Th></Tr></Thead>
                                        <Tbody>{riskServices.map(s => (<Tr key={s.name}><Td><Flex gap={2}><s.icon size={16} />{s.name}</Flex></Td><Td isNumeric>{s.families.toLocaleString()}</Td></Tr>))}</Tbody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            {/* Panel 3: Hududlar jadvali */}
                            <TabPanel p={0}>
                                <TableContainer bg="dark.card" borderRadius="xl" overflowX="auto">
                                    <Table variant="simple">
                                        <Thead bg="gray.800"><Tr><Th>Hudud</Th><Th isNumeric>Xavf ostidagi oilalar soni</Th></Tr></Thead>
                                        <Tbody>{riskFamiliesByRegion.map(r => (<Tr key={r.region}><Td>{r.region}</Td><Td isNumeric>{r.families.toLocaleString()}</Td></Tr>))}</Tbody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                    {/* Xulosa */}
                    <Box bg="dark.card" p={5} borderRadius="xl" mt={6}>
                        <Flex gap={3} align="center"><AlertTriangle size={20} color={yellow400} /><Heading size="sm">Asosiy xulosalar</Heading></Flex>
                        <Text fontSize="sm" color="gray.300" mt={2}>• Jami 263 ming kambag‘al oila va 48 ming xavf ostidagi oila qamrab olingan.<br />
                            • Eng samarali yo‘nalishlar: doimiy ishga joylashtirish (92 ming oila) va tadbirkorlik (84 ming oila).<br />
                            • Yangi yondashuvlardan tadbirkorlik infratuzilmasi (25 ming oila) va AT bo‘yicha oʻqitish (5 ming oila) yetakchi.<br />
                            • Xavf ostidagi oilalar eng ko‘p Toshkent viloyati (5 296), Farg‘ona (5 250) va Andijonda (3 844).</Text>
                    </Box>
                </Flex>
            </Box>
        );
    };

    export default PoorFamilies;