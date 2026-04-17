import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, SimpleGrid, Stat, StatLabel, StatNumber,
  Badge, Progress, Card, CardBody, CardHeader, Divider, Icon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Alert, AlertIcon, AlertTitle, List, ListItem, ListIcon,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
  AlertTriangle, CheckCircle, MapPin, Home, Users, Landmark,
  TrendingUp, Briefcase, Scale, GraduationCap, Wallet, Banknote, Globe,
  Flag, AlertOctagon,
} from "lucide-react";

// --------------------------------------------------------------
// 1. VILOYATLAR MA'LUMOTLARI (XARITA UCHUN)
// --------------------------------------------------------------
interface RegionServiceData {
  name: string;
  familiesPlan: number;
  familiesActual: number;
  familiesPercent: number;
  peoplePlan: number;
  peopleActual: number;
  peoplePercent: number;
  fundCount: number;
  fundSum: number;
  status: "bad" | "moderate" | "good";
}

const regionsData: RegionServiceData[] = [
  { name: "Qoraqalpogʻiston Respublikasi", familiesPlan: 12500, familiesActual: 8900, familiesPercent: 71.2, peoplePlan: 65000, peopleActual: 46280, peoplePercent: 71.2, fundCount: 156, fundSum: 124500, status: "bad" },
  { name: "Andijon viloyati", familiesPlan: 18200, familiesActual: 14800, familiesPercent: 81.3, peoplePlan: 94640, peopleActual: 76960, peoplePercent: 81.3, fundCount: 210, fundSum: 189000, status: "moderate" },
  { name: "Buxoro viloyati", familiesPlan: 11200, familiesActual: 9600, familiesPercent: 85.7, peoplePlan: 58240, peopleActual: 49920, peoplePercent: 85.7, fundCount: 145, fundSum: 130500, status: "good" },
  { name: "Jizzax viloyati", familiesPlan: 9800, familiesActual: 7200, familiesPercent: 73.5, peoplePlan: 50960, peopleActual: 37440, peoplePercent: 73.5, fundCount: 98, fundSum: 88200, status: "bad" },
  { name: "Qashqadaryo viloyati", familiesPlan: 21500, familiesActual: 16100, familiesPercent: 74.9, peoplePlan: 111800, peopleActual: 83720, peoplePercent: 74.9, fundCount: 280, fundSum: 252000, status: "bad" },
  { name: "Navoiy viloyati", familiesPlan: 8200, familiesActual: 7600, familiesPercent: 92.7, peoplePlan: 42640, peopleActual: 39520, peoplePercent: 92.7, fundCount: 92, fundSum: 82800, status: "good" },
  { name: "Namangan viloyati", familiesPlan: 14500, familiesActual: 11300, familiesPercent: 77.9, peoplePlan: 75400, peopleActual: 58760, peoplePercent: 77.9, fundCount: 167, fundSum: 150300, status: "moderate" },
  { name: "Samarqand viloyati", familiesPlan: 19800, familiesActual: 16400, familiesPercent: 82.8, peoplePlan: 102960, peopleActual: 85280, peoplePercent: 82.8, fundCount: 220, fundSum: 198000, status: "moderate" },
  { name: "Sirdaryo viloyati", familiesPlan: 7200, familiesActual: 5400, familiesPercent: 75.0, peoplePlan: 37440, peopleActual: 28080, peoplePercent: 75.0, fundCount: 73, fundSum: 65700, status: "bad" },
  { name: "Surxondaryo viloyati", familiesPlan: 16800, familiesActual: 12500, familiesPercent: 74.4, peoplePlan: 87360, peopleActual: 65000, peoplePercent: 74.4, fundCount: 190, fundSum: 171000, status: "bad" },
  { name: "Toshkent viloyati", familiesPlan: 20500, familiesActual: 17400, familiesPercent: 84.9, peoplePlan: 106600, peopleActual: 90480, peoplePercent: 84.9, fundCount: 245, fundSum: 220500, status: "good" },
  { name: "Fargʻona viloyati", familiesPlan: 19200, familiesActual: 15500, familiesPercent: 80.7, peoplePlan: 99840, peopleActual: 80600, peoplePercent: 80.7, fundCount: 215, fundSum: 193500, status: "moderate" },
  { name: "Xorazm viloyati", familiesPlan: 10800, familiesActual: 8400, familiesPercent: 77.8, peoplePlan: 56160, peopleActual: 43680, peoplePercent: 77.8, fundCount: 108, fundSum: 97200, status: "moderate" },
  { name: "Toshkent shahri", familiesPlan: 28500, familiesActual: 26300, familiesPercent: 92.3, peoplePlan: 148200, peopleActual: 136760, peoplePercent: 92.3, fundCount: 320, fundSum: 288000, status: "good" },
];

