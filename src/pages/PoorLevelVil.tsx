import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  Flex,
  useToken,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, CheckCircle, MinusCircle, TrendingDown, TrendingUp } from "lucide-react";
import kashkadaryaMap from "../data/kashkadaryaMap"; // Sizning JSON faylingiz

// ------------------------------
// Tumanlar uchun interfeys
// ------------------------------
interface DistrictPoverty {
  name: string;
  startYear: number;
  targetEndYear: number;
  actualCurrent: number;
  status: "bad" | "moderate" | "good";
  willMeetTarget: boolean;
}

function roundOne(num: number): number {
  return Math.round(num * 10) / 10;
}

function generateDistrictsData(): DistrictPoverty[] {
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

  const viloyatStart = 4.6;
  const viloyatTarget = 3.3;
  const results: DistrictPoverty[] = [];

  for (const district of districtsRaw) {
    // Yil boshi: viloyat startiga yaqin, biroz farq bilan
    let start = viloyatStart + (Math.random() - 0.5) * 0.6;
    start = roundOne(Math.min(5.2, Math.max(3.8, start)));
    // Maqsad: viloyat targetiga yaqin
    let target = viloyatTarget + (Math.random() - 0.5) * 0.5;
    target = roundOne(Math.min(4.0, Math.max(2.5, target)));
    if (start <= target) target = roundOne(start - 0.3);

    const neededReduction = start - target;
    const monthlyNeeded = neededReduction / 12;
    const expectedAfter4 = roundOne(start - monthlyNeeded * 4);

    let actual: number;
    let status: "bad" | "moderate" | "good";
    const badDistricts = ["Qamashi tumani", "Mirishkor tumani", "Dehqonobod tumani", "Nishon tumani"];
    const goodDistricts = ["Qarshi shahri", "Shahrisabz shahri", "Kitob tumani"];

    if (badDistricts.includes(district.name)) {
      actual = roundOne(Math.min(start, expectedAfter4 + 0.6));
      status = "bad";
    } else if (goodDistricts.includes(district.name)) {
      actual = roundOne(Math.max(target, expectedAfter4 - 0.5));
      status = "good";
    } else {
      actual = roundOne(expectedAfter4 + (Math.random() - 0.5) * 0.4);
      status = "moderate";
    }
    actual = Math.min(start, Math.max(target, actual));

    const currentMonthlyReduction = (start - actual) / 4;
    const projectedFinal = roundOne(actual - currentMonthlyReduction * 8);
    const willMeetTarget = projectedFinal <= target;

    results.push({
      name: district.name,
      startYear: start,
      targetEndYear: target,
      actualCurrent: actual,
      status,
      willMeetTarget,
    });
  }
  return results;
}

const districtsData = generateDistrictsData();

// Xarita mapping
const districtNameMap: Record<string, string> = {
  "Qarshi shahri": "Qarshi shahri",
  "Shahrisabz shahri": "Shahrisabz shahri",
  "Qarshi tumani": "Qarshi tumani",
  "Kitob tumani": "Kitob tumani",
  "Ko'kdala tumani": "Ko'kdala tumani",
  "Shaxrisabz tumani": "Shaxrisabz tumani",
  "Muborak tumani": "Muborak tumani",
  "Kasbi tumani": "Kasbi tumani",
  "G'uzor tumani": "G'uzor tumani",
  "Chiroqchi tumani": "Chiroqchi tumani",
  "Koson tumani": "Koson tumani",
  "Yakkabog' tumani": "Yakkabog' tumani",
  "Dehqonobod tumani": "Dehqonobod tumani",
  "Nishon tumani": "Nishon tumani",
  "Qamashi tumani": "Qamashi tumani",
  "Mirishkor tumani": "Mirishkor tumani",
};

const getDistrictStatus = (name: string): "bad" | "moderate" | "good" | undefined => {
  const d = districtsData.find(d => d.name === name);
  return d?.status;
};

