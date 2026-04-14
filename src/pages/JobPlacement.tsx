import React, { useState } from "react";
import {
  Box, Text, Heading, useToken, Flex, SimpleGrid, Stat, StatLabel,
  StatNumber, Tabs, TabList, TabPanels, Tab, TabPanel,
  Badge, Progress, Card, CardBody, CardHeader, Divider,
  Alert, AlertIcon, AlertTitle, List, ListItem, ListIcon,
  Icon, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
  Briefcase, Building, Landmark, Home, Users, MapPin,
} from "lucide-react";

// --------------------------------------------------------------
// 1. ISHSIZLIK DARAJASI MA'LUMOTLARI (1-TAB)
// --------------------------------------------------------------
interface RegionUnemployment {
  name: string;
  startYear: number;      // yil boshi
  actualCurrent: number;  // hozirgi (4 oy)
  targetEndYear: number;  // yil oxiri maqsadi
  status: "bad" | "moderate" | "good";
}

const rawStart: { name: string; startYear: number }[] = [
  { name: "Qoraqalpogʻiston", startYear: 4.8 }, { name: "Andijon", startYear: 4.5 },
  { name: "Buxoro", startYear: 4.5 }, { name: "Jizzax", startYear: 4.6 },
  { name: "Qashqadaryo", startYear: 5.0 }, { name: "Navoiy", startYear: 3.9 },
  { name: "Namangan", startYear: 4.6 }, { name: "Samarqand", startYear: 4.5 },
  { name: "Sirdaryo", startYear: 4.6 }, { name: "Surxondaryo", startYear: 4.6 },
  { name: "Toshkent viloyati", startYear: 4.5 }, { name: "Fargʻona", startYear: 4.5 },
  { name: "Xorazm", startYear: 4.5 }, { name: "Toshkent shahri", startYear: 3.8 },
  { name: "Qashqadaryo viloyati", startYear: 4.5 }, { name: "Toshkent shahri", startYear: 3.8 },
];

const getTarget = (name: string, start: number): number => {
  const good = ["Toshkent shahri", "Samarqand", "Navoiy", "Buxoro"];
  const bad = ["Qashqadaryo", "Sirdaryo", "Surxondaryo", "Jizzax", "Xorazm"];
  let reduction = 0.5;
  if (good.includes(name)) reduction = 0.7;
  if (bad.includes(name)) reduction = 0.4;
  let target = start - reduction;
  if (target < 3.0) target = 3.0;
  return Math.round(target * 10) / 10;
};

const unemploymentData: RegionUnemployment[] = rawStart.map(r => {
  const target = getTarget(r.name, r.startYear);
  let actual = r.startYear;
  const bad = ["Qashqadaryo", "Sirdaryo", "Surxondaryo", "Jizzax", "Xorazm"];
  const good = ["Toshkent shahri", "Samarqand", "Navoiy", "Buxoro"];
  if (bad.includes(r.name)) actual = r.startYear - 0.2;
  else if (good.includes(r.name)) actual = r.startYear - 0.6;
  else actual = r.startYear - 0.4;
  actual = Math.round(actual * 10) / 10;
  let status: "bad" | "moderate" | "good" = "moderate";
  if (bad.includes(r.name)) status = "bad";
  if (good.includes(r.name)) status = "good";
  return { ...r, name: r.name, startYear: r.startYear, actualCurrent: actual, targetEndYear: target, status };
});

// --------------------------------------------------------------
// 2. LEGALLASHTIRILADIGAN ISH O'RINLARI (2-TAB) - reja, amalda, foiz
// --------------------------------------------------------------
interface RegionLegal {
  name: string;
  plan: number;
  actual: number;
  percent: number;
}
const legalData: RegionLegal[] = [
  { name: "Qoraqalpogʻiston Respublikasi", plan: 62000, actual: 46578, percent: 75.1 },
  { name: "Andijon viloyati", plan: 85000, actual: 66390, percent: 78.1 },
  { name: "Buxoro viloyati", plan: 78000, actual: 60747, percent: 77.9 },
  { name: "Jizzax viloyati", plan: 63000, actual: 48968, percent: 77.7 },
  { name: "Qashqadaryo viloyati", plan: 98000, actual: 77737, percent: 79.3 },
  { name: "Navoiy viloyati", plan: 45000, actual: 35138, percent: 78.1 },
  { name: "Namangan viloyati", plan: 78000, actual: 60631, percent: 77.7 },
  { name: "Samarqand viloyati", plan: 85000, actual: 66797, percent: 78.6 },
  { name: "Sirdaryo viloyati", plan: 46000, actual: 36028, percent: 78.3 },
  { name: "Surxondaryo viloyati", plan: 65000, actual: 50883, percent: 78.3 },
  { name: "Toshkent viloyati", plan: 140000, actual: 111630, percent: 79.7 },
  { name: "Fargʻona viloyati", plan: 94000, actual: 73886, percent: 78.6 },
  { name: "Xorazm viloyati", plan: 64000, actual: 50065, percent: 78.2 },
  { name: "Toshkent shahri", plan: 260000, actual: 214522, percent: 82.5 },
];

// --------------------------------------------------------------
// 3. DOIMIY ISHGA JOYLASHTIRISH (3-TAB) - reja, amalda, foiz
// --------------------------------------------------------------
interface RegionPlacement {
  name: string;
  plan: number;
  actual: number;
  percent: number;
}
const placementData: RegionPlacement[] = [
  { name: "Qoraqalpogʻiston Respublikasi", plan: 60000, actual: 47738, percent: 79.6 },
  { name: "Andijon viloyati", plan: 110000, actual: 86674, percent: 78.8 },
  { name: "Buxoro viloyati", plan: 65000, actual: 51050, percent: 78.5 },
  { name: "Jizzax viloyati", plan: 48000, actual: 37823, percent: 78.8 },
  { name: "Qashqadaryo viloyati", plan: 110000, actual: 86763, percent: 78.9 },
  { name: "Navoiy viloyati", plan: 36000, actual: 28536, percent: 79.3 },
  { name: "Namangan viloyati", plan: 102000, actual: 80325, percent: 78.8 },
  { name: "Samarqand viloyati", plan: 122000, actual: 96702, percent: 79.3 },
  { name: "Sirdaryo viloyati", plan: 31000, actual: 24303, percent: 78.4 },
  { name: "Surxondaryo viloyati", plan: 86000, actual: 67327, percent: 78.3 },
  { name: "Toshkent viloyati", plan: 107000, actual: 84793, percent: 79.2 },
  { name: "Fargʻona viloyati", plan: 124000, actual: 98205, percent: 79.2 },
  { name: "Xorazm viloyati", plan: 63000, actual: 49653, percent: 78.8 },
  { name: "Toshkent shahri", plan: 195000, actual: 160153, percent: 82.1 },
];

// --------------------------------------------------------------
// 4. KAMBAG'AL OILALARDAGI ISHSIZLAR (4-TAB) - kartochkalar
// --------------------------------------------------------------
interface PoorUnemployed {
  region: string;
  unemployed: number;
  permPlan: number;
  permActual: number;
  permPercent: number;
  infPlan: number;
  infActual: number;
  infPercent: number;
}
const poorUnemployedData: PoorUnemployed[] = [
  { region: "Qoraqalpogʻiston Respublikasi", unemployed: 28.5, permPlan: 17, permActual: 11, permPercent: 64.7, infPlan: 11, infActual: 6, infPercent: 54.5 },
  { region: "Andijon viloyati", unemployed: 42.3, permPlan: 25, permActual: 18, permPercent: 72.0, infPlan: 17, infActual: 11, infPercent: 64.7 },
  { region: "Buxoro viloyati", unemployed: 18.2, permPlan: 11, permActual: 8, permPercent: 72.7, infPlan: 7, infActual: 5, infPercent: 71.4 },
  { region: "Jizzax viloyati", unemployed: 22.1, permPlan: 13, permActual: 9, permPercent: 69.2, infPlan: 9, infActual: 5, infPercent: 55.6 },
  { region: "Qashqadaryo viloyati", unemployed: 48.7, permPlan: 29, permActual: 20, permPercent: 69.0, infPlan: 19, infActual: 12, infPercent: 63.2 },
  { region: "Navoiy viloyati", unemployed: 11.4, permPlan: 7, permActual: 5, permPercent: 71.4, infPlan: 4, infActual: 3, infPercent: 75.0 },
  { region: "Namangan viloyati", unemployed: 38.6, permPlan: 23, permActual: 16, permPercent: 69.6, infPlan: 15, infActual: 9, infPercent: 60.0 },
  { region: "Samarqand viloyati", unemployed: 41.2, permPlan: 25, permActual: 18, permPercent: 72.0, infPlan: 16, infActual: 11, infPercent: 68.8 },
  { region: "Sirdaryo viloyati", unemployed: 15.9, permPlan: 10, permActual: 7, permPercent: 70.0, infPlan: 6, infActual: 4, infPercent: 66.7 },
  { region: "Surxondaryo viloyati", unemployed: 44.5, permPlan: 27, permActual: 18, permPercent: 66.7, infPlan: 17, infActual: 10, infPercent: 58.8 },
  { region: "Toshkent viloyati", unemployed: 29.8, permPlan: 18, permActual: 13, permPercent: 72.2, infPlan: 12, infActual: 8, infPercent: 66.7 },
  { region: "Fargʻona viloyati", unemployed: 46.3, permPlan: 28, permActual: 20, permPercent: 71.4, infPlan: 18, infActual: 12, infPercent: 66.7 },
  { region: "Xorazm viloyati", unemployed: 27.4, permPlan: 16, permActual: 11, permPercent: 68.8, infPlan: 11, infActual: 7, infPercent: 63.6 },
  { region: "Toshkent shahri", unemployed: 12.1, permPlan: 7, permActual: 6, permPercent: 85.7, infPlan: 5, infActual: 4, infPercent: 80.0 },
];

