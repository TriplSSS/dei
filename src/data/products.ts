export type ProductSpec = { label: string; value: string };
export type ProductAvailabilityStatus = "in_stock" | "on_order" | "preorder" | "out_of_stock";
export type ProductGalleryImage = { url: string; alt?: string; title?: string };
export type ProductDocument = { type: string; title: string; url: string };
export type ProductVariant = {
  sku?: string;
  title: string;
  options?: Record<string, string>;
  price?: number;
  stock?: number;
  leadTime?: string;
};

export type ProductCategory = {
  key: string;
  label: string;
  description?: string;
  sortOrder?: number;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
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
  sku?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  series?: string;
  subcategory?: string;
  availabilityStatus?: ProductAvailabilityStatus;
  stockQuantity?: number;
  leadTime?: string;
  deliveryNote?: string;
  saleUnit?: string;
  minOrderQuantity?: number;
  oldPrice?: number;
  wholesalePrice?: number;
  vatRate?: number;
  vatIncluded?: boolean;
  gallery?: ProductGalleryImage[];
  documents?: ProductDocument[];
  seoTitle?: string;
  seoDescription?: string;
  sortOrder?: number;
  variants?: ProductVariant[];
};

export const DEFAULT_CATEGORIES: ProductCategory[] = [
  {
    key: "welding",
    label: "Сварочные аппараты",
    description: "Оборудование для ручной дуговой и производственной сварки.",
    sortOrder: 10,
  },
  {
    key: "light",
    label: "Светильники",
    description: "Светодиодное оборудование для промышленных и рабочих зон.",
    sortOrder: 20,
  },
];

export const CATEGORIES = [
  { key: "all", label: "Все" },
  ...DEFAULT_CATEGORIES,
];

export const PRODUCTS: Product[] = [
  {
    slug: "svarochnyy-apparat-proton",
    name: "Сварочный аппарат Протон",
    shortName: "Протон",
    category: "welding",
    categoryLabel: "Сварочный аппарат",
    price: "от 18 500 ₽",
    priceNum: 18500,
    img: "/products/proton-welder.jpg",
    description: "Компактный сварочный аппарат для ручной дуговой сварки.",
    fullDescription:
      "Компактный сварочный аппарат для ручной дуговой сварки, ремонтных и производственных работ. Комплектацию, срок поставки и точную стоимость подтвердит специалист после уточнения задачи.",
    specs: [
      { label: "Тип", value: "ручная дуговая сварка" },
      { label: "Назначение", value: "ремонт и производство" },
      { label: "Питание", value: "220 В" },
      { label: "Поставка", value: "под заказ" },
    ],
    tags: ["сварка", "Протон", "ручная дуговая сварка"],
    featured: true,
    brand: "DEI",
    model: "Протон",
    availabilityStatus: "on_order",
    leadTime: "уточняется",
    deliveryNote: "Поставка и счет после согласования заказа",
    saleUnit: "шт.",
    minOrderQuantity: 1,
    vatIncluded: true,
    gallery: [
      {
        url: "/products/proton-welder.jpg",
        alt: "Сварочный аппарат Протон",
        title: "Сварочный аппарат Протон",
      },
    ],
    seoTitle: "Сварочный аппарат Протон | DEI",
    seoDescription: "Сварочный аппарат Протон для ручной дуговой сварки в каталоге DEI.",
    sortOrder: 10,
  },
  {
    slug: "svetodiodnyy-svetilnik-kobra",
    name: "Светодиодный светильник Кобра",
    shortName: "Кобра",
    category: "light",
    categoryLabel: "Светильник",
    price: "от 8 200 ₽",
    priceNum: 8200,
    img: "/products/kobra-led.jpg",
    description: "Светодиодный светильник для промышленного и рабочего освещения.",
    fullDescription:
      "Светодиодный светильник в металлическом корпусе для производственных и рабочих зон. Вариант исполнения, срок поставки и точную стоимость подтвердит специалист после уточнения объекта.",
    specs: [
      { label: "Тип", value: "светодиодный светильник" },
      { label: "Назначение", value: "рабочее освещение" },
      { label: "Корпус", value: "металлический" },
      { label: "Поставка", value: "под заказ" },
    ],
    tags: ["свет", "Кобра", "промышленное освещение"],
    featured: true,
    brand: "DEI",
    model: "Кобра",
    availabilityStatus: "on_order",
    leadTime: "уточняется",
    deliveryNote: "Поставка и счет после согласования заказа",
    saleUnit: "шт.",
    minOrderQuantity: 1,
    vatIncluded: true,
    gallery: [
      {
        url: "/products/kobra-led.jpg",
        alt: "Светодиодный светильник Кобра",
        title: "Светодиодный светильник Кобра",
      },
    ],
    seoTitle: "Светодиодный светильник Кобра | DEI",
    seoDescription: "Светодиодный светильник Кобра для промышленного освещения в каталоге DEI.",
    sortOrder: 20,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}
