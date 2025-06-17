import {
  ChevronRight,
  BarChart3,
  Home,
  LandPlot,
  WalletCards,
  Briefcase,
  Store,
  Cloud,
  Sprout,
  Apple,
  Wheat,
  SunMedium,
  Plane,
  Leaf,
  Bean,
  Utensils,
  Beef,
  Bug,
} from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "परिवर्तन गाउँपालिका आर्थिक अवस्था | डिजिटल प्रोफाइल",
  description:
    "परिवर्तन गाउँपालिकाको आर्थिक तथ्याङ्क: घरपरिवारको आय स्रोत, खेती, पशुपालन, रोजगारी, व्यावसायिक क्षेत्र, उत्पादन विवरण र आर्थिक विकास सम्बन्धी जानकारी।",
  keywords: [
    "परिवर्तन गाउँपालिका",
    "आर्थिक अवस्था",
    "कृषि",
    "पशुपालन",
    "रोजगारी",
    "सिंचाई",
    "घरधुरी",
    "कृषि उत्पादन",
    "वैदेशिक रोजगारी",
    "विप्रेषण",
  ],
  openGraph: {
    title: "परिवर्तन गाउँपालिका आर्थिक अवस्था | डिजिटल प्रोफाइल",
    description:
      "परिवर्तन गाउँपालिकाको आर्थिक तथ्याङ्क: घरपरिवारको आय स्रोत, खेती, पशुपालन, रोजगारी, व्यावसायिक क्षेत्र, उत्पादन विवरण र आर्थिक विकास सम्बन्धी जानकारी।",
    type: "article",
    locale: "ne_NP",
    siteName: "परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख आर्थिक तथ्यहरू", slug: "key-economics" },
  { level: 2, text: "आर्थिक श्रेणीहरू", slug: "economic-categories" },
  { level: 2, text: "कृषि तथा पशुपालन", slug: "agriculture-livestock" },
];

const economicCategories = [
  {
    title: "घरको स्वामित्वको आधारमा घरधुरी",
    description:
      "परिवर्तन गाउँपालिकामा घरको स्वामित्व (आफ्नै, भाडा, संस्थागत आदि) अनुसार घरधुरी वितरण।",
    href: "/profile/economics/ward-wise-house-ownership",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "बाहिरी गारोको आधारमा घरधुरी",
    description:
      "परिवर्तन गाउँपालिकामा घरको बाहिरी गारो (इट्टा, ढुङ्गा, माटो आदि) को प्रकार अनुसार घरधुरी विवरण।",
    href: "/profile/economics/ward-wise-household-outer-wall",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "वैदेशिक रोजगारीमा गएकाहरूको विवरण",
    description:
      "परिवर्तन गाउँपालिकाबाट वैदेशिक रोजगारीमा गएका व्यक्तिहरूको देश अनुसार वितरण र विश्लेषण।",
    href: "/profile/economics/ward-wise-foreign-employment-countries",
    icon: <Plane className="h-5 w-5" />,
  },
  {
    title: "खाद्यान्न बालीमा लाग्ने रोग विवरण",
    description:
      "परिवर्तन गाउँपालिकामा खाद्यान्न बालीमा लाग्ने प्रमुख रोगहरू र तिनको प्रभाव सम्बन्धी विवरण।",
    href: "/profile/economics/municipality-wide-crop-diseases",
    icon: <Bug className="h-5 w-5" />,
  },
  {
    title: "तरकारी तथा फलफूलमा लाग्ने रोग/किरा",
    description:
      "परिवर्तन गाउँपालिकामा तरकारी तथा फलफूलमा लाग्ने प्रमुख रोग र किराहरूको विस्तृत विवरण।",
    href: "/profile/economics/municipality-wide-vegetables-and-fruits-diseases",
    icon: <Bug className="h-5 w-5" />,
  },
  {
    title: "व्यवसायिक कृषि/पशुपालन फर्महरू",
    description:
      "परिवर्तन गाउँपालिकामा रहेका व्यवसायिक कृषि तथा पशुपालन फर्महरूको विवरण र विश्लेषण।",
    href: "/profile/economics/commercial-agricultural-animal-husbandry-farmers-group",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "सहकारी संस्थाहरू सम्बन्धी विवरण",
    description:
      "परिवर्तन गाउँपालिकामा सञ्चालित सहकारी संस्थाहरूको प्रकार, सदस्य संख्या र कार्यक्षेत्र सम्बन्धी विवरण।",
    href: "/profile/economics/cooperatives",
    icon: <Store className="h-5 w-5" />,
  },
];

