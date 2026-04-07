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

const Loans = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();

  // Общая сумма кредитов
  const totalLoans = 140; // трлн сум

  // Сумма поддержки МСБ
  const supportAmount = 0.14; // трлн сум (140 млрд)

  // Данные для карточек
  const loanItems = [
    {
      id: 1,
      title: "Jami tijorat bank kreditlari",
      subtitle: "Barcha kreditlar hajmi",
      amount: totalLoans,
      unit: "trln so‘m",
      description: "Tijorat banklari tomonidan berilgan jami kreditlar",
    },
    {
      id: 2,
      title: "Kichik va o‘rta biznes subyektlarini moliyaviy qo‘llab-quvvatlash",
      subtitle: "Maqsadli kreditlar",
      amount: supportAmount,
      unit: "trln so‘m (140 mlrd)",
      description:
        "Kichik va o‘rta biznes subyektlarini moliyaviy qo‘llab-quvvatlash uchun ajratilgan mablag‘",
    },
  ];

  // Данные для графика: показываем долю поддержки МСБ на фоне всех кредитов
  const chartData = [
    {
      name: "Boshqa kreditlar",
      fullName: "Boshqa kreditlar (MСБdan tashqari)",
      value: totalLoans - supportAmount,
    },
    {
      name: "MСБni qo‘llab-quvvatlash",
      fullName: "Kichik va o‘rta biznesni qo‘llab-quvvatlash",
      value: supportAmount,
    },
  ];

  // Цвета для столбцов
  const barColors = ["#3182CE", brand600];

  const handleDetailClick = (itemId: number) => {
    if (itemId === 1) {
      navigate("/loans-detail"); // замените на нужный путь
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="start" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold">
          Tijorat bank kreditlari
        </Heading>
        <Box textAlign="right">
          <Text fontSize="lg" fontWeight="medium" color="gray.400">
            Jami kreditlar hajmi
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
            {totalLoans} trln so‘m
          </Text>
        </Box>
      </Flex>

      {/* Карточки направлений */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={12}>
        {loanItems.map((item) => {
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
                  <StatLabel fontSize="lg" fontWeight="bold" color="white">
                    {item.title}
                  </StatLabel>
                  <StatHelpText fontSize="sm" color="gray.400" mb={2}>
                    {item.subtitle}
                  </StatHelpText>
                  <StatNumber fontSize="2xl" fontWeight="black" color={brand600} mt={2}>
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

      {/* График распределения */}
      <Box mt={10}>
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Kreditlarning taqsimoti (trln so‘mda)
        </Text>
        <Text fontSize="sm" color="gray.500" mb={6}>
          MSBni qo‘llab-quvvatlash ulushi atigi 0,1% ni tashkil qiladi
        </Text>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fontSize: 12, fill: "#cbd5e0" }}
            />
            <YAxis
              label={{ value: "trln so‘m", angle: -90, position: "insideLeft", fill: "#cbd5e0" }}
              tick={{ fill: "#cbd5e0" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} trln so‘m`, "Miqdori"]}
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
          Eslatma: Jami kreditlar hajmi 140 trln so‘m, shundan faqat 140 mlrd so‘m (0,14 trln)
          kichik va o‘rta biznesni qo‘llab-quvvatlashga yo‘naltirilgan. Qolgan 139,86 trln so‘m
          boshqa yo‘nalishlarga berilgan kreditlardir.
        </Text>
      </Box>
    </Box>
  );
};

export default Loans;