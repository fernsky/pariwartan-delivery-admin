import { Metadata } from "next";
import { api } from "@/trpc/server";
import { TableOfContents } from "@/components/TableOfContents";
import EconomicallyActivePopulationCharts from "./_components/economically-active-population-charts";
import EconomicallyActivePopulationAnalysisSection from "./_components/economically-active-population-analysis-section";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define type for economically active population data
type EconomicallyActivePopulationDataType = {
  id?: string;
  wardNumber: string;
  gender: string;
  age10PlusTotal: number;
  economicallyActiveEmployed: number;
  economicallyActiveUnemployed: number;
  householdWork: number;
  economicallyActiveTotal: number;
  dependentPopulation: number;
};

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const economicallyActiveData =
      await api.profile.demographics.wardGenderWiseEconomicallyActivePopulation.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका";

    // Ensure data is a valid array
    if (!economicallyActiveData || !Array.isArray(economicallyActiveData)) {
      return {
        title: `आर्थिक रूपमा सक्रिय जनसंख्या - ${municipalityName}`,
        description: `${municipalityName}को वडागत र लैंगिक आर्थिक रूपमा सक्रिय जनसंख्याको विस्तृत तथ्याङ्क।`,
      };
    }

    // Process data for SEO
    const totalData = economicallyActiveData.filter(
      (item) => item.wardNumber === "जम्मा" && item.gender === "जम्मा",
    )[0];
    const totalEconomicallyActive = totalData?.economicallyActiveTotal || 0;
    const totalEmployed = totalData?.economicallyActiveEmployed || 0;

    const title = `आर्थिक रूपमा सक्रिय जनसंख्या - ${municipalityName}`;
    const description = `${municipalityName}को वडागत र लैंगिक आर्थिक रूपमा सक्रिय जनसंख्याको विस्तृत तथ्याङ्क। कुल आर्थिक रूपमा सक्रिय: ${totalEconomicallyActive.toLocaleString()} व्यक्ति। रोजगारीमा: ${totalEmployed.toLocaleString()} व्यक्ति।`;

    return {
      title,
      description,
      keywords: [
        "आर्थिक रूपमा सक्रिय जनसंख्या",
        "रोजगारी तथ्याङ्क",
        "बेरोजगारी दर",
        "परिवर्तन गाउँपालिका",
        "वडागत तथ्याङ्क",
        "Economically active population",
        "Employment statistics",
        "Unemployment rate",
        "Ward-wise data",
      ],
      openGraph: {
        title,
        description,
        type: "website",
        locale: "ne_NP",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "आर्थिक रूपमा सक्रिय जनसंख्या - परिवर्तन गाउँपालिका",
      description:
        "परिवर्तन गाउँपालिकाको वडागत र लैंगिक आर्थिक रूपमा सक्रिय जनसंख्याको विस्तृत तथ्याङ्क।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "आर्थिक रूपमा सक्रिय जनसंख्या",
    slug: "economically-active-overview",
  },
  { level: 2, text: "वडागत वितरण", slug: "ward-wise-distribution" },
  { level: 2, text: "लैंगिक वितरण", slug: "gender-distribution" },
  { level: 2, text: "रोजगारी र बेरोजगारी", slug: "employment-unemployment" },
  { level: 2, text: "विश्लेषण र निष्कर्ष", slug: "analysis-conclusions" },
];

export default async function EconomicallyActivePopulationPage() {
  // Fetch all economically active population data from your tRPC route
  let economicallyActiveData: EconomicallyActivePopulationDataType[] = [];
  try {
    const fetchedData =
      await api.profile.demographics.wardGenderWiseEconomicallyActivePopulation.getAll.query();
    economicallyActiveData = fetchedData || [];
  } catch (error) {
    console.error("Error fetching economically active data:", error);
    economicallyActiveData = [];
  }

  // Ensure data is a valid array
  if (!economicallyActiveData || !Array.isArray(economicallyActiveData)) {
    economicallyActiveData = [];
  }

  // Fetch summary statistics
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardGenderWiseEconomicallyActivePopulation.summary.query();
  } catch (error) {
    console.error("Error fetching summary:", error);
  }

  // Calculate totals from the data (excluding "जम्मा" rows to avoid double counting)
  const nonTotalData = economicallyActiveData.filter(
    (item) => item.wardNumber !== "जम्मा" && item.gender !== "जम्मा",
  );

  const totalAge10Plus = nonTotalData.reduce(
    (sum, item) => sum + (item.age10PlusTotal || 0),
    0,
  );
  const totalEmployed = nonTotalData.reduce(
    (sum, item) => sum + (item.economicallyActiveEmployed || 0),
    0,
  );
  const totalUnemployed = nonTotalData.reduce(
    (sum, item) => sum + (item.economicallyActiveUnemployed || 0),
    0,
  );
  const totalEconomicallyActive = nonTotalData.reduce(
    (sum, item) => sum + (item.economicallyActiveTotal || 0),
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Table of Contents - Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8">
            <TableOfContents toc={toc} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4" id="introduction">
              आर्थिक रूपमा सक्रिय जनसंख्या
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              परिवर्तन गाउँपालिकाको वडागत र लैंगिक आर्थिक रूपमा सक्रिय
              जनसंख्याको विस्तृत विश्लेषण। यहाँ रोजगारी, बेरोजगारी र घरायसी
              कामको तथ्याङ्क प्रस्तुत गरिएको छ।
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {localizeNumber(totalAge10Plus.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-blue-600">
                  १० वर्ष माथिको जनसंख्या
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {localizeNumber(totalEmployed.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-green-600">रोजगारीमा</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  {localizeNumber(totalUnemployed.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-orange-600">बेरोजगार</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {localizeNumber(
                    totalEconomicallyActive.toLocaleString(),
                    "ne",
                  )}
                </div>
                <div className="text-sm text-purple-600">
                  आर्थिक रूपमा सक्रिय
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <EconomicallyActivePopulationCharts
            economicallyActiveData={economicallyActiveData}
            totalAge10Plus={totalAge10Plus}
            totalEmployed={totalEmployed}
            totalUnemployed={totalUnemployed}
            totalEconomicallyActive={totalEconomicallyActive}
          />

          {/* Analysis Section */}
          <section id="analysis-conclusions">
            <EconomicallyActivePopulationAnalysisSection
              economicallyActiveData={economicallyActiveData}
              totalAge10Plus={totalAge10Plus}
              totalEmployed={totalEmployed}
              totalUnemployed={totalUnemployed}
              totalEconomicallyActive={totalEconomicallyActive}
            />
          </section>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">डेटा स्रोत र नोट</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • यो तथ्याङ्क राष्ट्रिय जनगणना र स्थानीय सर्वेक्षणमा आधारित छ
              </li>
              <li>
                • आर्थिक रूपमा सक्रिय जनसंख्यामा १० वर्ष माथिका व्यक्तिहरू
                समावेश छन्
              </li>
              <li>
                • रोजगारी र बेरोजगारीको वर्गीकरण अन्तर्राष्ट्रिय मापदण्ड अनुसार
                गरिएको छ
              </li>
              <li>
                • यो डेटा रोजगारी नीति निर्माण र विकास योजनाका लागि उपयोगी छ
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
