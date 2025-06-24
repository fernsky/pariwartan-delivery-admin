import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { localizeNumber } from "@/lib/utils/localize-number";
import { roofTypeOptions } from "@/server/api/routers/profile/physical/ward-wise-household-roof.schema";
import WardWiseHouseholdRoofCharts from "./_components/ward-wise-household-roof-charts";
import WardWiseHouseholdRoofSEO from "./_components/ward-wise-household-roof-seo";

// Roof categories with display names and colors
const ROOF_CATEGORIES = {
  CEMENT: {
    name: "सिमेन्ट ढलान",
    nameEn: "Cement concrete",
    color: "#4285F4", // Blue
  },
  TIN: {
    name: "जस्ता/टिन",
    nameEn: "Tin/Metal sheet",
    color: "#34A853", // Green
  },
  TILE: {
    name: "टायल/खपडा",
    nameEn: "Tile/Clay tile",
    color: "#FBBC05", // Yellow
  },
  STRAW: {
    name: "खर/पराल",
    nameEn: "Thatch/Straw",
    color: "#FF6D01", // Orange
  },
  WOOD: {
    name: "काठ/फल्याक",
    nameEn: "Wood/Plank",
    color: "#8B4513", // Brown
  },
  STONE: {
    name: "ढुङ्गा/स्लेट",
    nameEn: "Stone/Slate",
    color: "#708090", // Gray
  },
  OTHER: {
    name: "अन्य",
    nameEn: "Other materials",
    color: "#EA4335", // Red
  },
};

