import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    Heading,
    useToken,
    Flex,
    IconButton,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Container,
    Badge,
} from "@chakra-ui/react";
import { ArrowRight, ChevronLeft, Building2, Target, Users, Briefcase, Home, Lock, BoxIcon } from "lucide-react";

const External = () => {
    const [brand600] = useToken("colors", ["brand.600"]);
    const navigate = useNavigate();

    type View = "banks" | "directions";
    const [currentView, setCurrentView] = useState<View>("banks");
    const [selectedBank, setSelectedBank] = useState<{ id: number; name: string; amount: number } | null>(null);

    const banks = [
        { id: 1, name: "O‘zmilliybank", amount: 1500 },
        { id: 2, name: "O‘zsanoatqurilishbank", amount: 1200 },
        { id: 3, name: "Asakabank", amount: 950 },
        { id: 4, name: "Aloqa bank", amount: 500 },
        { id: 5, name: "Biznesni rivojlantirish banki", amount: 450 },
        { id: 6, name: "Agrobank", amount: 600 },
        { id: 7, name: "Xalq banki", amount: 500 },
        { id: 8, name: "Turonbank", amount: 350 },
        { id: 9, name: "Mikrokreditbank", amount: 400 },
        { id: 10, name: "Xususiy banklar", amount: 1550 },
    ];
    const totalAmount = banks.reduce((sum, b) => sum + b.amount, 0);

    const programs = [
        {
            id: 1,
            title: "“Kambag‘allikdan farovonlik sari” dasturi",
            description: "Uzoq muddatli va imtiyozli kreditlar, biznesni boshlash va kengaytirish uchun",
            icon: Target,
            color: "#3182CE",
        },
        {
            id: 2,
            title: "Oilaviy tadbirkorlikni rivojlantirish dasturlari",
            description: "Oilaviy korxonalar, hunarmandchilik va uy sharoitida biznes yuritish uchun",
            icon: Users,
            color: "#D53F8C",
        },
        {
            id: 3,
            title: "“Mikro, kichik va o‘rta biznes” doirasida ajratilgan kreditlar",
            description: "MSB subyektlarining aylanma mablag‘lari va investitsion loyihalari uchun",
            icon: Briefcase,
            color: "#38A169",
        },
        {
            id: 4,
            title: "“Davlat ta’minotidagi oila” dasturi",
            description: "Ijtimoiy himoyadagi oilalarga imtiyozli kreditlar, subsidiyalar",
            icon: Home,
            color: "#805AD5",
        },
        {
            id: 5,
            title: "“Boshqa manbalar”",
            description: "Boshqa manbalardan ajratilgan kreditlar",
            icon: BoxIcon,
            color: "#805AD5",
        },
    ];

    // Только для O‘zmilliybank (id=1) доступна программа id=1
    const isProgramAvailable = (bankId: number, programId: number) => {
        return bankId === 1 && programId === 1;
    };

    // Обработчик выбора банка: только O‘zmilliybank открывает направления
    const handleBankClick = (bank: typeof banks[0]) => {
        if (bank.id === 1) {
            setSelectedBank(bank);
            setCurrentView("directions");
        }
        // Для остальных банков ничего не делаем (они заблокированы)
    };

    // Обработчик выбора программы: только активная программа переходит на другую страницу
    const handleProgramClick = (program: typeof programs[0]) => {
        navigate(`/loans-detail`);
    };

    const handleBackToBanks = () => {
        setCurrentView("banks");
        setSelectedBank(null);
    };

    // ========== ВИД 1: СПИСОК БАНКОВ (только O‘zmilliybank активен) ==========
    const renderBanksView = () => (
        <>
            <Flex justify="space-between" align="start" mb={2}>
                <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
                    Tashqi moliya
                </Heading>
                <Box textAlign="right">
                    <Text fontSize="lg" fontWeight="medium" color="gray.600">
                        Jami kredit hajmi
                    </Text>
                    <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                        {totalAmount} mlrd so‘m
                    </Text>
                    <Text fontSize="xs" color="gray.500">(8 trln so‘m)</Text>
                </Box>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
                {banks.map((bank) => {
                    const isActive = bank.id === 1;
                    return (
                        <Card
                            key={bank.id}
                            variant="outline"
                            borderColor={isActive ? "brand.200" : "gray.200"}
                            borderRadius="xl"
                            transition="0.2s"
                            bg="white"
                            cursor={isActive ? "pointer" : "default"}
                            _hover={
                                isActive
                                    ? { boxShadow: "lg", transform: "translateY(-4px)", borderColor: brand600 }
                                    : { boxShadow: "sm" }
                            }
                            onClick={() => isActive && handleBankClick(bank)}
                            opacity={isActive ? 1 : 0.8}
                        >
                            <CardBody>
                                <Flex align="center" gap={3} mb={3}>
                                    <Building2 size={24} color={isActive ? brand600 : "#A0AEC0"} />
                                    <Heading as="h3" size="md" fontWeight="bold" color={isActive ? "gray.800" : "gray.600"}>
                                        {bank.name}
                                    </Heading>
                                </Flex>
                                <Stat>
                                    <StatLabel fontSize="sm" color={isActive ? "gray.600" : "gray.500"}>
                                        Ajratilgan mablag‘
                                    </StatLabel>
                                    <StatNumber fontSize="2xl" fontWeight="black" color={isActive ? brand600 : "gray.500"}>
                                        {bank.amount} mlrd so‘m
                                    </StatNumber>
                                    <StatHelpText fontSize="xs" color="gray.500">
                                        {(bank.amount / totalAmount * 100).toFixed(1)}% umumiy hajmdan
                                    </StatHelpText>
                                </Stat>
                                <Flex justify="flex-end" mt={3}>
                                    {isActive ? (
                                        <IconButton
                                            aria-label="Tanlash"
                                            icon={<ArrowRight size={18} />}
                                            size="sm"
                                            variant="ghost"
                                            color={brand600}
                                            _hover={{ bg: "gray.100" }}
                                        />
                                    ) : (
                                        <IconButton
                                            aria-label="Yopiq"
                                            icon={<Lock size={16} />}
                                            size="sm"
                                            variant="ghost"
                                            color="gray.500"
                                            isDisabled
                                        />
                                    )}
                                </Flex>
                            </CardBody>
                        </Card>
                    );
                })}
            </SimpleGrid>
        </>
    );

    // ========== ВИД 2: НАПРАВЛЕНИЯ ДЛЯ O‘zmilliybank ==========
    const renderDirectionsView = () => (
        <Box py={4}>
            <Flex align="center" mb={6}>
                <IconButton
                    aria-label="Orqaga"
                    icon={<ChevronLeft size={20} />}
                    variant="ghost"
                    mr={3}
                    onClick={handleBackToBanks}
                />
                <Box>
                    <Heading as="h1" size="lg" fontWeight="bold" color="gray.800">
                        {selectedBank?.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                        Ajratilgan mablag‘: {selectedBank?.amount} mlrd so‘m
                    </Text>
                </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                {programs.map((program) => {
                    const Icon = program.icon;
                    const available = isProgramAvailable(selectedBank!.id, program.id);
                    return (
                        <Card
                            key={program.id}
                            variant="outline"
                            borderColor={available ? "brand.200" : "gray.200"}
                            borderRadius="xl"
                            transition="0.2s"
                            bg="white"
                            cursor={available ? "pointer" : "default"}
                            _hover={
                                available
                                    ? { boxShadow: "lg", transform: "translateY(-4px)", borderColor: program.color }
                                    : { boxShadow: "sm" }
                            }
                            onClick={() => handleProgramClick(program)}
                            opacity={available ? 1 : 0.9}
                        >
                            <CardBody>
                                <Flex align="center" gap={3} mb={3}>
                                    <Icon size={28} color={available ? program.color : "#A0AEC0"} />
                                    <Heading as="h3" size="md" fontWeight="bold" color={available ? "gray.800" : "gray.600"}>
                                        {program.title}
                                    </Heading>
                                </Flex>
                                <Text fontSize="sm" color={available ? "gray.600" : "gray.500"} mb={3}>
                                    {program.description}
                                </Text>
                                <Flex justify="flex-end" mt={3}>
                                    {available ? (
                                        <IconButton
                                            aria-label="Batafsil"
                                            icon={<ArrowRight size={18} />}
                                            size="sm"
                                            variant="ghost"
                                            color={program.color}
                                            _hover={{ bg: "gray.100" }}
                                        />
                                    ) : (
                                        <IconButton
                                            aria-label="Yopiq"
                                            icon={<Lock size={16} />}
                                            size="sm"
                                            variant="ghost"
                                            color="gray.500"
                                            isDisabled
                                        />
                                    )}
                                </Flex>
                            </CardBody>
                        </Card>
                    );
                })}
            </SimpleGrid>
        </Box>
    );

    return (
        <Box>
            {currentView === "banks" && renderBanksView()}
            {currentView === "directions" && renderDirectionsView()}
        </Box>
    );
};

export default External;