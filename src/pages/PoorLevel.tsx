import React, { useState } from "react";
import {
  Box, Text, Heading, useToken, Flex, SimpleGrid, Stat, StatLabel,
  StatNumber, Tabs, TabList, TabPanels, Tab, TabPanel,
  Badge, Progress, Card, CardBody, CardHeader, Divider,
  Alert, AlertIcon, AlertTitle, List, ListItem, ListIcon,
  Icon, useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
  AlertTriangle, TrendingDown, Users, Home, MapPin, Briefcase,
  TrendingUp, Scale, CheckCircle, GraduationCap, Building, Leaf, Laptop,
} from "lucide-react";

// ------------------------------
// 1. ASOSIY KAMBAG‘AL OILALAR MA’LUMOTLARI (1-TAB)
// ------------------------------
const regions = [
  "Qoraqalpogʻiston Respublikasi", "Andijon viloyati", "Buxoro viloyati",
  "Jizzax viloyati", "Qashqadaryo viloyati", "Navoiy viloyati",
  "Namangan viloyati", "Samarqand viloyati", "Sirdaryo viloyati",
  "Surxondaryo viloyati", "Toshkent viloyati", "Fargʻona viloyati",
  "Xorazm viloyati", "Toshkent shahri",
];

interface RegionData {
  name: string;
  poorPopulation: number;      // kambag‘al oilada yashovchi aholi (ming)
  totalFamilies: number;       // jami oilalar (ming)
  poorFamilies: number;        // kambag‘al oilalar (ming)
  totalHouseholds: number;     // jami xonadonlar (ming)
  poorHouseholds: number;      // kambag‘al xonadonlar (ming)
  povertyRate: number;         // kambag‘allik darajasi (%)
  removedFamilies: number;     // reyestrdan chiqarilgan oilalar (ming)
  removedPeople: number;       // reyestrdan chiqarilgan aholi (ming)
  annualPlan: number;          // reyestrdan chiqarish yillik rejasi (oilalar, ming)
  actual: number;              // amalda (4 oylik, ming)
  percentAchieved: number;     // foizda bajarilish
}

// Realistik maʼlumotlar generatori (asosiy kambag‘allar)
const generateRegionData = (): RegionData[] => {
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
  const avgHouseholdSize = 4.8;

  return regions.map(name => {
    const povertyRate = basePoorRates[name];
    const totalPopVal = totalPop[name];
    const poorPopVal = Math.round(totalPopVal * povertyRate / 100);
    const totalFamiliesVal = Math.round(totalPopVal / avgFamilySize);
    const poorFamiliesVal = Math.round(poorPopVal / avgFamilySize);
    const totalHouseholdsVal = Math.round(totalPopVal / avgHouseholdSize);
    const poorHouseholdsVal = Math.round(poorPopVal / avgHouseholdSize);
    const annualPlanVal = Math.round(poorFamiliesVal * 0.3);
    const actualVal = Math.round(annualPlanVal * (0.25 + Math.random() * 0.2));
    const percentVal = Math.min(100, Math.round((actualVal / annualPlanVal) * 100));
    return {
      name,
      poorPopulation: poorPopVal,
      totalFamilies: totalFamiliesVal,
      poorFamilies: poorFamiliesVal,
      totalHouseholds: totalHouseholdsVal,
      poorHouseholds: poorHouseholdsVal,
      povertyRate,
      removedFamilies: actualVal,
      removedPeople: Math.round(actualVal * avgFamilySize),
      annualPlan: annualPlanVal,
      actual: actualVal,
      percentAchieved: percentVal,
    };
  });
};

const mainRegionData = generateRegionData();

// Yil oxiri prognozi (kambag‘allik darajasi)
const getProjectedPoverty = (data: RegionData) => {
  const reductionPerMonth = 0.2;
  const projected = Math.max(2, data.povertyRate - reductionPerMonth * 8);
  return Math.round(projected * 10) / 10;
};

