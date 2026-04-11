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
  Landmark, Home, BookOpen, MapPin,
} from "lucide-react";
import kashkadaryaMap from "../data/kashkadaryaMap";

// ------------------------------
// QASHQADARYO VILOYATI MA'LUMOTLARI (2026 DOIMIY ISH O'RINLARI)
// ------------------------------
const totalLegalJobs = 86763; 

const agencies = [
  { name: "Investitsiya loyihalari", jobs: 11977, icon: Landmark, color: "#3182CE" },
  { name: "Xizmat/Servis", jobs: 20151, icon: Briefcase, color: "#38A169" },
  { name: "Qishloq xoʻjaligi", jobs: 7718, icon: Home, color: "#DD6B20" },
  { name: "Qurilish", jobs: 2753, icon: Building, color: "#805AD5" },
  { name: "Boʻsh ish oʻrinlari", jobs: 13164, icon: Users, color: "#D53F8C" },
  { name: "Moliyaviy koʻmak", jobs: 31000, icon: BookOpen, color: "#ED8936" },
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
const jobsPerWeight = totalLegalJobs / totalWeight;

const districtsData: DistrictJobData[] = districtsRaw.map(d => {
  const jobs = Math.round(jobsPerWeight * d.weight);
  const avgJobs = totalLegalJobs / districtsRaw.length;
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

const JobPlacementVil = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    visible: boolean; x: number; y: number; name: string; jobs: number; status?: string;
  }>({ visible: false, x: 0, y: 0, name: "", jobs: 0 });

  const getPathColor = (jobs: number): string => {
    const avg = totalLegalJobs / districtsRaw.length;
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
      status: status === "bad" ? "Kam ehtiyoj (xavf)" : status === "good" ? "Yuqori bandlik" : "O‘rtacha",
    });
  };
  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    if (tooltip.visible) setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
  };
  const handleMouseLeave = () => setTooltip({ visible: false, x: 0, y: 0, name: "", jobs: 0 });
  const handleClick = (name: string) => {
    if (name === "Qarshi shahri") navigate("/job-placement/vil/qarshi");
  };

  const chartData = districtsData.map(d => ({
    name: d.name.replace(" tumani", "").replace(" shahri", ""),
    jobs: d.legalJobs,
  }));

  const agencyChartData = agencies.map(a => ({ name: a.name, jobs: a.jobs }));

  return (
    <Box minH="100vh">
      <Flex justify="space-between" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="xl" color="gray.800">Qashqadaryo viloyati – Doimiy ish o‘rinlari</Heading>
        <Flex align="center" gap={2}>
          <Text color="gray.600">Viloyat bo'yicha jami:</Text>
          <Text color={brand600} fontWeight="bold" fontSize="2xl">{totalLegalJobs.toLocaleString()}</Text>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><Briefcase size={16} /><Text>Viloyat ko'rsatkichi</Text></HStack></StatLabel>
          <StatNumber>{totalLegalJobs.toLocaleString()}</StatNumber>
          <StatHelpText>2026 yil maqsadi</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><CheckCircle size={16} /><Text>Sohalar kesimida taqsimot</Text></HStack></StatLabel>
          <StatNumber color="green.400">{totalByAgencies.toLocaleString()}</StatNumber>
          <StatHelpText>6 ta yo'nalish</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel><HStack><BookOpen size={16} /><Text>Asosiy yo'nalish</Text></HStack></StatLabel>
          <StatNumber color="brand.400">{agencies[5].jobs.toLocaleString()}</StatNumber>
          <StatHelpText>Moliyaviy ko'mak orqali</StatHelpText>
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
            <Text fontSize="sm">Ishga joylashtirish: <strong>{tooltip.jobs.toLocaleString()}</strong> nafar</Text>
            {tooltip.name === "Qarshi shahri" && <Text fontSize="xs" color="brand.300">Bosing - batafsil ma'lumot</Text>}
          </Box>
        )}
      </Box>

      <Heading size="lg" mb={4} color="gray.800">Tumanlar kesimida aholi bandligini ta'minlash</Heading>
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart layout="vertical" data={chartData} margin={{ left: 100 }}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fill: "#4a5568" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#4a5568" }} width={100} />
            <RechartsTooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            <Bar dataKey="jobs" fill={brand600} radius={[0, 8, 8, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.jobs > 6000 ? green400 : entry.jobs < 4000 ? red400 : yellow400} />
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
            <Bar dataKey="jobs" fill={brand600} radius={[8,8,0,0]}>
              {agencyChartData.map((_, idx) => <Cell key={idx} fill={agencies[idx].color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default JobPlacementVil;
