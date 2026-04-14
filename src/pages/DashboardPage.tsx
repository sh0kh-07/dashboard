import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Tabs, TabList, TabPanels, Tab, TabPanel, Badge, useToken
} from "@chakra-ui/react";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
  Users, Home, Briefcase, Landmark, Activity, AlertTriangle, MapPin,
  TrendingDown, Eye, DollarSign, Percent, FileText, ShieldAlert
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
// ПОЛНЫЙ МАППИНГ НАЗВАНИЙ (все варианты -> стандартный ключ)
// ------------------------------
const nameMappings = [
  // Tashkent city
  ["Tashkent", "Tashkent"],
  ["Tashkent", "Toshkent"],
  ["Tashkent", "Toshkent shahri"],
  // Tashkent region
  ["Toshkent viloyati", "Toshkent viloyati"],
  ["Toshkent viloyati", "Toshkent vil."],
  ["Toshkent viloyati", "Tashkent region"],
  // Samarkand
  ["Samarkand", "Samarkand"],
  ["Samarkand", "Samarqand"],
  ["Samarkand", "Samarqand viloyati"],
  // Bukhara
  ["Bukhara", "Bukhara"],
  ["Bukhara", "Buxoro"],
  ["Bukhara", "Buxoro viloyati"],
  // Qashqadaryo
  ["Qashqadaryo", "Qashqadaryo"],
  ["Qashqadaryo", "Qashqadaryo viloyati"],
  ["Qashqadaryo", "Kashkadarya"],
  // Fergana
  ["Fergana", "Fergana"],
  ["Fergana", "Fargʻona"],
  ["Fergana", "Farg'ona"],
  ["Fergana", "Farg‘ona viloyati"],
  // Andijan
  ["Andijan", "Andijan"],
  ["Andijan", "Andijon"],
  ["Andijan", "Andijon viloyati"],
  // Namangan
  ["Namangan", "Namangan"],
  ["Namangan", "Namangan viloyati"],
  // Surxondaryo
  ["Surxondaryo", "Surxondaryo"],
  ["Surxondaryo", "Surxondaryo viloyati"],
  ["Surxondaryo", "Surkhandarya"],
  // Jizzakh
  ["Jizzakh", "Jizzakh"],
  ["Jizzakh", "Jizzax"],
  ["Jizzakh", "Jizzax viloyati"],
  // Sirdaryo
  ["Sirdaryo", "Sirdaryo"],
  ["Sirdaryo", "Sirdaryo viloyati"],
  ["Sirdaryo", "Sirdarya"],
  // Navoiy
  ["Navoiy", "Navoiy"],
  ["Navoiy", "Navoiy viloyati"],
  ["Navoiy", "Navoi"],
  // Xorazm
  ["Xorazm", "Xorazm"],
  ["Xorazm", "Xorazm viloyati"],
  ["Xorazm", "Khorezm"],
  // Karakalpakstan
  ["Karakalpakstan", "Karakalpakstan"],
  ["Karakalpakstan", "Qoraqalpogʻiston"],
  ["Karakalpakstan", "Qoraqalpog'iston"],
  ["Karakalpakstan", "Qoraqalpogʻiston Respublikasi"],
];

const uzbToStd = {};
const stdToDisplay = {};

nameMappings.forEach(([std, variant]) => {
  uzbToStd[variant] = std;
  if (!stdToDisplay[std]) {
    stdToDisplay[std] = variant;
  }
});

// Красивые отображаемые названия (узбекские)
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
  // Если название уже на английском и не содержит узбекских суффиксов, не трогаем
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
  // Если не нашли, возможно, это уже стандартный ключ
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

const regionsData = regionKeys.map(key => {
  const poverty = povertyRates[key];
  const unemployment = unemploymentRates[key];
  const totalPopulation = populationBase[key];
  const avgFamilySize = 4.5;
  const totalFamilies = Math.round(totalPopulation / avgFamilySize);
  const poorFamilies = Math.round(totalFamilies * (poverty / 100));
  const laborForce = Math.round(totalPopulation * 0.45);
  const employedPersons = Math.round(laborForce * (1 - unemployment / 100));
  const weight = regionWeights[key];
  const allocatedFunds = (totalAssigned * weight) / totalWeight;
  const servicesRendered = Math.round(totalPopulation * (poverty / 100) * 1.2);
  return {
    stdKey: key,
    displayName: stdToDisplay[key] || key,
    population: totalPopulation,
    families: totalFamilies,
    poorFamilies,
    povertyRate: poverty,
    unemploymentRate: unemployment,
    employed: employedPersons,
    allocatedFunds,
    servicesRendered,
  };
});

