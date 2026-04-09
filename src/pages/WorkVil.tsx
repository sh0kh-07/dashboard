import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, useToken, SimpleGrid, Stat, StatLabel,
  StatNumber, StatHelpText, Badge, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, HStack, Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";
import {
  AlertTriangle, CheckCircle, Briefcase, Building, Users,
  Landmark, HeartHandshake, GraduationCap, Truck, Home, Camera,
} from "lucide-react";
import kashkadaryaMap from "../data/kashkadaryaMap";

// ------------------------------
// QASHQADARYO VILOYATI UCHUN MA'LUMOTLAR (JADVALDAN)
// ------------------------------
const totalLegalJobs = 77737; // Jami legallashtiriladigan ish o‘rinlari

// Idoralar bo‘yicha taqsimot (jadvaldagi ustunlar)
const agencies = [
  { name: "Soliq qo‘mitasi", jobs: 26750, icon: Landmark, color: "#3182CE" },
  { name: "Ijtimoiy himoya milliy agentligi", jobs: 9030, icon: HeartHandshake, color: "#38A169" },
  { name: "Kambag‘allikni qisqartirish va bandlik vazirligi", jobs: 9640, icon: Briefcase, color: "#DD6B20" },
  { name: "Qishloq xo‘jaligi vazirligi", jobs: 15800, icon: GraduationCap, color: "#805AD5" },
  { name: "Transport vazirligi", jobs: 7836, icon: Truck, color: "#D53F8C" },
  { name: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", jobs: 8231, icon: Home, color: "#ED8936" },
  { name: "Turizm qo‘mitasi", jobs: 450, icon: Camera, color: "#9F7AEA" },
];

// Jami tekshiruv: 26750+9030+9640+15800+7836+8231+450 = 77737
const totalByAgencies = agencies.reduce((sum, a) => sum + a.jobs, 0);

// ------------------------------
// TUMANLAR KESIMIDA TAQSIMOT (og‘irlik koeffitsiyentlari asosida)
// ------------------------------
interface DistrictJobData {
  name: string;
  legalJobs: number;   // legallashtiriladigan ish o‘rinlari soni
  status: "bad" | "moderate" | "good";
}

const districtsRaw = [
  { name: "Qarshi shahri", weight: 1.2 },
  { name: "Shahrisabz shahri", weight: 1.1 },
  { name: "Qarshi tumani", weight: 0.9 },
  { name: "Kitob tumani", weight: 0.8 },
  { name: "Ko'kdala tumani", weight: 0.7 },
  { name: "Shaxrisabz tumani", weight: 0.7 },
  { name: "Muborak tumani", weight: 0.6 },
  { name: "Kasbi tumani", weight: 0.6 },
  { name: "G'uzor tumani", weight: 0.55 },
  { name: "Chiroqchi tumani", weight: 0.55 },
  { name: "Koson tumani", weight: 0.5 },
  { name: "Yakkabog' tumani", weight: 0.5 },
  { name: "Dehqonobod tumani", weight: 0.45 },
  { name: "Nishon tumani", weight: 0.45 },
  { name: "Qamashi tumani", weight: 0.4 },
  { name: "Mirishkor tumani", weight: 0.4 },
];

const totalWeight = districtsRaw.reduce((s, d) => s + d.weight, 0);
const jobsPerWeight = totalLegalJobs / totalWeight;

const districtsData: DistrictJobData[] = districtsRaw.map(d => {
  let jobs = Math.round(jobsPerWeight * d.weight);
  // statusni aniqlash: o‘rtacha ish o‘rinlari sonidan kelib chiqib
  const avgJobs = totalLegalJobs / districtsRaw.length;
  let status: "bad" | "moderate" | "good";
  if (jobs < avgJobs * 0.8) status = "bad";      // kam ish o‘rni – yomon
  else if (jobs > avgJobs * 1.2) status = "good"; // ko‘p ish o‘rni – yaxshi
  else status = "moderate";
  return { name: d.name, legalJobs: jobs, status };
}).sort((a, b) => b.legalJobs - a.legalJobs);

// Xarita mapping
const getDistrictJobs = (name: string): number => {
  const found = districtsData.find(d => d.name === name);
  return found ? found.legalJobs : 0;
};

const getDistrictStatus = (name: string): "bad" | "moderate" | "good" | undefined => {
  const found = districtsData.find(d => d.name === name);
  return found?.status;
};

const LegalJobsVil = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    visible: boolean; x: number; y: number; name: string; jobs: number; status?: string;
  }>({ visible: false, x: 0, y: 0, name: "", jobs: 0 });

  const getPathColor = (jobs: number): string => {
    const avg = totalLegalJobs / districtsRaw.length;
    if (jobs < avg * 0.8) return red400;      // kam ish o‘rni – yomon (qizil)
    if (jobs > avg * 1.2) return green400;    // ko‘p ish o‘rni – yaxshi (yashil)
    return yellow400;                         // o‘rtacha
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, name: string) => {
    const jobs = getDistrictJobs(name);
    const status = getDistrictStatus(name);
    setTooltip({
      visible: true, x: e.clientX + 15, y: e.clientY + 15,
      name, jobs,
      status: status === "bad" ? "Kam ish o‘rni (xavf)" : status === "good" ? "Ko‘p ish o‘rni (yaxshi)" : "O‘rtacha",
    });
  };
  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    if (tooltip.visible) setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
  };
  const handleMouseLeave = () => setTooltip({ visible: false, x: 0, y: 0, name: "", jobs: 0 });
  const handleClick = (name: string) => {
    if (name === "Qarshi shahri") navigate("/swork/vil/qarshi");
  };

  const chartData = districtsData.map(d => ({
    name: d.name.replace(" tumani", "").replace(" shahri", ""),
    jobs: d.legalJobs,
  }));

  const agencyChartData = agencies.map(a => ({ name: a.name, jobs: a.jobs }));

  const stats = {
    totalJobs: totalLegalJobs,
    totalByAgencies,
    goodCount: districtsData.filter(d => d.status === "good").length,
    moderateCount: districtsData.filter(d => d.status === "moderate").length,
    badCount: districtsData.filter(d => d.status === "bad").length,
  };

  return (
    <Box minH="100vh">
      <Flex justify="space-between" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="xl">Qashqadaryo viloyati – Legallashtiriladigan ish o‘rinlari</Heading>
        <Flex align="center" gap={2}>
          <Text color="gray.400">Jami ish o‘rinlari:</Text>
          <Text color={brand600} fontWeight="bold" fontSize="2xl">{stats.totalJobs.toLocaleString()}</Text>
        </Flex>
      </Flex>

      <Text color="gray.300" mb={4}>
        Xaritadagi ranglar: <strong style={{ color: green400 }}>Yashil</strong> — ko‘p ish o‘rni (yaxshi),{" "}
        <strong style={{ color: yellow400 }}>Sariq</strong> — o‘rtacha,{" "}
        <strong style={{ color: red400 }}>Qizil</strong> — kam ish o‘rni (xavf).
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat bg="dark.card" p={3} borderRadius="lg">
          <StatLabel><HStack><Briefcase size={16} /><Text>Jami legallashtiriladigan ish o‘rinlari</Text></HStack></StatLabel>
          <StatNumber>{stats.totalJobs.toLocaleString()}</StatNumber>
          <StatHelpText>viloyat bo‘yicha</StatHelpText>
        </Stat>
        <Stat bg="dark.card" p={3} borderRadius="lg">
          <StatLabel><HStack><CheckCircle size={16} /><Text>Idoralar bo‘yicha jami</Text></HStack></StatLabel>
          <StatNumber color="green.400">{stats.totalByAgencies.toLocaleString()}</StatNumber>
          <StatHelpText>7 ta tashkilot</StatHelpText>
        </Stat>
        <Stat bg="dark.card" p={3} borderRadius="lg">
          <StatLabel><HStack><Users size={16} /><Text>Eng faol idora</Text></HStack></StatLabel>
          <StatNumber color="blue.300">{agencies[0].jobs.toLocaleString()}</StatNumber>
          <StatHelpText>Soliq qo‘mitasi</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Xarita */}
      <Box position="relative" bg="dark.card" p={4} borderRadius="xl" mb={8}>
        <svg viewBox={kashkadaryaMap.viewBox} style={{ width: "80%", height: "auto", margin: "0 auto", display: "block" }}>
          {kashkadaryaMap.layers.map((layer: any) => {
            const jobs = getDistrictJobs(layer.name);
            const fillColor = getPathColor(jobs);
            return (
              <path
                key={layer.id}
                d={layer.d}
                fill={fillColor}
                stroke="#1A202C"
                strokeWidth={1}
                cursor="pointer"
                opacity={0.85}
                onMouseEnter={(e) => handleMouseEnter(e, layer.name)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(layer.name)}
                onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2"; e.currentTarget.style.stroke = "#ffffff"; }}
                onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1"; e.currentTarget.style.stroke = "#1A202C"; }}
              />
            );
          })}
        </svg>
        {tooltip.visible && (
          <Box position="fixed" top={tooltip.y} left={tooltip.x} bg="gray.800" color="white" px={4} py={2} borderRadius="lg" zIndex={1000} pointerEvents="none" backdropFilter="blur(4px)" bgColor="rgba(0,0,0,0.85)">
            <Text fontWeight="bold">{tooltip.name}</Text>
            <Text fontSize="sm">Legallashtiriladigan ish o‘rinlari: <strong>{tooltip.jobs.toLocaleString()}</strong></Text>
            <Text fontSize="xs">Holat: {tooltip.status}</Text>
          </Box>
        )}
      </Box>

      {/* Grafik: tumanlar bo‘yicha ish o‘rinlari */}
      <Heading size="lg" mb={4}>Tumanlar kesimida legallashtiriladigan ish o‘rinlari</Heading>
      <Box bg="dark.card" p={4} borderRadius="xl" mb={8}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart layout="vertical" data={chartData} margin={{ left: 100 }}>
            <CartesianGrid stroke="#2d3748" />
            <XAxis type="number" tick={{ fill: "#cbd5e0" }} label={{ value: "Ish o‘rinlari soni", position: "insideBottom", offset: -5, fill: "#cbd5e0" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#cbd5e0" }} width={100} />
            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#1a202c", border: "none", borderRadius: "8px" }} />
            <Bar dataKey="jobs" fill={brand600} radius={[0, 8, 8, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.jobs > 5500 ? green400 : entry.jobs < 4000 ? red400 : yellow400} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Idoralar bo‘yicha taqsimot */}
      <Heading size="lg" mb={4}>Idoralar (tashkilotlar) bo‘yicha taqsimot</Heading>
      <Box bg="dark.card" p={4} borderRadius="xl" mb={8}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agencyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="name" tick={{ fill: "#cbd5e0", fontSize: 11 }} angle={-30} textAnchor="end" height={80} />
            <YAxis tick={{ fill: "#cbd5e0" }} label={{ value: "Ish o‘rinlari soni", angle: -90, position: "insideLeft", fill: "#cbd5e0" }} />
            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#1a202c", border: "none" }} />
            <Legend wrapperStyle={{ color: "white" }} />
            <Bar dataKey="jobs" fill={brand600} radius={[8,8,0,0]}>
              {agencyChartData.map((_, idx) => <Cell key={idx} fill={agencies[idx].color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Jadval: tumanlar va ish o‘rinlari */}
      <TableContainer bg="dark.card" borderRadius="xl" overflowX="auto" mb={6}>
        <Table variant="simple">
          <Thead bg="gray.800">
            <Tr><Th>Tuman</Th><Th isNumeric>Legallashtiriladigan ish o‘rinlari</Th><Th>Holat</Th></Tr>
          </Thead>
          <Tbody>
            {districtsData.map(d => (
              <Tr key={d.name}>
                <Td fontWeight="medium">{d.name}</Td>
                <Td isNumeric>{d.legalJobs.toLocaleString()}</Td>
                <Td><Badge colorScheme={d.status === "good" ? "green" : d.status === "bad" ? "red" : "yellow"}>{d.status === "good" ? "Ko‘p (yaxshi)" : d.status === "bad" ? "Kam (xavf)" : "O‘rtacha"}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Xulosa */}
      <Box bg="dark.card" p={4} borderRadius="lg">
        <Flex gap={3} align="center"><AlertTriangle size={20} color={yellow400} /><Heading size="sm">Asosiy xulosalar</Heading></Flex>
        <Text fontSize="sm" color="gray.300" mt={2}>
          • Qashqadaryo viloyatida jami <strong>{stats.totalJobs.toLocaleString()}</strong> ta legallashtiriladigan ish o‘rni rejalashtirilgan.<br/>
          • Eng ko‘p ish o‘rni Soliq qo‘mitasi ({agencies[0].jobs.toLocaleString()}) va Qishloq xo‘jaligi vazirligi ({agencies[3].jobs.toLocaleString()}) hissasiga to‘g‘ri keladi.<br/>
          • Tumanlar kesimida Qarshi shahri, Shahrisabz va Kitobda ish o‘rinlari ko‘p (yashil), Qamashi, Mirishkor va Dehqonoboda esa kam (qizil).<br/>
          • Kam ish o‘rni bo‘lgan tumanlarda bandlikka ko‘maklashish choralari kuchaytirilishi kerak.
        </Text>
      </Box>
    </Box>
  );
};

export default LegalJobsVil;