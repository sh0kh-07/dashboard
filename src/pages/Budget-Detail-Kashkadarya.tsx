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
  Legend,
} from "recharts";

import kashkadaryaMap from "../data/kashkadaryaMap";

// ------------------------------------------------------------
// 1. ИСХОДНЫЕ ДАННЫЕ РАЙОНОВ (пропорции и уровень бедности)
// ------------------------------------------------------------
const districtsRaw = [
  { name: "Qarshi shahri", weight: 350, poverty: 3.8 },
  { name: "Shahrisabz shahri", weight: 240, poverty: 3.5 },
  { name: "Qarshi tumani", weight: 170, poverty: 4.2 },
  { name: "Kitob tumani", weight: 148, poverty: 3.2 },
  { name: "Ko'kdala tumani", weight: 135, poverty: 4.5 },
  { name: "Shaxrisabz tumani", weight: 128, poverty: 3.9 },
  { name: "Muborak tumani", weight: 118, poverty: 3.0 },
  { name: "Kasbi tumani", weight: 108, poverty: 4.8 },
  { name: "G'uzor tumani", weight: 102, poverty: 3.7 },
  { name: "Koson tumani", weight: 92, poverty: 3.4 },
  { name: "Chiroqchi tumani", weight: 87, poverty: 4.0 },
  { name: "Yakkabog' tumani", weight: 78, poverty: 3.6 },
  { name: "Dehqonobod tumani", weight: 72, poverty: 4.3 },
  { name: "Nishon tumani", weight: 67, poverty: 3.3 },
  { name: "Qamashi tumani", weight: 55, poverty: 4.1 },
  { name: "Mirishkor tumani", weight: 50, poverty: 3.1 },
];

// Общая сумма весов
const totalWeight = districtsRaw.reduce((s, d) => s + d.weight, 0);

// ------------------------------------------------------------
// 2. БЮДЖЕТЫ ВИЛОЯТА (ВСЕГО 287.2 МЛРД)
// ------------------------------------------------------------
const totalRegionBudget = 287.2; // млрд сум

// Разбиваем на две части:
//   - Основной бюджет (например, 200 млрд)
//   - Og‘ir toifadagi mahallalar (остаток 87.2 млрд)
const mainBudgetTotal = 200.0;
const heavyBudgetTotal = totalRegionBudget - mainBudgetTotal; // 87.2

// Распределяем по районам пропорционально весам
const districtsData = districtsRaw.map(d => ({
  name: d.name,
  mainBudget: +(mainBudgetTotal * (d.weight / totalWeight)).toFixed(1),
  heavyBudget: +(heavyBudgetTotal * (d.weight / totalWeight)).toFixed(1),
  poverty: d.poverty,
}));

// Сортируем для графика по убыванию основного бюджета
const sortedDistricts = [...districtsData].sort((a, b) => b.mainBudget - a.mainBudget);

// Данные для сгруппированного графика
const chartData = sortedDistricts.map(item => ({
  name: item.name.replace(" tumani", "").replace(" shahri", ""),
  main: item.mainBudget,
  heavy: item.heavyBudget,
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
const KashkadaryaDistricts = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
    mainBudget: number;
    heavyBudget: number;
    poverty: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    mainBudget: 0,
    heavyBudget: 0,
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
        mainBudget: district.mainBudget,
        heavyBudget: district.heavyBudget,
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
    // При клике на Qarshi shahri – переход на страницу махаллей
    if (districtName === "Qarshi shahri") {
      navigate("/budget-detail/kashkadarya/mahallalar");
    }
  };

  const totalMain = districtsData.reduce((s, d) => s + d.mainBudget, 0);
  const totalHeavy = districtsData.reduce((s, d) => s + d.heavyBudget, 0);
  const totalAll = totalMain + totalHeavy;

  return (
    <Box minH="100vh">
      <Flex justify="space-between" mb={4} flexWrap="wrap" gap={2}>
        <Heading size="lg" color="gray.800">
          Qashqadaryo viloyati
        </Heading>
        <Box textAlign="right">
          <Text fontSize="sm" color="gray.600">
            Jami mablag‘lar
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
            {totalAll.toFixed(1)} mlrd so‘m
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

        {/* Правая колонка: сгруппированный график */}
        <Box bg="white" p={4} borderRadius="xl">
          <Heading size="sm" mb={3} color="gray.700">
            Mablag‘ taqsimoti (mlrd so‘m)
          </Heading>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
            >
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
              <RechartsTooltip
                formatter={(value: number, name: string) => {
                  if (name === "main") return [`${value} mlrd`, "Asosiy budjet"];
                  return [`${value} mlrd`, "Og‘ir mahallalar"];
                }}
                labelFormatter={(label) => label}
                contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="main" name="Asosiy budjet" fill={brand600} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>

      {/* Тултип при наведении */}
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
          minW="200px"
        >
          <Text fontWeight="bold" fontSize="sm">
            {tooltip.name}
          </Text>
          <Text fontSize="sm">
            💰 Asosiy: <strong>{tooltip.mainBudget} mlrd</strong>
          </Text>
          <Text fontSize="sm">
            🏚️ Og‘ir mahallalar: <strong>{tooltip.heavyBudget} mlrd</strong>
          </Text>
          <Text fontSize="sm" color="yellow.200">
            📊 Kambag‘allik: <strong>{tooltip.poverty}%</strong>
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default KashkadaryaDistricts;