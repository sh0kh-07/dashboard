// src/pages/ExternalBatosh.tsx
import React from "react";
import {
  Box,
  Text,
  Heading,
  Flex,
  useToken,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  Progress,
  HStack,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Calendar,
  Target,
  User,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ------------------------------
// MA'LUMOTLAR (faqat 2 ta kredit)
// ------------------------------
interface Credit {
  id: number;
  borrowerName: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  endDate: string;
  purpose: string;
  status: "active" | "repaid" | "delayed" | "defaulted";
  repaymentProgress: number;
  hasRedFlag: boolean;
  redFlagReason?: string;
}

const creditsData: Credit[] = [
  {
    id: 9,
    borrowerName: "Olimjon Norqobilov",
    amount: 30.0,
    interestRate: 9,
    termMonths: 24,
    startDate: "2025-02-15",
    endDate: "2027-02-15",
    purpose: "Qurilish materiallari savdosi",
    status: "delayed",
    repaymentProgress: 40,
    hasRedFlag: true,
    redFlagReason: "Mol yetkazib berish muammosi",
  },
  {
    id: 8,
    borrowerName: "Feruza Xalilova",
    amount: 5.5,
    interestRate: 4,
    termMonths: 10,
    startDate: "2025-03-10",
    endDate: "2026-01-10",
    purpose: "Onlayn do‘kon ochish",
    status: "repaid",
    repaymentProgress: 100,
    hasRedFlag: false,
  },
];

const ExternalBatosh = () => {
  const [brand600, red400, yellow400, green400] = useToken("colors", [
    "brand.600", "red.500", "yellow.500", "green.500",
  ]);
  const navigate = useNavigate();

  // Xatolikka qarshi himoya: agar creditsData bo‘sh bo‘lsa, hech narsa ko‘rsatilmaydi
  if (!creditsData || creditsData.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Text color="red.400">Maʼlumotlar topilmadi</Text>
      </Box>
    );
  }

  const totalAmount = creditsData.reduce((sum, c) => sum + c.amount, 0);
  const totalCredits = creditsData.length;
  const activeCredits = creditsData.filter(c => c.status === "active").length;
  const delayedOrDefaulted = creditsData.filter(c => c.status === "delayed" || c.status === "defaulted").length;
  const redFlagCount = creditsData.filter(c => c.hasRedFlag).length;
  const avgRepayment = creditsData.reduce((sum, c) => sum + c.repaymentProgress, 0) / totalCredits;

  // Maqsadlar bo‘yicha taqsimot (grafik uchun)
  const purposeSummary: Record<string, number> = {};
  creditsData.forEach(c => {
    const shortPurpose = c.purpose.length > 20 ? c.purpose.substring(0, 17) + "..." : c.purpose;
    purposeSummary[shortPurpose] = (purposeSummary[shortPurpose] || 0) + c.amount;
  });
  const chartData = Object.entries(purposeSummary).map(([name, value]) => ({ name, fullName: name, value }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge colorScheme="blue">Faol</Badge>;
      case "repaid": return <Badge colorScheme="green">Qaytarilgan</Badge>;
      case "delayed": return <Badge colorScheme="yellow">Kechiktirilgan</Badge>;
      case "defaulted": return <Badge colorScheme="red">Muddati o‘tgan</Badge>;
      default: return <Badge>Noma’lum</Badge>;
    }
  };

  const handleDetailClick = (id: number) => {
    navigate(`/kashkadarya/mahalla/batosh/contract/${id}`);
  };

  const CreditCard = ({ credit }: { credit: Credit }) => {
    return (
      <Box
        bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        transition="all 0.2s"
        _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
        border="1px solid"
        borderColor="gray.200"
      >
        <Box
          bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          p={5}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <User size={20} color={brand600} />
              <Heading size="md" color="gray.800">{credit.borrowerName}</Heading>
            </HStack>
            {getStatusBadge(credit.status)}
          </Flex>
        </Box>

        <Box p={5}>
          <VStack align="start" spacing={4}>
            <Flex gap={3} w="100%">
              <Target size={18} color={brand600} />
              <Text color="gray.600" fontWeight="medium">{credit.purpose}</Text>
            </Flex>

            <SimpleGrid columns={2} spacing={4} w="100%">
              <Box>
                <Text fontSize="xs" color="gray.600">Summa</Text>
                <Text fontSize="xl" fontWeight="bold" color={brand600}>{credit.amount.toFixed(1)} mln so‘m</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.600">Foiz stavkasi</Text>
                <Text fontSize="xl" fontWeight="bold" color="gray.800">{credit.interestRate}%</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.600">Muddati</Text>
                <Text fontSize="md" fontWeight="medium" color="gray.800">{credit.termMonths} oy</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.600">Qaytarilish</Text>
                <Flex align="center" gap={2}>
                  <Progress value={credit.repaymentProgress} size="sm" width="80px" colorScheme={credit.repaymentProgress > 70 ? "green" : "yellow"} borderRadius="full" />
                  <Text fontSize="sm" color={credit.repaymentProgress > 70 ? green400 : yellow400}>{credit.repaymentProgress}%</Text>
                </Flex>
              </Box>
            </SimpleGrid>

            <Divider borderColor="gray.200" />

            <Flex justify="space-between" align="center" w="100%">
              <HStack spacing={2}>
                <Calendar size={14} color="gray.600" />
                <Text fontSize="xs" color="gray.600">{credit.startDate} – {credit.endDate}</Text>
              </HStack>
              {credit.hasRedFlag && (
                <HStack spacing={1}>
                  <AlertTriangle size={14} color={red400} />
                  <Text fontSize="xs" color="red.400">{credit.redFlagReason}</Text>
                </HStack>
              )}
            </Flex>

            <IconButton
              aria-label="Batafsil"
              icon={<ArrowRight size={18} />}
              colorScheme="blue"
              variant="outline"
              width="100%"
              onClick={() => handleDetailClick(credit.id)}
              _hover={{ bg: brand600, color: "#1a202c" }}
            />
          </VStack>
        </Box>
      </Box>
    );
  };

  return (
    <Box minH="100vh">
      <Box mx="auto">
        <Flex alignItems="baseline" justifyContent="space-between" mb={6}>
          <Box>
            <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
              Batosh mahallasi – Mikrokreditlar
            </Heading>
            <Text fontSize="md" color="brand.300" mt={1}>
              Faqat batafsil maʼlumot mavjud bo‘lgan ikkita kredit
            </Text>
          </Box>
        </Flex>

        <Text color="gray.600" mb={6}>
          Batosh mahallasida kichik biznesga berilgan kreditlar monitoringi. Hozirda ikkita kredit ko‘rsatilmoqda.
        </Text>

        {/* Statistik kartalar (lucide-react ikonkalari to‘g‘ridan-to‘g‘ri) */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4} mb={8}>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
            <Flex align="center" gap={2}>
              <DollarSign size={20} color={brand600} />
              <StatLabel color="gray.600">Jami kreditlar</StatLabel>
            </Flex>
            <StatNumber fontSize="2xl" color={brand600}>{totalAmount.toFixed(1)} mln so‘m</StatNumber>
            <StatHelpText>{totalCredits} ta kredit</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
            <Flex align="center" gap={2}>
              <Users size={20} color={green400} />
              <StatLabel color="gray.600">Faol kreditlar</StatLabel>
            </Flex>
            <StatNumber fontSize="2xl" color={green400}>{activeCredits}</StatNumber>
            <StatHelpText>oluvchi</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
            <Flex align="center" gap={2}>
              <Clock size={20} color={yellow400} />
              <StatLabel color="gray.600">Kechiktirilgan / Muddati o‘tgan</StatLabel>
            </Flex>
            <StatNumber fontSize="2xl" color={yellow400}>{delayedOrDefaulted}</StatNumber>
            <StatHelpText>muammoli</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
            <Flex align="center" gap={2}>
              <AlertTriangle size={20} color={red400} />
              <StatLabel color="gray.600">Red flag kreditlar</StatLabel>
            </Flex>
            <StatNumber fontSize="2xl" color={red400}>{redFlagCount}</StatNumber>
            <StatHelpText>ehtiyot bo‘lish kerak</StatHelpText>
          </Stat>
          <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
            <Flex align="center" gap={2}>
              <TrendingUp size={20} color={brand600} />
              <StatLabel color="gray.600">O‘rtacha qaytarilish</StatLabel>
            </Flex>
            <StatNumber fontSize="2xl" color={brand600}>{avgRepayment.toFixed(0)}%</StatNumber>
            <StatHelpText>progress</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Grafik */}
        {chartData.length > 0 && (
          <Box mb={10}>
            <Heading as="h2" size="lg" mb={4} color="gray.800">
              Kredit summalarining maqsadlar bo‘yicha taqsimoti (mln so‘m)
            </Heading>
            <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 180, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: "#4a5568" }} label={{ value: "mln so‘m", position: "insideBottom", offset: -5, fill: "#4a5568" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#4a5568" }} width={170} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#1a202c" }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? brand600 : "#3182CE"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}

        {/* Ikkita karta */}
        <Heading size="lg" mb={4} color="gray.800">Kreditlar ro‘yxati</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
          {creditsData.map(credit => (
            <CreditCard  credit={credit} />
          ))}
        </SimpleGrid>

        {/* Xulosa */}
        <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl" mt={4}>
          <Flex gap={3} align="center" mb={3}>
            <AlertTriangle size={20} color={red400} />
            <Heading size="sm" color="gray.800">Xulosa</Heading>
          </Flex>
          <Text fontSize="sm" color="gray.600">
            • Kreditlarning yarmi (1 ta) red flag holatida – qurilish materiallari savdosi kechikmoqda.<br/>
            • Onlayn do‘kon krediti to‘liq qaytarilgan – yaxshi natija.<br/>
            • Tavsiya: Muammoli kreditni qayta tuzish va qo‘shimcha maslahat xizmatlari joriy etilsin.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ExternalBatosh;