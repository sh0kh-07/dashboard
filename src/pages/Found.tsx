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
import { ArrowRight, Lock, Flag, TrendingDown, Heart, Leaf, AlertTriangle } from "lucide-react";

const Found = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();

  const totalBudget = 1.2; // trln so‘m

  // Yangi kartochkalar ro‘yxati
  const fundItems = [
    {
      id: 1,
      title: "Kambag‘allikni qisqartirish davlat maqsadli jamg‘armasi",
      subtitle: "Ijtimoiy qo‘llab-quvvatlash",
      amount: 0.5,
      unit: "trln so‘m",
      description: "Aholi daromadlarini oshirish va kambag‘allikni kamaytirish dasturlari",
      icon: TrendingDown,
      color: "#3182CE",
      isClickable: true,
    },
    {
      id: 2,
      title: "Ijtimoiy himoya davlat jamg‘armasi",
      subtitle: "Nogironlar, keksalar, kam ta'minlangan oilalar",
      amount: 0.3,
      unit: "trln so‘m",
      description: "Ijtimoiy reyestrdagi fuqarolarga nafaqa va moddiy yordam",
      icon: Heart,
      color: "#D53F8C",
      isClickable: false,
    },
    {
      id: 3,
      title: "Dehqon xo‘jaliklari va tomorqa va yer egalari faoliyatini qo‘llab-quvvatlash jamg‘armasi",
      subtitle: "Qishloq xo‘jaligini rivojlantirish",
      amount: 0.2,
      unit: "trln so‘m",
      description: "Subsidiyalar, arzon kreditlar, texnika yetkazib berish",
      icon: Leaf,
      color: "#38A169",
      isClickable: false,
    },
    {
      id: 4,
      title: "Red Flag",
      subtitle: "Tizimli muammolar",
      amount: null,
      unit: "",
      description: "Mablag‘larni o‘zlashtirishda kamchiliklar, shaffoflik muammolari",
      icon: Flag,
      color: "#F56565",
      isClickable: false,
      isRedFlag: true,
    },
    {
      id: 5,
      title: "Boshqa jamg‘armalar",
      subtitle: "Qolgan maqsadli fondlar",
      amount: 0.2,
      unit: "trln so‘m",
      description: "Madaniyat, sport, yoshlar va boshqa ijtimoiy loyihalar",
      icon: AlertTriangle,
      color: "#805AD5",
      isClickable: false,
    },
  ];

  // Grafik uchun ma'lumotlar (Red Flag hisobga olinmaydi)
  const chartData = fundItems
    .filter((item) => item.amount !== null)
    .map((item) => ({
      name: item.title.length > 22 ? item.title.substring(0, 20) + "..." : item.title,
      fullName: item.title,
      value: item.amount,
    }));

  const barColors = ["#3182CE", "#D53F8C", "#38A169", "#805AD5"];

  const handleDetailClick = (itemId: number) => {
    if (itemId === 1) {
      navigate("/fund-detail");
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="start" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
          Davlat maqsadli jamg‘armalari
        </Heading>
        <Box textAlign="right">
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            Umumiy budjet hajmi
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
            {totalBudget} trln so‘m
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2} mb={12}>
        {fundItems.map((item) => {
          const Icon = item.icon;
          const isClickable = item.isClickable;
          const isRedFlag = item.isRedFlag;

          return (
            <Card
              key={item.id}
              variant="outline"
              border="1px solid"
              borderColor={isRedFlag ? "red.200" : "gray.200"}
              borderRadius="xl"
              transition="0.2s"
              bg="white"
              cursor={isClickable ? "pointer" : "default"}
              _hover={
                isClickable
                  ? { boxShadow: "lg", transform: "translateY(-4px)", borderColor: brand600 }
                  : isRedFlag
                    ? { boxShadow: "lg", borderColor: "red.400" }
                    : {}
              }
              onClick={() => handleDetailClick(item.id)}
              position="relative"
            >
              <CardBody>
                <Stat>
                  <Flex align="center" gap={2} mb={2}>
                    <Icon size={20} color={item.color} />
                    <StatLabel fontSize="lg" fontWeight="bold" color="gray.800">
                      {item.title}
                    </StatLabel>
                  </Flex>
                  <StatHelpText fontSize="sm" color="gray.600" mb={2}>
                    {item.subtitle}
                  </StatHelpText>

                  {isRedFlag ? (
                    <Badge colorScheme="red" fontSize="md" px={3} py={1} borderRadius="full" mb={2}>
                        20
                    </Badge>
                  ) : (
                    <StatNumber fontSize="2xl" fontWeight="black" color={item.color} mt={2}>
                      {item.amount} {item.unit}
                    </StatNumber>
                  )}
                  <StatHelpText fontSize="xs" color="gray.600" mt={2}>
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
                    _hover={{ bg: "gray.100", color: brand600 }}
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
                    color="gray.600"
                    isDisabled
                    _hover={{}}
                  />
                )}
              </Flex>
            </Card>
          );
        })}
      </SimpleGrid>

      <Box mt={10}>
        <Text fontSize="2xl" fontWeight="bold" mb={2} color="gray.800">
          Jamg‘arma mablag‘larining yo‘nalishlar bo‘yicha taqsimoti
        </Text>
        <Text fontSize="sm" color="gray.600" mb={6}>
          (trln so‘mda)
        </Text>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fontSize: 11, fill: "#4a5568" }}
            />
            <YAxis
              label={{ value: "trln so‘m", angle: -90, position: "insideLeft", fill: "#4a5568" }}
              tick={{ fill: "#4a5568" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} trln so‘m`, "Miqdori"]}
              labelFormatter={(label) => {
                const original = chartData.find((d) => d.name === label);
                return original ? original.fullName : label;
              }}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                color: "#1a202c",
              }}
              itemStyle={{ color: "#1a202c" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
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

export default Found;