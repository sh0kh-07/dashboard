import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Heading,
    useToken,
    Flex,
    IconButton,
    Badge,
} from "@chakra-ui/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    CartesianGrid,
} from "recharts";
import { ArrowRight, Lock } from "lucide-react";

const External = () => {
    const [brand600] = useToken("colors", ["brand.600"]);
    const navigate = useNavigate();

    // Общая сумма внешних источников
    const totalExternal = 8.33; // млрд долл

    // Данные по проектам (4 направления)
    const projectItems = [
        {
            id: 1,
            title: "Kichik quyosh elektr stansiyalarini o‘rnatish",
            subtitle: "Tiklanish va taraqqiyot jamg‘armasi",
            amount: 0.11,
            unit: "mlrd AQSH dollari (110 mln)",
            description:
                "Tiklanish va taraqqiyot jamg‘armasi hisobidan kichik quyosh elektr stansiyalarini o‘rnatish",
        },
        {
            id: 2,
            title: "1000 ta 'chuqur' mahallada quyosh stansiyalari",
            subtitle: "Xalqaro moliya institutlari",
            amount: 0.12,
            unit: "mlrd AQSH dollari (120 mln)",
            description:
                "Xalqaro moliya institutlari hisobidan 1000 ta 'chuqur' ixtisoslashgan mahallada quyosh stansiyalari barpo etish",
        },
        {
            id: 3,
            title: "Aholi bandligi va mehnat bozorini isloh qilish",
            subtitle: "Jahon banki krediti",
            amount: 0.10,
            unit: "mlrd AQSH dollari (100 mln)",
            description:
                "Jahon banki krediti – aholi bandligini oshirish va mehnat bozorini isloh qilish loyihasi",
        },
        {
            id: 4,
            title: "Markaziy va tijorat banklari tomonidan jalb qilinadigan mablag‘lar",
            subtitle: "Tashqi manbalar",
            amount: 8.0,
            unit: "mlrd AQSH dollari",
            description:
                "Markaziy bank va tijorat banklari tomonidan tashqi manbalardan jalb qilinadigan mablag‘lar",
        },
    ];

    // Данные по банкам (суммы в млрд долларов)
    const correctBankItems = [
        { name: "TRUSTBANK", amount: 1.5, unit: "mlrd AQSH dollari" },
        { name: "Agrobank ATB", amount: 0.6, unit: "mlrd AQSH dollari" },
        { name: "Uzsanoatqurilishbank ATB", amount: 1.2, unit: "mlrd AQSH dollari" },
        { name: "Xalq banki AT", amount: 0.5, unit: "mlrd AQSH dollari" },
        { name: "Asaka bank AJ", amount: 0.95, unit: "mlrd AQSH dollari" },
        { name: "Turon bank AJ", amount: 0.35, unit: "mlrd AQSH dollari" },
        { name: "Aloqa bank AT", amount: 0.5, unit: "mlrd AQSH dollari" },
        { name: "Biznesni rivojlantirish banki ATB", amount: 0.45, unit: "mlrd AQSH dollari" },
        { name: "Mikrokreditbank ATB", amount: 0.4, unit: "mlrd AQSH dollari" },
        { name: "Xususiy banklar", amount: 1.55, unit: "mlrd AQSH dollari" },
    ];

    // Данные для графика (банки)
    const chartData = correctBankItems.map((item) => ({
        name: item.name.length > 15 ? item.name.substring(0, 12) + "..." : item.name,
        fullName: item.name,
        value: item.amount,
    }));

    const barColors = [
        brand600,
        "#3182CE",
        "#DD6B20",
        "#38A169",
        "#D53F8C",
        "#805AD5",
        "#00A3C4",
        "#C53030",
        "#2C7A7B",
        "#D69E2E",
    ];

    const handleDetailClick = (itemId: number) => {
        if (itemId === 1) {
            navigate("/external-detail"); // замените на нужный путь
        }
    };

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="start" mb={8}>
                <Heading as="h1" size="xl" fontWeight="bold">
                    Tashqi moliya manbalari
                </Heading>
                <Box textAlign="right">
                    <Text fontSize="lg" fontWeight="medium" color="gray.400">
                        Jami jalb qilingan mablag‘lar
                    </Text>
                    <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                        {totalExternal} mlrd AQSH dollari
                    </Text>
                </Box>
            </Flex>

            {/* Проекты (4 карточки) */}
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Loyihalar va yo‘nalishlar
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={12}>
                {projectItems.map((item) => {
                    const isClickable = item.id === 1;
                    return (
                        <Card
                            key={item.id}
                            variant="outline"
                            border="none"
                            borderRadius="xl"
                            transition="0.2s"
                            bg="dark.card"
                            cursor={isClickable ? "pointer" : "default"}
                            _hover={
                                isClickable
                                    ? { boxShadow: "lg", transform: "translateY(-4px)" }
                                    : {}
                            }
                            onClick={() => handleDetailClick(item.id)}
                            position="relative"
                        >
                      
                            <CardBody>
                                <Stat>
                                    <StatLabel fontSize="md" fontWeight="bold" color="white">
                                        {item.title}
                                    </StatLabel>
                                    <StatHelpText fontSize="xs" color="gray.400" mb={1}>
                                        {item.subtitle}
                                    </StatHelpText>
                                    <StatNumber fontSize="xl" fontWeight="black" color={brand600} mt={2}>
                                        {item.amount} {item.unit}
                                    </StatNumber>
                                    <StatHelpText fontSize="xs" color="gray.500" mt={2}>
                                        {item.description}
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                            <Flex justify="flex-end" p={3} pt={0}>
                                {isClickable ? (
                                    <IconButton
                                        aria-label="Batafsil"
                                        icon={<ArrowRight size={18} />}
                                        size="sm"
                                        variant="ghost"
                                        color={brand600}
                                        _hover={{ bg: "rgba(49,130,206,0.2)" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDetailClick(item.id);
                                        }}
                                    />
                                ) : (
                                    <IconButton
                                        aria-label="Yopiq"
                                        icon={<Lock size={18} />}
                                        size="sm"
                                        variant="ghost"
                                        color="gray.500"
                                        isDisabled
                                        _hover={{}}
                                    />
                                )}
                            </Flex>
                        </Card>
                    );
                })}
            </SimpleGrid>

            {/* Банки (без изменений, не кликабельны) */}
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Banklar tomonidan jalb qilingan mablag‘lar (jami 8 mlrd AQSH dollari)
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={12}>
                {correctBankItems.map((item, idx) => (
                    <Card
                        key={idx}
                        variant="outline"
                        border="none"
                        borderRadius="xl"
                        transition="0.2s"
                        bg="dark.card"
                        _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
                    >
                        <CardBody>
                            <Stat>
                                <StatLabel fontSize="md" fontWeight="bold" color="white">
                                    {item.name}
                                </StatLabel>
                                <StatNumber fontSize="xl" fontWeight="black" color={brand600} mt={2}>
                                    {item.amount} {item.unit}
                                </StatNumber>
                            </Stat>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>

            {/* График: распределение по банкам */}
            <Box mt={10}>
                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    Banklarning tashqi manbalardan jalb qilgan mablag‘lari (mlrd AQSH dollari)
                </Text>
                <Text fontSize="sm" color="gray.500" mb={6}>
                    Jami 8 mlrd dollar – markaziy va tijorat banklari hissasi
                </Text>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={100}
                            tick={{ fontSize: 11, fill: "#cbd5e0" }}
                        />
                        <YAxis
                            label={{ value: "mlrd AQSH dollari", angle: -90, position: "insideLeft", fill: "#cbd5e0" }}
                            tick={{ fill: "#cbd5e0" }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value} mlrd $`, "Miqdori"]}
                            labelFormatter={(label) => {
                                const original = chartData.find((d) => d.name === label);
                                return original ? original.fullName : label;
                            }}
                            contentStyle={{
                                backgroundColor: "#1a202c",
                                borderRadius: "8px",
                                border: "none",
                                color: "white",
                            }}
                            itemStyle={{ color: "white" }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <Text fontSize="sm" color="gray.500" textAlign="left" mt={4}>
                    Eslatma: UZSANOATQURILISHBANK (1,2 mlrd $), Xususiy banklar (1,55 mlrd $) va TRUSTBANK (1,5 mlrd $)
                    eng katta ulushga ega. Qolgan banklar jami 3,75 mlrd $ jalb qilgan.
                </Text>
            </Box>
        </Box>
    );
};

export default External;