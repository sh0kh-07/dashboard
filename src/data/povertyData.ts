// ============================================================
// CENTRALIZED POVERTY DATA FOR UNIFIED DASHBOARD
// ============================================================

// ---- Region names & SVG mappings ----
export const regionNameMap: Record<string, string> = {
  "Karakalpakstan": "Qoraqalpogʻiston Respublikasi",
  "Qoraqalpog'iston": "Qoraqalpogʻiston Respublikasi",
  "Andijan": "Andijon viloyati",
  "Bukhara": "Buxoro viloyati",
  "Jizzakh": "Jizzax viloyati",
  "Qashqadaryo": "Qashqadaryo viloyati",
  "Navoi": "Navoiy viloyati",
  "Namangan": "Namangan viloyati",
  "Samarkand": "Samarqand viloyati",
  "Sirdaryo": "Sirdaryo viloyati",
  "Surxondaryo": "Surxondaryo viloyati",
  "Toshkent viloyati": "Toshkent viloyati",
  "Fergana": "Fargʻona viloyati",
  "Xorazm": "Xorazm viloyati",
  "Tashkent": "Toshkent shahri",
};

export const getRegionFullName = (svgName: string): string | null => {
  const normalized = svgName.replace(/ viloyati$/i, '').replace(/ shahri$/i, '').trim();
  return regionNameMap[svgName] || regionNameMap[normalized] || null;
};

// ---- Core region poverty data ----
export interface RegionPovertyData {
  name: string;
  population: number;
  totalFamilies: number;
  poorPopulation: number;
  poorFamilies: number;
  households: number;
  poorHouseholds: number;
  povertyRate: number;
  removedFamilies: number;
  removedPopulation: number;
  removalPlanYearly: number;
  removalActual: number;
  removalPercent: number;
  redFlags: string[];
  status: "bad" | "moderate" | "good";

  // Category breakdown
  stateSupport: { families: number; population: number; removed: number; removedPop: number; redFlags: string[] };
  poorFamily: { families: number; population: number; removed: number; removedPop: number; redFlags: string[] };
  povertyThreshold: { families: number; population: number; removed: number; removedPop: number; redFlags: string[] };

  // Service coverage (I-bo'lim)
  services: {
    ish: number;
    tadbir: number;
    daromad: number;
    legal: number;
    kasb: number;
  };
  // Risk families (II-bo'lim)
  riskFamilies: number;
}

// Population base
const populationBase: Record<string, number> = {
  "Qoraqalpogʻiston Respublikasi": 1900000,
  "Andijon viloyati": 3300000,
  "Buxoro viloyati": 1900000,
  "Jizzax viloyati": 1400000,
  "Qashqadaryo viloyati": 3300000,
  "Navoiy viloyati": 1000000,
  "Namangan viloyati": 2800000,
  "Samarqand viloyati": 3900000,
  "Sirdaryo viloyati": 880000,
  "Surxondaryo viloyati": 2700000,
  "Toshkent viloyati": 2900000,
  "Fargʻona viloyati": 3800000,
  "Xorazm viloyati": 1900000,
  "Toshkent shahri": 2600000,
};

const povertyRateMap: Record<string, number> = {
  "Qoraqalpogʻiston Respublikasi": 2.9,
  "Andijon viloyati": 2.7,
  "Buxoro viloyati": 2.6,
  "Jizzax viloyati": 2.8,
  "Qashqadaryo viloyati": 3.3,
  "Navoiy viloyati": 2.1,
  "Namangan viloyati": 2.7,
  "Samarqand viloyati": 2.0,
  "Sirdaryo viloyati": 3.0,
  "Surxondaryo viloyati": 2.8,
  "Toshkent viloyati": 2.6,
  "Fargʻona viloyati": 2.7,
  "Xorazm viloyati": 3.0,
  "Toshkent shahri": 1.7,
};

