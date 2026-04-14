// src/pages/MainKashkadarya.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Flex,
  useToken,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Landmark, Wallet, CreditCard, Globe, TrendingUp } from "lucide-react";
import kashkadaryaMap from "../data/kashkadaryaMap";

// --- Старые демо-данные бюджетов районов (в млрд сум) ---
const oldDistrictsBudget = [
  { name: "Koson tumani", budget: 85.7 },
  { name: "Kasbi tumani", budget: 94.2 },
  { name: "Nishon tumani", budget: 68.2 },
  { name: "Ko'kdala tumani", budget: 105.3 },
  { name: "Shahrisabz shahri", budget: 198.3 },
  { name: "Qarshi shahri", budget: 285.5 },
  { name: "Yakkabog' tumani", budget: 79.4 },
  { name: "Mirishkor tumani", budget: 61.4 },
  { name: "G'uzor tumani", budget: 88.2 },
  { name: "Qamashi tumani", budget: 63.6 },
  { name: "Qarshi tumani", budget: 120.5 },
  { name: "Dehqonobod tumani", budget: 72.9 },
  { name: "Shaxrisabz tumani", budget: 105.3 },
  { name: "Muborak tumani", budget: 96.1 },
  { name: "Chiroqchi tumani", budget: 86.5 },
  { name: "Kitob tumani", budget: 112.7 },
];

const oldTotal = oldDistrictsBudget.reduce((s, d) => s + d.budget, 0); // 1723.8

// Новые общие суммы по направлениям (в млрд сум)
const newTotalBudget = 4530;      // 4.53 трлн сум
const newTotalFunds = 200;        // 0.20 трлн сум
const newTotalCredits = 23650;    // 23.65 трлн сум
const newTotalExternal = 16890;   // 16.89 трлн сум

// Коэффициент масштабирования для бюджетов районов
const scaleFactor = newTotalBudget / oldTotal; // ≈ 2.627

// Пересчитываем бюджеты районов
const districtsBudget = oldDistrictsBudget.map(d => ({
  name: d.name,
  budget: +(d.budget * scaleFactor).toFixed(1),
}));

// Общая сумма по бюджету (должна быть 4530)
const totalBudgetKash = districtsBudget.reduce((sum, d) => sum + d.budget, 0);

// Веса районов (доля от общего бюджета)
const districtWeights: Record<string, number> = {};
districtsBudget.forEach(d => {
  districtWeights[d.name] = d.budget / totalBudgetKash;
});

// Генерация данных для других направлений с использованием тех же весов
const generateData = (total: number, unit: string) => {
  return districtsBudget.map(d => ({
    name: d.name,
    value: +(total * districtWeights[d.name]).toFixed(1),
    unit,
  })).sort((a, b) => b.value - a.value);
};

const budgetData = districtsBudget.map(d => ({ name: d.name, value: d.budget, unit: "mlrd so‘m" })).sort((a,b)=>b.value-a.value);
const fundsData = generateData(newTotalFunds, "mlrd so‘m");
const creditsData = generateData(newTotalCredits, "mlrd so‘m");
const externalData = generateData(newTotalExternal, "mlrd so‘m"); // теперь в млрд сум, не в долларах

