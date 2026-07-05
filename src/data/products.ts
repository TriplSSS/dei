export type ProductSpec = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: "welding" | "light" | "centrators" | "consumables";
  categoryLabel: string;
  price: string;
  priceNum: number;
  img: string;
  description: string;
  fullDescription: string;
  specs: ProductSpec[];
  tags: string[];
  naks?: boolean;
  featured?: boolean;
};

export const CATEGORIES = [
  { key: "all",         label: "Все" },
  { key: "welding",     label: "Сварочные аппараты" },
  { key: "light",       label: "Светильники" },
  { key: "centrators",  label: "Центраторы" },
  { key: "consumables", label: "Расходники" },
] as const;

export const PRODUCTS: Product[] = [
  {
    slug: "proton-dei-vdi-200",
    name: "ПРОТОН-ДЭИ ВДИ 200",
    shortName: "ВДИ 200",
    category: "welding",
    categoryLabel: "Инвертор",
    price: "от 18 500 ₽",
    priceNum: 18500,
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&q=80",
    description: "Универсальный сварочный инвертор MMA/TIG. Аттестован НАКС.",
    fullDescription: "Флагманский инвертор собственной разработки и производства ДонЭлектроИнтел. Прошёл аттестацию НАКС и рекомендован для сварки ответственных конструкций в нефтегазовой, строительной и промышленной отраслях. Запатентованные схемотехнические решения обеспечивают стабильную дугу в широком диапазоне напряжений питания.",
    specs: [
      { label: "Режим сварки",   value: "MMA / TIG" },
      { label: "Ток сварки",     value: "10–200 А" },
      { label: "Питание",        value: "~220 В ±15%" },
      { label: "Электрод",       value: "до 5 мм" },
      { label: "ПВ при 160 А",   value: "60%" },
      { label: "Вес",            value: "4.8 кг" },
      { label: "КПД",            value: "85%" },
      { label: "Степень защиты", value: "IP21" },
    ],
    tags: ["MMA", "TIG", "НАКС", "нефтегаз", "промышленность"],
    naks: true,
    featured: true,
  },
  {
    slug: "proton-dei-vdi-180",
    name: "ПРОТОН-ДЭИ ВДИ 180",
    shortName: "ВДИ 180",
    category: "welding",
    categoryLabel: "Инвертор",
    price: "от 14 900 ₽",
    priceNum: 14900,
    img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80",
    description: "Компактный инвертор MMA для бытовых и ремонтных работ.",
    fullDescription: "Облегчённая версия серии ПРОТОН-ДЭИ для работ в стеснённых условиях и на выезде. Компактный корпус, защита от перегрева и помехозащищённый IGBT-модуль.",
    specs: [
      { label: "Режим сварки",   value: "MMA" },
      { label: "Ток сварки",     value: "10–180 А" },
      { label: "Питание",        value: "~220 В" },
      { label: "Электрод",       value: "до 4 мм" },
      { label: "ПВ при 140 А",   value: "60%" },
      { label: "Вес",            value: "3.4 кг" },
    ],
    tags: ["MMA", "бытовой", "компактный"],
    featured: false,
  },
  {
    slug: "proton-dei-vdu-315",
    name: "ПРОТОН-ДЭИ ВДУ 315",
    shortName: "ВДУ 315",
    category: "welding",
    categoryLabel: "Полуавтомат",
    price: "от 54 000 ₽",
    priceNum: 54000,
    img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop&q=80",
    description: "Полуавтомат MIG/MAG для промышленных и монтажных работ.",
    fullDescription: "Профессиональный сварочный полуавтомат для сварки в среде защитных газов. Трёхфазное питание, плавная регулировка скорости подачи проволоки, цифровой дисплей.",
    specs: [
      { label: "Режим сварки",   value: "MIG / MAG" },
      { label: "Ток сварки",     value: "30–315 А" },
      { label: "Питание",        value: "3×380 В" },
      { label: "Проволока",      value: "0.8–1.6 мм" },
      { label: "ПВ при 250 А",   value: "60%" },
      { label: "Вес",            value: "28 кг" },
    ],
    tags: ["MIG", "MAG", "промышленность", "монтаж"],
    featured: true,
  },
  {
    slug: "led-dei-120",
    name: "LED-DEI-120",
    shortName: "LED 120 Вт",
    category: "light",
    categoryLabel: "Светильник",
    price: "от 8 200 ₽",
    priceNum: 8200,
    img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600&fit=crop&q=80",
    description: "Промышленный LED-светильник 120 Вт для цехов и складов.",
    fullDescription: "Светильник для промышленных объектов: производственные цеха, склады, ангары. Высокий IP65 — защита от пыли и струй воды. Пятилетняя гарантия на источник питания.",
    specs: [
      { label: "Мощность",         value: "120 Вт" },
      { label: "Световой поток",   value: "15 600 лм" },
      { label: "Цветовая температура", value: "5 000 К" },
      { label: "CRI",              value: ">80" },
      { label: "Степень защиты",   value: "IP65" },
      { label: "Ресурс",           value: "50 000 ч" },
      { label: "Гарантия",         value: "5 лет" },
    ],
    tags: ["IP65", "промышленный", "цех", "склад"],
    featured: true,
  },
  {
    slug: "led-dei-60-street",
    name: "LED-DEI-60 Street",
    shortName: "LED Street 60 Вт",
    category: "light",
    categoryLabel: "Уличный",
    price: "от 5 800 ₽",
    priceNum: 5800,
    img: "https://images.unsplash.com/photo-1610908740027-2d7e4ab6a4d6?w=800&h=600&fit=crop&q=80",
    description: "Уличный светодиодный светильник 60 Вт для дорог и парковок.",
    fullDescription: "Консольный уличный светильник для освещения дорог, парковок, территорий предприятий. Широкий температурный диапазон эксплуатации, защита от вандализма.",
    specs: [
      { label: "Мощность",         value: "60 Вт" },
      { label: "Световой поток",   value: "8 000 лм" },
      { label: "Степень защиты",   value: "IP66" },
      { label: "Температура",      value: "−40…+50 °C" },
      { label: "Ресурс",           value: "60 000 ч" },
      { label: "Гарантия",         value: "5 лет" },
    ],
    tags: ["IP66", "уличный", "дорога", "парковка"],
    featured: false,
  },
  {
    slug: "led-dei-40-warehouse",
    name: "LED-DEI-40 Склад",
    shortName: "LED Склад 40 Вт",
    category: "light",
    categoryLabel: "Складской",
    price: "от 3 400 ₽",
    priceNum: 3400,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80",
    description: "Экономичный светильник 40 Вт для офисов и складов.",
    fullDescription: "Линейный потолочный светильник для офисных помещений, коридоров и складов с небольшой высотой потолка. Равномерное рассеивание света, мягкий спектр.",
    specs: [
      { label: "Мощность",         value: "40 Вт" },
      { label: "Световой поток",   value: "5 200 лм" },
      { label: "Степень защиты",   value: "IP54" },
      { label: "Крепление",        value: "подвес / накладное" },
      { label: "Ресурс",           value: "50 000 ч" },
    ],
    tags: ["IP54", "офис", "склад", "экономичный"],
    featured: false,
  },
  {
    slug: "czn-159-426",
    name: "ЦЗН 159-426",
    shortName: "ЦЗН 159-426",
    category: "centrators",
    categoryLabel: "Центратор",
    price: "от 24 000 ₽",
    priceNum: 24000,
    img: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&h=600&fit=crop&q=80",
    description: "Наружный центратор звенного типа для труб Ø 159–426 мм.",
    fullDescription: "Звенный наружный центратор для сборки и центровки стыков трубопроводов под сварку. Подходит для трубопроводов нефтяной и газовой промышленности. Надёжная фиксация стыка, быстрая установка.",
    specs: [
      { label: "Диаметр труб",   value: "159–426 мм" },
      { label: "Тип",            value: "наружный звенный" },
      { label: "Материал",       value: "сталь 40Х" },
      { label: "Масса",          value: "12 кг" },
    ],
    tags: ["трубопровод", "нефтегаз", "монтаж", "сборка"],
    featured: true,
  },
  {
    slug: "csn-57-159",
    name: "ЦСН 57-159",
    shortName: "ЦСН 57-159",
    category: "centrators",
    categoryLabel: "Центратор",
    price: "от 9 500 ₽",
    priceNum: 9500,
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80",
    description: "Наружный центратор для труб малого диаметра Ø 57–159 мм.",
    fullDescription: "Компактный наружный центратор для труб малого диаметра. Используется при монтаже трубопроводов коммунальной инфраструктуры, теплосетей, производственных трубопроводов.",
    specs: [
      { label: "Диаметр труб", value: "57–159 мм" },
      { label: "Тип",          value: "наружный" },
      { label: "Материал",     value: "сталь" },
      { label: "Масса",        value: "4.5 кг" },
    ],
    tags: ["трубопровод", "малый диаметр", "коммунальный"],
    featured: false,
  },
  {
    slug: "electrody-mr3",
    name: "Электроды МР-3 d3.0",
    shortName: "МР-3 d3.0",
    category: "consumables",
    categoryLabel: "Электроды",
    price: "от 1 200 ₽",
    priceNum: 1200,
    img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&h=600&fit=crop&q=80",
    description: "Электроды МР-3 для ручной дуговой сварки. Упаковка 5 кг.",
    fullDescription: "Электроды с рутиловым покрытием для сварки конструкционных нелегированных сталей. Устойчивое горение дуги на постоянном и переменном токе, минимальное разбрызгивание.",
    specs: [
      { label: "Диаметр",    value: "3.0 мм" },
      { label: "Покрытие",   value: "рутиловое" },
      { label: "Упаковка",   value: "5 кг" },
      { label: "Ток",        value: "постоянный / переменный" },
    ],
    tags: ["MMA", "рутиловые", "конструкционная сталь"],
    featured: false,
  },
  {
    slug: "electrody-uoni",
    name: "Электроды УОНИ 13/55 d4.0",
    shortName: "УОНИ 13/55",
    category: "consumables",
    categoryLabel: "Электроды",
    price: "от 1 900 ₽",
    priceNum: 1900,
    img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&q=80",
    description: "Электроды УОНИ для ответственных конструкций. Упаковка 5 кг.",
    fullDescription: "Электроды с основным покрытием для сварки ответственных конструкций, в том числе в условиях пониженных температур. Пониженное содержание водорода, высокая ударная вязкость наплавленного металла.",
    specs: [
      { label: "Диаметр",    value: "4.0 мм" },
      { label: "Покрытие",   value: "основное" },
      { label: "Упаковка",   value: "5 кг" },
      { label: "Ток",        value: "постоянный обратная полярность" },
    ],
    tags: ["MMA", "основные", "ответственные конструкции", "низкие температуры"],
    featured: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured);
}