const statusMap: Record<string, "bad" | "moderate" | "good"> = {
  "Qoraqalpogʻiston Respublikasi": "moderate",
  "Andijon viloyati": "moderate",
  "Buxoro viloyati": "good",
  "Jizzax viloyati": "bad",
  "Qashqadaryo viloyati": "bad",
  "Navoiy viloyati": "good",
  "Namangan viloyati": "moderate",
  "Samarqand viloyati": "good",
  "Sirdaryo viloyati": "bad",
  "Surxondaryo viloyati": "bad",
  "Toshkent viloyati": "moderate",
  "Fargʻona viloyati": "moderate",
  "Xorazm viloyati": "bad",
  "Toshkent shahri": "good",
};

const redFlagsByRegion: Record<string, string[]> = {
  "Qoraqalpogʻiston Respublikasi": ["Reestrdagi oilalar ko'payishi nazorat ostida"],
  "Andijon viloyati": [],
  "Buxoro viloyati": [],
  "Jizzax viloyati": ["Ishga joylashtirish foizi pastligi aniqlangan"],
  "Qashqadaryo viloyati": ["3 ta tuman bo'yicha reja bajarilmayapti", "Subsidiyalar taqsimotida nomutanosiblik"],
  "Navoiy viloyati": [],
  "Namangan viloyati": ["Kasb-hunar ta'limi qamrovi pastligi"],
  "Samarqand viloyati": [],
  "Sirdaryo viloyati": ["Reestrdagi ma'lumotlar birlamchi manbaga mos kelmaydi"],
  "Surxondaryo viloyati": ["Qishloq xo'jaligi sektorida legalizatsiya past", "Oilalar ro'yxatida takrorlanish holatlari"],
  "Toshkent viloyati": [],
  "Fargʻona viloyati": ["Tadbirkorlikka jalb qilish rejasi bajarilmagan"],
  "Xorazm viloyati": ["Turizm yo'nalishida reja bajarilmagan holat"],
  "Toshkent shahri": [],
};

const regionNames = Object.keys(populationBase);

function roundOne(n: number): number {
  return Math.round(n * 10) / 10;
}

