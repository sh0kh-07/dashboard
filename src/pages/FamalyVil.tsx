import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, useToken, SimpleGrid, Stat, StatLabel,
  StatNumber, StatHelpText, Badge, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, HStack, Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  AlertTriangle, CheckCircle, Briefcase, TrendingUp, Scale,
  UserCheck, GraduationCap, Users, Home,
} from "lucide-react";
import kashkadaryaMap from "../data/kashkadaryaMap";

// ------------------------------
// QASHQADARYO VILOYATI UCHUN MA'LUMOTLAR (jadvaldan olingan)
// ------------------------------
const regionTotalPoorFamilies = 27877; // 27,877 ta kambag‘al oila
const regionServices = [
  { name: "Doimiy ish oʻrinlariga joylashtirish", families: 9757, icon: Briefcase, color: "#3182CE" },
  { name: "Tadbirkorlikka jalb qilish", families: 8922, icon: TrendingUp, color: "#38A169" },
  { name: "Kambagʻal oila daromadini oshirish", families: 4461, icon: Scale, color: "#DD6B20" },
  { name: "Norasmiy faoliyatni legallashtirish", families: 3065, icon: UserCheck, color: "#805AD5" },
  { name: "Kasb-hunarga oʻrgatish", families: 1672, icon: GraduationCap, color: "#D53F8C" },
];
const totalCovered = regionServices.reduce((s, i) => s + i.families, 0); // 27877
const riskFamilies = 5160;   // II bo‘lim: xavf ostidagi oilalar
const newApproachFamilies = 1563; // yangi yondashuvlar asosida

