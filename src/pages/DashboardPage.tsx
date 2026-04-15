import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Badge, useToken, GridItem, VStack, HStack
} from "@chakra-ui/react";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
  Users, Home, Briefcase, AlertTriangle, MapPin,
  TrendingDown, DollarSign, Percent, FileText, ShieldAlert
} from "lucide-react";

// ------------------------------
// ФОРМАТИРОВАНИЕ
// ------------------------------
const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) return "0";
  return new Intl.NumberFormat('ru-RU').format(Math.round(num));
};

const formatMoney = (num) => {
  if (isNaN(num) || num === undefined || num === null) return "0";
  if (num >= 1e12) return (num / 1e12).toFixed(1) + " trln";
  if (num >= 1e9) return (num / 1e9).toFixed(1) + " mlrd";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + " mln";
  return formatNumber(num);
};

// ------------------------------
// МАППИНГ НАЗВАНИЙ
// ------------------------------
const nameMappings = [
  ["Tashkent", "Tashkent"], ["Tashkent", "Toshkent"], ["Tashkent", "Toshkent shahri"],
  ["Toshkent viloyati", "Toshkent viloyati"], ["Toshkent viloyati", "Toshkent vil."], ["Toshkent viloyati", "Tashkent region"],
  ["Samarkand", "Samarkand"], ["Samarkand", "Samarqand"], ["Samarkand", "Samarqand viloyati"],
  ["Bukhara", "Bukhara"], ["Bukhara", "Buxoro"], ["Bukhara", "Buxoro viloyati"],
  ["Qashqadaryo", "Qashqadaryo"], ["Qashqadaryo", "Qashqadaryo viloyati"], ["Qashqadaryo", "Kashkadarya"],
  ["Fergana", "Fergana"], ["Fergana", "Fargʻona"], ["Fergana", "Farg'ona"], ["Fergana", "Farg‘ona viloyati"],
  ["Andijan", "Andijan"], ["Andijan", "Andijon"], ["Andijan", "Andijon viloyati"],
  ["Namangan", "Namangan"], ["Namangan", "Namangan viloyati"],
  ["Surxondaryo", "Surxondaryo"], ["Surxondaryo", "Surxondaryo viloyati"], ["Surxondaryo", "Surkhandarya"],
  ["Jizzakh", "Jizzakh"], ["Jizzakh", "Jizzax"], ["Jizzakh", "Jizzax viloyati"],
  ["Sirdaryo", "Sirdaryo"], ["Sirdaryo", "Sirdaryo viloyati"], ["Sirdaryo", "Sirdarya"],
  ["Navoiy", "Navoiy"], ["Navoiy", "Navoiy viloyati"], ["Navoiy", "Navoi"],
  ["Xorazm", "Xorazm"], ["Xorazm", "Xorazm viloyati"], ["Xorazm", "Khorezm"],
  ["Karakalpakstan", "Karakalpakstan"], ["Karakalpakstan", "Qoraqalpogʻiston"], ["Karakalpakstan", "Qoraqalpog'iston"], ["Karakalpakstan", "Qoraqalpogʻiston Respublikasi"],
];

const uzbToStd = {};
const stdToDisplay = {};

nameMappings.forEach(([std, variant]) => {
  uzbToStd[variant] = std;
  if (!stdToDisplay[std]) stdToDisplay[std] = variant;
});

stdToDisplay["Tashkent"] = "Toshkent shahri";
stdToDisplay["Toshkent viloyati"] = "Toshkent viloyati";
stdToDisplay["Samarkand"] = "Samarqand";
stdToDisplay["Bukhara"] = "Buxoro";
stdToDisplay["Qashqadaryo"] = "Qashqadaryo";
stdToDisplay["Fergana"] = "Farg'ona";
stdToDisplay["Andijan"] = "Andijon";
stdToDisplay["Namangan"] = "Namangan";
stdToDisplay["Surxondaryo"] = "Surxondaryo";
stdToDisplay["Jizzakh"] = "Jizzax";
stdToDisplay["Sirdaryo"] = "Sirdaryo";
stdToDisplay["Navoiy"] = "Navoiy";
stdToDisplay["Xorazm"] = "Xorazm";
stdToDisplay["Karakalpakstan"] = "Qoraqalpog'iston";

