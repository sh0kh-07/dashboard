// src/pages/KashkadaryaDistricts.tsx
import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    Flex,
    useToken,
    SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";

import kashkadaryaMap from "../data/kashkadaryaMap";

// ------------------------------------------------------------
// 1. ДАННЫЕ РАЙОНОВ: веса (пропорции) и уровень бедности
// ------------------------------------------------------------
const districtsRaw = [
    { name: "Qarshi shahri", weight: 285.5, poverty: 3.8 },
    { name: "Shahrisabz shahri", weight: 198.3, poverty: 3.5 },
    { name: "Qarshi tumani", weight: 120.5, poverty: 4.2 },
    { name: "Kitob tumani", weight: 112.7, poverty: 3.2 },
    { name: "Ko'kdala tumani", weight: 105.3, poverty: 4.5 },
    { name: "Shaxrisabz tumani", weight: 105.3, poverty: 3.9 },
    { name: "Muborak tumani", weight: 96.1, poverty: 3.0 },
    { name: "Kasbi tumani", weight: 94.2, poverty: 4.8 },
    { name: "G'uzor tumani", weight: 88.2, poverty: 3.7 },
    { name: "Chiroqchi tumani", weight: 86.5, poverty: 4.0 },
    { name: "Koson tumani", weight: 85.7, poverty: 3.4 },
    { name: "Yakkabog' tumani", weight: 79.4, poverty: 3.6 },
    { name: "Dehqonobod tumani", weight: 72.9, poverty: 4.3 },
    { name: "Nishon tumani", weight: 68.2, poverty: 3.3 },
    { name: "Qamashi tumani", weight: 63.6, poverty: 4.1 },
    { name: "Mirishkor tumani", weight: 61.4, poverty: 3.1 },
];

// ------------------------------------------------------------
// 2. БЮДЖЕТ ВИЛОЯТА – 84.5 млрд сум (вместо 202.7)
// ------------------------------------------------------------
const totalRegionBudget = 84.5; // млрд сум
const totalWeight = districtsRaw.reduce((s, d) => s + d.weight, 0);

// Распределяем бюджет пропорционально весам
const districtsData = districtsRaw.map(d => ({
    name: d.name,
    budget: +(totalRegionBudget * (d.weight / totalWeight)).toFixed(1),
    poverty: d.poverty,
}));

// Сортируем для графика по убыванию бюджета
const sortedDistricts = [...districtsData].sort((a, b) => b.budget - a.budget);
const totalBudget = sortedDistricts.reduce((sum, d) => sum + d.budget, 0);

// Данные для графика (короткие названия)
const chartData = sortedDistricts.map(item => ({
    name: item.name.replace(" tumani", "").replace(" shahri", ""),
    budget: item.budget,
    fullName: item.name,
    poverty: item.poverty,
}));

// ------------------------------------------------------------
// 3. ЦВЕТ КАРТЫ ПО УРОВНЮ БЕДНОСТИ (3 цвета)
// ------------------------------------------------------------
const getPovertyColor = (poverty: number, minPov: number, maxPov: number): string => {
    if (maxPov === minPov) return "#48BB78";
    const range = maxPov - minPov;
    const third = range / 3;
    if (poverty < minPov + third) return "#48BB78";   // yashil – kam
    if (poverty < minPov + 2 * third) return "#ECC94B"; // sariq – o‘rtacha
    return "#F56565"; // qizil – yuqori
};

const povertyValues = districtsData.map(d => d.poverty);
const minPoverty = Math.min(...povertyValues);
const maxPoverty = Math.max(...povertyValues);

