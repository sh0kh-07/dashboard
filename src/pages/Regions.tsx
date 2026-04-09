// src/pages/HeavyDistrictsList.tsx
import React, { useMemo } from "react";
import {
    Box, Heading, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
    Text, Input, InputGroup, InputLeftElement, Flex,
} from "@chakra-ui/react";
import { Search } from "lucide-react";

// Maʼlumotlarni toʻplash (jadvaldan olingan barcha ogʻir mahallalar)
// Har bir qator: tuman (shahar) nomi, aholi soni, xonadonlar, oilalar
const rawEntries: { district: string; population: number; households: number; families: number }[] = [
    // Қорақалпоғистон – Амударё тумани
    { district: "Амударё тумани", population: 4500, households: 768, families: 1255 },
    { district: "Амударё тумани", population: 4999, households: 688, families: 812 },
    { district: "Амударё тумани", population: 4685, households: 806, families: 1158 },
    { district: "Амударё тумани", population: 4718, households: 727, families: 1580 },
    { district: "Амударё тумани", population: 4697, households: 895, families: 1422 },
    { district: "Амударё тумани", population: 3630, households: 665, families: 735 },
    { district: "Амударё тумани", population: 2874, households: 621, families: 751 },
    // Беруний тумани
    { district: "Беруний тумани", population: 5208, households: 1006, families: 1561 },
    { district: "Беруний тумани", population: 6976, households: 1425, families: 1498 },
    { district: "Беруний тумани", population: 6378, households: 1280, families: 1325 },
    { district: "Беруний тумани", population: 6077, households: 1239, families: 1620 },
    { district: "Беруний тумани", population: 5063, households: 1025, families: 1117 },
    { district: "Беруний тумани", population: 5781, households: 1039, families: 1465 },
    { district: "Беруний тумани", population: 4975, households: 1154, families: 1584 },
    // Бўзатов тумани
    { district: "Бўзатов тумани", population: 1943, households: 331, families: 437 },
    // Кегейли тумани
    { district: "Кегейли тумани", population: 6035, households: 989, families: 1124 },
    { district: "Кегейли тумани", population: 7599, households: 1297, families: 1409 },
    { district: "Кегейли тумани", population: 6442, households: 1103, families: 1192 },
    { district: "Кегейли тумани", population: 5041, households: 998, families: 1145 },
    { district: "Кегейли тумани", population: 3135, households: 637, families: 754 },
    // Қонликўл тумани
    { district: "Қонликўл тумани", population: 3756, households: 531, families: 591 },
    // Қораўзак тумани
    { district: "Қораўзак тумани", population: 2447, households: 385, families: 506 },
    { district: "Қораўзак тумани", population: 1039, households: 771, families: 1102 },
    { district: "Қораўзак тумани", population: 2157, households: 205, families: 242 },
    { district: "Қораўзак тумани", population: 5441, households: 710, families: 781 },
    { district: "Қораўзак тумани", population: 3989, households: 875, families: 986 },
    // Қўнғирот тумани
    { district: "Қўнғирот тумани", population: 3354, households: 817, families: 851 },
    { district: "Қўнғирот тумани", population: 3498, households: 651, families: 784 },
    { district: "Қўнғирот тумани", population: 3878, households: 774, families: 837 },
    { district: "Қўнғирот тумани", population: 3317, households: 632, families: 803 },
    { district: "Қўнғирот тумани", population: 2851, households: 594, families: 641 },
    { district: "Қўнғирот тумани", population: 2735, households: 585, families: 531 },
    { district: "Қўнғирот тумани", population: 3217, households: 695, families: 865 },
    // Мўйноқ тумани
    { district: "Мўйноқ тумани", population: 4552, households: 564, families: 742 },
    // Нукус тумани
    { district: "Нукус тумани", population: 2144, households: 389, families: 547 },
    { district: "Нукус тумани", population: 3714, households: 784, families: 827 },
    { district: "Нукус тумани", population: 3448, households: 836, families: 1006 },
    { district: "Нукус тумани", population: 3880, households: 759, families: 796 },
    { district: "Нукус тумани", population: 5165, households: 1347, families: 1426 },
    // Нукус шаҳри
    { district: "Нукус шаҳри", population: 4871, households: 1324, families: 1350 },
    { district: "Нукус шаҳри", population: 2414, households: 525, families: 632 },
    { district: "Нукус шаҳри", population: 6294, households: 1228, families: 1318 },
    { district: "Нукус шаҳри", population: 2703, households: 623, families: 681 },
    { district: "Нукус шаҳри", population: 4831, households: 1444, families: 1487 },
    { district: "Нукус шаҳри", population: 7476, households: 151, families: 682 },
    { district: "Нукус шаҳри", population: 4786, households: 1003, families: 1212 },
    { district: "Нукус шаҳри", population: 2159, households: 533, families: 557 },
    { district: "Нукус шаҳри", population: 4183, households: 846, families: 950 },
    { district: "Нукус шаҳри", population: 5810, households: 1004, families: 1215 },
    { district: "Нукус шаҳри", population: 7812, households: 1637, families: 2017 },
    { district: "Нукус шаҳри", population: 10834, households: 2705, families: 5506 },
    // Тахиатош тумани
    { district: "Тахиатош тумани", population: 6819, households: 1112, families: 1335 },
    { district: "Тахиатош тумани", population: 1993, households: 327, families: 535 },
    { district: "Тахиатош тумани", population: 5965, households: 1220, families: 1308 },
    { district: "Тахиатош тумани", population: 3963, households: 692, families: 833 },
    // Тахтакўпир тумани
    { district: "Тахтакўпир тумани", population: 944, households: 581, families: 618 },
    { district: "Тахтакўпир тумани", population: 3019, households: 560, families: 604 },
    { district: "Тахтакўпир тумани", population: 2503, households: 502, families: 597 },
    { district: "Тахтакўпир тумани", population: 603, households: 142, families: 156 },
    { district: "Тахтакўпир тумани", population: 465, households: 101, families: 138 },
    { district: "Тахтакўпир тумани", population: 412, households: 87, families: 128 },
    { district: "Тахтакўпир тумани", population: 1152, households: 212, families: 259 },
    // Тўрткўл тумани
    { district: "Тўрткўл тумани", population: 3506, households: 805, families: 1071 },
    { district: "Тўрткўл тумани", population: 2810, households: 404, families: 617 },
    { district: "Тўрткўл тумани", population: 1572, households: 332, families: 413 },
    { district: "Тўрткўл тумани", population: 2498, households: 367, families: 510 },
    { district: "Тўрткўл тумани", population: 8033, households: 1597, families: 2107 },
    { district: "Тўрткўл тумани", population: 1968, households: 380, families: 557 },
    { district: "Тўрткўл тумани", population: 2156, households: 286, families: 551 },
    // Хўжайли тумани
    { district: "Хўжайли тумани", population: 5683, households: 1183, families: 1573 },
    { district: "Хўжайли тумани", population: 4901, households: 926, families: 1204 },
    { district: "Хўжайли тумани", population: 7068, households: 1122, families: 1550 },
    { district: "Хўжайли тумани", population: 6297, households: 1194, families: 1765 },
    { district: "Хўжайли тумани", population: 6379, households: 1214, families: 1331 },
    { district: "Хўжайли тумани", population: 3730, households: 617, families: 820 },
    { district: "Хўжайли тумани", population: 7684, households: 2067, families: 2865 },
    // Чимбой тумани
    { district: "Чимбой тумани", population: 4762, households: 1242, families: 1440 },
    { district: "Чимбой тумани", population: 4033, households: 674, families: 1019 },
    { district: "Чимбой тумани", population: 5428, households: 810, families: 1258 },
    { district: "Чимбой тумани", population: 4727, households: 998, families: 1363 },
    { district: "Чимбой тумани", population: 3314, households: 428, families: 768 },
    { district: "Чимбой тумани", population: 3763, households: 670, families: 987 },
    // Шуманай тумани
    { district: "Шуманай тумани", population: 5120, households: 404, families: 507 },
    // Элликқалъа тумани
    { district: "Элликқалъа тумани", population: 1498, households: 258, families: 305 },
    { district: "Элликқалъа тумани", population: 7892, households: 1265, families: 1815 },
    { district: "Элликқалъа тумани", population: 2157, households: 593, families: 597 },
    { district: "Элликқалъа тумани", population: 2665, households: 550, families: 670 },
    { district: "Элликқалъа тумани", population: 3149, households: 565, families: 813 },
    { district: "Элликқалъа тумани", population: 2051, households: 365, families: 540 },
    { district: "Элликқалъа тумани", population: 662, households: 83, families: 114 },
    // Андижон вилояти
    { district: "Андижон тумани", population: 4140, households: 1135, families: 1187 },
    { district: "Андижон тумани", population: 7018, households: 1496, families: 2012 },
    { district: "Андижон тумани", population: 1486, households: 359, families: 426 },
    { district: "Андижон шаҳри", population: 7875, households: 1322, families: 2175 },
    { district: "Андижон шаҳри", population: 3592, households: 1104, families: 992 },
    { district: "Асака тумани", population: 5258, households: 1258, families: 1390 },
    { district: "Асака тумани", population: 7699, households: 1156, families: 2035 },
    { district: "Балиқчи тумани", population: 3069, households: 634, families: 806 },
    { district: "Балиқчи тумани", population: 1965, households: 521, families: 516 },
    { district: "Балиқчи тумани", population: 4436, households: 528, families: 1165 },
    { district: "Балиқчи тумани", population: 3617, households: 677, families: 950 },
    { district: "Булоқбоши тумани", population: 3431, households: 714, families: 912 },
    { district: "Булоқбоши тумани", population: 3254, households: 575, families: 865 },
    { district: "Булоқбоши тумани", population: 2874, households: 742, families: 764 },
    { district: "Бўстон тумани", population: 3679, households: 877, families: 942 },
    { district: "Бўстон тумани", population: 3093, households: 543, families: 792 },
    { district: "Бўстон тумани", population: 3437, households: 660, families: 880 },
    { district: "Бўстон тумани", population: 4898, households: 1020, families: 1254 },
    { district: "Жалақудуқ тумани", population: 2786, households: 582, families: 731 },
    { district: "Жалақудуқ тумани", population: 3963, households: 645, families: 1040 },
    { district: "Жалақудуқ тумани", population: 4401, households: 624, families: 1155 },
    { district: "Жалақудуқ тумани", population: 3433, households: 685, families: 901 },
    { district: "Избоскан тумани", population: 5271, households: 1011, families: 1402 },
    { district: "Избоскан тумани", population: 7599, households: 1213, families: 2021 },
    { district: "Избоскан тумани", population: 5922, households: 1240, families: 1575 },
    { district: "Избоскан тумани", population: 4117, households: 740, families: 1095 },
    { district: "Қўрғонтепа тумани", population: 5295, households: 640, families: 1415 },
    { district: "Қўрғонтепа тумани", population: 2193, households: 517, families: 586 },
    { district: "Қўрғонтепа тумани", population: 2443, households: 431, families: 653 },
    { district: "Қўрғонтепа тумани", population: 4030, households: 618, families: 1077 },
    { district: "Марҳамат тумани", population: 6173, households: 1032, families: 1758 },
    { district: "Марҳамат тумани", population: 2721, households: 594, families: 775 },
    { district: "Марҳамат тумани", population: 3083, households: 617, families: 878 },
    { district: "Марҳамат тумани", population: 3241, households: 676, families: 923 },
    { district: "Олтинкўл тумани", population: 3076, households: 624, families: 941 },
    { district: "Олтинкўл тумани", population: 2376, households: 635, families: 727 },
    { district: "Олтинкўл тумани", population: 1677, households: 307, families: 513 },
    { district: "Пахтаобод тумани", population: 2136, households: 501, families: 675 },
    { district: "Пахтаобод тумани", population: 3347, households: 635, families: 946 },
    { district: "Пахтаобод тумани", population: 3150, households: 650, families: 850 },
    { district: "Пахтаобод тумани", population: 4782, households: 1060, families: 1520 },
    { district: "Улуғнор тумани", population: 1889, households: 366, families: 530 },
    { district: "Улуғнор тумани", population: 3796, households: 659, families: 1065 },
    { district: "Улуғнор тумани", population: 2937, households: 587, families: 824 },
    { district: "Улуғноор тумани", population: 1904, households: 332, families: 534 }, // (name correction)
    { district: "Хонобод шаҳри", population: 2729, households: 503, families: 775 },
    { district: "Хонобод шаҳри", population: 2681, households: 640, families: 717 },
    { district: "Хўжаобод тумани", population: 2804, households: 694, families: 815 },
    { district: "Хўжаобод тумани", population: 3493, households: 780, families: 1015 },
    { district: "Шаҳрихон тумани", population: 10376, households: 2023, families: 2747 }, // bitta yozuv, qolganlari yo‘q
];

