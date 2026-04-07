import React, { useState } from "react";
import {
    Box,
    Text,
    Heading,
    useToken,
    Flex,
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

const BudgetDetailPage = () => {
    const navigate = useNavigate();
    const [brand600] = useToken("colors", ["brand.600"]);

    const [tooltip, setTooltip] = useState<any>({
        visible: false,
        x: 0,
        y: 0,
        data: null,
    }); 

    // --- Расширенный маппинг названий SVG -> ключи regionData ---
    const nameMap: Record<string, string> = {
        // Узбекские названия (без суффиксов)
        "Toshkent": "Tashkent",
        "Samarqand": "Samarkand",
        "Buxoro": "Bukhara",
        "Qashqadaryo": "Kashkadarya",
        "Farg‘ona": "Fergana",
        "Andijon": "Andijan",
        "Namangan": "Namangan",
        "Surxondaryo": "Surkhandarya",
        "Jizzax": "Jizzakh",
        "Sirdaryo": "Sirdarya",
        "Navoiy": "Navoi",
        "Xorazm": "Khorezm",
        "Qoraqalpog‘iston": "Karakalpakstan",
        // С суффиксами
        "Toshkent viloyati": "Tashkent",
        "Samarqand viloyati": "Samarkand",
        "Buxoro viloyati": "Bukhara",
        "Qashqadaryo viloyati": "Kashkadarya",
        "Farg‘ona viloyati": "Fergana",
        "Andijon viloyati": "Andijan",
        "Namangan viloyati": "Namangan",
        "Surxondaryo viloyati": "Surkhandarya",
        "Jizzax viloyati": "Jizzakh",
        "Sirdaryo viloyati": "Sirdarya",
        "Navoiy viloyati": "Navoi",
        "Xorazm viloyati": "Khorezm",
        "Qoraqalpog‘iston Respublikasi": "Karakalpakstan",
        // Английские названия (если вдруг)
        "Tashkent": "Tashkent",
        "Samarkand": "Samarkand",
        "Bukhara": "Bukhara",
        "Kashkadarya": "Kashkadarya",
        "Fergana": "Fergana",
        "Andijan": "Andijan",
        "Namangan": "Namangan",
        "Surkhandarya": "Surkhandarya",
        "Jizzakh": "Jizzakh",
        "Sirdarya": "Sirdarya",
        "Navoi": "Navoi",
        "Khorezm": "Khorezm",
        "Karakalpakstan": "Karakalpakstan",
    };

    // Веса регионов
    const weights: Record<string, number> = {
        Tashkent: 1.5,
        Samarkand: 1.2,
        Bukhara: 1.0,
        Kashkadarya: 2.5,
        Fergana: 1.2,
        Andijan: 1.0,
        Namangan: 1.0,
        Surkhandarya: 0.9,
        Jizzakh: 0.8,
        Sirdarya: 0.7,
        Navoi: 1.1,
        Khorezm: 0.9,
        Karakalpakstan: 1.0,
    };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0); // 14.8
    const totalBudgetMlrd = 26800; // 26.8 трлн сум в млрд сум

    // Вычисляем сумму для каждого региона
    const regionData: Record<string, { description: string; value: number }> = {
        Tashkent: { description: "Poytaxt va iqtisodiy markaz", value: +(totalBudgetMlrd * weights.Tashkent / totalWeight).toFixed(1) },
        Samarkand: { description: "Tarixiy markaz", value: +(totalBudgetMlrd * weights.Samarkand / totalWeight).toFixed(1) },
        Bukhara: { description: "Qadimiy madaniyat markazi", value: +(totalBudgetMlrd * weights.Bukhara / totalWeight).toFixed(1) },
        Kashkadarya: { description: "Sanoat faolligi", value: +(totalBudgetMlrd * weights.Kashkadarya / totalWeight).toFixed(1) },
        Fergana: { description: "Farg'ona vodiysi", value: +(totalBudgetMlrd * weights.Fergana / totalWeight).toFixed(1) },
        Andijan: { description: "Sanoat hududi", value: +(totalBudgetMlrd * weights.Andijan / totalWeight).toFixed(1) },
        Namangan: { description: "Madaniy hudud", value: +(totalBudgetMlrd * weights.Namangan / totalWeight).toFixed(1) },
        Surkhandarya: { description: "Janubiy hudud", value: +(totalBudgetMlrd * weights.Surkhandarya / totalWeight).toFixed(1) },
        Jizzakh: { description: "Markaziy hudud", value: +(totalBudgetMlrd * weights.Jizzakh / totalWeight).toFixed(1) },
        Sirdarya: { description: "Markaziy vodiy", value: +(totalBudgetMlrd * weights.Sirdarya / totalWeight).toFixed(1) },
        Navoi: { description: "Sanoat markazi", value: +(totalBudgetMlrd * weights.Navoi / totalWeight).toFixed(1) },
        Khorezm: { description: "Shimoliy hudud", value: +(totalBudgetMlrd * weights.Khorezm / totalWeight).toFixed(1) },
        Karakalpakstan: { description: "Qoraqalpog'iston Respublikasi", value: +(totalBudgetMlrd * weights.Karakalpakstan / totalWeight).toFixed(1) },
    };

    // Преобразуем для графика и сортируем
    const chartData = Object.entries(regionData)
        .map(([name, data]) => ({ name, value: data.value, description: data.description }))
        .sort((a, b) => b.value - a.value);

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
        "#6B46C1",
        "#E53E3E",
        "#319795",
        "#D69E2E",
    ];

    const handleRegionClick = (locId: string) => {
        if (locId === "qashqadaryo") {
            navigate("/budget-detail/kashkadarya");
        }
    };

    // Нормализация названия: удаляем "viloyati", "shahri", "Respublikasi" и лишние пробелы
    const normalizeName = (name: string): string => {
        let normalized = name
            .replace(/ viloyati$/i, '')
            .replace(/ shahri$/i, '')
            .replace(/ Respublikasi$/i, '')
            .trim();
        // Замена апострофов
        normalized = normalized.replace(/‘/g, "'");
        return normalized;
    };

    const getRegionKey = (svgName: string): string | null => {
        // Сначала ищем прямое совпадение в маппинге
        if (nameMap[svgName]) return nameMap[svgName];
        // Пробуем нормализованное имя
        const normalized = normalizeName(svgName);
        if (nameMap[normalized]) return nameMap[normalized];
        // Если ничего не найдено, пробуем искать в regionData по нормализованному имени
        if (regionData[normalized]) return normalized;
        // Иначе возвращаем null
        console.warn(`Region not mapped: "${svgName}" (normalized: "${normalized}")`);
        return null;
    };

    return (
        <Box>
            <Flex alignItems="start" justifyContent="space-between" mb={8}>
                <Heading as="h1" size="xl" fontWeight="bold">
                    Davlat budjeti (Mahallalar infratuzilmasini rivojlantirish)
                </Heading>
                <Box>
                    <Text fontSize="lg" fontWeight="medium" color="gray.400">
                        Respublika budjeti mablag‘lari
                    </Text>
                    <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
                        26.8 trln so‘m
                    </Text>
                </Box>
            </Flex>

            <Text fontSize="md" color="gray.300" mb={8}>
                Mahallalar infratuzilmasini rivojlantirishga qaratilgan loyihalarni amalga oshirish.
                Quyidagi xaritada har bir viloyat bo‘yicha ajratilgan mablag‘lar va tavsiflarni ko‘rishingiz mumkin.
            </Text>

            {/* Карта */}
            <Box position="relative" display="flex" justifyContent="center" mb={12}>
                <svg viewBox={Uzbekistan.viewBox} width="70%">
                    {Uzbekistan.locations.map((loc: any) => {
                        const regionKey = getRegionKey(loc.name);
                        const hasData = !!regionKey;
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
                                    setTooltip((prev: any) => ({
                                        ...prev,
                                        x: e.clientX,
                                        y: e.clientY,
                                    }))
                                }
                                onMouseLeave={() =>
                                    setTooltip({ visible: false, x: 0, y: 0, data: null })
                                }
                                onClick={() => handleRegionClick(loc.id)}
                                style={{
                                    fill: tooltip.data?.id === loc.id ? "#ffffff" : brand600,
                                    stroke: "#000000",
                                    strokeWidth: 1,
                                    cursor: hasData ? "pointer" : "default",
                                    transition: "0.2s",
                                }}
                            />
                        );
                    })}
                </svg>

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
                    >
                        <Text fontWeight="bold">{tooltip.data.name}</Text>
                        <Text fontSize="sm" mt={1}>
                            {regionData[tooltip.data.regionKey]?.description || "Ta'rif mavjud emas"}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={brand600} mt={1}>
                            Ajratilgan mablag‘: {regionData[tooltip.data.regionKey]?.value || 0} mlrd so‘m
                        </Text>
                    </Box>
                )}
            </Box>

            {/* График */}
            <Box mt={8}>
                <Heading as="h2" size="lg" mb={4}>
                    Viloyatlar kesimida taqsimot (mlrd so‘m)
                </Heading>
                <Text fontSize="sm" color="gray.400" mb={6}>
                    Loyihalar doirasida ajratilgan mablag‘lar viloyatlarning ehtiyojiga qarab taqsimlanadi.
                    Quyidagi diagrammada eng ko‘p mablag‘ oladigan hududlar keltirilgan.
                </Text>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                        <XAxis
                            type="number"
                            label={{ value: "mlrd so‘m", position: "insideBottom", offset: -5, fill: "#cbd5e0" }}
                            tick={{ fill: "#cbd5e0" }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "#cbd5e0" }}
                            width={100}
                        />
                        <RechartsTooltip
                            formatter={(value: number) => [`${value} mlrd so‘m`, "Ajratilgan mablag‘"]}
                            labelFormatter={(label) => {
                                const item = chartData.find((d) => d.name === label);
                                return `${label} - ${item?.description || ""}`;
                            }}
                            contentStyle={{
                                backgroundColor: "#1a202c",
                                borderRadius: "8px",
                                border: "none",
                                color: "white",
                            }}
                            itemStyle={{ color: "white" }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <Text fontSize="xs" color="gray.500" mt={4}>
                    *Eslatma: Raqamlar Davlat budjetining 26.8 trln so‘mlik qismining viloyatlar bo‘yicha taqsimoti.
                    Eng ko‘p mablag‘ Qashqadaryo, Toshkent va Samarqand viloyatlariga yo‘naltirilmoqda.
                </Text>
            </Box>
        </Box>
    );
};

export default BudgetDetailPage;