// --------------------------------------------------------------
// 2. XIZMAT TURLARI
// --------------------------------------------------------------
interface ServiceType {
  name: string;
  icon: any;
  familiesPlan: number;
  familiesActual: number;
  familiesPercent: number;
  peoplePlan: number;
  peopleActual: number;
  peoplePercent: number;
  incomeIncrease: number;
}

const serviceTypes: ServiceType[] = [
  { name: "Doimiy ish oʻrinlariga joylashtirish", icon: Briefcase, familiesPlan: 92127, familiesActual: 72127, familiesPercent: 78.3, peoplePlan: 479060, peopleActual: 375060, peoplePercent: 78.3, incomeIncrease: 245000 },
  { name: "Tadbirkorlikka jalb qilish", icon: TrendingUp, familiesPlan: 84231, familiesActual: 64231, familiesPercent: 76.3, peoplePlan: 438001, peopleActual: 334001, peoplePercent: 76.3, incomeIncrease: 198000 },
  { name: "Kambagʻal oila daromadini oshirish", icon: Scale, familiesPlan: 42113, familiesActual: 33113, familiesPercent: 78.6, peoplePlan: 218988, peopleActual: 172188, peoplePercent: 78.6, incomeIncrease: 87600 },
  { name: "Norasmiy faoliyatni legallashtirish", icon: CheckCircle, familiesPlan: 28951, familiesActual: 20951, familiesPercent: 72.4, peoplePlan: 150545, peopleActual: 108945, peoplePercent: 72.4, incomeIncrease: 65200 },
  { name: "Kasb-hunarga oʻrgatish", icon: GraduationCap, familiesPlan: 15793, familiesActual: 12793, familiesPercent: 81.0, peoplePlan: 82124, peopleActual: 66524, peoplePercent: 81.0, incomeIncrease: 32400 },
];

// --------------------------------------------------------------
// 3. MABLAG' MANBALARI
// --------------------------------------------------------------
interface FundSource {
  name: string;
  icon: any;
  count: number;
  amount: number;
  color: string;
}

const fundSources: FundSource[] = [
  { name: "Davlat byudjeti", icon: Landmark, count: 1245, amount: 456000, color: "#3182CE" },
  { name: "Jamg‘armalar", icon: Wallet, count: 423, amount: 189000, color: "#38A169" },
  { name: "Bank kreditlari", icon: Banknote, count: 876, amount: 324000, color: "#DD6B20" },
  { name: "Tashqi manba (xalqaro tashkilotlar)", icon: Globe, count: 156, amount: 231000, color: "#805AD5" },
];

const monitoringStages = [
  "1. Rejalashtirish va byudjetlashtirish",
  "2. Mablag‘larni ajratish (tumanlar kesimida)",
  "3. Mahallalarga yetkazish (biriktirilgan xodimlar)",
  "4. Hujjatlashtirish va shartnomalar tuzish",
  "5. Birinchi chorak monitoringi (fevral-mart)",
  "6. Ijro intizomi va kamchiliklarni aniqlash",
  "7. Mablag‘larni maqsadli sarflanishi tekshiruvi",
  "8. Ikkinchi chorak monitoringi (aprel-may)",
  "9. Natijadorlik va daromad oshishini baholash",
  "10. Yakuniy hisobot va tahlil (iyun)",
];

