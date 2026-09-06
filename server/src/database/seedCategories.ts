import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "@server/database/db.consts.js";
import { categories } from "@server/modules/category/category.module.js";
import { sql } from "drizzle-orm";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// ─── Category definitions ──────────────────────────────────────────────────────
// Based on Monobank's 30 official categories, mapped to MCC codes.
// Travel range: 3056-3999 (airlines 3056-3302, car rentals 3303-3499, hotels 3500-3999)
// plus additional transport/travel codes.

const CATEGORIES = [
  {
    name: "Auto & Gas Stations",
    shortDescriptionEn: "Auto & Gas Stations",
    shortDescriptionUa: "Авто та АЗС",
    fullDescriptionEn:
      "Car parts, various auto services, car washes, fuel and other related goods and services purchased at gas stations or specialized shops.",
    fullDescriptionUa:
      "Автозапчастини, різні види автосервісів та СТО, автомийки, нафтопродукти, газ та інші супутні товари і послуги, придбані на заправних станціях або в спеціалізованих магазинах.",
    mccCodes: [
      5013, 5014, 5172, 5511, 5521, 5531, 5532, 5533, 5541, 5542, 5552, 5561,
      5571, 5592, 5598, 5599, 5983, 7511, 7523, 7531, 7534, 7535, 7538, 7542,
      7549,
    ],
  },
  {
    name: "Charity",
    shortDescriptionEn: "Charity",
    shortDescriptionUa: "Благодійність",
    fullDescriptionEn:
      "Charitable, social service, civic, religious, and membership organizations.",
    fullDescriptionUa:
      "Благодійні, соціальні, громадські, релігійні організації та організації членства.",
    mccCodes: [8398, 8641, 8661, 8675, 8699],
  },
  {
    name: "Budget & Taxes",
    shortDescriptionEn: "Budget & Taxes",
    shortDescriptionUa: "Бюджет та податки",
    fullDescriptionEn:
      "Tax payments, government services, court costs, alimony, child support, and bail payments.",
    fullDescriptionUa:
      "Податкові платежі, державні послуги, судові витрати, аліменти, виплати на дітей та застави.",
    mccCodes: [8651, 9034, 9211, 9223, 9311, 9399, 9401, 9402, 9405, 9411],
  },
  {
    name: "Freight Transport",
    shortDescriptionEn: "Freight Transport",
    shortDescriptionUa: "Вантажні перевезення",
    fullDescriptionEn:
      "Motor freight carriers, air freight forwarders, and freight transport services.",
    fullDescriptionUa:
      "Автомобільні вантажоперевізники, авіаційні вантажні агенти та послуги вантажних перевезень.",
    mccCodes: [4213, 4214, 4731],
  },
  {
    name: "Wine",
    shortDescriptionEn: "Wine & Alcohol",
    shortDescriptionUa: "Вино",
    fullDescriptionEn:
      "Package stores, wholesale suppliers of beer, wine, and liquor.",
    fullDescriptionUa:
      "Магазини та оптові постачальники пива, вина та алкогольних напоїв.",
    mccCodes: [5715, 5921],
  },
  {
    name: "Cash",
    shortDescriptionEn: "Cash",
    shortDescriptionUa: "Готівка",
    fullDescriptionEn: "ATM cash withdrawals and cash advance transactions.",
    fullDescriptionUa:
      "Зняття готівки через банкомат та операції отримання готівкового авансу.",
    mccCodes: [6010, 6011],
  },
  {
    name: "Money Transfers",
    shortDescriptionEn: "Money Transfers",
    shortDescriptionUa: "Грошові перекази",
    fullDescriptionEn:
      "Wire transfers, money orders, currency exchange, and financial institution transfers.",
    fullDescriptionUa:
      "Банківські перекази, грошові перекази, обмін валюти та перекази між фінансовими установами.",
    mccCodes: [
      4829, 6531, 6532, 6533, 6534, 6535, 6536, 6537, 6538, 6539, 6540, 6611,
    ],
  },
  {
    name: "Investments",
    shortDescriptionEn: "Investments",
    shortDescriptionUa: "Інвестиції",
    fullDescriptionEn:
      "Securities brokers, investment dealers, and financial investment services.",
    fullDescriptionUa:
      "Брокери цінних паперів, інвестиційні дилери та фінансові інвестиційні послуги.",
    mccCodes: [6051, 6211, 6771],
  },
  {
    name: "Other",
    shortDescriptionEn: "Other",
    shortDescriptionUa: "Інше",
    fullDescriptionEn:
      "Miscellaneous goods and services that do not fit any other category.",
    fullDescriptionUa:
      "Різноманітні товари та послуги, що не відносяться до жодної іншої категорії.",
    mccCodes: [5999, 7299, 8664, 9700, 9950, 9999],
  },
  {
    name: "Stationery",
    shortDescriptionEn: "Stationery & Office",
    shortDescriptionUa: "Канцтовари",
    fullDescriptionEn:
      "Stationery stores, office supplies, business equipment and related goods.",
    fullDescriptionUa:
      "Канцелярські товари, офісне приладдя, ділове обладнання та супутні товари.",
    mccCodes: [5044, 5045, 5112, 5113, 5943],
  },
  {
    name: "Cafes & Restaurants",
    shortDescriptionEn: "Cafes & Restaurants",
    shortDescriptionUa: "Кафе та ресторани",
    fullDescriptionEn:
      "Restaurants, cafes, bars, fast food outlets, and catering services.",
    fullDescriptionUa:
      "Ресторани, кафе, бари, заклади швидкого харчування та послуги громадського харчування.",
    mccCodes: [5811, 5812, 5813, 5814],
  },
  {
    name: "Flowers",
    shortDescriptionEn: "Flowers",
    shortDescriptionUa: "Квіти",
    fullDescriptionEn:
      "Florists, flower shops, and floral supply wholesalers.",
    fullDescriptionUa:
      "Квіткові магазини, салони флористики та оптові постачальники квітів.",
    mccCodes: [5193, 5992],
  },
  {
    name: "Books",
    shortDescriptionEn: "Books & Press",
    shortDescriptionUa: "Книги",
    fullDescriptionEn:
      "Bookstores, newsstands, newspaper subscriptions, and publishing services.",
    fullDescriptionUa:
      "Книжкові магазини, газетні кіоски, передплата газет і журналів та видавничі послуги.",
    mccCodes: [2741, 5111, 5192, 5942, 5994],
  },
  {
    name: "Utilities & Internet",
    shortDescriptionEn: "Utilities & Internet",
    shortDescriptionUa: "Комуналка та інтернет",
    fullDescriptionEn:
      "Electricity, gas, water, internet, cable TV, and telephone utility payments.",
    fullDescriptionUa:
      "Оплата електроенергії, газу, води, інтернету, кабельного телебачення та телефонних послуг.",
    mccCodes: [4811, 4812, 4813, 4814, 4816, 4821, 4899, 4900, 4911, 4924, 4941, 4991],
  },
  {
    name: "Beauty & Health",
    shortDescriptionEn: "Beauty & Health",
    shortDescriptionUa: "Краса та здоров'я",
    fullDescriptionEn:
      "Beauty salons, pharmacies, medical services, hospitals, and health-related goods.",
    fullDescriptionUa:
      "Салони краси, аптеки, медичні послуги, лікарні та товари для здоров'я.",
    mccCodes: [
      4119, 5047, 5122, 5292, 5295, 5912, 5975, 5976, 5977, 7230, 7297, 7298,
      8011, 8021, 8031, 8041, 8042, 8043, 8049, 8050, 8062, 8071, 8099,
    ],
  },
  {
    name: "Courier Services",
    shortDescriptionEn: "Courier Services",
    shortDescriptionUa: "Кур'єрські послуги",
    fullDescriptionEn:
      "Courier, express delivery, and air freight services.",
    fullDescriptionUa:
      "Кур'єрські послуги, експрес-доставка та авіаційні вантажні послуги.",
    mccCodes: [4215, 4225],
  },
  {
    name: "Clothing & Footwear",
    shortDescriptionEn: "Clothing & Footwear",
    shortDescriptionUa: "Одяг та взуття",
    fullDescriptionEn:
      "Clothing stores, shoe stores, tailors, and fashion accessories.",
    fullDescriptionUa:
      "Магазини одягу, взуття, послуги кравця та модні аксесуари.",
    mccCodes: [
      5131, 5137, 5139, 5611, 5621, 5631, 5641, 5651, 5655, 5661, 5681, 5691,
      5697, 5698, 5699, 5931, 5948, 5949, 7251, 7296,
    ],
  },
  {
    name: "Home Appliances",
    shortDescriptionEn: "Home Appliances & Electronics",
    shortDescriptionUa: "Побутова техніка",
    fullDescriptionEn:
      "Consumer electronics, household appliances, computers, and home goods stores.",
    fullDescriptionUa:
      "Електроніка, побутова техніка, комп'ютери та магазини товарів для дому.",
    mccCodes: [5045, 5064, 5065, 5722, 5731, 5732, 5734, 5735, 5736, 5946],
  },
  {
    name: "Loan Repayment",
    shortDescriptionEn: "Loan Repayment",
    shortDescriptionUa: "Погашення кредиту",
    fullDescriptionEn:
      "Loan and credit repayments to financial institutions and banks.",
    fullDescriptionUa:
      "Погашення кредитів та позик у фінансових установах і банках.",
    mccCodes: [6012],
  },
  {
    name: "Travel",
    shortDescriptionEn: "Travel",
    shortDescriptionUa: "Подорожі",
    fullDescriptionEn:
      "Airlines, car rentals, hotels, travel agencies, trains, ferries, and all travel-related services.",
    fullDescriptionUa:
      "Авіаквитки, оренда авто, готелі, туристичні агентства, потяги, пороми та інші туристичні послуги.",
    mccCodes: [
      // Airlines (3056-3302), Car Rentals (3303-3499), Hotels/Lodging (3500-3999)
      ...range(3056, 3999),
      // Rail, local transport, ferries, buses
      4011, 4111, 4112, 4131,
      // Bridges, tolls, steamship
      4304, 4411, 4415, 4418, 4457, 4468,
      // Air transport, airports, travel agencies
      4511, 4582, 4722, 4784, 4789,
      // Vacation packages, timeshares
      5962, 6513,
      // Hotels, lodging, campgrounds, trailer parks, boat rentals
      7011, 7032, 7033, 7512, 7513, 7519,
    ],
  },
  {
    name: "Mobile Top-up",
    shortDescriptionEn: "Mobile Top-up",
    shortDescriptionUa: "Поповнення мобільного",
    fullDescriptionEn:
      "Mobile phone top-ups, telephone equipment, and communication services.",
    fullDescriptionUa:
      "Поповнення мобільного телефону, телефонне обладнання та послуги зв'язку.",
    mccCodes: [4814],
  },
  {
    name: "Groceries & Supermarkets",
    shortDescriptionEn: "Groceries & Supermarkets",
    shortDescriptionUa: "Продукти та супермаркети",
    fullDescriptionEn:
      "Supermarkets, grocery stores, convenience stores, and specialized food and beverage shops.",
    fullDescriptionUa:
      "Супермаркети, продуктові магазини, магазини біля дому та спеціалізовані магазини з продуктами харчування та напоями.",
    mccCodes: [
      5297, 5298, 5300, 5311, 5331, 5399, 5411, 5412, 5422, 5441, 5451, 5462,
      5499,
    ],
  },
  {
    name: "Advertising",
    shortDescriptionEn: "Advertising Services",
    shortDescriptionUa: "Рекламні послуги",
    fullDescriptionEn:
      "Advertising agencies, outdoor advertising, and marketing services.",
    fullDescriptionUa:
      "Рекламні агентства, зовнішня реклама та маркетингові послуги.",
    mccCodes: [7311, 7312, 7313],
  },
  {
    name: "Repair & Construction",
    shortDescriptionEn: "Repair & Construction",
    shortDescriptionUa: "Ремонт",
    fullDescriptionEn:
      "Construction, renovation, repair services, building materials, and home improvement.",
    fullDescriptionUa:
      "Будівництво, реконструкція, ремонтні послуги, будівельні матеріали та покращення житла.",
    mccCodes: [
      1520, 1711, 1731, 1740, 1750, 1761, 1771, 1799, 5031, 5039, 5051, 5072,
      5074, 5211, 5251, 7622, 7629, 7631, 7641, 7692, 7699,
    ],
  },
  {
    name: "Entertainment & Sports",
    shortDescriptionEn: "Entertainment & Sports",
    shortDescriptionUa: "Розваги та спорт",
    fullDescriptionEn:
      "Entertainment venues, sports facilities, gaming, cinemas, concerts, and recreational activities.",
    fullDescriptionUa:
      "Розважальні заклади, спортивні об'єкти, ігри, кінотеатри, концерти та дозвілля.",
    mccCodes: [
      5733, 5815, 5816, 5817, 5818, 5940, 5941, 5945, 5946, 5947, 5970, 5971,
      5972, 5973, 7221, 7333, 7392, 7395, 7829, 7832, 7841, 7929, 7933, 7941,
      7991, 7992, 7993, 7995, 7996, 7997, 7998, 7999,
    ],
  },
  {
    name: "Insurance",
    shortDescriptionEn: "Insurance",
    shortDescriptionUa: "Страхування",
    fullDescriptionEn:
      "Insurance companies, life insurance, property insurance, and related financial services.",
    fullDescriptionUa:
      "Страхові компанії, страхування життя, майнове страхування та пов'язані фінансові послуги.",
    mccCodes: [5960, 6300, 6381, 6399],
  },
  {
    name: "Taxi",
    shortDescriptionEn: "Taxi",
    shortDescriptionUa: "Таксі",
    fullDescriptionEn: "Taxi and ridesharing services.",
    fullDescriptionUa: "Послуги таксі та каршерингу.",
    mccCodes: [4121],
  },
  {
    name: "Pets",
    shortDescriptionEn: "Pets",
    shortDescriptionUa: "Тварини",
    fullDescriptionEn:
      "Pet shops, veterinary clinics, and animal care services.",
    fullDescriptionUa:
      "Зоомагазини, ветеринарні клініки та послуги догляду за тваринами.",
    mccCodes: [742, 5995],
  },
  {
    name: "Fines",
    shortDescriptionEn: "Fines & Penalties",
    shortDescriptionUa: "Штрафи",
    fullDescriptionEn:
      "Traffic fines, administrative penalties, and court-related payments.",
    fullDescriptionUa:
      "Штрафи за порушення правил дорожнього руху, адміністративні стягнення та судові платежі.",
    mccCodes: [9222],
  },
  {
    name: "Jewelry",
    shortDescriptionEn: "Jewelry",
    shortDescriptionUa: "Ювелірні вироби",
    fullDescriptionEn:
      "Jewelry stores, watch shops, and precious metal goods.",
    fullDescriptionUa:
      "Ювелірні магазини, магазини годинників та вироби з дорогоцінних металів.",
    mccCodes: [5094, 5944],
  },
] as const;

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding consolidated Monobank-style categories...");

  const db = drizzle(DATABASE_URL);

  // Remove all existing system categories (user_id IS NULL)
  const deleted = await db
    .delete(categories)
    .where(sql`${categories.userId} IS NULL`)
    .returning({ id: categories.id });

  console.log(`Removed ${deleted.length} old system categories`);

  // Insert new consolidated categories
  const values = CATEGORIES.map((cat) => ({
    userId: null as unknown as number,
    name: cat.name,
    isComposite: false,
    mccCodes: cat.mccCodes as unknown as number[],
    shortDescriptionEn: cat.shortDescriptionEn,
    shortDescriptionUa: cat.shortDescriptionUa,
    fullDescriptionEn: cat.fullDescriptionEn,
    fullDescriptionUa: cat.fullDescriptionUa,
  }));

  const inserted = await db
    .insert(categories)
    .values(values)
    .returning({ id: categories.id, name: categories.name });

  console.log(`Inserted ${inserted.length} categories:`);
  inserted.forEach((c) => console.log(`     - ${c.name}`));

  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .where(sql`${categories.userId} IS NULL`);

  console.log(`\nTotal system categories in DB: ${count.count}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