export default async function EconomicsPage() {
  let houseOwnershipData;
  let foreignEmploymentData;
  let cooperativeData;

  try {
    // You can replace these with actual API calls when available
    houseOwnershipData =
      await api.profile.economics.wardWiseHouseOwnership.getAll
        .query()
        .catch(() => null);
    foreignEmploymentData =
      await api.profile.economics.wardWiseForeignEmploymentCountries.getAll
        .query()
        .catch(() => null);
    cooperativeData = await api.profile.economics.cooperatives.getAll
      .query()
      .catch(() => null);
  } catch (error) {
    console.error("Error fetching economic summary data:", error);
  }

  // Calculate municipality totals if data is available
  const ownHouseHouseholds = houseOwnershipData
    ? houseOwnershipData.reduce(
        (sum, item) =>
          item.houseOwnershipType === "OWN"
            ? sum + (item.households || 0)
            : sum,
        0,
      )
    : null;

  const foreignEmploymentTotal = foreignEmploymentData
    ? foreignEmploymentData.reduce(
        (sum, item) => sum + (item.population || 0),
        0,
      )
    : null;

  const totalCooperatives = cooperativeData ? cooperativeData.length : null;

  const commercialFarms = 25; // This would come from actual API

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/economics-hero.svg"
            alt="परिवर्तन गाउँपालिका आर्थिक अवस्था"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>
        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            परिवर्तन गाउँपालिकाको आर्थिक अवस्था
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              परिवर्तन गाउँपालिकाको आर्थिक प्रोफाइलमा यहाँका नागरिकहरूको आवास,
              वैदेशिक रोजगारी, कृषि उत्पादन र सहकारी संस्थाहरू लगायतका आर्थिक
              सूचकहरू समेटिएका छन्। यी तथ्याङ्कहरूले स्थानीय अर्थतन्त्रको अवस्था
              बुझ्न, आर्थिक विकासका लागि योजना बनाउन र प्राथमिकताहरू निर्धारण
              गर्न महत्वपूर्ण आधार प्रदान गर्दछन्।
            </p>
            <p>
              यस खण्डमा प्रस्तुत गरिएका आर्थिक तथ्याङ्कहरूले परिवर्तन
              गाउँपालिकाको आर्थिक विकासको वर्तमान अवस्था, चुनौतीहरू र
              सम्भावनाहरूलाई प्रकाश पार्दछन्।
            </p>
          </div>
        </section>

        {/* Key Economics Section */}
        <section id="key-economics">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 mb-6">
              प्रमुख आर्थिक तथ्यहरू
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Key stats cards */}
            {/* <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">आफ्नै घर भएका घरधुरी</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {ownHouseHouseholds !== null
                  ? localizeNumber(ownHouseHouseholds.toLocaleString(), "ne")
                  : "उपलब्ध छैन"}
              </p>
            </div> */}

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">वैदेशिक रोजगारीमा</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {foreignEmploymentTotal !== null
                  ? localizeNumber(
                      foreignEmploymentTotal.toLocaleString(),
                      "ne",
                    )
                  : "उपलब्ध छैन"}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">सहकारी संस्थाहरू</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {totalCooperatives !== null
                  ? localizeNumber(totalCooperatives.toString(), "ne")
                  : "उपलब्ध छैन"}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">व्यवसायिक फर्महरू</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {localizeNumber(commercialFarms.toString(), "ne")}
              </p>
            </div>
          </div>
        </section>

        {/* Economic Categories Section */}
        <section id="economic-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              आर्थिक श्रेणीहरू
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको आर्थिक अवस्था सम्बन्धी विस्तृत जानकारीका
              लागि तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत
              तथ्याङ्क, चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {economicCategories.map((category, i) => (
              <Link
                key={i}
                href={category.href}
                className="flex flex-col h-full group hover:shadow-md transition-all duration-200 bg-background border rounded-lg overflow-hidden"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-muted/20 flex items-center justify-end">
                  <span className="text-sm text-primary font-medium flex items-center">
                    हेर्नुहोस् <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Housing and Infrastructure Section */}
        <section id="housing-infrastructure" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              आवास तथा पूर्वाधार
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा घरको स्वामित्व, घरको बनावट र निर्माण सामग्री
              सम्बन्धी विस्तृत विवरण हेर्न&nbsp;
              <Link
                href="/profile/economics/ward-wise-house-ownership"
                className="text-primary hover:text-primary/80 font-medium"
              >
                घरको स्वामित्वको आधारमा घरधुरी
              </Link>
              &nbsp;र&nbsp;
              <Link
                href="/profile/economics/ward-wise-household-outer-wall"
                className="text-primary hover:text-primary/80 font-medium"
              >
                बाहिरी गारोको आधारमा घरधुरी
              </Link>
              &nbsp;मा जानुहोस्।
            </p>
          </div>
        </section>

        {/* Remove Agriculture and Livestock Section */}
      </div>
    </div>
  );
}
