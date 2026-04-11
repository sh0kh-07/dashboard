import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  useToken,
  Flex,
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
  Cell,
} from "recharts";

const ExternalDetail = () => {
  const navigate = useNavigate();
  const [brand600] = useToken("colors", ["brand.600"]);

  const [tooltip, setTooltip] = useState<any>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  // Маппинг названий SVG -> ключи regionData
  const nameMap: Record<string, string> = {
    "Toshkent": "Tashkent",
    "Toshkent viloyati": "Tashkent",
    "Samarqand": "Samarkand",
    "Samarqand viloyati": "Samarkand",
    "Buxoro": "Bukhara",
    "Buxoro viloyati": "Bukhara",
    "Qashqadaryo": "Kashkadarya",
    "Qashqadaryo viloyati": "Kashkadarya",
    "Farg‘ona": "Fergana",
    "Farg‘ona viloyati": "Fergana",
    "Andijon": "Andijan",
    "Andijon viloyati": "Andijan",
    "Namangan": "Namangan",
    "Namangan viloyati": "Namangan",
    "Surxondaryo": "Surkhandarya",
    "Surxondaryo viloyati": "Surkhandarya",
    "Jizzax": "Jizzakh",
    "Jizzax viloyati": "Jizzakh",
    "Sirdaryo": "Sirdarya",
    "Sirdaryo viloyati": "Sirdarya",
    "Navoiy": "Navoi",
    "Navoiy viloyati": "Navoi",
    "Xorazm": "Khorezm",
    "Xorazm viloyati": "Khorezm",
    "Qoraqalpog‘iston": "Karakalpakstan",
    "Qoraqalpog‘iston Respublikasi": "Karakalpakstan",
  };

  // Веса регионов
  const weights: Record<string, number> = {
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
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const totalBudgetMlrd = 110; // 110 млн AQSH dollari

  // Вычисляем сумму для каждого региона
  const regionData: Record<string, { description: string; value: number }> = {
    Tashkent: { description: "Poytaxt va iqtisodiy markaz", value: +(totalBudgetMlrd * weights.Tashkent / totalWeight).toFixed(1) },
    Samarkand: { description: "Tarixiy markaz", value: +(totalBudgetMlrd * weights.Samarkand / totalWeight).toFixed(1) },
    Bukhara: { description: "Qadimiy madaniyat markazi", value: +(totalBudgetMlrd * weights.Bukhara / totalWeight).toFixed(1) },
    Kashkadarya: { description: "Sanoat faolligi", value: +(totalBudgetMlrd * weights.Kashkadarya / totalWeight).toFixed(1) },
    Fergana: { description: "Farg'ona vodiysi", value: +(totalBudgetMlrd * weights.Fergana / totalWeight).toFixed(1) },
    Andijan: { description: "Sanoat hududi", value: +(totalBudgetMlrd * weights.Andijan / totalWeight).toFixed(1) },
    Namangan: { description: "Madaniy hudud", value: +(totalBudgetMlrd * weights.Namangan / totalWeight).toFixed(1) },
    Surkhandarya: { description: "Janubiy hudud", value: +(totalBudgetMlrd * weights.Surkhandarya / totalWeight).toFixed(1) },
    Jizzakh: { description: "Markaziy hudud", value: +(totalBudgetMlrd * weights.Jizzakh / totalWeight).toFixed(1) },
    Sirdarya: { description: "Markaziy vodiy", value: +(totalBudgetMlrd * weights.Sirdarya / totalWeight).toFixed(1) },
    Navoi: { description: "Sanoat markazi", value: +(totalBudgetMlrd * weights.Navoi / totalWeight).toFixed(1) },
    Khorezm: { description: "Shimoliy hudud", value: +(totalBudgetMlrd * weights.Khorezm / totalWeight).toFixed(1) },
    Karakalpakstan: { description: "Qoraqalpog‘iston Respublikasi", value: +(totalBudgetMlrd * weights.Karakalpakstan / totalWeight).toFixed(1) },
  };

  const chartData = Object.entries(regionData)
    .map(([name, data]: any) => ({
      name: name,
      value: data.value,
      description: data.description,
    }))
    .sort((a, b) => b.value - a.value);

  const barColors = [
    brand600,
    "#3182CE",
    "#DD6B20",
    "#38A169",
    "#D53F8C",
    "#805AD5",
    "#00A3C4",
    "#C53030",
    "#2C7A7B",
    "#6B46C1",
    "#E53E3E",
    "#319795",
    "#D69E2E",
  ];

  const normalizeName = (name: string): string => {
    let normalized = name
      .replace(/ viloyati$/i, '')
      .replace(/ shahri$/i, '')
      .replace(/ Respublikasi$/i, '')
      .trim();
    normalized = normalized.replace(/‘/g, "'");
    return normalized;
  };

  const getRegionKey = (svgName: string): string | null => {
    if (nameMap[svgName]) return nameMap[svgName];
    const normalized = normalizeName(svgName);
    if (nameMap[normalized]) return nameMap[normalized];
    if (regionData[normalized]) return normalized;
    console.warn(`Region not mapped: "${svgName}" (normalized: "${normalized}")`);
    return null;
  };

  const handleRegionClick = (locId: string) => {
    if (locId === "qashqadaryo") {
      navigate("/external-detail/kashkadarya");
    }
  };

  return (
    <Box>
      <Flex alignItems="start" justifyContent="space-between" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
          Kichik quyosh elektr stansiyalarini o‘rnatish
        </Heading>
        <Box>
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            Jami mablag‘
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
            110 mln AQSH dollari
          </Text>
        </Box>
      </Flex>

      <Text fontSize="md" color="gray.600" mb={8}>
        Tiklanish va taraqqiyot jamg‘armasi hisobidan kichik quyosh elektr stansiyalarini o‘rnatish loyihasi.
        Viloyatlar kesimida ajratilgan mablag‘lar xaritada va diagrammada keltirilgan.
      </Text>

      {/* Карта */}
      <Box position="relative" display="flex" justifyContent="center" mb={12}>
        <svg viewBox={Uzbekistan.viewBox} width="70%">
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
                onClick={() => handleRegionClick(loc.id)}
                style={{
                  fill: tooltip.data?.id === loc.id ? "#ffffff" : brand600,
                  stroke: "#000000",
                  strokeWidth: 1,
                  cursor: hasData ? "pointer" : "default",
                  transition: "0.2s",
                }}
              />
            );
          })}
        </svg>

        {tooltip.visible && tooltip.data && tooltip.data.regionKey && (
          <Box
            position="fixed"
            top={tooltip.y + 12}
            left={tooltip.x + 12}
            bg="gray.50"
            color="gray.800"
            px={4}
            py={2}
            borderRadius="md"
            pointerEvents="none"
            zIndex={1000}
            maxW="260px"
          >
            <Text fontWeight="bold">{tooltip.data.name}</Text>
            <Text fontSize="sm" mt={1}>
              {regionData[tooltip.data.regionKey]?.description || "Ta'rif mavjud emas"}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={brand600} mt={1}>
              Ajratilgan mablag‘: {regionData[tooltip.data.regionKey]?.value || 0} mln $
            </Text>
          </Box>
        )}
      </Box>

      {/* График */}
      <Box mt={8}>
        <Heading as="h2" size="lg" mb={4} color="gray.800">
          Viloyatlar kesimida taqsimot (mln AQSH dollari)
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={6}>
          Quyosh elektr stansiyalari uchun ajratilgan mablag‘lar viloyatlar ehtiyojiga qarab taqsimlanadi.
        </Text>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              label={{ value: "mln AQSH dollari", position: "insideBottom", offset: -5, fill: "#4a5568" }}
              tick={{ fill: "#4a5568" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#4a5568" }}
              width={100}
            />
            <RechartsTooltip
              formatter={(value: number) => [`${value} mln $`, "Ajratilgan mablag‘"]}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.name === label);
                return `${label} - ${item?.description || ""}`;
              }}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                color: "#1a202c",
              }}
              itemStyle={{ color: "#1a202c" }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Text fontSize="xs" color="gray.600" mt={4}>
          *Eslatma: Raqamlar namunaviy, real taqsimot loyiha hujjatlarida belgilanadi.
          Eng ko‘p mablag‘ Toshkent, Samarqand va Farg‘ona viloyatlariga yo‘naltirilgan.
        </Text>
      </Box>
    </Box>
  );
};

export default ExternalDetail;