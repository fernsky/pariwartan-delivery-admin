import { Metadata } from "next";
import { api } from "@/trpc/server";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import CasteCharts from "./_components/caste-charts";
import CasteAnalysisSection from "./_components/caste-analysis-section";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define type for caste data
type CasteDataType = {
  id?: string;
  casteType: string;
  casteTypeDisplay?: string;
  malePopulation: number;
  femalePopulation: number;
  totalPopulation: number;
};

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
    const casteData =
      await api.profile.demographics.castePopulation.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // Khajura Rural Municipality

    // Ensure casteData is a valid array
    if (!casteData || !Array.isArray(casteData)) {
      return {
        title: `जातीय जनसंख्या वितरण - ${municipalityName}`,
        description: `${municipalityName}को जातीय र लैंगिक जनसंख्या वितरणको विस्तृत तथ्याङ्क।`,
      };
    }

    // Process data for SEO
    const totalPopulation = casteData.reduce(
      (sum, item) => sum + (item.totalPopulation || 0),
      0,
    );

    // Get top 3 castes for keywords
    const topCastes = casteData.slice(0, 3);

    const title = `जातीय जनसंख्या वितरण - ${municipalityName}`;
    const description = `${municipalityName}को जातीय र लैंगिक जनसंख्या वितरणको विस्तृत तथ्याङ्क। कुल जनसंख्या: ${totalPopulation.toLocaleString()} व्यक्ति। मुख्य जातिहरू: ${topCastes.map((c) => c.casteTypeDisplay || c.casteType).join(", ")}।`;

    return {
      title,
      description,
      keywords: [
        "जातीय जनसंख्या",
        "लैंगिक वितरण",
        "परिवर्तन गाउँपालिका",
        "खजुरा नगरपालिका",
        "जनसंख्या तथ्याङ्क",
        "Ethnic population",
        "Gender distribution",
        "Khajura Rural Municipality",
        "Population statistics",
        ...casteData.map((c) => c.casteTypeDisplay),
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
      title: "जातीय जनसंख्या वितरण - परिवर्तन गाउँपालिका",
      description:
        "परिवर्तन गाउँपालिकाको जातीय र लैंगिक जनसंख्या वितरणको विस्तृत तथ्याङ्क।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "लिङ्ग अनुसार जनसंख्या", slug: "gender-distribution" },
  { level: 2, text: "जाति अनुसार जनसंख्या", slug: "caste-distribution" },
  { level: 2, text: "जातीय र लैंगिक वितरण", slug: "caste-gender-distribution" },
  { level: 2, text: "जातीय र लैंगिक विश्लेषण", slug: "caste-gender-analysis" },
];

export default async function CastePopulationPage() {
  // Fetch all caste population data from your tRPC route
  let casteData: CasteDataType[] = [];
  try {
    const fetchedData =
      await api.profile.demographics.castePopulation.getAll.query();
    casteData = fetchedData || [];
  } catch (error) {
    console.error("Error fetching caste data:", error);
    casteData = [];
  }

  // Ensure casteData is a valid array
  if (!casteData || !Array.isArray(casteData)) {
    casteData = [];
  }

  // Fetch summary statistics
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.castePopulation.summary.query();
  } catch (error) {
    console.error("Error fetching summary:", error);
  }

  // Calculate totals from the data
  const totalMale = casteData.reduce(
    (sum, item) => sum + (item.malePopulation || 0),
    0,
  );
  const totalFemale = casteData.reduce(
    (sum, item) => sum + (item.femalePopulation || 0),
    0,
  );
  const totalPopulation = totalMale + totalFemale;

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
              जातीय जनसंख्या वितरण
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              परिवर्तन गाउँपालिकाको जातीय र लैंगिक जनसंख्या वितरणको विस्तृत
              विश्लेषण। यहाँ विभिन्न जातजातिको पुरुष र महिला जनसंख्याको तथ्याङ्क
              प्रस्तुत गरिएको छ।
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-blue-600">कुल जनसंख्या</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {localizeNumber(totalMale.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-green-600">पुरुष</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-pink-600">
                  {localizeNumber(totalFemale.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-pink-600">महिला</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {localizeNumber(casteData.length.toString(), "ne")}
                </div>
                <div className="text-sm text-purple-600">जातजाति</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <CasteCharts
            casteData={casteData}
            totalMale={totalMale}
            totalFemale={totalFemale}
            totalPopulation={totalPopulation}
          />

          {/* Analysis Section */}
          <section id="caste-gender-analysis">
            <CasteAnalysisSection
              casteData={casteData}
              totalMale={totalMale}
              totalFemale={totalFemale}
              totalPopulation={totalPopulation}
            />
          </section>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">डेटा स्रोत र नोट</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • यो तथ्याङ्क राष्ट्रिय जनगणना र स्थानीय सर्वेक्षणमा आधारित छ
              </li>
              <li>• जनसंख्याको तथ्याङ्कमा सबै उमेरका व्यक्तिहरू समावेश छन्</li>
              <li>• जातीय वर्गीकरण नेपाल सरकारको मापदण्ड अनुसार गरिएको छ</li>
              <li>• यो डेटा नीति निर्माण र विकास योजनाका लागि उपयोगी छ</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