// Deterministic seed-like function based on name hash for consistent data
function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h) + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function buildRegionData(): RegionPovertyData[] {
  return regionNames.map(name => {
    const pop = populationBase[name];
    const rate = povertyRateMap[name];
    const status = statusMap[name];
    const hash = nameHash(name);
    const avgFamilySize = 4.5;

    const totalFamilies = Math.round(pop / avgFamilySize);
    const poorPop = Math.round(pop * (rate / 100));
    const poorFamilies = Math.round(totalFamilies * (rate / 100));
    const households = Math.round(totalFamilies * 0.92);
    const poorHouseholds = Math.round(poorFamilies * 0.95);

    // Removal plan
    const removalPlan = Math.round(poorFamilies * 0.35);
    const removalActualRate = status === "good" ? 0.85 : status === "moderate" ? 0.62 : 0.41;
    const removalActual = Math.round(removalPlan * removalActualRate);
    const removalPercent = roundOne((removalActual / removalPlan) * 100);
    const removedPop = Math.round(removalActual * avgFamilySize);

    // Category breakdown
    const stateSupportFamilies = Math.round(poorFamilies * 0.15);
    const stateSupportPop = Math.round(stateSupportFamilies * avgFamilySize);
    const stateSupportRemoved = Math.round(stateSupportFamilies * removalActualRate * 0.9);
    const stateSupportRedFlags: string[] = status === "bad" && (hash % 3 === 0) ? ["Davlat ta'minoti oilalari ro'yxati yangilanmagan"] : [];

    const poorFamilyCat = Math.round(poorFamilies * 0.55);
    const poorFamilyPop = Math.round(poorFamilyCat * avgFamilySize);
    const poorFamilyRemoved = Math.round(poorFamilyCat * removalActualRate * 0.95);
    const poorFamilyRedFlags: string[] = status === "bad" && (hash % 4 === 1) ? ["Kambag'al oilalar daromadi o'sish tendentsiyasi yo'q"] : [];

    const thresholdFamilies = poorFamilies - stateSupportFamilies - poorFamilyCat;
    const thresholdPop = Math.round(thresholdFamilies * avgFamilySize);
    const thresholdRemoved = Math.round(thresholdFamilies * removalActualRate);
    const thresholdRedFlags: string[] = status === "bad" && (hash % 5 === 2) ? ["Chegaradagi oilalar reestri to'liq emas"] : [];

    // Services
    const totalSvc = Math.round(poorFamilies * 0.6);
    const ish = Math.round(totalSvc * 0.35);
    const tadbir = Math.round(totalSvc * 0.32);
    const daromad = Math.round(totalSvc * 0.16);
    const legal = Math.round(totalSvc * 0.11);
    const kasb = Math.round(totalSvc * 0.06);

    const riskFamilies = Math.round(poorFamilies * 0.18 + (hash % 500));

    return {
      name,
      population: pop,
      totalFamilies,
      poorPopulation: poorPop,
      poorFamilies,
      households,
      poorHouseholds,
      povertyRate: rate,
      removedFamilies: removalActual,
      removedPopulation: removedPop,
      removalPlanYearly: removalPlan,
      removalActual,
      removalPercent,
      redFlags: redFlagsByRegion[name] || [],
      status,
      stateSupport: {
        families: stateSupportFamilies,
        population: stateSupportPop,
        removed: stateSupportRemoved,
        removedPop: Math.round(stateSupportRemoved * avgFamilySize),
        redFlags: stateSupportRedFlags,
      },
      poorFamily: {
        families: poorFamilyCat,
        population: poorFamilyPop,
        removed: poorFamilyRemoved,
        removedPop: Math.round(poorFamilyRemoved * avgFamilySize),
        redFlags: poorFamilyRedFlags,
      },
      povertyThreshold: {
        families: thresholdFamilies,
        population: thresholdPop,
        removed: thresholdRemoved,
        removedPop: Math.round(thresholdRemoved * avgFamilySize),
        redFlags: thresholdRedFlags,
      },
      services: { ish, tadbir, daromad, legal, kasb },
      riskFamilies,
    };
  });
}

export const regionsData: RegionPovertyData[] = buildRegionData();

// ---- Aggregated national stats ----
export const nationalStats = {
  totalPopulation: regionsData.reduce((s, r) => s + r.population, 0),
  totalFamilies: regionsData.reduce((s, r) => s + r.totalFamilies, 0),
  totalPoorPopulation: regionsData.reduce((s, r) => s + r.poorPopulation, 0),
  totalPoorFamilies: regionsData.reduce((s, r) => s + r.poorFamilies, 0),
  totalHouseholds: regionsData.reduce((s, r) => s + r.households, 0),
  totalPoorHouseholds: regionsData.reduce((s, r) => s + r.poorHouseholds, 0),
  avgPovertyRate: +(regionsData.reduce((s, r) => s + r.povertyRate * r.population, 0) / regionsData.reduce((s, r) => s + r.population, 0)).toFixed(1),
  totalRemovedFamilies: regionsData.reduce((s, r) => s + r.removedFamilies, 0),
  totalRemovedPopulation: regionsData.reduce((s, r) => s + r.removedPopulation, 0),
  totalRemovalPlan: regionsData.reduce((s, r) => s + r.removalPlanYearly, 0),
  totalRemovalActual: regionsData.reduce((s, r) => s + r.removalActual, 0),
  badCount: regionsData.filter(r => r.status === "bad").length,
  moderateCount: regionsData.filter(r => r.status === "moderate").length,
  goodCount: regionsData.filter(r => r.status === "good").length,
};
nationalStats["removalPercent" as any] = +(nationalStats.totalRemovalActual / nationalStats.totalRemovalPlan * 100).toFixed(1);

