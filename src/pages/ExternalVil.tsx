// src/pages/KashkadaryaDistricts.tsx
import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    Flex,
    useToken,
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

import kashkadaryaMap from "../data/kashkadaryaMap"; // ваш JSON

const districtsDataRaw = [
    { name: "Qarshi shahri", budget: 285.5 },
    { name: "Shahrisabz shahri", budget: 198.3 },
    { name: "Qarshi tumani", budget: 120.5 },
    { name: "Kitob tumani", budget: 112.7 },
    { name: "Ko'kdala tumani", budget: 105.3 },
    { name: "Shaxrisabz tumani", budget: 105.3 },
    { name: "Muborak tumani", budget: 96.1 },
    { name: "Kasbi tumani", budget: 94.2 },
    { name: "G'uzor tumani", budget: 88.2 },
    { name: "Chiroqchi tumani", budget: 86.5 },
    { name: "Koson tumani", budget: 85.7 },
    { name: "Yakkabog' tumani", budget: 79.4 },
    { name: "Dehqonobod tumani", budget: 72.9 },
    { name: "Nishon tumani", budget: 68.2 },
    { name: "Qamashi tumani", budget: 63.6 },
    { name: "Mirishkor tumani", budget: 61.4 },
];

const targetKashkadaryaBudget = 18.6; // 110 * 2.5 / 14.8
const scaleFactor = targetKashkadaryaBudget / districtsDataRaw.reduce((sum, d) => sum + d.budget, 0);

const sortedDistricts = districtsDataRaw.map(d => ({
    name: d.name,
    budget: +(d.budget * scaleFactor).toFixed(1)
})).sort((a, b) => b.budget - a.budget);

const totalBudget = sortedDistricts.reduce((sum, d) => sum + d.budget, 0);

const chartData = sortedDistricts.map((item) => ({
    name: item.name.replace(" tumani", "").replace(" shahri", ""),
    budget: item.budget,
}));

const ExternalVil = () => {
    const [brand600] = useToken("colors", ["brand.600"]);
    const navigate = useNavigate();
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        name: string;
        budget: number;
    }>({
        visible: false,
        x: 0,
        y: 0,
        name: "",
        budget: 0,
    });

    const getPathStyle = (districtName: string): React.CSSProperties => ({
        fill: hoveredDistrict === districtName ? "#ffffff" : brand600,
        stroke: "#1A202C",
        strokeWidth: 1,
        cursor: "pointer",
        transition: "fill 0.2s ease",
    });

    // Обработчики событий для path (через делегирование, но с прямыми обработчиками на path)
    const handlePathMouseEnter = (
        e: React.MouseEvent<SVGPathElement>,
        districtName: string
    ) => {
        const district = sortedDistricts.find((d) => d.name === districtName);
        if (district) {
            setHoveredDistrict(districtName);
            setTooltip({
                visible: true,
                x: e.clientX + 15,
                y: e.clientY + 15,
                name: district.name,
                budget: district.budget,
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
            navigate("/external-detail/kashkadarya/mahallalar");
        }
    };

    return (
        <Box minH="100vh">
            <Flex justify="space-between" mb={6}>
                <Heading color="gray.800">Qashqadaryo viloyati</Heading>
                <Box textAlign="right">
                    <Text color="gray.600">Jami budjet</Text>
                    <Text color={brand600} fontWeight="bold">
                        {totalBudget.toFixed(1)} mlrd so'm
                    </Text>
                </Box>
            </Flex>

            {/* Карта */}
            <Box position="relative" bg="white" p={4} borderRadius="xl" mb={10}>
                <svg
                    viewBox={kashkadaryaMap.viewBox}
                    style={{ width: "80%", height: "auto", margin: "0 auto" }}
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

                {/* Модальное окно (tooltip) */}
                {tooltip.visible && (
                    <Box
                        position="fixed"
                        top={tooltip.y}
                        left={tooltip.x}
                        bg="gray.50"
                        color="gray.800"
                        px={4}
                        py={2}
                        borderRadius="lg"
                        boxShadow="xl"
                        zIndex={1000}
                        pointerEvents="none"
                        minW="160px"
                    >
                        <Text fontWeight="bold" fontSize="sm">
                            {tooltip.name}
                        </Text>
                        <Text fontSize="lg" fontWeight="extrabold" color={brand600}>
                            {tooltip.budget} mlrd so'm
                        </Text>
                    </Box>
                )}
            </Box>

            {/* График */}
            <Heading size="lg" mb={4} color="gray.800">
                Budjet taqsimoti
            </Heading>
            <Box bg="white" p={4} borderRadius="xl">
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart layout="vertical" data={chartData}>
                        <CartesianGrid stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fill: "#4a5568" }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: "#4a5568" }} />
                        <RechartsTooltip
                            formatter={(value: number) => `${value} mlrd so'm`}
                            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#1a202c" }}
                        />
                        <Bar dataKey="budget" fill={brand600} radius={[0, 8, 8, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default ExternalVil;