// --------------------------------------------------------------
// XARITA MAPPING (TO'LIQ MOSLASHTIRILGAN)
// --------------------------------------------------------------
const svgToRegion: Record<string, string> = {
  "Karakalpakstan": "Qoraqalpogʻiston Respublikasi",
  "Qoraqalpog‘iston": "Qoraqalpogʻiston Respublikasi",
  "Andijan": "Andijon viloyati",
  "Bukhara": "Buxoro viloyati",
  "Jizzakh": "Jizzax viloyati",
  "Qashqadaryo": "Qashqadaryo viloyati",
  "Kashkadarya": "Qashqadaryo viloyati",
  "Navoi": "Navoiy viloyati",
  "Namangan": "Namangan viloyati",
  "Samarkand": "Samarqand viloyati",
  "Sirdaryo": "Sirdaryo viloyati",
  "Surxondaryo": "Surxondaryo viloyati",
  "Toshkent viloyati": "Toshkent viloyati",
  "Fergana": "Fargʻona viloyati",
  "Xorazm": "Xorazm viloyati",
  "Tashkent": "Toshkent shahri",
};

const normalize = (s: string) => s.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').replace(/ Respublikasi$/i, '').replace(/[‘ʻ]/g, "'").trim();

const getRegionName = (svgName: string): string | null => {
  if (svgToRegion[svgName]) return svgToRegion[svgName];
  const norm = normalize(svgName);
  for (const [key, val] of Object.entries(svgToRegion)) {
    if (normalize(key) === norm) return val;
  }
  // Ma'lumotlar ichidan qidirish
  const found = unemploymentData.find(r => normalize(r.name) === norm) ||
                legalData.find(r => normalize(r.name) === norm) ||
                placementData.find(r => normalize(r.name) === norm) ||
                poorUnemployedData.find(r => normalize(r.region) === norm);
  return found ? (found.name || found.region) : null;
};

// 3 darajali rang funksiyasi (foiz asosida)
const getPercentColor = (percent: number): string => {
  if (percent < 70) return "#E53E3E";  // qizil
  if (percent < 80) return "#ED8936";  // sariq (to'q sariq)
  return "#48BB78";                     // yashil
};

// Ishsizlik statusi uchun rang
const getStatusColor = (status: string): string => {
  if (status === "bad") return "#E53E3E";
  if (status === "moderate") return "#ED8936";
  return "#48BB78";
};

