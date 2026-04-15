import React, { useState, useMemo } from "react";
import {
  Box, Heading, Text, Flex, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  VStack, HStack, Drawer, DrawerBody, DrawerHeader, DrawerOverlay,
  DrawerContent, DrawerCloseButton, useDisclosure, Tabs, TabList, TabPanels,
  Tab, TabPanel, Grid, GridItem, IconButton, Tooltip
} from "@chakra-ui/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell
} from "recharts";
import {
  Users, Home, Briefcase, AlertTriangle, CheckCircle, Building,
  BadgePercent, DollarSign, ShieldCheck, Activity, ClipboardList, List,
  FileSpreadsheet, FileText, Download
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Uzbekistan from "@svg-maps/uzbekistan";

// ------------------------------------------------------------
// 1. TURLAR
// ------------------------------------------------------------
interface DistrictData {
  id: string;
  name: string;
  totalPopulation: number;
  totalFamilies: number;
  poorFamilies: number;
  totalHouseholds: number;
  poorHouseholds: number;
  povertyRate: number;
  unemploymentRate: number;
  jobsPlaced: number;
  allocatedFunds: number;
  difficultZone: boolean;
  difficultZonesCount: number;
  totalServices: number;
  shortcomings: string[];
  shortcomingsCount: number;
}

interface RegionData {
  id: string;
  name: string;
  nameEn: string;
  totalPopulation: number;
  totalFamilies: number;
  poorFamilies: number;
  totalHouseholds: number;
  poorHouseholds: number;
  povertyRate: number;
  unemploymentRate: number;
  jobsPlaced: number;
  allocatedFunds: number;
  difficultZonesCount: number;
  totalServices: number;
  shortcomingsCount: number;
  districts: DistrictData[];
}

// ------------------------------------------------------------
// 2. MA'LUMOTLAR (O'ZBEK LOTIN)
// ------------------------------------------------------------
const generateDistricts = (regionName: string, basePoverty: number, baseUnemployment: number): DistrictData[] => {
  const districts = [
    { name: "Markaziy tuman", pop: 45000, families: 9000, households: 9200 },
    { name: "Sharqiy tuman", pop: 38000, families: 7600, households: 7800 },
    { name: "G'arbiy tuman", pop: 42000, families: 8400, households: 8600 },
    { name: "Shimoliy tuman", pop: 35000, families: 7000, households: 7200 },
    { name: "Janubiy tuman", pop: 40000, families: 8000, households: 8200 },
  ];
  return districts.map((d, idx) => {
    const variation = (idx - 2) * 0.3;
    let poverty = Math.max(0.5, Math.min(8, basePoverty + variation));
    let unemployment = Math.max(2, Math.min(7, baseUnemployment + variation * 0.5));
    let poorFamilies = Math.floor(d.families * (poverty / 100));
    let poorHouseholds = Math.floor(d.households * (poverty / 100));
    let population = d.pop;
    let jobsPlaced = Math.floor(population * (unemployment / 100) * 0.4);
    let allocatedFunds = poorFamilies * 1.2;
    let totalServices = poorFamilies * 3;
    let shortcomings = [];
    if (poverty > 4) shortcomings.push("Qashshoqlik darajasi yuqori");
    if (unemployment > 5) shortcomings.push("Ishsizlik yuqori");
    if (allocatedFunds < poorFamilies * 1) shortcomings.push("Mablag' yetarli emas");
    if (shortcomings.length === 0) shortcomings.push("Holat barqaror");
    return {
      id: `${regionName}-${idx}`,
      name: d.name,
      totalPopulation: population,
      totalFamilies: d.families,
      poorFamilies,
      totalHouseholds: d.households,
      poorHouseholds,
      povertyRate: parseFloat(poverty.toFixed(1)),
      unemploymentRate: parseFloat(unemployment.toFixed(1)),
      jobsPlaced,
      allocatedFunds: parseFloat(allocatedFunds.toFixed(0)),
      difficultZone: poverty > 4.5,
      difficultZonesCount: poverty > 4.5 ? 1 : 0,
      totalServices,
      shortcomings,
      shortcomingsCount: shortcomings.length,
    };
  });
};

const regionsData: RegionData[] = [
  { id: "qr", name: "Qoraqalpog'iston", nameEn: "Karakalpakstan", totalPopulation: 1900000, totalFamilies: 380000, poorFamilies: 12160, totalHouseholds: 390000, poorHouseholds: 12480, povertyRate: 3.2, unemploymentRate: 4.8, jobsPlaced: 32000, allocatedFunds: 14500, difficultZonesCount: 2, totalServices: 36500, shortcomingsCount: 3, districts: generateDistricts("Qoraqalpog'iston", 3.2, 4.8) },
  { id: "an", name: "Andijon", nameEn: "Andijan", totalPopulation: 3300000, totalFamilies: 660000, poorFamilies: 17820, totalHouseholds: 675000, poorHouseholds: 18225, povertyRate: 2.7, unemploymentRate: 4.5, jobsPlaced: 58000, allocatedFunds: 21300, difficultZonesCount: 1, totalServices: 53500, shortcomingsCount: 2, districts: generateDistricts("Andijon", 2.7, 4.5) },
  { id: "bu", name: "Buxoro", nameEn: "Bukhara", totalPopulation: 1950000, totalFamilies: 390000, poorFamilies: 10140, totalHouseholds: 398000, poorHouseholds: 10348, povertyRate: 2.6, unemploymentRate: 4.5, jobsPlaced: 35000, allocatedFunds: 12200, difficultZonesCount: 0, totalServices: 30400, shortcomingsCount: 1, districts: generateDistricts("Buxoro", 2.6, 4.5) },
  { id: "ji", name: "Jizzax", nameEn: "Jizzakh", totalPopulation: 1450000, totalFamilies: 290000, poorFamilies: 8120, totalHouseholds: 296000, poorHouseholds: 8288, povertyRate: 2.8, unemploymentRate: 4.6, jobsPlaced: 26000, allocatedFunds: 9700, difficultZonesCount: 1, totalServices: 24400, shortcomingsCount: 2, districts: generateDistricts("Jizzax", 2.8, 4.6) },
  { id: "qa", name: "Qashqadaryo", nameEn: "Qashqadaryo", totalPopulation: 3350000, totalFamilies: 670000, poorFamilies: 22110, totalHouseholds: 685000, poorHouseholds: 22605, povertyRate: 3.3, unemploymentRate: 5.0, jobsPlaced: 55000, allocatedFunds: 26500, difficultZonesCount: 3, totalServices: 66300, shortcomingsCount: 4, districts: generateDistricts("Qashqadaryo", 3.3, 5.0) },
  { id: "na", name: "Navoiy", nameEn: "Navoi", totalPopulation: 1050000, totalFamilies: 210000, poorFamilies: 4410, totalHouseholds: 214000, poorHouseholds: 4494, povertyRate: 2.1, unemploymentRate: 3.9, jobsPlaced: 22000, allocatedFunds: 5300, difficultZonesCount: 0, totalServices: 13200, shortcomingsCount: 1, districts: generateDistricts("Navoiy", 2.1, 3.9) },
  { id: "nm", name: "Namangan", nameEn: "Namangan", totalPopulation: 2950000, totalFamilies: 590000, poorFamilies: 15930, totalHouseholds: 603000, poorHouseholds: 16281, povertyRate: 2.7, unemploymentRate: 4.6, jobsPlaced: 51000, allocatedFunds: 19100, difficultZonesCount: 1, totalServices: 47800, shortcomingsCount: 2, districts: generateDistricts("Namangan", 2.7, 4.6) },
  { id: "sa", name: "Samarqand", nameEn: "Samarkand", totalPopulation: 4000000, totalFamilies: 800000, poorFamilies: 16000, totalHouseholds: 820000, poorHouseholds: 16400, povertyRate: 2.0, unemploymentRate: 4.5, jobsPlaced: 78000, allocatedFunds: 19200, difficultZonesCount: 0, totalServices: 48000, shortcomingsCount: 1, districts: generateDistricts("Samarqand", 2.0, 4.5) },
  { id: "si", name: "Sirdaryo", nameEn: "Sirdaryo", totalPopulation: 880000, totalFamilies: 176000, poorFamilies: 5280, totalHouseholds: 180000, poorHouseholds: 5400, povertyRate: 3.0, unemploymentRate: 4.6, jobsPlaced: 15000, allocatedFunds: 6300, difficultZonesCount: 1, totalServices: 15800, shortcomingsCount: 2, districts: generateDistricts("Sirdaryo", 3.0, 4.6) },
  { id: "su", name: "Surxondaryo", nameEn: "Surxondaryo", totalPopulation: 2750000, totalFamilies: 550000, poorFamilies: 15400, totalHouseholds: 562000, poorHouseholds: 15736, povertyRate: 2.8, unemploymentRate: 4.6, jobsPlaced: 47000, allocatedFunds: 18500, difficultZonesCount: 1, totalServices: 46200, shortcomingsCount: 2, districts: generateDistricts("Surxondaryo", 2.8, 4.6) },
  { id: "to", name: "Toshkent viloyati", nameEn: "Toshkent viloyati", totalPopulation: 2950000, totalFamilies: 590000, poorFamilies: 15340, totalHouseholds: 603000, poorHouseholds: 15678, povertyRate: 2.6, unemploymentRate: 4.5, jobsPlaced: 62000, allocatedFunds: 18400, difficultZonesCount: 0, totalServices: 46000, shortcomingsCount: 1, districts: generateDistricts("Toshkent viloyati", 2.6, 4.5) },
  { id: "fa", name: "Farg'ona", nameEn: "Fergana", totalPopulation: 3900000, totalFamilies: 780000, poorFamilies: 21060, totalHouseholds: 798000, poorHouseholds: 21546, povertyRate: 2.7, unemploymentRate: 4.5, jobsPlaced: 72000, allocatedFunds: 25300, difficultZonesCount: 1, totalServices: 63200, shortcomingsCount: 2, districts: generateDistricts("Farg'ona", 2.7, 4.5) },
  { id: "xo", name: "Xorazm", nameEn: "Xorazm", totalPopulation: 1900000, totalFamilies: 380000, poorFamilies: 11400, totalHouseholds: 388000, poorHouseholds: 11640, povertyRate: 3.0, unemploymentRate: 4.5, jobsPlaced: 34000, allocatedFunds: 13700, difficultZonesCount: 1, totalServices: 34200, shortcomingsCount: 2, districts: generateDistricts("Xorazm", 3.0, 4.5) },
  { id: "ts", name: "Toshkent shahri", nameEn: "Tashkent", totalPopulation: 2950000, totalFamilies: 590000, poorFamilies: 10030, totalHouseholds: 610000, poorHouseholds: 10370, povertyRate: 1.7, unemploymentRate: 3.8, jobsPlaced: 120000, allocatedFunds: 12000, difficultZonesCount: 0, totalServices: 30100, shortcomingsCount: 1, districts: generateDistricts("Toshkent shahri", 1.7, 3.8) },
];

// ------------------------------------------------------------
// 3. KO'RSATKICHLAR (11 ta)
// ------------------------------------------------------------
interface MetricConfig {
  id: string;
  label: string;
  dataKey: keyof RegionData;
  unit: string;
  icon: React.ElementType;
  format?: (value: number) => string;
}

const metrics: MetricConfig[] = [
  { id: "population", label: "Jami aholi", dataKey: "totalPopulation", unit: "kishi", icon: Users, format: (v) => (v ?? 0).toLocaleString() },
  { id: "families", label: "Jami oilalar", dataKey: "totalFamilies", unit: "oila", icon: Home, format: (v) => (v ?? 0).toLocaleString() },
  { id: "households", label: "Xonadonlar", dataKey: "totalHouseholds", unit: "xonadon", icon: Building, format: (v) => (v ?? 0).toLocaleString() },
  { id: "poorFamilies", label: "Kambag'al oilalar", dataKey: "poorFamilies", unit: "oila", icon: AlertTriangle, format: (v) => (v ?? 0).toLocaleString() },
  { id: "povertyRate", label: "Kambag'allik darajasi", dataKey: "povertyRate", unit: "%", icon: BadgePercent, format: (v) => `${v ?? 0}%` },
  { id: "unemploymentRate", label: "Ishsizlik darajasi", dataKey: "unemploymentRate", unit: "%", icon: Briefcase, format: (v) => `${v ?? 0}%` },
  { id: "jobsPlaced", label: "Ishga joylashtirilgan", dataKey: "jobsPlaced", unit: "kishi", icon: CheckCircle, format: (v) => (v ?? 0).toLocaleString() },
  { id: "allocatedFunds", label: "Ajratilgan mablag'lar", dataKey: "allocatedFunds", unit: "mln so'm", icon: DollarSign, format: (v) => (v ?? 0).toLocaleString() },
  { id: "difficultZones", label: "Og'ir hududlar", dataKey: "difficultZonesCount", unit: "ta", icon: ShieldCheck, format: (v) => (v ?? 0).toString() },
  { id: "totalServices", label: "Ko'rsatilgan xizmatlar", dataKey: "totalServices", unit: "ta", icon: Activity, format: (v) => (v ?? 0).toLocaleString() },
  { id: "shortcomings", label: "Kamchiliklar", dataKey: "shortcomingsCount", unit: "ta", icon: ClipboardList, format: (v) => (v ?? 0).toString() },
];

// ------------------------------------------------------------
// 4. QAT'IY 3 RANG: YASHIL, SARIQ, QIZIL
// ------------------------------------------------------------
const getDiscreteColor = (value: number, minVal: number, maxVal: number): string => {
  if (maxVal === minVal) return "#48BB78";
  const range = maxVal - minVal;
  const third = range / 3;
  if (value < minVal + third) return "#48BB78";
  if (value < minVal + 2 * third) return "#ECC94B";
  return "#F56565";
};

// ------------------------------------------------------------
// 5. XARITA MAPPING
// ------------------------------------------------------------
const mapNameToRegion = (svgName: string): RegionData | undefined => {
  const directMatch = regionsData.find(r => r.nameEn === svgName);
  if (directMatch) return directMatch;

  const mapping: Record<string, string> = {
    "Karakalpakstan": "Qoraqalpog'iston",
    "Andijan": "Andijon",
    "Bukhara": "Buxoro",
    "Jizzakh": "Jizzax",
    "Qashqadaryo": "Qashqadaryo",
    "Navoi": "Navoiy",
    "Namangan": "Namangan",
    "Samarkand": "Samarqand",
    "Sirdaryo": "Sirdaryo",
    "Surxondaryo": "Surxondaryo",
    "Toshkent viloyati": "Toshkent viloyati",
    "Fergana": "Farg'ona",
    "Xorazm": "Xorazm",
    "Tashkent": "Toshkent shahri",
    "Qoraqalpog‘iston": "Qoraqalpog'iston",
    "Andijon": "Andijon",
    "Buxoro": "Buxoro",
    "Jizzax": "Jizzax",
    "Navoiy": "Navoiy",
    "Samarqand": "Samarqand",
    "Farg'ona": "Farg'ona",
    "Toshkent": "Toshkent shahri",
  };
  const mappedName = mapping[svgName];
  if (mappedName) return regionsData.find(r => r.name === mappedName);
  return undefined;
};

// ------------------------------------------------------------
// 6. XARITA KOMPONENTI (3 RANG)
// ------------------------------------------------------------
interface MapWithTooltipProps {
  activeMetric: MetricConfig;
  onRegionClick: (region: RegionData) => void;
}

const MapWithTooltip: React.FC<MapWithTooltipProps> = ({ activeMetric, onRegionClick }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; data: any }>({
    visible: false, x: 0, y: 0, data: null
  });

  const validLocations = Uzbekistan.locations.filter(loc => mapNameToRegion(loc.name) !== undefined);
  const metricValues = regionsData.map(r => r[activeMetric.dataKey] as number);
  const minVal = Math.min(...metricValues);
  const maxVal = Math.max(...metricValues);

  return (
    <Box position="relative" display="flex" justifyContent="center" my={4}>
      <svg viewBox={Uzbekistan.viewBox} width="100%" style={{ maxWidth: "800px", cursor: "pointer" }}>
        {validLocations.map((loc: any) => {
          const region = mapNameToRegion(loc.name)!;
          const metricValue = region[activeMetric.dataKey] as number;
          const fillColor = getDiscreteColor(metricValue, minVal, maxVal);
          return (
            <path
              key={loc.id}
              d={loc.path}
              onMouseEnter={(e) => {
                setTooltip({
                  visible: true,
                  x: e.clientX, y: e.clientY,
                  data: { name: region.name, value: metricValue, unit: activeMetric.unit }
                });
              }}
              onMouseMove={(e) => setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }))}
              onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}
              onClick={() => onRegionClick(region)}
              style={{
                fill: fillColor,
                stroke: "#2d3748",
                strokeWidth: 1.2,
                transition: "all 0.2s ease",
                opacity: 0.9,
                cursor: "pointer",
              }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.strokeWidth = "2"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.strokeWidth = "1.2"; }}
            />
          );
        })}
      </svg>
      {tooltip.visible && tooltip.data && (
        <Box position="fixed" top={tooltip.y + 12} left={tooltip.x + 12} bg="white" color="gray.800" px={4} py={2} borderRadius="md" boxShadow="lg" zIndex={1000} border="1px solid" borderColor="gray.200">
          <Text fontWeight="bold">{tooltip.data.name}</Text>
          <Text fontSize="sm">{activeMetric.label}: <strong>{(tooltip.data.value ?? 0).toLocaleString()} {tooltip.data.unit}</strong></Text>
          <Text fontSize="xs" color="blue.500">Bosing – batafsil</Text>
        </Box>
      )}
    </Box>
  );
};