const normalizeName = (n) => {
  const uzbSuffixes = ['viloyati', 'shahri', 'vil.', 'Respublikasi'];
  let normalized = n;
  for (const suffix of uzbSuffixes) {
    if (normalized.toLowerCase().includes(suffix.toLowerCase())) {
      normalized = normalized.replace(new RegExp(`\\s*${suffix}$`, 'i'), '').trim();
      break;
    }
  }
  return normalized;
};

const getStdKeyFromSvgName = (svgName) => {
  const norm = normalizeName(svgName);
  if (uzbToStd[norm]) return uzbToStd[norm];
  if (norm === "Aral Sea") return null;
  if (regionKeys.includes(norm)) return norm;
  return null;
};

// ------------------------------
// ДАННЫЕ ПО РЕГИОНАМ
// ------------------------------
const regionKeys = [
  "Tashkent", "Toshkent viloyati", "Samarkand", "Bukhara", "Qashqadaryo",
  "Fergana", "Andijan", "Namangan", "Surxondaryo", "Jizzakh", "Sirdaryo",
  "Navoiy", "Xorazm", "Karakalpakstan"
];

const povertyRates = {
  "Tashkent": 1.7, "Toshkent viloyati": 2.6, "Samarkand": 2.0, "Bukhara": 2.6,
  "Qashqadaryo": 3.3, "Fergana": 2.7, "Andijan": 2.7, "Namangan": 2.7,
  "Surxondaryo": 2.8, "Jizzakh": 2.8, "Sirdaryo": 3.0, "Navoiy": 2.1,
  "Xorazm": 3.0, "Karakalpakstan": 3.2
};

const unemploymentRates = {
  "Tashkent": 3.8, "Toshkent viloyati": 4.5, "Samarkand": 4.5, "Bukhara": 4.5,
  "Qashqadaryo": 5.0, "Fergana": 4.5, "Andijan": 4.5, "Namangan": 4.6,
  "Surxondaryo": 4.6, "Jizzakh": 4.6, "Sirdaryo": 4.6, "Navoiy": 3.9,
  "Xorazm": 4.5, "Karakalpakstan": 4.8
};

const sources = {
  stateBudget: 26800000,
  funds: 1200000,
  bankCredits: 140000000,
  external: 100000000,
};
const totalAssigned = sources.stateBudget + sources.funds + sources.bankCredits + sources.external;

const regionWeights = {
  "Tashkent": 1.5, "Toshkent viloyati": 1.5, "Samarkand": 1.2, "Bukhara": 1.0,
  "Qashqadaryo": 2.5, "Fergana": 1.2, "Andijan": 1.0, "Namangan": 1.0,
  "Surxondaryo": 0.9, "Jizzakh": 0.8, "Sirdaryo": 0.7, "Navoiy": 1.1,
  "Xorazm": 0.9, "Karakalpakstan": 1.0
};
const totalWeight = Object.values(regionWeights).reduce((a, b) => a + b, 0);

const populationBase = {
  "Tashkent": 2600000, "Toshkent viloyati": 2900000, "Samarkand": 3900000, "Bukhara": 1900000,
  "Qashqadaryo": 3300000, "Fergana": 3800000, "Andijan": 3300000, "Namangan": 2800000,
  "Surxondaryo": 2700000, "Jizzakh": 1400000, "Sirdaryo": 880000, "Navoiy": 1000000,
  "Xorazm": 1900000, "Karakalpakstan": 1900000
};

const avgFamilySize = 4.5;

