import { Metadata } from "next";
import { api } from "@/trpc/server";
import { TableOfContents } from "@/components/TableOfContents";
import DeceasedPopulationCharts from "./_components/deceased-population-charts";
import DeceasedPopulationAnalysisSection from "./_components/deceased-population-analysis-section";
import DeceasedPopulationSEO from "./_components/deceased-population-seo";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define type for deceased population data
type DeceasedDataType = {
  id?: string;
  wardNumber: number;
  ageGroup: string;
  gender: string;
  deceasedPopulation: number;
};

// Define type for API response
type APIDeceasedDataType = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  ageGroup:
    | "AGE_1_YEAR"
    | "AGE_1_4_YEARS"
    | "AGE_5_9_YEARS"
    | "AGE_10_14_YEARS"
    | "AGE_15_19_YEARS"
    | "AGE_20_24_YEARS"
    | "AGE_25_29_YEARS"
    | "AGE_30_34_YEARS"
    | "AGE_35_39_YEARS"
    | "AGE_40_44_YEARS"
    | "AGE_45_49_YEARS"
    | "AGE_50_54_YEARS"
    | "AGE_55_59_YEARS"
    | "AGE_60_64_YEARS"
    | "AGE_65_69_YEARS"
    | "AGE_70_74_YEARS"
    | "AGE_75_79_YEARS"
    | "AGE_80_AND_ABOVE";
  gender: "MALE" | "FEMALE" | "OTHER";
  deceasedPopulation: number;
};

// Mapping from API age group enum to display format
const API_AGE_GROUP_MAPPING: Record<string, string> = {
  AGE_1_YEAR: "0-4",
  AGE_1_4_YEARS: "0-4",
  AGE_5_9_YEARS: "5-9",
  AGE_10_14_YEARS: "10-14",
  AGE_15_19_YEARS: "15-19",
  AGE_20_24_YEARS: "20-24",
  AGE_25_29_YEARS: "25-29",
  AGE_30_34_YEARS: "30-34",
  AGE_35_39_YEARS: "35-39",
  AGE_40_44_YEARS: "40-44",
  AGE_45_49_YEARS: "45-49",
  AGE_50_54_YEARS: "50-54",
  AGE_55_59_YEARS: "55-59",
  AGE_60_64_YEARS: "60-64",
  AGE_65_69_YEARS: "65-69",
  AGE_70_74_YEARS: "70-74",
  AGE_75_79_YEARS: "75-79",
  AGE_80_AND_ABOVE: "80-84",
};

// Age group and gender mappings
const AGE_GROUP_NAMES: Record<string, string> = {
  "0-4": "०-४ वर्ष",
  "5-9": "५-९ वर्ष",
  "10-14": "१०-१४ वर्ष",
  "15-19": "१५-१९ वर्ष",
  "20-24": "२०-२४ वर्ष",
  "25-29": "२५-२९ वर्ष",
  "30-34": "३०-३४ वर्ष",
  "35-39": "३५-३९ वर्ष",
  "40-44": "४०-४४ वर्ष",
  "45-49": "४५-४९ वर्ष",
  "50-54": "५०-५४ वर्ष",
  "55-59": "५५-५९ वर्ष",
  "60-64": "६०-६४ वर्ष",
  "65-69": "६५-६९ वर्ष",
  "70-74": "७०-७४ वर्ष",
  "75-79": "७५-७९ वर्ष",
  "80-84": "८०-८४ वर्ष",
  "85+": "८५+ वर्ष",
};

const AGE_GROUP_NAMES_EN: Record<string, string> = {
  "0-4": "0-4 years",
  "5-9": "5-9 years",
  "10-14": "10-14 years",
  "15-19": "15-19 years",
  "20-24": "20-24 years",
  "25-29": "25-29 years",
  "30-34": "30-34 years",
  "35-39": "35-39 years",
  "40-44": "40-44 years",
  "45-49": "45-49 years",
  "50-54": "50-54 years",
  "55-59": "55-59 years",
  "60-64": "60-64 years",
  "65-69": "65-69 years",
  "70-74": "70-74 years",
  "75-79": "75-79 years",
  "80-84": "80-84 years",
  "85+": "85+ years",
};

const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

