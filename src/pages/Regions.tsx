import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, SimpleGrid, Stat, StatLabel, StatNumber,
  Badge, Card, CardBody, CardHeader, Divider, Icon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure,
} from "@chakra-ui/react";
import {
  Layers, Grid, AlertTriangle, MapPin, DollarSign, Info,
} from "lucide-react";

// --------------------------------------------------------------
// MA'LUMOTLAR: VILOYATLAR KESIMIDA (asosiy)
// --------------------------------------------------------------
interface RegionData {
  name: string;
  fundPlan: number;          // reja (mln so'm)
  fundActual: number;        // amalda (mln so'm)
  fundPercent: number;       // foiz
  improvedDistricts: number; // infratuzilmasi yaxshilangan og'ir tumanlar
  difficultMahallas: number; // og'ir toifadagi mahallalar soni
  fundCount: number;         // ajratilgan mablag'lar soni (shartnomalar)
  fundSum: number;           // ajratilgan mablag'lar summasi (mln so'm)
  status: "bad" | "moderate" | "good";
}

const regionsData: RegionData[] = [
  { name: "Qoraqalpogʻiston Respublikasi", fundPlan: 85000, fundActual: 62000, fundPercent: 72.9, improvedDistricts: 4, difficultMahallas: 28, fundCount: 156, fundSum: 62000, status: "bad" },
  { name: "Andijon viloyati", fundPlan: 120000, fundActual: 98000, fundPercent: 81.7, improvedDistricts: 3, difficultMahallas: 22, fundCount: 210, fundSum: 98000, status: "moderate" },
  { name: "Buxoro viloyati", fundPlan: 78000, fundActual: 67000, fundPercent: 85.9, improvedDistricts: 2, difficultMahallas: 15, fundCount: 145, fundSum: 67000, status: "good" },
  { name: "Jizzax viloyati", fundPlan: 65000, fundActual: 48000, fundPercent: 73.8, improvedDistricts: 3, difficultMahallas: 19, fundCount: 98, fundSum: 48000, status: "bad" },
  { name: "Qashqadaryo viloyati", fundPlan: 140000, fundActual: 105000, fundPercent: 75.0, improvedDistricts: 5, difficultMahallas: 35, fundCount: 280, fundSum: 105000, status: "bad" },
  { name: "Navoiy viloyati", fundPlan: 55000, fundActual: 51000, fundPercent: 92.7, improvedDistricts: 1, difficultMahallas: 8, fundCount: 92, fundSum: 51000, status: "good" },
  { name: "Namangan viloyati", fundPlan: 95000, fundActual: 74000, fundPercent: 77.9, improvedDistricts: 3, difficultMahallas: 26, fundCount: 167, fundSum: 74000, status: "moderate" },
  { name: "Samarqand viloyati", fundPlan: 130000, fundActual: 108000, fundPercent: 83.1, improvedDistricts: 3, difficultMahallas: 24, fundCount: 220, fundSum: 108000, status: "moderate" },
  { name: "Sirdaryo viloyati", fundPlan: 48000, fundActual: 36000, fundPercent: 75.0, improvedDistricts: 2, difficultMahallas: 14, fundCount: 73, fundSum: 36000, status: "bad" },
  { name: "Surxondaryo viloyati", fundPlan: 110000, fundActual: 82000, fundPercent: 74.5, improvedDistricts: 4, difficultMahallas: 31, fundCount: 190, fundSum: 82000, status: "bad" },
  { name: "Toshkent viloyati", fundPlan: 135000, fundActual: 115000, fundPercent: 85.2, improvedDistricts: 2, difficultMahallas: 18, fundCount: 245, fundSum: 115000, status: "good" },
  { name: "Fargʻona viloyati", fundPlan: 125000, fundActual: 101000, fundPercent: 80.8, improvedDistricts: 3, difficultMahallas: 27, fundCount: 215, fundSum: 101000, status: "moderate" },
  { name: "Xorazm viloyati", fundPlan: 72000, fundActual: 56000, fundPercent: 77.8, improvedDistricts: 2, difficultMahallas: 17, fundCount: 108, fundSum: 56000, status: "moderate" },
  { name: "Toshkent shahri", fundPlan: 200000, fundActual: 185000, fundPercent: 92.5, improvedDistricts: 0, difficultMahallas: 5, fundCount: 320, fundSum: 185000, status: "good" },
];

// --------------------------------------------------------------
// MA'LUMOTLAR: OG'IR TUMANLAR
// --------------------------------------------------------------
interface HeavyDistrict {
  id: number;
  name: string;
  region: string;
  population: number;
  issues: string;
  improvementPlan: string;
  allocatedFund: number;
}