// Туманлар бўйича йиғинди
const aggregateByDistrict = () => {
    const map = new Map<string, { population: number; households: number; families: number }>();
    for (const entry of rawEntries) {
        const existing = map.get(entry.district);
        if (existing) {
            existing.population += entry.population;
            existing.households += entry.households;
            existing.families += entry.families;
        } else {
            map.set(entry.district, {
                population: entry.population,
                households: entry.households,
                families: entry.families,
            });
        }
    }
    return Array.from(map.entries()).map(([district, data]) => ({
        district,
        population: data.population,
        households: data.households,
        families: data.families,
    })).sort((a, b) => a.district.localeCompare(b.district));
};

const districtData = aggregateByDistrict();

const HeavyDistrictsList = () => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredData = districtData.filter(item =>
        item.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Heading as="h1" size="xl" mb={2}>
                Ogʻir mahallalari bor tumanlar
            </Heading>
            <Text fontSize="md" color="gray.400" mb={4}>
                Jami {districtData.length} ta tuman/shaharda ogʻir mahallalar mavjud
            </Text>

            <InputGroup maxW="400px" mb={6}>
                <InputLeftElement pointerEvents="none">
                    <Search size={18} color="gray.400" />
                </InputLeftElement>
                <Input
                    placeholder="Tuman nomi boʻyicha qidirish..."
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
                            <Th>Tuman/shahar nomi</Th>
                            <Th isNumeric>Aholi soni</Th>
                            <Th isNumeric>Xonadonlar soni</Th>
                            <Th isNumeric>Oilalar soni</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredData.map((item, idx) => (
                            <Tr key={idx} _hover={{ bg: "gray.800" }}>
                                <Td fontWeight="medium">{item.district}</Td>
                                <Td isNumeric>{item.population.toLocaleString()}</Td>
                                <Td isNumeric>{item.households.toLocaleString()}</Td>
                                <Td isNumeric>{item.families.toLocaleString()}</Td>
                            </Tr>
                        ))}
                        {filteredData.length === 0 && (
                            <Tr>
                                <Td colSpan={4} textAlign="center" py={8} color="gray.400">
                                    Hech qanday tuman topilmadi
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default HeavyDistrictsList;