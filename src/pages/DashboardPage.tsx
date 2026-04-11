import React, { useState } from "react";
import {
  Box, Text, Heading, Flex, useToken, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Divider, Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react";
import Uzbekistan from "@svg-maps/uzbekistan";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip as ChartTooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import {
  Landmark, Wallet, Banknote, Globe, MapPin, Building, TrendingUp, Users, Home, AlertTriangle, CheckCircle, Flame, Briefcase, BadgePercent, TrendingDown
} from "lucide-react";

// ------------------------------
// ASOSIY DASHBOARD MA'LUMOTLARI
// ------------------------------

const sources = {
  stateBudget: 26800000,
  funds: 1200000,
  bankCredits: 140000000,
  external: 100000000,
};
const totalAssigned = sources.stateBudget + sources.funds + sources.bankCredits + sources.external;

const povertyAvg = 2.6;
const poorFamilies = 263215;
const poorRiskFamilies = 48221;
const poorServicesTarget = 263215;

const unemploymentAvg = 4.4;
const legalJobsTarget = 1000000;
const jobPlacementTarget = 1000045;

const povertyByRegion = [
  { name: "Qoraqalpog'iston", value: 3.2 }, { name: "Andijon", value: 2.7 },
  { name: "Buxoro", value: 2.6 }, { name: "Jizzax", value: 2.8 },
  { name: "Qashqadaryo", value: 3.3 }, { name: "Navoiy", value: 2.1 },
  { name: "Namangan", value: 2.7 }, { name: "Samarqand", value: 2.0 },
  { name: "Sirdaryo", value: 3.0 }, { name: "Surxondaryo", value: 2.8 },
  { name: "Toshkent vil.", value: 2.6 }, { name: "Farg'ona", value: 2.7 },
  { name: "Xorazm", value: 3.0 }, { name: "Toshkent sh.", value: 1.7 },
];

const unemploymentByRegion = [
  { name: "Qoraqalpog'iston", value: 4.8 }, { name: "Andijon", value: 4.5 },
  { name: "Buxoro", value: 4.5 }, { name: "Jizzax", value: 4.6 },
  { name: "Qashqadaryo", value: 5.0 }, { name: "Navoiy", value: 3.9 },
  { name: "Namangan", value: 4.6 }, { name: "Samarqand", value: 4.5 },
  { name: "Sirdaryo", value: 4.6 }, { name: "Surxondaryo", value: 4.6 },
  { name: "Toshkent vil.", value: 4.5 }, { name: "Farg'ona", value: 4.5 },
  { name: "Xorazm", value: 4.5 }, { name: "Toshkent sh.", value: 3.8 },
];

const combinedChartData = povertyByRegion.map((reg, i) => ({
  name: reg.name,
  Kambagallik: reg.value,
  Ishsizlik: unemploymentByRegion[i].value
}));

const regionWeights: Record<string, number> = {
  Tashkent: 1.5, Samarkand: 1.2, Bukhara: 1.0, Kashkadarya: 2.5,
  Fergana: 1.2, Andijan: 1.0, Namangan: 1.0, Surkhandarya: 0.9,
  Jizzakh: 0.8, Sirdarya: 0.7, Navoi: 1.1, Khorezm: 0.9, Karakalpakstan: 1.0,
};

const normalizeName = (n: string) => n.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').replace(/ Respublikasi$/i, '').replace(/‘/g, "'").trim();
const reverseRegionMap: Record<string, string> = {
  "Toshkent": "Tashkent", "Samarqand": "Samarkand", "Buxoro": "Bukhara", "Qashqadaryo": "Kashkadarya",
  "Farg'ona": "Fergana", "Fargʻona": "Fergana", "Andijon": "Andijan", "Namangan": "Namangan",
  "Surxondaryo": "Surkhandarya", "Jizzax": "Jizzakh", "Sirdaryo": "Sirdarya", "Navoiy": "Navoi",
  "Xorazm": "Khorezm", "Qoraqalpog'iston": "Karakalpakstan", "Qoraqalpogʻiston": "Karakalpakstan"
};

const regionData: Record<string, any> = {};
const totalWeight = Object.values(regionWeights).reduce((a, b) => a + b, 0);

Object.keys(regionWeights).forEach((key) => {
  const w = regionWeights[key];
  regionData[key] = {
    state: (sources.stateBudget * w) / totalWeight,
    funds: (sources.funds * w) / totalWeight,
    bank: (sources.bankCredits * w) / totalWeight,
    external: (sources.external * w) / totalWeight,
    total: (totalAssigned * w) / totalWeight,
  };
});

const getRegionKey = (svgName: string): string | null => {
  const norm = normalizeName(svgName);
  if (regionWeights[norm]) return norm;
  if (reverseRegionMap[norm] && regionWeights[reverseRegionMap[norm]]) return reverseRegionMap[norm];
  return null;
};

// SVG Icon
const ShieldCheck = ({ size, color }: { size: number, color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  // We extract brand colors, but we will force purely bright styling for cards and text
  const [brand600, green500, purple500, yellow500, red500, teal500] = useToken("colors", ["brand.600", "green.500", "purple.500", "yellow.500", "red.500", "teal.500"]);
  const [tooltip, setTooltip] = useState<any>({ visible: false, x: 0, y: 0, data: null });

  const COLORS = [brand600, "#3182CE", "#DD6B20", "#38A169", "#805AD5", "#00A3C4", "#C53030"];
  const pieData = Object.entries(regionData)
    .map(([key, val]) => ({ name: key, value: val.total }))
    .sort((a, b) => b.value - a.value);

  const handleRegionClick = (svgName: string) => {
    const key = getRegionKey(svgName);
    if (key === "Kashkadarya" || reverseRegionMap[normalizeName(svgName)] === "Kashkadarya") {
      navigate("/kashkadarya");
    }
  };

  // LIGHT THEME CONSTANTS TO OVERRIDE THE GLOBAL DARK MODE IN THIS COMPONENT
  const mainBg = "gray.50";
  const cardBg = "white";
  const titleColor = "gray.800";
  const subtitleColor = "gray.500";
  const statLabelColor = "gray.600";
  const statNumberColor = "gray.800";
  const chartTextColor = "#4A5568";
  const chartGridColor = "#E2E8F0";

  return (
    <Box minH="100vh" >
      <Flex direction="column" gap={8}>
        
        {/* HEADER */}
        <Box>
          <Heading as="h1" size="2xl" mb={3} color={titleColor}>Respublika Boshqaruv Paneli</Heading>
          <Text fontSize="lg" color={subtitleColor}>
            Aholini ijtimoiy himoya qilish, bandlik va davlat moliyasi bo'yicha integratsiyalashgan boshqaruv markazi
          </Text>
        </Box>

        {/* MOLIYA */}
        <Box>
          <Flex align="center" gap={3} mb={4}>
            <Landmark color={brand600} size={28} />
            <Heading size="lg" color={titleColor}>Moliya va Byudjet</Heading>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={brand600}>
              <Flex align="center" gap={2} mb={2}>
                <Wallet size={20} color={brand600} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Davlat Byudjeti</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{(sources.stateBudget / 1000000).toFixed(1)} <Text as="span" fontSize="lg" color="gray.400">trln</Text></StatNumber>
              <StatHelpText color={subtitleColor}>mln so'm - trln so'm</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={green500}>
              <Flex align="center" gap={2} mb={2}>
                <Banknote size={20} color={green500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Jamg'arma Mablag'lari</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{(sources.funds / 1000000).toFixed(1)} <Text as="span" fontSize="lg" color="gray.400">trln</Text></StatNumber>
              <StatHelpText color={subtitleColor}>Maxsus jamg'armalar</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={yellow500}>
              <Flex align="center" gap={2} mb={2}>
                <Building size={20} color={yellow500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Bank Kreditlari</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{(sources.bankCredits / 1000000).toFixed(1)} <Text as="span" fontSize="lg" color="gray.400">trln</Text></StatNumber>
              <StatHelpText color={subtitleColor}>Ajratiladigan moliya</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={purple500}>
              <Flex align="center" gap={2} mb={2}>
                <Globe size={20} color={purple500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Tashqi Investitsiyalar</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{(sources.external / 1000000).toFixed(1)} <Text as="span" fontSize="lg" color="gray.400">trln</Text></StatNumber>
              <StatHelpText color={subtitleColor}>Qo'shimcha XMI</StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        {/* KAMBAG'ALLIK */}
        <Box>
          <Flex align="center" gap={3} mb={4}>
            <Users color={red500} size={28} />
            <Heading size="lg" color={titleColor}>Kambag'allik va Ijtimoiy Himoya</Heading>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={red500}>
              <Flex align="center" gap={2} mb={2}>
                <AlertTriangle size={20} color={red500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">O'rtacha Kambag'allik</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{povertyAvg}%</StatNumber>
              <StatHelpText color={subtitleColor}>Respublika bo'yicha</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={brand600}>
              <Flex align="center" gap={2} mb={2}>
                <Home size={20} color={brand600} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Kambag'al Oilalar</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{poorFamilies.toLocaleString()}</StatNumber>
              <StatHelpText color={subtitleColor}>Jami muhtoj oilalar</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={yellow500}>
              <Flex align="center" gap={2} mb={2}>
                <Flame size={20} color={yellow500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Xavf Ostidagi Oilalar</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{poorRiskFamilies.toLocaleString()}</StatNumber>
              <StatHelpText color={subtitleColor}>Tezkor yordamga muhtojlar</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={green500}>
              <Flex align="center" gap={2} mb={2}>
                <CheckCircle size={20} color={green500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">2026-yil Qamrov Maqsadi</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{poorServicesTarget.toLocaleString()}</StatNumber>
              <StatHelpText color={subtitleColor}>Oilalarni qamrab olish rejasi</StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        {/* BANDLIK */}
        <Box>
           <Flex align="center" gap={3} mb={4}>
            <Briefcase color={teal500} size={28} />
            <Heading size="lg" color={titleColor}>Bandlik va Ishsizlik</Heading>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={red500}>
               <Flex align="center" gap={2} mb={2}>
                <BadgePercent size={20} color={red500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">O'rtacha Ishsizlik</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{unemploymentAvg}%</StatNumber>
              <StatHelpText color={subtitleColor}>Respublika miqyosida o'rtacha</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={yellow500}>
              <Flex align="center" gap={2} mb={2}>
                <ShieldCheck size={20} color={yellow500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Legallashtiriladigan Ish</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{(legalJobsTarget / 1000000).toFixed(1)} <Text as="span" fontSize="lg" color="gray.400">mln</Text></StatNumber>
              <StatHelpText color={subtitleColor}>Noqonuniy faoliyatni rasmiylashtirish</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={5} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor={green500}>
              <Flex align="center" gap={2} mb={2}>
                <TrendingDown size={20} color={green500} />
                <StatLabel fontSize="md" color={statLabelColor} fontWeight="bold">Doimiy Ishga Joylashtirish</StatLabel>
              </Flex>
              <StatNumber fontSize="3xl" color={statNumberColor}>{(jobPlacementTarget / 1000000).toFixed(2)} <Text as="span" fontSize="lg" color="gray.400">mln</Text></StatNumber>
              <StatHelpText color={subtitleColor}>2026-yil uchun asosiy bandlik</StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        <Divider borderColor="gray.300" my={2} />

        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList bg={cardBg} borderRadius="full" p={2} mb={4} maxW="max-content" boxShadow="sm">
            <Tab fontWeight="bold" color="gray.600" _selected={{ bg: "brand.50", color: "brand.600" }}>Moliyaviy Taqsimot Xaritasi</Tab>
            <Tab fontWeight="bold" color="gray.600" _selected={{ bg: "brand.50", color: "brand.600" }}>Ijtimoiy-Iqtisodiy Grafiklar</Tab>
          </TabList>

          <TabPanels>
            {/* TAB 1: Heatmap Map */}
            <TabPanel p={0} mb={6}>
              <Box bg={cardBg} p={8} borderRadius="2xl" boxShadow="md">
                <Flex align="center" justify="space-between" mb={6} flexWrap="wrap" gap={4}>
                  <Flex align="center" gap={3}>
                    <MapPin color={brand600} size={24} />
                    <Heading size="lg" color={titleColor}>Hududlar xaritasi: Byudjet taqsimoti</Heading>
                  </Flex>
                  <Text color={subtitleColor} fontSize="md" fontWeight="medium">
                    Mablag' hajmi ko'p yo'naltirilgan manzillar to'qroq rangda
                  </Text>
                </Flex>
                
                <Box position="relative" display="flex" justifyContent="center">
                  <svg viewBox={Uzbekistan.viewBox} width="85%">
                    {Uzbekistan.locations.map((loc: any) => {
                      const regionKey = getRegionKey(loc.name);
                      const hasData = !!regionKey;
                      const totalMln = hasData ? regionData[regionKey!].total : 0;
                      
                      const ratio = hasData ? totalMln / (Math.max(...Object.values(regionData).map((d:any) => d.total))) : 0;
                      const opacityFill = hasData ? 0.35 + (ratio * 0.65) : 0.10;

                      return (
                        <path
                          key={loc.id}
                          d={loc.path}
                          fill={hasData ? brand600 : "gray"}
                          fillOpacity={opacityFill}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                          cursor={hasData ? "pointer" : "default"}
                          onMouseEnter={(e) => {
                            if (!hasData) return;
                            setTooltip({ visible: true, x: e.clientX, y: e.clientY, data: { name: loc.name, regionKey } });
                          }}
                          onMouseMove={(e) => setTooltip((p: any) => ({ ...p, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}
                          onClick={() => handleRegionClick(loc.name)}
                          style={{ transition: "all 0.3s ease", display: "block" }}
                          onMouseOver={(e) => {
                            if(hasData) {
                              e.currentTarget.style.fillOpacity = "1";
                              e.currentTarget.style.stroke = "#2C5282";
                              e.currentTarget.style.strokeWidth = "2.5";
                            }
                          }}
                          onMouseOut={(e) => {
                            if(hasData) {
                              e.currentTarget.style.fillOpacity = opacityFill.toString();
                              e.currentTarget.style.stroke = "#FFFFFF";
                              e.currentTarget.style.strokeWidth = "1.5";
                            }
                          }}
                        />
                      );
                    })}
                  </svg>

                  {/* LIGHT MODE TOOLTIP */}
                  {tooltip.visible && tooltip.data && tooltip.data.regionKey && (
                    <Box 
                      position="fixed" top={tooltip.y + 15} left={tooltip.x + 15} 
                      bg="white" color="gray.800" px={5} py={4} 
                      borderRadius="xl" pointerEvents="none" zIndex={1000} 
                      boxShadow="2xl" minW="280px" border="1px solid" borderColor="gray.100"
                    >
                      <Text fontWeight="extrabold" fontSize="lg" mb={3} borderBottom="2px solid" borderColor="gray.100" pb={2} color={brand600}>
                        {tooltip.data.name}
                      </Text>
                      <SimpleGrid columns={2} spacingX={4} spacingY={2} mb={3}>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">Davlat byudjeti:</Text>
                        <Text fontSize="sm" fontWeight="bold" textAlign="right">{(regionData[tooltip.data.regionKey].state / 1000).toFixed(1)} mlrd</Text>
                        
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">Jamg'arma:</Text>
                        <Text fontSize="sm" fontWeight="bold" textAlign="right">{(regionData[tooltip.data.regionKey].funds / 1000).toFixed(1)} mlrd</Text>
                        
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">Kreditlar:</Text>
                        <Text fontSize="sm" fontWeight="bold" textAlign="right">{(regionData[tooltip.data.regionKey].bank / 1000).toFixed(1)} mlrd</Text>
                        
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">Tashqi XMI:</Text>
                        <Text fontSize="sm" fontWeight="bold" textAlign="right">{(regionData[tooltip.data.regionKey].external / 1000).toFixed(1)} mlrd</Text>
                      </SimpleGrid>
                      <Flex justify="space-between" align="center" pt={3} borderTop="2px solid" borderColor="gray.100">
                        <Text fontSize="sm" color="gray.800" fontWeight="extrabold">JAMI MABLAG':</Text>
                        <Text fontSize="lg" color={brand600} fontWeight="extrabold">{(regionData[tooltip.data.regionKey].total / 1000).toFixed(1)} mlrd</Text>
                      </Flex>
                    </Box>
                  )}
                </Box>
              </Box>
            </TabPanel>

            {/* TAB 2: Charts */}
            <TabPanel p={0} mb={6}>
              <Box bg={cardBg} p={8} borderRadius="2xl" mb={6} boxShadow="md">
                <Heading size="lg" mb={8} textAlign="center" color={titleColor}>Hududlar bo'yicha Kambag'allik va Ishsizlik Darajasi (%)</Heading>
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={combinedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 65 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                    <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: chartTextColor, fontWeight: 500 }} domain={[0, 6]} />
                    <ChartTooltip 
                      cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }} 
                      contentStyle={{ backgroundColor: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }} 
                      itemStyle={{ fontWeight: "bold" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px", fontWeight: "bold", color: titleColor }} />
                    <Bar dataKey="Kambagallik" fill={red500} radius={[6, 6, 0, 0]} name="Kambag'allik darajasi (%)" />
                    <Bar dataKey="Ishsizlik" fill={teal500} radius={[6, 6, 0, 0]} name="Ishsizlik darajasi (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                <Box bg={cardBg} borderRadius="2xl" p={8} boxShadow="md">
                  <Heading size="md" mb={6} color={titleColor}>Byudjet hududiy taqsimoti (mlrd so'm)</Heading>
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart layout="vertical" data={pieData} margin={{ left: 100, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                      <XAxis type="number" tick={{ fill: chartTextColor, fontWeight: 500 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: chartTextColor, fontWeight: 500 }} width={100} />
                      <ChartTooltip 
                        formatter={(value: any) => [`${(Number(value) / 1000).toFixed(1)} mlrd so'm`, "Jami"]} 
                        contentStyle={{ backgroundColor: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }} 
                        itemStyle={{ fontWeight: "bold", color: brand600 }}
                      />
                      <Bar dataKey="value" fill={brand600} radius={[0, 6, 6, 0]}>
                         {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box bg={cardBg} borderRadius="2xl" p={8} boxShadow="md">
                  <Heading size="md" mb={6} color={titleColor}>Mablag' konsentratsiyasi (ulush %)</Heading>
                  <ResponsiveContainer width="100%" height={380}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={130} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
                      <ChartTooltip 
                        formatter={(value: any) => [(Number(value) / 1000).toFixed(1) + " mlrd so‘m", "Mablag'"]} 
                        contentStyle={{ backgroundColor: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        itemStyle={{ fontWeight: "bold" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>

      </Flex>
    </Box>
  );
};

export default DashboardPage;