const regionsData = regionKeys.map(key => {
  const poverty = povertyRates[key];
  const unemployment = unemploymentRates[key];
  const totalPopulation = populationBase[key];
  const totalFamilies = Math.round(totalPopulation / avgFamilySize);
  const poorFamilies = Math.round(totalFamilies * (poverty / 100));
  const laborForce = Math.round(totalPopulation * 0.45);
  const employedPersons = Math.round(laborForce * (1 - unemployment / 100));
  const unemployedPersons = laborForce - employedPersons;
  const employmentRate = (1 - unemployment / 100) * 100;
  const weight = regionWeights[key];
  const allocatedFunds = (totalAssigned * weight) / totalWeight;
  const servicesRendered = Math.round(totalPopulation * (poverty / 100) * 1.2);
  const isDifficult = poverty >= 3.0;
  return {
    stdKey: key,
    displayName: stdToDisplay[key] || key,
    population: totalPopulation,
    families: totalFamilies,
    poorFamilies,
    povertyRate: poverty,
    unemploymentRate: unemployment,
    unemployed: unemployedPersons,
    employmentRate: employmentRate,
    employed: employedPersons,
    allocatedFunds,
    servicesRendered,
    isDifficult,
  };
});

// Агрегированные данные
const totalPopulation = regionsData.reduce((s, r) => s + r.population, 0);
const totalFamilies = regionsData.reduce((s, r) => s + r.families, 0);
const totalPoorFamilies = regionsData.reduce((s, r) => s + r.poorFamilies, 0);
const totalEmployed = regionsData.reduce((s, r) => s + r.employed, 0);
const totalFunds = regionsData.reduce((s, r) => s + r.allocatedFunds, 0);
const totalServices = regionsData.reduce((s, r) => s + r.servicesRendered, 0);

const avgPoverty = regionsData.reduce((s, r) => s + r.povertyRate * r.population, 0) / totalPopulation;
const avgUnemployment = regionsData.reduce((s, r) => s + r.unemploymentRate * r.population, 0) / totalPopulation;
const difficultRegionsCount = regionKeys.filter(key => povertyRates[key] >= 3.0).length;

const suspiciousContracts = [
  "Kambag'al oilalar",
  "Kambag'allik darajasi",
  "Ishsizlik darajasi",
  "Ishga joylashtirilganlar",
  "Ogʻir toifadagi hududlar",
  "Ajratilgan mablag'",
  "Ko'rsatilgan xizmatlar"
];

// ------------------------------
// ФУНКЦИЯ ЦВЕТА НА ОСНОВЕ УРОВНЯ БЕДНОСТИ (3 ЦВЕТА)
// ------------------------------
const getPovertyColor = (povertyRate, minPoverty, maxPoverty) => {
  if (maxPoverty === minPoverty) return "#48BB78";
  const range = maxPoverty - minPoverty;
  const third = range / 3;
  if (povertyRate < minPoverty + third) return "#48BB78"; // зелёный
  if (povertyRate < minPoverty + 2 * third) return "#ECC94B"; // жёлтый
  return "#F56565"; // красный
};

const getRegionBySvgName = (svgName) => {
  const stdKey = getStdKeyFromSvgName(svgName);
  if (!stdKey) return null;
  return regionsData.find(r => r.stdKey === stdKey);
};

