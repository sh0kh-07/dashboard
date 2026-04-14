import React, { useState } from "react";
import {
  Box, Text, Heading, useToken, Flex, SimpleGrid, Stat, StatLabel,
  StatNumber, Badge, Progress, Card, CardBody, CardHeader, Divider,
  Alert, AlertIcon, AlertTitle, List, ListItem, ListIcon,
  Icon, Wrap, WrapItem, Tooltip,
  StatHelpText,
} from "@chakra-ui/react";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
  AlertTriangle, CheckCircle, MapPin, DollarSign, Home, Building, Users,
  TrendingUp, TrendingDown,
} from "lucide-react";

// --------------------------------------------------------------
// MA'LUMOTLAR: VILOYATLAR KESIMIDA
// --------------------------------------------------------------
interface RegionData {
  name: string;
  fundPlan: number;          // reja (mln so'm)
  fundActual: number;        // amalda (mln so'm)
  fundPercent: number;       // foiz
  improvedDistricts: number; // infratuzilmasi yaxshilangan og'ir tumanlar
  difficultMahallas: number; // og'ir toifadagi mahallalar soni
  fundCount: number;         // ajratilgan mablag'lar soni (shartnomalar)
  fundSum: number;           // ajratilgan mablag'lar summasi (mln so'm)
  status: "bad" | "moderate" | "good";
}

const regionsData: RegionData[] = [
  { name: "Qoraqalpogʻiston Respublikasi", fundPlan: 85000, fundActual: 62000, fundPercent: 72.9, improvedDistricts: 4, difficultMahallas: 28, fundCount: 156, fundSum: 62000, status: "bad" },
  { name: "Andijon viloyati", fundPlan: 120000, fundActual: 98000, fundPercent: 81.7, improvedDistricts: 3, difficultMahallas: 22, fundCount: 210, fundSum: 98000, status: "moderate" },
  { name: "Buxoro viloyati", fundPlan: 78000, fundActual: 67000, fundPercent: 85.9, improvedDistricts: 2, difficultMahallas: 15, fundCount: 145, fundSum: 67000, status: "good" },
  { name: "Jizzax viloyati", fundPlan: 65000, fundActual: 48000, fundPercent: 73.8, improvedDistricts: 3, difficultMahallas: 19, fundCount: 98, fundSum: 48000, status: "bad" },
  { name: "Qashqadaryo viloyati", fundPlan: 140000, fundActual: 105000, fundPercent: 75.0, improvedDistricts: 5, difficultMahallas: 35, fundCount: 280, fundSum: 105000, status: "bad" },
  { name: "Navoiy viloyati", fundPlan: 55000, fundActual: 51000, fundPercent: 92.7, improvedDistricts: 1, difficultMahallas: 8, fundCount: 92, fundSum: 51000, status: "good" },
  { name: "Namangan viloyati", fundPlan: 95000, fundActual: 74000, fundPercent: 77.9, improvedDistricts: 3, difficultMahallas: 26, fundCount: 167, fundSum: 74000, status: "moderate" },
  { name: "Samarqand viloyati", fundPlan: 130000, fundActual: 108000, fundPercent: 83.1, improvedDistricts: 3, difficultMahallas: 24, fundCount: 220, fundSum: 108000, status: "moderate" },
  { name: "Sirdaryo viloyati", fundPlan: 48000, fundActual: 36000, fundPercent: 75.0, improvedDistricts: 2, difficultMahallas: 14, fundCount: 73, fundSum: 36000, status: "bad" },
  { name: "Surxondaryo viloyati", fundPlan: 110000, fundActual: 82000, fundPercent: 74.5, improvedDistricts: 4, difficultMahallas: 31, fundCount: 190, fundSum: 82000, status: "bad" },
  { name: "Toshkent viloyati", fundPlan: 135000, fundActual: 115000, fundPercent: 85.2, improvedDistricts: 2, difficultMahallas: 18, fundCount: 245, fundSum: 115000, status: "good" },
  { name: "Fargʻona viloyati", fundPlan: 125000, fundActual: 101000, fundPercent: 80.8, improvedDistricts: 3, difficultMahallas: 27, fundCount: 215, fundSum: 101000, status: "moderate" },
  { name: "Xorazm viloyati", fundPlan: 72000, fundActual: 56000, fundPercent: 77.8, improvedDistricts: 2, difficultMahallas: 17, fundCount: 108, fundSum: 56000, status: "moderate" },
  { name: "Toshkent shahri", fundPlan: 200000, fundActual: 185000, fundPercent: 92.5, improvedDistricts: 0, difficultMahallas: 5, fundCount: 320, fundSum: 185000, status: "good" },
];

// --------------------------------------------------------------
// XARITA MAPPING (TO'LIQ)
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

const normalize = (s: string) => s
  .replace(/ viloyati$/i, '')
  .replace(/ shahri$/i, '')
  .replace(/ Respublikasi$/i, '')
  .replace(/[‘ʻ]/g, "'")
  .trim()
  .toLowerCase();

