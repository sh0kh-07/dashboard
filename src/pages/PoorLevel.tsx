import React, { useState } from "react";
import {
  Box, Text, Heading, useToken, Tabs, TabList, TabPanels, Tab, TabPanel,
  Alert, AlertIcon, AlertTitle, List, ListItem, ListIcon, SimpleGrid, Stat, StatLabel, StatNumber, Progress, Badge, Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import { AlertTriangle, TrendingDown } from "lucide-react";

// ------------------------------------------------------------
// 1. ДАННЫЕ ПО РЕГИОНАМ (основные – копия из исходника)
// ------------------------------------------------------------
const regions = [
  "Qoraqalpogʻiston Respublikasi", "Andijon viloyati", "Buxoro viloyati",
  "Jizzax viloyati", "Qashqadaryo viloyati", "Navoiy viloyati",
  "Namangan viloyati", "Samarqand viloyati", "Sirdaryo viloyati",
  "Surxondaryo viloyati", "Toshkent viloyati", "Fargʻona viloyati",
  "Xorazm viloyati", "Toshkent shahri",
];

interface RegionMain {
  name: string;
  povertyRate: number;
  annualPlan: number;
  actual: number;
  percentAchieved: number;
}

const generateMainData = (): RegionMain[] => {
  const basePoorRates: Record<string, number> = {
    "Qoraqalpogʻiston Respublikasi": 12.5, "Andijon viloyati": 14.2, "Buxoro viloyati": 8.3,
    "Jizzax viloyati": 15.1, "Qashqadaryo viloyati": 16.4, "Navoiy viloyati": 6.9,
    "Namangan viloyati": 13.8, "Samarqand viloyati": 11.2, "Sirdaryo viloyati": 14.5,
    "Surxondaryo viloyati": 17.2, "Toshkent viloyati": 9.4, "Fargʻona viloyati": 12.9,
    "Xorazm viloyati": 13.1, "Toshkent shahri": 4.5,
  };
  const totalPop: Record<string, number> = {
    "Qoraqalpogʻiston Respublikasi": 1950, "Andijon viloyati": 3300, "Buxoro viloyati": 1950,
    "Jizzax viloyati": 1450, "Qashqadaryo viloyati": 3350, "Navoiy viloyati": 1050,
    "Namangan viloyati": 2950, "Samarqand viloyati": 4050, "Sirdaryo viloyati": 880,
    "Surxondaryo viloyati": 2750, "Toshkent viloyati": 2950, "Fargʻona viloyati": 3950,
    "Xorazm viloyati": 1950, "Toshkent shahri": 2950,
  };
  const avgFamilySize = 5.2;
  return regions.map(name => {
    const povertyRate = basePoorRates[name];
    const totalPopVal = totalPop[name];
    const totalFamilies = Math.round(totalPopVal / avgFamilySize);
    const poorFamilies = Math.round(totalFamilies * povertyRate / 100);
    const annualPlan = Math.round(poorFamilies * 0.3);
    const actual = Math.round(annualPlan * (0.25 + Math.random() * 0.2));
    const percentAchieved = Math.min(100, Math.round((actual / annualPlan) * 100));
    return { name, povertyRate, annualPlan, actual, percentAchieved };
  });
};
const mainData = generateMainData();

// Данные для вкладки 2 (Davlat taʼminoti)
interface CategoryItem {
  region: string;
  families: number;
  annualPlan: number;
  actual: number;
  percent: number;
}
const generateCategoryData = (multiplier: number): CategoryItem[] =>
  mainData.map(r => {
    const families = Math.round(r.povertyRate * 10 * multiplier);
    const annualPlan = Math.round(families * 0.25);
    const actual = Math.round(annualPlan * (0.2 + Math.random() * 0.3));
    const percent = Math.min(100, Math.round((actual / annualPlan) * 100));
    return { region: r.name, families, annualPlan, actual, percent };
  });
const stateSupportData = generateCategoryData(0.12);
const poorFamilyCategoryData = generateCategoryData(0.65);

// Данные для вкладки 4 (Kambag‘allik chegarasidagi oilalar) – количество семей (тыс.)
const generatePovertyLineData = () => {
  const baseLineRates: Record<string, number> = {
    "Qoraqalpogʻiston Respublikasi": 8.5, "Andijon viloyati": 9.2, "Buxoro viloyati": 6.3,
    "Jizzax viloyati": 9.8, "Qashqadaryo viloyati": 10.1, "Navoiy viloyati": 5.2,
    "Namangan viloyati": 8.9, "Samarqand viloyati": 7.8, "Sirdaryo viloyati": 9.5,
    "Surxondaryo viloyati": 10.8, "Toshkent viloyati": 6.9, "Fargʻona viloyati": 8.4,
    "Xorazm viloyati": 8.7, "Toshkent shahri": 3.2,
  };
  const totalPop: Record<string, number> = {
    "Qoraqalpogʻiston Respublikasi": 1950, "Andijon viloyati": 3300, "Buxoro viloyati": 1950,
    "Jizzax viloyati": 1450, "Qashqadaryo viloyati": 3350, "Navoiy viloyati": 1050,
    "Namangan viloyati": 2950, "Samarqand viloyati": 4050, "Sirdaryo viloyati": 880,
    "Surxondaryo viloyati": 2750, "Toshkent viloyati": 2950, "Fargʻona viloyati": 3950,
    "Xorazm viloyati": 1950, "Toshkent shahri": 2950,
  };
  const avgFamilySize = 5.2;
  return regions.map(name => {
    const rate = baseLineRates[name];
    const totalPopVal = totalPop[name];
    const families = Math.round(totalPopVal / avgFamilySize);
    const poorFamilies = Math.round(families * rate / 100);
    const annualPlan = Math.round(poorFamilies * 0.2);
    const actual = Math.round(annualPlan * (0.25 + Math.random() * 0.25));
    const percent = Math.min(100, Math.round((actual / annualPlan) * 100));
    return { name, familiesCount: poorFamilies, annualPlan, actual, percent };
  });
};
const povertyLineData = generatePovertyLineData();

// ------------------------------------------------------------
// 2. НАПРАВЛЕНИЯ ДЛЯ ВКЛАДКИ 5 (12 пунктов)
// ------------------------------------------------------------
interface Direction {
  name: string;
  annualPlan: number;
  actual: number;
  percent: number;
}
const directions: Direction[] = [
  { name: "Doimiy ish oʻrinlariga joylashtirish", annualPlan: 92127, actual: 31000, percent: 33.6 },
  { name: "Tadbirkorlikka jalb qilish", annualPlan: 84231, actual: 27500, percent: 32.7 },
  { name: "Kambag‘al oila daromadini oshirish", annualPlan: 42113, actual: 14200, percent: 33.7 },
  { name: "Norasmiy faoliyatni legallashtirish", annualPlan: 28951, actual: 8800, percent: 30.4 },
  { name: "Kasb-hunarga oʻqitish orqali bandlik", annualPlan: 15793, actual: 5300, percent: 33.6 },
  { name: "Tadbirkorlik infratuzilmasini rivojlantirish", annualPlan: 25000, actual: 7200, percent: 28.8 },
  { name: "Oʻrmon va koʻchatxonalar tashkil etish", annualPlan: 2163, actual: 650, percent: 30.1 },
  { name: "Farmasevtika sohasida kooperatsiya", annualPlan: 3500, actual: 1200, percent: 34.3 },
  { name: "Turizm xizmatlarini rivojlantirish", annualPlan: 4200, actual: 1450, percent: 34.5 },
  { name: "AT va zamonaviy kasblarga oʻqitish", annualPlan: 5000, actual: 1900, percent: 38.0 },
  { name: "Texnikumlarda kasb-hunarga oʻqitish", annualPlan: 8700, actual: 2800, percent: 32.2 },
  { name: "Ilm-fan va texnologiyalarni rivojlantirish", annualPlan: 3100, actual: 980, percent: 31.6 },
];
const totalAnnualPlan = directions.reduce((s, d) => s + d.annualPlan, 0);
const totalActual = directions.reduce((s, d) => s + d.actual, 0);
const totalPercent = (totalActual / totalAnnualPlan) * 100;

// ------------------------------------------------------------
// 3. МАППИНГ НАЗВАНИЙ РЕГИОНОВ ДЛЯ КАРТЫ
// ------------------------------------------------------------
const regionNameMap: Record<string, string> = {
  "Karakalpakstan": "Qoraqalpogʻiston Respublikasi", "Qoraqalpog‘iston": "Qoraqalpogʻiston Respublikasi",
  "Andijan": "Andijon viloyati", "Bukhara": "Buxoro viloyati", "Jizzakh": "Jizzax viloyati",
  "Qashqadaryo": "Qashqadaryo viloyati", "Kashkadarya": "Qashqadaryo viloyati",
  "Navoi": "Navoiy viloyati", "Namangan": "Namangan viloyati", "Samarkand": "Samarqand viloyati",
  "Sirdaryo": "Sirdaryo viloyati", "Surxondaryo": "Surxondaryo viloyati",
  "Toshkent viloyati": "Toshkent viloyati", "Fergana": "Fargʻona viloyati", "Xorazm": "Xorazm viloyati",
  "Tashkent": "Toshkent shahri",
};

const getRegionFullName = (svgName: string): string | null => {
  if (regionNameMap[svgName]) return regionNameMap[svgName];
  const normalized = svgName.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').replace(/[‘ʻ]/g, "'").trim();
  for (const [key, value] of Object.entries(regionNameMap)) {
    const keyNorm = key.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').replace(/[‘ʻ]/g, "'").trim();
    if (keyNorm === normalized) return value;
  }
  return null;
};

// ------------------------------------------------------------
// 4. ФУНКЦИИ ЦВЕТА (3 цвета)
// ------------------------------------------------------------
const getColorByPercent = (percent: number): string => {
  if (percent >= 60) return "#48BB78";
  if (percent >= 30) return "#ECC94B";
  return "#F56565";
};
const getColorByPoverty = (poverty: number): string => {
  if (poverty < 6) return "#48BB78";
  if (poverty < 12) return "#ECC94B";
  return "#F56565";
};

// ------------------------------------------------------------
// 5. КОМПОНЕНТ КАРТЫ С ТУЛТИПОМ
// ------------------------------------------------------------
interface MapWithTooltipProps {
  getColor: (regionFull: string) => string;
  getTooltip: (regionFull: string) => React.ReactNode;
}
const MapWithTooltip: React.FC<MapWithTooltipProps> = ({ getColor, getTooltip }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; content: React.ReactNode }>({
    visible: false, x: 0, y: 0, content: null,
  });
  const navigate = useNavigate();
  const handleClick = (regionFull: string | null) => {
    if (regionFull === "Qashqadaryo viloyati") navigate("/poor-level/vil");
  };
  return (
    <Box position="relative" display="flex" justifyContent="center" my={6}>
      <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
        {Uzbekistan.locations.map((loc: any) => {
          const regionFull = getRegionFullName(loc.name);
          const fillColor = regionFull ? getColor(regionFull) : "#CBD5E0";
          return (
            <path
              key={loc.id}
              d={loc.path}
              onMouseEnter={(e) => {
                if (!regionFull) return;
                setTooltip({ visible: true, x: e.clientX, y: e.clientY, content: getTooltip(regionFull) });
              }}
              onMouseMove={(e) => setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }))}
              onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, content: null })}
              onClick={() => handleClick(regionFull)}
              style={{ fill: fillColor, stroke: "#1a202c", strokeWidth: 1.2, cursor: "pointer", opacity: 0.85 }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2.5"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1.2"; }}
            />
          );
        })}
      </svg>
      {tooltip.visible && tooltip.content && (
        <Box position="fixed" top={tooltip.y + 12} left={tooltip.x + 12} bg="white" px={4} py={2} borderRadius="md" boxShadow="lg" zIndex={1000} pointerEvents="none">
          {tooltip.content}
        </Box>
      )}
    </Box>
  );
};

