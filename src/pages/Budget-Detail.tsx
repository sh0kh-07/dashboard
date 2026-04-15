import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    useToken,
    Flex,
    Grid,
    GridItem,
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
} from "recharts";

const BudgetDetailPage = () => {
    const navigate = useNavigate();
    const [brand600] = useToken("colors", ["brand.600"]);

    const [tooltip, setTooltip] = useState<any>({
        visible: false,
        x: 0,
        y: 0,
        data: null,
    });

    // Уровень бедности (камбагаллик) по регионам
    const povertyRates: Record<string, number> = {
        Tashkent: 1.7,
        Samarkand: 2.0,
        Bukhara: 2.6,
        Kashkadarya: 3.3,
        Fergana: 2.7,
        Andijan: 2.7,
        Namangan: 2.7,
        Surkhandarya: 2.8,
        Jizzakh: 2.8,
        Sirdarya: 3.0,
        Navoi: 2.1,
        Khorezm: 3.0,
        Karakalpakstan: 3.2,
    };

    // 3 цвета для карты (зелёный/жёлтый/красный)
    const getPovertyColor = (rate: number, minVal: number, maxVal: number): string => {
        if (maxVal === minVal) return "#48BB78";
        const range = maxVal - minVal;
        const third = range / 3;
        if (rate < minVal + third) return "#48BB78";
        if (rate < minVal + 2 * third) return "#ECC94B";
        return "#F56565";
    };

    const povertyValues = Object.values(povertyRates);
    const minPoverty = Math.min(...povertyValues);
    const maxPoverty = Math.max(...povertyValues);

    // Маппинг названий регионов
    const nameMap: Record<string, string> = {
        "Toshkent": "Tashkent", "Samarqand": "Samarkand", "Buxoro": "Bukhara",
        "Qashqadaryo": "Kashkadarya", "Farg‘ona": "Fergana", "Andijon": "Andijan",
        "Namangan": "Namangan", "Surxondaryo": "Surkhandarya", "Jizzax": "Jizzakh",
        "Sirdaryo": "Sirdarya", "Navoiy": "Navoi", "Xorazm": "Khorezm",
        "Qoraqalpog‘iston": "Karakalpakstan",
        "Toshkent viloyati": "Tashkent", "Samarqand viloyati": "Samarkand",
        "Buxoro viloyati": "Bukhara", "Qashqadaryo viloyati": "Kashkadarya",
        "Farg‘ona viloyati": "Fergana", "Andijon viloyati": "Andijan",
        "Namangan viloyati": "Namangan", "Surxondaryo viloyati": "Surkhandarya",
        "Jizzax viloyati": "Jizzakh", "Sirdaryo viloyati": "Sirdarya",
        "Navoiy viloyati": "Navoi", "Xorazm viloyati": "Khorezm",
        "Qoraqalpog‘iston Respublikasi": "Karakalpakstan",
        "Tashkent": "Tashkent", "Samarkand": "Samarkand", "Bukhara": "Bukhara",
        "Kashkadarya": "Kashkadarya", "Fergana": "Fergana", "Andijan": "Andijan",
        "Namangan": "Namangan", "Surkhandarya": "Surkhandarya", "Jizzakh": "Jizzakh",
        "Sirdarya": "Sirdarya", "Navoi": "Navoi", "Khorezm": "Khorezm", "Karakalpakstan": "Karakalpakstan",
    };

    const normalizeName = (name: string): string => {
        let normalized = name
            .replace(/ viloyati$/i, '')
            .replace(/ shahri$/i, '')
            .replace(/ Respublikasi$/i, '')
            .trim();
        return normalized.replace(/‘/g, "'");
    };

    const getRegionKey = (svgName: string): string | null => {
        if (nameMap[svgName]) return nameMap[svgName];
        const normalized = normalizeName(svgName);
        if (nameMap[normalized]) return nameMap[normalized];
        if (povertyRates[normalized]) return normalized;
        return null;
    };

    // Веса регионов для распределения 1.7 трлн сум
    const weights: Record<string, number> = {
        Tashkent: 1.5, Samarkand: 1.2, Bukhara: 1.0, Kashkadarya: 2.5,
        Fergana: 1.2, Andijan: 1.0, Namangan: 1.0, Surkhandarya: 0.9,
        Jizzakh: 0.8, Sirdarya: 0.7, Navoi: 1.1, Khorezm: 0.9, Karakalpakstan: 1.0,
    };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    // Бюджет "Og‘ir toifadagi mahallalar" = 1.7 trln so‘m = 1700 mlrd
    const heavyBudgetMlrd = 1700; // млрд сум

    // Распределение по регионам
    const regionData: Record<string, { amount: number }> = {};
    Object.keys(weights).forEach(key => {
        const w = weights[key];
        regionData[key] = {
            amount: +(heavyBudgetMlrd * w / totalWeight).toFixed(1),
        };
    });

    // Данные для графика
    const chartData = Object.entries(regionData)
        .map(([name, data]) => ({ name, value: data.amount }))
        .sort((a, b) => b.value - a.value);

    // Обработчик клика по региону (только Qashqadaryo)
    const handleRegionClick = (regionKey: string) => {
        if (regionKey === "Kashkadarya") {
            navigate("/budget-detail/kashkadarya");
        }
    };

    return (
        <Box>
            <Flex alignItems="start" justifyContent="space-between" mb={4}>
                <Heading as="h1" size="lg" fontWeight="bold" color="gray.800">
                    Og‘ir toifadagi mahallalar
                </Heading>
                <Box textAlign="right">
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Jami mablag‘
                    </Text>
                    <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                        1.7 trln so‘m
                    </Text>
                </Box>
            </Flex>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                {/* Левая колонка – карта */}
                <GridItem>
                    <Box position="relative" display="flex" justifyContent="center">
                        <svg viewBox={Uzbekistan.viewBox} width="100%" style={{ cursor: "pointer" }}>
                            {Uzbekistan.locations.map((loc: any) => {
                                const regionKey = getRegionKey(loc.name);
                                const hasData = !!regionKey && povertyRates[regionKey] !== undefined;
                                let fillColor = "#CBD5E0";
                                if (hasData) {
                                    fillColor = getPovertyColor(povertyRates[regionKey], minPoverty, maxPoverty);
                                }
                                return (
                                    <path
                                        key={loc.id}
                                        d={loc.path}
                                        onMouseEnter={(e) => {
                                            if (!hasData) return;
                                            setTooltip({
                                                visible: true,
                                                x: e.clientX,
                                                y: e.clientY,
                                                data: { name: loc.name, regionKey, poverty: povertyRates[regionKey] },
                                            });
                                        }}
                                        onMouseMove={(e) =>
                                            setTooltip((prev: any) => ({ ...prev, x: e.clientX, y: e.clientY }))
                                        }
                                        onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}
                                        onClick={() => regionKey && handleRegionClick(regionKey)}
                                        style={{
                                            fill: fillColor,
                                            stroke: "#2c3e50",
                                            strokeWidth: 1,
                                            transition: "0.2s",
                                            cursor: hasData ? "pointer" : "default",
                                        }}
                                    />
                                );
                            })}
                        </svg>
                        {/* Легенда цветов */}
                        <Flex position="absolute" bottom="-30px" left="50%" transform="translateX(-50%)" gap={3} bg="white" px={3} py={1} borderRadius="full" boxShadow="sm">
                            <Flex align="center" gap={1}><Box w="14px" h="10px" bg="#48BB78" borderRadius="sm" /><Text fontSize="xs">Kam</Text></Flex>
                            <Flex align="center" gap={1}><Box w="14px" h="10px" bg="#ECC94B" borderRadius="sm" /><Text fontSize="xs">O‘rta</Text></Flex>
                            <Flex align="center" gap={1}><Box w="14px" h="10px" bg="#F56565" borderRadius="sm" /><Text fontSize="xs">Yuqori</Text></Flex>
                        </Flex>
                    </Box>
                </GridItem>

                {/* Правая колонка – график */}
                <GridItem>
                    <Box bg="white" borderRadius="xl" p={3} boxShadow="sm" border="1px solid" borderColor="gray.200" height="100%">
                        <Heading as="h2" size="sm" mb={3} color="gray.700" textAlign="center">
                            Viloyatlar bo‘yicha taqsimot (mlrd so‘m)
                        </Heading>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fontSize: 10 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                                <RechartsTooltip
                                    formatter={(value: number) => [`${value} mlrd so‘m`, "Ajratilgan mablag‘"]}
                                    labelFormatter={(label) => label}
                                    contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid #ccc" }}
                                />
                                <Bar dataKey="value" name="Og‘ir mahallalar" fill={brand600} radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </GridItem>
            </Grid>

            {/* Тултип при наведении на карту */}
            {tooltip.visible && tooltip.data && tooltip.data.regionKey && (
                <Box
                    position="fixed"
                    top={tooltip.y + 12}
                    left={tooltip.x + 12}
                    bg="gray.800"
                    color="white"
                    px={3}
                    py={2}
                    borderRadius="md"
                    pointerEvents="none"
                    zIndex={1000}
                    fontSize="sm"
                >
                    <Text fontWeight="bold">{tooltip.data.name}</Text>
                    <Text mt={1}>📊 Kambag'alik darajasi: <strong>{tooltip.data.poverty}%</strong></Text>
                    <Text>💰 Ajratilgan mablag‘: <strong>{regionData[tooltip.data.regionKey]?.amount || 0} mlrd so‘m</strong></Text>
                </Box>
            )}
        </Box>
    );
};

export default BudgetDetailPage;