const generateHeavyDistricts = (): HeavyDistrict[] => {
  const districts: HeavyDistrict[] = [];
  const districtNames = [
    "Markaziy tuman", "Yangiobod tumani", "Chilonzor tumani", "Bog‘ot tumani", "Paxtakor tumani",
    "Zomin tumani", "Oltinko‘l tumani", "Jomboy tumani", "Uchquduq tumani", "Muborak tumani",
    "Dehqonobod tumani", "Qamashi tumani", "Yakkabog‘ tumani", "G‘uzor tumani", "Sherobod tumani",
    "Sariosiyo tumani", "Denov tumani", "Boysun tumani", "Qumqo‘rg‘on tumani", "Uzun tumani",
  ];
  let id = 0;
  regionsData.forEach(region => {
    for (let i = 0; i < region.improvedDistricts; i++) {
      const districtFund = Math.round(region.fundSum / Math.max(region.improvedDistricts, 1) * (0.5 + Math.random() * 0.8));
      districts.push({
        id: id++,
        name: districtNames[Math.floor(Math.random() * districtNames.length)] + ` (${region.name.slice(0, 3)})`,
        region: region.name,
        population: Math.floor(Math.random() * 50000) + 10000,
        issues: "Infratuzilma yomon, ishsizlik yuqori, suv muammosi",
        improvementPlan: "2025 yilgacha yo‘l, gaz, elektr, maktab ta'miri",
        allocatedFund: districtFund,
      });
    }
  });
  return districts;
};

// --------------------------------------------------------------
// MA'LUMOTLAR: OG'IR MAHALLALAR
// --------------------------------------------------------------
interface HeavyMahalla {
  id: number;
  name: string;
  region: string;
  households: number;
  mainProblem: string;
  status: string;
  allocatedFund: number;
}

const generateHeavyMahallas = (): HeavyMahalla[] => {
  const mahallas: HeavyMahalla[] = [];
  const mahallaNames = [
    "Oltin vodiy MFY", "Navbahor MFY", "Istiqlol MFY", "Do‘stlik MFY", "Bunyodkor MFY",
    "Chorshanba MFY", "Sohil MFY", "Yangi hayot MFY", "Mehnat MFY", "Tong MFY",
    "Karvon MFY", "Beshyog‘och MFY", "Ko‘kcha MFY", "Yashnobod MFY", "Sergeli MFY",
  ];
  let id = 0;
  regionsData.forEach(region => {
    for (let i = 0; i < region.difficultMahallas; i++) {
      const mahallaFund = Math.round(region.fundSum / Math.max(region.difficultMahallas, 1) * (0.3 + Math.random() * 0.9));
      mahallas.push({
        id: id++,
        name: mahallaNames[Math.floor(Math.random() * mahallaNames.length)] + ` (${region.name.slice(0, 4)})`,
        region: region.name,
        households: Math.floor(Math.random() * 500) + 50,
        mainProblem: "Ishsizlik, kam ta'minlanganlik, uy-joy muammosi",
        status: "Og‘ir",
        allocatedFund: mahallaFund,
      });
    }
  });
  return mahallas;
};

const heavyDistricts = generateHeavyDistricts();
const heavyMahallas = generateHeavyMahallas();

// --------------------------------------------------------------
// RED FLAG: PROBLEMLI KONTRAKTLAR / BAJARILMAGAN ISHLAR
// --------------------------------------------------------------
interface RedFlagItem {
  id: number;
  name: string;           // mahalla yoki tuman nomi
  region: string;
  problemType: string;    // muammo turi
  contractAmount: number; // shartnoma summasi (mln so'm)
  status: string;         // holat (Bajarilmagan, Muddati o‘tgan, Kamchiliklar bor)
  details: string;
}

