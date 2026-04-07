import React, { useState } from "react";
import { Box, Text, useToken } from "@chakra-ui/react";
import Uzbekistan from "@svg-maps/uzbekistan";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [tooltip, setTooltip] = useState<any>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  const [brand600] = useToken("colors", ["brand.600"]);

  // Нормализация названий регионов
  const normalizeRegionName = (name: string): string => {
    let normalized = name
      .replace(/ viloyati$/i, '')
      .replace(/ shahri$/i, '')
      .replace(/ Respublikasi$/i, '')
      .replace(/‘/g, "'")
      .trim();
    const specialMap: Record<string, string> = {
      "Toshkent": "Tashkent",
      "Samarqand": "Samarkand",
      "Buxoro": "Bukhara",
      "Qashqadaryo": "Kashkadarya",
      "Farg‘ona": "Fergana",
      "Andijon": "Andijan",
      "Surxondaryo": "Surkhandarya",
      "Jizzax": "Jizzakh",
      "Sirdaryo": "Sirdarya",
      "Navoiy": "Navoi",
      "Xorazm": "Khorezm",
      "Qoraqalpog‘iston": "Karakalpakstan",
    };
    return specialMap[normalized] || normalized;
  };

  // 4 manba (суммы в млн сум)
  const sources = {
    stateBudget: 26800000, // 26.8 трлн сум
    funds: 1200000,        // 1.2 трлн сум
    bankCredits: 140000000,// 140 трлн сум
    external: 100000000,   // 100 млрд сум (условно)
  };

  // Веса регионов
  const regionWeights: Record<string, number> = {
    Tashkent: 1.5,
    Samarkand: 1.2,
    Bukhara: 1.0,
    Kashkadarya: 2.5,
    Fergana: 1.2,
    Andijan: 1.0,
    Namangan: 1.0,
    Surkhandarya: 0.9,
    Jizzakh: 0.8,
    Sirdarya: 0.7,
    Navoi: 1.1,
    Khorezm: 0.9,
    Karakalpakstan: 1.0,
  };

  const totalWeight = Object.values(regionWeights).reduce((a, b) => a + b, 0);

  // Рассчитываем данные для каждого региона
  const regionData: Record<string, any> = {};
  Object.keys(regionWeights).forEach((key) => {
    const w = regionWeights[key];
    const state = (sources.stateBudget * w) / totalWeight;
    const funds = (sources.funds * w) / totalWeight;
    const bank = (sources.bankCredits * w) / totalWeight;
    const external = (sources.external * w) / totalWeight;
    regionData[key] = {
      state,
      funds,
      bank,
      external,
      total: state + funds + bank + external,
    };
  });

  // Для круговой диаграммы
  const pieData = Object.entries(regionData).map(([key, val]) => ({
    name: key,
    value: val.total,
  }));

  const COLORS = [
    brand600,
    "#3182CE",
    "#DD6B20",
    "#38A169",
    "#D53F8C",
    "#805AD5",
    "#00A3C4",
    "#C53030",
    "#2C7A7B",
  ];

  // Получение ключа региона по названию из SVG (с нормализацией)
  const getRegionKey = (svgName: string): string | null => {
    const normalized = normalizeRegionName(svgName);
    if (regionWeights[normalized]) return normalized;
    // Дополнительная проверка: может быть, название уже в правильном виде
    if (regionWeights[svgName]) return svgName;
    return null;
  };

  const handleRegionClick = (svgName: string) => {
    const key = getRegionKey(svgName);
    if (key === "Kashkadarya") {
      navigate("/kashkadarya");
    }
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={5}>
        Hududlar bo‘yicha moliyalashtirish
      </Text>

      {/* MAP */}
      <Box position="relative" display="flex" justifyContent="center">
        <svg viewBox={Uzbekistan.viewBox} width="80%">
          {Uzbekistan.locations.map((loc: any) => {
            const regionKey = getRegionKey(loc.name);
            const hasData = !!regionKey;
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
                    data: { ...loc, regionKey },
                  });
                }}
                onMouseMove={(e) =>
                  setTooltip((prev: any) => ({
                    ...prev,
                    x: e.clientX,
                    y: e.clientY,
                  }))
                }
                onMouseLeave={() =>
                  setTooltip({ visible: false, x: 0, y: 0, data: null })
                }
                onClick={() => handleRegionClick(loc.name)}
                style={{
                  fill: tooltip.data?.id === loc.id ? "#ffffff" : brand600,
                  stroke: "#000000",
                  strokeWidth: 1,
                  cursor: hasData ? "pointer" : "default",
                  transition: "fill 0.2s ease",
                }}
              />
            );
          })}
        </svg>

        {/* TOOLTIP */}
        {tooltip.visible && tooltip.data && tooltip.data.regionKey && (
          <Box
            position="fixed"
            top={tooltip.y + 12}
            left={tooltip.x + 12}
            bg="gray.800"
            color="white"
            px={4}
            py={2}
            borderRadius="md"
            pointerEvents="none"
            zIndex={1000}
            maxW="260px"
          >
            <Text fontWeight="bold">{tooltip.data.name}</Text>
            {regionData[tooltip.data.regionKey] && (
              <>
                <Text fontSize="sm" mt={1}>
                  Davlat budjeti:{" "}
                  {Math.round(regionData[tooltip.data.regionKey].state).toLocaleString()} mln so‘m
                </Text>
                <Text fontSize="sm">
                  Jamgʻarmalar:{" "}
                  {Math.round(regionData[tooltip.data.regionKey].funds).toLocaleString()} mln so‘m
                </Text>
                <Text fontSize="sm">
                  Bank kreditlari:{" "}
                  {Math.round(regionData[tooltip.data.regionKey].bank).toLocaleString()} mln so‘m
                </Text>
                <Text fontSize="sm">
                  Tashqi moliya:{" "}
                  {Math.round(regionData[tooltip.data.regionKey].external).toLocaleString()} mln so‘m
                </Text>
                <Text fontSize="sm" fontWeight="bold" mt={1} color={brand600}>
                  Jami:{" "}
                  {Math.round(regionData[tooltip.data.regionKey].total).toLocaleString()} mln so‘m
                </Text>
              </>
            )}
          </Box>
        )}
      </Box>

      {/* PIE CHART */}
      <Box bg="dark.card" borderRadius="xl" p={5} mt={10}>
        <ResponsiveContainer width="100%" height={600}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={250}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <ChartTooltip
              formatter={(value: any) => [
                Number(value).toLocaleString() + " mln so‘m",
                "Jami",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default DashboardPage;