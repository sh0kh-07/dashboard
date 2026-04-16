// src/pages/PovertyReductionFundDetail.tsx
import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    useToken,
    Flex,
    SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Uzbekistan from "@svg-maps/uzbekistan";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";

const PovertyReductionFundDetail = () => {
    const navigate = useNavigate();
    const [brand600] = useToken("colors", ["brand.600"]);
    const [tooltip, setTooltip] = useState<any>({
        visible: false,
        x: 0,
        y: 0,
        data: null,
    });

    // --- Уровень бедности (kambag‘allik) по регионам ---
    const povertyRates: Record<string, number> = {
        Tashkent: 1.7,
        Samarkand: 2.0,
        Bukhara: 2.6,
        Kashkadarya: 3.3,
        Fergana: 2.7,
        Andijan: 2.7,
        Namangan: 2.7,
        Surkhandarya: 2.8,
        Jizzakh: 2.8,
        Sirdarya: 3.0,
        Navoi: 2.1,
        Khorezm: 3.0,
        Karakalpakstan: 3.2,
    };

    // 3 цвета в зависимости от бедности
    const getPovertyColor = (rate: number, minVal: number, maxVal: number): string => {
        if (maxVal === minVal) return "#48BB78";
        const range = maxVal - minVal;
        const third = range / 3;
        if (rate < minVal + third) return "#48BB78";
        if (rate < minVal + 2 * third) return "#ECC94B";
        return "#F56565";
    };

    const povertyValues = Object.values(povertyRates);
    const minPoverty = Math.min(...povertyValues);
    const maxPoverty = Math.max(...povertyValues);

    // --- Маппинг названий SVG -> регионы ---
    const nameMap: Record<string, string> = {
        "Toshkent": "Tashkent", "Toshkent viloyati": "Tashkent",
        "Samarqand": "Samarkand", "Samarqand viloyati": "Samarkand",
        "Buxoro": "Bukhara", "Buxoro viloyati": "Bukhara",
        "Qashqadaryo": "Kashkadarya", "Qashqadaryo viloyati": "Kashkadarya",
        "Farg‘ona": "Fergana", "Farg‘ona viloyati": "Fergana",
        "Andijon": "Andijan", "Andijon viloyati": "Andijan",
        "Namangan": "Namangan", "Namangan viloyati": "Namangan",
        "Surxondaryo": "Surkhandarya", "Surxondaryo viloyati": "Surkhandarya",
        "Jizzax": "Jizzakh", "Jizzax viloyati": "Jizzakh",
        "Sirdaryo": "Sirdarya", "Sirdaryo viloyati": "Sirdarya",
        "Navoiy": "Navoi", "Navoiy viloyati": "Navoi",
        "Xorazm": "Khorezm", "Xorazm viloyati": "Khorezm",
        "Qoraqalpog‘iston": "Karakalpakstan", "Qoraqalpog‘iston Respublikasi": "Karakalpakstan",
        "Tashkent": "Tashkent", "Samarkand": "Samarkand", "Bukhara": "Bukhara",
        "Kashkadarya": "Kashkadarya", "Fergana": "Fergana", "Andijan": "Andijan",
        "Namangan": "Namangan", "Surkhandarya": "Surkhandarya", "Jizzakh": "Jizzakh",
        "Sirdarya": "Sirdarya", "Navoi": "Navoi", "Khorezm": "Khorezm", "Karakalpakstan": "Karakalpakstan",
    };

    const normalizeName = (name: string): string => {
        return name
            .replace(/ viloyati$/i, '')
            .replace(/ shahri$/i, '')
            .replace(/ Respublikasi$/i, '')
            .trim()
            .replace(/‘/g, "'");
    };

    const getRegionKey = (svgName: string): string | null => {
        if (nameMap[svgName]) return nameMap[svgName];
        const normalized = normalizeName(svgName);
        if (nameMap[normalized]) return nameMap[normalized];
        return null;
    };

    // --- Распределение бюджета фонда (0.5 трлн = 500 млрд) по регионам ---
    const totalBudgetMlrd = 500; // млрд so‘m
    // Веса регионов (пропорционально нуждам – те же, что и для других фондов)
    const weights: Record<string, number> = {
        Tashkent: 1.5, Samarkand: 1.2, Bukhara: 1.0, Kashkadarya: 2.5,
        Fergana: 1.2, Andijan: 1.0, Namangan: 1.0, Surkhandarya: 0.9,
        Jizzakh: 0.8, Sirdarya: 0.7, Navoi: 1.1, Khorezm: 0.9, Karakalpakstan: 1.0,
    };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    const regionData: Record<string, { description: string; value: number }> = {};
    Object.keys(weights).forEach(key => {
        regionData[key] = {
            description: getDescription(key),
            value: +(totalBudgetMlrd * weights[key] / totalWeight).toFixed(1),
        };
    });

    function getDescription(key: string): string {
        const desc: Record<string, string> = {
            Tashkent: "Poytaxt va iqtisodiy markaz",
            Samarkand: "Tarixiy markaz",
            Bukhara: "Qadimiy madaniyat markazi",
            Kashkadarya: "Sanoat faolligi, og‘ir tumanlar",
            Fergana: "Farg'ona vodiysi",
            Andijan: "Sanoat hududi",
            Namangan: "Madaniy hudud",
            Surkhandarya: "Janubiy hudud",
            Jizzakh: "Markaziy hudud",
            Sirdarya: "Markaziy vodiy",
            Navoi: "Sanoat markazi",
            Khorezm: "Shimoliy hudud",
            Karakalpakstan: "Qoraqalpog‘iston Respublikasi",
        };
        return desc[key] || "Hudud";
    }

    const chartData = Object.entries(regionData)
        .map(([name, data]) => ({ name, value: data.value, description: data.description }))
        .sort((a, b) => b.value - a.value);

    const barColors = [
        brand600, "#3182CE", "#DD6B20", "#38A169", "#D53F8C",
        "#805AD5", "#00A3C4", "#C53030", "#2C7A7B", "#6B46C1",
        "#E53E3E", "#319795", "#D69E2E",
    ];

    const handleRegionClick = (regionKey: string) => {
        if (regionKey === "Kashkadarya") {
            navigate("/fund-detail/kashkadarya"); // или свой путь
        }
    };

    return (
        <Box>
            <Flex alignItems="start" justifyContent="space-between" mb={6}>
                <Box>
                    <Heading as="h1" size="lg" fontWeight="bold" color="gray.800">
                        Kambag‘allikni qisqartirish davlat maqsadli jamg‘armasi
                    </Heading>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                        Tomorqa yer egalariga yengil konstruksiyali issiqxonalar o‘rnatish uchun
                    </Text>
                </Box>
                <Box textAlign="right">
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Umumiy budjet hajmi
                    </Text>
                    <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                        0.5 trln so‘m (500 mlrd)
                    </Text>
                </Box>
            </Flex>

            <Text fontSize="sm" color="gray.600" mb={6}>
                Jamg‘arma mablag‘larining viloyatlar kesimida taqsimlanishi. Xarita ranglari kambag‘allik darajasiga qarab belgilanadi.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
                {/* Левая колонка: карта */}
                <Box>
                    <Box position="relative" display="flex" justifyContent="center">
                        <svg viewBox={Uzbekistan.viewBox} width="100%" style={{ cursor: "pointer" }}>
                            {Uzbekistan.locations.map((loc: any) => {
                                const regionKey = getRegionKey(loc.name);
                                const hasData = !!regionKey && povertyRates[regionKey] !== undefined;
                                let fillColor = "#CBD5E0";
                                if (hasData) {
                                    fillColor = getPovertyColor(povertyRates[regionKey], minPoverty, maxPoverty);
                                }
                                return (
                                    <path
                                        key={loc.id}
                                        d={loc.path}
                                        onMouseEnter={(e) => {
                                            if (!hasData) return;
                                            setTooltip({
                                                visible: true,
                                                x: e.clientX,
                                                y: e.clientY,
                                                data: { ...loc, regionKey },
                                            });
                                        }}
                                        onMouseMove={(e) =>
                                            setTooltip((prev: any) => ({ ...prev, x: e.clientX, y: e.clientY }))
                                        }
                                        onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}
                                        onClick={() => regionKey && handleRegionClick(regionKey)}
                                        style={{
                                            fill: fillColor,
                                            stroke: "#2c3e50",
                                            strokeWidth: 1,
                                            cursor: hasData ? "pointer" : "default",
                                            transition: "0.2s",
                                        }}
                                    />
                                );
                            })}
                        </svg>
                    </Box>
                    <Flex justify="center" gap={4} mt={3}>
                        <Flex align="center" gap={1}>
                            <Box w="20px" h="12px" bg="#48BB78" borderRadius="sm" />
                            <Text fontSize="xs">Kam kambag‘allik</Text>
                        </Flex>
                        <Flex align="center" gap={1}>
                            <Box w="20px" h="12px" bg="#ECC94B" borderRadius="sm" />
                            <Text fontSize="xs">O‘rtacha</Text>
                        </Flex>
                        <Flex align="center" gap={1}>
                            <Box w="20px" h="12px" bg="#F56565" borderRadius="sm" />
                            <Text fontSize="xs">Yuqori kambag‘allik</Text>
                        </Flex>
                    </Flex>

                    {tooltip.visible && tooltip.data && tooltip.data.regionKey && (
                        <Box
                            position="fixed"
                            top={tooltip.y + 12}
                            left={tooltip.x + 12}
                            bg="gray.800"
                            color="white"
                            px={4}
                            py={2}
                            borderRadius="md"
                            pointerEvents="none"
                            zIndex={1000}
                            maxW="260px"
                            fontSize="sm"
                        >
                            <Text fontWeight="bold">{tooltip.data.name}</Text>
                            <Text mt={1}>{regionData[tooltip.data.regionKey]?.description || "Ta'rif mavjud emas"}</Text>
                            <Text fontWeight="bold" color="#90CDF4" mt={1}>
                                Ajratilgan mablag‘: {regionData[tooltip.data.regionKey]?.value || 0} mlrd so‘m
                            </Text>
                            <Text color="yellow.200" mt={1}>
                                Kambag‘allik darajasi: {povertyRates[tooltip.data.regionKey]}%
                            </Text>
                        </Box>
                    )}
                </Box>

                {/* Правая колонка: график */}
                <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
                    <Heading as="h2" size="sm" mb={3} color="gray.700">
                        Viloyatlar kesimida taqsimot (mlrd so‘m)
                    </Heading>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 10, right: 20, left: 70, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                            <RechartsTooltip
                                formatter={(value: number) => [`${value} mlrd so‘m`, "Mablag‘"]}
                                labelFormatter={(label) => {
                                    const item = chartData.find((d) => d.name === label);
                                    return `${label} – ${item?.description || ""}`;
                                }}
                                contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid #e2e8f0" }}
                            />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </SimpleGrid>

            <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
                * Qashqadaryo viloyatini bossangiz, batafsil tumanlar kesimiga o‘tasiz.<br />
                ** Xarita ranglari kambag‘allik darajasiga ko‘ra: yashil – kam, sariq – o‘rtacha, qizil – yuqori.
            </Text>
        </Box>
    );
};

export default PovertyReductionFundDetail;