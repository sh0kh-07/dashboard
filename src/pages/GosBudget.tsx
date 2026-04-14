import React, { useState } from "react";
import {
  Box,
  Text,
  useToken,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Heading,
  Container,
  Grid,
  GridItem,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Landmark, Wallet, Banknote, Globe, TrendingUp } from "lucide-react";
import Uzbekistan from "@svg-maps/uzbekistan";
import { NavLink, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Анимация для карточек
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<any>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });
  const [brand600, green400, orange400, purple400] = useToken("colors", [
    "#3182CE",
    "#38A169",
    "#DD6B20",
    "#805AD5",
  ]);

  // Normalizatsiya region nomlari
  const normalizeRegionName = (name: string): string => {
    let normalized = name
      .replace(/ viloyati$/i, "")
      .replace(/ shahri$/i, "")
      .replace(/ Respublikasi$/i, "")
      .replace(/‘/g, "'")
      .trim();
    const specialMap: Record<string, string> = {
      Toshkent: "Tashkent",
      Samarqand: "Samarkand",
      Buxoro: "Bukhara",
      Qashqadaryo: "Kashkadarya",
      "Farg‘ona": "Fergana",
      Andijon: "Andijan",
      Surxondaryo: "Surkhandarya",
      Jizzax: "Jizzakh",
      Sirdaryo: "Sirdarya",
      Navoiy: "Navoi",
      Xorazm: "Khorezm",
      "Qoraqalpog‘iston": "Karakalpakstan",
    };
    return specialMap[normalized] || normalized;
  };

  // Moliyaviy manbalar (mln so'mda)
  const sources = {
    stateBudget: 26800000, // 26.8 trln so'm
    funds: 1200000, // 1.2 trln so'm
    bankCredits: 140000000, // 140 trln so'm
    external: 100000000, // 100 mlrd so'm (shartli)
  };

  // Viloyatlar og'irlik koeffitsiyentlari
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

  // Har bir viloyat uchun mablag'lar hisobi
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

  // Doiraviy diagramma uchun ma'lumotlar
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

  const getRegionKey = (svgName: string): string | null => {
    const normalized = normalizeRegionName(svgName);
    if (regionWeights[normalized]) return normalized;
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
      {/* Kartochkalar bloki: Ajratilgan mablag‘lar */}
      <Box mb={12}>
        <Flex align="center" gap={2} mb={5}>
          <TrendingUp size={24} color={brand600} />
          <Heading as="h2" size="lg" color="gray.800">
            Ajratilgan mablag‘lar
          </Heading>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {/* 1 - Davlat byudjeti */}
          <NavLink to="/budget2">
            <Box
              bg="white"
              p={6}
              borderRadius="2xl"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
              borderLeft="6px solid"
              borderLeftColor={brand600}
              animation={`${fadeInUp} 0.5s ease-out`}
            >
              <Flex align="center" gap={3} mb={3}>
                <Icon as={Landmark} boxSize={6} color={brand600} />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Davlat byudjeti
                </Text>
              </Flex>
              <Text fontSize="3xl" fontWeight="extrabold" color="gray.900">
                26,8 trln
              </Text>
              <Text fontSize="sm" color="gray.500">
                so‘m
              </Text>
            </Box>
          </NavLink>

          {/* 2 - Davlat va maqsadli jamg‘armalar */}
          <NavLink to='/fund'>
            <Box
              bg="white"
              p={6}
              borderRadius="2xl"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
              borderLeft="6px solid"
              borderLeftColor={green400}
              animation={`${fadeInUp} 0.6s ease-out`}
            >
              <Flex align="center" gap={3} mb={3}>
                <Icon as={Wallet} boxSize={6} color={green400} />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Davlat va maqsadli jamg‘armalar
                </Text>
              </Flex>
              <Text fontSize="3xl" fontWeight="extrabold" color="gray.900">
                1,2 trln
              </Text>
              <Text fontSize="sm" color="gray.500">
                so‘m
              </Text>
            </Box>
          </NavLink>

          <NavLink to='/loans'>
            {/* 3 - Tijorat bank kreditlari */}
            <Box
              bg="white"
              p={6}
              borderRadius="2xl"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
              borderLeft="6px solid"
              borderLeftColor={orange400}
              animation={`${fadeInUp} 0.7s ease-out`}
            >
              <Flex align="center" gap={3} mb={3}>
                <Icon as={Banknote} boxSize={6} color={orange400} />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Tijorat bank kreditlari
                </Text>
              </Flex>
              <Text fontSize="3xl" fontWeight="extrabold" color="gray.900">
                140 trln
              </Text>
              <Text fontSize="sm" color="gray.500">
                so‘m
              </Text>
            </Box>
          </NavLink>

          <NavLink to='/external'>
            {/* 4 - Tashqi moliya manbalari */}
            <Box
              bg="white"
              p={6}
              borderRadius="2xl"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
              borderLeft="6px solid"
              borderLeftColor={purple400}
              animation={`${fadeInUp} 0.8s ease-out`}
            >
              <Flex align="center" gap={3} mb={3}>
                <Icon as={Globe} boxSize={6} color={purple400} />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Tashqi moliya manbalari
                </Text>
              </Flex>
              <Text fontSize="3xl" fontWeight="extrabold" color="gray.900">
                8,33 mlrd
              </Text>
              <Text fontSize="sm" color="gray.500">
                AQSH dollari
              </Text>
            </Box>
          </NavLink>

        </SimpleGrid>
      </Box>

      {/* Xarita bo‘limi */}
      <Box mb={10}>
        <Heading as="h2" size="lg" textAlign="center" mb={5} color="gray.800">
          Hududlar bo‘yicha moliyalashtirish (xarita)
        </Heading>
        <Box position="relative" display="flex" justifyContent="center">
          <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
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
                    stroke: "#2c3e50",
                    strokeWidth: 1.2,
                    transition: "fill 0.2s ease, stroke-width 0.2s",
                    cursor: hasData ? "pointer" : "default",
                  }}
                />
              );
            })}
          </svg>

          {/* Tooltip (ma'lumot oynasi) */}
          {tooltip.visible && tooltip.data && tooltip.data.regionKey && (
            <Box
              position="fixed"
              top={tooltip.y + 12}
              left={tooltip.x + 12}
              bg="gray.900"
              color="white"
              px={4}
              py={3}
              borderRadius="lg"
              boxShadow="dark-lg"
              pointerEvents="none"
              zIndex={1000}
              maxW="280px"
              backdropFilter="blur(4px)"
            >
              <Text fontWeight="bold" fontSize="md">
                {tooltip.data.name}
              </Text>
              {regionData[tooltip.data.regionKey] && (
                <>
                  <Text fontSize="sm" mt={2}>
                    Davlat byudjeti:{" "}
                    <strong>
                      {Math.round(
                        regionData[tooltip.data.regionKey].state
                      ).toLocaleString()}{" "}
                      mln so‘m
                    </strong>
                  </Text>
                  <Text fontSize="sm">
                    Jamg‘armalar:{" "}
                    <strong>
                      {Math.round(
                        regionData[tooltip.data.regionKey].funds
                      ).toLocaleString()}{" "}
                      mln so‘m
                    </strong>
                  </Text>
                  <Text fontSize="sm">
                    Bank kreditlari:{" "}
                    <strong>
                      {Math.round(
                        regionData[tooltip.data.regionKey].bank
                      ).toLocaleString()}{" "}
                      mln so‘m
                    </strong>
                  </Text>
                  <Text fontSize="sm">
                    Tashqi moliya:{" "}
                    <strong>
                      {Math.round(
                        regionData[tooltip.data.regionKey].external
                      ).toLocaleString()}{" "}
                      mln so‘m
                    </strong>
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" mt={2} color={brand600}>
                    Jami:{" "}
                    {Math.round(
                      regionData[tooltip.data.regionKey].total
                    ).toLocaleString()}{" "}
                    mln so‘m
                  </Text>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Doiraviy diagramma */}
      <Box bg="white" borderRadius="2xl" p={6} boxShadow="xl" mt={8}>
        <Heading as="h2" size="lg" textAlign="center" mb={5} color="gray.800">
          Hududlar ulushi (jami mablag‘lar asosida)
        </Heading>
        <ResponsiveContainer width="100%" height={600}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={220}
              innerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: "#718096", strokeWidth: 1 }}
              paddingAngle={2}
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <Text fontSize="sm">{value}</Text>}
            />
            <RechartsTooltip
              formatter={(value: any) => [
                Number(value).toLocaleString() + " mln so‘m",
                "Jami mablag‘",
              ]}
              contentStyle={{
                backgroundColor: "#1A202C",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Qisqa izoh */}
      <Box mt={8} textAlign="center" fontSize="sm" color="gray.500">
        <Text>
          * Qashqadaryo viloyati xaritasini bossangiz, batafsil tumanlar kesimidagi ma’lumotlarga o‘tishingiz mumkin.
        </Text>
      </Box>
    </Box>
  );
};

export default DashboardPage;