import { Metadata } from "next";
import { api } from "@/trpc/server";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import OccupationCharts from "./_components/occupation-charts";
import OccupationAnalysisSection from "./_components/occupation-analysis-section";
import OccupationSEO from "./_components/occupation-seo";
import { localizeNumber } from "@/lib/utils/localize-number";
import { familyMainOccupationLabels } from "@/server/api/routers/profile/demographics/ward-wise-major-occupation.schema";

// Define type for occupation data
type OccupationDataType = {
  id?: string;
  occupation: string;
  age15_19: number;
  age20_24: number;
  age25_29: number;
  age30_34: number;
  age35_39: number;
  age40_44: number;
  age45_49: number;
  totalPopulation: number;
  percentage: number;
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
    const occupationData =
      await api.profile.demographics.wardWiseMajorOccupation.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका";

    // Ensure occupationData is a valid array
    if (!occupationData || !Array.isArray(occupationData)) {
      return {
        title: `मुख्य पेशागत वितरण - ${municipalityName}`,
        description: `${municipalityName}को मुख्य पेशागत वितरणको विस्तृत तथ्याङ्क।`,
      };
    }

    // Process data for SEO
    const totalPopulation = occupationData.reduce(
      (sum, item) => sum + (item.totalPopulation || 0),
      0,
    );

    // Get top 3 occupations for keywords
    const topOccupations = occupationData.slice(0, 3);

    const title = `मुख्य पेशागत वितरण - ${municipalityName}`;
    const description = `${municipalityName}को मुख्य पेशागत वितरणको विस्तृत तथ्याङ्क। कुल जनसंख्या: ${totalPopulation.toLocaleString()} व्यक्ति। मुख्य पेशाहरू: ${topOccupations.map((c) => familyMainOccupationLabels[c.occupation] || c.occupation).join(", ")}।`;

    return {
      title,
      description,
      keywords: [
        "मुख्य पेशागत वितरण",
        "परिवर्तन गाउँपालिका",
        "पेशा तथ्याङ्क",
        "उमेर अनुसार पेशा",
        "Main occupation distribution",
        "Khajura Rural Municipality",
        "Occupation statistics",
        "Age-wise occupation",
        ...occupationData.map((c) => familyMainOccupationLabels[c.occupation]),
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
      title: "मुख्य पेशागत वितरण - परिवर्तन गाउँपालिका",
      description:
        "परिवर्तन गाउँपालिकाको मुख्य पेशागत वितरणको विस्तृत तथ्याङ्क।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "उमेर अनुसार पेशागत वितरण",
    slug: "age-occupation-distribution",
  },
  { level: 2, text: "पेशा अनुसार जनसंख्या", slug: "occupation-distribution" },
  { level: 2, text: "पेशागत विश्लेषण", slug: "occupation-analysis" },
];

export default async function WardMainOccupationsPage() {
  // Fetch all occupation data from your tRPC route
  let occupationData: OccupationDataType[] = [];
  try {
    const fetchedData =
      await api.profile.demographics.wardWiseMajorOccupation.getAll.query();
    occupationData = fetchedData || [];
  } catch (error) {
    console.error("Error fetching occupation data:", error);
    occupationData = [];
  }

  // Ensure occupationData is a valid array
  if (!occupationData || !Array.isArray(occupationData)) {
    occupationData = [];
  }

  // Fetch summary statistics
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardWiseMajorOccupation.summary.query();
  } catch (error) {
    console.error("Error fetching summary:", error);
  }

  // Calculate totals from the data
  const totalPopulation = occupationData.reduce(
    (sum, item) => sum + (item.totalPopulation || 0),
    0,
  );

  // Calculate age group totals
  const totalAge15_19 = occupationData.reduce(
    (sum, item) => sum + (item.age15_19 || 0),
    0,
  );
  const totalAge20_24 = occupationData.reduce(
    (sum, item) => sum + (item.age20_24 || 0),
    0,
  );
  const totalAge25_29 = occupationData.reduce(
    (sum, item) => sum + (item.age25_29 || 0),
    0,
  );
  const totalAge30Plus = occupationData.reduce(
    (sum, item) =>
      sum +
      (item.age30_34 || 0) +
      (item.age35_39 || 0) +
      (item.age40_44 || 0) +
      (item.age45_49 || 0),
    0,
  );

  // Find economically active population (excluding economically inactive)
  const economicallyActivePopulation = occupationData
    .filter((item) => item.occupation !== "ECONOMICALLY_INACTIVE")
    .reduce((sum, item) => sum + (item.totalPopulation || 0), 0);

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
          {/* SEO Component */}
          <OccupationSEO
            occupationData={occupationData}
            totalPopulation={totalPopulation}
          />

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4" id="introduction">
              मुख्य पेशागत वितरण
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              परिवर्तन गाउँपालिकाको मुख्य पेशागत वितरणको विस्तृत विश्लेषण। यहाँ
              विभिन्न उमेर समूहका व्यक्तिहरूको पेशागत संरचनाको तथ्याङ्क प्रस्तुत
              गरिएको छ। यो तथ्याङ्कले रोजगारी, आर्थिक गतिविधि र श्रम बजारको
              संरचनालाई प्रतिबिम्बित गर्दछ।
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
                  {localizeNumber(
                    (totalAge15_19 + totalAge20_24).toLocaleString(),
                    "ne",
                  )}
                </div>
                <div className="text-sm text-green-600">युवा (१५-२४)</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-pink-600">
                  {localizeNumber(
                    economicallyActivePopulation.toLocaleString(),
                    "ne",
                  )}
                </div>
                <div className="text-sm text-pink-600">आर्थिक रूपमा सक्रिय</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {localizeNumber(occupationData.length.toString(), "ne")}
                </div>
                <div className="text-sm text-purple-600">पेशा वर्गहरू</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <OccupationCharts
            occupationData={occupationData}
            totalPopulation={totalPopulation}
          />

          {/* Analysis Section */}
          <section id="occupation-analysis">
            <OccupationAnalysisSection
              occupationData={occupationData}
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
              <li>
                • पेशागत तथ्याङ्कमा १५ देखि ४९ वर्ष उमेरका व्यक्तिहरू समावेश छन्
              </li>
              <li>
                • पेशागत वर्गीकरण अन्तर्राष्ट्रिय श्रम संगठन (ILO) को मापदण्ड
                अनुसार गरिएको छ
              </li>
              <li>
                • यो डेटा रोजगार नीति निर्माण र आर्थिक विकास योजनाका लागि उपयोगी
                छ
              </li>
              <li>
                • आर्थिक रूपमा सक्रिय जनसंख्याले कुनै न कुनै आर्थिक गतिविधिमा
                संलग्न व्यक्तिहरूलाई जनाउँछ
              </li>
            </ul>
          </div>

          {/* Key Insights Section */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">
              मुख्य निष्कर्षहरू
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">
                  पेशागत संरचना
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• कृषि क्षेत्रमा सबैभन्दा बढी रोजगारी</li>
                  <li>• युवाहरूमा विविध पेशागत रुझान</li>
                  <li>• शिक्षा र स्वास्थ्य क्षेत्रमा बढ्दो सहभागिता</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">
                  उमेर समूह विश्लेषण
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• २५-३९ वर्ष उमेर समूहमा सबैभन्दा बढी आर्थिक सक्रियता</li>
                  <li>• युवाहरूमा शिक्षा र सीप विकासको आवश्यकता</li>
                  <li>• प्रौढ उमेरमा अनुभवजन्य पेशाहरूको प्राधान्यता</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