const getRegionName = (svgName: string): string | null => {
  if (svgToRegion[svgName]) return svgToRegion[svgName];
  const norm = normalize(svgName);
  for (const [key, val] of Object.entries(svgToRegion)) {
    if (normalize(key) === norm) return val;
  }
  const found = regionsData.find(r => normalize(r.name) === norm);
  return found ? found.name : null;
};

const getStatusColor = (status: string): string => {
  if (status === "bad") return "#E53E3E";
  if (status === "moderate") return "#ED8936";
  return "#48BB78";
};

// Xarita komponenti (hover tooltip bilan)
const MapWithTooltip = () => {
  const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, content: null });

  const getTooltipContent = (regionName: string) => {
    const data = regionsData.find(r => r.name === regionName);
    if (!data) return <Text>Maʼlumot yoʻq</Text>;
    return (
      <Box>
        <Text fontWeight="bold">{regionName}</Text>
        <Text>💰 Reja/Amalda: {data.fundPlan} / {data.fundActual} mln soʻm</Text>
        <Text>📊 Bajarilish: {data.fundPercent}%</Text>
        <Text>🏗 Yaxshilangan tumanlar: {data.improvedDistricts}</Text>
        <Text>🏘 Ogʻir mahallalar: {data.difficultMahallas}</Text>
        <Text>📄 Shartnomalar soni: {data.fundCount}</Text>
        <Text>💵 Ajratilgan summa: {data.fundSum} mln soʻm</Text>
      </Box>
    );
  };

  return (
    <Box position="relative" display="flex" justifyContent="center" my={6}>
      <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
        {Uzbekistan.locations.map((loc: any) => {
          const region = getRegionName(loc.name);
          const data = region ? regionsData.find(r => r.name === region) : null;
          const fillColor = data ? getStatusColor(data.status) : "#CBD5E0";
          return (
            <path
              key={loc.id}
              d={loc.path}
              onMouseEnter={(e) => {
                const content = region ? getTooltipContent(region) : <Text>Maʼlumot yoʻq</Text>;
                setTooltip({ visible: true, x: e.clientX, y: e.clientY, content });
              }}
              onMouseMove={(e) => setTooltip((p: any) => ({ ...p, x: e.clientX, y: e.clientY }))}
              onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, content: null })}
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

// --------------------------------------------------------------
// KARTOCHKA KOMPONENTI (viloyatlar uchun)
// --------------------------------------------------------------
const RegionCard = ({ data }: { data: RegionData }) => {
  const borderColor = data.status === "bad" ? "red.400" : data.status === "good" ? "green.400" : "orange.400";
  return (
    <Card borderLeft="4px" borderLeftColor={borderColor} boxShadow="sm" height="100%">
      <CardHeader pb={0}>
        <Flex justify="space-between" align="center">
          <Heading size="sm"><Icon as={MapPin} mr={1} />{data.name}</Heading>
          <Badge colorScheme={data.status === "bad" ? "red" : data.status === "good" ? "green" : "orange"} fontSize="0.7em">
            {data.status === "bad" ? "Og‘ir" : data.status === "good" ? "Yaxshi" : "O‘rtacha"}
          </Badge>
        </Flex>
      </CardHeader>
      <CardBody pt={2}>
        {/* Mablag'lar */}
        <Stat size="sm" mb={2}>
          <StatLabel fontSize="xs">💰 Ajratilgan mablag‘ (reja/amalda)</StatLabel>
          <StatNumber fontSize="md">{data.fundPlan.toLocaleString()} / {data.fundActual.toLocaleString()} mln so‘m</StatNumber>
          <Flex align="center" gap={2} mt={1}>
            <Progress value={data.fundPercent} size="sm" width="100%" colorScheme={data.fundPercent < 75 ? "red" : "green"} />
            <Badge colorScheme={data.fundPercent < 75 ? "red" : "green"}>{data.fundPercent}%</Badge>
          </Flex>
        </Stat>
        <Divider my={2} />
        {/* Infratuzilma va mahallalar */}
        <SimpleGrid columns={2} spacingX={2} spacingY={1} mb={2}>
          <Stat size="sm"><StatLabel fontSize="xs">🏗 Yaxshilangan tumanlar</StatLabel><StatNumber fontSize="md">{data.improvedDistricts}</StatNumber></Stat>
          <Stat size="sm"><StatLabel fontSize="xs">🏘 Og‘ir mahallalar</StatLabel><StatNumber fontSize="md">{data.difficultMahallas}</StatNumber></Stat>
        </SimpleGrid>
        <Divider my={2} />
        {/* Shartnomalar va summa */}
        <SimpleGrid columns={2} spacingX={2} spacingY={1}>
          <Stat size="sm"><StatLabel fontSize="xs">📄 Shartnomalar soni</StatLabel><StatNumber fontSize="md">{data.fundCount}</StatNumber></Stat>
          <Stat size="sm"><StatLabel fontSize="xs">💵 Ajratilgan summa</StatLabel><StatNumber fontSize="md">{data.fundSum.toLocaleString()} mln</StatNumber></Stat>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

// --------------------------------------------------------------
// ASOSIY KOMPONENT
// --------------------------------------------------------------
export default function Regions() {
  // Red flaglar (kamchiliklar)
  const redFlags = regionsData
    .filter(r => r.fundPercent < 75 || r.difficultMahallas > 25)
    .map(r => `${r.name}: mablag‘ bajarilishi ${r.fundPercent}% (reja ${r.fundPlan} mln so‘m), og‘ir mahallalar ${r.difficultMahallas} ta.`);

  const summary = {
    totalPlan: regionsData.reduce((s, r) => s + r.fundPlan, 0),
    totalActual: regionsData.reduce((s, r) => s + r.fundActual, 0),
    totalPercent: (regionsData.reduce((s, r) => s + r.fundActual, 0) / regionsData.reduce((s, r) => s + r.fundPlan, 0)) * 100,
    totalDistrictsImproved: regionsData.reduce((s, r) => s + r.improvedDistricts, 0),
    totalDifficultMahallas: regionsData.reduce((s, r) => s + r.difficultMahallas, 0),
    totalFundCount: regionsData.reduce((s, r) => s + r.fundCount, 0),
    totalFundSum: regionsData.reduce((s, r) => s + r.fundSum, 0),
  };

  return (
    <Box>
      <Heading size="xl" mb={2}> Mahallalar va hududlarni rivojlantirish monitoringi</Heading>

      {/* Xarita */}
      <MapWithTooltip />

      {/* Asosiy statistika */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} my={4}>
        <Card><CardBody><Stat><StatLabel>Jami reja</StatLabel><StatNumber>{summary.totalPlan.toLocaleString()} mln so‘m</StatNumber><StatLabel>Amalda: {summary.totalActual.toLocaleString()} mln</StatLabel><Progress value={summary.totalPercent} size="sm" colorScheme="blue" /><Text fontSize="sm">Bajarilish: {summary.totalPercent.toFixed(1)}%</Text></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>🏗 Yaxshilangan tumanlar</StatLabel><StatNumber>{summary.totalDistrictsImproved}</StatNumber><StatHelpText>og‘ir toifadagi</StatHelpText></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>🏘 Og‘ir mahallalar</StatLabel><StatNumber>{summary.totalDifficultMahallas}</StatNumber><StatHelpText>jami</StatHelpText></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>📄 Shartnomalar soni</StatLabel><StatNumber>{summary.totalFundCount}</StatNumber><StatLabel>💵 Summa: {summary.totalFundSum.toLocaleString()} mln so‘m</StatLabel></Stat></CardBody></Card>
      </SimpleGrid>

      {/* Viloyatlar kartochkalari (jadval o‘rniga) */}
      <Heading size="md" mt={6} mb={4}>Viloyatlar kesimida batafsil maʼlumot</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {regionsData.map(region => (
          <RegionCard key={region.name} data={region} />
        ))}
      </SimpleGrid>

      {/* Kamchiliklar */}
      <Alert status="error" borderRadius="lg" mt={6}>
        <AlertIcon />
        <AlertTitle>Aniqlangan kamchiliklar (red flag)</AlertTitle>
        <List spacing={1} mt={2}>
          {redFlags.map((flag, idx) => (
            <ListItem key={idx}><ListIcon as={AlertTriangle} color="red.500" />{flag}</ListItem>
          ))}
        </List>
      </Alert>

      {/* Xulosa kartochkalari (og'ir va yaxshi hududlar) */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
        <Card borderLeft="4px" borderLeftColor="red.400">
          <CardHeader><Heading size="sm">⚠ Eng og‘ir holatdagi viloyatlar</Heading></CardHeader>
          <CardBody>
            <List spacing={2}>
              {regionsData.filter(r => r.status === "bad").map(r => (
                <ListItem key={r.name} display="flex" alignItems="center" gap={2}>
                  <Icon as={AlertTriangle} color="red.500" boxSize={4} />
                  <Text fontSize="sm"><strong>{r.name}</strong> – bajarilish {r.fundPercent}%, og‘ir mahallalar {r.difficultMahallas}</Text>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
        <Card borderLeft="4px" borderLeftColor="green.400">
          <CardHeader><Heading size="sm">✅ Eng yaxshi natijalar</Heading></CardHeader>
          <CardBody>
            <List spacing={2}>
              {regionsData.filter(r => r.status === "good").map(r => (
                <ListItem key={r.name} display="flex" alignItems="center" gap={2}>
                  <Icon as={CheckCircle} color="green.500" boxSize={4} />
                  <Text fontSize="sm"><strong>{r.name}</strong> – bajarilish {r.fundPercent}%, {r.improvedDistricts} ta tuman yaxshilangan</Text>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}