// --------------------------------------------------------------
// 4. RED FLAG MA'LUMOTLARI (PROBLEMLI KONTRAKTLAR)
// --------------------------------------------------------------
interface RedFlagItem {
  id: number;
  name: string;           // xizmat nomi yoki mahalla/tuman
  region: string;
  problemType: string;
  contractAmount: number;
  status: string;
  details: string;
}

// Generatsiya qilamiz (real ma'lumotlar o'rniga)
const generateRedFlags = (): RedFlagItem[] => {
  const problems = [
    { type: "Shartnoma bajarilmagan", status: "Bajarilmagan", detail: "Mablag‘ o‘zlashtirilmagan, ish boshlanmagan" },
    { type: "Muddat buzilgan", status: "Muddati o‘tgan", detail: "Belgilangan muddatda ish tugatilmagan" },
    { type: "Sifatli ta'mirlanmagan", status: "Kamchiliklar bor", detail: "Ish sifati talabga javob bermaydi" },
    { type: "Hisobot taqdim etilmagan", status: "Hisobotsiz", detail: "Mablag‘ sarfi bo‘yicha hisobot kelib tushmagan" },
    { type: "Jarima qo‘llanilgan", status: "Jarima", detail: "Shartnoma shartlarini buzganlik uchun jarima solingan" },
  ];

  const services = [...serviceTypes];
  const redFlags: RedFlagItem[] = [];
  let id = 0;

  // Har bir xizmat turidan 1-2 ta muammo yaratamiz
  services.forEach(service => {
    const problemCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < problemCount; i++) {
      const prob = problems[Math.floor(Math.random() * problems.length)];
      const amount = Math.floor(Math.random() * 50000) + 10000;
      redFlags.push({
        id: id++,
        name: service.name,
        region: regionsData[Math.floor(Math.random() * regionsData.length)].name,
        problemType: prob.type,
        contractAmount: amount,
        status: prob.status,
        details: `${service.name} bo‘yicha ${prob.detail}. Shartnoma summasi ${amount.toLocaleString()} mln so‘m.`,
      });
    }
  });

  // Yana bir nechta mahallalarga oid muammolar
  const mahallaProblems = [
    { name: "Oltin vodiy MFY", region: "Fargʻona viloyati", problem: "Yo‘l ta'miri tugallanmagan", amount: 12500 },
    { name: "Navbahor MFY", region: "Namangan viloyati", problem: "Suv tarmog‘i ishlamayapti", amount: 8400 },
    { name: "Do‘stlik MFY", region: "Surxondaryo viloyati", problem: "Maktab ta'miri sifatsiz", amount: 22300 },
    { name: "Chorshanba MFY", region: "Qashqadaryo viloyati", problem: "Elektr ta'minotida uzilishlar", amount: 6700 },
  ];
  mahallaProblems.forEach((mp, idx) => {
    redFlags.push({
      id: id++,
      name: mp.name,
      region: mp.region,
      problemType: mp.problem,
      contractAmount: mp.amount,
      status: "Bajarilmagan",
      details: `${mp.name} da ${mp.problem}. Ajratilgan mablag‘ ${mp.amount.toLocaleString()} mln so‘m, ammo ish to‘liq bajarilmagan.`,
    });
  });

  return redFlags;
};

const redFlagsData = generateRedFlags();

// --------------------------------------------------------------
// XARITA MAPPING (o'zgarishsiz)
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

// --------------------------------------------------------------
// XARITA KOMPONENTI (DINAMIK RANG VA TOOLTIP)
// --------------------------------------------------------------
interface MapWithTooltipProps {
  activeSection: "families" | "people" | "funds" | "redflag";
}