// ------------------------------
// 2. KAMBAG‘ALLIK CHEGARASIDAGI OILALAR MA’LUMOTLARI (4-TAB)
// ------------------------------
// Chegaradagilar: aholining taxminan 12% i (kambag‘allarga qo‘shimcha)
const generatePovertyLineData = (): RegionData[] => {
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
  const avgHouseholdSize = 4.8;

  return regions.map(name => {
    const lineRate = baseLineRates[name];
    const totalPopVal = totalPop[name];
    const linePopVal = Math.round(totalPopVal * lineRate / 100);
    const totalFamiliesVal = Math.round(totalPopVal / avgFamilySize);
    const lineFamiliesVal = Math.round(linePopVal / avgFamilySize);
    const totalHouseholdsVal = Math.round(totalPopVal / avgHouseholdSize);
    const lineHouseholdsVal = Math.round(linePopVal / avgHouseholdSize);
    // Chegaradagilar uchun reyestr rejasi (ularning 20% ini chiqarish)
    const annualPlanVal = Math.round(lineFamiliesVal * 0.2);
    const actualVal = Math.round(annualPlanVal * (0.25 + Math.random() * 0.25));
    const percentVal = Math.min(100, Math.round((actualVal / annualPlanVal) * 100));
    return {
      name,
      poorPopulation: linePopVal,          // chegaradagi aholi
      totalFamilies: totalFamiliesVal,
      poorFamilies: lineFamiliesVal,
      totalHouseholds: totalHouseholdsVal,
      poorHouseholds: lineHouseholdsVal,
      povertyRate: lineRate,               // chegaradagilar ulushi
      removedFamilies: actualVal,
      removedPeople: Math.round(actualVal * avgFamilySize),
      annualPlan: annualPlanVal,
      actual: actualVal,
      percentAchieved: percentVal,
    };
  });
};

const povertyLineRegionData = generatePovertyLineData();

// 3. DAVLAT TA'MINOTI VA KAMBAG‘AL OILA TOIFALARI (2,3-TABLAR)
interface CategoryItem {
  region: string;
  families: number;
  population: number;
  removedFamilies: number;
  removedPeople: number;
  annualPlan: number;
  actual: number;
  percent: number;
}
const generateCategoryData = (multiplier: number): CategoryItem[] =>
  mainRegionData.map(r => {
    const families = Math.round(r.poorFamilies * multiplier);
    const population = Math.round(r.poorPopulation * multiplier);
    const annualPlan = Math.round(families * 0.25);
    const actual = Math.round(annualPlan * (0.2 + Math.random() * 0.3));
    const percent = Math.min(100, Math.round((actual / annualPlan) * 100));
    return {
      region: r.name,
      families,
      population,
      removedFamilies: actual,
      removedPeople: Math.round(actual * 5.2),
      annualPlan,
      actual,
      percent,
    };
  });

const stateSupportData = generateCategoryData(0.12);   // davlat ta'minoti
const poorFamilyCategoryData = generateCategoryData(0.65); // kambag'al oila toifasi

// 4. REYESTRDAN CHIQARISH YO‘NALISHLARI (5-TAB)
interface Direction {
  name: string;
  annualPlan: number;
  actual: number;
  percent: number;
  icon: any;
  color: string;
}
const directions: Direction[] = [
  { name: "Doimiy ish oʻrinlari", annualPlan: 92127, actual: 31000, percent: 33.6, icon: Briefcase, color: "#3182CE" },
  { name: "Tadbirkorlikka jalb", annualPlan: 84231, actual: 27500, percent: 32.7, icon: TrendingUp, color: "#38A169" },
  { name: "Daromadni oshirish", annualPlan: 42113, actual: 14200, percent: 33.7, icon: Scale, color: "#DD6B20" },
  { name: "Legallashtirish", annualPlan: 28951, actual: 8800, percent: 30.4, icon: CheckCircle, color: "#805AD5" },
  { name: "Kasb-hunarga oʻqitish", annualPlan: 15793, actual: 5300, percent: 33.6, icon: GraduationCap, color: "#D53F8C" },
  { name: "Tadbirkorlik infratuzilmasi", annualPlan: 25000, actual: 7200, percent: 28.8, icon: Building, color: "#E53E3E" },
  { name: "Oʻrmon va koʻchatxonalar", annualPlan: 2163, actual: 650, percent: 30.1, icon: Leaf, color: "#48BB78" },
  { name: "AT va zamonaviy kasblar", annualPlan: 5000, actual: 1900, percent: 38.0, icon: Laptop, color: "#ED64A6" },
];
const totalAnnualPlan = directions.reduce((s, d) => s + d.annualPlan, 0);
const totalActual = directions.reduce((s, d) => s + d.actual, 0);
const totalPercent = (totalActual / totalAnnualPlan) * 100;

