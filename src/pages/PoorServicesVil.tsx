import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, useToken, SimpleGrid, Stat, StatLabel,
  StatNumber, StatHelpText, Badge, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, HStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";
import {
  AlertTriangle, CheckCircle, Briefcase, Building, Users,
  Landmark, Home, BookOpen, MapPin, TrendingUp,
  Camera
} from "lucide-react";
import kashkadaryaMap from "../data/kashkadaryaMap";

// ------------------------------
// QASHQADARYO VILOYATI KAMBAG'AL OILALAR (2026 XIZMATLAR)
// ------------------------------
const totalFamilies = 27877; 

const agencies = [
  { name: "Doimiy ish oʻrni", jobs: 9757, icon: Building, color: "#3182CE" },
  { name: "Tadbirkorlik", jobs: 8922, icon: Landmark, color: "#38A169" },
  { name: "Daromadni oshirish", jobs: 4461, icon: TrendingUp, color: "#DD6B20" },
  { name: "Legalizatsiya", jobs: 3065, icon: BookOpen, color: "#805AD5" },
  { name: "Kasb-hunar", jobs: 1672, icon: Users, color: "#D53F8C" },
];

const totalByAgencies = agencies.reduce((sum, a) => sum + a.jobs, 0);

// ------------------------------
// TUMANLAR KESIMIDA TAQSIMOT
// ------------------------------
interface DistrictJobData {
  name: string;
  legalJobs: number;   
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
const jobsPerWeight = totalFamilies / totalWeight;

const districtsData: DistrictJobData[] = districtsRaw.map(d => {
  const jobs = Math.round(jobsPerWeight * d.weight);
  const avgJobs = totalFamilies / districtsRaw.length;
  let status: "bad" | "moderate" | "good";
  if (jobs < avgJobs * 0.8) status = "bad";    
  else if (jobs > avgJobs * 1.2) status = "good"; 
  else status = "moderate";
  return { name: d.name, legalJobs: jobs, status };
}).sort((a, b) => b.legalJobs - a.legalJobs);

const getDistrictJobs = (name: string): number => {
  const found = districtsData.find(d => d.name === name);
  return found ? found.legalJobs : 0;
};

const getDistrictStatus = (name: string): "bad" | "moderate" | "good" | undefined => {
  const found = districtsData.find(d => d.name === name);
  return found?.status;
};

const PoorServicesVil = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    visible: boolean; x: number; y: number; name: string; jobs: number; status?: string;
  }>({ visible: false, x: 0, y: 0, name: "", jobs: 0 });

  const getPathColor = (jobs: number): string => {
    const avg = totalFamilies / districtsRaw.length;
    if (jobs < avg * 0.8) return red400;      
    if (jobs > avg * 1.2) return green400;    
    return yellow400;                         
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, name: string) => {
    const jobs = getDistrictJobs(name);
    const status = getDistrictStatus(name);
    setTooltip({
      visible: true, x: e.clientX + 15, y: e.clientY + 15,
      name, jobs,
      status: status === "bad" ? "Kam qamrov (qizil)" : status === "good" ? "Yuqori qamrov" : "O‘rtacha",
    });
  };
  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    if (tooltip.visible) setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
  };
  const handleMouseLeave = () => setTooltip({ visible: false, x: 0, y: 0, name: "", jobs: 0 });
  const handleClick = (name: string) => {
    if (name === "Qarshi shahri") navigate("/poor-services/vil/qarshi");
  };

  const chartData = districtsData.map(d => ({
    name: d.name.replace(" tumani", "").replace(" shahri", ""),
    jobs: d.legalJobs,
  }));

  const agencyChartData = agencies.map(a => ({ name: a.name, jobs: a.jobs }));

  return (
    <Box minH="100vh">
      <Flex justify="space-between" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="xl" color="gray.800">Qashqadaryo viloyati – Kambagʻal oilalarni ularning daromadini oshirishga qaratilgan xizmatlar bilan qamrab olish (2026-yil)</Heading>
        <Flex align="center" gap={2}>
          <Text color="gray.600">Viloyat bo'yicha jami:</Text>
          <Text color={brand600} fontWeight="bold" fontSize="2xl">{totalFamilies.toLocaleString()}</Text>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><Briefcase size={16} /><Text>Viloyat ko'rsatkichi (oila)</Text></HStack></StatLabel>
          <StatNumber>{totalFamilies.toLocaleString()}</StatNumber>
          <StatHelpText>2026 yil maqsadi</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><CheckCircle size={16} /><Text>Sohalar kesimida taqsimot</Text></HStack></StatLabel>
          <StatNumber color="green.400">{totalByAgencies.toLocaleString()}</StatNumber>
          <StatHelpText>5 ta yo'nalish</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><BookOpen size={16} /><Text>Eng katta yo'nalish</Text></HStack></StatLabel>
          <StatNumber color="brand.400">{agencies[0].jobs.toLocaleString()}</StatNumber>
          <StatHelpText>Doimiy ish o'rni (oila)</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box position="relative" bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
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
                onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2"; e.currentTarget.style.stroke = "#2b6cb0"; }}
                onMouseOut={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.strokeWidth = "1"; e.currentTarget.style.stroke = "#1A202C"; }}
              />
            );
          })}
        </svg>
        {tooltip.visible && (
          <Box position="fixed" top={tooltip.y} left={tooltip.x} bg="gray.50" color="gray.800" px={4} py={2} borderRadius="lg" zIndex={1000} pointerEvents="none">
            <Text fontWeight="bold">{tooltip.name}</Text>
            <Text fontSize="sm">Qamrab olinadigan: <strong>{tooltip.jobs.toLocaleString()}</strong> oila</Text>
            {tooltip.name === "Qarshi shahri" && <Text fontSize="xs" color="brand.300">Bosing - batafsil ma'lumot</Text>}
          </Box>
        )}
      </Box>

      <Heading size="lg" mb={4} color="gray.800">Tumanlar kesimida aholini qamrab olish</Heading>
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart layout="vertical" data={chartData} margin={{ left: 100 }}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fill: "#4a5568" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#4a5568" }} width={100} />
            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            <Bar dataKey="jobs" fill={brand600} radius={[0, 8, 8, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.jobs > 2500 ? green400 : entry.jobs < 1500 ? red400 : yellow400} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Heading size="lg" mb={4} color="gray.800">Yo'nalishlar bo'yicha taqsimot</Heading>
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agencyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 11 }} angle={-30} textAnchor="end" height={80} />
            <YAxis tick={{ fill: "#4a5568" }} />
            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
            <Legend wrapperStyle={{ color: "#1a202c" }} />
            <Bar dataKey="jobs" fill={brand600} radius={[8,8,0,0]}>
              {agencyChartData.map((_, idx) => <Cell key={idx} fill={agencies[idx].color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PoorServicesVil;
