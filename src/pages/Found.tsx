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

const Found = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();

  const totalBudget = 1.2; // trln so‘m

  const fundItems = [
    {
      id: 1,
      title: "Davlat va maqsadli jamg‘armalar",
      subtitle: "Umumiy budjet",
      amount: 1.2,
      unit: "trln so‘m",
      description:
        "Davlat budjeti va maqsadli jamg‘armalarning umumiy hajmi",
    },
    {
      id: 2,
      title: "Aholini daromadli mehnat bilan ta'minlash",
      subtitle: "Maqsadli jamg‘armalar hisobidan",
      amount: 1.0,
      unit: "trln so‘m",
      description:
        "Maqsadli jamg‘armalar hisobidan aholini daromadli mehnat bilan ta'minlash uchun",
    },
    {
      id: 3,
      title: "Nogironligi bo‘lgan oilalar uy-joyini 'yashil' ta'mirlash",
      subtitle: "Saxovat, Yoshlar, Ayollar jamg‘armalari",
      amount: 0.2,
      unit: "trln so‘m (200 mlrd)",
      description:
        "Ijtimoiy reyestrdagi I guruh nogironligi bo‘lgan oilalar uy-joyini 'yashil' ta'mirlash uchun",
    },
  ];

  const chartData = fundItems.map((item) => ({
    name: item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title,
    fullName: item.title,
    value: item.amount,
  }));

  const barColors = [brand600, "#3182CE", "#DD6B20"];

  const handleDetailClick = (itemId: number) => {
    if (itemId === 1) {
      navigate("/fund-detail");
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="start" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
          Davlat va maqsadli jamg‘armalar
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

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={12}>
        {fundItems.map((item) => {
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
          Jamg‘arma mablag‘larining yo‘nalishlar bo‘yicha taqsimoti
        </Text>
        <Text fontSize="sm" color="gray.600" mb={6}>
          (trln so‘mda)
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
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Text fontSize="sm" color="gray.600" textAlign="left" mt={4}>
          Eslatma: 200 mlrd so‘m (0,2 trln) yashil ta'mirlashga, 1 trln so‘m esa bandlik dasturlariga yo‘naltirilgan.
        </Text>
      </Box>
    </Box>
  );
};

export default Found;