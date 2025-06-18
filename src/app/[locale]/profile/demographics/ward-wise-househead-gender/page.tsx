import { Metadata } from "next";
import { api } from "@/trpc/server";
import { TableOfContents } from "@/components/TableOfContents";
import HouseheadGenderCharts from "./_components/househead-gender-charts";
import GenderAnalysisSection from "./_components/gender-analysis-section";
import GenderSEO from "./_components/gender-seo";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define type for age group househead data
type AgeGroupHouseheadType = {
  id?: string;
  ageGroup: string;
  maleHeads: number;
  femaleHeads: number;
  totalFamilies: number;
  updatedAt?: Date;
  createdAt?: Date;
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
    const househeadData =
      await api.profile.demographics.ageGroupHouseHeadGender.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका";

    // Ensure househeadData is a valid array
    if (!househeadData || !Array.isArray(househeadData)) {
      return {
        title: `उमेर समूह अनुसार घरमूली लिङ्ग वितरण - ${municipalityName}`,
        description: `${municipalityName}को उमेर समूह अनुसार घरमूली लिङ्ग वितरणको विस्तृत तथ्याङ्क।`,
      };
    }

    // Process data for SEO (exclude the 'जम्मा' row)
    const dataWithoutTotal = househeadData.filter(
      (item) => item.ageGroup !== "जम्मा",
    );
    const totalFamilies = dataWithoutTotal.reduce(
      (sum, item) => sum + (item.totalFamilies || 0),
      0,
    );

    // Get top 3 age groups for keywords
    const topAgeGroups = dataWithoutTotal.slice(0, 3);

    const title = `उमेर समूह अनुसार घरमूली लिङ्ग वितरण - ${municipalityName}`;
    const description = `${municipalityName}को उमेर समूह अनुसार घरमूली लिङ्ग वितरणको विस्तृत तथ्याङ्क। कुल परिवार: ${totalFamilies.toLocaleString()} परिवार। मुख्य उमेर समूहहरू: ${topAgeGroups.map((a) => a.ageGroup).join(", ")}।`;

    return {
      title,
      description,
      keywords: [
        "घरमूली लिङ्ग वितरण",
        "उमेर समूह घरमूली",
        "परिवर्तन गाउँपालिका",
        "परिवार तथ्याङ्क",
        "Household head gender distribution",
        "Age group household heads",
        "Pariwartan Rural Municipality",
        "Family statistics",
        ...dataWithoutTotal.map((a) => a.ageGroup),
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
      title: "उमेर समूह अनुसार घरमूली लिङ्ग वितरण - परिवर्तन गाउँपालिका",
      description:
        "परिवर्तन गाउँपालिकाको उमेर समूह अनुसार घरमूली लिङ्ग वितरणको विस्तृत तथ्याङ्क।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "लिङ्ग अनुसार घरमूली", slug: "gender-distribution" },
  { level: 2, text: "उमेर समूह अनुसार घरमूली", slug: "age-group-distribution" },
  {
    level: 2,
    text: "उमेर समूह र लैंगिक वितरण",
    slug: "age-gender-distribution",
  },
  {
    level: 2,
    text: "घरमूली लैंगिक विश्लेषण",
    slug: "househead-gender-analysis",
  },
];

export default async function WardWiseHouseheadGenderPage() {
  // Fetch all age group househead data from your tRPC route
  let househeadData: AgeGroupHouseheadType[] = [];
  try {
    const fetchedData =
      await api.profile.demographics.ageGroupHouseHeadGender.getAll.query();
    househeadData = fetchedData || [];
  } catch (error) {
    console.error("Error fetching househead data:", error);
    househeadData = [];
  }

  // Ensure househeadData is a valid array
  if (!househeadData || !Array.isArray(househeadData)) {
    househeadData = [];
  }

  // Fetch summary statistics
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.ageGroupHouseHeadGender.summary.query();
  } catch (error) {
    console.error("Error fetching summary:", error);
  }

  // Filter out the 'जम्मा' row for calculations to avoid double counting
  const dataWithoutTotal = househeadData.filter(
    (item) => item.ageGroup !== "जम्मा",
  );

  // Calculate totals from the filtered data
  const totalMaleHeads = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.maleHeads || 0),
    0,
  );
  const totalFemaleHeads = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.femaleHeads || 0),
    0,
  );
  const totalFamilies = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.totalFamilies || 0),
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <GenderSEO
        ageGroupData={househeadData}
        totalMaleHeads={totalMaleHeads}
        totalFemaleHeads={totalFemaleHeads}
        totalFamilies={totalFamilies}
      />

      <div className="flex gap-8">
      
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4" id="introduction">
              उमेर समूह अनुसार घरमूली लिङ्ग वितरण
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              परिवर्तन गाउँपालिकाको उमेर समूह अनुसार घरमूली लिङ्ग वितरणको
              विस्तृत विश्लेषण। यहाँ विभिन्न उमेर समूहका पुरुष र महिला
              घरमूलीहरूको तथ्याङ्क प्रस्तुत गरिएको छ।
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {localizeNumber(totalFamilies.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-blue-600">कुल परिवार</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {localizeNumber(totalMaleHeads.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-green-600">पुरुष घरमूली</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-pink-600">
                  {localizeNumber(totalFemaleHeads.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-pink-600">महिला घरमूली</div>
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
          <HouseheadGenderCharts
            ageGroupData={househeadData}
            totalMaleHeads={totalMaleHeads}
            totalFemaleHeads={totalFemaleHeads}
            totalFamilies={totalFamilies}
          />

          {/* Analysis Section */}
          <section id="househead-gender-analysis">
            <GenderAnalysisSection
              ageGroupData={househeadData}
              totalMaleHeads={totalMaleHeads}
              totalFemaleHeads={totalFemaleHeads}
              totalFamilies={totalFamilies}
            />
          </section>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">डेटा स्रोत र नोट</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • यो तथ्याङ्क राष्ट्रिय जनगणना र स्थानीय सर्वेक्षणमा आधारित छ
              </li>
              <li>• घरमूली तथ्याङ्कमा सबै उमेरका घरमूलीहरू समावेश छन्</li>
              <li>
                • उमेर समूह वर्गीकरण मानक जनसांख्यिकीय मापदण्ड अनुसार गरिएको छ
              </li>
              <li>• यो डेटा नीति निर्माण र विकास योजनाका लागि उपयोगी छ</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
