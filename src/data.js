export const contact = {
  address: "Улаанбаатар, Сүхбаатар дүүрэг",
  phone: "+976 7700-0000",
  email: "info@brandify.mn",
  social: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

/* Нэг хуудасны цэс. id нь хуудас доторх section-ий id-тай таарна. */
export const navLinks = [
  { id: "home", label: "Нүүр" },
  { id: "about", label: "Бидний тухай" },
  { id: "services", label: "Үйлчилгээ" },
  { id: "portfolio", label: "Гүйцэтгэсэн ажил" },
  { id: "contact", label: "Холбоо барих" },
];

const allServices = [
  {
    id: "01",
    title: "Маркетингийн стратеги",
    desc: "Зөв төлөвлөгөө. Зөв чиглэл. Зөв хэрэглэгч.",
    points: [
      "Зах зээлийн судалгаа, шинжилгээ",
      "STP стратеги ба 4P / 7P",
      "Customer Journey & Funnel",
      "Marketing Audit",
    ],
    cta: "Стратеги боловсруулах",
  },
  {
    id: "02",
    title: "Брэнд хөгжүүлэлт",
    desc: "Таны бизнесийг зах зээлд ялгарч харагдах брэнд болгоно.",
    points: [
      "Brand positioning & Naming",
      "Brand story & Slogan",
      "Logo & Visual identity",
      "Brand book & Guideline",
    ],
    cta: "Брэндээ хөгжүүлэх",
  },
  {
    id: "03",
    title: "Контент & Social Media",
    desc: "Зүгээр нэг пост биш — зорилготой бөгөөд үнэ цэнэтэй контент.",
    points: [
      "Social media & Content strategy",
      "Copywriting & Graphic design",
      "Reels / TikTok контент",
      "Community management",
    ],
    cta: "Контент төлөвлөгөө авах",
  },
  {
    id: "04",
    title: "Кампанит ажил",
    desc: "Анхны санаанаас эхлээд бодит үр дүн хүртэлх цогц аян.",
    points: [
      "Campaign strategy & Concept",
      "Product launch & Sales campaign",
      "Influencer & PR campaign",
      "Event campaign",
    ],
    cta: "Кампанит ажил эхлүүлэх",
  },
  {
    id: "05",
    title: "Дижитал сурталчилгаа & Growth",
    desc: "Зөв хүнд хүрч, хүссэн үр дүнгээ богино хугацаанд гаргана.",
    points: [
      "Meta, TikTok & Google Ads",
      "Targeting & Retargeting",
      "A/B testing",
      "Landing page & Sales funnel",
    ],
    cta: "Growth шийдэл авах",
  },
  {
    id: "06",
    title: "Lead Generation & Lead Nurturing",
    desc: "Сонирхогчийг танай байнгын харилцагч болгон хувиргах систем.",
    points: [
      "Lead magnet & Consultation",
      "Email & Messenger marketing",
      "Follow-up system",
      "CRM & Automation",
    ],
    cta: "Lead систем байгуулах",
  },
  {
    id: "07",
    title: "Хэрэглэгч хадгалалт & Loyalty",
    desc: "Нэг удаагийн худалдан авагчийг үнэнч хэрэглэгч болгоно.",
    points: [
      "Customer retention strategy",
      "Loyalty program",
      "Repeat purchase & Referral",
      "Community building",
    ],
    cta: "Хэрэглэгчээ хадгалах",
  },
  {
    id: "08",
    title: "Analytics & Growth",
    desc: "Таамгаар биш, бодит дата болон тоон үзүүлэлтээр шийднэ.",
    points: [
      "Marketing KPI & Performance",
      "ROAS / ROI шинжилгээ",
      "Monthly report",
      "Growth recommendation",
    ],
    cta: "Үр дүнгээ хэмжих",
  },
];

// Үндсэн 4 үйлчилгээ
const CORE = ["01", "02", "03", "05"];
export const services = allServices.filter((s) => CORE.includes(s.id));

export const AUDIT_OPTION = "Маркетингийн аудит (үнэгүй)";
export const serviceOptions = [AUDIT_OPTION, ...services.map((s) => s.title)];

export const journey = [
  {
    t: "Танихгүй хүн",
    s: "Брэндийн талаар мэдээлэлгүй байгаа шинэ хэрэглэгч.",
  },
  {
    t: "Сонирхогч",
    s: "Контент болон зар сурталчилгааг сонирхон харж буй хэрэглэгч.",
  },
  {
    t: "Боломжит хэрэглэгч",
    s: "Холбоо барих мэдээллээ үлдээсэн эсвэл үнийн санал сонирхсон хэрэглэгч.",
  },
  { t: "Харилцагч", s: "Анхны худалдан авалтаа хийсэн хэрэглэгч." },
  {
    t: "Дахин худалдан авагч",
    s: "Дахин худалдан авалт хийж, сэтгэл ханамж өндөр байгаа хэрэглэгч.",
  },
  { t: "Үнэнч хэрэглэгч", s: "Байнгын үйлчлүүлэгч болсон хэрэглэгч." },
  {
    t: "Брэндийг дэмжигч",
    s: "Бусдад брэндийг санал болгож, идэвхтэй сурталчилдаг хэрэглэгч.",
  },
];

export const categories = [
  "Бүгд",
  "Брэндинг & Стратеги",
  "Дижитал маркетинг",
  "Контент & Social Media",
  "Кампанит ажил",
];

export const projects = [
  {
    id: 1,
    title: "Aura Luxury Skincare",
    category: "Брэндинг & Стратеги",
    client: "Аура ХХК",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    desc: "Арьс арчилгааны премиум брэндийн Visual Identity, Brand book болон стратегийн шинэчлэл.",
  },
  {
    id: 2,
    title: "Nomad Coffee Roasters",
    category: "Дижитал маркетинг",
    client: "Номад Кофе",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
    desc: "Сошиал медиа контент стратеги болон Meta Ads сурталчилгааны цогц менежмент.",
  },
  {
    id: 3,
    title: "Lumina Tech Solutions",
    category: "Контент & Social Media",
    client: "Лумина Тех",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    desc: "B2B технологийн компанид зориулсан inbound контент төлөвлөлт ба Reels бүтээлт.",
  },
  {
    id: 4,
    title: "Vogue Fashion Week UB",
    category: "Кампанит ажил",
    client: "Вог Монголиа",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
    desc: "Загварын долоо хоногийн нээлтийн кампанит ажил, инфлүүнсер маркетинг болон PR менежмент.",
  },
  {
    id: 5,
    title: "Khoridol Eco Resort",
    category: "Брэндинг & Стратеги",
    client: "Хоридол Ресорт",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    desc: "Аялал жуулчлалын брэндийн нэршил (Naming), лого дизайн болон сторителинг.",
  },
  {
    id: 6,
    title: "Zenith Real Estate",
    category: "Дижитал маркетинг",
    client: "Зенит Проперти",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
    desc: "Үл хөдлөх хөрөнгийн төслийн Lead Generation систем ба Landing page хөгжүүлэлт.",
  },
];

/* Үйлчилгээ · Гүйцэтгэсэн ажил · Холбоо барих хэсгүүдэд нийтлэг пастел градиент */
export const palettes = [
  ['#a9b8d0', '#f5f6fa'],
  ['#f4f5f8', '#f3d3cf'],
  ['#f4f5f8', '#cdd6ea'],
  ['#e6e0f2', '#f8f6fb'],
  ['#d3e4dc', '#f6f9f7'],
  ['#f4f5f8', '#e8dac4'],
  ['#f5d9d4', '#fbf8f6'],
  ['#c6d1e5', '#f5f6fa'],
]
