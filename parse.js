const fs = require('fs');

const raw = `I. Kambagʻal aholini daromadini oshirishga qaratilgan xizmatlar bilan qamrab olish	1 108,4	263 215	15 947	26 009	16 106	10 504	27 877	5 756	20 958	30 959	7 255	20 527	21 414	29 178	16 363	14 362
1.	Doimiy ish oʻrinlariga joylashtirish	387,9	92 127	5 580	9 103	5 639	3 677	9 757	2 015	7 336	10 834	2 540	7 186	7 495	10 213	5 726	5 026
2.	Tadbirkorlikka jalb qilish	354,9	84 231	5 105	8 322	5 149	3 363	8 922	1 839	6 704	9 911	2 321	6 570	6 853	9 333	5 238	4 601
3.	Kambagʻal oila daromadini oshirish	176,9	42 113	2 551	4 162	2 579	1 680	4 461	922	3 355	4 951	1 160	3 283	3 425	4 670	2 617	2 297
4.	Norasmiy faoliyatni legallashtirish	122,2	28 951	1 754	2 862	1 772	1 155	3 065	633	2 305	3 404	797	2 257	2 357	3 211	1 801	1 578
5.	Kasb-hunarga oʻrgatish orqali bandligini taʼminlash va boshqa yoʻnalishlar hisobiga	66,5	15 793	957	1 560	967	629	1 672	347	1 258	1 859	437	1 231	1 284	1 751	981	860
II. Kambagʻallikka tushish xavfi boʻlgan oilalar daromadini oshirishga qaratilgan xizmatlar bilan qamrab olish			48 221	2 896	4 774	2 931	1 925	5 160	1 051	3 856	5 680	1 321	3 744	3 933	5 367	2 955	2 628`;

const regions = [
  "Qoraqalpogʻiston Respublikasi", "Andijon viloyati", "Buxoro viloyati", 
  "Jizzax viloyati", "Qashqadaryo viloyati", "Navoiy viloyati", 
  "Namangan viloyati", "Samarqand viloyati", "Sirdaryo viloyati", 
  "Surxondaryo viloyati", "Toshkent viloyati", "Fargʻona viloyati", 
  "Xorazm viloyati", "Toshkent shahri"
];

const lines = raw.split('\n').map(l => l.replace(/\s+/g, ' ').trim());

function parseCols(line) {
   const matches = line.match(/[\d\s,]+$/);
   if (!matches) return [];
   const numStr = matches[0];
   const text = line.substring(0, line.length - numStr.length).trim();
   const nums = numStr.split(' ').map(s => parseInt(s.replace(',', ''))).filter(n => !isNaN(n));
   // wait, numbers in text have spaces as thousands separators.
}
// since the format has spaces as thousands separator, it's safer to just hand-parse or clean it.
`;