// ------------------------------
// TUMANLAR KESIMIDA TAQSIMOT (og‘irlik koeffitsiyentlari asosida)
// ------------------------------
interface DistrictFamilyData {
  name: string;
  poorFamilies: number;
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
const familiesPerWeight = regionTotalPoorFamilies / totalWeight;

const districtsData: DistrictFamilyData[] = districtsRaw.map(d => {
  let families = Math.round(familiesPerWeight * d.weight);
  // statusni aniqlash: o‘rtacha oila sonidan kelib chiqib
  const avgFamilies = regionTotalPoorFamilies / districtsRaw.length;
  let status: "bad" | "moderate" | "good";
  if (families > avgFamilies * 1.2) status = "bad";
  else if (families < avgFamilies * 0.8) status = "good";
  else status = "moderate";
  return { name: d.name, poorFamilies: families, status };
}).sort((a, b) => b.poorFamilies - a.poorFamilies);

// ------------------------------
// Xarita mapping
// ------------------------------
const getDistrictFamilies = (name: string): number => {
  const found = districtsData.find(d => d.name === name);
  return found ? found.poorFamilies : 0;
};

const getDistrictStatus = (name: string): "bad" | "moderate" | "good" | undefined => {
  const found = districtsData.find(d => d.name === name);
  return found?.status;
};

const PoorLevelVilFamilies = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    visible: boolean; x: number; y: number; name: string; families: number; status?: string;
  }>({ visible: false, x: 0, y: 0, name: "", families: 0 });

  const getPathColor = (families: number): string => {
    const avg = regionTotalPoorFamilies / districtsRaw.length;
    if (families > avg * 1.2) return red400;
    if (families < avg * 0.8) return green400;
    return yellow400;
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, name: string) => {
    const families = getDistrictFamilies(name);
    const status = getDistrictStatus(name);
    setTooltip({
      visible: true, x: e.clientX + 15, y: e.clientY + 15,
      name, families, status: status === "bad" ? "Xavf ostida" : status === "good" ? "Yaxshi" : "O‘rtacha",
    });
  };
  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    if (tooltip.visible) setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
  };
  const handleMouseLeave = () => setTooltip({ visible: false, x: 0, y: 0, name: "", families: 0 });
  const handleClick = (name: string) => {
    // Agar kerak bo‘lsa, tuman darajasidagi batafsil sahifaga o‘tish
    if (name === "Qarshi shahri") navigate("/family/vil/qarshi");
  };

  const chartData = districtsData.map(d => ({
    name: d.name.replace(" tumani", "").replace(" shahri", ""),
    families: d.poorFamilies,
  }));

  const stats = {
    totalPoor: regionTotalPoorFamilies,
    totalCovered,
    riskFamilies,
    newApproach: newApproachFamilies,
    goodCount: districtsData.filter(d => d.status === "good").length,
    moderateCount: districtsData.filter(d => d.status === "moderate").length,
    badCount: districtsData.filter(d => d.status === "bad").length,
  };

  const serviceChartData = regionServices.map(s => ({ name: s.name, families: s.families }));

  return (
    <Box minH="100vh">
      <Flex justify="space-between" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="xl" color="gray.800">Qashqadaryo viloyati – Kambag‘al oilalar monitoringi</Heading>
        <Flex align="center" gap={2}>
          <Text color="gray.600">Jami kambag‘al oilalar:</Text>
          <Text color={brand600} fontWeight="bold" fontSize="2xl">{stats.totalPoor.toLocaleString()}</Text>
        </Flex>
      </Flex>

      <Text color="gray.600" mb={4}>
        Xaritadagi ranglar: <strong style={{ color: green400 }}>Yashil</strong> — kam oila,{" "}
        <strong style={{ color: yellow400 }}>Sariq</strong> — o‘rtacha,{" "}
        <strong style={{ color: red400 }}>Qizil</strong> — ko‘p oila (xavf yuqori).
      </Text>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><Users size={16} /><Text>Jami kambag‘al oilalar</Text></HStack></StatLabel>
          <StatNumber>{stats.totalPoor.toLocaleString()}</StatNumber>
          <StatHelpText>viloyat bo‘yicha</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><CheckCircle size={16} /><Text>Xizmatlar bilan qamrab olingan</Text></HStack></StatLabel>
          <StatNumber color="green.400">{stats.totalCovered.toLocaleString()}</StatNumber>
          <StatHelpText>5 ta yo‘nalish</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><AlertTriangle size={16} /><Text>Xavf ostidagi oilalar</Text></HStack></StatLabel>
          <StatNumber color="yellow.400">{stats.riskFamilies.toLocaleString()}</StatNumber>
          <StatHelpText>daromadi pasayishi mumkin</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><TrendingUp size={16} /><Text>Yangi yondashuvlar bilan qamrab olingan</Text></HStack></StatLabel>
          <StatNumber color="blue.300">{stats.newApproach.toLocaleString()}</StatNumber>
          <StatHelpText>ta oila</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Xarita */}
      <Box position="relative" bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
        <svg viewBox={kashkadaryaMap.viewBox} style={{ width: "80%", height: "auto", margin: "0 auto", display: "block" }}>
          {kashkadaryaMap.layers.map((layer: any) => {
            const families = getDistrictFamilies(layer.name);
            const fillColor = getPathColor(families);
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
                onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2"; e.currentTarget.style.stroke = "#2b6cb0"; }}
                onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1"; e.currentTarget.style.stroke = "#1A202C"; }}
              />
            );
          })}
        </svg>
        {tooltip.visible && (
          <Box position="fixed" top={tooltip.y} left={tooltip.x} bg="gray.50" color="gray.800" px={4} py={2} borderRadius="lg" zIndex={1000} pointerEvents="none"  >
            <Text fontWeight="bold">{tooltip.name}</Text>
            <Text fontSize="sm">Kambag‘al oilalar: <strong>{tooltip.families.toLocaleString()}</strong></Text>
            <Text fontSize="xs">Holat: {tooltip.status}</Text>
          </Box>
        )}
      </Box>

      {/* Grafik: tumanlar bo‘yicha kambag‘al oilalar soni */}
      <Heading size="lg" mb={4} color="gray.800">Tumanlar kesimida kambag‘al oilalar soni</Heading>
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart layout="vertical" data={chartData} margin={{ left: 100 }}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fill: "#4a5568" }} label={{ value: "Oilalar soni", position: "insideBottom", offset: -5, fill: "#4a5568" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#4a5568" }} width={100} />
            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            <Bar dataKey="families" fill={brand600} radius={[0, 8, 8, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.families > 2000 ? red400 : entry.families > 1500 ? yellow400 : green400} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Xizmatlar bo‘yicha qamrov */}
      <Heading size="lg" mb={4} color="gray.800">Kambag‘al oilalarni qo‘llab-quvvatlash xizmatlari</Heading>
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={serviceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fill: "#4a5568" }} label={{ value: "Qamrab olingan oilalar", angle: -90, position: "insideLeft", fill: "#4a5568" }} />
            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
            <Bar dataKey="families" fill={brand600} radius={[8,8,0,0]}>
              {serviceChartData.map((_, idx) => <Cell key={idx} fill={regionServices[idx].color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Jadval: tumanlar va xizmatlar statistikasi */}
      <TableContainer bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" borderRadius="xl" overflowX="auto" mb={6}>
        <Table variant="simple">
          <Thead bg="gray.50" color="gray.700">
            <Tr><Th color="gray.700">Tuman</Th><Th isNumeric color="gray.700">Kambag‘al oilalar soni</Th><Th color="gray.700">Holat</Th></Tr>
          </Thead>
          <Tbody>
            {districtsData.map(d => (
              <Tr key={d.name}>
                <Td fontWeight="medium" color="gray.800">{d.name}</Td>
                <Td isNumeric color="gray.800">{d.poorFamilies.toLocaleString()}</Td>
                <Td color="gray.800"><Badge colorScheme={d.status === "good" ? "green" : d.status === "bad" ? "red" : "yellow"}>{d.status === "good" ? "Yaxshi" : d.status === "bad" ? "Xavf ostida" : "O‘rtacha"}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Xulosa */}
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg">
        <Flex gap={3} align="center"><AlertTriangle size={20} color={red400} /><Heading size="sm" color="gray.800">Asosiy xulosalar</Heading></Flex>
        <Text fontSize="sm" color="gray.600" mt={2}>
          • Qashqadaryo viloyatida jami <strong>{stats.totalPoor.toLocaleString()}</strong> ta kambag‘al oila aniqlangan.<br/>
          • Ulardan <strong>{stats.totalCovered.toLocaleString()}</strong> tasi (100%) 5 ta xizmat turi bilan qamrab olingan.<br/>
          • Eng ko‘p oila doimiy ishga joylashtirish ({regionServices[0].families.toLocaleString()}) va tadbirkorlik ({regionServices[1].families.toLocaleString()}) orqali qo‘llab-quvvatlanmoqda.<br/>
          • Xavf ostidagi oilalar soni <strong>{stats.riskFamilies.toLocaleString()}</strong> bo‘lib, ularning <strong>{stats.newApproach.toLocaleString()}</strong> tasi yangi yondashuvlar bilan ishlanmoqda.<br/>
          • Tumanlar ichida eng ko‘p kambag‘al oila Qarshi shahri va Shahrisabzda (og‘irlik koeffitsiyentiga ko‘ra), eng kam esa Mirishkor va Qamashida.
        </Text>
      </Box>
    </Box>
  );
};

export default PoorLevelVilFamilies;