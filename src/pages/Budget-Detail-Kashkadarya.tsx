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

import kashkadaryaMap from "../data/kashkadaryaMap";

// --- Обновлённые данные районов с бюджетом (реальная сумма для Кашкадарьи 4.53 трлн = 4530 млрд) ---
// Исходные демо-данные имели сумму ~2000, умножаем на коэффициент 4530/2000 = 2.265
const districtsDataRaw = [
  { name: "Qarshi shahri", budget: 350 },
  { name: "Shahrisabz shahri", budget: 240 },
  { name: "Qarshi tumani", budget: 170 },
  { name: "Kitob tumani", budget: 148 },
  { name: "Ko'kdala tumani", budget: 135 },
  { name: "Shaxrisabz tumani", budget: 128 },
  { name: "Muborak tumani", budget: 118 },
  { name: "Kasbi tumani", budget: 108 },
  { name: "G'uzor tumani", budget: 102 },
  { name: "Koson tumani", budget: 92 },
  { name: "Chiroqchi tumani", budget: 87 },
  { name: "Yakkabog' tumani", budget: 78 },
  { name: "Dehqonobod tumani", budget: 72 },
  { name: "Nishon tumani", budget: 67 },
  { name: "Qamashi tumani", budget: 55 },
  { name: "Mirishkor tumani", budget: 50 },
];

const scaleFactor = 4530 / districtsDataRaw.reduce((sum, d) => sum + d.budget, 0); // ~2.265
const districtsData = districtsDataRaw.map(d => ({
  name: d.name,
  budget: +(d.budget * scaleFactor).toFixed(1),
}));

const sortedDistricts = [...districtsData].sort((a, b) => b.budget - a.budget);
const totalBudget = sortedDistricts.reduce((sum, d) => sum + d.budget, 0);

const chartData = sortedDistricts.map((item) => ({
  name: item.name.replace(" tumani", "").replace(" shahri", ""),
  budget: item.budget,
}));

const KashkadaryaDistricts = () => {
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
      navigate("/budget-detail/kashkadarya/mahallalar");
    }
  };

  return (
    <Box minH="100vh">
      <Flex justify="space-between" mb={6}>
        <Heading color="white">Qashqadaryo viloyati</Heading>
        <Box textAlign="right">
          <Text color="gray.400">Jami budjet</Text>
          <Text color={brand600} fontWeight="bold">
            {totalBudget.toFixed(1)} mlrd so'm
          </Text>
        </Box>
      </Flex>

      <Box position="relative" bg="gray.900" p={4} borderRadius="xl" mb={10}>
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

      <Heading size="lg" mb={4} color="white">
        Budjet taqsimoti
      </Heading>
      <Box bg="gray.900" p={4} borderRadius="xl">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart layout="vertical" data={chartData}>
            <CartesianGrid stroke="#2d3748" />
            <XAxis type="number" tick={{ fill: "#cbd5e0" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#cbd5e0" }} />
            <RechartsTooltip
              formatter={(value: number) => `${value} mlrd so'm`}
              contentStyle={{ backgroundColor: "#1a202c", border: "none", color: "white" }}
            />
            <Bar dataKey="budget" fill={brand600} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default KashkadaryaDistricts;