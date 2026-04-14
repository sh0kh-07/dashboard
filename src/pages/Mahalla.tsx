import React, { useState } from "react";
import {
  Box, Text, Heading, useToken, Flex, SimpleGrid, Stat, StatLabel,
  StatNumber, Badge, Progress, Card, CardBody, CardHeader, Divider,
  Alert, AlertIcon, AlertTitle, List, ListItem, ListIcon,
  Icon, Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
  AlertTriangle, CheckCircle, MapPin, DollarSign, Home, Building, Users,
  TrendingUp, TrendingDown, Briefcase, Scale, GraduationCap, Landmark,
  Wallet, Banknote, Globe, Shield,
} from "lucide-react";

// --------------------------------------------------------------
// 1. VILOYATLAR MA'LUMOTLARI (XARITA UCHUN)
// --------------------------------------------------------------
interface RegionServiceData {
  name: string;
  familiesPlan: number;      // oilalar rejasi
  familiesActual: number;    // amalda
  familiesPercent: number;
  peoplePlan: number;        // aholi rejasi
  peopleActual: number;
  peoplePercent: number;
  fundCount: number;         // ajratilgan mablag'lar soni (shartnomalar)
  fundSum: number;           // summasi (mln so'm)
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
// 2. XIZMAT TURLARI (OILALAR VA AHOLI UCHUN)
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
  incomeIncrease: number;  // oshgan daromad (mln so'm)
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
  count: number;      // shartnomalar soni
  amount: number;     // summasi (mln so'm)
  color: string;
}

const fundSources: FundSource[] = [
  { name: "Davlat byudjeti", icon: Landmark, count: 1245, amount: 456000, color: "#3182CE" },
  { name: "Jamg‘armalar", icon: Wallet, count: 423, amount: 189000, color: "#38A169" },
  { name: "Bank kreditlari", icon: Banknote, count: 876, amount: 324000, color: "#DD6B20" },
  { name: "Tashqi manba (xalqaro tashkilotlar)", icon: Globe, count: 156, amount: 231000, color: "#805AD5" },
];

// Monitoring bosqichlari
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
// XARITA MAPPING
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