const MapWithTooltip: React.FC<MapWithTooltipProps> = ({ activeSection }) => {
  const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, content: null });
  const navigate = useNavigate();

  const getColorBySection = (region: RegionServiceData) => {
    if (activeSection === "families") {
      const percent = region.familiesPercent;
      if (percent < 75) return "#E53E3E";
      if (percent < 85) return "#ED8936";
      return "#48BB78";
    }
    if (activeSection === "people") {
      const percent = region.peoplePercent;
      if (percent < 75) return "#E53E3E";
      if (percent < 85) return "#ED8936";
      return "#48BB78";
    }
    if (activeSection === "funds") {
      const maxSum = Math.max(...regionsData.map(r => r.fundSum));
      const intensity = region.fundSum / maxSum;
      if (intensity < 0.4) return "#E53E3E";
      if (intensity < 0.7) return "#ED8936";
      return "#48BB78";
    }
    if (activeSection === "redflag") {
      // Red flag bo'limida xarita kulrang yoki status bo'yicha
      if (region.status === "bad") return "#E53E3E";
      if (region.status === "moderate") return "#ED8936";
      return "#48BB78";
    }
    return "#CBD5E0";
  };

  const getTooltipContent = (region: RegionServiceData) => {
    if (activeSection === "families") {
      return (
        <Box>
          <Text fontWeight="bold">{region.name}</Text>
          <Text>👨‍👩‍👧‍👦 Oilalar qamrovi</Text>
          <Text>Reja: {region.familiesPlan.toLocaleString()}</Text>
          <Text>Amalda: {region.familiesActual.toLocaleString()}</Text>
          <Text fontWeight="bold">Bajarilish: {region.familiesPercent}%</Text>
        </Box>
      );
    }
    if (activeSection === "people") {
      return (
        <Box>
          <Text fontWeight="bold">{region.name}</Text>
          <Text>👥 Aholi qamrovi</Text>
          <Text>Reja: {region.peoplePlan.toLocaleString()}</Text>
          <Text>Amalda: {region.peopleActual.toLocaleString()}</Text>
          <Text fontWeight="bold">Bajarilish: {region.peoplePercent}%</Text>
        </Box>
      );
    }
    if (activeSection === "funds") {
      return (
        <Box>
          <Text fontWeight="bold">{region.name}</Text>
          <Text>💰 Ajratilgan mablag‘lar</Text>
          <Text>Shartnomalar soni: {region.fundCount}</Text>
          <Text fontWeight="bold">Summa: {region.fundSum.toLocaleString()} mln so‘m</Text>
        </Box>
      );
    }
    if (activeSection === "redflag") {
      const regionRedFlags = redFlagsData.filter(rf => rf.region === region.name);
      return (
        <Box>
          <Text fontWeight="bold">{region.name}</Text>
          <Text>⚠️ Red Flaglar soni: {regionRedFlags.length}</Text>
          {regionRedFlags.slice(0, 2).map(rf => (
            <Text key={rf.id} fontSize="xs">{rf.problemType}</Text>
          ))}
          {regionRedFlags.length > 2 && <Text fontSize="xs">va boshqalar...</Text>}
        </Box>
      );
    }
    return null;
  };

  const handleClick = (regionName: string) => {
    console.log("Clicked region:", regionName);
  };

  return (
    <Box position="relative" display="flex" justifyContent="center" my={6}>
      <svg viewBox={Uzbekistan.viewBox} width="80%" style={{ cursor: "pointer" }}>
        {Uzbekistan.locations.map((loc: any) => {
          const regionName = getRegionName(loc.name);
          const regionData = regionName ? regionsData.find(r => r.name === regionName) : null;
          const fillColor = regionData ? getColorBySection(regionData) : "#CBD5E0";
          return (
            <path
              key={loc.id}
              d={loc.path}
              onMouseEnter={(e) => {
                if (!regionData) return;
                setTooltip({
                  visible: true,
                  x: e.clientX,
                  y: e.clientY,
                  content: getTooltipContent(regionData),
                });
              }}
              onMouseMove={(e) => setTooltip((p: any) => ({ ...p, x: e.clientX, y: e.clientY }))}
              onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, content: null })}
              onClick={() => regionData && handleClick(regionData.name)}
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
// XIZMAT KARTOCHKASI (o'zgarishsiz)
// --------------------------------------------------------------
const ServiceCard = ({ service, type }: { service: ServiceType; type: "families" | "people" }) => {
  const plan = type === "families" ? service.familiesPlan : service.peoplePlan;
  const actual = type === "families" ? service.familiesActual : service.peopleActual;
  const percent = type === "families" ? service.familiesPercent : service.peoplePercent;
  const label = type === "families" ? "Oilalar soni" : "Aholi soni";
  return (
    <Card borderTop="4px" borderTopColor={percent < 75 ? "#E53E3E" : percent < 85 ? "#ED8936" : "#48BB78"} boxShadow="sm">
      <CardHeader pb={0}><Flex align="center" gap={2}><Icon as={service.icon} boxSize={5} /><Heading size="sm">{service.name}</Heading></Flex></CardHeader>
      <CardBody pt={2}>
        <Stat size="sm"><StatLabel fontSize="xs">{label}</StatLabel><StatNumber>{actual.toLocaleString()} / {plan.toLocaleString()}</StatNumber><Flex align="center" gap={2} mt={1}><Progress value={percent} size="sm" width="100%" colorScheme={percent < 75 ? "red" : "green"} /><Badge>{percent}%</Badge></Flex></Stat>
        <Divider my={2} />
        <Flex align="center" gap={2}><Icon as={TrendingUp} color="green.500" boxSize={4} /><Text fontSize="sm">Oshgan daromad: <strong>{service.incomeIncrease.toLocaleString()} mln so‘m</strong></Text></Flex>
      </CardBody>
    </Card>
  );
};

// --------------------------------------------------------------
// ASOSIY KOMPONENT (4 KARTOCHKA)
// --------------------------------------------------------------
export default function ServicesDashboard() {
  const [activeSection, setActiveSection] = useState<"families" | "people" | "funds" | "redflag">("families");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Общие показатели
  const totalFamiliesPlan = regionsData.reduce((s, r) => s + r.familiesPlan, 0);
  const totalFamiliesActual = regionsData.reduce((s, r) => s + r.familiesActual, 0);
  const familiesPercent = (totalFamiliesActual / totalFamiliesPlan) * 100;

  const totalPeoplePlan = regionsData.reduce((s, r) => s + r.peoplePlan, 0);
  const totalPeopleActual = regionsData.reduce((s, r) => s + r.peopleActual, 0);
  const peoplePercent = (totalPeopleActual / totalPeoplePlan) * 100;

  const totalFunds = fundSources.reduce((s, f) => s + f.amount, 0);
  const totalContracts = fundSources.reduce((s, f) => s + f.count, 0);

  const totalRedFlags = redFlagsData.length;

  // Red flaglar (eski) – o'chirmaymiz, lekin yangi redflag bo'limi uchun alohida
  const regionRedFlags = regionsData.filter(r => r.familiesPercent < 75 || r.peoplePercent < 75).map(r => `${r.name}: oila ${r.familiesPercent}%, aholi ${r.peoplePercent}%`);
  const serviceRedFlags = serviceTypes.filter(s => s.familiesPercent < 75 || s.peoplePercent < 75).map(s => `${s.name}: oila ${s.familiesPercent}%, aholi ${s.peoplePercent}%`);
  const fundRedFlags = ["Tashqi manba mablag‘lari 231 mlrd so‘m bo‘lib, rejadan 15% kam (265 mlrd reja)", "Monitoringning 4-bosqichida hujjatlashtirishda 12 ta kamchilik aniqlandi"];

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    onOpen();
  };

  const sections = [
    {
      id: "families",
      label: "Oilalar qamrovi",
      icon: <Home size={24} />,
      value: `${familiesPercent.toFixed(1)}%`,
      sub: `Reja bajarilishi (${totalFamiliesActual.toLocaleString()} / ${totalFamiliesPlan.toLocaleString()})`,
    },
    {
      id: "people",
      label: "Aholi qamrovi",
      icon: <Users size={24} />,
      value: `${peoplePercent.toFixed(1)}%`,
      sub: `Reja bajarilishi (${totalPeopleActual.toLocaleString()} / ${totalPeoplePlan.toLocaleString()})`,
    },
    {
      id: "funds",
      label: "Ajratilgan mablag‘lar",
      icon: <Landmark size={24} />,
      value: `${totalFunds.toLocaleString()} mln`,
      sub: `${totalContracts} ta shartnoma`,
    },
    {
      id: "redflag",
      label: "Aniqlangan kamchiliklar",
      icon: <Flag size={24} />,
      value: `${totalRedFlags}`,
      sub: "Aniqlangan muammolar",
    },
  ];

  // Jadvalni render qilish (redflag uchun)
  const renderRedFlagTable = () => (
    <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden" mt={4}>
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th>Xizmat / Mahalla</Th>
            <Th>Viloyat</Th>
            <Th>Muammo turi</Th>
            <Th isNumeric>Shartnoma summasi (mln so‘m)</Th>
            <Th>Holat</Th>
          </Tr>
        </Thead>
        <Tbody>
          {redFlagsData.map((flag) => (
            <Tr key={flag.id} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => handleRowClick(flag)}>
              <Td fontWeight="medium">{flag.name}</Td>
              <Td>{flag.region}</Td>
              <Td>{flag.problemType}</Td>
              <Td isNumeric fontWeight="bold" color="red.500">{flag.contractAmount.toLocaleString()} mln</Td>
              <Td><Badge colorScheme="red">{flag.status}</Badge></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {/* Горизонтальные карточки-вкладки (4 штуки) */}
      <Flex
        gap={4}
        mb={6}
        overflowX="auto"
        pb={2}
        css={{
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "3px" },
          "&::-webkit-scrollbar-thumb": { background: "#cbd5e0", borderRadius: "3px" },
        }}
      >
        {sections.map((section) => (
          <Box
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            cursor="pointer"
            minW="220px"
            flexShrink={0}
            bg={activeSection === section.id ? "blue.500" : "white"}
            color={activeSection === section.id ? "white" : "gray.700"}
            borderRadius="xl"
            boxShadow="md"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
              bg: activeSection === section.id ? "blue.600" : "gray.50",
            }}
            p={4}
          >
            <Flex align="center" gap={2} mb={2}>
              <Box color={activeSection === section.id ? "white" : "blue.500"}>
                {section.icon}
              </Box>
              <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                {section.label}
              </Text>
            </Flex>
            <Text fontSize="2xl" fontWeight="bold">
              {section.value}
            </Text>
            <Text fontSize="xs" opacity={0.8}>
              {section.sub}
            </Text>
          </Box>
        ))}
      </Flex>

      {/* Контент выбранного раздела */}
      <Box borderRadius="xl" borderWidth="1px">
        {/* Карта показывается для всех разделов, кроме redflag? – пусть показывается везде, для redflag показывает статус регионов */}
        <MapWithTooltip activeSection={activeSection} />

        {/* Oilalar qamrovi */}
        {activeSection === "families" && (
          <>
            <Heading size="md" mt={4} mb={4}>Xizmat turlari bo‘yicha oilalar qamrovi</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {serviceTypes.map(s => <ServiceCard key={s.name} service={s} type="families" />)}
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
              <Card><CardBody><Stat><StatLabel>Jami oilalar reja</StatLabel><StatNumber>{totalFamiliesPlan.toLocaleString()}</StatNumber><StatLabel>Amalda: {totalFamiliesActual.toLocaleString()}</StatLabel><Progress value={familiesPercent} size="sm" colorScheme="blue" /><Text>Bajarilish: {familiesPercent.toFixed(1)}%</Text></Stat></CardBody></Card>
              <Card><CardBody><Stat><StatLabel>Jami oshgan daromad (oilalar)</StatLabel><StatNumber>{serviceTypes.reduce((s, sv) => s + sv.incomeIncrease, 0).toLocaleString()} mln so‘m</StatNumber></Stat></CardBody></Card>
            </SimpleGrid>
          
          </>
        )}

        {/* Aholi qamrovi */}
        {activeSection === "people" && (
          <>
            <Heading size="md" mt={4} mb={4}>Xizmat turlari bo‘yicha aholi qamrovi</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {serviceTypes.map(s => <ServiceCard key={s.name} service={s} type="people" />)}
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
              <Card><CardBody><Stat><StatLabel>Jami aholi reja</StatLabel><StatNumber>{totalPeoplePlan.toLocaleString()}</StatNumber><StatLabel>Amalda: {totalPeopleActual.toLocaleString()}</StatLabel><Progress value={peoplePercent} size="sm" colorScheme="blue" /><Text>Bajarilish: {peoplePercent.toFixed(1)}%</Text></Stat></CardBody></Card>
              <Card><CardBody><Stat><StatLabel>Jami oshgan daromad (aholi)</StatLabel><StatNumber>{serviceTypes.reduce((s, sv) => s + sv.incomeIncrease, 0).toLocaleString()} mln so‘m</StatNumber></Stat></CardBody></Card>
            </SimpleGrid>
          
          </>
        )}

        {/* Ajratilgan mablag‘lar */}
        {activeSection === "funds" && (
          <>
            <Heading size="md" mt={4} mb={4}>Ajratilgan mablag‘lar manbalari</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {fundSources.map(f => (
                <Card key={f.name} borderTop="4px" borderTopColor={f.color}>
                  <CardBody>
                    <Flex align="center" gap={2} mb={2}><Icon as={f.icon} color={f.color} /><Heading size="xs">{f.name}</Heading></Flex>
                    <Stat size="sm"><StatLabel>Shartnomalar soni</StatLabel><StatNumber>{f.count}</StatNumber></Stat>
                    <Stat size="sm"><StatLabel>Summa</StatLabel><StatNumber>{f.amount.toLocaleString()} mln so‘m</StatNumber></Stat>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            <Card mt={6}><CardBody><Stat><StatLabel>Jami ajratilgan mablag‘</StatLabel><StatNumber>{totalFunds.toLocaleString()} mln so‘m</StatNumber><StatLabel>Jami shartnomalar soni: {totalContracts}</StatLabel></Stat></CardBody></Card>

            <Heading size="md" mt={6}>📋 Mablag‘larni maqsadli yetib borishi – 10 bosqichli monitoring</Heading>
            <Box bg='white'>
              <TableContainer mt={4} border="1px solid" borderColor="gray.200" borderRadius="lg">
                <Table size="sm"><Thead bg="gray.50"><Tr><Th>Bosqich</Th><Th>Nazorat choralari</Th><Th>Holat</Th></Tr></Thead>
                  <Tbody>
                    {monitoringStages.map((stage, idx) => (
                      <Tr key={idx}>
                        <Td fontWeight="medium">{stage.split('. ')[0]}</Td>
                        <Td>{stage.split('. ')[1]}</Td>
                        <Td><Badge colorScheme={idx < 8 ? "green" : idx === 8 ? "orange" : "yellow"}>Amalga oshirilmoqda</Badge></Td>
                      </Tr>
                    ))}
                  </Tbody></Table>
              </TableContainer>
            </Box>
          </>
        )}

        {/* RED FLAG – yangi bo‘lim */}
        {activeSection === "redflag" && (
          <>
            <Heading size="md" mt={4} mb={4}>⚠️ Aniqlangan muammolar (bajarilmagan kontraktlar, sifat kamchiliklari)</Heading>
            <Box bg={'white'}>
              {renderRedFlagTable()}
            </Box>
          </>
        )}
      </Box>

      {/* Модальное окно с деталями */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <Icon as={AlertOctagon} color="red.500" />
              Muammo haqida batafsil
            </Flex>
          </ModalHeader>
          <ModalBody>
            {selectedItem && (
              <Box>
                <Text fontWeight="bold" fontSize="lg">{selectedItem.name}</Text>
                <Divider my={2} />
                <SimpleGrid columns={2} spacing={3}>
                  <Text fontWeight="semibold">Viloyat:</Text><Text>{selectedItem.region}</Text>
                  <Text fontWeight="semibold">Muammo turi:</Text><Text>{selectedItem.problemType}</Text>
                  <Text fontWeight="semibold">Shartnoma summasi:</Text><Text fontWeight="bold" color="red.500">{selectedItem.contractAmount.toLocaleString()} mln so‘m</Text>
                  <Text fontWeight="semibold">Holat:</Text><Badge colorScheme="red">{selectedItem.status}</Badge>
                  <Text fontWeight="semibold">Batafsil:</Text><Text>{selectedItem.details}</Text>
                </SimpleGrid>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>Yopish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}