// ------------------------------
// КОМПОНЕНТ
// ------------------------------
const DashboardPage = () => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const [brand600] = useToken("colors", ["brand.600"]);

  // Определяем минимальный и максимальный уровень бедности для динамической раскраски
  const povertyValues = regionsData.map(r => r.povertyRate);
  const minPoverty = Math.min(...povertyValues);
  const maxPoverty = Math.max(...povertyValues);

  const statCards = [
    { label: "Kambag'al oilalar", value: formatNumber(totalPoorFamilies), help: "Jami muhtoj oilalar", icon: AlertTriangle, color: "red.400" },
    { label: "Kambag'allik darajasi", value: `${avgPoverty.toFixed(1)}%`, help: "Respublika bo'yicha o'rtacha", icon: Percent, color: "orange.400" },
    { label: "Ishsizlik darajasi", value: `${avgUnemployment.toFixed(1)}%`, help: "Respublika bo'yicha o'rtacha", icon: TrendingDown, color: "purple.400" },
    { label: "Ishga joylashtirilganlar", value: formatNumber(totalEmployed), help: "Jami bandlar soni", icon: Briefcase, color: "green.400" },
    { label: "Ogʻir toifadagi hududlar", value: difficultRegionsCount, help: "Ogʻir toifadagi hududlar", icon: MapPin, color: "red.500" },
    { label: "Ajratilgan mablag'", value: formatMoney(totalFunds * 1e6), help: "Byudjet + kreditlar + investitsiyalar", icon: DollarSign, color: "yellow.600" },
    { label: "Ko'rsatilgan xizmatlar", value: formatNumber(totalServices), help: "Ijtimoiy xizmatlar soni", icon: FileText, color: "cyan.400" },
  ];

  const handleMouseEnter = (e, region) => {
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    const tw = 320, th = 420;
    if (x + tw > window.innerWidth) x = e.clientX - tw - 10;
    if (y + th > window.innerHeight) y = e.clientY - th - 10;
    setTooltip({ visible: true, x, y, data: region });
  };

  const handleMouseMove = (e, region) => {
    if (!region) return;
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    const tw = 320, th = 420;
    if (x + tw > window.innerWidth) x = e.clientX - tw - 10;
    if (y + th > window.innerHeight) y = e.clientY - th - 10;
    setTooltip(prev => ({ ...prev, x, y }));
  };

  return (
    <Box minH="100vh">
      <Flex direction="column" gap={'10px'}>
        <Flex gap={'10px'}>
          {/* Левая колонка: карта */}
          <GridItem w={'60%'}>
            <Box bg="white" borderRadius="2xl" p={'10px'} boxShadow="md" height="%">
              <Flex align="center" justify="space-between" mb={4} flexWrap="wrap" gap={2}>
                <Heading size="12px">O'zbekiston xaritasi — hududlar ma'lumotlari</Heading>
                {/* Легенда цветов */}
                <HStack spacing={3}>
                  <HStack spacing={1}>
                    <Box w="20px" h="12px" bg="#48BB78" borderRadius="sm" />
                    <Text fontSize="xs">Kam kambag'allik</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Box w="20px" h="12px" bg="#ECC94B" borderRadius="sm" />
                    <Text fontSize="xs">O‘rtacha kambag'allik</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Box w="20px" h="12px" bg="#F56565" borderRadius="sm" />
                    <Text fontSize="xs">Yuqori kambag'alik</Text>
                  </HStack>
                </HStack>
              </Flex>
              <Box position="relative" display="flex" justifyContent="center">
                <svg viewBox={Uzbekistan.viewBox} width="100%" style={{ maxHeight: "550px" }}>
                  {Uzbekistan.locations.map((loc) => {
                    const region = getRegionBySvgName(loc.name);
                    let fillColor = "#CBD5E0"; // цвет для неподписанных областей
                    if (region) {
                      fillColor = getPovertyColor(region.povertyRate, minPoverty, maxPoverty);
                    }
                    return (
                      <path
                        key={loc.id}
                        d={loc.path}
                        fill={fillColor}
                        fillOpacity={region ? 0.85 : 0.2}
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                        cursor={region ? "pointer" : "default"}
                        onMouseEnter={(e) => region && handleMouseEnter(e, region)}
                        onMouseMove={(e) => region && handleMouseMove(e, region)}
                        onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}
                        style={{ transition: "all 0.2s ease" }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.fillOpacity = "1";
                          e.currentTarget.style.stroke = "#2C5282";
                          e.currentTarget.style.strokeWidth = "3";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.fillOpacity = region ? "0.85" : "0.2";
                          e.currentTarget.style.stroke = "#FFFFFF";
                          e.currentTarget.style.strokeWidth = "1.5";
                        }}
                      />
                    );
                  })}
                </svg>
                {tooltip.visible && tooltip.data && (
                  <Box
                    position="fixed"
                    top={tooltip.y}
                    left={tooltip.x}
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    boxShadow="2xl"
                    zIndex={1000}
                    border="1px solid"
                    borderColor="gray.200"
                    minW="280px"
                    maxW="320px"
                  >
                    <Text fontWeight="extrabold" fontSize="lg" mb={2} color="brand.600">
                      {tooltip.data.displayName}
                    </Text>
                    <SimpleGrid columns={2} spacingX={3} spacingY={2} mb={2}>
                      <Flex align="center" gap={1}><Users size={14} /><Text fontSize="sm">Aholi:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.population)}</Text>

                      <Flex align="center" gap={1}><Home size={14} /><Text fontSize="sm">Oilalar:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.families)}</Text>

                      <Flex align="center" gap={1}><Home size={14} /><Text fontSize="sm">Jami honodon:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.families)}</Text>

                      <Flex align="center" gap={1}><AlertTriangle size={14} /><Text fontSize="sm">Kambag'al oilalar:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold" color="red.600">{formatNumber(tooltip.data.poorFamilies)}</Text>

                      <Flex align="center" gap={1}><Percent size={14} /><Text fontSize="sm">Kambag'allik:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{tooltip.data.povertyRate}%</Text>

                      <Flex align="center" gap={1}><TrendingDown size={14} /><Text fontSize="sm">Ishsizlik:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{tooltip.data.unemploymentRate}%</Text>

                      <Flex align="center" gap={1}><TrendingDown size={14} /><Text fontSize="sm">Ishsizlar soni:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.unemployed)}</Text>

                      <Flex align="center" gap={1}><Briefcase size={14} /><Text fontSize="sm">Bandlik darajasi:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{tooltip.data.employmentRate.toFixed(1)}%</Text>

                      <Flex align="center" gap={1}><Briefcase size={14} /><Text fontSize="sm">Ishga joylashgan:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.employed)}</Text>

                      <Flex align="center" gap={1}><DollarSign size={14} /><Text fontSize="sm">Ajratilgan mablag':</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{formatMoney(tooltip.data.allocatedFunds * 1e6)}</Text>

                      <Flex align="center" gap={1}><FileText size={14} /><Text fontSize="sm">Ko'rsatilgan xizmatlar:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.servicesRendered)}</Text>

                      <Flex align="center" gap={1}><MapPin size={14} /><Text fontSize="sm">Og'ir hudud:</Text></Flex>
                      <Text fontSize="sm" fontWeight="bold" color={tooltip.data.povertyRate >= 3 ? "red.600" : "green.600"}>
                        {tooltip.data.povertyRate >= 3 ? "Ha" : "Yo'q"}
                      </Text>
                    </SimpleGrid>
                  </Box>
                )}
              </Box>
            </Box>
          </GridItem>

          {/* Правая колонка: карточки статистики */}
          <GridItem w={'40%'}>
            <VStack spacing={'10px'} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={'5px'}>
                {statCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <Stat key={idx} bg="white" p={'10px'} borderRadius="2xl" boxShadow="md" borderLeft="4px solid" borderColor={card.color}>
                      <StatLabel display="flex" alignItems="center" gap={2} fontWeight="bold" fontSize="sm">
                        <Icon size={16} color={`var(--chakra-colors-${card.color})`} />
                        {card.label}
                      </StatLabel>
                      <StatNumber fontSize="xl" my={1}>{card.value}</StatNumber>
                      <StatHelpText fontSize="xs">{card.help}</StatHelpText>
                    </Stat>
                  );
                })}
              </SimpleGrid>
            </VStack>
          </GridItem>
        </Flex>

        {/* Блок подозрительных контрактов */}
        <Box bg="white" p={'5px'} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="red.100">
          <Flex align="center" gap={2} mb={3}>
            <ShieldAlert color="red.500" size={20} />
            <Heading size="sm" color="red.700">Aniqlangan kamchilik (Red Flag) – 7 ta yoʻnalish boʻyicha</Heading>
          </Flex>
          <VStack spacing={3} align="stretch">
            {suspiciousContracts.map((contract, idx) => (
              <Badge key={idx} colorScheme="red" variant="subtle" p={3} borderRadius="lg" display="flex" alignItems="center" gap={2}>
                <AlertTriangle size={14} /> {contract}
              </Badge>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardPage;