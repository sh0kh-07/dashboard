import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    SimpleGrid,
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Flex,
    useToken,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Icon,
} from "@chakra-ui/react";
import {
    Landmark,
    Wallet,
    Banknote,
    Globe,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";

type Category = "budget" | "funds" | "loans" | "external";

const categories: Record<Category, { title: string; amount: string; unit: string; icon: any; color: string }> = {
    budget: {
        title: "Davlat byudjeti",
        amount: "26,8",
        unit: "trln so‘m",
        icon: Landmark,
        color: "#3182CE",
    },
    funds: {
        title: "Jamg‘armalar",
        amount: "1,2",
        unit: "trln so‘m",
        icon: Wallet,
        color: "#38A169",
    },
    loans: {
        title: "Bank kreditlari",
        amount: "140",
        unit: "trln so‘m",
        icon: Banknote,
        color: "#DD6B20",
    },
    external: {
        title: "Tashqi moliya",
        amount: "8,33",
        unit: "mlrd AQSH dollari",
        icon: Globe,
        color: "#805AD5",
    },
};

// Контракты (kamchiliklar) по категориям
const contracts: Record<Category, Array<{
    id: number;
    name: string;
    type: string;
    amount: number;
    status: "bajarildi" | "bajarilmoqda" | "rejalashtirilgan";
    verification: "tasdiqlangan" | "rad etilgan";
}>> = {
    budget: [
        { id: 1, name: "Mahalla yo‘llarini asfaltlash", type: "Yo‘l qurilishi", amount: 6.6, status: "bajarildi", verification: "rad etilgan" },
        { id: 2, name: "Ko‘cha yoritish tizimini modernizatsiya qilish", type: "Yo‘l qurilishi", amount: 4.4, status: "bajarilmoqda", verification: "tasdiqlangan" },
        { id: 3, name: "Yoshlar tadbirkorlik markazini tashkil etish", type: "Jamg‘arma", amount: 3.2, status: "rejalashtirilgan", verification: "rad etilgan" },
        { id: 4, name: "Suv ta'minoti tarmog‘ini yangilash", type: "Kommunal", amount: 5.1, status: "bajarilmoqda", verification: "tasdiqlangan" },
    ],
    funds: [
        { id: 1, name: "Kambag‘al oilalarga moddiy yordam", type: "Ijtimoiy", amount: 2.5, status: "bajarildi", verification: "rad etilgan" },
        { id: 2, name: "Nogironlar reabilitatsiya markazi", type: "Sog‘liqni saqlash", amount: 1.8, status: "bajarilmoqda", verification: "tasdiqlangan" },
        { id: 3, name: "Yoshlar startap loyihalari", type: "Ta'lim", amount: 0.9, status: "rejalashtirilgan", verification: "rad etilgan" },
    ],
    loans: [
        { id: 1, name: "Kichik biznesga imtiyozli kreditlar", type: "Moliyaviy", amount: 25.0, status: "bajarildi", verification: "rad etilgan" },
        { id: 2, name: "Qishloq xo‘jaligi texnikalarini yetkazib berish", type: "Qishloq xo‘jaligi", amount: 12.3, status: "bajarilmoqda", verification: "tasdiqlangan" },
        { id: 3, name: "Ayollar tadbirkorligini qo‘llab-quvvatlash", type: "Ijtimoiy", amount: 8.7, status: "rejalashtirilgan", verification: "rad etilgan" },
    ],
    external: [
        { id: 1, name: "Xalqaro aeroportni modernizatsiya qilish", type: "Infratuzilma", amount: 45.2, status: "bajarilmoqda", verification: "tasdiqlangan" },
        { id: 2, name: "Suv resurslarini boshqarish loyihasi", type: "Ekologiya", amount: 18.5, status: "rejalashtirilgan", verification: "rad etilgan" },
        { id: 3, name: "Energiya samaradorligini oshirish", type: "Energetika", amount: 22.0, status: "bajarildi", verification: "tasdiqlangan" },
    ],
};

const statusColors = {
    bajarildi: "green",
    bajarilmoqda: "blue",
    rejalashtirilgan: "yellow",
};

const statusLabels = {
    bajarildi: "Bajarildi",
    bajarilmoqda: "Bajarilmoqda",
    rejalashtirilgan: "Rejalashtirilgan",
};

const verificationIcons = {
    tasdiqlangan: <CheckCircle size={16} color="#38A169" />,
    "rad etilgan": <XCircle size={16} color="#F56565" />,
};

const verificationLabels = {
    tasdiqlangan: "Tasdiqlangan",
    "rad etilgan": "Rad etilgan",
};

const AniqlanganKamchilik = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>("budget");
    const [brand600] = useToken("colors", ["brand.600"]);

    const currentContracts = contracts[selectedCategory];

    return (
        <Box>
            <Flex alignItems="center" justifyContent="space-between" mb={6}>
                <Heading as="h1" size="lg" fontWeight="bold" color="gray.800">
                    Aniqlangan kamchiliklar
                </Heading>
                <Badge colorScheme="red" fontSize="md" px={3} py={1} borderRadius="full">
                    15 ta kamchilik
                </Badge>
            </Flex>

            {/* Карточки категорий */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                {Object.entries(categories).map(([key, cat]) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === key;
                    return (
                        <Card
                            key={key}
                            variant="outline"
                            border="2px solid"
                            borderColor={isSelected ? cat.color : "gray.200"}
                            borderRadius="xl"
                            transition="0.2s"
                            bg="white"
                            cursor="pointer"
                            _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
                            onClick={() => setSelectedCategory(key as Category)}
                        >
                            <CardBody>
                                <Stat>
                                    <Flex align="center" gap={2} mb={2}>
                                        <Icon size={24} color={cat.color} />
                                        <StatLabel fontSize="lg" fontWeight="bold" color="gray.800">
                                            {cat.title}
                                        </StatLabel>
                                    </Flex>
                                    <StatNumber fontSize="2xl" fontWeight="black" color={cat.color}>
                                        {cat.amount} {cat.unit}
                                    </StatNumber>
                                    <StatHelpText fontSize="xs" color="gray.600">
                                        Umumiy hajm
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    );
                })}
            </SimpleGrid>

            {/* Таблица контрактов / kamchiliklar */}
            <Flex align="center" gap={3} mb={4}>
                <AlertTriangle size={20} color="#F56565" />
                <Heading as="h2" size="md" color="gray.700">
                    {categories[selectedCategory].title} bo‘yicha aniqlangan kamchiliklar
                </Heading>
            </Flex>

            <TableContainer
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
                mb={6}
            >
                <Table variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Kontrakt nomi</Th>
                            <Th>Turi</Th>
                            <Th isNumeric>Summa (mlrd so‘m)</Th>
                            <Th>Holati</Th>
                            <Th>Tekshiruv</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentContracts.map((contract) => (
                            <Tr key={contract.id} _hover={{ bg: "gray.50" }}>
                                <Td fontWeight="medium">{contract.name}</Td>
                                <Td>{contract.type}</Td>
                                <Td isNumeric fontWeight="bold" color={brand600}>
                                    {contract.amount}
                                </Td>
                                <Td>
                                    <Badge colorScheme={statusColors[contract.status]} borderRadius="full" px={2}>
                                        {statusLabels[contract.status]}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Flex align="center" gap={2}>
                                        {verificationIcons[contract.verification]}
                                        <Text fontSize="sm" color={contract.verification === "tasdiqlangan" ? "green.600" : "red.600"}>
                                            {verificationLabels[contract.verification]}
                                        </Text>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Общая статистика */}
            <Box p={4} bg="gray.50" borderRadius="xl">
                <Flex align="center" gap={2} mb={2}>
                    <AlertTriangle size={18} color="#F56565" />
                    <Text fontWeight="bold" fontSize="sm" color="gray.700">
                        Umumiy statistik:
                    </Text>
                </Flex>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    <Text fontSize="xs" color="gray.600">Davlat byudjeti: {contracts.budget.length} ta</Text>
                    <Text fontSize="xs" color="gray.600">Jamg‘armalar: {contracts.funds.length} ta</Text>
                    <Text fontSize="xs" color="gray.600">Bank kreditlari: {contracts.loans.length} ta</Text>
                    <Text fontSize="xs" color="gray.600">Tashqi moliya: {contracts.external.length} ta</Text>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default AniqlanganKamchilik;