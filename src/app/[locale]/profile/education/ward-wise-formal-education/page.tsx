import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseFormalEducationCharts from "./_components/ward-wise-formal-education-charts";
import WardWiseFormalEducationAnalysisSection from "./_components/ward-wise-formal-education-analysis-section";
import WardWiseFormalEducationSEO from "./_components/ward-wise-formal-education-seo";

const FORMAL_EDUCATION_GROUPS = {
  CURRENTLY_ATTENDING: {
    name: "हाल विद्यालय/कलेज गएका",
    nameEn: "Currently Attending School/College",
    color: "#4285F4", // Blue
  },
  PREVIOUSLY_ATTENDED: {
    name: "पहिला विद्यालय/कलेज गएका",
    nameEn: "Previously Attended School/College",
    color: "#34A853", // Green
  },
  NEVER_ATTENDED: {
    name: "कहिले विद्यालय/कलेज नगएका",
    nameEn: "Never Attended School/College",
    color: "#EA4335", // Red
  },
  NOT_MENTIONED: {
    name: "उल्लेख नभएको",
    nameEn: "Not Mentioned",
    color: "#FBBC05", // Yellow
  },
};

// Force dynamic rendering since we're using tRPC which relies on headers
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
    const wardWiseFormalEducationData =
      await api.profile.education.wardWiseFormalEducation.getAll.query({});
    const municipalityName = "परिवर्तन गाउँपालिका";

    // Calculate totals
    let totalPopulation = 0;
    let currentlyAttendingCount = 0;
    let neverAttendedCount = 0;

    wardWiseFormalEducationData.forEach((item: any) => {
      if (
        item.ward !== "जम्मा" &&
        item.ward !== "प्रतिशत" &&
        item.gender === "जम्मा"
      ) {
        totalPopulation += item.total;
        currentlyAttendingCount += item.currentlyAttending;
        neverAttendedCount += item.neverAttended;
      }
    });

    const currentlyAttendingPercentage = (
      (currentlyAttendingCount / totalPopulation) *
      100
    ).toFixed(2);
    const neverAttendedPercentage = (
      (neverAttendedCount / totalPopulation) *
      100
    ).toFixed(2);

    const descriptionNP = `परिवर्तन गाउँपालिकामा औपचारिक शिक्षाको स्थिति। कुल ${localizeNumber(totalPopulation.toLocaleString(), "ne")} जनसंख्या मध्ये ${localizeNumber(currentlyAttendingPercentage, "ne")}% हाल विद्यालय/कलेज जाँदै छन् र ${localizeNumber(neverAttendedPercentage, "ne")}% कहिल्यै विद्यालय/कलेज गएका छैनन्।`;

    return {
      title: `औपचारिक शिक्षा स्थिति | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [
        "परिवर्तन गाउँपालिका औपचारिक शिक्षा",
        "विद्यालय कलेज उपस्थिति",
        "वडागत शिक्षा स्थिति",
        "औपचारिक शिक्षा विश्लेषण",
        "शिक्षा पहुँच दर",
        "Khajura Rural Municipality formal education",
        "School college attendance",
        "Ward-wise education status",
      ],
    };
  } catch (error) {
    return {
      title: "औपचारिक शिक्षा स्थिति | परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार औपचारिक शिक्षाको स्थिति र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "औपचारिक शिक्षाको वितरण",
    slug: "distribution-of-formal-education",
  },
  {
    level: 2,
    text: "वडा अनुसार औपचारिक शिक्षा",
    slug: "ward-wise-formal-education",
  },
  {
    level: 2,
    text: "औपचारिक शिक्षा विश्लेषण",
    slug: "formal-education-analysis",
  },
  { level: 2, text: "शिक्षा पहुँच रणनीति", slug: "education-access-strategy" },
];

export default async function WardWiseFormalEducationPage() {
  // Fetch all ward-wise formal education data using tRPC
  const wardWiseFormalEducationData =
    await api.profile.education.wardWiseFormalEducation.getAll.query({});

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.education.wardWiseFormalEducation.getSummary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Filter out percentage and total rows, group by ward
  const validData = wardWiseFormalEducationData.filter(
    (item: any) =>
      item.ward !== "जम्मा" &&
      item.ward !== "प्रतिशत" &&
      !isNaN(parseInt(item.ward)),
  );

  // Group by ward number
  const wardGroups = validData.reduce((acc: any, curr: any) => {
    acc[curr.ward] = acc[curr.ward] || [];
    acc[curr.ward].push(curr);
    return acc;
  }, {});

  // Calculate totals by formal education status
  let totalPopulation = 0;
  const formalEducationTotals = {
    currentlyAttending: 0,
    previouslyAttended: 0,
    neverAttended: 0,
    notMentioned: 0,
  };

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      if (item.gender === "जम्मा") {
        // Only count total for each ward
        totalPopulation += item.total;
        formalEducationTotals.currentlyAttending += item.currentlyAttending;
        formalEducationTotals.previouslyAttended += item.previouslyAttended;
        formalEducationTotals.neverAttended += item.neverAttended;
        formalEducationTotals.notMentioned += item.notMentioned;
      }
    });
  });

  // Calculate percentages
  const formalEducationPercentages = {
    currentlyAttending: (
      (formalEducationTotals.currentlyAttending / totalPopulation) *
      100
    ).toFixed(2),
    previouslyAttended: (
      (formalEducationTotals.previouslyAttended / totalPopulation) *
      100
    ).toFixed(2),
    neverAttended: (
      (formalEducationTotals.neverAttended / totalPopulation) *
      100
    ).toFixed(2),
    notMentioned: (
      (formalEducationTotals.notMentioned / totalPopulation) *
      100
    ).toFixed(2),
  };

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = [
    {
      name: FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.name,
      nameEn: FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.nameEn,
      value: formalEducationTotals.currentlyAttending,
      percentage: formalEducationPercentages.currentlyAttending,
      color: FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.color,
    },
    {
      name: FORMAL_EDUCATION_GROUPS.PREVIOUSLY_ATTENDED.name,
      nameEn: FORMAL_EDUCATION_GROUPS.PREVIOUSLY_ATTENDED.nameEn,
      value: formalEducationTotals.previouslyAttended,
      percentage: formalEducationPercentages.previouslyAttended,
      color: FORMAL_EDUCATION_GROUPS.PREVIOUSLY_ATTENDED.color,
    },
    {
      name: FORMAL_EDUCATION_GROUPS.NEVER_ATTENDED.name,
      nameEn: FORMAL_EDUCATION_GROUPS.NEVER_ATTENDED.nameEn,
      value: formalEducationTotals.neverAttended,
      percentage: formalEducationPercentages.neverAttended,
      color: FORMAL_EDUCATION_GROUPS.NEVER_ATTENDED.color,
    },
    {
      name: FORMAL_EDUCATION_GROUPS.NOT_MENTIONED.name,
      nameEn: FORMAL_EDUCATION_GROUPS.NOT_MENTIONED.nameEn,
      value: formalEducationTotals.notMentioned,
      percentage: formalEducationPercentages.notMentioned,
      color: FORMAL_EDUCATION_GROUPS.NOT_MENTIONED.color,
    },
  ];

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber.toString()];
      if (!wardData) return null;

      const totalData = wardData.find((item: any) => item.gender === "जम्मा");
      if (!totalData) return null;

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        [FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.name]:
          totalData.currentlyAttending,
        [FORMAL_EDUCATION_GROUPS.PREVIOUSLY_ATTENDED.name]:
          totalData.previouslyAttended,
        [FORMAL_EDUCATION_GROUPS.NEVER_ATTENDED.name]: totalData.neverAttended,
        [FORMAL_EDUCATION_GROUPS.NOT_MENTIONED.name]: totalData.notMentioned,
        total: totalData.total,
      };
    })
    .filter(Boolean);

  // Find the ward with highest current attendance percentage
  const wardCurrentAttendancePercentages = wardWiseData.map((ward: any) => {
    const currentAttendancePercentage =
      (ward[FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.name] / ward.total) *
      100;
    return {
      wardNumber: ward.wardNumber,
      percentage: currentAttendancePercentage,
    };
  });

  const bestAttendanceWard = [...wardCurrentAttendancePercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const lowestAttendanceWard = [...wardCurrentAttendancePercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseFormalEducationSEO
        wardWiseFormalEducationData={wardWiseFormalEducationData}
        totalPopulation={totalPopulation}
        formalEducationTotals={formalEducationTotals}
        formalEducationPercelages={formalEducationPercentages}
        bestAttendanceWard={bestAttendanceWard}
        lowestAttendanceWard={lowestAttendanceWard}
        FORMAL_EDUCATION_GROUPS={FORMAL_EDUCATION_GROUPS}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/formal-education-status.svg"
              width={1200}
              height={400}
              alt="औपचारिक शिक्षा स्थिति - परिवर्तन गाउँपालिका"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              परिवर्तन गाउँपालिकामा औपचारिक शिक्षाको स्थिति
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              औपचारिक शिक्षा एक समाजको शैक्षिक पहुँच र गुणस्तरको महत्वपूर्ण सूचक
              हो। विद्यालय र कलेजमा उपस्थितिले व्यक्तिको ज्ञान, सीप र भविष्यका
              अवसरहरूमा प्रत्यक्ष प्रभाव पार्छ। यस खण्डमा परिवर्तन गाउँपालिकाको
              विभिन्न वडाहरूमा नागरिकहरूको औपचारिक शिक्षामा पहुँचको विश्लेषण
              प्रस्तुत गरिएको छ।
            </p>
            <p>
              परिवर्तन गाउँपालिकामा कुल{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")}{" "}
              जनसंख्यामध्ये{" "}
              {localizeNumber(
                formalEducationPercentages.currentlyAttending,
                "ne",
              )}
              % हाल विद्यालय/कलेज जाँदै छन्,{" "}
              {localizeNumber(
                formalEducationPercentages.previouslyAttended,
                "ne",
              )}
              % पहिला गएका छन्, र{" "}
              {localizeNumber(formalEducationPercentages.neverAttended, "ne")}%
              कहिल्यै विद्यालय/कलेज गएका छैनन्।
            </p>

            <h2
              id="distribution-of-formal-education"
              className="scroll-m-20 border-b pb-2"
            >
              औपचारिक शिक्षाको वितरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा औपचारिक शिक्षाको वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseFormalEducationCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalPopulation={totalPopulation}
            formalEducationTotals={formalEducationTotals}
            formalEducationPercentages={formalEducationPercentages}
            wardCurrentAttendancePercentages={wardCurrentAttendancePercentages}
            bestAttendanceWard={bestAttendanceWard}
            lowestAttendanceWard={lowestAttendanceWard}
            FORMAL_EDUCATION_GROUPS={FORMAL_EDUCATION_GROUPS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="formal-education-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              औपचारिक शिक्षा विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा औपचारिक शिक्षाको विश्लेषण गर्दा, समग्रमा
              {localizeNumber(
                formalEducationPercentages.currentlyAttending,
                "ne",
              )}
              % जनसंख्या हाल विद्यालय/कलेजमा अध्ययनरत छन्। वडागत रूपमा हेर्दा
              वडा नं.
              {localizeNumber(
                bestAttendanceWard.wardNumber.toString(),
                "ne",
              )}{" "}
              मा सबैभन्दा उच्च उपस्थिति दर रहेको देखिन्छ, जहाँ{" "}
              {localizeNumber(bestAttendanceWard.percentage.toFixed(2), "ne")}%
              जनसंख्या हाल शिक्षा प्राप्त गरिरहेका छन्।
            </p>

            <WardWiseFormalEducationAnalysisSection
              totalPopulation={totalPopulation}
              formalEducationTotals={formalEducationTotals}
              formalEducationPercentages={formalEducationPercentages}
              wardCurrentAttendancePercentages={
                wardCurrentAttendancePercentages
              }
              bestAttendanceWard={bestAttendanceWard}
              lowestAttendanceWard={lowestAttendanceWard}
              FORMAL_EDUCATION_GROUPS={FORMAL_EDUCATION_GROUPS}
            />

            <h2
              id="education-access-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              शिक्षा पहुँच रणनीति
            </h2>

            <p>
              परिवर्तन गाउँपालिकामा औपचारिक शिक्षाको तथ्याङ्क विश्लेषणबाट निम्न
              रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>शिक्षा पहुँच विस्तार:</strong>{" "}
                  {localizeNumber(
                    formalEducationPercentages.neverAttended,
                    "ne",
                  )}
                  % जनसंख्याले कहिल्यै औपचारिक शिक्षा प्राप्त नगरेको अवस्थामा यी
                  समुदायहरूमा शिक्षाको पहुँच बढाउन विशेष कार्यक्रम सञ्चालन
                  गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>शैक्षिक पूर्वाधार विकास:</strong> विद्यालय र कलेजहरूको
                  संख्या र गुणस्तर वृद्धि गरी सबै वडाका नागरिकहरूलाई सजिलो पहुँच
                  प्रदान गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>छात्रवृत्ति कार्यक्रम:</strong> आर्थिक समस्याका कारण
                  शिक्षाबाट वञ्चित भएका बालबालिकाहरूका लागि छात्रवृत्ति र अन्य
                  सहयोग कार्यक्रम सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>वयस्क साक्षरता:</strong> पहिला शिक्षा प्राप्त गरेका तर
                  अहिले नपढिरहेका व्यक्तिहरूका लागि निरन्तर शिक्षा र सीप विकास
                  कार्यक्रम सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>गुणस्तरीय शिक्षा:</strong> हाल अध्ययनरत
                  विद्यार्थीहरूलाई गुणस्तरीय शिक्षा प्रदान गर्न शिक्षक तालिम,
                  शैक्षिक सामग्री र आधुनिक शिक्षण विधिको प्रयोग गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी परिवर्तन गाउँपालिकामा औपचारिक शिक्षाको विश्लेषणले पालिकामा
              शैक्षिक पहुँचको अवस्था र भविष्यको शिक्षा नीति निर्माणमा महत्वपूर्ण
              भूमिका खेल्दछ। यसका लागि वडागत विशेषताहरूलाई ध्यानमा राखी शिक्षा
              पहुँच र गुणस्तर वृद्धिका कार्यक्रमहरू तर्जुमा गर्नु आवश्यक
              देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
