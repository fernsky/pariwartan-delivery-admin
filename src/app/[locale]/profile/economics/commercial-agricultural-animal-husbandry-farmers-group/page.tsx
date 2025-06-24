import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import FarmersGroupCharts from "./_components/farmers-group-charts";
import FarmersGroupAnalysisSection from "./_components/farmers-group-analysis-section";
import FarmersGroupSEO from "./_components/farmers-group-seo";
import WardBasedFarmsList from "./_components/ward-based-farms-list";
import { businessTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-commercial-agricultural-animal-husbandry-farmers-group.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Define English names for business types (for SEO)
const BUSINESS_TYPES_EN: Record<string, string> = {
  VEGETABLE_FARMING: "Vegetable Farming",
  GOAT_FARMING: "Goat Farming",
  POULTRY_FARMING: "Poultry Farming",
  FISH_FARMING: "Fish Farming",
  CATTLE_FARMING: "Cattle Farming",
  ANIMAL_HUSBANDRY: "Animal Husbandry",
  LIVESTOCK_POULTRY: "Livestock and Poultry",
  BEEKEEPING: "Beekeeping",
  FRUIT_FARMING: "Fruit Farming",
  MUSHROOM_FARMING: "Mushroom Farming",
  PIG_FARMING: "Pig Farming",
  NURSERY: "Plant Nursery",
  DAIRY_FARMING: "Dairy Farming",
  MIXED_FARMING: "Mixed Farming",
  AGRICULTURE: "Agriculture",
  ORGANIC_FARMING: "Organic Farming",
  OTHER: "Other Agricultural Activities",
};

// Define Nepali names for business types
const BUSINESS_TYPES: Record<string, string> = businessTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for business types
const BUSINESS_COLORS: Record<string, string> = {
  VEGETABLE_FARMING: "#27ae60", // Green for vegetable farming
  GOAT_FARMING: "#9b59b6", // Purple for goat farming
  POULTRY_FARMING: "#e74c3c", // Red for poultry farming
  FISH_FARMING: "#3498db", // Blue for fish farming
  CATTLE_FARMING: "#f1c40f", // Yellow for cattle farming
  ANIMAL_HUSBANDRY: "#d35400", // Orange for animal husbandry
  LIVESTOCK_POULTRY: "#c0392b", // Dark red for livestock poultry
  BEEKEEPING: "#f39c12", // Amber for beekeeping
  FRUIT_FARMING: "#16a085", // Teal for fruit farming
  MUSHROOM_FARMING: "#7f8c8d", // Gray for mushroom farming
  PIG_FARMING: "#8e44ad", // Deep purple for pig farming
  NURSERY: "#1abc9c", // Turquoise for nursery
  DAIRY_FARMING: "#2980b9", // Dark blue for dairy farming
  MIXED_FARMING: "#2c3e50", // Slate for mixed farming
  AGRICULTURE: "#27ae60", // Green for agriculture
  ORGANIC_FARMING: "#16a085", // Teal for organic farming
  OTHER: "#95a5a6", // Light gray for other
};

// Icon types for business types
const BUSINESS_ICONS: Record<string, string> = {
  VEGETABLE_FARMING: "🥬",
  GOAT_FARMING: "🐐",
  POULTRY_FARMING: "🐓",
  FISH_FARMING: "🐟",
  CATTLE_FARMING: "🐄",
  ANIMAL_HUSBANDRY: "🐑",
  LIVESTOCK_POULTRY: "🐣",
  BEEKEEPING: "🐝",
  FRUIT_FARMING: "🍎",
  MUSHROOM_FARMING: "🍄",
  PIG_FARMING: "🐖",
  NURSERY: "🌱",
  DAIRY_FARMING: "🥛",
  MIXED_FARMING: "🌾",
  AGRICULTURE: "🚜",
  ORGANIC_FARMING: "🌿",
  OTHER: "🧑‍🌾",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const farmersGroupData =
      await api.profile.economics.municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // pariwartan Rural Municipality

    // Process data for SEO
    const totalGroups = farmersGroupData.length;
    const businessTypeCount = farmersGroupData.reduce(
      (acc: Record<string, number>, item: { type: string }) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Find most common business type
    let mostCommonBusinessType = "";
    let mostCommonCount = 0;
    Object.entries(businessTypeCount).forEach(([type, count]) => {
      const countValue = count as number;
      if (countValue > mostCommonCount) {
        mostCommonCount = countValue;
        mostCommonBusinessType = type;
      }
    });

    const mostCommonBusinessTypePercentage =
      (mostCommonCount / totalGroups) * 100;

    // Calculate ward distribution
    const wardDistribution = farmersGroupData.reduce(
      (acc: Record<number, number>, item: { wardNumber: number }) => {
        acc[item.wardNumber] = (acc[item.wardNumber] || 0) + 1;
        return acc;
      },
      {},
    );

    // Find ward with most groups
    let wardWithMostGroups = 0;
    let wardMaxCount = 0;
    Object.entries(wardDistribution).forEach(([ward, count]) => {
      if (Number(count) > wardMaxCount) {
        wardMaxCount = Number(count);
        wardWithMostGroups = Number(ward);
      }
    });

    // Create rich keywords with actual data
    const keywordsNP = [
      "परिवर्तन गाउँपालिका कृषि समूह",
      "परिवर्तन व्यावसायिक पशुपालन",
      "पालिका स्तरीय कृषि समूह",
      "परिवर्तन कृषि व्यवसाय",
      `परिवर्तन ${BUSINESS_TYPES[mostCommonBusinessType] || "व्यावसायिक कृषि"}`,
      `वडा ${localizeNumber(wardWithMostGroups.toString(), "ne")} कृषि समूह`,
      `परिवर्तन ${localizeNumber(totalGroups.toString(), "ne")} कृषि समूह`,
      "व्यावसायिक पशुपालन समूह",
    ];

    const keywordsEN = [
      "pariwartan Rural Municipality farmers groups",
      "pariwartan commercial agriculture",
      "Municipality-wide agricultural groups",
      "Commercial animal husbandry in pariwartan",
      `${BUSINESS_TYPES_EN[mostCommonBusinessType] || "Commercial agriculture"} in pariwartan`,
      `Ward ${wardWithMostGroups} farming groups`,
      `pariwartan ${totalGroups} agricultural groups`,
      "Commercial animal husbandry groups",
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकामा संचालित ${localizeNumber(totalGroups.toString(), "ne")} व्यावसायिक कृषि तथा पशुपालन समूहहरूको विस्तृत विश्लेषण। सबैभन्दा बढी ${BUSINESS_TYPES[mostCommonBusinessType] || ""} व्यवसाय गर्ने समूहहरू (${localizeNumber(mostCommonBusinessTypePercentage.toFixed(1), "ne")}%) रहेका छन्। वडा नं ${localizeNumber(wardWithMostGroups.toString(), "ne")} मा सबैभन्दा बढी ${localizeNumber(wardMaxCount.toString(), "ne")} समूहहरू क्रियाशील छन्। पालिका स्तरीय कृषि तथा पशुपालन समूहहरूको विस्तृत जानकारी।`;

    const descriptionEN = `Detailed analysis of ${totalGroups} commercial agricultural and animal husbandry farmers groups operating in pariwartan Rural Municipality. ${BUSINESS_TYPES_EN[mostCommonBusinessType] || "Agricultural business"} groups are most common (${mostCommonBusinessTypePercentage.toFixed(1)}%). Ward ${wardWithMostGroups} has the highest concentration with ${wardMaxCount} active groups. Comprehensive information on municipality-wide agricultural and livestock groups.`;

    return {
      title: `व्यावसायिक कृषि तथा पशुपालन समूहहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/economics/commercial-agricultural-animal-husbandry-farmers-group",
        languages: {
          en: "/en/profile/economics/commercial-agricultural-animal-husbandry-farmers-group",
          ne: "/ne/profile/economics/commercial-agricultural-animal-husbandry-farmers-group",
        },
      },
      openGraph: {
        title: `व्यावसायिक कृषि तथा पशुपालन समूहहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `व्यावसायिक कृषि तथा पशुपालन समूहहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "व्यावसायिक कृषि तथा पशुपालन समूहहरू | परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय व्यावसायिक कृषि तथा पशुपालन समूहहरूको विवरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "व्यवसायको प्रकार र वितरण",
    slug: "business-types-and-distribution",
  },
  { level: 2, text: "वडागत वितरण", slug: "ward-distribution" },
  { level: 2, text: "समूह प्रोफाइल", slug: "group-profile" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "चुनौती र अवसरहरू",
    slug: "challenges-and-opportunities",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function CommercialAgriculturalAnimalHusbandryFarmersGroupPage() {
  // Fetch all farmers group data using tRPC
  const farmersGroupData =
    await api.profile.economics.municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.getAll.query();

  // Process data for overall summary
  type BusinessSummaryType = {
    type: string;
    typeName: string;
    count: number;
    percentage: number;
    icon: string;
  };

  // Calculate business type distribution
  const businessTypeCount = farmersGroupData.reduce(
    (acc: Record<string, number>, item: { type: string }) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalGroups = farmersGroupData.length;

  // Create business summary
  const businessSummary: BusinessSummaryType[] = Object.entries(
    businessTypeCount,
  )
    .map(([type, count]) => {
      return {
        type,
        typeName: BUSINESS_TYPES[type] || type,
        count: count as number,
        percentage: ((count as number) / totalGroups) * 100,
        icon: BUSINESS_ICONS[type] || "🧑‍🌾",
      };
    })
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Calculate ward distribution
  const wardDistribution = farmersGroupData.reduce(
    (acc: Record<number, number>, item: { wardNumber: number }) => {
      acc[item.wardNumber] = (acc[item.wardNumber] || 0) + 1;
      return acc;
    },
    {},
  );

  // Organize farms by ward
  type WardFarmsType = {
    wardNumber: number;
    farmCount: number;
    farms: {
      id: string;
      name: string;
      type: string;
      typeName: string;
      icon: string;
    }[];
  };

  const farmsByWard: WardFarmsType[] = [];

  // Process all 9 wards (whether they have farms or not)
  for (let ward = 1; ward <= 9; ward++) {
    const wardFarms = farmersGroupData
      .filter((farm: { wardNumber: number }) => farm.wardNumber === ward)
      .map((farm: { id: string; name: string; type: string }) => ({
        id: farm.id,
        name: farm.name,
        type: farm.type,
        typeName: BUSINESS_TYPES[farm.type] || farm.type,
        icon: BUSINESS_ICONS[farm.type] || "🧑‍🌾",
      }));

    farmsByWard.push({
      wardNumber: ward,
      farmCount: wardFarms.length,
      farms: wardFarms,
    });
  }

  // Sort wards by farm count (descending)
  farmsByWard.sort((a, b) => b.farmCount - a.farmCount);

  // Find popular business types by ward
  const popularBusinessByWard = farmsByWard.map((ward) => {
    const businessTypes = ward.farms.reduce(
      (acc: Record<string, number>, farm) => {
        acc[farm.type] = (acc[farm.type] || 0) + 1;
        return acc;
      },
      {},
    );

    // Find most common business type in this ward
    let mostCommonType = "";
    let maxCount = 0;

    Object.entries(businessTypes).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = type;
      }
    });

    return {
      wardNumber: ward.wardNumber,
      mostCommonType,
      mostCommonTypeName: BUSINESS_TYPES[mostCommonType] || mostCommonType,
      count: maxCount,
      icon: BUSINESS_ICONS[mostCommonType] || "🧑‍🌾",
    };
  });

  // Calculate statistics
  const statistics = {
    totalGroups,
    totalWards: Object.keys(wardDistribution).length,
    avgGroupsPerWard: totalGroups / 9, // pariwartan has 9 wards
    mostPopularBusinessType:
      businessSummary.length > 0 ? businessSummary[0].type : "",
    mostPopularBusinessTypeName:
      businessSummary.length > 0 ? businessSummary[0].typeName : "",
    mostPopularBusinessTypePercentage:
      businessSummary.length > 0 ? businessSummary[0].percentage : 0,
    wardWithMostGroups: farmsByWard.length > 0 ? farmsByWard[0].wardNumber : 0,
    maximumGroupsInAWard: farmsByWard.length > 0 ? farmsByWard[0].farmCount : 0,
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <FarmersGroupSEO
        businessSummary={businessSummary}
        totalGroups={totalGroups}
        farmsByWard={farmsByWard}
        BUSINESS_TYPES={BUSINESS_TYPES}
        BUSINESS_TYPES_EN={BUSINESS_TYPES_EN}
        statistics={statistics}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/farmers.svg"
              width={1200}
              height={400}
              alt="व्यावसायिक कृषि तथा पशुपालन समूहहरू - परिवर्तन गाउँपालिका (Commercial Agricultural and Animal Husbandry Farmers Groups - pariwartan Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              परिवर्तन गाउँपालिकामा व्यावसायिक कृषि तथा पशुपालन समूहहरू
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              व्यावसायिक कृषि तथा पशुपालन समूहहरू परिवर्तन गाउँपालिकाको आर्थिक
              विकासमा महत्त्वपूर्ण भूमिका निर्वाह गरिरहेका छन्। यस क्षेत्रमा
              तरकारी खेती, बाख्रापालन, कुखुरा पालन, माछापालन, फलफूल खेती,
              मौरीपालन लगायतका विभिन्न प्रकारका व्यावसायिक कृषि तथा पशुपालन
              समूहहरू सक्रिय छन्।
            </p>
            <p>
              यी समूहहरूले स्थानीय रोजगारी सिर्जना, खाद्य सुरक्षा सुनिश्चित गर्न
              र स्थानीय अर्थतन्त्रमा योगदान गर्नमा महत्त्वपूर्ण भूमिका खेलेका
              छन्। यस पृष्ठमा गाउँपालिकामा संचालित विभिन्न कृषि तथा पशुपालन
              समूहहरूको विस्तृत विवरण र विश्लेषण प्रस्तुत गरिएको छ।
            </p>

            <p>
              परिवर्तन गाउँपालिकामा कुल{" "}
              {localizeNumber(totalGroups.toString(), "ne")} व्यावसायिक कृषि तथा
              पशुपालन समूहहरू रहेका छन्। सबैभन्दा बढी{" "}
              {businessSummary[0]?.typeName || ""}(
              {businessSummary[0]?.icon || ""}) समूहहरू रहेका छन्, जसको संख्या{" "}
              {localizeNumber(
                businessSummary[0]?.count.toString() || "0",
                "ne",
              )}{" "}
              (
              {localizeNumber(
                businessSummary[0]?.percentage.toFixed(1) || "0",
                "ne",
              )}
              %) रहेको छ।
            </p>

            <h2
              id="business-types-and-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              व्यवसायको प्रकार र वितरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा विभिन्न प्रकारका व्यावसायिक कृषि तथा पशुपालन
              समूहहरू संचालनमा छन्। मुख्य व्यवसायहरू र तिनको वितरण निम्न अनुसार
              रहेको छ:
            </p>

            <ul>
              {businessSummary.slice(0, 8).map((business, index) => (
                <li key={index}>
                  <strong>
                    {business.icon} {business.typeName}
                  </strong>
                  : {localizeNumber(business.count.toString(), "ne")} समूह (
                  {localizeNumber(business.percentage.toFixed(1), "ne")}%)
                </li>
              ))}
              {businessSummary.length > 8 && (
                <li>
                  <strong>अन्य</strong>:{" "}
                  {localizeNumber(
                    (
                      totalGroups -
                      businessSummary
                        .slice(0, 8)
                        .reduce((sum, item) => sum + item.count, 0)
                    ).toString(),
                    "ne",
                  )}{" "}
                  समूह
                </li>
              )}
            </ul>
          </div>

          {/* Client component for charts */}
          <FarmersGroupCharts
            businessSummary={businessSummary}
            totalGroups={totalGroups}
            farmsByWard={farmsByWard}
            BUSINESS_TYPES={BUSINESS_TYPES}
            BUSINESS_COLORS={BUSINESS_COLORS}
            popularBusinessByWard={popularBusinessByWard}
            statistics={statistics}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="ward-distribution" className="scroll-m-20 border-b pb-2">
              वडागत वितरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाका विभिन्न वडाहरूमा व्यावसायिक कृषि तथा पशुपालन
              समूहहरूको वितरण असमान रहेको छ। वडा नं.{" "}
              {localizeNumber(statistics.wardWithMostGroups.toString(), "ne")}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(statistics.maximumGroupsInAWard.toString(), "ne")}{" "}
              समूहहरू रहेका छन्, जहाँ मुख्यतया{" "}
              {popularBusinessByWard.find(
                (item) => item.wardNumber === statistics.wardWithMostGroups,
              )?.mostCommonTypeName || ""}{" "}
              व्यवसाय संचालित छन्।
            </p>

            <p>
              गाउँपालिकाको औसतमा प्रत्येक वडामा{" "}
              {localizeNumber(statistics.avgGroupsPerWard.toFixed(1), "ne")}{" "}
              व्यावसायिक समूहहरू क्रियाशील छन्। वडागत वितरण र तिनमा संचालित
              व्यवसायहरूको विस्तृत विवरण तल प्रस्तुत गरिएको छ।
            </p>
          </div>

          {/* Ward-based farms list component */}
          <WardBasedFarmsList
            farmsByWard={farmsByWard}
            BUSINESS_TYPES={BUSINESS_TYPES}
            BUSINESS_COLORS={BUSINESS_COLORS}
            BUSINESS_ICONS={BUSINESS_ICONS}
            statistics={statistics}
            popularBusinessByWard={popularBusinessByWard}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <FarmersGroupAnalysisSection
              businessSummary={businessSummary}
              totalGroups={totalGroups}
              farmsByWard={farmsByWard}
              BUSINESS_TYPES={BUSINESS_TYPES}
              BUSINESS_TYPES_EN={BUSINESS_TYPES_EN}
              BUSINESS_COLORS={BUSINESS_COLORS}
              statistics={statistics}
              popularBusinessByWard={popularBusinessByWard}
            />

            <h2
              id="challenges-and-opportunities"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              चुनौती र अवसरहरू
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold">मुख्य चुनौतीहरू</h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>बजार पहुँच:</strong> उत्पादित वस्तुहरूको बिक्रीका
                      लागि उपयुक्त बजारको अभाव र बजार सम्मको पहुँचमा कठिनाई
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>प्राविधिक ज्ञान:</strong> आधुनिक कृषि र पशुपालन
                      प्रविधिहरूको ज्ञान र सीपको कमी
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>वित्तीय पहुँच:</strong> व्यवसाय विस्तारका लागि
                      आवश्यक वित्तीय स्रोतको अभाव
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>जलवायु परिवर्तन:</strong> अनियमित वर्षा र तापक्रम
                      परिवर्तनले कृषि उत्पादनमा नकारात्मक प्रभाव
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">अवसरहरू</h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>स्थानीय उत्पादन प्रोत्साहन:</strong> स्थानीय
                      उत्पादनलाई प्राथमिकता दिने नीति र कार्यक्रमहरू
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>जैविक खेती माग:</strong> जैविक उत्पादनहरूको बढ्दो
                      माग र उच्च मूल्य
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>प्रविधि हस्तान्तरण:</strong> आधुनिक कृषि प्रविधि र
                      उपकरणहरूको उपलब्धता र प्रयोग
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>सहकार्य र नेटवर्किङ:</strong> विभिन्न समूहहरू बीच
                      सहकार्य र अनुभव आदानप्रदानका अवसरहरू
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              परिवर्तन गाउँपालिकामा व्यावसायिक कृषि तथा पशुपालन समूहहरूको
              अवस्थाको विश्लेषणबाट निम्न निष्कर्ष र सिफारिसहरू प्रस्तुत गरिएका
              छन्:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>समूह क्षमता विकास:</strong> व्यावसायिक कृषि तथा
                  पशुपालन समूहहरूको क्षमता विकासका लागि नियमित तालिम र प्राविधिक
                  सहयोगको व्यवस्था गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>मूल्य श्रृंखला विकास:</strong> उत्पादनदेखि
                  बजारीकरणसम्मको मूल्य श्रृंखला विकासका लागि आवश्यक पूर्वाधार र
                  संयन्त्रको विकास गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>समतामूलक वडागत विकास:</strong> सबै वडाहरूमा समतामूलक
                  रूपमा कृषि तथा पशुपालन समूहहरूको विकास र प्रवर्द्धनका लागि
                  विशेष कार्यक्रमहरू संचालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>जैविक खेती प्रवर्द्धन:</strong> जैविक कृषि उत्पादनलाई
                  प्रोत्साहन दिने र वातावरणमैत्री कृषि पद्धतिलाई बढावा दिने नीति
                  अवलम्बन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>वित्तीय पहुँच सुधार:</strong> कृषि तथा पशुपालन
                  समूहहरूको वित्तीय पहुँच सुनिश्चित गर्न सहुलियतपूर्ण ऋण र
                  अनुदानको व्यवस्था मिलाउनुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              परिवर्तन गाउँपालिकामा व्यावसायिक कृषि तथा पशुपालन समूहहरूको विकास
              र प्रवर्द्धनले स्थानीय अर्थतन्त्रलाई बलियो बनाउन, रोजगारी सिर्जना
              गर्न र खाद्य सुरक्षा सुनिश्चित गर्न महत्त्वपूर्ण योगदान पुर्‍याउने
              निश्चित छ। यसका लागि स्थानीय सरकार, प्राविधिक संस्थाहरू र कृषि
              समूहहरू बीचको समन्वय र सहकार्यलाई थप प्रभावकारी बनाउन आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
