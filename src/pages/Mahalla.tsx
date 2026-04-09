// src/pages/Mahalla.tsx
import React, { useState } from "react";
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Input, InputGroup, InputLeftElement, Text,
} from "@chakra-ui/react";
import { Search } from "lucide-react";

interface HeavyMahalla {
  id: number;
  region: string;
  district: string;
  name: string;
  population: number;
  households: number;
  families: number;
}

// Faqat 20 ta og‘ir mahalla (jadvaldan tanlab olingan)
const heavyMahallaData: HeavyMahalla[] = [
  { id: 1, region: "Qoraqalpog‘iston", district: "Amudaryo tumani", name: "Jumur ovul MFY", population: 4500, households: 768, families: 1255 },
  { id: 2, region: "Qoraqalpog‘iston", district: "Amudaryo tumani", name: "Jumurtov ShFY", population: 4999, households: 688, families: 812 },
  { id: 3, region: "Qoraqalpog‘iston", district: "Beruniy tumani", name: "Aboy OFY", population: 5208, households: 1006, families: 1561 },
  { id: 4, region: "Qoraqalpog‘iston", district: "Beruniy tumani", name: "Bo‘ston MFY", population: 6976, households: 1425, families: 1498 },
  { id: 5, region: "Qoraqalpog‘iston", district: "Bo‘zatov tumani", name: "Aspantay OFY", population: 1943, households: 331, families: 437 },
  { id: 6, region: "Qoraqalpog‘iston", district: "Kegeyli tumani", name: "Abt OFY", population: 6035, households: 989, families: 1124 },
  { id: 7, region: "Qoraqalpog‘iston", district: "Kegeyli tumani", name: "Aqtuba OFY", population: 7599, households: 1297, families: 1409 },
  { id: 8, region: "Qoraqalpog‘iston", district: "Qonliko‘l tumani", name: "Bostan OFY", population: 3756, households: 531, families: 591 },
  { id: 9, region: "Qoraqalpog‘iston", district: "Qorao‘zak tumani", name: "Yesimo‘zek OFY", population: 2447, households: 385, families: 506 },
  { id: 10, region: "Qoraqalpog‘iston", district: "Qo‘ng‘irot tumani", name: "Qoraqalpog‘iston ShFY", population: 3354, households: 817, families: 851 },
  { id: 11, region: "Qoraqalpog‘iston", district: "Mo‘ynoq tumani", name: "Qozog‘daryo OFY", population: 4552, households: 564, families: 742 },
  { id: 12, region: "Qoraqalpog‘iston", district: "Nukus tumani", name: "Aqterek MFY", population: 2144, households: 389, families: 547 },
  { id: 13, region: "Qoraqalpog‘iston", district: "Nukus shahri", name: "Jipek joli MFY", population: 4871, households: 1324, families: 1350 },
  { id: 14, region: "Qoraqalpog‘iston", district: "Taxiatosh tumani", name: "Jayxun MFY", population: 6819, households: 1112, families: 1335 },
  { id: 15, region: "Qoraqalpog‘iston", district: "Taxtako‘pir tumani", name: "Beltov OFY", population: 944, households: 581, families: 618 },
  { id: 16, region: "Qoraqalpog‘iston", district: "To‘rtko‘l tumani", name: "Yoshlik MFY", population: 3506, households: 805, families: 1071 },
  { id: 17, region: "Qoraqalpog‘iston", district: "Xo‘jayli tumani", name: "Amudaryo OFY", population: 5683, households: 1183, families: 1573 },
  { id: 18, region: "Qoraqalpog‘iston", district: "Chimboy tumani", name: "Konshi MFY", population: 4762, households: 1242, families: 1440 },
  { id: 19, region: "Andijon", district: "Andijon tumani", name: "Qum ko‘cha", population: 4140, households: 1135, families: 1187 },
  { id: 20, region: "Andijon", district: "Andijon shahri", name: "Obod", population: 7875, households: 1322, families: 2175 },
];

const Mahalla = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = heavyMahallaData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Heading as="h1" size="xl" mb={2}>
        Og‘ir mahallalar ro‘yxati 
      </Heading>
 
      <InputGroup maxW="400px" mb={6}>
        <InputLeftElement pointerEvents="none">
          <Search size={18} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Mahalla, tuman yoki viloyat nomi bo‘yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="gray.900"
          borderColor="gray.700"
          color="white"
        />
      </InputGroup>

      <TableContainer bg="dark.card" borderRadius="xl" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.800">
            <Tr>
              <Th>Mahalla nomi</Th>
              <Th>Tuman</Th>
              <Th>Viloyat</Th>
              <Th isNumeric>Aholi</Th>
              <Th isNumeric>Xonadonlar</Th>
              <Th isNumeric>Oilalar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((item) => (
              <Tr key={item.id} _hover={{ bg: "gray.800" }}>
                <Td fontWeight="medium">{item.name}</Td>
                <Td>{item.district}</Td>
                <Td>{item.region}</Td>
                <Td isNumeric>{item.population.toLocaleString()}</Td>
                <Td isNumeric>{item.households.toLocaleString()}</Td>
                <Td isNumeric>{item.families.toLocaleString()}</Td>
              </Tr>
            ))}
            {filteredData.length === 0 && (
              <Tr>
                <Td colSpan={6} textAlign="center" py={8} color="gray.400">
                  Hech qanday mahalla topilmadi
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Mahalla;