// Problemli kontraktlarni yaratish (ba'zi mahalla va tumanlar asosida)
const generateRedFlags = (): RedFlagItem[] => {
  const redFlags: RedFlagItem[] = [];
  const problemTypes = [
    "Shartnoma bajarilmagan", "Mablag‘ o‘zlashtirilmagan", "Sifatli ta'mirlanmagan",
    "Muddat buzilgan", "Hisobot taqdim etilmagan", "Jarima qo‘llanilgan",
  ];
  const statuses = ["Bajarilmagan", "Muddati o‘tgan", "Kamchiliklar bor", "Qayta ko‘rib chiqilmoqda"];

  // Mahallalardan 40% ini problemli qilamiz
  const problemMahallas = heavyMahallas.filter(() => Math.random() < 0.4);
  problemMahallas.forEach((m, idx) => {
    redFlags.push({
      id: idx,
      name: m.name,
      region: m.region,
      problemType: problemTypes[Math.floor(Math.random() * problemTypes.length)],
      contractAmount: m.allocatedFund,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      details: `${m.name} da ${problemTypes[Math.floor(Math.random() * problemTypes.length)]}. Ajratilgan mablag‘ ${m.allocatedFund} mln so‘m, ammo ishlar to‘liq bajarilmagan.`,
    });
  });

  // Tumanlardan 30% ini problemli qilamiz
  const problemDistricts = heavyDistricts.filter(() => Math.random() < 0.3);
  problemDistricts.forEach((d, idx) => {
    redFlags.push({
      id: problemMahallas.length + idx,
      name: d.name,
      region: d.region,
      problemType: problemTypes[Math.floor(Math.random() * problemTypes.length)],
      contractAmount: d.allocatedFund,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      details: `${d.name} da ${problemTypes[Math.floor(Math.random() * problemTypes.length)]}. Rejalashtirilgan ishlar ${d.allocatedFund} mln so‘m miqdorida bajarilmagan.`,
    });
  });

  return redFlags;
};

const redFlagsData = generateRedFlags();

