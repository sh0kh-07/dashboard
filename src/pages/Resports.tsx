import React from "react";
import {
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Text, Flex, useToken, Divider, HStack, Icon
} from "@chakra-ui/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from "recharts";
import {
  Users, Home, Briefcase, AlertTriangle, TrendingDown, CheckCircle,
  Landmark, Wallet, Banknote, Globe, BadgePercent, GraduationCap, Building, Link, Flame, ShieldCheck
} from "lucide-react";

// ------------------------------
// RESPUBLIKA DARAJASIDAGI UMUMIY STATISTIKA
// ------------------------------

// Byudjet va Moliya
const budgetTotal = 26.8;       // Davlat byudjeti (trln)
const fundTotal = 1.2;          // Jamg'arma (trln)
const loansTotal = 140;         // Kreditlar (trln)
const externalTotal = 8.33;     // Tashqi moliya (mlrd $)

// Kambag'allik
const povertyAvg = 2.6;                 // O'rtacha kambag'allik %
const poorFamilies = 263215;            // Kambag'al oilalar (oila)
const poorRiskFamilies = 48221;         // Xavf ostidagi oilalar
const poorServicesTarget = 263215;      // 2026 qamrov maqsadi

// Bandlik va Ishsizlik
const unemploymentAvg = 4.4;            // O'rtacha ishsizlik %
const legalJobsTarget = 1000000;        // Legallashtirish reja
const jobPlacementTarget = 1000045;     // Doimiy ishga joylashtirish 2026

// Qoshimcha O'rtacha Ma'lumotlar (Respublika bo'yicha)
const povertyByRegion = [
  { name: "Qoraqalpog'iston", value: 3.2 }, { name: "Andijon", value: 2.7 },
  { name: "Buxoro", value: 2.6 }, { name: "Jizzax", value: 2.8 },
  { name: "Qashqadaryo", value: 3.3 }, { name: "Navoiy", value: 2.1 },
  { name: "Namangan", value: 2.7 }, { name: "Samarqand", value: 2.0 },
  { name: "Sirdaryo", value: 3.0 }, { name: "Surxondaryo", value: 2.8 },
  { name: "Toshkent vil.", value: 2.6 }, { name: "Farg'ona", value: 2.7 },
  { name: "Xorazm", value: 3.0 }, { name: "Toshkent sh.", value: 1.7 },
];

const unemploymentByRegion = [
  { name: "Qoraqalpog'iston", value: 4.8 }, { name: "Andijon", value: 4.5 },
  { name: "Buxoro", value: 4.5 }, { name: "Jizzax", value: 4.6 },
  { name: "Qashqadaryo", value: 5.0 }, { name: "Navoiy", value: 3.9 },
  { name: "Namangan", value: 4.6 }, { name: "Samarqand", value: 4.5 },
  { name: "Sirdaryo", value: 4.6 }, { name: "Surxondaryo", value: 4.6 },
  { name: "Toshkent vil.", value: 4.5 }, { name: "Farg'ona", value: 4.5 },
  { name: "Xorazm", value: 4.5 }, { name: "Toshkent sh.", value: 3.8 },
];

// BarChart uchun qulay data
const combinedChartData = povertyByRegion.map((reg, i) => ({
  name: reg.name,
  Kambagallik: reg.value,
  Ishsizlik: unemploymentByRegion[i].value
}));