const GENDER_NAMES_EN: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
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
    const deceasedData =
      await api.profile.demographics.ageGenderWiseDeceasedPopulation.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // Paribartan Rural Municipality

    // Ensure deceasedData is a valid array
    if (!deceasedData || !Array.isArray(deceasedData)) {
      return {
        title: `वडा, उमेर र लिङ्ग अनुसार मृत्यु जनसंख्या - ${municipalityName}`,
        description: `${municipalityName}को वडा, उमेर समूह र लिङ्ग अनुसार मृत्यु जनसंख्याको विस्तृत तथ्याङ्क।`,
      };
    }

    // Process data for SEO
    const totalDeceasedPopulation = deceasedData.reduce(
      (sum, item) => sum + (item.deceasedPopulation || 0),
      0,
    );

    // Get most affected age group
    const ageGroupTotals: Record<string, number> = {};
    deceasedData.forEach((item) => {
      ageGroupTotals[item.ageGroup] =
        (ageGroupTotals[item.ageGroup] || 0) + (item.deceasedPopulation || 0);
    });

    const mostAffectedAgeGroup = Object.entries(ageGroupTotals).sort(
      ([, a], [, b]) => b - a,
    )[0];
    const mostAffectedAgeGroupName = mostAffectedAgeGroup
      ? AGE_GROUP_NAMES[mostAffectedAgeGroup[0]]
      : "";

    const title = `वडा, उमेर र लिङ्ग अनुसार मृत्यु जनसंख्या - ${municipalityName}`;
    const description = `${municipalityName}को वडा, उमेर समूह र लिङ्ग अनुसार मृत्यु जनसंख्याको विस्तृत तथ्याङ्क। कुल मृत्यु संख्या: ${totalDeceasedPopulation.toLocaleString()} व्यक्ति। सबैभन्दा प्रभावित उमेर समूह: ${mostAffectedAgeGroupName}।`;

    return {
      title,
      description,
      keywords: [
        "मृत्यु जनसंख्या",
        "वडा अनुसार मृत्यु",
        "उमेर अनुसार मृत्यु",
        "लिङ्ग अनुसार मृत्यु",
        "परिवर्तन गाउँपालिका",
        "परिवर्तन गाऊँपालिका",
        "मृत्यु तथ्याङ्क",
        "Deceased population",
        "Ward-wise mortality",
        "Age-wise mortality",
        "Gender-wise mortality",
        "Paribartan Rural Municipality",
        "Mortality statistics",
        ...Object.values(AGE_GROUP_NAMES),
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
      title: "वडा, उमेर र लिङ्ग अनुसार मृत्यु जनसंख्या - परिवर्तन गाउँपालिका",
      description:
        "परिवर्तन गाउँपालिकाको वडा, उमेर समूह र लिङ्ग अनुसार मृत्यु जनसंख्याको विस्तृत तथ्याङ्क।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "लिङ्ग अनुसार मृत्यु विवरण",
    slug: "gender-wise-mortality",
  },
  { level: 2, text: "उमेर समूह अनुसार मृत्यु", slug: "age-group-mortality" },
  { level: 2, text: "वडा अनुसार मृत्यु विवरण", slug: "ward-wise-mortality" },
  { level: 2, text: "मृत्युदर विश्लेषण", slug: "mortality-analysis" },
];