// ------------------------------
// XARITA MAPPING
// ------------------------------
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

const getPovertyColor = (rate: number) => {
  if (rate >= 10) return "#C53030";
  if (rate >= 7) return "#ED8936";
  if (rate >= 4) return "#F6E05E";
  return "#48BB78";
};

// Xarita komponenti (Qashqadaryo uchun onClick)
const MapWithTooltip = ({ getColor, getTooltipContent, dataMap }: any) => {
  const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, content: null });
  const navigate = useNavigate();

  const handleClick = (regionFull: string | null) => {
    if (regionFull === "Qashqadaryo viloyati") {
      navigate("/poor-level/vil");
    }
  };

  return (
    <Box position="relative" display="flex" justifyContent="center" my={6}>
      <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
        {Uzbekistan.locations.map((loc: any) => {
          const regionFull = getRegionFullName(loc.name);
          const fillColor = regionFull ? getColor(regionFull, dataMap) : "#CBD5E0";
          return (
            <path
              key={loc.id}
              d={loc.path}
              onMouseEnter={(e) => {
                const content = regionFull ? getTooltipContent(regionFull, dataMap) : <Text>Maʼlumot yoʻq</Text>;
                setTooltip({ visible: true, x: e.clientX, y: e.clientY, content });
              }}
              onMouseMove={(e) => setTooltip((p: any) => ({ ...p, x: e.clientX, y: e.clientY }))}
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

// ------------------------------
// KARTALAR
// ------------------------------
const RegionCard = ({ data, title }: { data: RegionData; title?: string }) => {
  const projected = getProjectedPoverty(data);
  return (
    <Card borderLeft="4px" borderLeftColor={data.povertyRate > 10 ? "red.500" : data.povertyRate > 7 ? "orange.500" : "green.500"} boxShadow="sm">
      <CardHeader pb={0}>
        <Flex justify="space-between">
          <Heading size="sm"><Icon as={MapPin} mr={1} />{data.name}</Heading>
          <Badge colorScheme={data.povertyRate > 10 ? "red" : data.povertyRate > 7 ? "orange" : "green"}>{data.povertyRate}%</Badge>
        </Flex>
      </CardHeader>
      <CardBody pt={2}>
        <SimpleGrid columns={2} spacingX={2} spacingY={1} mb={2}>
          <Stat size="sm"><StatLabel>Aholi (kamb./jami?)</StatLabel><StatNumber>{data.poorPopulation} ming / {data.totalFamilies*5.2} ming*</StatNumber></Stat>
          <Stat size="sm"><StatLabel>Jami oilalar</StatLabel><StatNumber>{data.totalFamilies} ming</StatNumber></Stat>
          <Stat size="sm"><StatLabel>Kamb. oilalar</StatLabel><StatNumber>{data.poorFamilies} ming</StatNumber></Stat>
          <Stat size="sm"><StatLabel>Jami xonadon</StatLabel><StatNumber>{data.totalHouseholds} ming</StatNumber></Stat>
          <Stat size="sm"><StatLabel>Kamb. xonadon</StatLabel><StatNumber>{data.poorHouseholds} ming</StatNumber></Stat>
        </SimpleGrid>
        <Divider />
        <Flex justify="space-between" mt={2}><Text fontSize="xs">Chiqarilgan:</Text><Text fontSize="sm">{data.removedFamilies} oila / {data.removedPeople} aholi</Text></Flex>
        <Flex justify="space-between"><Text fontSize="xs">Reja / Amalda:</Text><Text fontSize="sm">{data.annualPlan} / {data.actual}</Text></Flex>
        <Flex align="center" gap={2} mt={1}>
          <Progress value={data.percentAchieved} size="sm" width="100%" colorScheme={data.percentAchieved < 30 ? "red" : "green"} />
          <Badge>{data.percentAchieved}%</Badge>
        </Flex>
        <Flex align="center" gap={2} mt={2} color="blue.600">
          <TrendingDown size={14} />
          <Text fontSize="xs">Prognoz (yil oxiri):</Text>
          <Text fontWeight="bold">{projected}%</Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

const CategoryCard = ({ data }: { data: CategoryItem }) => (
  <Card borderLeft="4px" borderLeftColor={data.percent < 30 ? "red.400" : "green.400"} boxShadow="sm">
    <CardHeader pb={0}><Heading size="xs"><Icon as={Users} mr={1} />{data.region}</Heading></CardHeader>
    <CardBody pt={2}>
      <SimpleGrid columns={2} spacingX={2} spacingY={1}>
        <Stat size="sm"><StatLabel>Oilalar</StatLabel><StatNumber>{data.families.toLocaleString()}</StatNumber></Stat>
        <Stat size="sm"><StatLabel>Aholi</StatLabel><StatNumber>{data.population.toLocaleString()}</StatNumber></Stat>
      </SimpleGrid>
      <Divider my={1} />
      <Flex justify="space-between"><Text fontSize="xs">Chiqarilgan:</Text><Text fontSize="sm">{data.removedFamilies} / {data.removedPeople}</Text></Flex>
      <Flex justify="space-between"><Text fontSize="xs">Reja / Amalda:</Text><Text fontSize="sm">{data.annualPlan} / {data.actual}</Text></Flex>
      <Flex align="center" gap={2} mt={1}>
        <Progress value={data.percent} size="sm" width="100%" colorScheme={data.percent<30?"red":"green"} />
        <Badge>{data.percent}%</Badge>
      </Flex>
    </CardBody>
  </Card>
);

// ------------------------------
// ASOSIY DASHBORD
// ------------------------------
const PovertyDashboard = () => {
  // Red flaglar
  const mainRedFlags = mainRegionData.filter(r => r.percentAchieved < 30 || r.povertyRate > 15)
    .map(r => `${r.name}: kambag‘allik ${r.povertyRate}%, reestr chiqarish ${r.percentAchieved}%`);
  const supportRedFlags = stateSupportData.filter(d => d.percent < 25).map(d => `${d.region}: ${d.percent}%`);
  const poorRedFlags = poorFamilyCategoryData.filter(d => d.percent < 25).map(d => `${d.region}: ${d.percent}%`);
  const lineRedFlags = povertyLineRegionData.filter(d => d.percentAchieved < 25 || d.povertyRate > 8)
    .map(d => `${d.name}: chegaradagilar ulushi ${d.povertyRate}%, chiqarish ${d.percentAchieved}%`);
  const dirRedFlags = directions.filter(d => d.percent < 30).map(d => `${d.name}: ${d.percent}%`);

  return (
    <Box>
      <Heading size="xl" mb={2}>📊 Kambag‘allik va ijtimoiy himoya reyestri monitoringi</Heading>
      <Text mb={4}>2025-yil, 4 oylik amaldagi ko‘rsatkichlar | Xaritada Qashqadaryoni bosing → batafsil maʼlumot</Text>

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList bg="white" borderRadius="xl" p={2} flexWrap="wrap" gap={2}>
          <Tab>1. Asosiy kambag‘allar</Tab>
          <Tab>2. Davlat taʼminoti</Tab>
          <Tab>3. Kambag‘al oila toifasi</Tab>
          <Tab>4. Kambag‘allik chegarasidagilar</Tab>
          <Tab>5. Reyestr chiqarish yo‘nalishlari</Tab>
        </TabList>

        <TabPanels mt={6}>
          {/* TAB 1 - Asosiy kambag‘allar */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md" mb={2}>Viloyatlar kesimida kambag‘al oila ko‘rsatkichlari</Heading>
              <Text fontSize="sm" mb={4}>Har bir kartada: kambag‘al aholi, jami/kambag‘al oilalar, jami/kambag‘al xonadonlar, kambag‘allik %, reyestrdan chiqarilgan (oila/aholi), yillik reja/amalda/%, prognoz.</Text>
              <MapWithTooltip
                getColor={(region: string) => getPovertyColor(mainRegionData.find(r => r.name === region)?.povertyRate || 0)}
                getTooltipContent={(region: string) => {
                  const d = mainRegionData.find(r => r.name === region);
                  return d ? <><b>{region}</b><Text>Kambag‘allik: {d.povertyRate}%</Text><Text>Bajarilish: {d.percentAchieved}%</Text></> : null;
                }}
                dataMap={mainRegionData}
              />
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {mainRegionData.map(d => <RegionCard key={d.name} data={d} />)}
              </SimpleGrid>
              <Alert status="error" borderRadius="lg" mt={6}><AlertIcon /><AlertTitle>Aniqlangan kamchiliklar (red flag)</AlertTitle><List>{mainRedFlags.map((f,i)=><ListItem key={i}><ListIcon as={AlertTriangle}/>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 2 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Davlat taʼminoti toifasidagi oilalar va aholi</Heading>
              <MapWithTooltip getColor={(region)=>stateSupportData.find(d=>d.region===region)?.percent<30?"#C53030":"#48BB78"} getTooltipContent={(region)=>{const d=stateSupportData.find(d=>d.region===region); return d?<><b>{region}</b><Text>Bajarilish: {d.percent}%</Text></>:null;}} dataMap={stateSupportData} />
              <SimpleGrid columns={{base:1,md:2,lg:3}} spacing={4} mt={4}>{stateSupportData.map(d=><CategoryCard key={d.region} data={d} />)}</SimpleGrid>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{supportRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 3 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Kambag‘al oila toifasidagi oilalar va aholi</Heading>
              <MapWithTooltip getColor={(region)=>poorFamilyCategoryData.find(d=>d.region===region)?.percent<30?"#C53030":"#48BB78"} getTooltipContent={(region)=>{const d=poorFamilyCategoryData.find(d=>d.region===region); return d?<><b>{region}</b><Text>{d.percent}%</Text></>:null;}} dataMap={poorFamilyCategoryData} />
              <SimpleGrid columns={{base:1,md:2,lg:3}} spacing={4}>{poorFamilyCategoryData.map(d=><CategoryCard key={d.region} data={d} />)}</SimpleGrid>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{poorRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 4 - KAMBAG‘ALLIK CHEGARASIDAGILAR (to‘liq ko‘rsatkichlar bilan) */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Kambag‘allik chegarasidagi aholi va oilalar</Heading>
              <Text fontSize="sm" mb={2}>Ushbu toifaga kambag‘allik chegarasida yashovchi (daromadi kambag‘allik chegarasidan 20-30% yuqori) oilalar kiradi. Quyida ularning soni, ulushi va reyestr ko‘rsatkichlari keltirilgan.</Text>
              <MapWithTooltip
                getColor={(region: string) => getPovertyColor(povertyLineRegionData.find(r => r.name === region)?.povertyRate || 0)}
                getTooltipContent={(region: string) => {
                  const d = povertyLineRegionData.find(r => r.name === region);
                  return d ? <><b>{region}</b><Text>Chegaradagilar ulushi: {d.povertyRate}%</Text><Text>Reyestr chiqarish: {d.percentAchieved}%</Text></> : null;
                }}
                dataMap={povertyLineRegionData}
              />
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {povertyLineRegionData.map(d => <RegionCard key={d.name} data={d} title="Chegaradagilar" />)}
              </SimpleGrid>
              <Alert status="error" borderRadius="lg" mt={6}><AlertIcon /><AlertTitle>Aniqlangan kamchiliklar (red flag)</AlertTitle><List>{lineRedFlags.map((f,i)=><ListItem key={i}><ListIcon as={AlertTriangle}/>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 5 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Reyestrdan chiqarish yo‘nalishlari (yillik reja, amalda, foiz)</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                {directions.map(d => (
                  <Card key={d.name} borderTop="4px" borderTopColor={d.color}>
                    <CardBody>
                      <Flex align="center" gap={2} mb={2}><Icon as={d.icon} color={d.color} /><Heading size="xs">{d.name}</Heading></Flex>
                      <Stat size="sm"><StatLabel>Yillik reja</StatLabel><StatNumber>{d.annualPlan.toLocaleString()}</StatNumber></Stat>
                      <Stat size="sm"><StatLabel>Amalda (4 oy)</StatLabel><StatNumber>{d.actual.toLocaleString()}</StatNumber></Stat>
                      <Flex align="center" gap={2} mt={2}><Progress value={d.percent} size="sm" width="100%" colorScheme={d.percent<30?"red":"green"} /><Badge>{d.percent}%</Badge></Flex>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={6}>
                <Stat bg="gray.50" p={3} borderRadius="lg"><StatLabel>Jami yillik reja</StatLabel><StatNumber>{totalAnnualPlan.toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3} borderRadius="lg"><StatLabel>Jami amalda</StatLabel><StatNumber>{totalActual.toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3} borderRadius="lg"><StatLabel>Umumiy bajarilish</StatLabel><StatNumber>{totalPercent.toFixed(1)}%</StatNumber><Progress value={totalPercent} size="sm" colorScheme="blue" mt={2} /></Stat>
              </SimpleGrid>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{dirRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PovertyDashboard;