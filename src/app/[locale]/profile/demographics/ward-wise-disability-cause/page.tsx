import { Metadata } from "next";
import { api } from "@/trpc/server";
import { TableOfContents } from "@/components/TableOfContents";
import DisabilityCauseCharts from "./_components/disability-cause-charts";
import DisabilityCauseAnalysisSection from "./_components/disability-cause-analysis-section";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define type for disability data
type DisabilityDataType = {
  id?: string;
  ageGroup: string;
  physicalDisability: number;
  visualImpairment: number;
  hearingImpairment: number;
  deafMute: number;
  speechHearingCombined: number;
  intellectualDisability: number;
  mentalPsychosocial: number;
  autism: number;
  multipleDisabilities: number;
  otherDisabilities: number;
  total: number;
};

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const disabilityData =
      await api.profile.demographics.disabilityByAge.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका";

    if (!disabilityData || !Array.isArray(disabilityData)) {
      return {
        title: `उमेर अनुसार अपाङ्गता वितरण - ${municipalityName}`,
        description: `${municipalityName}को उमेर र अपाङ्गताको प्रकार अनुसार जनसंख्या वितरणको विस्तृत तथ्याङ्क।`,
      };
    }

    const totalDisabled = disabilityData
      .filter((item) => item.ageGroup !== "जम्मा")
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const title = `उमेर अनुसार अपाङ्गता वितरण - ${municipalityName}`;
    const description = `${municipalityName}को उमेर र अपाङ्गताको प्रकार अनुसार जनसंख्या वितरणको विस्तृत तथ्याङ्क। कुल अपाङ्गता भएका व्यक्ति: ${totalDisabled.toLocaleString()}।`;

    return {
      title,
      description,
      keywords: [
        "अपाङ्गता तथ्याङ्क",
        "उमेर अनुसार अपाङ्गता",
        "परिवर्तन गाउँपालिका",
        "खजुरा नगरपालिका",
        "विकलाङ्गता",
        "Disability statistics",
        "Age-wise disability",
        "Khajura Rural Municipality",
        "Disability distribution",
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
      title: "उमेर अनुसार अपाङ्गता वितरण - परिवर्तन गाउँपालिका",
      description:
        "परिवर्तन गाउँपालिकाको उमेर र अपाङ्गताको प्रकार अनुसार जनसंख्या वितरणको विस्तृत तथ्याङ्क।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "अपाङ्गताको समग्र स्थिति",
    slug: "overall-disability-status",
  },
  { level: 2, text: "उमेर अनुसार अपाङ्गता वितरण", slug: "age-wise-disability" },
  {
    level: 2,
    text: "अपाङ्गताको प्रकार अनुसार वितरण",
    slug: "disability-type-distribution",
  },
  { level: 2, text: "विस्तृत विश्लेषण", slug: "detailed-analysis" },
];

export default async function DisabilityCausePage() {
  let disabilityData: DisabilityDataType[] = [];

  try {
    const fetchedData =
      await api.profile.demographics.disabilityByAge.getAll.query();
    disabilityData = fetchedData || [];
  } catch (error) {
    console.error("Error fetching disability data:", error);
    disabilityData = [];
  }

  if (!disabilityData || !Array.isArray(disabilityData)) {
    disabilityData = [];
  }

  // Calculate totals (excluding the 'जम्मा' row if it exists)
  const dataWithoutTotal = disabilityData.filter(
    (item) => item.ageGroup !== "जम्मा",
  );

  const totalPhysical = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.physicalDisability || 0),
    0,
  );
  const totalVisual = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.visualImpairment || 0),
    0,
  );
  const totalHearing = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.hearingImpairment || 0),
    0,
  );
  const totalDeafMute = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.deafMute || 0),
    0,
  );
  const totalDisabled = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.total || 0),
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
    

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4" id="introduction">
              उमेर अनुसार अपाङ्गता वितरण
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              परिवर्तन गाउँपालिकाको उमेर र अपाङ्गताको प्रकार अनुसार विस्तृत
              जनसंख्या विश्लेषण। यहाँ विभिन्न उमेर समूहमा रहेका अपाङ्गता भएका
              व्यक्तिहरूको तथ्याङ्क प्रस्तुत गरिएको छ।
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {localizeNumber(totalDisabled.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-blue-600">कुल अपाङ्गता भएका</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-red-600">
                  {localizeNumber(totalPhysical.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-red-600">शारीरिक अपाङ्गता</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {localizeNumber(totalVisual.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-green-600">दृष्टि अपाङ्गता</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {localizeNumber(dataWithoutTotal.length.toString(), "ne")}
                </div>
                <div className="text-sm text-purple-600">उमेर समूह</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <DisabilityCauseCharts
            disabilityData={disabilityData}
            totalDisabled={totalDisabled}
            totalPhysical={totalPhysical}
            totalVisual={totalVisual}
            totalHearing={totalHearing}
          />

          {/* Analysis Section */}
          <section id="detailed-analysis">
            <DisabilityCauseAnalysisSection
              disabilityData={disabilityData}
              totalDisabled={totalDisabled}
              totalPhysical={totalPhysical}
              totalVisual={totalVisual}
              totalHearing={totalHearing}
            />
          </section>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">डेटा स्रोत र नोट</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • यो तथ्याङ्क राष्ट्रिय जनगणना र स्थानीय सर्वेक्षणमा आधारित छ
              </li>
              <li>• अपाङ्गताको वर्गीकरण राष्ट्रिय मापदण्ड अनुसार गरिएको छ</li>
              <li>
                • यो डेटा नीति निर्माण र समावेशी विकास योजनाका लागि उपयोगी छ
              </li>
              <li>
                • अपाङ्गता भएका व्यक्तिहरूको अधिकार र सुविधा सुनिश्चित गर्न यो
                तथ्याङ्क महत्वपूर्ण छ
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
