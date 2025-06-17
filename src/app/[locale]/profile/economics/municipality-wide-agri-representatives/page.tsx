import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import AgricultureRepresentativesTable from "./_components/agriculture-representatives-table";
import AgricultureRepresentativesSEO from "./_components/agriculture-representatives-seo";
import AgricultureRepresentativesAnalysis from "./_components/agriculture-representatives-analysis";
import { api } from "@/trpc/server";
import { formatNepaliNumber } from "@/lib/utils/nepali-numbers";

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
    const representativesData =
      await api.profile.economics.municipalityWideAgricultureRepresentatives.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalRepresentatives = representativesData.length;

    // Create rich keywords with actual data
    const keywordsNP = [
      "परिवर्तन गाउँपालिका कृषि प्रतिनिधि",
      "कृषि कर्मचारी सूची",
      "नायब प्रशासन सहायक कृषि",
      "कृषि शाखा कर्मचारी",
      "परिवर्तन कृषि टीम",
      `कुल कृषि कर्मचारी ${totalRepresentatives}`,
      "कृषि विभाग संपर्क",
      "कृषि सेवा प्रदायक",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality agriculture representatives",
      "Agriculture staff list",
      "Assistant Administration Officer Agriculture",
      "Agriculture branch employees",
      "Khajura agriculture team",
      `Total agriculture staff ${totalRepresentatives}`,
      "Agriculture department contacts",
      "Agriculture service providers",
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकाको कृषि शाखामा कार्यरत कर्मचारीहरूको विस्तृत सूची। कुल ${totalRepresentatives} जना कृषि प्रतिनिधिहरूको नाम, पद, सम्पर्क नम्बर र अन्य विवरणहरू। कृषि सेवा र सहयोगका लागि सम्पर्क जानकारी।`;

    const descriptionEN = `Detailed list of staff working in the Agriculture branch of Khajura Rural Municipality. Complete information of ${totalRepresentatives} agriculture representatives including names, positions, contact numbers and other details. Contact information for agriculture services and support.`;

    return {
      title: `कृषि प्रतिनिधिहरूको विवरण | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-agri-representatives",
        languages: {
          en: "/en/profile/economics/municipality-wide-agri-representatives",
          ne: "/ne/profile/economics/municipality-wide-agri-representatives",
        },
      },
      openGraph: {
        title: `कृषि प्रतिनिधिहरूको विवरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `कृषि प्रतिनिधिहरूको विवरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "कृषि प्रतिनिधिहरूको विवरण | पालिका प्रोफाइल",
      description:
        "परिवर्तन गाउँपालिकाको कृषि शाखामा कार्यरत कर्मचारीहरूको विस्तृत सूची र सम्पर्क विवरण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "कृषि प्रतिनिधिहरूको सूची", slug: "representatives-list" },
  { level: 2, text: "सम्पर्क विवरण", slug: "contact-details" },
  { level: 2, text: "विश्लेषण र सांख्यिकी", slug: "analysis-statistics" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function MunicipalityWideAgriRepresentativesPage() {
  // Fetch all agriculture representatives data using tRPC
  const representativesData =
    await api.profile.economics.municipalityWideAgricultureRepresentatives.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideAgricultureRepresentatives.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  const totalRepresentatives = representativesData.length;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <AgricultureRepresentativesSEO
        representativesData={representativesData.map((rep) => ({
          ...rep,
          remarks: rep.remarks ?? undefined,
        }))}
        totalRepresentatives={totalRepresentatives}
      />

      <div className="flex flex-col gap-8">
        <section>
          {/* Inline SVG Banner */}
          <div className="relative rounded-lg overflow-hidden mb-8 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
            <svg
              width="100%"
              height="250"
              viewBox="0 0 1200 250"
              className="w-full h-[250px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background and patterns from existing */}
              <defs>
                <linearGradient
                  id="representativesBg"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#e8f5e8", stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#e3f2fd", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#f1f8e9", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>

              <rect width="1200" height="250" fill="url(#representativesBg)" />

              {/* Office building representing municipality */}
              <g transform="translate(200,80)">
                <rect x="0" y="50" width="80" height="70" fill="#90a4ae" />
                <rect x="0" y="45" width="80" height="10" fill="#607d8b" />
                <rect x="15" y="70" width="12" height="15" fill="#263238" />
                <rect
                  x="25"
                  y="60"
                  width="15"
                  height="12"
                  fill="#1976d2"
                  opacity="0.7"
                />
                <rect
                  x="45"
                  y="60"
                  width="15"
                  height="12"
                  fill="#1976d2"
                  opacity="0.7"
                />
                <rect x="55" y="70" width="12" height="15" fill="#263238" />
                <text
                  x="40"
                  y="140"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#5d4037"
                >
                  गाउँपालिका कार्यालय
                </text>
              </g>

              {/* People icons representing staff */}
              <g transform="translate(400,120)">
                <circle cx="0" cy="0" r="8" fill="#4caf50" />
                <rect x="-6" y="5" width="12" height="18" fill="#2196f3" />
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#333">
                  कृषि प्रतिनिधि
                </text>
              </g>

              <g transform="translate(500,120)">
                <circle cx="0" cy="0" r="8" fill="#ff9800" />
                <rect x="-6" y="5" width="12" height="18" fill="#2196f3" />
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#333">
                  कृषि कर्मचारी
                </text>
              </g>

              <g transform="translate(600,120)">
                <circle cx="0" cy="0" r="8" fill="#9c27b0" />
                <rect x="-6" y="5" width="12" height="18" fill="#2196f3" />
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#333">
                  सहायक
                </text>
              </g>

              {/* Agricultural symbols */}
              <g transform="translate(800,100)">
                <path
                  d="M0,30 L0,0 M-3,3 L3,3 M-3,6 L3,6 M-3,9 L3,9"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x="0"
                  y="45"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#2e7d32"
                >
                  कृषि सेवा
                </text>
              </g>

              {/* Title overlay */}
              <g transform="translate(600,125)">
                <rect
                  x="-200"
                  y="-15"
                  width="400"
                  height="30"
                  fill="#ffffff"
                  opacity="0.9"
                  rx="15"
                />
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#2e7d32"
                >
                  कृषि प्रतिनिधिहरूको विवरण
                </text>
                <text
                  x="0"
                  y="18"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#5d4037"
                >
                  परिवर्तन गाउँपालिका
                </text>
              </g>
            </svg>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              परिवर्तन गाउँपालिकाका कृषि प्रतिनिधिहरूको विवरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकाको कृषि शाखामा कार्यरत कर्मचारीहरूको
              विस्तृत विवरण प्रस्तुत गरिएको छ। यहाँ कुल{" "}
              {formatNepaliNumber(totalRepresentatives)} जना कृषि प्रतिनिधिहरूको
              नाम, पद, सम्पर्क नम्बर र अन्य आवश्यक जानकारीहरू समावेश छन्।
            </p>
            <p>
              यी कृषि प्रतिनिधिहरूले स्थानीय किसानहरूलाई कृषि सम्बन्धी सल्लाह,
              प्राविधिक सहयोग, र विभिन्न कृषि कार्यक्रमहरूको जानकारी प्रदान
              गर्ने काम गर्छन्। कृषि सम्बन्धी कुनै पनि सहयोग चाहिएमा यहाँ दिइएको
              सम्पर्क विवरण प्रयोग गर्न सकिन्छ।
            </p>

            <h2 id="representatives-list" className="scroll-m-20 border-b pb-2">
              कृषि प्रतिनिधिहरूको सूची
            </h2>
            <p>
              तलको तालिकामा परिवर्तन गाउँपालिकाका सबै कृषि प्रतिनिधिहरूको
              विस्तृत जानकारी प्रस्तुत गरिएको छ:
            </p>
          </div>

          {/* Main representatives table component */}
          <AgricultureRepresentativesTable
            representativesData={representativesData.map((rep) => ({
              ...rep,
              remarks: rep.remarks ?? undefined,
            }))}
            totalRepresentatives={totalRepresentatives}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="contact-details" className="scroll-m-20 border-b pb-2">
              सम्पर्क विवरण
            </h2>
            <p>
              कृषि सम्बन्धी सेवा र सहयोगका लागि माथि दिइएका कर्मचारीहरूको
              सम्पर्क नम्बरमा सम्पर्क गर्न सकिन्छ। सबै कर्मचारीहरू कृषि शाखामा
              कार्यरत छन् र नायब प्रशासन सहायक पदमा रहेका छन्।
            </p>

            {/* Analysis component */}
            <AgricultureRepresentativesAnalysis
              representativesData={representativesData.map((rep) => ({
                ...rep,
                remarks: rep.remarks ?? undefined,
              }))}
              summaryData={summaryData}
              totalRepresentatives={totalRepresentatives}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका जानकारीहरू परिवर्तन गाउँपालिकाको कृषि शाखाबाट
              संकलन गरिएको हो। यी तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>कृषि सेवा प्रदायकहरूको पहिचान र सम्पर्क</li>
              <li>कृषि सल्लाह र प्राविधिक सहयोग प्राप्त गर्न</li>
              <li>कृषि कार्यक्रम र योजनाहरूको जानकारी लिन</li>
              <li>कृषि अनुदान र सहयोग सम्बन्धी जानकारी</li>
              <li>कृषि समस्या समाधानका लागि सम्पर्क</li>
            </ul>

            <div className="bg-muted/50 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-medium mb-2">विशेष सूचना</h3>
              <p className="text-sm">
                यहाँ प्रस्तुत गरिएका सम्पर्क विवरणहरू नियमित रूपमा अद्यावधिक
                गरिन्छ। कुनै पनि परिवर्तन भएमा कृपया गाउँपालिका कार्यालयमा
                जानकारी गराउनुहोस्। कृषि सेवाका लागि कार्यालय समयमा सम्पर्क
                गर्नुहोस्।
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