// ------------------------------------------------------------
// 4. КОМПОНЕНТ
// ------------------------------------------------------------
const FoundDetailKashkadarya = () => {
    const [brand600] = useToken("colors", ["brand.600"]);
    const navigate = useNavigate();
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        name: string;
        budget: number;
        poverty: number;
    }>({
        visible: false,
        x: 0,
        y: 0,
        name: "",
        budget: 0,
        poverty: 0,
    });

    const getPathStyle = (districtName: string): React.CSSProperties => {
        const district = districtsData.find(d => d.name === districtName);
        const fillColor = district
            ? getPovertyColor(district.poverty, minPoverty, maxPoverty)
            : "#CBD5E0";
        return {
            fill: hoveredDistrict === districtName ? "#ffffff" : fillColor,
            stroke: "#1A202C",
            strokeWidth: 1,
            cursor: "pointer",
            transition: "fill 0.2s ease",
        };
    };

    const handlePathMouseEnter = (
        e: React.MouseEvent<SVGPathElement>,
        districtName: string
    ) => {
        const district = districtsData.find((d) => d.name === districtName);
        if (district) {
            setHoveredDistrict(districtName);
            setTooltip({
                visible: true,
                x: e.clientX + 15,
                y: e.clientY + 15,
                name: district.name,
                budget: district.budget,
                poverty: district.poverty,
            });
        }
    };

    const handlePathMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
        if (tooltip.visible) {
            setTooltip((prev) => ({
                ...prev,
                x: e.clientX + 15,
                y: e.clientY + 15,
            }));
        }
    };

    const handlePathMouseLeave = () => {
        setHoveredDistrict(null);
        setTooltip((prev) => ({ ...prev, visible: false }));
    };

    const handlePathClick = (districtName: string) => {
        if (districtName === "Qarshi shahri") {
            navigate("/fund-detail/kashkadarya/mahallalar");
        }
    };

    return (
        <Box minH="100vh">
            <Flex justify="space-between" mb={4} flexWrap="wrap" gap={2}>
                <Box>
                    <Heading size="lg" color="gray.800">
                        Qashqadaryo viloyati – kambag‘allik va mablag‘lar
                    </Heading>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                        Tomorqa yer egalariga yengil konstruksiyali issiqxonalar o‘rnatish uchun
                    </Text>
                </Box>


                <Box textAlign="right">
                    <Text fontSize="sm" color="gray.600">Jami budjet</Text>
                    <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                        {totalBudget.toFixed(1)} mlrd so‘m
                    </Text>
                </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                {/* Левая колонка: карта */}
                <Box>
                    <Box bg="white" p={2} borderRadius="xl">
                        <svg
                            viewBox={kashkadaryaMap.viewBox}
                            style={{ width: "100%", height: "auto", cursor: "pointer" }}
                        >
                            {kashkadaryaMap.layers.map((layer: any) => (
                                <path
                                    key={layer.id}
                                    d={layer.d}
                                    data-name={layer.name}
                                    style={getPathStyle(layer.name)}
                                    onMouseEnter={(e) => handlePathMouseEnter(e, layer.name)}
                                    onMouseMove={handlePathMouseMove}
                                    onMouseLeave={handlePathMouseLeave}
                                    onClick={() => handlePathClick(layer.name)}
                                />
                            ))}
                        </svg>
                    </Box>
                    {/* Легенда цветов */}
                    <Flex justify="center" gap={4} mt={2}>
                        <Flex align="center" gap={1}>
                            <Box w="20px" h="12px" bg="#48BB78" borderRadius="sm" />
                            <Text fontSize="xs">Kam kambag‘allik</Text>
                        </Flex>
                        <Flex align="center" gap={1}>
                            <Box w="20px" h="12px" bg="#ECC94B" borderRadius="sm" />
                            <Text fontSize="xs">O‘rtacha</Text>
                        </Flex>
                        <Flex align="center" gap={1}>
                            <Box w="20px" h="12px" bg="#F56565" borderRadius="sm" />
                            <Text fontSize="xs">Yuqori kambag‘allik</Text>
                        </Flex>
                    </Flex>
                </Box>

                {/* Правая колонка: график */}
                <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
                    <Heading size="sm" mb={3} color="gray.700">
                        Budjet taqsimoti (mlrd so‘m)
                    </Heading>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart layout="vertical" data={chartData}>
                            <CartesianGrid stroke="#e2e8f0" />
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                            <RechartsTooltip
                                formatter={(value: number) => [`${value} mlrd so‘m`, "Mablag‘"]}
                                labelFormatter={(label) => {
                                    const item = chartData.find(d => d.name === label);
                                    return item ? item.fullName : label;
                                }}
                                contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid #e2e8f0" }}
                            />
                            <Bar dataKey="budget" fill={brand600} radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </SimpleGrid>

            {/* Тултип */}
            {tooltip.visible && (
                <Box
                    position="fixed"
                    top={tooltip.y}
                    left={tooltip.x}
                    bg="gray.800"
                    color="white"
                    px={4}
                    py={2}
                    borderRadius="lg"
                    boxShadow="xl"
                    zIndex={1000}
                    pointerEvents="none"
                    minW="180px"
                >
                    <Text fontWeight="bold" fontSize="sm">{tooltip.name}</Text>
                    <Text fontSize="md" fontWeight="bold" color="#90CDF4">
                        {tooltip.budget} mlrd so‘m
                    </Text>
                    <Text fontSize="sm" color="yellow.200">
                        Kambag‘allik: {tooltip.poverty}%
                    </Text>
                </Box>
            )}

            <Text fontSize="xs" color="gray.500" textAlign="center" mt={4}>
                * Qarshi shahri ustiga bossangiz, mahallalar kesimiga o‘tasiz.<br />
                ** Xarita ranglari kambag‘allik darajasiga qarab belgilanadi (yashil – kam, qizil – yuqori).
            </Text>
        </Box>
    );
};

export default FoundDetailKashkadarya;