// ------------------------------------------------------------
// 6. ОСНОВНОЙ КОМПОНЕНТ (6 вкладок)
// ------------------------------------------------------------
const PovertyDashboard = () => {
  // Красные флаги для каждой вкладки
  const mainRedFlags = mainData.filter(r => r.percentAchieved < 30 || r.povertyRate > 15)
    .map(r => `${r.name}: kambag‘allik ${r.povertyRate}%, reestr chiqarish ${r.percentAchieved}%`);
  const supportRedFlags = stateSupportData.filter(d => d.percent < 25).map(d => `${d.region}: ${d.percent}%`);
  const poorRedFlags = poorFamilyCategoryData.filter(d => d.percent < 25).map(d => `${d.region}: ${d.percent}%`);
  const lineRedFlags = povertyLineData.filter(d => d.percent < 25).map(d => `${d.name}: ${d.percent}% (${d.familiesCount} ming oila)`);
  const dirRedFlags = directions.filter(d => d.percent < 30).map(d => `${d.name}: ${d.percent}%`);

  // Общий Red flag (вкладка 6)
  const allRedFlags = [
    ...mainRedFlags.map(f => `[Kambag'allik] ${f}`),
    ...supportRedFlags.map(f => `[Davlat ta'minoti] ${f}`),
    ...poorRedFlags.map(f => `[Kambag'al oila] ${f}`),
    ...lineRedFlags.map(f => `[Chegaradagilar] ${f}`),
    ...dirRedFlags.map(f => `[Yo'nalishlar] ${f}`),
  ];

  return (
    <Box>
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList bg="white" borderRadius="xl" p={2} flexWrap="wrap" gap={2}>
          <Tab>1. Kambag'allik darajasi (%)</Tab>
          <Tab>2. Davlat taʼminotidagi oila</Tab>
          <Tab>3. Kambag'al oila</Tab>
          <Tab>4. Chegaradagi oilalar (ming)</Tab>
          <Tab>5. Reyestr chiqarish yo'nalishlari</Tab>
          <Tab>6. Aniqlangan kamchilik </Tab>
        </TabList>

        <TabPanels mt={6}>
          {/* TAB 1 – проценты */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md" mb={2}>Kambag‘allik darajasi (%) va reyestr chiqarish</Heading>
              <MapWithTooltip
                getColor={(region) => getColorByPoverty(mainData.find(r => r.name === region)?.povertyRate || 0)}
                getTooltip={(region) => {
                  const d = mainData.find(r => r.name === region);
                  if (!d) return null;
                  return (<>
                    <Text fontWeight="bold">{region}</Text>
                    <Text>Kambag‘allik: {d.povertyRate}%</Text>
                    <Text>Reja (yillik): {d.annualPlan.toLocaleString()}%</Text>
                    <Text>Amalda (4 oy): {d.actual.toLocaleString()}%</Text>
                    <Text fontWeight="bold">Bajarilish: {d.percentAchieved}%</Text>
                  </>);
                }}
              />
              <Alert status="error" borderRadius="lg" mt={6}><AlertIcon /><AlertTitle>Aniqlangan kamchiliklar</AlertTitle><List>{mainRedFlags.map((f, i) => <ListItem key={i}><ListIcon as={AlertTriangle} />{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 2 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Davlat taʼminoti toifasidagi oilalar</Heading>
              <MapWithTooltip
                getColor={(region) => getColorByPercent(stateSupportData.find(d => d.region === region)?.percent || 0)}
                getTooltip={(region) => {
                  const d = stateSupportData.find(d => d.region === region);
                  if (!d) return null;
                  return (<>
                    <Text fontWeight="bold">{region}</Text>
                    <Text>Oilalar soni: {d.families.toLocaleString()}</Text>
                    <Text>Reja: {d.annualPlan.toLocaleString()}</Text>
                    <Text>Amalda: {d.actual.toLocaleString()}</Text>
                    <Text fontWeight="bold">Bajarilish: {d.percent}%</Text>
                  </>);
                }}
              />
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{supportRedFlags.map((f, i) => <ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 3 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Kambag‘al oila toifasidagi oilalar</Heading>
              <MapWithTooltip
                getColor={(region) => getColorByPercent(poorFamilyCategoryData.find(d => d.region === region)?.percent || 0)}
                getTooltip={(region) => {
                  const d = poorFamilyCategoryData.find(d => d.region === region);
                  if (!d) return null;
                  return (<>
                    <Text fontWeight="bold">{region}</Text>
                    <Text>Oilalar soni: {d.families.toLocaleString()}</Text>
                    <Text>Reja: {d.annualPlan.toLocaleString()}</Text>
                    <Text>Amalda: {d.actual.toLocaleString()}</Text>
                    <Text fontWeight="bold">Bajarilish: {d.percent}%</Text>
                  </>);
                }}
              />
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{poorRedFlags.map((f, i) => <ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 4 – количество (тыс. семей) */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Kambag‘allik chegarasidagi oilalar (ming oila)</Heading>
              <MapWithTooltip
                getColor={(region) => getColorByPercent(povertyLineData.find(r => r.name === region)?.percent || 0)}
                getTooltip={(region) => {
                  const d = povertyLineData.find(r => r.name === region);
                  if (!d) return null;
                  return (<>
                    <Text fontWeight="bold">{region}</Text>
                    <Text>Chegaradagi oilalar: {d.familiesCount.toLocaleString()} ming</Text>
                    <Text>Reja: {d.annualPlan.toLocaleString()}</Text>
                    <Text>Amalda: {d.actual.toLocaleString()}</Text>
                    <Text fontWeight="bold">Bajarilish: {d.percent}%</Text>
                  </>);
                }}
              />
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{lineRedFlags.map((f, i) => <ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 5 – направления (без карты, только список) */}
          <TabPanel p={0}>
            <Box >
              <Heading size="md">Reyestrdan chiqarish yo‘nalishlari (12 ta)</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {directions.map((d, idx) => (
                  <Box bg={'white'} key={idx} p={3} borderWidth="1px" borderRadius="lg" borderLeftColor={d.percent < 30 ? "red.500" : "green.500"} borderLeftWidth="4px">
                    <Flex align="center" gap={2} mb={2}>
                      <TrendingDown size={16} color={d.percent < 30 ? "red" : "green"} />
                      <Text fontWeight="bold">{d.name}</Text>
                    </Flex>
                    <Stat size="sm"><StatLabel>Yillik reja</StatLabel><StatNumber>{d.annualPlan.toLocaleString()}</StatNumber></Stat>
                    <Stat size="sm"><StatLabel>Amalda (4 oy)</StatLabel><StatNumber>{d.actual.toLocaleString()}</StatNumber></Stat>
                    <Flex align="center" gap={2} mt={2}>
                      <Progress value={d.percent} size="sm" width="100%" colorScheme={d.percent < 30 ? "red" : "green"} />
                      <Badge colorScheme={d.percent < 30 ? "red" : "green"}>{d.percent}%</Badge>
                    </Flex>
                    {d.percent < 30 && <Flex mt={2} color="red.500" align="center" gap={1}><AlertTriangle size={14} /> Red flag</Flex>}
                  </Box>
                ))}
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={6}>
                <Stat bg="gray.50" p={3} borderRadius="lg"><StatLabel>Jami yillik reja</StatLabel><StatNumber>{totalAnnualPlan.toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3} borderRadius="lg"><StatLabel>Jami amalda</StatLabel><StatNumber>{totalActual.toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3} borderRadius="lg"><StatLabel>Umumiy bajarilish</StatLabel><StatNumber>{totalPercent.toFixed(1)}%</StatNumber><Progress value={totalPercent} size="sm" colorScheme="blue" mt={2} /></Stat>
              </SimpleGrid>
            </Box>
          </TabPanel>

          {/* TAB 6 – Общий Red flag */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md" mb={4}>🚩 Umumiy red flag ko‘rsatkichlari</Heading>
              <Alert status="error" variant="subtle" flexDirection="column" alignItems="flex-start" borderRadius="lg">
                <Flex align="center" gap={2} mb={2}><AlertIcon /><AlertTitle>Barcha kamchiliklar ro‘yxati</AlertTitle></Flex>
                <List spacing={1} maxH="500px" overflowY="auto" width="100%">
                  {allRedFlags.map((f, i) => <ListItem key={i}><ListIcon as={AlertTriangle} color="red.500" />{f}</ListItem>)}
                </List>
              </Alert>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PovertyDashboard;