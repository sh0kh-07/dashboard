// src/pages/MainContract.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Text, Heading, Flex, useToken, VStack, HStack, Icon, Badge, IconButton, Button,
} from "@chakra-ui/react";
import { CheckCircle, XCircle, ArrowLeft, Building, Calendar } from "lucide-react";

const stages = [
  { id: 0, name: "0-BOSQICH: Avtomatik shlyuz", description: "Dastlabki avtomatik tekshiruv" },
  { id: 1, name: "1-BOSQICH: Huquqiy va Soliq holatini bazaviy tekshirish", description: "Legal & Tax Filter — korxonaning yuridik jihatdan «tirik» ekanligi." },
  { id: 2, name: "2-BOSQICH: Operatsion quvvat va Infratuzilmani baholash", description: "Capacity & Infrastructure Check — firmaning real mavjudligi." },
  { id: 3, name: "3-BOSQICH: Bozor narxlari bilan Kross-chek va Anti-Otkat nazorati", description: "Price Benchmarking — mahsulot narxini sun'iy oshirishni bloklash." },
  { id: 4, name: "4-BOSQICH: Tarixiy va Tarmoq tahlili", description: "Historical Performance Record — oldingi faoliyat va tajriba." },
  { id: 5, name: "5-BOSQICH: To‘lovdan keyingi Naqd pul oqimi nazorati", description: "Post-Payment Fund Tracking — pul yo'nalishini kuzatish." },
  { id: 6, name: "6-BOSQICH: Logistika va Fizikaviy harakat nazorati", description: "E-Waybill / Logistics Validation — tovarning real harakati." },
  { id: 7, name: "7-BOSQICH: Loyiha hajmi va ERP Normalari bo‘yicha nazorat", description: "Volume Overstatement Check — hajmni sun'iy oshirishni oldini olish." },
  { id: 8, name: "8-BOSQICH: Ishbilarmonlik ekotizimi va Obro‘ Indeksi", description: "Ecosystem Verification — firmaning bozordagi obro'si." },
  { id: 9, name: "9-BOSQICH: QQS zanjiri uzilishini tekshirish", description: "VAT Chain Tracking — tovar kelib chiqish manbai." },
  { id: 10, name: "10-BOSQICH: Yashirin Benefisiarlarni aniqlash", description: "Graph Analytics — manfaatlar to'qnashuvini aniqlash." },
];

// Данные контрактов (синхронизированы с MainBatosh)
const allContracts = [
  { id: "budget-1", name: "Mahalla ichki yo‘llarini asfaltlash", contractor: "Qarshi Yo‘l Qurilish", amount: 33.24, unit: "mlrd so‘m", date: "15 Yanvar 2025", status: "Bajarildi", failedStages: [3,7] },
  { id: "budget-2", name: "Ko‘cha yoritish tizimini modernizatsiya qilish", contractor: "Shaharlar Energo", amount: 22.16, unit: "mlrd so‘m", date: "25 Fevral 2025", status: "Bajarilmoqda", failedStages: [] },
  { id: "funds-1", name: "Yoshlar tadbirkorlik markazini tashkil etish", contractor: "Yoshlar Ittifoqi", amount: 1.71, unit: "mlrd so‘m", date: "15 Mart 2025", status: "Bajarildi", failedStages: [2] },
  { id: "funds-2", name: "Ayollar hunarmandchilik kurslari", contractor: "Ayollar Qo‘mitasi", amount: 1.14, unit: "mlrd so‘m", date: "25 Mart 2025", status: "Bajarilmoqda", failedStages: [] },
  { id: "credits-1", name: "Kichik biznes uchun imtiyozli kredit", contractor: "Agrobank", amount: 0.171, unit: "mlrd so‘m", date: "15 Aprel 2025", status: "Bajarildi", failedStages: [1,9] },
  { id: "credits-2", name: "Startap loyihalarni moliyalashtirish", contractor: "Turon Bank", amount: 0.114, unit: "mlrd so‘m", date: "25 Aprel 2025", status: "Bajarilmoqda", failedStages: [] },
  { id: "external-1", name: "Quyosh panellarini o‘rnatish", contractor: "Tiklanish va taraqqiyot jamg‘armasi", amount: 10.2, unit: "mln $", date: "15 May 2025", status: "Bajarildi", failedStages: [] },
  { id: "external-2", name: "Mahallalarda energiya samaradorligi loyihasi", contractor: "Jahon banki", amount: 6.8, unit: "mln $", date: "25 May 2025", status: "Bajarilmoqda", failedStages: [4,6] },
];

const MainContract = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [brand600] = useToken("colors", ["brand.600"]);

  const contract = allContracts.find(c => c.id === id);

  if (!contract) {
    return (
      <Box  minH="100vh">
        <Text color="gray.800" fontSize="xl">Noma'lum kontrakt</Text>
        <Button mt={4} onClick={() => navigate(-1)}>Orqaga</Button>
      </Box>
    );
  }

  const failedSet = new Set(contract.failedStages);

  return (
    <Box minH="100vh">
      <Box mx="auto">
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="xl" color="gray.800">{contract.name}</Heading>
            <HStack mt={2} spacing={4}>
              <HStack><Icon as={Building} size={16} color="gray.600" /><Text color="gray.600">{contract.contractor}</Text></HStack>
              <HStack><Icon as={Calendar} size={16} color="gray.600" /><Text color="gray.600">{contract.date}</Text></HStack>
            </HStack>
          </Box>
          <Badge colorScheme={contract.status === "Bajarildi" ? "green" : "blue"} fontSize="md" p={2} borderRadius="full">{contract.status}</Badge>
        </Flex>

        <Heading size="lg" mb={6} color="gray.800">10 bosqichli tekshiruv natijalari</Heading>

        <VStack spacing={4} align="stretch">
          {stages.map(stage => {
            const passed = !failedSet.has(stage.id);
            return (
              <Box key={stage.id} bg="white" p={4} borderRadius="xl" borderTop="1px solid" borderRight="1px solid" borderBottom="1px solid" borderColor="gray.200" boxShadow="sm" borderLeft="4px solid" borderLeftColor={passed ? "green.500" : "red.500"}>
                <HStack justify="space-between">
                  <Flex align="center" gap={3}>
                    <Icon as={passed ? CheckCircle : XCircle} color={passed ? "green.500" : "red.500"} boxSize={5} />
                    <Box>
                      <Text fontWeight="bold" color="gray.800">{stage.name}</Text>
                      <Text fontSize="sm" color="gray.600">{stage.description}</Text>
                    </Box>
                  </Flex>
                  <Badge colorScheme={passed ? "green" : "red"}>{passed ? "O‘tdi" : "Rad etildi"}</Badge>
                </HStack>
              </Box>
            );
          })}
        </VStack>

        <Box mt={8} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
          <Text fontSize="sm" color="gray.600">
            * Umumiy xulosa: {failedSet.size === 0
              ? "Kontrakt barcha tekshiruv bosqichlaridan muvaffaqiyatli o‘tdi."
              : `Kontrakt ${failedSet.size} ta bosqichda rad etildi. Rad etilgan bosqichlar: ${Array.from(failedSet).join(", ")}.`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default MainContract;