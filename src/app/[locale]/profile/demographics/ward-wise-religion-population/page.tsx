import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import ReligionCharts from "./_components/religion-charts";
import ReligionAnalysisSection from "./_components/religion-analysis-section";
import ReligionSEO from "./_components/religion-seo";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const religionData =
      await api.profile.demographics.wardWiseReligionPopulation.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = religionData.reduce(
      (sum, item) => sum + (item.totalPopulation || 0),
      0,
    );
    // Group by religion type and calculate totals
    const religionCounts: Record<string, number> = {};
    religionData.forEach((item) => {
      if (!religionCounts[item.religionType])
        religionCounts[item.religionType] = 0;
      religionCounts[item.religionType] += item.totalPopulation || 0;
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
      "परिवर्तन गाउँपालिका धार्मिक जनसंख्या",
      "परिवर्तन धार्मिक विविधता",
      `परिवर्तन ${RELIGION_NAMES_NP[topReligions[0]]} जनसंख्या`,
      ...topReligions.map(
        (r) => `${RELIGION_NAMES_NP[r]} धर्मावलम्बी परिवर्तन`,
      ),
      "धार्मिक विविधता तथ्याङ्क",
      "धार्मिक जनगणना परिवर्तन",
      `परिवर्तन कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality religious population",
      "Khajura religious diversity",
      `Khajura ${RELIGION_NAMES_EN[topReligions[0]]} population`,
      ...topReligions.map(
        (r) => `${RELIGION_NAMES_EN[r]} population in Khajura`,
      ),
      "Religious diversity statistics",
      "Religious census Khajura",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data using localized numbers
    const descriptionNP = `परिवर्तन गाउँपालिकाको धार्मिक जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये ${RELIGION_NAMES_NP[topReligions[0]]} (${localizeNumber(religionCounts[topReligions[0]].toString(), "ne")}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${RELIGION_NAMES_NP[topReligions[1]]} (${localizeNumber(religionCounts[topReligions[1]].toString(), "ne")}) र ${RELIGION_NAMES_NP[topReligions[2]]} (${localizeNumber(religionCounts[topReligions[2]].toString(), "ne")})। विभिन्न धर्मावलम्बीहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Religious population distribution, trends and analysis for Khajura Rural Municipality. Out of a total population of ${totalPopulation}, ${RELIGION_NAMES_EN[topReligions[0]]} (${religionCounts[topReligions[0]]}) is the largest group, followed by ${RELIGION_NAMES_EN[topReligions[1]]} (${religionCounts[topReligions[1]]}) and ${RELIGION_NAMES_EN[topReligions[2]]} (${religionCounts[topReligions[2]]})। Detailed statistics and visualizations of various religious communities.`;

    return {
      title: `परिवर्तन गाउँपालिका | धर्म अनुसार जनसंख्या | डिजिटल प्रोफाइल`,
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
        title: `धर्म अनुसार जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `धर्म अनुसार जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "परिवर्तन गाउँपालिकामा धर्म अनुसार जनसंख्या | पालिका प्रोफाइल",
      description:
        "परिवर्तन गाउँपालिकामा धर्म अनुसार जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विभिन्न धर्मावलम्बीहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "धर्म अनुसार जनसंख्या", slug: "religion-distribution" },
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
  // Fetch all religion population data from your tRPC route
  const religionData =
    await api.profile.demographics.wardWiseReligionPopulation.getAll.query();

  // Fetch summary statistics if available
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseReligionPopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Calculate total population from the new structure
  const totalPopulation = religionData.reduce(
    (sum, item) => sum + (item.totalPopulation || 0),
    0,
  );

  // Take top 10 religions for pie chart, group others
  const topReligions = religionData.slice(0, 10);
  const otherReligions = religionData.slice(10);

  const otherTotalPopulation = otherReligions.reduce(
    (sum, item) => sum + (item.totalPopulation || 0),
    0,
  );

  let pieChartData = topReligions.map((item) => ({
    name: RELIGION_NAMES[item.religionType] || item.religionType,
    value: item.totalPopulation,
    percentage: (item.percentage / 100).toFixed(2), // Convert from integer percentage
  }));

  // Add "Other" category if there are more than 10 religions
  if (otherReligions.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <ReligionSEO
        religionData={religionData}
        RELIGION_NAMES={RELIGION_NAMES}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/religion-diversity.svg"
              width={1200}
              height={400}
              alt="धार्मिक विविधता - परिवर्तन गाउँपालिका (Religious Diversity - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              <span className="font-bold">परिवर्तन गाउँपालिकामा</span> धर्म
              अनुसार जनसंख्या
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकामा अवलम्बन गरिने धर्महरू र
              धर्मावलम्बीहरूको जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत
              गरिएको छ। यो तथ्याङ्कले परिवर्तन गाउँपालिकाको धार्मिक विविधता,
              सांस्कृतिक पहिचान र स्थानीय समुदायको धार्मिक स्वरूपलाई
              प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              परिवर्तन गाउँपालिका विभिन्न धर्मावलम्बी समुदायहरूको सद्भाव र
              सहिष्णुताको नमूना हो, र यस पालिकामा पनि विविध धार्मिक समुदायहरूको
              बसोबास रहेको छ। कुल जनसंख्या{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")} मध्ये{" "}
              {RELIGION_NAMES[religionData[0]?.religionType] || ""} धर्म मान्ने
              व्यक्तिहरू{" "}
              {localizeNumber(
                ((religionData[0]?.percentage || 0) / 100).toFixed(1),
                "ne",
              )}
              % रहेका छन्। यस तथ्याङ्कले परिवर्तन गाउँपालिकाको धार्मिक नीति,
              सांस्कृतिक संरक्षण र सामाजिक समानतामा सहयोग पुर्‍याउँछ।
            </p>

            <h2
              id="religion-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              धर्म अनुसार जनसंख्या
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा विभिन्न धर्मावलम्बीहरूको कुल जनसंख्या
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <ReligionCharts
            religionData={religionData}
            RELIGION_NAMES={RELIGION_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-religions" className="scroll-m-20 border-b pb-2">
              प्रमुख धर्महरूको विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा निम्न धर्महरू प्रमुख रूपमा अवलम्बन गरिन्छन्।
              यी धर्महरूमध्ये{" "}
              {RELIGION_NAMES[religionData[0]?.religionType] || "हिन्दू"}
              सबैभन्दा धेरै व्यक्तिहरूले मान्ने धर्म हो, जसलाई कुल जनसंख्याको{" "}
              {localizeNumber(
                ((religionData[0]?.percentage || 0) / 100).toFixed(2),
                "ne",
              )}
              % ले अवलम्बन गर्दछन्।
            </p>

            {/* Client component for religion analysis section */}
            <ReligionAnalysisSection
              religionData={religionData}
              RELIGION_NAMES={RELIGION_NAMES}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