const Reports = () => {
  const [brand600, green500, red500, yellow500, purple500, teal500] = useToken("colors", [
    "brand.600", "green.500", "red.500", "yellow.500", "purple.500", "teal.500"
  ]);

  return (
    <Box minH="100vh">
      <Flex direction="column" gap={6}>
        <Box>
          <Heading as="h1" size="xl" mb={2} color="gray.800">Respublika Bo'yicha Umumiy Hisobot</Heading>
          <Text fontSize="md" color="gray.600">
            Moliya, byudjet, kambag'allikni qisqartirish va bandlikka oid barcha maqsadli ko'rsatkichlar tahlili paneli
          </Text>
        </Box>

        {/* 1. MOLIYA VA BYUDJET SECTION */}
        <Box>
          <Flex align="center" gap={3} mb={4}>
            <Landmark color={brand600} size={28} />
            <Heading size="lg" color="gray.800">Moliya va Byudjet</Heading>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={brand600}>
              <Flex align="center" gap={2} mb={2}>
                <Wallet size={20} color={brand600} />
                <StatLabel fontSize="md" color="gray.700">Davlat Byudjeti</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{budgetTotal} <Text as="span" fontSize="lg" color="gray.500">trln</Text></StatNumber>
              <StatHelpText color="gray.600">Ajratilgan mablag'lar</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={green500}>
              <Flex align="center" gap={2} mb={2}>
                <Banknote size={20} color={green500} />
                <StatLabel fontSize="md" color="gray.700">Jamg'arma</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{fundTotal} <Text as="span" fontSize="lg" color="gray.500">trln</Text></StatNumber>
              <StatHelpText color="gray.600">Jamg'ariladigan mablag'</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={yellow500}>
              <Flex align="center" gap={2} mb={2}>
                <Building size={20} color={yellow500} />
                <StatLabel fontSize="md" color="gray.700">Bank Kreditlari</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{loansTotal} <Text as="span" fontSize="lg" color="gray.500">trln</Text></StatNumber>
              <StatHelpText color="gray.600">Ajratiladigan kreditlar</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={purple500}>
              <Flex align="center" gap={2} mb={2}>
                <Globe size={20} color={purple500} />
                <StatLabel fontSize="md" color="gray.700">Tashqi Moliya Manbalari</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{externalTotal} <Text as="span" fontSize="lg" color="gray.500">mlrd $</Text></StatNumber>
              <StatHelpText color="gray.600">Xalqaro moliya instituti</StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        <Divider borderColor="gray.200" />

        {/* 2. KAMBAG'ALLIK DARAJASI VA OILALAR SECTION */}
        <Box>
          <Flex align="center" gap={3} mb={4}>
            <Users color={red500} size={28} />
            <Heading size="lg" color="gray.800">Kambag'allik va Ijtimoiy Himoya</Heading>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={red500}>
              <Flex align="center" gap={2} mb={2}>
                <AlertTriangle size={20} color={red500} />
                <StatLabel fontSize="md" color="gray.700">O'rtacha Kambag'allik</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{povertyAvg}%</StatNumber>
              <StatHelpText color="gray.600">Respublika bo'yicha</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={brand600}>
              <Flex align="center" gap={2} mb={2}>
                <Home size={20} color={brand600} />
                <StatLabel fontSize="md" color="gray.700">Kambag'al Oilalar</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{poorFamilies.toLocaleString()}</StatNumber>
              <StatHelpText color="gray.600">Oila soni</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={yellow500}>
              <Flex align="center" gap={2} mb={2}>
                <Flame size={20} color={yellow500} />
                <StatLabel fontSize="md" color="gray.700">Xavf Ostidagi Oilalar</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{poorRiskFamilies.toLocaleString()}</StatNumber>
              <StatHelpText color="gray.600">Yordamga muhtoj (II bo'lim)</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={green500}>
              <Flex align="center" gap={2} mb={2}>
                <CheckCircle size={20} color={green500} />
                <StatLabel fontSize="md" color="gray.700">2026-yil Qamrov Maqsadi</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{poorServicesTarget.toLocaleString()}</StatNumber>
              <StatHelpText color="gray.600">Oilalarni qamrab olish rejasi</StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        <Divider borderColor="gray.200" />

        {/* 3. BANDLIK VA ISHSIZLIK SECTION */}
        <Box>
          <Flex align="center" gap={3} mb={4}>
            <Briefcase color={teal500} size={28} />
            <Heading size="lg" color="gray.800">Bandlik va Ishsizlik</Heading>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={red500}>
              <Flex align="center" gap={2} mb={2}>
                <BadgePercent size={20} color={red500} />
                <StatLabel fontSize="md" color="gray.700">O'rtacha Ishsizlik</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{unemploymentAvg}%</StatNumber>
              <StatHelpText color="gray.600">Respublika miqyosida o'rtacha</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={yellow500}>
              <Flex align="center" gap={2} mb={2}>
                <ShieldCheck size={20} color={yellow500} />
                <StatLabel fontSize="md" color="gray.700">Legallashtiriladigan Ish</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{(legalJobsTarget / 1000000).toFixed(1)} <Text as="span" fontSize="lg" color="gray.500">mln</Text></StatNumber>
              <StatHelpText color="gray.600">Noqonuniy faoliyatni legal qilish</StatHelpText>
            </Stat>

            <Stat bg="white" p={5} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" borderTop="4px solid" borderTopColor={green500}>
              <Flex align="center" gap={2} mb={2}>
                <TrendingDown size={20} color={green500} />
                <StatLabel fontSize="md" color="gray.700">Doimiy Ishga Joylashtirish</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color="gray.900">{(jobPlacementTarget / 1000000).toFixed(2)} <Text as="span" fontSize="lg" color="gray.500">mln</Text></StatNumber>
              <StatHelpText color="gray.600">2026-yil uchun asosiy maqsad</StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        {/* 4. VILOYATLAR KESIMIDA GRAFIK */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" mt={4}>
          <Heading size="md" mb={6} textAlign="center" color="gray.800">Hududlar bo'yicha Kambag'allik va Ishsizlik Darajasi (%)</Heading>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={combinedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 65 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#4a5568', fontSize: 11 }} 
                angle={-45} 
                textAnchor="end" 
                height={80} 
              />
              <YAxis tick={{ fill: '#4a5568' }} domain={[0, 6]} />
              <Tooltip 
                cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }} 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  color: '#1a202c'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="Kambagallik" fill={brand600} radius={[4, 4, 0, 0]} name="Kambag'allik darajasi (%)" />
              <Bar dataKey="Ishsizlik" fill={teal500} radius={[4, 4, 0, 0]} name="Ishsizlik darajasi (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    </Box>
  );
};

export default Reports;