// --------------------------------------------------------------
// ASOSIY KOMPONENT
// --------------------------------------------------------------
export default function Regions() {
  const [activeTab, setActiveTab] = useState<"districts" | "mahallas" | "redflag">("districts");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Общие итоги
  const totalDistricts = heavyDistricts.length;
  const totalMahallas = heavyMahallas.length;
  const totalRedFlags = redFlagsData.length;

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    onOpen();
  };

  const renderTable = () => {
    if (activeTab === "districts") {
      return (
        <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Tuman nomi</Th>
                <Th>Viloyat</Th>
                <Th isNumeric>Aholi soni</Th>
                <Th isNumeric>Ajratilgan mablag‘ (mln so‘m)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {heavyDistricts.map((district) => (
                <Tr key={district.id} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => handleRowClick(district)}>
                  <Td fontWeight="medium">{district.name}</Td>
                  <Td>{district.region}</Td>
                  <Td isNumeric>{district.population.toLocaleString()}</Td>
                  <Td isNumeric fontWeight="bold" color="green.600">{district.allocatedFund.toLocaleString()} mln</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );
    }

    if (activeTab === "mahallas") {
      return (
        <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Mahalla nomi</Th>
                <Th>Viloyat</Th>
                <Th isNumeric>Xo‘jaliklar soni</Th>
                <Th isNumeric>Ajratilgan mablag‘ (mln so‘m)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {heavyMahallas.map((mahalla) => (
                <Tr key={mahalla.id} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => handleRowClick(mahalla)}>
                  <Td fontWeight="medium">{mahalla.name}</Td>
                  <Td>{mahalla.region}</Td>
                  <Td isNumeric>{mahalla.households.toLocaleString()}</Td>
                  <Td isNumeric fontWeight="bold" color="green.600">{mahalla.allocatedFund.toLocaleString()} mln</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );
    }

    if (activeTab === "redflag") {
      return (
        <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Mahalla / Tuman</Th>
                <Th>Viloyat</Th>
                <Th>Muammo turi</Th>
                <Th isNumeric>Shartnoma summasi (mln so‘m)</Th>
                <Th>Holat</Th>
              </Tr>
            </Thead>
            <Tbody>
              {redFlagsData.map((flag) => (
                <Tr key={flag.id} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => handleRowClick(flag)}>
                  <Td fontWeight="medium">{flag.name}</Td>
                  <Td>{flag.region}</Td>
                  <Td>{flag.problemType}</Td>
                  <Td isNumeric fontWeight="bold" color="red.500">{flag.contractAmount.toLocaleString()} mln</Td>
                  <Td><Badge colorScheme="red">{flag.status}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Uchta karta */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card
          cursor="pointer"
          onClick={() => setActiveTab("districts")}
          borderLeft="4px"
          borderLeftColor={activeTab === "districts" ? "blue.500" : "orange.400"}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          bg={activeTab === "districts" ? "blue.50" : "white"}
        >
          <CardBody>
            <Flex align="center" gap={4}>
              <Icon as={Layers} boxSize={10} color="orange.500" />
              <Box flex="1">
                <Stat>
                  <StatLabel fontSize="lg" fontWeight="bold">Og‘ir tumanlar</StatLabel>
                  <StatNumber fontSize="3xl">{totalDistricts}</StatNumber>
                  <StatLabel fontSize="sm">Infratuzilmasi yaxshilangan</StatLabel>
                </Stat>
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card
          cursor="pointer"
          onClick={() => setActiveTab("mahallas")}
          borderLeft="4px"
          borderLeftColor={activeTab === "mahallas" ? "blue.500" : "red.400"}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          bg={activeTab === "mahallas" ? "blue.50" : "white"}
        >
          <CardBody>
            <Flex align="center" gap={4}>
              <Icon as={Grid} boxSize={10} color="red.500" />
              <Box flex="1">
                <Stat>
                  <StatLabel fontSize="lg" fontWeight="bold">Og‘ir mahallalar</StatLabel>
                  <StatNumber fontSize="3xl">{totalMahallas}</StatNumber>
                  <StatLabel fontSize="sm">Eng muammoli hududlar</StatLabel>
                </Stat>
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card
          cursor="pointer"
          onClick={() => setActiveTab("redflag")}
          borderLeft="4px"
          borderLeftColor={activeTab === "redflag" ? "blue.500" : "red.500"}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          bg={activeTab === "redflag" ? "blue.50" : "white"}
        >
          <CardBody>
            <Flex align="center" gap={4}>
              <Icon as={AlertTriangle} boxSize={10} color="red.500" />
              <Box flex="1">
                <Stat>
                  <StatLabel fontSize="lg" fontWeight="bold">Aniqlangan kamchilik</StatLabel>
                  <StatNumber fontSize="3xl">{totalRedFlags}</StatNumber>
                  <StatLabel fontSize="sm">Bajarilmagan kontraktlar</StatLabel>
                </Stat>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Dinamik jadval */}
      <Box mt={4}>
        <Heading size="md" mb={4}>
          {activeTab === "districts" && "📋 Og‘ir tumanlar ro‘yxati"}
          {activeTab === "mahallas" && "📋 Og‘ir mahallalar ro‘yxati"}
          {activeTab === "redflag" && "⚠️ Bajarilmagan kontraktlar / Muammolar"}
        </Heading>
        <Box bg='white'>
          {renderTable()}
        </Box>
      </Box>

      {/* Modal oyna */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <Icon as={Info} color="blue.500" />
              Batafsil ma'lumot
            </Flex>
          </ModalHeader>
          <ModalBody>
            {selectedItem && (
              <Box>
                <Text fontWeight="bold" fontSize="lg">{selectedItem.name}</Text>
                <Divider my={2} />
                <SimpleGrid columns={2} spacing={3}>
                  {selectedItem.region && <><Text fontWeight="semibold">Viloyat:</Text><Text>{selectedItem.region}</Text></>}
                  {selectedItem.population && <><Text fontWeight="semibold">Aholi soni:</Text><Text>{selectedItem.population.toLocaleString()}</Text></>}
                  {selectedItem.households && <><Text fontWeight="semibold">Xo‘jaliklar soni:</Text><Text>{selectedItem.households.toLocaleString()}</Text></>}
                  {selectedItem.issues && <><Text fontWeight="semibold">Asosiy muammolar:</Text><Text>{selectedItem.issues}</Text></>}
                  {selectedItem.improvementPlan && <><Text fontWeight="semibold">Yaxshilash rejasi:</Text><Text>{selectedItem.improvementPlan}</Text></>}
                  {selectedItem.mainProblem && <><Text fontWeight="semibold">Asosiy muammo:</Text><Text>{selectedItem.mainProblem}</Text></>}
                  {selectedItem.status && <><Text fontWeight="semibold">Holat:</Text><Badge colorScheme="red">{selectedItem.status}</Badge></>}
                  {selectedItem.problemType && <><Text fontWeight="semibold">Muammo turi:</Text><Text>{selectedItem.problemType}</Text></>}
                  {selectedItem.contractAmount && <><Text fontWeight="semibold">Shartnoma summasi:</Text><Text fontWeight="bold" color="red.500">{selectedItem.contractAmount.toLocaleString()} mln so‘m</Text></>}
                  {selectedItem.allocatedFund !== undefined && !selectedItem.contractAmount && (
                    <>
                      <Text fontWeight="semibold">Ajratilgan mablag‘:</Text>
                      <Text fontWeight="bold" color="green.600">{selectedItem.allocatedFund.toLocaleString()} mln so‘m</Text>
                    </>
                  )}
                  {selectedItem.details && <><Text fontWeight="semibold">Batafsil:</Text><Text>{selectedItem.details}</Text></>}
                </SimpleGrid>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>Yopish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}