// Force dynamic rende?ring since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Generate metadata dynamically based on data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const householdRoofData =
      await api.profile.physical.wardWiseHouseholdRoof.getAll.query();

    const totalHouseholds = householdRoofData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const title =
      "परिवर्तन गाउँपालिका वडा अनुसार घरको छानाको प्रकार | डिजिटल प्रोफाइल";
    const description = `परिवर्तन गाउँपालिकाका ${localizeNumber(totalHouseholds.toString(), "ne")} घरधुरीको छानाको प्रकार सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण। सिमेन्ट, जस्ता, टायल, खर र अन्य छानाका प्रकारहरूको वडावार वितरण।`;

    return {
      title,
      description,
      keywords: [
        "परिवर्तन गाउँपालिका",
        "घरको छाना",
        "छानाको प्रकार",
        "सिमेन्ट छाना",
        "जस्ता छाना",
        "टायल छाना",
        "वडावार तथ्याङ्क",
        "भवन निर्माण सामग्री",
        "आवास गुणस्तर",
        "भौतिक पूर्वाधार",
      ],
      openGraph: {
        title,
        description,
        type: "article",
        locale: "ne_NP",
        siteName: "परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      },
      alternates: {
        canonical: "/profile/physical/ward-wise-household-roof",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "परिवर्तन गाउँपालिका वडा अनुसार घरको छानाको प्रकार",
      description: "परिवर्तन गाउँपालिकाको घरको छानाको प्रकार सम्बन्धी तथ्याङ्क",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "छानाको प्रकारको वितरण",
    slug: "distribution-of-roof-types",
  },
  {
    level: 2,
    text: "वडा अनुसार छानाको प्रकार",
    slug: "ward-wise-roof-types",
  },
  {
    level: 2,
    text: "छानाको प्रकारको विश्लेषण",
    slug: "roof-type-analysis",
  },
  {
    level: 2,
    text: "आवास गुणस्तर सुधार रणनीति",
    slug: "housing-quality-improvement-strategy",
  },
];

export default async function WardWiseHouseholdRoofPage() {
  // Fetch all ward-wise household roof data using tRPC
  const householdRoofData =
    await api.profile.physical.wardWiseHouseholdRoof.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.physical.wardWiseHouseholdRoof.summary.query();
  } catch (error) {
    console.error("Error fetching summary data:", error);
  }

  // Group by ward number
  const wardGroups = householdRoofData.reduce((acc: any, curr: any) => {
    if (!acc[curr.wardNumber]) {
      acc[curr.wardNumber] = [];
    }
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Create a mapping of roofType to its human-readable name
  const roofMap: Record<string, string> = {};
  roofTypeOptions.forEach((option) => {
    roofMap[option.value] = option.label;
  });

  // Calculate totals by roof category
  let totalHouseholds = 0;
  const roofCategoryTotals: Record<string, number> = {
    CEMENT: 0,
    TIN: 0,
    TILE: 0,
    STRAW: 0,
    WOOD: 0,
    STONE: 0,
    OTHER: 0,
  };

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      const households = item.households || 0;
      totalHouseholds += households;
      roofCategoryTotals[item.roofType] += households;
    });
  });

  // Calculate percentages
  const roofCategoryPercentages: Record<string, number> = {};
  Object.keys(roofCategoryTotals).forEach((category) => {
    roofCategoryPercentages[category] =
      totalHouseholds > 0
        ? (roofCategoryTotals[category] / totalHouseholds) * 100
        : 0;
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(ROOF_CATEGORIES)
    .map((categoryKey) => {
      const category =
        ROOF_CATEGORIES[categoryKey as keyof typeof ROOF_CATEGORIES];
      const value = roofCategoryTotals[categoryKey];
      const percentage = roofCategoryPercentages[categoryKey];

      return {
        name: category.name,
        nameEn: category.nameEn,
        value,
        percentage: percentage.toFixed(1),
        color: category.color,
      };
    })
    .filter((item) => item.value > 0);

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];
      if (!wardData) return null;

      const wardTotal = wardData.reduce(
        (sum: number, item: any) => sum + (item.households || 0),
        0,
      );

      const result: any = {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        total: wardTotal,
      };

      // Add data for each roof category
      Object.keys(ROOF_CATEGORIES).forEach((categoryKey) => {
        const category =
          ROOF_CATEGORIES[categoryKey as keyof typeof ROOF_CATEGORIES];
        const categoryData = wardData.find(
          (item: any) => item.roofType === categoryKey,
        );
        result[category.name] = categoryData ? categoryData.households : 0;
      });

      return result;
    })
    .filter(Boolean);

  // Find the ward with highest and lowest percentages of modern roofing (cement + tile)
  const wardModernRoofingPercentages = wardWiseData.map((ward: any) => {
    const modernRoofing =
      (ward[ROOF_CATEGORIES.CEMENT.name] || 0) +
      (ward[ROOF_CATEGORIES.TILE.name] || 0);
    const percentage = ward.total > 0 ? (modernRoofing / ward.total) * 100 : 0;

    return {
      wardNumber: ward.wardNumber,
      percentage,
    };
  });

  const bestRoofingWard = [...wardModernRoofingPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const worstRoofingWard = [...wardModernRoofingPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  // Calculate housing quality index (0-100, higher is better)
  const housingQualityIndex =
    roofCategoryPercentages.CEMENT * 1.0 +
    roofCategoryPercentages.TILE * 0.9 +
    roofCategoryPercentages.TIN * 0.7 +
    roofCategoryPercentages.STONE * 0.6 +
    roofCategoryPercentages.WOOD * 0.5 +
    roofCategoryPercentages.STRAW * 0.3 +
    roofCategoryPercentages.OTHER * 0.2;

  return (
    <>
      <WardWiseHouseholdRoofSEO
        householdRoofData={householdRoofData}
        totalHouseholds={totalHouseholds}
        roofCategoryTotals={roofCategoryTotals}
        roofCategoryPercentages={roofCategoryPercentages}
        bestRoofingWard={bestRoofingWard}
        worstRoofingWard={worstRoofingWard}
        ROOF_CATEGORIES={ROOF_CATEGORIES}
        wardNumbers={wardNumbers}
        housingQualityIndex={housingQualityIndex}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            वडा अनुसार घरको छानाको प्रकार
            <span className="sr-only">
              Ward-wise Household Roof Types in pariwartan Rural Municipality
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            परिवर्तन गाउँपालिकाका विभिन्न वडाहरूमा प्रयोग हुने घरको छानाका
            प्रकारहरूको विस्तृत विश्लेषण र तथ्याङ्क।
          </p>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-primary">
                {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              </div>
              <div className="text-sm text-muted-foreground">कुल घरधुरी</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {localizeNumber(wardNumbers.length.toString(), "ne")}
              </div>
              <div className="text-sm text-muted-foreground">
                कुल वडा संख्या
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {localizeNumber(
                  Object.keys(ROOF_CATEGORIES).length.toString(),
                  "ne",
                )}
              </div>
              <div className="text-sm text-muted-foreground">छानाका प्रकार</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">
                {localizeNumber(housingQualityIndex.toFixed(1), "ne")}
              </div>
              <div className="text-sm text-muted-foreground">
                आवास गुणस्तर सूचकांक
              </div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <section id="introduction" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">परिचय</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              घरको छानाको प्रकार भनेको आवासको गुणस्तर र स्थायित्वको महत्वपूर्ण
              सूचक हो। यसले न केवल मौसमी सुरक्षा प्रदान गर्छ बल्कि घरको समग्र
              संरचनात्मक बलियोपन र सौन्दर्यतालाई पनि प्रभाव पार्छ। परिवर्तन
              गाउँपालिकामा विभिन्न प्रकारका छानाहरू प्रयोग गरिन्छन्, जसमा आधुनिक
              सिमेन्ट कंक्रिटदेखि परम्परागत खर-पराल सम्म समावेश छन्।
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              यो विश्लेषणले प्रत्येक वडामा प्रयोग हुने छानाका प्रकारहरूको
              विस्तृत चित्र प्रस्तुत गर्दछ, जसले स्थानीय सरकारलाई आवास सुधार
              नीति निर्माण र विकास योजना तर्जुमामा सहयोग पुर्‍याउँछ।
            </p>
          </div>
        </section>

        {/* Charts and Analysis */}
        <WardWiseHouseholdRoofCharts
          pieChartData={pieChartData}
          wardWiseData={wardWiseData}
          totalHouseholds={totalHouseholds}
          roofCategoryTotals={roofCategoryTotals}
          roofMap={roofMap}
          roofCategoryPercentages={roofCategoryPercentages}
          wardWiseModernRoofing={wardModernRoofingPercentages}
          bestRoofingWard={bestRoofingWard}
          worstRoofingWard={worstRoofingWard}
          ROOF_CATEGORIES={ROOF_CATEGORIES}
          housingQualityIndex={housingQualityIndex}
        />

        {/* Housing Quality Improvement Strategy */}
        <section id="housing-quality-improvement-strategy" className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            आवास गुणस्तर सुधार रणनीति
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">
                तत्काल गर्नुपर्ने कामहरू
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• खराब छानाका घरहरूको पहिचान र सूचीकरण</li>
                <li>• आपतकालीन मर्मत सामग्री वितरण</li>
                <li>• मौसमी क्षतिग्रस्त छानाहरूको तुरुन्त मर्मत</li>
                <li>• वर्षात र हावाहुरीबाट सुरक्षा व्यवस्था</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">दीर्घकालीन योजना</h3>
              <ul className="space-y-2 text-sm">
                <li>• गुणस्तरीय निर्माण सामग्रीमा सब्सिडी कार्यक्रम</li>
                <li>• स्थानीय निर्माण सामग्री उत्पादन प्रवर्द्धन</li>
                <li>• आवास ऋण सुविधा विस्तार</li>
                <li>• भूकम्प प्रतिरोधी निर्माण प्रविधि प्रशिक्षण</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
