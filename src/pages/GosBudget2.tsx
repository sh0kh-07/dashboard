import React from "react";
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
  Flex,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  MapPin,
  Home,
  Briefcase,
  Heart,
  Flag,
  Shield,
  PlusCircle,
} from "lucide-react";

const BudgetPage2 = () => {
  // 7 карточек – единый источник данных
  const cardsData = [
    {
      id: 1,
      title: "Og‘ir toifadagi tumanlar",
      value: 2.7,
      unit: "trln so‘m",
      icon: MapPin,
      description: "Qashshoqlik darajasi yuqori tumanlar",
      forChart: true,
    },
    {
      id: 2,
      title: "Og‘ir toifadagi mahallalar",
      value: 1.7,
      unit: "trln so‘m",
      icon: Home,
      description: "Ijtimoiy-iqtisodiy rivojlanishi sust mahallalar",
      forChart: true,
    },
    {
      id: 3,
      title: "Ko‘rsatilgan xizmatlar uchun",
      value: 5.0,
      unit: "trln so‘m",
      icon: Briefcase,
      description: "Aholiga ko‘rsatilgan ijtimoiy xizmatlar",
      forChart: true,
    },
    {
      id: 4,
      title: "Sog‘liqni saqlash uchun",
      value: 8.5,
      unit: "trln so‘m",
      icon: Heart,
      description: "Tibbiy xizmatlar va dori-darmonlar",
      forChart: true,
    },
    {
      id: 5,
      title: "Red Flag (qizil bayroq)",
      value: 12,
      unit: "",
      icon: Flag,
      description: "Diqqat talab qiladigan hududlar soni",
      forChart: false, // не включаем в график, т.к. единица измерения не trln
    },
    {
      id: 6,
      title: "Kambag‘allik va ishsizlikdan xoli hudud",
      value: 2.0,
      unit: "trln so‘m",
      icon: Shield,
      description: "Barqaror rivojlangan hududlar",
      forChart: true,
    },
    {
      id: 7,
      title: "Qo‘shimcha mablag‘",
      value: 1.8,
      unit: "trln so‘m",
      icon: PlusCircle,
      description: "Zaruratga ko‘ra ajratilgan qo‘shimcha mablag‘",
      forChart: true,
    },
  ];

  // Формируем данные для графика только из карточек, у которых forChart = true
  const chartData = cardsData
    .filter((card) => card.forChart)
    .map((card) => ({
      name: card.title.length > 18 ? card.title.substring(0, 18) + "..." : card.title,
      fullName: card.title,
      value: card.value,
    }));

  // Нейтральные цвета для графика (серые оттенки)
  const barColors = ["#718096", "#A0AEC0", "#CBD5E0", "#4A5568", "#2D3748", "#718096"];

  return (
    <Box>
      <Flex alignItems="start" justifyContent="space-between" mb={4}>
        <Heading as="h1" size="lg" fontWeight="bold" color="gray.800">
          Ijtimoiy-iqtisodiy ko‘rsatkichlar
        </Heading>
        <Box textAlign="right">
          <Text fontSize="xs" fontWeight="medium" color="gray.600">
            Jami mablag‘lar
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color="gray.700">
            26.8 trln so‘m
          </Text>
        </Box>
      </Flex>

      {/* 7 карточек – компактно, 3–4 колонки */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={2} mb={6}>
        {cardsData.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              variant="outline"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              transition="0.2s"
              bg="white"
              _hover={{ boxShadow: "sm", transform: "translateY(-1px)" }}
            >
              <CardBody py={3} px={4}>
                <Stat>
                  <Flex align="center" gap={2} mb={1}>
                    <Icon size={16} color="gray.500" />
                    <StatLabel fontSize="sm" fontWeight="bold" color="gray.700">
                      {card.title}
                    </StatLabel>
                  </Flex>
                  <StatNumber fontSize="xl" fontWeight="bold" color="gray.800">
                    {card.value.toLocaleString()} {card.unit}
                  </StatNumber>
                  <StatHelpText fontSize="xs" color="gray.500" mt={1}>
                    {card.description}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* График – данные из тех же карточек (только trln so‘m) */}
      <Box mt={4}>
        <Text fontSize="md" fontWeight="bold" mb={1} color="gray.800">
          Mablag‘larning yo‘nalishlar bo‘yicha taqsimoti
        </Text>
        <Text fontSize="xs" color="gray.600" mb={2}>
          (trln so‘mda)
        </Text>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 10, fill: "#4a5568" }}
            />
            <YAxis
              label={{ value: "trln so‘m", angle: -90, position: "insideLeft", fontSize: 10, fill: "#4a5568" }}
              tick={{ fontSize: 10, fill: "#4a5568" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} trln so‘m`, "Miqdori"]}
              labelFormatter={(label) => {
                const original = chartData.find((d) => d.name === label);
                return original ? original.fullName : label;
              }}
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default BudgetPage2;