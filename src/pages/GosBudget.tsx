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
  useToken,
  Flex,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
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

const BudgetPage = () => {
  const navigate = useNavigate();
  const [brand600] = useToken("colors", ["brand.600"]);

  const totalBudget = 26.8;

  const budgetItems = [
    {
      id: 1,
      title: "Mahallalar infratuzilmasini rivojlantirish loyihalari",
      subtitle: "Respublika budjeti mablag‘lari",
      amount: 20.0,
      unit: "trln so‘m",
      description:
        "Mahallalar infratuzilmasini rivojlantirishga qaratilgan loyihalarni amalga oshirish",
    },
    {
      id: 2,
      title: "Og‘ir tuman va mahallalarda tadbirkorlik infratuzilmasini yaratish",
      subtitle: "Qo‘shimcha budjet mablag‘lari",
      amount: 3.7,
      unit: "trln so‘m",
      description:
        "37 ta 'og‘ir' tuman va 903 ta 'og‘ir' mahallalarda tadbirkorlik infratuzilmasini yaratish",
    },
    {
      id: 3,
      title: "Mahallalar infratuzilmasini yaxshilash",
      subtitle: "Tadbirkorlik uchun shart-sharoitlar",
      amount: 1.8,
      unit: "trln so‘m",
      description:
        "Mahallalar infratuzilmasini yaxshilash orqali tadbirkorlik faoliyati uchun shart-sharoitlarni yaratish",
    },
    {
      id: 4,
      title: "Eng yaxshi natija ko‘rsatgan 100 ta 'og‘ir' mahallaga qo‘shimcha",
      subtitle: "Rag‘batlantirish fondi",
      amount: 0.1,
      unit: "trln so‘m (100 mlrd)",
      description:
        "Aholi daromadini oshirish va qambag‘allikni qisqartirish bo‘yicha eng yaxshi natija ko‘rsatgan 100 ta 'og‘ir' mahallaga qo‘shimcha 1 mlrd so‘mdan",
    },
    {
      id: 5,
      title: "Talabalar loyihalari uchun grantlar",
      subtitle: "Master reja ishlab chiqish",
      amount: 0.0001,
      unit: "trln so‘m (100 mln)",
      description:
        "Oliy ta'lim muassasalari talabalariga tanlov asosida 'og‘ir' mahallalar 'master rejasi'ni ishlab chiqish bo‘yicha eng yaxshi loyihalar uchun",
    },
    {
      id: 6,
      title: "Kredit foiz stavkasining bir qismiga kompensatsiya",
      subtitle: "Tadbirkorlikni rivojlantirish kompaniyasi",
      amount: 1.2,
      unit: "trln so‘m",
      description:
        "Kredit foiz stavkasining bir qismiga kompensatsiya taqdim etish uchun 'Tadbirkorlikni rivojlantirish kompaniyasi'ga",
    },
  ];

  const chartData = budgetItems.map((item) => ({
    name: item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title,
    fullName: item.title,
    value: item.amount,
  }));

  const barColors = [
    brand600,
    "#3182CE",
    "#DD6B20",
    "#38A169",
    "#D53F8C",
    "#805AD5",
  ];

  const handleCardClick = (id: number) => {
    if (id === 1) {
      navigate("/budget-detail");
    }
  };

  return (
    <Box>
      <Flex alignItems="start" justifyContent="space-between" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold">
          Davlat budjeti
        </Heading>
        <Box>
          <Text fontSize="lg" fontWeight="medium" color="gray.400">
            Umumiy budjet hajmi
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
            {totalBudget} trln so‘m
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={12}>
        {budgetItems.map((item) => {
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
                  ? {
                    boxShadow: "lg",
                    transform: "translateY(-4px)",
                    borderColor: brand600,
                  }
                  : {}
              }
              onClick={() => handleCardClick(item.id)}
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
                <Flex justify="flex-end" mt={3}>
                  {isClickable ? (
                    <IconButton
                      aria-label="Batafsil"
                      icon={<ArrowRight size={18} />}
                      size="sm"
                      variant="ghost"
                      color={brand600}
                      _hover={{ bg: "rgba(0,0,0,0.2)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item.id);
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
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>

      <Box mt={10}>
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Budjet mablag‘larining yo‘nalishlar bo‘yicha taqsimoti
        </Text>
        <Text fontSize="sm" color="gray.500" mb={6}>
          (trln so‘mda)
        </Text>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={100}
              tick={{ fontSize: 12, fill: "#cbd5e0" }}
            />
            <YAxis
              label={{ value: "trln so‘m", angle: -90, position: "insideLeft", fill: "#cbd5e0" }}
              tick={{ fill: "#cbd5e0" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} trln so‘m`, "Miqdori"]}
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
          Eslatma: 4- va 5-yo‘nalishlar kichik summasi tufayli grafikda deyarli ko‘rinmaydi,
          ammo ular muhim ijtimoiy ahamiyatga ega.
        </Text>
      </Box>
    </Box>
  );
};

export default BudgetPage;