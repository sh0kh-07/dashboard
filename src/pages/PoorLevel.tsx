import React, { useState } from "react";
import {
  Box, Text, Heading, useToken, Tabs, TabList, TabPanels, Tab, TabPanel,
  Alert, AlertIcon, AlertTitle, List, ListItem, ListIcon, SimpleGrid,
  Stat, StatLabel, StatNumber, Progress, Badge, Flex, Table, Thead, Tbody,
  Tr, Th, Td, TableContainer, Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import { AlertTriangle, TrendingDown, CheckCircle, XCircle } from "lucide-react";

// ------------------------------------------------------------
// 1. ДАННЫЕ ПО РЕГИОНАМ (основные)
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

// Данные для вкладки 4 (Kambag‘allik chegarasidagi oilalar)
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
// 3. ТАБЛИЦА КОНТРАКТОВ (RED FLAG) С ПРИВЯЗКОЙ К НАПРАВЛЕНИЯМ
// ------------------------------------------------------------
interface Contract {
  name: string;
  type: string;
  amount: number;
  status: "bajarildi" | "bajarilmoqda" | "rejalashtirilgan";
  verification: "tasdiqlangan" | "rad etilgan";
  direction: string;
}
const redFlagContracts: Contract[] = [
  {
    name: "Imtiyozli kreditlar orqali kichik biznesni qo‘llab-quvvatlash",
    type: "Tadbirkorlikka jalb qilish",
    amount: 8.5,
    status: "bajarilmoqda",
    verification: "tasdiqlangan",
    direction: "Tadbirkorlikka jalb qilish"
  },
  {
    name: "Yoshlar uchun startap loyihalarni moliyalashtirish",
    type: "Tadbirkorlikka jalb qilish",
    amount: 6.2,
    status: "bajarilmoqda",
    verification: "tasdiqlangan",
    direction: "Tadbirkorlikka jalb qilish"
  },
  {
    name: "Aholiga uy-joy uchun imtiyozli ipoteka kreditlari",
    type: "Kambag‘al oila daromadini oshirish",
    amount: 10.0,
    status: "rejalashtirilgan",
    verification: "tasdiqlangan",
    direction: "Kambag‘al oila daromadini oshirish"
  },
  {
    name: "Kasb-hunar o‘rgatish va ish bilan ta’minlash markazi",
    type: "Kasb-hunarga oʻqitish orqali bandlik",
    amount: 4.8,
    status: "bajarilmoqda",
    verification: "tasdiqlangan",
    direction: "Kasb-hunarga oʻqitish orqali bandlik"
  },
  {
    name: "Qishloq xo‘jaligi uchun subsidiya va texnika berish",
    type: "Tadbirkorlikka jalb qilish",
    amount: 5.7,
    status: "bajarilmoqda",
    verification: "tasdiqlangan",
    direction: "Tadbirkorlikka jalb qilish"
  },
  {
    name: "Doimiy ish o‘rinlariga joylashtirish dasturi",
    type: "Doimiy ish oʻrinlariga joylashtirish",
    amount: 12.3,
    status: "bajarilmoqda",
    verification: "tasdiqlangan",
    direction: "Doimiy ish oʻrinlariga joylashtirish"
  },
  {
    name: "Norasmiy bandlikni legallashtirish loyihasi",
    type: "Norasmiy faoliyatni legallashtirish",
    amount: 3.5,
    status: "rejalashtirilgan",
    verification: "tasdiqlangan",
    direction: "Norasmiy faoliyatni legallashtirish"
  },
  {
    name: "AT va zamonaviy kasblarga oʻqitish markazi",
    type: "AT va zamonaviy kasblarga oʻqitish",
    amount: 2.8,
    status: "bajarilmoqda",
    verification: "tasdiqlangan",
    direction: "AT va zamonaviy kasblarga oʻqitish"
  },
];

const statusColors = { bajarildi: "green", bajarilmoqda: "blue", rejalashtirilgan: "yellow" };
const statusLabels = { bajarildi: "Bajarildi", bajarilmoqda: "Bajarilmoqda", rejalashtirilgan: "Rejalashtirilgan" };
const verificationIcons = { tasdiqlangan: <CheckCircle size={16} color="#38A169" />, "rad etilgan": <XCircle size={16} color="#F56565" /> };
const verificationLabels = { tasdiqlangan: "Tasdiqlangan", "rad etilgan": "Rad etilgan" };

// ------------------------------------------------------------
// 4. НАПРАВЛЕНИЯ ДЛЯ ФИЛЬТРА (узбекская латиница)
// ------------------------------------------------------------
const filterDirections = [
  { value: "all", label: "Barcha yo‘nalishlar" },
  { value: "Doimiy ish oʻrinlariga joylashtirish", label: "Doimiy ish oʻrinlariga joylashtirish" },
  { value: "Tadbirkorlikka jalb qilish", label: "Tadbirkorlikka jalb qilish" },
  { value: "Kambag‘al oila daromadini oshirish", label: "Kambag‘al oila daromadini oshirish" },
  { value: "Norasmiy faoliyatni legallashtirish", label: "Norasmiy faoliyatni legallashtirish" },
  { value: "Kasb-hunarga oʻqitish orqali bandlik", label: "Kasb-hunarga oʻqitish orqali bandlik" },
  { value: "Tadbirkorlik infratuzilmasini rivojlantirish", label: "Tadbirkorlik infratuzilmasini rivojlantirish" },
  { value: "Oʻrmon va koʻchatxonalar tashkil etish", label: "Oʻrmon va koʻchatxonalar tashkil etish" },
  { value: "Farmasevtika sohasida kooperatsiya", label: "Farmasevtika sohasida kooperatsiya" },
  { value: "Turizm xizmatlarini rivojlantirish", label: "Turizm xizmatlarini rivojlantirish" },
  { value: "AT va zamonaviy kasblarga oʻqitish", label: "AT va zamonaviy kasblarga oʻqitish" },
  { value: "Texnikumlarda kasb-hunarga oʻqitish", label: "Texnikumlarda kasb-hunarga oʻqitish" },
  { value: "Ilm-fan va texnologiyalarni rivojlantirish", label: "Ilm-fan va texnologiyalarni rivojlantirish" },
];

// ------------------------------------------------------------
// 5. МАППИНГ НАЗВАНИЙ РЕГИОНОВ ДЛЯ КАРТЫ
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
// 6. ФУНКЦИИ ЦВЕТА (3 цвета)
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
// 7. КОМПОНЕНТ КАРТЫ С ТУЛТИПОМ
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
// 8. ОСНОВНОЙ КОМПОНЕНТ (6 вкладок)
// ------------------------------------------------------------
const PovertyDashboard = () => {
  // Агрегированные данные для карточек (суммы по всем регионам)
  const avgPovertyNow = mainData.reduce((s, r) => s + r.povertyRate, 0) / mainData.length;
  const avgPovertyWas = 13.2;
  const povertyPlan = 9.5;

  const totalStateSupport = stateSupportData.reduce((s, d) => s + d.families, 0);
  const totalStatePlan = stateSupportData.reduce((s, d) => s + d.annualPlan, 0);
  const totalStateActual = stateSupportData.reduce((s, d) => s + d.actual, 0);
  const totalStateWas = Math.round(totalStateSupport * 0.85);

  const totalPoorFamiliesCat = poorFamilyCategoryData.reduce((s, d) => s + d.families, 0);
  const totalPoorPlan = poorFamilyCategoryData.reduce((s, d) => s + d.annualPlan, 0);
  const totalPoorActual = poorFamilyCategoryData.reduce((s, d) => s + d.actual, 0);
  const totalPoorWas = Math.round(totalPoorFamiliesCat * 0.9);

  const totalLineFamilies = povertyLineData.reduce((s, d) => s + d.familiesCount, 0);
  const totalLinePlan = povertyLineData.reduce((s, d) => s + d.annualPlan, 0);
  const totalLineActual = povertyLineData.reduce((s, d) => s + d.actual, 0);
  const totalLineWas = Math.round(totalLineFamilies * 0.8);

  const SummaryCards = ({ title, was, should, now, unit }: { title: string; was: number; should: number; now: number; unit: string }) => (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2} mb={2}>
      <Stat bg="white" p={3} borderRadius="lg" borderLeft="4px solid" borderLeftColor="gray.400">
        <StatLabel fontSize="sm"> {title} </StatLabel>
        <StatNumber fontSize="xl">{was.toLocaleString()}{unit}</StatNumber>
      </Stat>
      <Stat bg="white" p={3} borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.400">
        <StatLabel fontSize="sm">🎯 Reja (joriy yil)</StatLabel>
        <StatNumber fontSize="xl">{should.toLocaleString()}{unit}</StatNumber>
      </Stat>
      <Stat bg="white" p={3} borderRadius="lg" borderLeft="4px solid" borderLeftColor="green.400">
        <StatLabel fontSize="sm">⚡ Hozirgi (4 oy)</StatLabel>
        <StatNumber fontSize="xl">{now.toLocaleString()}{unit}</StatNumber>
      </Stat>
    </SimpleGrid>
  );

  // Состояние для фильтра
  const [selectedDirection, setSelectedDirection] = useState("all");
  const filteredContracts = selectedDirection === "all"
    ? redFlagContracts
    : redFlagContracts.filter(c => c.direction === selectedDirection);

  return (
    <Box>
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList bg="white" borderRadius="xl" p={2} flexWrap="wrap" gap={2}>
          <Tab>1. Kambag'allik darajasi </Tab>
          <Tab>2. Davlat taʼminotidagi oila</Tab>
          <Tab>3. Kambag'al oila</Tab>
          <Tab>4. Kambag'alik Chegaradagi oilalar</Tab>
          <Tab>5. Reyestr chiqarish yo'nalishlari</Tab>
          <Tab>6. Aniqlangan kamchiliklar</Tab>
        </TabList>

        <TabPanels mt={2}>
          {/* TAB 1 */}
          <TabPanel p={0}>
            <SummaryCards title="Yil boshida " was={avgPovertyWas} should={povertyPlan} now={+avgPovertyNow.toFixed(1)} unit="%" />
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md" mb={2}>Kambag‘allik darajasi</Heading>
              <MapWithTooltip
                getColor={(region) => getColorByPoverty(mainData.find(r => r.name === region)?.povertyRate || 0)}
                getTooltip={(region) => {
                  const d = mainData.find(r => r.name === region);
                  if (!d) return null;
                  return (<>
                    <Text fontWeight="bold">{region}</Text>
                    <Text>Kambag‘allik: {d.povertyRate}%</Text>
                    <Text>Reja (yillik): {d.annualPlan.toLocaleString()} oila</Text>
                    <Text>Amalda (4 oy): {d.actual.toLocaleString()}</Text>
                    <Text fontWeight="bold">Bajarilish: {d.percentAchieved}%</Text>
                  </>);
                }}
              />
            </Box>
          </TabPanel>

          {/* TAB 2 */}
          <TabPanel p={0}>
            <SummaryCards title="Jami oilalar" was={totalStateWas} should={totalStatePlan} now={totalStateActual} unit=" ming" />
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
            </Box>
          </TabPanel>

          {/* TAB 3 */}
          <TabPanel p={0}>
            <SummaryCards title="Jami kambag‘al oilalar" was={totalPoorWas} should={totalPoorPlan} now={totalPoorActual} unit=" ming" />
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
            </Box>
          </TabPanel>

          {/* TAB 4 */}
          <TabPanel p={0}>
            <SummaryCards title="Chegaradagi oilalar" was={totalLineWas} should={totalLinePlan} now={totalLineActual} unit=" ming" />
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Kambag‘allik chegarasidagi oilalar</Heading>
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
            </Box>
          </TabPanel>

          {/* TAB 5 (без карточек) */}
          <TabPanel p={0}>
            <Box>
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

          {/* TAB 6 – Red flag (таблица + фильтр по направлениям) */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Aniqlangan kamchiliklar</Heading>
                <Select
                  width="300px"
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(e.target.value)}
                  bg="white"
                  size="sm"
                >
                  {filterDirections.map(dir => (
                    <option key={dir.value} value={dir.value}>{dir.label}</option>
                  ))}
                </Select>
              </Flex>
              <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden" mb={6}>
                <Table size="sm" variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Kontrakt nomi</Th>
                      <Th>Turi</Th>
                      <Th isNumeric>Summa (mlrd so‘m)</Th>
                      <Th>Holati</Th>
                      <Th>Tekshiruv</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredContracts.length === 0 ? (
                      <Tr><Td colSpan={5} textAlign="center">Ushbu yo‘nalish bo‘yicha maʼlumot yo‘q</Td></Tr>
                    ) : (
                      filteredContracts.map((c, idx) => (
                        <Tr key={idx}>
                          <Td fontWeight="medium">{c.name}</Td>
                          <Td>{c.type}</Td>
                          <Td isNumeric fontWeight="bold">{c.amount}</Td>
                          <Td><Badge colorScheme={statusColors[c.status]}>{statusLabels[c.status]}</Badge></Td>
                          <Td><Flex align="center" gap={2}>{verificationIcons[c.verification]}{verificationLabels[c.verification]}</Flex></Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PovertyDashboard;