// Xarita komponenti (hover va click bilan)
const MapWithTooltip = ({ getColor, getTooltipContent, dataMap, regionClickPath = "/poor-level/vil" }: any) => {
  const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, content: null });
  const navigate = useNavigate();

  const handleClick = (regionName: string | null) => {
    if (regionName === "Qashqadaryo viloyati") navigate(regionClickPath);
  };

  return (
    <Box position="relative" display="flex" justifyContent="center" my={6}>
      <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
        {Uzbekistan.locations.map((loc: any) => {
          const region = getRegionName(loc.name);
          const fillColor = region ? getColor(region, dataMap) : "#CBD5E0";
          return (
            <path
              key={loc.id}
              d={loc.path}
              onMouseEnter={(e) => {
                const content = region ? getTooltipContent(region, dataMap) : <Text>Maʼlumot yoʻq</Text>;
                setTooltip({ visible: true, x: e.clientX, y: e.clientY, content });
              }}
              onMouseMove={(e) => setTooltip((p: any) => ({ ...p, x: e.clientX, y: e.clientY }))}
              onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, content: null })}
              onClick={() => handleClick(region)}
              style={{ fill: fillColor, stroke: "#cbd5e0", strokeWidth: 1.2, cursor: "pointer", opacity: 0.85 }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2.5"; e.currentTarget.style.stroke = "#4a5568"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1.2"; e.currentTarget.style.stroke = "#cbd5e0"; }}
            />
          );
        })}
      </svg>
      {tooltip.visible && tooltip.content && (
        <Box position="fixed" top={tooltip.y + 12} left={tooltip.x + 12} bg="white" px={4} py={2} borderRadius="md" boxShadow="lg" zIndex={1000} pointerEvents="none" border="1px solid" borderColor="gray.200">
          {tooltip.content}
        </Box>
      )}
    </Box>
  );
};

// 4-tab uchun kartochka
const PoorCard = ({ data }: { data: PoorUnemployed }) => {
  const avg = (data.permPercent + data.infPercent) / 2;
  return (
    <Card borderLeft="4px" borderLeftColor={getPercentColor(avg)} boxShadow="sm">
      <CardHeader pb={0}><Heading size="xs"><Icon as={MapPin} mr={1} />{data.region}</Heading></CardHeader>
      <CardBody pt={2}>
        <Stat size="sm" mb={2}><StatLabel fontSize="xs">Kambag‘al oilalardagi ishsizlar</StatLabel><StatNumber>{data.unemployed} ming</StatNumber></Stat>
        <Divider />
        <Text fontSize="xs" fontWeight="bold" mt={1}>Doimiy ishga joylashtirish</Text>
        <Flex justify="space-between"><Text fontSize="xs">Reja:</Text><Text fontSize="sm">{data.permPlan} ming</Text></Flex>
        <Flex justify="space-between"><Text fontSize="xs">Amalda:</Text><Text fontSize="sm">{data.permActual} ming</Text></Flex>
        <Flex align="center" gap={2} mt={1}><Progress value={data.permPercent} size="sm" width="100%" colorScheme={data.permPercent<70?"red":"green"} /><Badge>{data.permPercent}%</Badge></Flex>
        <Text fontSize="xs" fontWeight="bold" mt={2}>Norasmiy legallashtirish</Text>
        <Flex justify="space-between"><Text fontSize="xs">Reja:</Text><Text fontSize="sm">{data.infPlan} ming</Text></Flex>
        <Flex justify="space-between"><Text fontSize="xs">Amalda:</Text><Text fontSize="sm">{data.infActual} ming</Text></Flex>
        <Flex align="center" gap={2} mt={1}><Progress value={data.infPercent} size="sm" width="100%" colorScheme={data.infPercent<70?"red":"green"} /><Badge>{data.infPercent}%</Badge></Flex>
      </CardBody>
    </Card>
  );
};

