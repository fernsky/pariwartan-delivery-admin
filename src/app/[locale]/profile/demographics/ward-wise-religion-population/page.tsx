import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import ReligionCharts from "./_components/religion-charts";
import ReligionAnalysisSection from "./_components/religion-analysis-section";
import ReligionSEO from "./_components/religion-seo";
import { ReligionType } from "@/lib/api";
import { wardWiseReligionPopulationService } from "@/lib/api";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }, { locale: "ne" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using our API service (not tRPC)
    const religionData = await wardWiseReligionPopulationService.getAll();
    const municipalityName = "खजुरा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = religionData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by religion type and calculate totals
    const religionCounts: Record<string, number> = {};
    religionData.forEach((item) => {
      if (!religionCounts[item.religionType])
        religionCounts[item.religionType] = 0;
      religionCounts[item.religionType] += item.population || 0;
    });

    // Get top 3 religions for keywords
    const topReligions = Object.entries(religionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Define religion names in both languages
    const RELIGION_NAMES_NP: Record<string, string> = {
      HINDU: "हिन्दू",
      BUDDHIST: "बौद्ध",
      KIRANT: "किराँत",
      CHRISTIAN: "क्रिश्चियन",
      ISLAM: "इस्लाम",
      NATURE: "प्रकृति",
      BON: "बोन",
      JAIN: "जैन",
      BAHAI: "बहाई",
      SIKH: "सिख",
      OTHER: "अन्य",
    };

    const RELIGION_NAMES_EN: Record<string, string> = {
      HINDU: "Hindu",
      BUDDHIST: "Buddhist",
      KIRANT: "Kirat",
      CHRISTIAN: "Christian",
      ISLAM: "Islam",
      NATURE: "Nature Worship",
      BON: "Bon",
      JAIN: "Jain",
      BAHAI: "Bahai",
      SIKH: "Sikh",
      OTHER: "Other",
    };

    // Create rich keywords with actual data using localized numbers
    const keywordsNP = [
      "खजुरा गाउँपालिका धार्मिक जनसंख्या",
      "खजुरा धार्मिक विविधता",
      `खजुरा ${RELIGION_NAMES_NP[topReligions[0] as ReligionType]} जनसंख्या`,
      ...topReligions.map(
        (r) => `${RELIGION_NAMES_NP[r as ReligionType]} धर्मावलम्बी खजुरा`,
      ),
      "वडा अनुसार धार्मिक जनसंख्या",
      "धार्मिक विविधता तथ्याङ्क",
      "धार्मिक जनगणना खजुरा",
      `खजुरा कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality religious population",
      "Khajura religious diversity",
      `Khajura ${RELIGION_NAMES_EN[topReligions[0] as ReligionType]} population`,
      ...topReligions.map(
        (r) => `${RELIGION_NAMES_EN[r as ReligionType]} population in Khajura`,
      ),
      "Ward-wise religious demographics",
      "Religious diversity statistics",
      "Religious census Khajura",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data using localized numbers
    const descriptionNP = `खजुरा गाउँपालिकाको वडा अनुसार धार्मिक जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये ${RELIGION_NAMES_NP[topReligions[0] as ReligionType]} (${localizeNumber(religionCounts[topReligions[0]].toString(), "ne")}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${RELIGION_NAMES_NP[topReligions[1] as ReligionType]} (${localizeNumber(religionCounts[topReligions[1]].toString(), "ne")}) र ${RELIGION_NAMES_NP[topReligions[2] as ReligionType]} (${localizeNumber(religionCounts[topReligions[2]].toString(), "ne")})। विभिन्न धर्मावलम्बीहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise religious population distribution, trends and analysis for Khajura Rural Municipality. Out of a total population of ${totalPopulation}, ${RELIGION_NAMES_EN[topReligions[0] as ReligionType]} (${religionCounts[topReligions[0]]}) is the largest group, followed by ${RELIGION_NAMES_EN[topReligions[1] as ReligionType]} (${religionCounts[topReligions[1]]}) and ${RELIGION_NAMES_EN[topReligions[2] as ReligionType]} (${religionCounts[topReligions[2]]})। Detailed statistics and visualizations of various religious communities.`;

    return {
      title: `खजुरा गाउँपालिका | धर्म अनुसार जनसंख्या | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-religion-population",
        languages: {
          en: "/en/profile/demographics/ward-wise-religion-population",
          ne: "/ne/profile/demographics/ward-wise-religion-population",
        },
      },
      openGraph: {
        title: `खजुरा गाउँपालिका | धर्म अनुसार जनसंख्या`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `खजुरा गाउँपालिका डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `खजुरा गाउँपालिका | धर्म अनुसार जनसंख्या`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "खजुरा गाउँपालिका | धर्म अनुसार जनसंख्या | डिजिटल प्रोफाइल",
      description:
        "खजुरा गाउँपालिकाको प्रत्येक वडाको धार्मिक विवरण, धर्मावलम्बीहरूको संख्या र धार्मिक विविधताको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "धर्म अनुसार जनसंख्या", slug: "religion-distribution" },
  { level: 2, text: "वडा अनुसार धार्मिक विविधता", slug: "ward-wise-religion" },
  { level: 2, text: "प्रमुख धर्महरूको विश्लेषण", slug: "major-religions" },
];

// Define Nepali names for religions
const RELIGION_NAMES: Record<string, string> = {
  HINDU: "हिन्दू",
  BUDDHIST: "बौद्ध",
  KIRANT: "किराँत",
  CHRISTIAN: "क्रिश्चियन",
  ISLAM: "इस्लाम",
  NATURE: "प्रकृति",
  BON: "बोन",
  JAIN: "जैन",
  BAHAI: "बहाई",
  SIKH: "सिख",
  OTHER: "अन्य",
};

export default async function WardWiseReligionPopulationPage() {
  // Fetch all religion population data using our API service (not tRPC)
  const religionData = await wardWiseReligionPopulationService.getAll();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData = await wardWiseReligionPopulationService.getReligionSummary();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    religionData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.religionType]) acc[item.religionType] = 0;
      acc[item.religionType] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([religion, population]) => ({
      religion,
      religionName: RELIGION_NAMES[religion] || religion,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 10 religions for pie chart, group others
  const topReligions = overallSummary.slice(0, 10);
  const otherReligions = overallSummary.slice(10);

  const otherTotalPopulation = otherReligions.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topReligions.map((item) => ({
    name: item.religionName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 10 religions
  if (otherReligions.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(religionData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 religions per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = religionData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 religions for this ward
    const topWardReligions = wardData.slice(0, 5);
    const otherWardReligions = wardData.slice(5);
    const otherWardTotal = otherWardReligions.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top religions
    topWardReligions.forEach((item) => {
      result[RELIGION_NAMES[item.religionType] || item.religionType] =
        item.population;
    });

    // Add "Other" category if needed
    if (otherWardReligions.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <ReligionSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        RELIGION_NAMES={RELIGION_NAMES}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/religion-diversity.svg"
              width={1200}
              height={400}
              alt="धार्मिक विविधता - खजुरा गाउँपालिका (Religious Diversity - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              खजुरा गाउँपालिका | धर्म अनुसार जनसंख्या विश्लेषण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा खजुरा गाउँपालिकाको विभिन्न वडाहरूमा अवलम्बन गरिने
              धर्महरू र धर्मावलम्बीहरूको जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क
              प्रस्तुत गरिएको छ। यो तथ्याङ्कले खजुरा गाउँपालिकाको धार्मिक
              विविधता, सांस्कृतिक पहिचान र स्थानीय समुदायको धार्मिक स्वरूपलाई
              प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              खजुरा गाउँपालिका विभिन्न धर्मावलम्बी समुदायहरूको सद्भाव र
              सहिष्णुताको नमूना हो, र यस पालिकामा पनि विविध धार्मिक समुदायहरूको
              बसोबास रहेको छ। कुल जनसंख्या{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")} मध्ये{" "}
              {overallSummary[0]?.religionName || ""} धर्म मान्ने व्यक्तिहरू{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेका छन्। यस तथ्याङ्कले खजुरा गाउँपालिकाको धार्मिक नीति,
              सांस्कृतिक संरक्षण र सामाजिक समानतामा सहयोग पुर्‍याउँछ।
            </p>

            <h2
              id="religion-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              खजुरा गाउँपालिकामा धर्म अनुसार जनसंख्या
            </h2>
            <p>
              खजुरा गाउँपालिकामा विभिन्न धर्मावलम्बीहरूको कुल जनसंख्या
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <ReligionCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            religionData={religionData}
            RELIGION_NAMES={RELIGION_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-religions" className="scroll-m-20 border-b pb-2">
              खजुरा गाउँपालिकाको प्रमुख धर्महरूको विश्लेषण
            </h2>
            <p>
              खजुरा गाउँपालिकामा निम्न धर्महरू प्रमुख रूपमा अवलम्बन गरिन्छन्। यी
              धर्महरूमध्ये{" "}
              {RELIGION_NAMES[overallSummary[0]?.religion] || "हिन्दू"}
              सबैभन्दा धेरै व्यक्तिहरूले मान्ने धर्म हो, जसलाई कुल जनसंख्याको{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % ले अवलम्बन गर्दछन्।
            </p>

            {/* Client component for religion analysis section */}
            <ReligionAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              RELIGION_NAMES={RELIGION_NAMES}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
