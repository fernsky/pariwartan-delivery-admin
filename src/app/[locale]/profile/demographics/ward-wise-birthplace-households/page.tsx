import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import BirthplaceHouseholdCharts from "./_components/birthplace-household-charts";
import BirthplaceHouseholdAnalysisSection from "./_components/birthplace-household-analysis-section";
import BirthplaceHouseholdSEO from "./_components/birthplace-household-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for birthplaces
const BIRTH_PLACE_NAMES: Record<string, string> = {
  SAME_MUNICIPALITY: "यहि गापा/नपा",
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "यहि जिल्लाको अर्को गा.पा./न.पा",
  ANOTHER_DISTRICT: "अर्को जिल्ला",
  ABROAD: "विदेश",
};

// Define English names for birthplaces (for SEO)
const BIRTH_PLACE_NAMES_EN: Record<string, string> = {
  SAME_MUNICIPALITY: "Same Municipality",
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "Same District (Another Municipality)",
  ANOTHER_DISTRICT: "Another District",
  ABROAD: "Abroad",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const birthplaceData =
      await api.profile.demographics.birthplaceHouseholds.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = birthplaceData.reduce(
      (sum, item) => sum + (item.totalPopulation || 0),
      0,
    );

    // Find the most common age group
    let mostCommonAgeGroup = "";
    let mostCommonCount = 0;
    birthplaceData.forEach((item) => {
      if (item.totalPopulation > mostCommonCount) {
        mostCommonCount = item.totalPopulation;
        mostCommonAgeGroup = item.ageGroup;
      }
    });

    const mostCommonPercentage =
      totalPopulation > 0
        ? ((mostCommonCount / totalPopulation) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "परिवर्तन गाउँपालिका घरपरिवारको जन्मस्थान",
      "परिवर्तन परिवार जन्मस्थान वितरण",
      "वडा अनुसार जन्मस्थान विवरण",
      "घरपरिवारको जन्मस्थान विश्लेषण",
      "स्थानीय घरपरिवार परिवर्तन",
      "जिल्ला बाहिरका घर परिवार",
      `परिवर्तन घरपरिवार संख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality birthplace households",
      "Khajura household birthplace distribution",
      "Ward-wise birthplace data",
      "Household birthplace analysis",
      "Local households in Khajura",
      "Inter-district migration",
      `Khajura total households ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकाको उमेर समूह अनुसार जन्मस्थानको वितरण र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} रहेको छ। विभिन्न उमेर समूहहरूमा जन्मस्थानको विस्तृत विश्लेषण।`;

    const descriptionEN = `Age-group-wise distribution and analysis of birthplaces in Khajura Rural Municipality. Total population is ${totalPopulation}. Detailed analysis of birthplaces across various age groups.`;

    return {
      title: `घरपरिवारको जन्मस्थान | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-birthplace-households",
        languages: {
          en: "/en/profile/demographics/ward-wise-birthplace-households",
          ne: "/ne/profile/demographics/ward-wise-birthplace-households",
        },
      },
      openGraph: {
        title: `घरपरिवारको जन्मस्थान | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरपरिवारको जन्मस्थान | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरपरिवारको जन्मस्थान | परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार घरपरिवारको जन्मस्थानको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "घरपरिवारको जन्मस्थान", slug: "household-birthplaces" },
  { level: 2, text: "वडा अनुसार जन्मस्थान", slug: "ward-wise-birthplaces" },
  { level: 2, text: "जन्मस्थान विश्लेषण", slug: "birthplace-analysis" },
];

export default async function WardWiseBirthplaceHouseholdsPage() {
  // Fetch all birthplace household data using tRPC
  const birthplaceAgeData =
    await api.profile.demographics.birthplaceHouseholds.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.birthplaceHouseholds.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Transform age group data to birthplace format (no ward-based data)
  const transformedData = birthplaceAgeData
    .filter((item) => item.ageGroup !== "जम्मा") // Exclude totals for individual analysis
    .reduce((acc: any[], item) => {
      // Add same municipality data
      if (item.bornInDistrictMunicipality > 0) {
        acc.push({
          id: `${item.id}_same_municipality`,
          birthPlace: "SAME_MUNICIPALITY",
          households: item.bornInDistrictMunicipality,
          ageGroup: item.ageGroup,
        });
      }

      // Add same district other municipality data
      if (item.bornInDistrictOther > 0) {
        acc.push({
          id: `${item.id}_same_district_other`,
          birthPlace: "SAME_DISTRICT_ANOTHER_MUNICIPALITY",
          households: item.bornInDistrictOther,
          ageGroup: item.ageGroup,
        });
      }

      // Add other district data
      if (item.bornOtherDistrict > 0) {
        acc.push({
          id: `${item.id}_other_district`,
          birthPlace: "ANOTHER_DISTRICT",
          households: item.bornOtherDistrict,
          ageGroup: item.ageGroup,
        });
      }

      // Add abroad data
      if (item.bornAbroad > 0) {
        acc.push({
          id: `${item.id}_abroad`,
          birthPlace: "ABROAD",
          households: item.bornAbroad,
          ageGroup: item.ageGroup,
        });
      }

      return acc;
    }, []);

  // Aggregate by birthplace for overall summary
  const overallSummary = Object.entries(
    transformedData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.birthPlace]) acc[item.birthPlace] = 0;
      acc[item.birthPlace] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([birthPlace, households]) => ({
      birthPlace,
      birthPlaceName:
        BIRTH_PLACE_NAMES[birthPlace as keyof typeof BIRTH_PLACE_NAMES] ||
        birthPlace,
      households,
    }))
    .sort((a, b) => b.households - a.households);

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.birthPlaceName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Process data for age-group-wise visualization (instead of ward-wise)
  const ageGroupWiseData = birthplaceAgeData
    .filter((item) => item.ageGroup !== "जम्मा")
    .map((item) => {
      const result: Record<string, any> = { ageGroup: item.ageGroup };

      // Add birthplaces
      result[BIRTH_PLACE_NAMES.SAME_MUNICIPALITY] =
        item.bornInDistrictMunicipality;
      result[BIRTH_PLACE_NAMES.SAME_DISTRICT_ANOTHER_MUNICIPALITY] =
        item.bornInDistrictOther;
      result[BIRTH_PLACE_NAMES.ANOTHER_DISTRICT] = item.bornOtherDistrict;
      result[BIRTH_PLACE_NAMES.ABROAD] = item.bornAbroad;

      return result;
    });

  // Calculate age-group-wise birthplace analysis
  const ageGroupAnalysis = birthplaceAgeData
    .filter((item) => item.ageGroup !== "जम्मा")
    .map((item) => {
      const totalPopulation = item.totalPopulation;

      // Find most common birthplace for this age group
      const birthplaces = [
        { place: "SAME_MUNICIPALITY", count: item.bornInDistrictMunicipality },
        {
          place: "SAME_DISTRICT_ANOTHER_MUNICIPALITY",
          count: item.bornInDistrictOther,
        },
        { place: "ANOTHER_DISTRICT", count: item.bornOtherDistrict },
        { place: "ABROAD", count: item.bornAbroad },
      ];

      const mostCommon = birthplaces.reduce((prev, curr) =>
        curr.count > prev.count ? curr : prev,
      );

      return {
        ageGroup: item.ageGroup,
        totalPopulation,
        mostCommonBirthplace: mostCommon.place,
        mostCommonBirthplaceCount: mostCommon.count,
        mostCommonBirthplacePercentage:
          totalPopulation > 0
            ? ((mostCommon.count / totalPopulation) * 100).toFixed(2)
            : "0",
      };
    });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <BirthplaceHouseholdSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        BIRTH_PLACE_NAMES={BIRTH_PLACE_NAMES}
        BIRTH_PLACE_NAMES_EN={BIRTH_PLACE_NAMES_EN}
        ageGroups={birthplaceAgeData
          .filter((item) => item.ageGroup !== "जम्मा")
          .map((item) => item.ageGroup)}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/birthplace-households.svg"
              width={1200}
              height={400}
              alt="घरपरिवारको जन्मस्थान - परिवर्तन गाउँपालिका (Household Birthplaces - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              परिवर्तन गाउँपालिकामा घरपरिवारको जन्मस्थान
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              घरपरिवारको जन्मस्थान सम्बन्धी तथ्याङ्कले गाउँपालिकामा बसोबास गर्ने
              परिवारहरूको मूल स्थान, आप्रवासन प्रवृत्ति र जनसंख्या गतिशीलताको
              विश्लेषण गर्न सहयोग गर्दछ। यस खण्डमा परिवर्तन गाउँपालिकामा रहेका
              घरपरिवारको जन्मस्थान अनुसारको वितरण र वडागत विश्लेषण प्रस्तुत
              गरिएको छ।
            </p>
            <p>
              परिवर्तन गाउँपालिकामा रहेका परिवारहरूको जन्मस्थानको तथ्याङ्क
              हेर्दा, कुल घरपरिवार{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              मध्ये सबैभन्दा बढी {overallSummary[0]?.birthPlaceName || ""}
              बाट{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % परिवारहरू रहेको देखिन्छ।
            </p>

            <h2
              id="household-birthplaces"
              className="scroll-m-20 border-b pb-2"
            >
              घरपरिवारको जन्मस्थान
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा रहेका परिवारहरूको जन्मस्थानको विवरण र वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <BirthplaceHouseholdCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            ageGroupWiseData={ageGroupWiseData}
            ageGroups={birthplaceAgeData
              .filter((item) => item.ageGroup !== "जम्मा")
              .map((item) => item.ageGroup)}
            birthplaceData={transformedData}
            ageGroupAnalysis={ageGroupAnalysis}
            BIRTH_PLACE_NAMES={BIRTH_PLACE_NAMES}
            birthplaceAgeData={birthplaceAgeData}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="birthplace-analysis" className="scroll-m-20 border-b pb-2">
              जन्मस्थान विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा रहेका परिवारहरूको जन्मस्थानको विश्लेषण
              गर्दा,
              {BIRTH_PLACE_NAMES[overallSummary[0]?.birthPlace || ""] ||
                overallSummary[0]?.birthPlace}
              बाट आएका परिवारहरू सबैभन्दा बढी
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % रहेको पाइन्छ।
            </p>

            {/* Client component for birthplace analysis section */}
            <BirthplaceHouseholdAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              ageGroupAnalysis={ageGroupAnalysis}
              BIRTH_PLACE_NAMES={BIRTH_PLACE_NAMES}
              BIRTH_PLACE_NAMES_EN={BIRTH_PLACE_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