export default async function DeceasedPopulationPage() {
  // Fetch all deceased population data from your tRPC route
  let deceasedData: DeceasedDataType[] = [];
  try {
    const fetchedData =
      await api.profile.demographics.ageGenderWiseDeceasedPopulation.getAll.query();

    // Transform API response to match DeceasedDataType
    deceasedData = (fetchedData || []).map(
      (item: APIDeceasedDataType, index: number) => ({
        id: item.id,
        wardNumber: Math.floor(index / 18) + 1, // Assuming 18 age-gender combinations per ward
        ageGroup: API_AGE_GROUP_MAPPING[item.ageGroup] || item.ageGroup,
        gender: item.gender,
        deceasedPopulation: item.deceasedPopulation,
      }),
    );
  } catch (error) {
    console.error("Error fetching deceased data:", error);
    deceasedData = [];
  }

  // Ensure deceasedData is a valid array
  if (!deceasedData || !Array.isArray(deceasedData)) {
    deceasedData = [];
  }

  // Calculate totals and process data
  const totalDeceasedPopulation = deceasedData.reduce(
    (sum, item) => sum + (item.deceasedPopulation || 0),
    0,
  );

  // Get unique ward numbers and sort them
  const wardNumbers = Array.from(
    new Set(deceasedData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Process gender totals
  const genderTotals = {
    male: deceasedData
      .filter((item) => item.gender === "MALE")
      .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
    female: deceasedData
      .filter((item) => item.gender === "FEMALE")
      .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
    other: deceasedData
      .filter((item) => item.gender === "OTHER")
      .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
  };

  // Process age group data for charts
  const ageGroupData: Record<
    string,
    { male: number; female: number; other: number; total: number }
  > = {};
  Object.keys(AGE_GROUP_NAMES).forEach((ageGroup) => {
    const ageGroupItems = deceasedData.filter(
      (item) => item.ageGroup === ageGroup,
    );
    ageGroupData[ageGroup] = {
      male: ageGroupItems
        .filter((item) => item.gender === "MALE")
        .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
      female: ageGroupItems
        .filter((item) => item.gender === "FEMALE")
        .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
      other: ageGroupItems
        .filter((item) => item.gender === "OTHER")
        .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
      total: ageGroupItems.reduce(
        (sum, item) => sum + (item.deceasedPopulation || 0),
        0,
      ),
    };
  });

  // Process ward data for charts
  const wardData: Record<
    number,
    { male: number; female: number; other: number; total: number }
  > = {};
  wardNumbers.forEach((wardNumber) => {
    const wardItems = deceasedData.filter(
      (item) => item.wardNumber === wardNumber,
    );
    wardData[wardNumber] = {
      male: wardItems
        .filter((item) => item.gender === "MALE")
        .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
      female: wardItems
        .filter((item) => item.gender === "FEMALE")
        .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
      other: wardItems
        .filter((item) => item.gender === "OTHER")
        .reduce((sum, item) => sum + (item.deceasedPopulation || 0), 0),
      total: wardItems.reduce(
        (sum, item) => sum + (item.deceasedPopulation || 0),
        0,
      ),
    };
  });

  // Prepare chart data
  const ageGroupChartData = Object.entries(ageGroupData)
    .filter(([_, data]) => data.total > 0)
    .map(([ageGroup, data]) => ({
      ageGroup: AGE_GROUP_NAMES[ageGroup],
      ageGroupEn: AGE_GROUP_NAMES_EN[ageGroup],
      ageGroupKey: ageGroup,
      [GENDER_NAMES.MALE]: data.male,
      [GENDER_NAMES.FEMALE]: data.female,
      [GENDER_NAMES.OTHER]: data.other,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total);

  const wardChartData = Object.entries(wardData)
    .filter(([_, data]) => data.total > 0)
    .map(([wardNumber, data]) => ({
      ward: `वडा ${localizeNumber(wardNumber, "ne")}`,
      wardNumber: Number(wardNumber),
      [GENDER_NAMES.MALE]: data.male,
      [GENDER_NAMES.FEMALE]: data.female,
      [GENDER_NAMES.OTHER]: data.other,
      total: data.total,
    }))
    .sort((a, b) => a.wardNumber - b.wardNumber);

  const genderPieChartData = [
    {
      name: GENDER_NAMES.MALE,
      value: genderTotals.male,
      percentage:
        totalDeceasedPopulation > 0
          ? ((genderTotals.male / totalDeceasedPopulation) * 100).toFixed(2)
          : "0",
    },
    {
      name: GENDER_NAMES.FEMALE,
      value: genderTotals.female,
      percentage:
        totalDeceasedPopulation > 0
          ? ((genderTotals.female / totalDeceasedPopulation) * 100).toFixed(2)
          : "0",
    },
    {
      name: GENDER_NAMES.OTHER,
      value: genderTotals.other,
      percentage:
        totalDeceasedPopulation > 0
          ? ((genderTotals.other / totalDeceasedPopulation) * 100).toFixed(2)
          : "0",
    },
  ].filter((item) => item.value > 0);

  // Analysis data
  const mostAffectedAgeGroup = ageGroupChartData[0];
  const leastAffectedAgeGroup = ageGroupChartData[ageGroupChartData.length - 1];

  // Calculate elderly (60+) and children (0-14) percentages
  const elderlyAgeGroups = ["60-64", "65-69", "70-74", "75-79", "80-84", "85+"];
  const childrenAgeGroups = ["0-4", "5-9", "10-14"];

  const elderlyTotal = elderlyAgeGroups.reduce(
    (sum, ageGroup) => sum + (ageGroupData[ageGroup]?.total || 0),
    0,
  );
  const childrenTotal = childrenAgeGroups.reduce(
    (sum, ageGroup) => sum + (ageGroupData[ageGroup]?.total || 0),
    0,
  );

  const elderlyPercentage =
    totalDeceasedPopulation > 0
      ? ((elderlyTotal / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";
  const childrenPercentage =
    totalDeceasedPopulation > 0
      ? ((childrenTotal / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  const ageGroupsAnalysis = {
    mostAffected: mostAffectedAgeGroup,
    leastAffected: leastAffectedAgeGroup,
    elderlyPercentage,
    childrenPercentage,
  };

  const mostAffectedWard = wardChartData.sort((a, b) => b.total - a.total)[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* SEO Component */}
          <DeceasedPopulationSEO
            totalDeceasedPopulation={totalDeceasedPopulation}
            ageGroupData={ageGroupData}
            wardData={wardData}
            genderTotals={genderTotals}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            AGE_GROUP_NAMES_EN={AGE_GROUP_NAMES_EN}
            GENDER_NAMES={GENDER_NAMES}
            GENDER_NAMES_EN={GENDER_NAMES_EN}
            wardNumbers={wardNumbers}
          />

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4" id="introduction">
              वडा, उमेर र लिङ्ग अनुसार मृत्यु जनसंख्या
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              परिवर्तन गाउँपालिकाको वडा, उमेर समूह र लिङ्ग अनुसार मृत्यु
              जनसंख्याको विस्तृत विश्लेषण। यहाँ विभिन्न वडा, उमेर समूह र लिङ्गको
              मृत्यु तथ्याङ्क प्रस्तुत गरिएको छ।
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-red-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-red-600">
                  {localizeNumber(
                    totalDeceasedPopulation.toLocaleString(),
                    "ne",
                  )}
                </div>
                <div className="text-sm text-red-600">कुल मृत्यु संख्या</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {localizeNumber(genderTotals.male.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-blue-600">पुरुष मृत्यु</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-pink-600">
                  {localizeNumber(genderTotals.female.toLocaleString(), "ne")}
                </div>
                <div className="text-sm text-pink-600">महिला मृत्यु</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {localizeNumber(wardNumbers.length.toString(), "ne")}
                </div>
                <div className="text-sm text-purple-600">वडा संख्या</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <DeceasedPopulationCharts
            totalDeceasedPopulation={totalDeceasedPopulation}
            ageGroupChartData={ageGroupChartData}
            wardChartData={wardChartData}
            genderPieChartData={genderPieChartData}
            wardNumbers={wardNumbers}
            deceasedData={deceasedData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            GENDER_NAMES={GENDER_NAMES}
          />

          {/* Analysis Section */}
          <section id="mortality-analysis">
            <DeceasedPopulationAnalysisSection
              totalDeceasedPopulation={totalDeceasedPopulation}
              genderTotals={genderTotals}
              ageGroupsAnalysis={ageGroupsAnalysis}
              mostAffectedWard={mostAffectedWard}
              ageGroupChartData={ageGroupChartData}
              wardChartData={wardChartData}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
              AGE_GROUP_NAMES_EN={AGE_GROUP_NAMES_EN}
              GENDER_NAMES={GENDER_NAMES}
              GENDER_NAMES_EN={GENDER_NAMES_EN}
            />
          </section>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">डेटा स्रोत र नोट</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • यो तथ्याङ्क जन्म मृत्यु दर्ता कार्यालय र स्थानीय सर्वेक्षणमा
                आधारित छ
              </li>
              <li>• मृत्यु तथ्याङ्कमा सबै उमेरका व्यक्तिहरू समावेश छन्</li>
              <li>• उमेर समूह र लिङ्ग वर्गीकरण मापदण्ड अनुसार गरिएको छ</li>
              <li>• यो डेटा स्वास्थ्य नीति निर्माण र योजनाका लागि उपयोगी छ</li>
              <li>• डेटाको गुणस्तर र शुद्धताका लागि नियमित अपडेट गरिन्छ</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