const MainKashkadarya = () => {
  const [brand600] = useToken("colors", ['#3182CE']);
  const [tabIndex, setTabIndex] = useState(0);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
    value: number;
    unit: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    value: 0,
    unit: "",
  });

  const navigate = useNavigate();

  const getCurrentData = () => {
    switch (tabIndex) {
      case 0: return budgetData;
      case 1: return fundsData;
      case 2: return creditsData;
      default: return externalData;
    }
  };

  const currentData = getCurrentData();

  const getDistrictValue = (districtName: string) => {
    const item = currentData.find(d => d.name === districtName);
    return item ? { value: item.value, unit: item.unit } : { value: 0, unit: "" };
  };

  const handlePathMouseEnter = (e: React.MouseEvent<SVGPathElement>, districtName: string) => {
    const { value, unit } = getDistrictValue(districtName);
    setHoveredDistrict(districtName);
    setTooltip({
      visible: true,
      x: e.clientX + 15,
      y: e.clientY + 15,
      name: districtName,
      value,
      unit,
    });
  };

  const handlePathMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
    }
  };

  const handlePathMouseLeave = () => {
    setHoveredDistrict(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handlePathClick = (districtName: string) => {
    if (districtName === "Qarshi shahri") {
      navigate("/kashkadarya/qarshi-detail");
    }
  };

  const getPathStyle = (districtName: string): React.CSSProperties => ({
    fill: hoveredDistrict === districtName ? "#ffffff" : brand600,
    stroke: "#1A202C",
    strokeWidth: 1,
    cursor: "pointer",
    transition: "fill 0.2s ease",
  });

  const chartColors = [brand600, "#3182CE", "#DD6B20", "#38A169", "#D53F8C", "#805AD5", "#00A3C4", "#C53030", "#2C7A7B", "#6B46C1", "#E53E3E", "#319795", "#D69E2E"];

  const renderBarChart = (data: any[], yLabel: string, tooltipSuffix: string) => (
    <Box bg="white" p={4} borderRadius="xl" mb={6}>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart layout="vertical" data={data} margin={{ left: 140, bottom: 20 }}>
          <CartesianGrid stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fill: "#4a5568" }} label={{ value: yLabel, position: "insideBottom", offset: -5, fill: "#4a5568" }} />
          <YAxis type="category" dataKey="name" width={130} tick={{ fill: "#4a5568", fontSize: 11 }} />
          <Tooltip formatter={(v) => `${v} ${tooltipSuffix}`} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#1a202c" }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((_, idx) => <Cell key={idx} fill={chartColors[idx % chartColors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  return (
    <Box minH="100vh">
      <Box>
        <Flex align="center" gap={3} mb={6}>
          <Icon as={TrendingUp} boxSize={7} color={brand600} />
          <Heading size="xl" color="gray.800">Qashqadaryo viloyati – moliyaviy taqsimot</Heading>
        </Flex>
        <Text color="gray.600" mb={6}>Har bir yo‘nalish bo‘yicha tuman va shaharlarga ajratilgan mablag‘lar. Xaritada ustiga bosing yoki bosing.</Text>

        <Tabs variant="soft-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex} mb={8}>
          <TabList bg="white" borderRadius="xl" p={2}>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <Flex align="center" gap={2}><Icon as={Landmark} boxSize={4} /> Davlat byudjeti</Flex>
            </Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <Flex align="center" gap={2}><Icon as={Wallet} boxSize={4} /> Jamgʻarma</Flex>
            </Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <Flex align="center" gap={2}><Icon as={CreditCard} boxSize={4} /> Kreditlar</Flex>
            </Tab>
            <Tab _selected={{ bg: "brand.50", color: "brand.600" }} color="gray.600">
              <Flex align="center" gap={2}><Icon as={Globe} boxSize={4} /> Tashqi moliya</Flex>
            </Tab>
          </TabList>

          <TabPanels mt={6}>
            {[0, 1, 2, 3].map(idx => {
              const data = idx === 0 ? budgetData : idx === 1 ? fundsData : idx === 2 ? creditsData : externalData;
              const total = idx === 0 ? totalBudgetKash : idx === 1 ? newTotalFunds : idx === 2 ? newTotalCredits : newTotalExternal;
              const unit = "mlrd so‘m";
              const label = idx === 0 ? "Davlat byudjeti" : idx === 1 ? "Jamgʻarmalar" : idx === 2 ? "Kreditlar" : "Tashqi moliya";
              return (
                <TabPanel key={idx} p={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
                    <Stat bg="white" p={5} borderRadius="xl">
                      <StatLabel color="gray.600">{label} (viloyat)</StatLabel>
                      <StatNumber fontSize="3xl" color={brand600}>
                        {idx === 0 && `${(total / 1000).toFixed(2)} trln so‘m`}
                        {idx === 1 && `${(total / 1000).toFixed(2)} trln so‘m`}
                        {idx === 2 && `${(total / 1000).toFixed(2)} trln so‘m`}
                        {idx === 3 && `${(total / 1000).toFixed(2)} trln so‘m`}
                      </StatNumber>
                    </Stat>
                  </SimpleGrid>

                  {/* Карта */}
                  <Box position="relative" bg="white" p={4} borderRadius="xl" mb={6}>
                    <svg viewBox={kashkadaryaMap.viewBox} style={{ width: "100%", height: "auto" }}>
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
                        bg="gray.50"
                        color="gray.800"
                        px={4}
                        py={2}
                        borderRadius="lg"
                        boxShadow="xl"
                        zIndex={1000}
                        pointerEvents="none"
                        minW="180px"
                      >
                        <Text fontWeight="bold" fontSize="sm">{tooltip.name}</Text>
                        <Text fontSize="lg" fontWeight="extrabold" color={brand600}>
                          {tooltip.value} {tooltip.unit}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {renderBarChart(data, unit, unit)}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>

        <Text fontSize="xs" textAlign="center" color="gray.600">
          * Qarshi shahri ustiga bosish orqali batafsil maʼlumotga o‘tishingiz mumkin.
        </Text>
      </Box>
    </Box>
  );
};

export default MainKashkadarya;