// Xarita komponenti
const MapWithTooltip = () => {
  const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, content: null });

  const getTooltipContent = (regionName: string) => {
    const data = regionsData.find(r => r.name === regionName);
    if (!data) return <Text>Maʼlumot yoʻq</Text>;
    return (
      <Box>
        <Text fontWeight="bold">{regionName}</Text>
        <Text>👨‍👩‍👧‍👦 Oilalar: {data.familiesActual} / {data.familiesPlan} ({data.familiesPercent}%)</Text>
        <Text>👥 Aholi: {data.peopleActual} / {data.peoplePlan} ({data.peoplePercent}%)</Text>
        <Text>💰 Mablag‘lar: {data.fundCount} ta / {data.fundSum} mln so‘m</Text>
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
// VILOYAT KARTOCHKASI (1-TAB UCHUN)
// --------------------------------------------------------------
const RegionServiceCard = ({ data }: { data: RegionServiceData }) => (
  <Card borderLeft="4px" borderLeftColor={getStatusColor(data.status)} boxShadow="sm" height="100%">
    <CardHeader pb={0}>
      <Flex justify="space-between"><Heading size="sm"><Icon as={MapPin} mr={1} />{data.name}</Heading><Badge colorScheme={data.status === "bad" ? "red" : data.status === "good" ? "green" : "orange"}>{data.status === "bad" ? "Og‘ir" : data.status === "good" ? "Yaxshi" : "O‘rtacha"}</Badge></Flex>
    </CardHeader>
    <CardBody pt={2}>
      <Stat size="sm" mb={2}><StatLabel fontSize="xs">👨‍👩‍👧‍👦 Oilalar</StatLabel><StatNumber fontSize="md">{data.familiesActual.toLocaleString()} / {data.familiesPlan.toLocaleString()}</StatNumber><Flex align="center" gap={2} mt={1}><Progress value={data.familiesPercent} size="sm" width="100%" colorScheme={data.familiesPercent<75?"red":"green"} /><Badge>{data.familiesPercent}%</Badge></Flex></Stat>
      <Stat size="sm" mb={2}><StatLabel fontSize="xs">👥 Aholi</StatLabel><StatNumber fontSize="md">{data.peopleActual.toLocaleString()} / {data.peoplePlan.toLocaleString()}</StatNumber><Flex align="center" gap={2} mt={1}><Progress value={data.peoplePercent} size="sm" width="100%" colorScheme={data.peoplePercent<75?"red":"green"} /><Badge>{data.peoplePercent}%</Badge></Flex></Stat>
      <Divider />
      <Flex justify="space-between" mt={2}><Text fontSize="xs">💰 Mablag‘lar:</Text><Text fontSize="sm">{data.fundCount} ta / {data.fundSum.toLocaleString()} mln</Text></Flex>
    </CardBody>
  </Card>
);

// --------------------------------------------------------------
// XIZMAT KARTOCHKASI (2,3-TABLAR UCHUN)
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
        <Stat size="sm"><StatLabel fontSize="xs">{label}</StatLabel><StatNumber>{actual.toLocaleString()} / {plan.toLocaleString()}</StatNumber><Flex align="center" gap={2} mt={1}><Progress value={percent} size="sm" width="100%" colorScheme={percent<75?"red":"green"} /><Badge>{percent}%</Badge></Flex></Stat>
        <Divider my={2} />
        <Flex align="center" gap={2}><Icon as={TrendingUp} color="green.500" boxSize={4} /><Text fontSize="sm">Oshgan daromad: <strong>{service.incomeIncrease.toLocaleString()} mln so‘m</strong></Text></Flex>
      </CardBody>
    </Card>
  );
};