const getDistrictData = (name: string) => districtsData.find(d => d.name === name);

const PoorLevelVil = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
    data?: DistrictPoverty;
  }>({ visible: false, x: 0, y: 0, name: "", data: undefined });

  const getPathStyle = (districtName: string) => {
    const status = getDistrictStatus(districtName);
    let fill = brand600;
    if (status === "bad") fill = red400;
    else if (status === "moderate") fill = yellow400;
    else if (status === "good") fill = green400;
    return {
      fill: tooltip.name === districtName ? "#ffffff" : fill,
      stroke: "#1A202C",
      strokeWidth: 1,
      cursor: "pointer",
      transition: "all 0.2s ease",
      opacity: 0.85,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, name: string) => {
    const data = getDistrictData(name);
    if (data) {
      setTooltip({ visible: true, x: e.clientX + 15, y: e.clientY + 15, name, data });
    }
  };
  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    if (tooltip.visible) setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
  };
  const handleMouseLeave = () => setTooltip({ visible: false, x: 0, y: 0, name: "", data: undefined });
  const handleClick = (name: string) => {
    if (name === "Qarshi shahri") navigate("/poor-level/vil/qarshi");
  };

  const chartData = districtsData.map(d => ({
    name: d.name.replace(" tumani", "").replace(" shahri", ""),
    "Yil boshi": d.startYear,
    "Hozirgi (4 oy)": d.actualCurrent,
    "Maqsad": d.targetEndYear,
  }));

  const stats = {
    good: districtsData.filter(d => d.status === "good").length,
    moderate: districtsData.filter(d => d.status === "moderate").length,
    bad: districtsData.filter(d => d.status === "bad").length,
  };

  return (
    <Box minH="100vh" >
      <Flex justify="space-between" mb={6} flexWrap="wrap" gap={4}>
        <Heading color="gray.800">Qashqadaryo viloyati tumanlarida kambag‘allik monitoringi</Heading>
        <Flex alignItems="center" gap={'10px'} textAlign="right">
          <Text color="gray.600">Viloyat maqsadi (yil oxiri)</Text>
          <Text color={brand600} fontWeight="bold" fontSize="2xl">3.3%</Text>
        </Flex>
      </Flex>

      <Text color="gray.600" mb={4}>
        Xaritada tumanlar holati: <strong style={{ color: green400 }}>Yashil</strong> — yaxshi,{" "}
        <strong style={{ color: yellow400 }}>Sariq</strong> — o‘rtacha,{" "}
        <strong style={{ color: red400 }}>Qizil</strong> — xavf ostida.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel>Yaxshi holat</StatLabel>
          <StatNumber color="green.400">{stats.good}</StatNumber>
          <StatHelpText>Maqsadga ishonchli</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel>O‘rtacha holat</StatLabel>
          <StatNumber color="yellow.400">{stats.moderate}</StatNumber>
          <StatHelpText>Harakat kerak</StatHelpText>
        </Stat>
        <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={3} borderRadius="lg">
          <StatLabel>Xavf ostida</StatLabel>
          <StatNumber color="red.400">{stats.bad}</StatNumber>
          <StatHelpText>Rejani bajarmaslik xavfi</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Tushuntirish bloki */}
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mb={6}>
        <Heading size="sm" mb={2} color="gray.800">Tumanlar foizlari qanday hisoblandi?</Heading>
        <Text fontSize="sm" color="gray.600">
          • <strong>Yil boshi</strong> – viloyat oʻrtacha 4.6% dan kelib chiqib, har bir tumanning ogʻirligiga qarab taqsimlangan.<br/>
          • <strong>Maqsad</strong> – viloyatning yillik rejasi 3.3% asosida tumanlarga mos ravishda belgilangan.<br/>
          • <strong>Hozirgi (4 oy)</strong> – real pasayish tezligi. Yaxshi tumanlar (Qarshi shahri) tezroq pasaygan, xavf ostidagilar (Qamashi, Mirishkor) sekinroq.<br/>
          • <strong>Holat</strong> – faqat yashil (yaxshi), sariq (oʻrtacha), qizil (xavf ostida) – 3 toifa.
        </Text>
      </Box>

      {/* Xarita */}
      <Box position="relative" bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={10}>
        <svg viewBox={kashkadaryaMap.viewBox} style={{ width: "80%", height: "auto", margin: "0 auto", display: "block" }}>
          {kashkadaryaMap.layers.map((layer: any) => (
            <path
              key={layer.id}
              d={layer.d}
              style={getPathStyle(layer.name)}
              onMouseEnter={(e) => handleMouseEnter(e, layer.name)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(layer.name)}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.strokeWidth = "2";
                e.currentTarget.style.stroke = "#2b6cb0";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = "0.85";
                e.currentTarget.style.strokeWidth = "1";
                e.currentTarget.style.stroke = "#1A202C";
              }}
            />
          ))}
        </svg>

        {tooltip.visible && tooltip.data && (
          <Box
            position="fixed"
            top={tooltip.y}
            left={tooltip.x}
            bg="gray.50"
            color="gray.800"
            px={4}
            py={2}
            borderRadius="lg"
            boxShadow="xl"
            zIndex={1000}
            pointerEvents="none"
            minW="200px"
            
            
          >
            <Text fontWeight="bold">{tooltip.name}</Text>
            <Text fontSize="sm">
              Holat:{" "}
              {tooltip.data.status === "bad"
                ? "⚠️ Xavf ostida"
                : tooltip.data.status === "moderate"
                ? "🟡 O‘rtacha"
                : "✅ Yaxshi"}
            </Text>
            <Text fontSize="xs">Yil boshi: {tooltip.data.startYear.toFixed(1)}%</Text>
            <Text fontSize="xs">Hozirgi: {tooltip.data.actualCurrent.toFixed(1)}%</Text>
            <Text fontSize="xs">Maqsad: {tooltip.data.targetEndYear.toFixed(1)}%</Text>
            <Text fontSize="xs" fontWeight="bold" color={tooltip.data.willMeetTarget ? "green.300" : "red.300"}>
              {tooltip.data.willMeetTarget ? "Maqsad bajariladi ✅" : "Bajarilmaydi ❌"}
            </Text>
          </Box>
        )}
      </Box>

      {/* Grafik */}
      <Heading size="lg" mb={4} color="gray.800">Kambag‘allik darajasi dinamikasi (tumanlar)</Heading>
      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart layout="vertical" data={chartData} margin={{ left: 80 }}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fill: "#4a5568" }} domain={[0, 6]} label={{ value: "Kambag‘allik %", position: "insideBottom", offset: -5, fill: "#4a5568" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#4a5568" }} width={100} />
            <RechartsTooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1a202c" }} />
            <Bar dataKey="Yil boshi" fill="#4A5568" />
            <Bar dataKey="Hozirgi (4 oy)" fill={brand600} />
            <Bar dataKey="Maqsad" fill="#38A169" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="lg" mt={6}>
        <Flex gap={3} align="center">
          <AlertTriangle size={20} color={red400} />
          <Text fontWeight="medium">
            Xulosa: Qizil rangdagi tumanlar (Qamashi, Mirishkor, Dehqonobod, Nishon) hozirgi pasayish sur’atida yil oxirigacha maqsadli darajaga yeta olmaydi.
          </Text>
        </Flex>
        <Flex gap={3} align="center" mt={2}>
          <CheckCircle size={20} color={green400} />
          <Text>Qarshi shahri, Shahrisabz va Kitob tumanlari yaxshi ko‘rsatkichga ega.</Text>
        </Flex>
        <Flex gap={3} align="center" mt={2}>
          <Text fontSize="sm" color="gray.600">💡 Eslatma: Qarshi shahri xaritasiga bossangiz, mahallalar darajasidagi batafsil ma’lumotga o‘tasiz.</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default PoorLevelVil;