// ------------------------------------------------------------
// 7. EKSPORT FUNKSIYALARI (alohida Excel va Word)
// ------------------------------------------------------------
const exportToExcel = (data: RegionData[], metric: MetricConfig, title: string = "Hisobot") => {
  const excelData = data.map(region => ({
    "Viloyat": region.name,
    [metric.label]: metric.format ? metric.format(region[metric.dataKey] as number) : (region[metric.dataKey] as number).toLocaleString(),
    "Aholi": region.totalPopulation.toLocaleString(),
    "Oilalar": region.totalFamilies.toLocaleString(),
    "Kambag'al oilalar": region.poorFamilies.toLocaleString(),
    "Kambag'allik %": region.povertyRate + "%",
    "Ishsizlik %": region.unemploymentRate + "%",
    "Ishga joylashtirilgan": region.jobsPlaced.toLocaleString(),
    "Ajratilgan mablag' (mln so'm)": region.allocatedFunds.toLocaleString(),
    "Og'ir hududlar soni": region.difficultZonesCount,
    "Ko'rsatilgan xizmatlar": region.totalServices.toLocaleString(),
    "Kamchiliklar soni": region.shortcomingsCount,
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(dataBlob, `${title}_${metric.label}_${new Date().toISOString().slice(0, 19)}.xlsx`);
};

const exportToWord = (data: RegionData[], metric: MetricConfig, title: string = "Hisobot") => {
  const maxRegion = data.reduce((max, r) => (r[metric.dataKey] as number) > (max.val as number) ? { name: r.name, val: r[metric.dataKey] as number } : max, { name: "", val: 0 });
  const minRegion = data.reduce((min, r) => (r[metric.dataKey] as number) < (min.val as number) ? { name: r.name, val: r[metric.dataKey] as number } : min, { name: "", val: Infinity });
  const avgValue = data.reduce((s, r) => s + (r[metric.dataKey] as number), 0) / data.length;

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Times New Roman', Arial, sans-serif; margin: 40px; }
    h1 { color: #2d3748; }
    h2 { color: #4a5568; margin-top: 30px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #cbd5e0; padding: 8px 12px; text-align: left; }
    th { background-color: #edf2f7; }
    .stats { display: flex; gap: 20px; margin: 20px 0; }
    .stat-card { border: 1px solid #cbd5e0; border-radius: 8px; padding: 16px; flex: 1; }
    .stat-label { font-size: 14px; color: #718096; }
    .stat-number { font-size: 24px; font-weight: bold; color: #2d3748; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Sana: ${new Date().toLocaleDateString('uz-UZ')} | Hisobot davri: 2025-yil</p>
  <h2>Ko'rsatkich: ${metric.label}</h2>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Eng yuqori</div>
      <div class="stat-number">${maxRegion.name}</div>
      <div>${maxRegion.val.toLocaleString()} ${metric.unit}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Eng past</div>
      <div class="stat-number">${minRegion.name}</div>
      <div>${minRegion.val.toLocaleString()} ${metric.unit}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">O'rtacha</div>
      <div class="stat-number">${avgValue.toFixed(1)}</div>
      <div>${metric.unit}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr><th>Viloyat</th><th>${metric.label}</th><th>Aholi</th><th>Oilalar</th><th>Kambag'allik %</th><th>Ishsizlik %</th></tr>
    </thead>
    <tbody>
      ${data.map(r => `
        <tr>
          <td>${r.name}</td>
          <td>${(r[metric.dataKey] as number ?? 0).toLocaleString()}</td>
          <td>${(r.totalPopulation ?? 0).toLocaleString()}</td>
          <td>${(r.totalFamilies ?? 0).toLocaleString()}</td>
          <td>${r.povertyRate}%</td>
          <td>${r.unemploymentRate}%</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "application/msword" });
  saveAs(blob, `${title}_${metric.label}_${new Date().toISOString().slice(0, 19)}.doc`);
};

// ------------------------------------------------------------
// 8. VILOYAT DETALLARI – FAQAT QASHQADARYO UCHUN EXCEL/WORD
// ------------------------------------------------------------
interface RegionDetailProps {
  region: RegionData;
  activeMetric: MetricConfig;
  onClose: () => void;
}

const RegionDetail: React.FC<RegionDetailProps> = ({ region, activeMetric, onClose }) => {
  const districtValues = region.districts.map(d => ({
    name: d.name,
    value: d[activeMetric.dataKey as keyof DistrictData] as number,
  }));

  const isQashqadaryo = region.name === "Qashqadaryo";

  const handleExcel = () => {
    exportToExcel([region], activeMetric, `${region.name}_hisoboti`);
  };

  const handleWord = () => {
    exportToWord([region], activeMetric, `${region.name}_hisoboti`);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">{region.name} - {activeMetric.label}</Heading>
        {isQashqadaryo && (
          <HStack spacing={2}>
            <Button size="sm" leftIcon={<FileSpreadsheet size={16} />} colorScheme="green" onClick={handleExcel}>
              Excel
            </Button>
            <Button size="sm" leftIcon={<FileText size={16} />} colorScheme="blue" onClick={handleWord}>
              Word
            </Button>
          </HStack>
        )}
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat bg="gray.50" p={3} borderRadius="lg">
          <StatLabel>Viloyat bo'yicha</StatLabel>
          <StatNumber fontSize="xl">{activeMetric.format ? activeMetric.format(region[activeMetric.dataKey] as number) : (region[activeMetric.dataKey] as number).toLocaleString()}</StatNumber>
          <StatHelpText>{activeMetric.unit}</StatHelpText>
        </Stat>
        <Stat bg="gray.50" p={3} borderRadius="lg">
          <StatLabel>Eng yuqori tuman</StatLabel>
          <StatNumber fontSize="xl">{districtValues.reduce((a, b) => a.value > b.value ? a : b).name}</StatNumber>
        </Stat>
        <Stat bg="gray.50" p={3} borderRadius="lg">
          <StatLabel>Eng past tuman</StatLabel>
          <StatNumber fontSize="xl">{districtValues.reduce((a, b) => a.value < b.value ? a : b).name}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
        <TabList mb={3} overflowX="auto">
          <Tab>Tumanlar jadvali</Tab>
          <Tab>Gistogramma</Tab>
          <Tab>Kamchiliklar</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <TableContainer overflowX="auto">
              <Table size="sm" variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Tuman</Th>
                    <Th isNumeric>{activeMetric.label}</Th>
                    <Th isNumeric>Aholi</Th>
                    <Th isNumeric>Kambag'allik %</Th>
                    <Th isNumeric>Ishsizlik %</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {region.districts.map(d => (
                    <Tr key={d.id}>
                      <Td>{d.name}</Td>
                      <Td isNumeric>{activeMetric.format ? activeMetric.format(d[activeMetric.dataKey as keyof DistrictData] as number) : (d[activeMetric.dataKey as keyof DistrictData] as number ?? 0).toLocaleString()}</Td>
                      <Td isNumeric>{(d.totalPopulation ?? 0).toLocaleString()}</Td>
                      <Td isNumeric>{(d.povertyRate ?? 0)}%</Td>
                      <Td isNumeric>{(d.unemploymentRate ?? 0)}%</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel p={0}>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtValues} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <RechartsTooltip formatter={(v: number) => `${(v ?? 0).toLocaleString()} ${activeMetric.unit}`} />
                  <Bar dataKey="value" fill="#3182CE" name={activeMetric.label} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <VStack align="stretch" spacing={3}>
              {region.districts.map(d => (
                <Box key={d.id} p={2} bg="gray.50" borderRadius="md">
                  <Text fontWeight="bold">{d.name}</Text>
                  <ul style={{ marginLeft: "1.2rem", marginTop: "0.25rem" }}>
                    {d.shortcomings.map((s, idx) => <li key={idx}><Text fontSize="xs" color="red.500">{s}</Text></li>)}
                  </ul>
                </Box>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// ------------------------------------------------------------
// 9. ASOSIY DASHBOARD (global eksport tugmalari qo'shildi)
// ------------------------------------------------------------
const Reports: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [activeMetric, setActiveMetric] = useState<MetricConfig>(metrics[0]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRegionClick = (region: RegionData) => {
    setSelectedRegion(region);
    onOpen();
  };

  const chartData = useMemo(() => {
    return regionsData.map(r => ({
      name: r.name,
      value: r[activeMetric.dataKey] as number,
    })).sort((a, b) => b.value - a.value);
  }, [activeMetric]);

  const metricValues = regionsData.map(r => r[activeMetric.dataKey] as number);
  const minVal = Math.min(...metricValues);
  const maxVal = Math.max(...metricValues);

  // Глобальные обработчики экспорта (все вилояты)
  const handleExportAllExcel = () => {
    exportToExcel(regionsData, activeMetric, "Barcha_viloyatlar_hisoboti");
  };

  const handleExportAllWord = () => {
    exportToWord(regionsData, activeMetric, "Barcha_viloyatlar_hisoboti");
  };

  return (
    <Box minH="100vh">
      <Grid templateColumns={{ base: "1fr", lg: "260px 1fr" }} gap={6}>
        {/* Chap panel - vertikal menyu */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" p={4} height="fit-content">
          <Heading size="sm" mb={4} display="flex" alignItems="center" gap={2}>
            <List size={18} /> Ko'rsatkichlar
          </Heading>
          <VStack align="stretch" spacing={2}>
            {metrics.map(metric => {
              const IconComp = metric.icon;
              const isActive = activeMetric.id === metric.id;
              return (
                <Button
                  key={metric.id}
                  leftIcon={<IconComp size={18} />}
                  variant={isActive ? "solid" : "ghost"}
                  colorScheme={isActive ? "blue" : "gray"}
                  justifyContent="flex-start"
                  onClick={() => setActiveMetric(metric)}
                  size="sm"
                  fontWeight={isActive ? "semibold" : "normal"}
                  height="auto"
                  py={2}
                >
                  {metric.label}
                </Button>
              );
            })}
          </VStack>
        </Box>

        {/* O'ng panel - karta va grafiklar */}
        <Box>
          <Flex justify="space-between" align="center" mb={3} flexWrap="wrap" gap={3}>
            <Heading size="md" color="gray.700">{activeMetric.label} (hududlar bo'yicha)</Heading>
            {/* Глобальные кнопки экспорта (Excel / Word) для всех регионов */}
            <HStack spacing={2}>
              <Tooltip label="Excel formatida barcha viloyatlar hisobotini yuklab olish">
                <Button
                  leftIcon={<FileSpreadsheet size={18} />}
                  colorScheme="green"
                  variant="outline"
                  onClick={handleExportAllExcel}
                  size="sm"
                >
                  Excel (barcha)
                </Button>
              </Tooltip>
              <Tooltip label="Word formatida barcha viloyatlar hisobotini yuklab olish">
                <Button
                  leftIcon={<FileText size={18} />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleExportAllWord}
                  size="sm"
                >
                  Word (barcha)
                </Button>
              </Tooltip>
            </HStack>
          </Flex>

          <Flex justify="center" gap={6} mb={4}>
            <HStack spacing={2}>
              <Box w="30px" h="16px" bg="#48BB78" borderRadius="md" />
              <Text fontSize="xs">Kam</Text>
              <Box w="30px" h="16px" bg="#ECC94B" borderRadius="md" />
              <Text fontSize="xs">O‘rta</Text>
              <Box w="30px" h="16px" bg="#F56565" borderRadius="md" />
              <Text fontSize="xs">Yuqori</Text>
            </HStack>
          </Flex>

          <MapWithTooltip activeMetric={activeMetric} onRegionClick={handleRegionClick} />

          {/* Горизонтальная гистограмма */}
        </Box>
      </Grid>
          <Box bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200" mt={6} width="100%">
            <Heading size="sm" mb={4}>Hududlar bo'yicha taqqoslama gistogramma</Heading>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#4a5568" }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                <RechartsTooltip formatter={(v: number) => `${v.toLocaleString()} ${activeMetric.unit}`} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, idx) => {
                    const fillColor = getDiscreteColor(entry.value, minVal, maxVal);
                    return <Cell key={idx} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

      {/* Drawer - viloyat tahlili */}
      <Drawer isOpen={isOpen} onClose={onClose} size="lg" placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Viloyat tahlili</DrawerHeader>
          <DrawerBody>
            {selectedRegion && (
              <RegionDetail region={selectedRegion} activeMetric={activeMetric} onClose={onClose} />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Reports;