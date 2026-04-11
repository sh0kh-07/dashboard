// src/pages/WorkBatosh.tsx
import React from "react";
import {
    Box, Text, Heading, Flex, useToken, Badge, SimpleGrid, Stat, StatLabel,
    StatNumber, StatHelpText, HStack, VStack, Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
    AlertTriangle, CheckCircle, Briefcase, TrendingUp, Users, Building,
    Landmark, HeartHandshake, GraduationCap, Truck, Home, Camera,
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";

// ------------------------------
// BATOSH MAHALLASI – LEGALLASHTIRILADIGAN ISH O‘RINLARI
// (Qarshi shahri, Qashqadaryo viloyati)
// ------------------------------

// Mahalla bo‘yicha jami legallashtiriladigan ish o‘rinlari (realistik raqamlar)
const totalLegalJobs = 485;          // jami ish o‘rinlari
const plannedJobs = 500;             // reja
const executedJobs = 460;            // bajarilgan (hozirgi)

// Idoralar (tashkilotlar) bo‘yicha taqsimot
const agencies = [
    { name: "Soliq qo‘mitasi", jobs: 168, icon: Landmark, color: "#3182CE" },
    { name: "Ijtimoiy himoya agentligi", jobs: 58, icon: HeartHandshake, color: "#38A169" },
    { name: "Bandlik vazirligi", jobs: 62, icon: Briefcase, color: "#DD6B20" },
    { name: "Qishloq xo‘jaligi vazirligi", jobs: 95, icon: GraduationCap, color: "#805AD5" },
    { name: "Transport vazirligi", jobs: 42, icon: Truck, color: "#D53F8C" },
    { name: "Qurilish vazirligi", jobs: 48, icon: Home, color: "#ED8936" },
    { name: "Turizm qo‘mitasi", jobs: 12, icon: Camera, color: "#9F7AEA" },
];

// Tumanlar kesimida taqqoslash uchun (faqat ko‘rinish)
const districtComparison = [
    { name: "Qarshi shahri", jobs: 485 },
    { name: "Shahrisabz shahri", jobs: 420 },
    { name: "Kitob tumani", jobs: 310 },
    { name: "Qamashi tumani", jobs: 180 },
];

// Grafik ma’lumotlari
const agencyChartData = agencies.map(a => ({ name: a.name, jobs: a.jobs }));
const comparisonChartData = districtComparison;

const WorkBatosh = () => {
    const [brand600, red400, yellow400, green400] = useToken("colors", [
        "brand.600", "red.500", "yellow.500", "green.500",
    ]);
    const navigate = useNavigate(); // qoladi, lekin hech qanday click handler ishlatilmaydi

    const coveragePercent = Math.round((executedJobs / plannedJobs) * 100);

    return (
        <Box minH="100vh">
            <Flex direction="column" gap={4}>
                <Flex alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={4}>
                    <Box>
                        <Heading size="xl" color="gray.800">Batosh mahallasi – Legallashtiriladigan ish o‘rinlari</Heading>
                        <Text fontSize="md" color="brand.300" mt={1}>
                            Qarshi shahri, 2025-yil 1-chorak
                        </Text>
                    </Box>
                    <Flex align="center" gap={2}>
                        <Text color="gray.600">Jami ish o‘rinlari:</Text>
                        <Text fontSize="3xl" fontWeight="bold" color={brand600}>{totalLegalJobs}</Text>
                    </Flex>
                </Flex>

                <Text color="gray.600" mb={2}>
                    Batosh mahallasida rasmiy ish o‘rinlarini yaratish va legallashtirish bo‘yicha amalga oshirilayotgan ishlar.
                </Text>

                {/* Ikkita asosiy karta */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl" boxShadow="md">
                        <HStack spacing={3} mb={2}>
                            <Briefcase size={28} color={brand600} />
                            <StatLabel fontSize="lg" color="gray.600">Jami legallashtiriladigan ish o‘rinlari</StatLabel>
                        </HStack>
                        <StatNumber fontSize="3xl" color={brand600}>{totalLegalJobs}</StatNumber>
                        <StatHelpText>reja bo‘yicha</StatHelpText>
                        <Text fontSize="sm" color="gray.600" mt={2}>Shundan {executedJobs} tasi (92%) allaqachon yaratilgan.</Text>
                    </Stat>

                    <Stat bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl" boxShadow="md">
                        <HStack spacing={3} mb={2}>
                            <TrendingUp size={28} color={green400} />
                            <StatLabel fontSize="lg" color="gray.600">Rejaning bajarilishi</StatLabel>
                        </HStack>
                        <StatNumber fontSize="3xl" color={green400}>{coveragePercent}%</StatNumber>
                        <StatHelpText>maqsadga erishish</StatHelpText>
                        <Text fontSize="sm" color="gray.600" mt={2}>Yil oxirigacha 500 ta ish o‘rni rejalashtirilgan.</Text>
                    </Stat>
                </SimpleGrid>

                {/* Idoralar bo‘yicha taqsimot */}
                <Heading size="lg" mb={4} color="gray.800">Idoralar (tashkilotlar) bo‘yicha ish o‘rinlari</Heading>
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={agencyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 12 }} angle={-30} textAnchor="end" height={70} />
                            <YAxis tick={{ fill: "#4a5568" }} label={{ value: "Ish o‘rinlari soni", angle: -90, position: "insideLeft", fill: "#4a5568" }} />
                            <Tooltip formatter={(v: number) => v} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                            <Legend wrapperStyle={{ color: "#1a202c" }} />
                            <Bar dataKey="jobs" fill={brand600} radius={[8, 8, 0, 0]}>
                                {agencyChartData.map((_, idx) => <Cell key={idx} fill={agencies[idx].color} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                {/* Tumanlar bilan taqqoslash (qo‘shimcha) */}
                <Heading size="lg" mb={4} color="gray.800">Tumanlar bilan solishtirma tahlil</Heading>
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={4} borderRadius="xl" mb={8}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fill: "#4a5568" }} />
                            <YAxis tick={{ fill: "#4a5568" }} label={{ value: "Ish o‘rinlari soni", angle: -90, position: "insideLeft", fill: "#4a5568" }} />
                            <Tooltip formatter={(v: number) => v} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                            <Bar dataKey="jobs" fill={brand600} radius={[8, 8, 0, 0]}>
                                <Cell fill={brand600} />
                                <Cell fill="#3182CE" />
                                <Cell fill="#DD6B20" />
                                <Cell fill="#C53030" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <Text fontSize="xs" color="gray.600" mt={2}>* Batosh mahallasi Qarshi shahri tarkibida eng yuqori ko‘rsatkichga ega.</Text>
                </Box>

                {/* Xulosa va tavsiyalar */}
                <Box bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" p={5} borderRadius="xl">
                    <Flex gap={3} align="center" mb={3}>
                        <AlertTriangle size={20} color={yellow400} />
                        <Heading size="sm" color="gray.800">Asosiy xulosalar</Heading>
                    </Flex>
                    <Text fontSize="sm" color="gray.600">
                        • Batosh mahallasida jami <strong>{totalLegalJobs}</strong> ta legallashtiriladigan ish o‘rni rejalashtirilgan bo‘lib, ulardan <strong>{executedJobs}</strong> tasi (92%) yaratilgan.<br />
                        • Eng ko‘p ish o‘rinlari Soliq qo‘mitasi ({agencies[0].jobs}) va Qishloq xo‘jaligi vazirligi ({agencies[3].jobs}) hissasiga to‘g‘ri keladi.<br />
                        • Qolgan 8% ish o‘rinlarini yaratish uchun Transport va Qurilish vazirliklari faolligini oshirish tavsiya etiladi.<br />
                        • Batosh mahallasi Qarshi shahridagi eng yaxshi ko‘rsatkichli hududlardan biri bo‘lib, boshqa tumanlar uchun namuna bo‘la oladi.
                    </Text>
                    <Flex gap={3} align="center" mt={4}>
                        <CheckCircle size={20} color={green400} />
                        <Text fontSize="sm">Reja bajarilish darajasi yuqori, loyiha muvaffaqiyatli amalga oshirilmoqda.</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default WorkBatosh;