// --------------------------------------------------------------
// ASOSIY DASHBORD (4 TA TAB)
// --------------------------------------------------------------
const FinalDashboard = () => {
  const [brand600] = useToken("colors", ["brand.600"]);

  // Tooltip kontentlari (barcha ma'lumotlar bilan)
  const unempTooltip = (region: string) => {
    const d = unemploymentData.find(r => r.name === region);
    return d ? (
      <Box>
        <Text fontWeight="bold">{region}</Text>
        <Text>📅 Yil boshi: {d.startYear}%</Text>
        <Text>📊 Hozirgi (4 oy): {d.actualCurrent}%</Text>
        <Text>🎯 Yil oxiri maqsadi: {d.targetEndYear}%</Text>
        <Text>🏷 Holat: {d.status === "bad" ? "Xavf ostida" : d.status === "good" ? "Yaxshi" : "O‘rtacha"}</Text>
      </Box>
    ) : null;
  };
  const legalTooltip = (region: string) => {
    const d = legalData.find(r => r.name === region);
    return d ? (
      <Box>
        <Text fontWeight="bold">{region}</Text>
        <Text>📋 Yillik reja: {d.plan.toLocaleString()}</Text>
        <Text>✅ Amalda (4 oy): {d.actual.toLocaleString()}</Text>
        <Text>📈 Bajarilish: {d.percent}%</Text>
      </Box>
    ) : null;
  };
  const placementTooltip = (region: string) => {
    const d = placementData.find(r => r.name === region);
    return d ? (
      <Box>
        <Text fontWeight="bold">{region}</Text>
        <Text>📋 Yillik reja: {d.plan.toLocaleString()}</Text>
        <Text>✅ Amalda (4 oy): {d.actual.toLocaleString()}</Text>
        <Text>📈 Bajarilish: {d.percent}%</Text>
      </Box>
    ) : null;
  };
  const poorTooltip = (region: string) => {
    const d = poorUnemployedData.find(r => r.region === region);
    return d ? (
      <Box>
        <Text fontWeight="bold">{region}</Text>
        <Text>👥 Kamb. oilalardagi ishsizlar: {d.unemployed} ming</Text>
        <Text>💼 Doimiy ish reja/amalda: {d.permPlan} / {d.permActual} ming ({d.permPercent}%)</Text>
        <Text>⚖ Legallashtirish reja/amalda: {d.infPlan} / {d.infActual} ming ({d.infPercent}%)</Text>
      </Box>
    ) : null;
  };

  // Red flags
  const unempRedFlags = unemploymentData.filter(r => r.status === "bad").map(r => `${r.name}: ishsizlik ${r.actualCurrent}% (maqsad ${r.targetEndYear}%)`);
  const legalRedFlags = legalData.filter(r => r.percent < 70).map(r => `${r.name}: ${r.percent}%`);
  const placementRedFlags = placementData.filter(r => r.percent < 70).map(r => `${r.name}: ${r.percent}%`);
  const poorRedFlags = poorUnemployedData.filter(d => d.permPercent < 60 || d.infPercent < 60).map(d => `${d.region}: doimiy ${d.permPercent}%, legall ${d.infPercent}%`);

  return (
    <Box>
      <Heading size="xl" mb={2}>📊 Bandlik va kambag‘allik monitoringi</Heading>

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList bg="white" borderRadius="xl" p={2} flexWrap="wrap" gap={2}>
          <Tab>1. Ishsizlik darajasi</Tab>
          <Tab>2. Legallashtiriladigan ish o‘rinlari</Tab>
          <Tab>3. Doimiy ishga joylashtirish</Tab>
          <Tab>4. Kambag‘al oilalardagi ishsizlar</Tab>
        </TabList>

        <TabPanels mt={6}>
          {/* TAB 1 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Ishsizlik darajasi (%) – yil boshi, hozirgi, maqsad</Heading>
              <MapWithTooltip
                getColor={(region: string) => getStatusColor(unemploymentData.find(r => r.name === region)?.status || "moderate")}
                getTooltipContent={unempTooltip}
                dataMap={unemploymentData}
              />
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={4}>
                <Stat bg="gray.50" p={3}><StatLabel>Yaxshi holat</StatLabel><StatNumber color="green.500">{unemploymentData.filter(r=>r.status==="good").length}</StatNumber></Stat>
                <Stat bg="gray.50" p={3}><StatLabel>O‘rtacha</StatLabel><StatNumber color="orange.500">{unemploymentData.filter(r=>r.status==="moderate").length}</StatNumber></Stat>
                <Stat bg="gray.50" p={3}><StatLabel>Xavf ostida</StatLabel><StatNumber color="red.500">{unemploymentData.filter(r=>r.status==="bad").length}</StatNumber></Stat>
              </SimpleGrid>
              <TableContainer><Table size="sm"><Thead><Tr><Th>Viloyat</Th><Th isNumeric>Yil boshi</Th><Th isNumeric>Hozirgi (4 oy)</Th><Th isNumeric>Yil oxiri maqsadi</Th><Th>Holat</Th></Tr></Thead>
              <Tbody>{unemploymentData.map(r => <Tr key={r.name}><Td>{r.name}</Td><Td isNumeric>{r.startYear}%</Td><Td isNumeric color={r.status==="bad"?"red.500":r.status==="good"?"green.500":"orange.500"}>{r.actualCurrent}%</Td><Td isNumeric>{r.targetEndYear}%</Td><Td><Badge colorScheme={r.status==="bad"?"red":r.status==="good"?"green":"orange"}>{r.status==="bad"?"Xavf":r.status==="good"?"Yaxshi":"O‘rtacha"}</Badge></Td></Tr>)}</Tbody></Table></TableContainer>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{unempRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 2 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Legallashtiriladigan ish o‘rinlari (reja/amalda/%)</Heading>
              <MapWithTooltip
                getColor={(region: string) => getPercentColor(legalData.find(r => r.name === region)?.percent || 0)}
                getTooltipContent={legalTooltip}
                dataMap={legalData}
              />
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={4}>
                <Stat bg="gray.50" p={3}><StatLabel>Jami reja</StatLabel><StatNumber>{legalData.reduce((s,d)=>s+d.plan,0).toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3}><StatLabel>Jami amalda</StatLabel><StatNumber>{legalData.reduce((s,d)=>s+d.actual,0).toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3}><StatLabel>O‘rtacha foiz</StatLabel><StatNumber>{(legalData.reduce((s,d)=>s+d.percent,0)/legalData.length).toFixed(1)}%</StatNumber></Stat>
              </SimpleGrid>
              <TableContainer><Table size="sm"><Thead><Tr><Th>Hudud</Th><Th isNumeric>Reja (yillik)</Th><Th isNumeric>Amalda (4 oy)</Th><Th isNumeric>Bajarilish %</Th></Tr></Thead>
              <Tbody>{legalData.map(r => <Tr key={r.name}><Td>{r.name}</Td><Td isNumeric>{r.plan.toLocaleString()}</Td><Td isNumeric>{r.actual.toLocaleString()}</Td><Td isNumeric><Badge colorScheme={r.percent<70?"red":r.percent<80?"orange":"green"}>{r.percent}%</Badge></Td></Tr>)}</Tbody></Table></TableContainer>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{legalRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 3 */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Doimiy ishga joylashtirish (reja/amalda/%)</Heading>
              <MapWithTooltip
                getColor={(region: string) => getPercentColor(placementData.find(r => r.name === region)?.percent || 0)}
                getTooltipContent={placementTooltip}
                dataMap={placementData}
              />
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={4}>
                <Stat bg="gray.50" p={3}><StatLabel>Jami reja</StatLabel><StatNumber>{placementData.reduce((s,d)=>s+d.plan,0).toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3}><StatLabel>Jami amalda</StatLabel><StatNumber>{placementData.reduce((s,d)=>s+d.actual,0).toLocaleString()}</StatNumber></Stat>
                <Stat bg="gray.50" p={3}><StatLabel>O‘rtacha foiz</StatLabel><StatNumber>{(placementData.reduce((s,d)=>s+d.percent,0)/placementData.length).toFixed(1)}%</StatNumber></Stat>
              </SimpleGrid>
              <TableContainer><Table size="sm"><Thead><Tr><Th>Hudud</Th><Th isNumeric>Reja (yillik)</Th><Th isNumeric>Amalda (4 oy)</Th><Th isNumeric>Bajarilish %</Th></Tr></Thead>
              <Tbody>{placementData.map(r => <Tr key={r.name}><Td>{r.name}</Td><Td isNumeric>{r.plan.toLocaleString()}</Td><Td isNumeric>{r.actual.toLocaleString()}</Td><Td isNumeric><Badge colorScheme={r.percent<70?"red":r.percent<80?"orange":"green"}>{r.percent}%</Badge></Td></Tr>)}</Tbody></Table></TableContainer>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{placementRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* TAB 4 - KARTOCHKALAR */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Kambag‘al oilalardagi ishsizlar va bandlik choralari</Heading>
              <MapWithTooltip
                getColor={(region: string) => {
                  const d = poorUnemployedData.find(r => r.region === region);
                  return d ? getPercentColor((d.permPercent + d.infPercent) / 2) : "#CBD5E0";
                }}
                getTooltipContent={poorTooltip}
                dataMap={poorUnemployedData}
              />
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {poorUnemployedData.map(d => <PoorCard key={d.region} data={d} />)}
              </SimpleGrid>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{poorRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FinalDashboard;