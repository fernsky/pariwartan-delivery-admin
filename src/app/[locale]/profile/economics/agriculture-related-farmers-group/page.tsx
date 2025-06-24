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

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Define English names for ward display (for SEO)
const WARD_NAMES_EN: Record<number, string> = {
  1: "Ward 1",
  2: "Ward 2",
  3: "Ward 3",
  4: "Ward 4",
  5: "Ward 5",
  6: "Ward 6",
  7: "Ward 7",
  8: "Ward 8",
  9: "Ward 9",
};

// Define colors for wards
const WARD_COLORS: Record<number, string> = {
  1: "#27ae60", // Green
  2: "#3498db", // Blue
  3: "#9b59b6", // Purple
  4: "#e74c3c", // Red
  5: "#f1c40f", // Yellow
  6: "#d35400", // Orange
  7: "#16a085", // Teal
  8: "#8e44ad", // Deep purple
  9: "#2c3e50", // Slate
};

// Icon types for farmers groups
const GROUP_ICONS: Record<string, string> = {
  "कृषि समुह": "🌾",
  "कृषक समुह": "🧑‍🌾",
  "दलित कृषक समुह": "👨‍👩‍👧‍👦",
  "महिला कृषक समुह": "👩‍🌾",
  "दलित महिला कृषक समुह": "👩‍👩‍👧‍👦",
  "बचत समुह": "💰",
  default: "🌱",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const farmersGroupData =
      await api.profile.economics.municipalityWideAgricultureRelatedFarmersGroup.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // pariwartan Rural Municipality

    // Process data for SEO
    const totalGroups = farmersGroupData.length;

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
      "परिवर्तन कृषि समूह",
      "पालिका स्तरीय कृषि समूह",
      "परिवर्तन कृषक समुदाय",
      `परिवर्तन कृषि विकास`,
      `वडा ${localizeNumber(wardWithMostGroups.toString(), "ne")} कृषि समूह`,
      `परिवर्तन ${localizeNumber(totalGroups.toString(), "ne")} कृषि समूह`,
      "कृषि सम्बन्धित समूह",
    ];

    const keywordsEN = [
      "pariwartan Rural Municipality farmers groups",
      "pariwartan agriculture groups",
      "Municipality-wide agricultural groups",
      "Farming groups in pariwartan",
      `Agricultural development in pariwartan`,
      `Ward ${wardWithMostGroups} farming groups`,
      `pariwartan ${totalGroups} agricultural groups`,
      "Agriculture related groups",
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकामा संचालित ${localizeNumber(totalGroups.toString(), "ne")} कृषि सम्बन्धित समूहहरूको विस्तृत विश्लेषण। वडा नं ${localizeNumber(wardWithMostGroups.toString(), "ne")} मा सबैभन्दा बढी ${localizeNumber(wardMaxCount.toString(), "ne")} समूहहरू क्रियाशील छन्। पालिका स्तरीय कृषि समूहहरूको विस्तृत जानकारी।`;

    const descriptionEN = `Detailed analysis of ${totalGroups} agriculture related farmers groups operating in pariwartan Rural Municipality. Ward ${wardWithMostGroups} has the highest concentration with ${wardMaxCount} active groups. Comprehensive information on municipality-wide agricultural groups.`;

    return {
      title: `कृषि सम्बन्धित समूहहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/agriculture-related-farmers-group",
        languages: {
          en: "/en/profile/economics/agriculture-related-farmers-group",
          ne: "/ne/profile/economics/agriculture-related-farmers-group",
        },
      },
      openGraph: {
        title: `कृषि सम्बन्धित समूहहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `कृषि सम्बन्धित समूहहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "कृषि सम्बन्धित समूहहरू | परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      description: "पालिका स्तरीय कृषि सम्बन्धित समूहहरूको विवरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वडागत वितरण",
    slug: "ward-distribution",
  },
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