// ---- Annual removal plan methods ----
export interface RemovalMethod {
  id: string;
  name: string;
  plan: number;
  actual: number;
  percent: number;
  redFlags: string[];
}

export const removalMethods: RemovalMethod[] = [
  { id: "job", name: "Doimiy ish oʻrinlariga joylashtirish orqali", plan: 92127, actual: 61420, percent: 66.7, redFlags: [] },
  { id: "business", name: "Tadbirkorlikka jalb qilish orqali", plan: 84231, actual: 54750, percent: 65.0, redFlags: ["Ba'zi hududlarda tadbirkorlik subsidiyalari kechiktirilgan"] },
  { id: "income", name: "Kambagʻal oila daromadini oshirish orqali", plan: 42113, actual: 29479, percent: 70.0, redFlags: [] },
  { id: "legal", name: "Norasmiy faoliyatni legallashtirish orqali", plan: 28951, actual: 17371, percent: 60.0, redFlags: ["Legalizatsiya jarayoni sekin ketayapti"] },
  { id: "vocational", name: "Kasb-hunarga oʻrgatish orqali bandligini ta'minlash", plan: 15793, actual: 11055, percent: 70.0, redFlags: [] },
  { id: "infra", name: "Tadbirkorlik infratuzilmasini rivojlantirish orqali", plan: 25000, actual: 14250, percent: 57.0, redFlags: ["Moliyalashtirish kechikkan"] },
  { id: "forest", name: "Oʻrmon fondi yerlarida oʻrmonlar va koʻchatxonalar tashkil etish", plan: 2163, actual: 1514, percent: 70.0, redFlags: [] },
  { id: "pharma", name: "Farmatsevtika yoʻnalishida dorivor oʻsimliklar etshtirish", plan: 500, actual: 280, percent: 56.0, redFlags: ["Kooperatsiya tashkil etilmagan hududlar mavjud"] },
  { id: "tourism", name: "Turizm xizmatlarini rivojlantirish va mahallalar barpo etish", plan: 560, actual: 302, percent: 53.9, redFlags: ["Turizm infrastrukturasi yetarli emas"] },
  { id: "it", name: "Axborot texnologiyalari sohasida bepul oʻqitish orqali", plan: 5000, actual: 3350, percent: 67.0, redFlags: [] },
  { id: "college", name: "Texnikumlarda kasb-hunarga oʻqitish orqali", plan: 3652, actual: 2556, percent: 70.0, redFlags: [] },
  { id: "science", name: "Ilm-fan va texnologiyalarni rivojlantirish orqali", plan: 260, actual: 156, percent: 60.0, redFlags: ["Investitsiyalar yetarli emas"] },
];

export const totalRemovalPlanMethods = removalMethods.reduce((s, m) => s + m.plan, 0);
export const totalRemovalActualMethods = removalMethods.reduce((s, m) => s + m.actual, 0);
export const totalRemovalPercentMethods = +(totalRemovalActualMethods / totalRemovalPlanMethods * 100).toFixed(1);

// ---- Map helper: get region data by SVG name ----
export const getRegionBySvgName = (svgName: string): RegionPovertyData | null => {
  const fullName = getRegionFullName(svgName);
  if (!fullName) return null;
  return regionsData.find(r => r.name === fullName) || null;
};

// ---- Color helpers ----
export const getStatusColor = (status: "bad" | "moderate" | "good"): string => {
  switch (status) {
    case "bad": return "#E53E3E";
    case "moderate": return "#D69E2E";
    case "good": return "#38A169";
    default: return "#4A5568";
  }
};

export const getStatusLabel = (status: "bad" | "moderate" | "good"): string => {
  switch (status) {
    case "bad": return "Xavf ostida";
    case "moderate": return "Oʻrtacha";
    case "good": return "Yaxshi";
    default: return "Nomaʼlum";
  }
};

export const formatNumber = (num: number): string => {
  if (isNaN(num) || num === undefined || num === null) return "0";
  return new Intl.NumberFormat('ru-RU').format(Math.round(num));
};
