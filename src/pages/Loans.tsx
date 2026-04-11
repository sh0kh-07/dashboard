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

  const totalLoans = 140; // trln so‘m
  const supportAmount = 0.14; // trln so‘m (140 mlrd)

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

  const barColors = ["#3182CE", brand600];

  const handleDetailClick = (itemId: number) => {
    if (itemId === 1) {
      navigate("/loans-detail");
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="start" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
          Tijorat bank kreditlari
        </Heading>
        <Box textAlign="right">
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            Jami kreditlar hajmi
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color={brand600}>
            {totalLoans} trln so‘m
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={12}>
        {loanItems.map((item) => {
          const isClickable = item.id === 1;
          return (
            <Card
              key={item.id}
              variant="outline"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              transition="0.2s"
              bg="white"
              cursor={isClickable ? "pointer" : "default"}
              _hover={
                isClickable
                  ? { boxShadow: "lg", transform: "translateY(-4px)", borderColor: brand600 }
                  : {}
              }
              onClick={() => handleDetailClick(item.id)}
              position="relative"
            >
              <CardBody>
                <Stat>
                  <StatLabel fontSize="lg" fontWeight="bold" color="gray.800">
                    {item.title}
                  </StatLabel>
                  <StatHelpText fontSize="sm" color="gray.600" mb={2}>
                    {item.subtitle}
                  </StatHelpText>
                  <StatNumber fontSize="2xl" fontWeight="black" color={brand600} mt={2}>
                    {item.amount} {item.unit}
                  </StatNumber>
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
          Kreditlarning taqsimoti (trln so‘mda)
        </Text>
        <Text fontSize="sm" color="gray.600" mb={6}>
          MSBni qo‘llab-quvvatlash ulushi atigi 0,1% ni tashkil qiladi
        </Text>
        <ResponsiveContainer width="100%" height={500}>
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
              tick={{ fontSize: 12, fill: "#4a5568" }}
            />
            <YAxis
              label={{ value: "trln so‘m", angle: -90, position: "insideLeft", fill: "#4a5568" }}
              tick={{ fill: "#4a5568" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} trln so‘m`, "Miqdori"]}
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
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Text fontSize="sm" color="gray.600" textAlign="left" mt={4}>
          Eslatma: Jami kreditlar hajmi 140 trln so‘m, shundan faqat 140 mlrd so‘m (0,14 trln)
          kichik va o‘rta biznesni qo‘llab-quvvatlashga yo‘naltirilgan. Qolgan 139,86 trln so‘m
          boshqa yo‘nalishlarga berilgan kreditlardir.
        </Text>
      </Box>
    </Box>
  );
};

export default Loans;