export default async function AgricultureRelatedFarmersGroupPage() {
  // Fetch all farmers group data using tRPC
  const farmersGroupData =
    await api.profile.economics.municipalityWideAgricultureRelatedFarmersGroup.getAll.query();

  const totalGroups = farmersGroupData.length;

  // Calculate ward distribution
  const wardDistribution = farmersGroupData.reduce(
    (acc: Record<number, number>, item: { wardNumber: number }) => {
      acc[item.wardNumber] = (acc[item.wardNumber] || 0) + 1;
      return acc;
    },
    {},
  );

  // Determine group types based on name patterns
  const getGroupType = (name: string) => {
    if (name.includes("महिला") && name.includes("दलित"))
      return "दलित महिला कृषक समुह";
    if (name.includes("महिला")) return "महिला कृषक समुह";
    if (name.includes("दलित")) return "दलित कृषक समुह";
    if (name.includes("बचत")) return "बचत समुह";
    if (name.includes("कृषि")) return "कृषि समुह";
    return "कृषक समुह";
  };

  // Count group types
  const groupTypeCount = farmersGroupData.reduce(
    (acc: Record<string, number>, item: { name: string }) => {
      const type = getGroupType(item.name);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {},
  );

  // Create group type summary
  type GroupSummaryType = {
    type: string;
    count: number;
    percentage: number;
    icon: string;
  };

  const groupSummary: GroupSummaryType[] = Object.entries(groupTypeCount)
    .map(([type, count]) => {
      return {
        type,
        count: count as number,
        percentage: ((count as number) / totalGroups) * 100,
        icon: GROUP_ICONS[type] || GROUP_ICONS["default"],
      };
    })
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Organize farms by ward
  type WardFarmsType = {
    wardNumber: number;
    farmCount: number;
    farms: {
      id: string;
      name: string;
      type: string;
      icon: string;
    }[];
  };

  const farmsByWard: WardFarmsType[] = [];

  // Process all 9 wards (whether they have farms or not)
  for (let ward = 1; ward <= 9; ward++) {
    const wardFarms = farmersGroupData
      .filter((farm: { wardNumber: number }) => farm.wardNumber === ward)
      .map((farm: { id: string; name: string }) => {
        const type = getGroupType(farm.name);
        return {
          id: farm.id,
          name: farm.name,
          type: type,
          icon: GROUP_ICONS[type] || GROUP_ICONS["default"],
        };
      });

    farmsByWard.push({
      wardNumber: ward,
      farmCount: wardFarms.length,
      farms: wardFarms,
    });
  }

  // Sort wards by farm count (descending)
  farmsByWard.sort((a, b) => b.farmCount - a.farmCount);

  // Find popular group types by ward
  const popularGroupByWard = farmsByWard.map((ward) => {
    const groupTypes = ward.farms.reduce(
      (acc: Record<string, number>, farm) => {
        acc[farm.type] = (acc[farm.type] || 0) + 1;
        return acc;
      },
      {},
    );

    // Find most common group type in this ward
    let mostCommonType = "";
    let maxCount = 0;

    Object.entries(groupTypes).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = type;
      }
    });

    return {
      wardNumber: ward.wardNumber,
      mostCommonType,
      count: maxCount,
      icon: GROUP_ICONS[mostCommonType] || GROUP_ICONS["default"],
    };
  });

  // Calculate statistics
  const statistics = {
    totalGroups,
    totalWards: Object.keys(wardDistribution).length,
    avgGroupsPerWard: totalGroups / 9, // pariwartan has 9 wards
    mostPopularGroupType: groupSummary.length > 0 ? groupSummary[0].type : "",
    mostPopularGroupTypePercentage:
      groupSummary.length > 0 ? groupSummary[0].percentage : 0,
    wardWithMostGroups: farmsByWard.length > 0 ? farmsByWard[0].wardNumber : 0,
    maximumGroupsInAWard: farmsByWard.length > 0 ? farmsByWard[0].farmCount : 0,
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <FarmersGroupSEO
        groupSummary={groupSummary}
        totalGroups={totalGroups}
        farmsByWard={farmsByWard}
        statistics={statistics}
        WARD_NAMES_EN={WARD_NAMES_EN}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/agriculture.svg"
              width={1200}
              height={400}
              alt="कृषि सम्बन्धित समूहहरू - परिवर्तन गाउँपालिका (Agriculture Related Farmers Groups - pariwartan Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              परिवर्तन गाउँपालिकामा कृषि सम्बन्धित समूहहरू
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              कृषि सम्बन्धित समूहहरू परिवर्तन गाउँपालिकाको आर्थिक विकासमा
              महत्त्वपूर्ण भूमिका निर्वाह गरिरहेका छन्। यस गाउँपालिकामा रहेका
              विभिन्न कृषक समूह, महिला कृषक समूह, दलित कृषक समूह लगायतका संगठित
              समूहहरूले कृषि उत्पादन र विकासमा योगदान पुर्‍याइरहेका छन्।
            </p>
            <p>
              यी समूहहरूले स्थानीय स्तरमा कृषि प्रविधि, बीउ बिजन वितरण, तालिम,
              क्षमता विकास, र उत्पादित वस्तुहरूको बजारीकरणमा सहयोग गर्दै आइरहेका
              छन्। यस पृष्ठमा गाउँपालिकामा संचालित कृषि सम्बन्धित विभिन्न
              समूहहरूको विस्तृत विवरण र विश्लेषण प्रस्तुत गरिएको छ।
            </p>

            <p>
              परिवर्तन गाउँपालिकामा कुल{" "}
              {localizeNumber(totalGroups.toString(), "ne")} कृषि सम्बन्धित
              समूहहरू रहेका छन्, जसमध्ये वडा नं.{" "}
              {localizeNumber(statistics.wardWithMostGroups.toString(), "ne")}{" "}
              मा{" "}
              {localizeNumber(statistics.maximumGroupsInAWard.toString(), "ne")}{" "}
              वटा समूहहरू रहेका छन्।
            </p>

            <h2 id="ward-distribution" className="scroll-m-20 border-b pb-2">
              वडागत वितरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाका विभिन्न वडाहरूमा कृषि सम्बन्धित समूहहरूको
              वितरण असमान रहेको छ। वडा नं.{" "}
              {localizeNumber(statistics.wardWithMostGroups.toString(), "ne")}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(statistics.maximumGroupsInAWard.toString(), "ne")}{" "}
              समूहहरू रहेका छन्।
            </p>

            <p>
              गाउँपालिकाको औसतमा प्रत्येक वडामा{" "}
              {localizeNumber(statistics.avgGroupsPerWard.toFixed(1), "ne")}{" "}
              कृषि सम्बन्धित समूहहरू क्रियाशील छन्। वडागत वितरण र तिनमा संचालित
              समूहहरूको विस्तृत विवरण तल प्रस्तुत गरिएको छ।
            </p>
          </div>

          {/* Client component for charts */}
          <FarmersGroupCharts
            groupSummary={groupSummary}
            totalGroups={totalGroups}
            farmsByWard={farmsByWard}
            WARD_COLORS={WARD_COLORS}
            popularGroupByWard={popularGroupByWard}
            statistics={statistics}
          />

          {/* Ward-based farms list component */}
          <WardBasedFarmsList
            farmsByWard={farmsByWard}
            WARD_COLORS={WARD_COLORS}
            GROUP_ICONS={GROUP_ICONS}
            statistics={statistics}
            popularGroupByWard={popularGroupByWard}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <FarmersGroupAnalysisSection
              groupSummary={groupSummary}
              totalGroups={totalGroups}
              farmsByWard={farmsByWard}
              WARD_COLORS={WARD_COLORS}
              WARD_NAMES_EN={WARD_NAMES_EN}
              statistics={statistics}
              popularGroupByWard={popularGroupByWard}
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
                      <strong>प्राविधिक ज्ञानको कमी:</strong> आधुनिक कृषि
                      प्रविधि र ज्ञानको कमीले उत्पादकत्व वृद्धिमा बाधा
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>बजारीकरणको समस्या:</strong> उत्पादित वस्तुहरूको
                      उचित मूल्य र बजार पहुँचको कमी
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>आर्थिक स्रोतको अभाव:</strong> समूहहरूको क्षमता
                      विकास र आधुनिकीकरणका लागि पूँजीको कमी
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>समन्वयको कमी:</strong> स्थानीय सरकार र समूहहरू बीच
                      प्रभावकारी समन्वय र सहकार्यको अभाव
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
                      <strong>सामूहिक खेती:</strong> समूहमा आधारित कृषि उत्पादन
                      र बजारीकरणको अवसर
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>ज्ञान र अनुभव आदानप्रदान:</strong> समूह सदस्यहरू
                      बीच सिकाइ र अनुभव आदानप्रदानको अवसर
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>सहुलियत र अनुदान:</strong> समूहगत रूपमा सरकारी
                      सहुलियत र अनुदान प्राप्तिको अवसर
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>मूल्य शृङ्खला विकास:</strong> कृषि उत्पादनको
                      प्रशोधन र मूल्य शृङ्खला विकासको सम्भावना
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
              परिवर्तन गाउँपालिकामा कृषि सम्बन्धित समूहहरूको अवस्थाको
              विश्लेषणबाट निम्न निष्कर्ष र सिफारिसहरू प्रस्तुत गरिएका छन्:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>क्षमता विकास:</strong> कृषि सम्बन्धित समूहहरूको लागि
                  नियमित तालिम र क्षमता विकासका कार्यक्रमहरू संचालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>बजारीकरण सहयोग:</strong> उत्पादित वस्तुहरूको
                  बजारीकरणका लागि स्थानीय बजार केन्द्र स्थापना गर्न र बजार सूचना
                  प्रणालीको विकास गर्न आवश्यक छ।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>वडागत सन्तुलन:</strong> कृषि सम्बन्धित समूहहरू कम भएका
                  वडाहरूमा नयाँ समूह गठन र क्षमता विकासमा जोड दिनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>समूह नेटवर्किङ:</strong> विभिन्न वडामा रहेका कृषि
                  समूहहरू बीच अनुभव आदानप्रदान र सहकार्यका लागि नेटवर्क स्थापना
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>उत्पादन वृद्धि कार्यक्रम:</strong> आधुनिक कृषि
                  प्रविधि, उन्नत बीउ र प्राङ्गारिक खेतीमा आधारित उत्पादन वृद्धि
                  कार्यक्रम संचालन गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              परिवर्तन गाउँपालिकामा कृषि सम्बन्धित समूहहरूको सुदृढीकरण र क्षमता
              विकासले स्थानीय कृषि उत्पादन वृद्धि, रोजगारी सिर्जना र खाद्य
              सुरक्षामा महत्त्वपूर्ण योगदान पुर्‍याउनेछ। यसका लागि स्थानीय
              सरकार, कृषि सेवा केन्द्र र कृषि समूहहरू बीच निरन्तर सहकार्य र
              समन्वय आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