// --------------------------------------------------------------
// ASOSIY DASHBORD
// --------------------------------------------------------------
export default function ServicesDashboard() {
  // Red flaglar
  const regionRedFlags = regionsData.filter(r => r.familiesPercent < 75 || r.peoplePercent < 75).map(r => `${r.name}: oila ${r.familiesPercent}%, aholi ${r.peoplePercent}%`);
  const serviceRedFlags = serviceTypes.filter(s => s.familiesPercent < 75 || s.peoplePercent < 75).map(s => `${s.name}: oila ${s.familiesPercent}%, aholi ${s.peoplePercent}%`);
  const fundRedFlags = ["Tashqi manba mablag‘lari 231 mlrd so‘m bo‘lib, rejadan 15% kam (265 mlrd reja)", "Monitoringning 4-bosqichida hujjatlashtirishda 12 ta kamchilik aniqlandi"];

  // Umumiy statistika
  const totalFamiliesPlan = regionsData.reduce((s, r) => s + r.familiesPlan, 0);
  const totalFamiliesActual = regionsData.reduce((s, r) => s + r.familiesActual, 0);
  const totalPeoplePlan = regionsData.reduce((s, r) => s + r.peoplePlan, 0);
  const totalPeopleActual = regionsData.reduce((s, r) => s + r.peopleActual, 0);
  const totalFundSum = regionsData.reduce((s, r) => s + r.fundSum, 0);

  return (
    <Box >
      <Heading size="xl" mb={2}>📊 Ko‘rsatilgan xizmatlar monitoringi</Heading>
      <Text mb={4}>Daromadni oshirishga qaratilgan xizmatlar – oilalar, aholi va ajratilgan mablag‘lar tahlili</Text>

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList bg="white" borderRadius="xl" p={2} flexWrap="wrap" gap={2}>
          <Tab>1. Xarita (viloyatlar)</Tab>
          <Tab>2. Oilalar</Tab>
          <Tab>3. Aholi</Tab>
          <Tab>4. Ajratilgan mablag‘lar</Tab>
        </TabList>

        <TabPanels mt={6}>
          {/* ---------- TAB 1: XARITA ---------- */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Viloyatlar kesimida daromad oshirish xizmatlari</Heading>
              <MapWithTooltip />
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {regionsData.map(r => <RegionServiceCard key={r.name} data={r} />)}
              </SimpleGrid>
              <Alert status="error" mt={6}><AlertIcon /><AlertTitle>Aniqlangan kamchiliklar (red flag)</AlertTitle><List>{regionRedFlags.map((f,i)=><ListItem key={i}><ListIcon as={AlertTriangle}/>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* ---------- TAB 2: OILALAR ---------- */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Xizmat turlari bo‘yicha oilalar qamrovi</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {serviceTypes.map(s => <ServiceCard key={s.name} service={s} type="families" />)}
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
                <Card><CardBody><Stat><StatLabel>Jami oilalar reja</StatLabel><StatNumber>{totalFamiliesPlan.toLocaleString()}</StatNumber><StatLabel>Amalda: {totalFamiliesActual.toLocaleString()}</StatLabel><Progress value={(totalFamiliesActual/totalFamiliesPlan)*100} size="sm" colorScheme="blue" /><Text>Bajarilish: {((totalFamiliesActual/totalFamiliesPlan)*100).toFixed(1)}%</Text></Stat></CardBody></Card>
                <Card><CardBody><Stat><StatLabel>Jami oshgan daromad (oilalar)</StatLabel><StatNumber>{serviceTypes.reduce((s,sv)=>s+sv.incomeIncrease,0).toLocaleString()} mln so‘m</StatNumber></Stat></CardBody></Card>
              </SimpleGrid>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{serviceRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* ---------- TAB 3: AHOLI ---------- */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Xizmat turlari bo‘yicha aholi qamrovi</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {serviceTypes.map(s => <ServiceCard key={s.name} service={s} type="people" />)}
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
                <Card><CardBody><Stat><StatLabel>Jami aholi reja</StatLabel><StatNumber>{totalPeoplePlan.toLocaleString()}</StatNumber><StatLabel>Amalda: {totalPeopleActual.toLocaleString()}</StatLabel><Progress value={(totalPeopleActual/totalPeoplePlan)*100} size="sm" colorScheme="blue" /><Text>Bajarilish: {((totalPeopleActual/totalPeoplePlan)*100).toFixed(1)}%</Text></Stat></CardBody></Card>
                <Card><CardBody><Stat><StatLabel>Jami oshgan daromad (aholi)</StatLabel><StatNumber>{serviceTypes.reduce((s,sv)=>s+sv.incomeIncrease,0).toLocaleString()} mln so‘m</StatNumber></Stat></CardBody></Card>
              </SimpleGrid>
              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar:<List>{serviceRedFlags.map((f,i)=><ListItem key={i}>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>

          {/* ---------- TAB 4: AJRATILGAN MABLAG'LAR ---------- */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="xl" p={5} borderWidth="1px">
              <Heading size="md">Ajratilgan mablag‘lar manbalari</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={4}>
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
              <Card mt={6}><CardBody><Stat><StatLabel>Jami ajratilgan mablag‘</StatLabel><StatNumber>{fundSources.reduce((s,f)=>s+f.amount,0).toLocaleString()} mln so‘m</StatNumber><StatLabel>Jami shartnomalar soni: {fundSources.reduce((s,f)=>s+f.count,0)}</StatLabel></Stat></CardBody></Card>

              <Heading size="md" mt={6}>📋 Mablag‘larni maqsadli yetib borishi – 10 bosqichli monitoring</Heading>
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

              <Alert status="error" mt={6}><AlertIcon />Kamchiliklar (red flag):<List>{fundRedFlags.map((f,i)=><ListItem key={i}><ListIcon as={AlertTriangle}/>{f}</ListItem>)}</List></Alert>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}