// Агрегированные данные по республике
const totalPopulation = regionsData.reduce((s, r) => s + r.population, 0);
const totalFamilies = regionsData.reduce((s, r) => s + r.families, 0);
const totalPoorFamilies = regionsData.reduce((s, r) => s + r.poorFamilies, 0);
const totalEmployed = regionsData.reduce((s, r) => s + r.employed, 0);
const totalFunds = regionsData.reduce((s, r) => s + r.allocatedFunds, 0);
const totalServices = regionsData.reduce((s, r) => s + r.servicesRendered, 0);

const avgPoverty = regionsData.reduce((s, r) => s + r.povertyRate * r.population, 0) / totalPopulation;
const avgUnemployment = regionsData.reduce((s, r) => s + r.unemploymentRate * r.population, 0) / totalPopulation;

const suspiciousContracts = [
  "Qashqadaryo: Yo'l ta'mirlash bo'yicha shubhali tender - 'Yoldi Asfalt Qilish' MCHJ 2.3 mlrd so'm",
  "Surxondaryo: Maktab qurilishi uchun ortiqcha to'lovlar (1.1 mlrd so'm)",
  "Andijon: Sog'liqni saqlash jihozlari narxining asossiz oshirilgani",
  "Toshkent sh.: 'Toza Shahar' loyihasida moliyaviy qonunbuzilishlar",
];

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
  const mapFill = "#3182CE";

  // 8 карточек для республиканского уровня (как в тултипе региона)
  const statCards = [
    { label: "Jami aholi", value: formatNumber(totalPopulation), help: "Respublika aholisi", icon: Users, color: "blue.400" },
    { label: "Jami oilalar", value: formatNumber(totalFamilies), help: "Umumiy oilalar soni", icon: Home, color: "teal.400" },
    { label: "Qashshoq oilalar", value: formatNumber(totalPoorFamilies), help: "Jami muhtoj oilalar", icon: AlertTriangle, color: "red.400" },
    { label: "Qashshoqlik darajasi", value: `${avgPoverty.toFixed(1)}%`, help: "Respublika bo'yicha o'rtacha", icon: Percent, color: "orange.400" },
    { label: "Ishsizlik darajasi", value: `${avgUnemployment.toFixed(1)}%`, help: "Respublika bo'yicha o'rtacha", icon: TrendingDown, color: "purple.400" },
    { label: "Ishga joylashtirilganlar", value: formatNumber(totalEmployed), help: "Jami bandlar soni", icon: Briefcase, color: "green.400" },
    { label: "Ajratilgan mablag'", value: formatMoney(totalFunds * 1e6), help: "Byudjet + kreditlar + investitsiyalar", icon: DollarSign, color: "yellow.600" },
    { label: "Ko'rsatilgan xizmatlar", value: formatNumber(totalServices), help: "Ijtimoiy xizmatlar soni", icon: FileText, color: "cyan.400" },
  ];

  const handleMouseEnter = (e, region) => {
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    const tw = 320, th = 380;
    if (x + tw > window.innerWidth) x = e.clientX - tw - 10;
    if (y + th > window.innerHeight) y = e.clientY - th - 10;
    setTooltip({ visible: true, x, y, data: region });
  };

  const handleMouseMove = (e, region) => {
    if (!region) return;
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    const tw = 320, th = 380;
    if (x + tw > window.innerWidth) x = e.clientX - tw - 10;
    if (y + th > window.innerHeight) y = e.clientY - th - 10;
    setTooltip(prev => ({ ...prev, x, y }));
  };

  return (
    <Box minH="100vh">
      <Flex direction="column" gap={6}>
        <Box>
          <Heading as="h1" size="2xl" mb={2} color="gray.800">Ijtimoiy himoya monitoringi</Heading>
          <Text fontSize="lg" color="gray.500">Qashshoqlik, bandlik va ijtimoiy xizmatlar integratsiyasi</Text>
        </Box>

        <Tabs variant="soft-rounded" colorScheme="blue" isLazy>
          <TabList bg="white" borderRadius="full" p={2} mb={4} maxW="max-content" boxShadow="sm">
            <Tab fontWeight="bold" _selected={{ bg: "brand.50", color: "brand.600" }}>Asosiy ko'rsatkichlar</Tab>
            <Tab fontWeight="bold" _selected={{ bg: "brand.50", color: "brand.600" }}>Hududiy tahlil (xarita)</Tab>
          </TabList>

          <TabPanels>
            {/* Первый таб: 8 карточек */}
            <TabPanel p={0}>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 4 }} spacing={6}>
                {statCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <Stat key={idx} bg="white" p={5} borderRadius="2xl" boxShadow="md" borderLeft="4px solid" borderColor={card.color}>
                      <StatLabel display="flex" alignItems="center" gap={2} fontWeight="bold" fontSize="md">
                        <Icon size={18} color={`var(--chakra-colors-${card.color})`} />
                        {card.label}
                      </StatLabel>
                      <StatNumber fontSize="2xl" my={2}>{card.value}</StatNumber>
                      <StatHelpText>{card.help}</StatHelpText>
                    </Stat>
                  );
                })}
              </SimpleGrid>

              {/* Shubhali kontraktlar bloki */}
              <Box mt={8} bg="white" p={4} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="red.100">
                <Flex align="center" gap={2} mb={3}>
                  <ShieldAlert color="red.500" size={20} />
                  <Heading size="sm" color="red.700">Shubhali kontraktlar (Red Flag)</Heading>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                  {suspiciousContracts.map((contract, idx) => (
                    <Badge key={idx} colorScheme="red" variant="subtle" p={3} borderRadius="lg" display="flex" alignItems="center" gap={2}>
                      <AlertTriangle size={14} /> {contract}
                    </Badge>
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>

            {/* Второй таб: карта */}
            <TabPanel p={0}>
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="md">
                <Flex align="center" gap={2} mb={4}>
                  <MapPin color={brand600} size={24} />
                  <Heading size="lg">O'zbekiston xaritasi — hududlar ma'lumotlari</Heading>
                </Flex>
                <Text fontSize="sm" color="gray.500" mb={6}>
                  Viloyat nomi ustiga kursorni olib boring — barcha ko'rsatkichlar chiqadi.
                </Text>

                <Box position="relative" display="flex" justifyContent="center">
                  <svg viewBox={Uzbekistan.viewBox} width="100%" style={{ maxHeight: "550px" }}>
                    {Uzbekistan.locations.map((loc) => {
                      const region = getRegionBySvgName(loc.name);
                      return (
                        <path
                          key={loc.id}
                          d={loc.path}
                          fill={region ? mapFill : "#CBD5E0"}
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

                        <Flex align="center" gap={1}><AlertTriangle size={14} /><Text fontSize="sm">Qashshoq oilalar:</Text></Flex>
                        <Text fontSize="sm" fontWeight="bold" color="red.600">{formatNumber(tooltip.data.poorFamilies)}</Text>

                        <Flex align="center" gap={1}><Percent size={14} /><Text fontSize="sm">Qashshoqlik:</Text></Flex>
                        <Text fontSize="sm" fontWeight="bold">{tooltip.data.povertyRate}%</Text>

                        <Flex align="center" gap={1}><TrendingDown size={14} /><Text fontSize="sm">Ishsizlik:</Text></Flex>
                        <Text fontSize="sm" fontWeight="bold">{tooltip.data.unemploymentRate}%</Text>

                        <Flex align="center" gap={1}><Briefcase size={14} /><Text fontSize="sm">Ishga joylashgan:</Text></Flex>
                        <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.employed)}</Text>

                        <Flex align="center" gap={1}><DollarSign size={14} /><Text fontSize="sm">Ajratilgan mablag':</Text></Flex>
                        <Text fontSize="sm" fontWeight="bold">{formatMoney(tooltip.data.allocatedFunds * 1e6)}</Text>

                        <Flex align="center" gap={1}><FileText size={14} /><Text fontSize="sm">Ko'rsatilgan xizmatlar:</Text></Flex>
                        <Text fontSize="sm" fontWeight="bold">{formatNumber(tooltip.data.servicesRendered)}</Text>
                      </SimpleGrid>
                    </Box>
                  )}
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default DashboardPage;