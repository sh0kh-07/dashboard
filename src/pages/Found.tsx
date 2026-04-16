import React, { useState } from "react";
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
  Container,
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
import {
  ArrowRight,
  Lock,
  Flag,
  TrendingDown,
  Heart,
  Leaf,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";

const Found = () => {
  const [brand600] = useToken("colors", ["brand.600"]);
  const navigate = useNavigate();

  // Holat: asosiy ekran yoki yo‘nalishlar ro‘yxati
  const [showDirections, setShowDirections] = useState(false);

  const totalBudget = 1.2; // trln so‘m

  // Asosiy jamg‘arma kartochkalari
  const fundItems = [
    {
      id: 1,
      title: "Qashshoqlikni qisqartirish davlat maqsadli jamg‘armasi",
      subtitle: "Ijtimoiy qo‘llab-quvvatlash",
      amount: 0.5,
      unit: "trln so‘m",
      description: "Aholi daromadlarini oshirish va qashshoqlikni kamaytirish dasturlari",
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
      title: "Dehqon xo‘jaliklari, tomorqa va yer egalari faoliyatini qo‘llab-quvvatlash jamg‘armasi",
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
      title: "Qizil bayroq (Red Flag)",
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

  // Grafik uchun ma'lumotlar
  const chartData = fundItems
    .filter((item) => item.amount !== null)
    .map((item) => ({
      name: item.title.length > 22 ? item.title.substring(0, 20) + "..." : item.title,
      fullName: item.title,
      value: item.amount,
    }));

  const barColors = ["#3182CE", "#D53F8C", "#38A169", "#805AD5"];

  // Barcha subsidiya yo‘nalishlari
  const subsidyDirections = [
    {
      id: 1,
      title: "Tomorqa yer egalariga yengil konstruksiyali issiqxonalar o‘rnatish uchun",
      description: "Yengil issiqxonalar o‘rnatish uchun subsidiya",
      amount: "so‘rov bo‘yicha",
      available: true, // faqat shu yo‘nalish faol
    },
    {
      id: 2,
      title: "Urug‘liklar va ko‘chatlar sotib olish uchun",
      description: "Urug‘ va ko‘chatlar xaridi",
      amount: "so‘rov bo‘yicha",
      available: false,
    },
    {
      id: 3,
      title: "Tomorqa yer egalariga sug‘orish vositalari xarid qilish",
      description: "Sug‘orish uskunalarini sotib olish",
      amount: "so‘rov bo‘yicha",
      available: false,
    },
    {
      id: 4,
      title: "Qishloq xo‘jaligi kooperativlari ustav fondiga ulush sifatida kiritish uchun",
      description: "Qishloq xo‘jaligi kooperativiga a'zo bo‘lish",
      amount: "so‘rov bo‘yicha",
      available: false,
    },
    {
      id: 5,
      title: "Kasanachilik faoliyati uchun bir oylik o‘rtacha daromad (3 oyga)",
      description: "Kasanachilikni qo‘llab-quvvatlash (dastlabki 3 oy)",
      amount: "1 o‘rtacha oylik daromad",
      available: false,
    },
    {
      id: 6,
      title: "«Usta-shogird» – hunar o‘rgatish (1,8 mln so‘m / shogird)",
      description: "Yoshlarga hunar o‘rgatish",
      amount: "1,8 mln so‘m / kishi",
      available: false,
    },
    {
      id: 7,
      title: "Ustalarga internet-sayt va reklama (11,2 mln so‘m)",
      description: "Sayt yaratish, jahon savdo maydonchalariga chiqish",
      amount: "~11,2 mln so‘m",
      available: false,
    },
    {
      id: 8,
      title: "Ijara to‘lovini to‘lash (3,7 mln so‘m)",
      description: "Ishsizlar uchun – binoni ijaraga olish",
      amount: "~3,7 mln so‘m",
      available: false,
    },
    {
      id: 9,
      title: "Quyosh paneli",
      description: "Quyosh panellarini xarid qilish",
      amount: "so‘rov bo‘yicha",
      available: false,
    },
    {
      id: 10,
      title: "Ozodlikdan mahrum etilganlarga tadbirkorlik (3,7 mln so‘m)",
      description: "Sobiq mahkumlar – loyihalarni amalga oshirish",
      amount: "~3,7 mln so‘m",
      available: false,
    },
    {
      id: 11,
      title: "Noutbuk",
      description: "Noutbuk sotib olish",
      amount: "so‘rov bo‘yicha",
      available: false,
    },
    {
      id: 12,
      title: "Food truck",
      description: "Food truck sotib olish",
      amount: "so‘rov bo‘yicha",
      available: false,
    },
    {
      id: 13,
      title: "Aylanma mablag‘lar (3,7 mln so‘m / xodim)",
      description: "Kambag‘al oila a'zolarini ishga joylashtirganlik uchun",
      amount: "~3,7 mln so‘m / kishi",
      available: false,
    },
    {
      id: 14,
      title: "Asbob-uskuna, jihozlar (18,7 mln so‘m)",
      description: "Boshlang‘ich tadbirkor va hunarmandlar uchun",
      amount: "~18,7 mln so‘m",
      available: false,
    },
    {
      id: 15,
      title: "Suv quduqlari, tomchilatib sug‘orish (75 mln so‘m)",
      description: "Ijara asosidagi yerlarda kambag‘al oilalar uchun",
      amount: "~75,0 mln so‘m",
      available: false,
    },
    {
      id: 16,
      title: "Tajriba o‘rgatganlik uchun (1,2 mln so‘m / kambag‘al oila)",
      description: "10 tagacha kambag‘al oilani o‘qitish",
      amount: "~1,2 mln so‘m / oila",
      available: false,
    },
    {
      id: 17,
      title: "Mevali bog‘",
      description: "Mevali bog‘ barpo etish",
      amount: "so‘rov bo‘yicha",
      available: false,
    },
  ];

  // Jamg‘arma kartochkasiga bosilganda
  const handleFundClick = (itemId: number) => {
    if (itemId === 1) {
      setShowDirections(true);
    }
  };

  // Yo‘nalishga bosilganda
  const handleDirectionClick = (direction: typeof subsidyDirections[0]) => {
    if (direction.available && direction.id === 1) {
      navigate("/fund-detail", { state: { direction } });
    }
  };

  // Asosiy ekranga qaytish
  const handleBackToMain = () => {
    setShowDirections(false);
  };

  // ========== ASOSIY EKRAN (jamg‘armalar + grafik) ==========
  const renderMainView = () => (
    <>
      <Flex justify="space-between" align="start" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold" color="gray.800">
          Davlat maqsadli jamg‘armalari
        </Heading>
        <Box textAlign="right">
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            Umumiy byudjet hajmi
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
              onClick={() => handleFundClick(item.id)}
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
                      handleFundClick(item.id);
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
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
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
    </>
  );

  // ========== YO‘NALISHLAR RO‘YXATI EKRANI ==========
  const renderDirectionsView = () => (
    <Box w={'100%'}  py={4}>
      <Flex align="center" mb={6}>
        <IconButton
          aria-label="Orqaga"
          icon={<ChevronLeft size={20} />}
          variant="ghost"
          mr={3}
          onClick={handleBackToMain}
        />
        <Heading as="h1" size="lg" fontWeight="bold" color="gray.800">
          Qashshoqlikni qisqartirish maqsadli jamg‘armasi bo‘yicha yo‘nalishlar
        </Heading>
      </Flex>
      <Text fontSize="md" color="gray.600" mb={8}>
        Subsidiya va grantlar olish mumkin bo‘lgan yo‘nalishlar
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
        {subsidyDirections.map((direction) => {
          const isAvailable = direction.available;
          return (
            <Card
              key={direction.id}
              variant="outline"
              borderColor={isAvailable ? "brand.200" : "gray.200"}
              borderRadius="xl"
              transition="0.2s"
              bg="white"
              cursor={isAvailable ? "pointer" : "default"}
              _hover={
                isAvailable
                  ? { boxShadow: "lg", transform: "translateY(-4px)", borderColor: "brand.400" }
                  : { boxShadow: "sm" }
              }
              onClick={() => handleDirectionClick(direction)}
              position="relative"
              opacity={isAvailable ? 1 : 0.9}
            >
              <CardBody>
                <Flex align="center" gap={2} mb={3}>
                  <Leaf size={20} color={isAvailable ? "#38A169" : "#A0AEC0"} />
                  <Text fontSize="lg" fontWeight="bold" color={isAvailable ? "gray.800" : "gray.600"}>
                    {direction.title}
                  </Text>
                </Flex>

                <Text fontSize="sm" color="gray.600" mb={3}>
                  {direction.description}
                </Text>

                {direction.amount && (
                  <Badge colorScheme={isAvailable ? "green" : "gray"} mb={2}>
                    {direction.amount}
                  </Badge>
                )}

                {!isAvailable && (
                  <Flex mt={3} align="center" gap={1}>
                    <Lock size={14} />
                    <Text fontSize="xs" color="gray.500">
                      Yaqin orada
                    </Text>
                  </Flex>
                )}
              </CardBody>
              {isAvailable && (
                <Flex justify="flex-end" p={3} pt={0}>
                  <IconButton
                    aria-label="Batafsil"
                    icon={<ArrowRight size={18} />}
                    size="sm"
                    variant="ghost"
                    color="brand.500"
                    _hover={{ bg: "gray.100" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectionClick(direction);
                    }}
                  />
                </Flex>
              )}
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );

  return <Box>{showDirections ? renderDirectionsView() : renderMainView()}</Box>;
};

export default Found;