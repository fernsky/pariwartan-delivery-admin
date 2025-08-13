import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import SettlementCharts from "./_components/settlement-charts";
import SettlementAnalysisSection from "./_components/settlement-analysis-section";
import SettlementSEO from "./_components/settlement-seo";
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
    const settlementData =
      await api.profile.municipalityIntroduction.municipalityWardWiseSettlement.get.query(
        {
          municipalityId: 1,
        },
      );
    const municipalityName = "परिवर्तन गाउँपालिका"; // Paribartan Rural Municipality

    // Process data for SEO
    const totalSettlements = settlementData.data.reduce(
      (sum, ward) => sum + ward.settlements.length,
      0,
    );

    // Get ward with most settlements for keywords
    const wardWithMostSettlements = settlementData.data.reduce((max, ward) =>
      ward.settlements.length > max.settlements.length ? ward : max,
    );

    // Create rich keywords with actual data
    const keywordsNP = [
      "परिवर्तन गाउँपालिका बस्ती वितरण",
      "परिवर्तन वडागत बस्ती",
      `परिवर्तन कुल ${localizeNumber(totalSettlements.toString(), "ne")} बस्ती`,
      `वडा ${wardWithMostSettlements.ward_number} सबैभन्दा धेरै बस्ती`,
      "गाउँपालिका बस्ती सूची",
      "वडावार बस्ती विवरण",
      "स्थानीय समुदाय नक्सांकन",
      ...wardWithMostSettlements.settlements.slice(0, 5),
    ];

    const keywordsEN = [
      "Paribartan Rural Municipality settlement distribution",
      "Paribartan ward settlements",
      `Paribartan total ${totalSettlements} settlements`,
      `Ward ${wardWithMostSettlements.ward_number_english} most settlements`,
      "Rural municipality settlement list",
      "Ward-wise settlement details",
      "Community mapping Nepal",
      ...wardWithMostSettlements.settlements.slice(0, 3),
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकाको वडागत बस्ती वितरण र विवरण। कुल ${localizeNumber(totalSettlements.toString(), "ne")} बस्तीहरू ${localizeNumber(settlementData.metadata.total_wards.toString(), "ne")} वडामा फैलिएका छन्। वडा ${wardWithMostSettlements.ward_number} मा सबैभन्दा धेरै ${localizeNumber(wardWithMostSettlements.settlements.length.toString(), "ne")} बस्तीहरू रहेका छन्। स्थानीय समुदाय र भौगोलिक क्षेत्रको विस्तृत तथ्याङ्क।`;

    const descriptionEN = `Ward-wise settlement distribution and details for Paribartan Rural Municipality. Total ${totalSettlements} settlements are spread across ${settlementData.metadata.total_wards} wards. Ward ${wardWithMostSettlements.ward_number_english} has the highest number of settlements with ${wardWithMostSettlements.settlements.length} settlements. Comprehensive data on local communities and geographical areas.`;

    return {
      title: `परिवर्तन गाउँपालिका | वडागत बस्ती विवरण | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/municipality-introduction/municipality-ward-wise-settlements",
        languages: {
          en: "/en/profile/municipality-introduction/municipality-ward-wise-settlements",
          ne: "/ne/profile/municipality-introduction/municipality-ward-wise-settlements",
        },
      },
      openGraph: {
        title: `वडागत बस्ती विवरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वडागत बस्ती विवरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "परिवर्तन गाउँपालिकामा वडागत बस्ती विवरण | पालिका प्रोफाइल",
      description:
        "परिवर्तन गाउँपालिकाको वडागत बस्ती वितरण, स्थानीय समुदाय र भौगोलिक क्षेत्रको विस्तृत तथ्याङ्क र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "वडागत बस्ती वितरण", slug: "ward-settlement-distribution" },
  {
    level: 2,
    text: "प्रमुख बस्तीहरूको विश्लेषण",
    slug: "major-settlements-analysis",
  },
];

export default async function MunicipalityWardWiseSettlementsPage() {
  // Fetch ward-wise settlement data from tRPC route
  const settlementData =
    await api.profile.municipalityIntroduction.municipalityWardWiseSettlement.get.query(
      {
        municipalityId: 1,
      },
    );

  // Calculate total settlements
  const totalSettlements = settlementData.data.reduce(
    (sum, ward) => sum + ward.settlements.length,
    0,
  );

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <SettlementSEO settlementData={settlementData} />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/ward-wise-settlement.svg"
              width={1200}
              height={400}
              alt="वडागत बस्ती वितरण - परिवर्तन गाउँपालिका (Ward-wise Settlement Distribution - Paribartan Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              <span className="font-bold">परिवर्तन गाउँपालिकाको</span> वडागत
              बस्ती विवरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकाका सबै वडाहरूमा अवस्थित प्रमुख
              बस्तीहरूको विस्तृत विवरण प्रस्तुत गरिएको छ। यो तथ्याङ्कले परिवर्तन
              गाउँपालिकाको भौगोलिक वितरण, स्थानीय समुदायको बसोबास ढाँचा र
              सामुदायिक संरचनालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              परिवर्तन गाउँपालिकामा कुल{" "}
              {localizeNumber(
                settlementData.metadata.total_wards.toString(),
                "ne",
              )}{" "}
              वडाहरूमा {localizeNumber(totalSettlements.toString(), "ne")}{" "}
              प्रमुख बस्तीहरू रहेका छन्। यी बस्तीहरूले पालिकाको सांस्कृतिक
              विविधता, भाषिक पहिचान र स्थानीय परम्परालाई झल्काउँछन्। प्रत्येक
              बस्तीको आफ्नै विशिष्ट पहिचान र इतिहास रहेको छ।
            </p>

            <h2
              id="ward-settlement-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              वडागत बस्ती वितरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाका विभिन्न वडाहरूमा बस्तीहरूको वितरण
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <SettlementCharts settlementData={settlementData} />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="major-settlements-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              प्रमुख बस्तीहरूको विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाका बस्तीहरूको विश्लेषण गर्दा विभिन्न प्रकारका
              बस्तीहरू देख्न सकिन्छ। यहाँका बस्तीहरूमा परम्परागत गाउँ, बजार
              क्षेत्र, खोला किनारका बस्तीहरू, डाँडा पाखामा बसेका समुदायहरू र चौर
              क्षेत्रका बस्तीहरू समावेश छन्।
            </p>

            {/* Client component for settlement analysis section */}
            <SettlementAnalysisSection settlementData={settlementData} />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
