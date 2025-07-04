import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import BirthCertificateCharts from "./_components/birth-certificate-charts";
import BirthCertificateAnalysisSection from "./_components/birth-certificate-analysis-section";
import BirthCertificateSEO from "./_components/birth-certificate-seo";

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
    const birthCertificateData =
      await api.profile.demographics.wardWiseBirthCertificatePopulation.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // pariwartan Rural Municipality

    // Try to get summary data
    let totalWithCertificate = 0;
    let totalWithoutCertificate = 0;
    let totalPopulation = 0;

    try {
      const summaryData =
        await api.profile.demographics.wardWiseBirthCertificatePopulation.summary.query();
      totalWithCertificate = summaryData.totalWithBirthCertificate;
      totalWithoutCertificate = summaryData.totalWithoutBirthCertificate;
      totalPopulation = summaryData.totalPopulationUnder5;
    } catch (error) {
      // Calculate from raw data if summary API fails
      totalWithCertificate = birthCertificateData.reduce(
        (sum, item) => sum + (item.withBirthCertificate || 0),
        0,
      );
      totalWithoutCertificate = birthCertificateData.reduce(
        (sum, item) => sum + (item.withoutBirthCertificate || 0),
        0,
      );
      totalPopulation = totalWithCertificate + totalWithoutCertificate;
    }

    // Create rich keywords with actual data
    const keywordsNP = [
      "परिवर्तन गाउँपालिका जन्मदर्ता",
      "पाँच वर्षमुनिका बालबालिका जन्मदर्ता",
      "वडा अनुसार जन्मदर्ता विवरण",
      "बालबालिका जन्मदर्ता विश्लेषण",
      "जन्मदर्ता प्रमाणपत्र धारक बालबालिका",
      `परिवर्तन जन्मदर्ताको स्थिति: जन्मदर्ता भएका ${localizeNumber(totalWithCertificate.toString(), "ne")}, नभएका ${localizeNumber(totalWithoutCertificate.toString(), "ne")}`,
      `परिवर्तन पाँच वर्षमुनिका कुल बालबालिका संख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "pariwartan Rural Municipality birth registration",
      "Children under five birth certificate",
      "Ward-wise birth registration data",
      "Birth certificate analysis",
      "Birth certificate holders in pariwartan",
      `pariwartan birth registration status: with certificate ${totalWithCertificate}, without certificate ${totalWithoutCertificate}`,
      `pariwartan total children under five years: ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकाको वडा अनुसार पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र वितरण र विश्लेषण। कुल ${localizeNumber(totalPopulation.toString(), "ne")} बालबालिकामध्ये ${localizeNumber(totalWithCertificate.toString(), "ne")} जनासँग जन्मदर्ता प्रमाणपत्र छ भने ${localizeNumber(totalWithoutCertificate.toString(), "ne")} जनासँग छैन।`;

    const descriptionEN = `Ward-wise distribution and analysis of birth certificate holders among children under five in pariwartan Rural Municipality. Out of ${totalPopulation} total children, ${totalWithCertificate} have birth certificates and ${totalWithoutCertificate} do not have birth certificates.`;

    return {
      title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/demographics/ward-wise-birth-certificate-population",
        languages: {
          en: "/en/profile/demographics/ward-wise-birth-certificate-population",
          ne: "/ne/profile/demographics/ward-wise-birth-certificate-population",
        },
      },
      openGraph: {
        title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "पाँच वर्षमुनिका बालबालिका जन्मदर्ता | परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "पाँच वर्षमुनिका बालबालिका जन्मदर्ता",
    slug: "birth-certificate-status",
  },
  {
    level: 2,
    text: "वडा अनुसार जन्मदर्ता वितरण",
    slug: "ward-wise-birth-certificates",
  },
  { level: 2, text: "जन्मदर्ता विश्लेषण", slug: "birth-certificate-analysis" },
];

export default async function WardWiseBirthCertificatePopulationPage() {
  // Fetch all birth certificate data using tRPC
  let birthCertificateData = [];
  try {
    const fetchedData =
      await api.profile.demographics.wardWiseBirthCertificatePopulation.getAll.query();
    birthCertificateData = fetchedData || [];
  } catch (error) {
    console.error("Error fetching birth certificate data:", error);
    birthCertificateData = [];
  }

  // Ensure we have valid data
  if (!Array.isArray(birthCertificateData)) {
    birthCertificateData = [];
  }

  // Try to fetch summary data
  let summaryData = null;
  let totalWithCertificate = 0;
  let totalWithoutCertificate = 0;
  let totalPopulation = 0;

  try {
    summaryData =
      await api.profile.demographics.wardWiseBirthCertificatePopulation.summary.query();

    if (summaryData) {
      totalWithCertificate = summaryData.totalWithBirthCertificate || 0;
      totalWithoutCertificate = summaryData.totalWithoutBirthCertificate || 0;
      totalPopulation = summaryData.totalPopulationUnder5 || 0;
    }
  } catch (error) {
    console.error("Could not fetch summary data", error);
    // Calculate from raw data if summary API fails
    if (birthCertificateData.length > 0) {
      totalWithCertificate = birthCertificateData.reduce((sum, item) => {
        if (!item) return sum;
        return sum + (item.withBirthCertificate || 0);
      }, 0);
      totalWithoutCertificate = birthCertificateData.reduce((sum, item) => {
        if (!item) return sum;
        return sum + (item.withoutBirthCertificate || 0);
      }, 0);
      totalPopulation = totalWithCertificate + totalWithoutCertificate;
    }
  }

  // If we still don't have data, return error state
  if (birthCertificateData.length === 0) {
    return (
      <DocsLayout toc={<TableOfContents toc={toc} />}>
        <div className="flex flex-col gap-8">
          <section>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="scroll-m-20 tracking-tight mb-6">
                परिवर्तन गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता
              </h1>
              <div className="bg-muted/50 p-6 rounded-lg text-center">
                <p className="text-muted-foreground">
                  जन्मदर्ता तथ्याङ्क लोड हुँदैछ वा उपलब्ध छैन।
                </p>
              </div>
            </div>
          </section>
        </div>
      </DocsLayout>
    );
  }

  // Sort data by ward number for consistent presentation
  const sortedData = [...birthCertificateData]
    .filter((item) => item && typeof item.wardNumber === "number")
    .sort((a, b) => a.wardNumber - b.wardNumber);

  // Get unique ward numbers with proper filtering
  const wardNumbers = Array.from(
    new Set(
      birthCertificateData
        .filter((item) => item && typeof item.wardNumber === "number")
        .map((item) => item.wardNumber),
    ),
  ).sort((a, b) => a - b);

  // Calculate ward-wise analysis with null checks
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = birthCertificateData.find(
      (item) => item && item.wardNumber === wardNumber,
    );

    const withCertificate = wardData?.withBirthCertificate || 0;
    const withoutCertificate = wardData?.withoutBirthCertificate || 0;
    const total = withCertificate + withoutCertificate;

    const percentageWithCertificate =
      totalWithCertificate > 0
        ? ((withCertificate / totalWithCertificate) * 100).toFixed(2)
        : "0";

    const percentageOfTotal =
      totalPopulation > 0 ? ((total / totalPopulation) * 100).toFixed(2) : "0";

    const coverageRate =
      total > 0 ? ((withCertificate / total) * 100).toFixed(2) : "0";

    return {
      wardNumber,
      withCertificate,
      withoutCertificate,
      total,
      percentageWithCertificate,
      percentageOfTotal,
      coverageRate,
    };
  });

  // Find wards with highest and lowest birth certificate registration with fallbacks
  const wardsRanked = [...wardWiseAnalysis].sort(
    (a, b) => (b.withCertificate || 0) - (a.withCertificate || 0),
  );

  const highestWard = wardsRanked[0] || {
    wardNumber: 0,
    withCertificate: 0,
    percentageWithCertificate: "0",
    coverageRate: "0",
  };

  const lowestWard = wardsRanked[wardsRanked.length - 1] || {
    wardNumber: 0,
    withCertificate: 0,
    percentageWithCertificate: "0",
    coverageRate: "0",
  };

  // Find ward with highest and lowest coverage rate with fallbacks
  const wardsRankedByCoverage = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.coverageRate || "0") - parseFloat(a.coverageRate || "0"),
  );

  const highestCoverageWard = wardsRankedByCoverage[0] || {
    wardNumber: 0,
    coverageRate: "0",
  };

  const lowestCoverageWard = wardsRankedByCoverage[
    wardsRankedByCoverage.length - 1
  ] || {
    wardNumber: 0,
    coverageRate: "0",
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <BirthCertificateSEO
        birthCertificateData={sortedData}
        totalWithCertificate={totalWithCertificate}
        totalWithoutCertificate={totalWithoutCertificate}
        totalPopulation={totalPopulation}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/birth-certificate.svg"
              width={1200}
              height={400}
              alt="पाँच वर्षमुनिका बालबालिका जन्मदर्ता - परिवर्तन गाउँपालिका (Birth Certificates for Children Under Five - pariwartan Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              परिवर्तन गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              जन्मदर्ता प्रमाणपत्र हरेक नागरिकको अधिकार हो र यसले बालबालिकाको
              पहिचान, शिक्षा, स्वास्थ्य सेवा लगायत विभिन्न सरकारी सेवाहरूमा
              पहुँच सुनिश्चित गर्दछ। यस खण्डमा परिवर्तन गाउँपालिकामा रहेका पाँच
              वर्षमुनिका बालबालिकाहरूको जन्मदर्ता स्थिति प्रस्तुत गरिएको छ।
            </p>
            <p>
              परिवर्तन गाउँपालिकाभरि पाँच वर्षमुनिका बालबालिकाहरूको कुल संख्या{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")} रहेको छ।
              यसमध्ये{" "}
              {localizeNumber(totalWithCertificate.toLocaleString(), "ne")} जना
              (
              {localizeNumber(
                totalPopulation > 0
                  ? ((totalWithCertificate / totalPopulation) * 100).toFixed(2)
                  : "0",
                "ne",
              )}
              %) बालबालिकासँग जन्मदर्ता प्रमाणपत्र छ भने{" "}
              {localizeNumber(totalWithoutCertificate.toLocaleString(), "ne")}{" "}
              जना (
              {localizeNumber(
                totalPopulation > 0
                  ? ((totalWithoutCertificate / totalPopulation) * 100).toFixed(
                      2,
                    )
                  : "0",
                "ne",
              )}
              %) बालबालिकासँग जन्मदर्ता प्रमाणपत्र छैन।
            </p>

            <h2
              id="birth-certificate-status"
              className="scroll-m-20 border-b pb-2"
            >
              पाँच वर्षमुनिका बालबालिका जन्मदर्ता स्थिति
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाको जन्मदर्ता स्थिति
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <BirthCertificateCharts
            birthCertificateData={sortedData}
            totalWithCertificate={totalWithCertificate}
            totalWithoutCertificate={totalWithoutCertificate}
            totalPopulation={totalPopulation}
            wardNumbers={wardNumbers}
            wardWiseAnalysis={wardWiseAnalysis}
            highestWard={highestWard}
            lowestWard={lowestWard}
            highestCoverageWard={highestCoverageWard}
            lowestCoverageWard={lowestCoverageWard}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="birth-certificate-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              जन्मदर्ता विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाको जन्मदर्ता
              विश्लेषण गर्दा, सबैभन्दा बढी जन्मदर्ता प्रमाणपत्र धारकहरू वडा नं{" "}
              {localizeNumber(highestWard.wardNumber.toString(), "ne")} मा{" "}
              {localizeNumber(
                highestWard.withCertificate.toLocaleString(),
                "ne",
              )}{" "}
              जना ({localizeNumber(highestWard.percentageWithCertificate, "ne")}
              %) रहेको पाइन्छ।
            </p>
            <p>
              जन्मदर्ता प्रमाणपत्र कभरेज दर (कुल बालबालिकामा जन्मदर्ता भएकाको
              अनुपात) सबैभन्दा उच्च वडा नं{" "}
              {localizeNumber(highestCoverageWard.wardNumber.toString(), "ne")}{" "}
              मा {localizeNumber(highestCoverageWard.coverageRate, "ne")}% र
              सबैभन्दा कम वडा नं{" "}
              {localizeNumber(lowestCoverageWard.wardNumber.toString(), "ne")}{" "}
              मा {localizeNumber(lowestCoverageWard.coverageRate, "ne")}% रहेको
              छ।
            </p>

            {/* Client component for analysis section */}
            <BirthCertificateAnalysisSection
              wardWiseAnalysis={wardWiseAnalysis}
              totalWithCertificate={totalWithCertificate}
              totalWithoutCertificate={totalWithoutCertificate}
              totalPopulation={totalPopulation}
              highestWard={highestWard}
              lowestWard={lowestWard}
              highestCoverageWard={highestCoverageWard}
              lowestCoverageWard={lowestCoverageWard}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
