import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Flex,
  useToken,
  VStack,
  HStack,
  Icon,
  Badge,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

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

// Объединённые данные контрактов из всех направлений (Budget, Found, Loans, External)
const allContracts: Record<string, { name: string; type: string; amount: number; status: string; checkPassed: boolean; failedStages: number[] }> = {
  // Budget (Davlat byudjeti)
  "1": { name: "Mahalla yo‘llarini asfaltlash", type: "Yo‘l qurilishi", amount: 63.56, status: "Bajarildi", checkPassed: false, failedStages: [3, 7] },
  "2": { name: "Ko‘cha yoritish tizimini modernizatsiya qilish", type: "Yo‘l qurilishi", amount: 42.37, status: "Bajarilmoqda", checkPassed: true, failedStages: [] },
  // Found (Jamgʻarma)
  "3": { name: "Yoshlar tadbirkorlik markazini tashkil etish", type: "Yoshlar loyihalari", amount: 2.81, status: "Bajarilmoqda", checkPassed: false, failedStages: [2] },
  "4": { name: "Ayollar hunarmandchilik kurslari", type: "Ayollar loyihalari", amount: 1.87, status: "Bajarildi", checkPassed: true, failedStages: [] },
  // Loans (Kreditlar)
  "5": { name: "Kichik biznes uchun imtiyozli kredit", type: "Kredit", amount: 331.95, status: "Bajarildi", checkPassed: false, failedStages: [1, 9] },
  "6": { name: "Startap loyihalarni moliyalashtirish", type: "Kredit", amount: 221.30, status: "Bajarilmoqda", checkPassed: true, failedStages: [] },
  // External (Tashqi moliya)
  "7": { name: "Quyosh panellarini o‘rnatish", type: "Yetkazib berish", amount: 0.30, status: "Bajarilmoqda", checkPassed: false, failedStages: [3, 7] },
  "8": { name: "Onlayn do‘kon ochish", type: "Savdo", amount: 0.12, status: "Bajarildi", checkPassed: true, failedStages: [] },
  "9": { name: "Qurilish materiallari savdosi", type: "Savdo", amount: 0.12, status: "Bajarilmoqda", checkPassed: false, failedStages: [1] },
};

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [brand600] = useToken("colors", ["brand.600"]);

  const contract = id ? allContracts[id] : null;

  if (!contract) {
    return (
      <Box p={6} bg="gray.50" minH="100vh">
        <Text color="gray.800" fontSize="xl">Noma'lum kontrakt</Text>
        <Button mt={4} onClick={() => navigate(-1)}>Orqaga</Button>
      </Box>
    );
  }

  const failedSet = new Set(contract.failedStages);

  return (
    <Box minH="100vh">
      <Box  mx="auto">
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading as="h1" size="xl" color="gray.800">
              {contract.name}
            </Heading>
            <Text color="gray.600" mt={1}>
              {contract.type} | {contract.amount} {contract.amount < 10 ? "mln $" : "mlrd so‘m"}
            </Text>
          </Box>
          <Badge
            colorScheme={
              contract.status === "Bajarildi" ? "green" :
              contract.status === "Bajarilmoqda" ? "blue" :
              contract.status === "Rejalashtirilgan" ? "orange" : "purple"
            }
            fontSize="md"
            p={2}
          >
            {contract.status}
          </Badge>
        </Flex>

        <Heading as="h2" size="lg" mb={6} color="gray.800">
          10 bosqichli tekshiruv natijalari
        </Heading>

        <VStack spacing={4} align="stretch">
          {stages.map((stage) => {
            const stagePassed = !failedSet.has(stage.id);
            return (
              <Box
                key={stage.id}
                bg="white"
                p={4}
                borderRadius="xl"
                borderLeft="4px solid"
                borderLeftColor={stagePassed ? "green.500" : "red.500"}
              >
                <HStack justify="space-between">
                  <Flex align="center" gap={3}>
                    <Icon
                      as={stagePassed ? CheckCircle : XCircle}
                      color={stagePassed ? "green.500" : "red.500"}
                      boxSize={5}
                    />
                    <Box>
                      <Text fontWeight="bold" color="gray.800">{stage.name}</Text>
                      <Text fontSize="sm" color="gray.600">{stage.description}</Text>
                    </Box>
                  </Flex>
                  <Badge colorScheme={stagePassed ? "green" : "red"}>
                    {stagePassed ? "O‘tdi" : "Rad etildi"}
                  </Badge>
                </HStack>
              </Box>
            );
          })}
        </VStack>

        <Box mt={8} p={4} bg="white" borderRadius="xl">
          <Text fontSize="sm" color="gray.600">
            * Umumiy xulosa:{" "}
            {contract.checkPassed
              ? "Kontrakt barcha tekshiruv bosqichlaridan muvaffaqiyatli o‘tdi."
              : `Kontrakt ${contract.failedStages.length} ta bosqichda rad etildi. Rad etilgan bosqichlar: ${contract.failedStages.join(", ")}.`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ContractDetail;