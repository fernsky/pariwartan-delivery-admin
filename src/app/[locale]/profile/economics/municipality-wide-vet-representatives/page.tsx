import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import VeterinaryRepresentativesTable from "./_components/veterinary-representatives-table";
import VeterinaryRepresentativesSEO from "./_components/veterinary-representatives-seo";
import VeterinaryRepresentativesAnalysis from "./_components/veterinary-representatives-analysis";
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
      await api.profile.economics.municipalityWideVeterinaryRepresentatives.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalRepresentatives = representativesData.length;

    // Create rich keywords with actual data
    const keywordsNP = [
      "परिवर्तन गाउँपालिका पशु चिकित्सा प्रतिनिधि",
      "पशु चिकित्सा कर्मचारी सूची",
      "पशु स्वास्थ्य प्राविधिक",
      "पशु सेवा शाखा कर्मचारी",
      "परिवर्तन पशु चिकित्सा टीम",
      `कुल पशु चिकित्सा कर्मचारी ${totalRepresentatives}`,
      "पशु चिकित्सा विभाग संपर्क",
      "पशु सेवा प्रदायक",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality veterinary representatives",
      "Veterinary staff list",
      "Animal Health Technician",
      "Animal Service Branch employees",
      "Khajura veterinary team",
      `Total veterinary staff ${totalRepresentatives}`,
      "Veterinary department contacts",
      "Animal service providers",
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकाको पशु सेवा शाखामा कार्यरत कर्मचारीहरूको विस्तृत सूची। कुल ${totalRepresentatives} जना पशु चिकित्सा प्रतिनिधिहरूको नाम, पद, सम्पर्क नम्बर र अन्य विवरणहरू। पशु स्वास्थ्य सेवा र सहयोगका लागि सम्पर्क जानकारी।`;

    const descriptionEN = `Detailed list of staff working in the Animal Service branch of Khajura Rural Municipality. Complete information of ${totalRepresentatives} veterinary representatives including names, positions, contact numbers and other details. Contact information for animal health services and support.`;

    return {
      title: `पशु चिकित्सा प्रतिनिधिहरूको विवरण | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-vet-representatives",
        languages: {
          en: "/en/profile/economics/municipality-wide-vet-representatives",
          ne: "/ne/profile/economics/municipality-wide-vet-representatives",
        },
      },
      openGraph: {
        title: `पशु चिकित्सा प्रतिनिधिहरूको विवरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `पशु चिकित्सा प्रतिनिधिहरूको विवरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "पशु चिकित्सा प्रतिनिधिहरूको विवरण | पालिका प्रोफाइल",
      description:
        "परिवर्तन गाउँपालिकाको पशु सेवा शाखामा कार्यरत कर्मचारीहरूको विस्तृत सूची र सम्पर्क विवरण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "पशु चिकित्सा प्रतिनिधिहरूको सूची",
    slug: "representatives-list",
  },
  { level: 2, text: "सम्पर्क विवरण", slug: "contact-details" },
  { level: 2, text: "विश्लेषण र सांख्यिकी", slug: "analysis-statistics" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function MunicipalityWideVetRepresentativesPage() {
  // Fetch all veterinary representatives data using tRPC
  const representativesData =
    await api.profile.economics.municipalityWideVeterinaryRepresentatives.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideVeterinaryRepresentatives.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  const totalRepresentatives = representativesData.length;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <VeterinaryRepresentativesSEO
        representativesData={representativesData.map((rep) => ({
          ...rep,
          remarks: rep.remarks ?? undefined,
        }))}
        totalRepresentatives={totalRepresentatives}
      />

      <div className="flex flex-col gap-8">
        <section>
          {/* Inline SVG Banner */}
          <div className="relative rounded-lg overflow-hidden mb-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
            <svg
              width="100%"
              height="250"
              viewBox="0 0 1200 250"
              className="w-full h-[250px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background and patterns */}
              <defs>
                <linearGradient
                  id="veterinaryBg"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#e0f7fa", stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#e3f2fd", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#e8f5e8", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>

              <rect width="1200" height="250" fill="url(#veterinaryBg)" />

              {/* Veterinary clinic building */}
              <g transform="translate(200,80)">
                <rect x="0" y="50" width="80" height="70" fill="#4fc3f7" />
                <rect x="0" y="45" width="80" height="10" fill="#0288d1" />
                <rect x="15" y="70" width="12" height="15" fill="#01579b" />
                <rect
                  x="25"
                  y="60"
                  width="15"
                  height="12"
                  fill="#ffffff"
                  opacity="0.9"
                />
                <rect
                  x="45"
                  y="60"
                  width="15"
                  height="12"
                  fill="#ffffff"
                  opacity="0.9"
                />
                <rect x="55" y="70" width="12" height="15" fill="#01579b" />
                {/* Medical cross */}
                <rect x="35" y="50" width="10" height="4" fill="#f44336" />
                <rect x="37" y="48" width="6" height="8" fill="#f44336" />
                <text
                  x="40"
                  y="140"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#01579b"
                >
                  पशु अस्पताल
                </text>
              </g>

              {/* Veterinary staff icons */}
              <g transform="translate(400,120)">
                <circle cx="0" cy="0" r="8" fill="#00acc1" />
                <rect x="-6" y="5" width="12" height="18" fill="#ffffff" />
                <rect x="-4" y="7" width="8" height="2" fill="#f44336" />
                <rect x="-2" y="5" width="4" height="6" fill="#f44336" />
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#333">
                  पशु चिकित्सक
                </text>
              </g>

              <g transform="translate(500,120)">
                <circle cx="0" cy="0" r="8" fill="#26a69a" />
                <rect x="-6" y="5" width="12" height="18" fill="#ffffff" />
                <circle cx="0" cy="12" r="2" fill="#4caf50" />
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#333">
                  पशु प्राविधिक
                </text>
              </g>

              <g transform="translate(600,120)">
                <circle cx="0" cy="0" r="8" fill="#66bb6a" />
                <rect x="-6" y="5" width="12" height="18" fill="#ffffff" />
                <rect x="-3" y="8" width="6" height="8" fill="#2196f3" />
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#333">
                  सहायक
                </text>
              </g>

              {/* Animal icons */}
              <g transform="translate(750,140)">
                {/* Cow */}
                <ellipse cx="0" cy="0" rx="12" ry="8" fill="#8d6e63" />
                <circle cx="-8" cy="-3" r="4" fill="#8d6e63" />
                <rect x="-2" y="6" width="2" height="8" fill="#8d6e63" />
                <rect x="2" y="6" width="2" height="8" fill="#8d6e63" />
                <text
                  x="0"
                  y="25"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#5d4037"
                >
                  गाई
                </text>
              </g>

              <g transform="translate(850,145)">
                {/* Goat */}
                <ellipse cx="0" cy="0" rx="8" ry="5" fill="#fff3e0" />
                <circle cx="-5" cy="-2" r="3" fill="#fff3e0" />
                <rect x="-1" y="4" width="1" height="6" fill="#fff3e0" />
                <rect x="1" y="4" width="1" height="6" fill="#fff3e0" />
                <text
                  x="0"
                  y="20"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#5d4037"
                >
                  बाख्रा
                </text>
              </g>

              {/* Medical equipment */}
              <g transform="translate(800,100)">
                <rect x="0" y="0" width="3" height="20" fill="#607d8b" />
                <circle cx="1.5" cy="22" r="3" fill="#90a4ae" />
                <text
                  x="1.5"
                  y="35"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#37474f"
                >
                  इन्जेक्सन
                </text>
              </g>

              {/* Title overlay */}
              <g transform="translate(600,125)">
                <rect
                  x="-220"
                  y="-15"
                  width="440"
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
                  fill="#00695c"
                >
                  पशु चिकित्सा प्रतिनिधिहरूको विवरण
                </text>
                <text
                  x="0"
                  y="18"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#004d40"
                >
                  परिवर्तन गाउँपालिका
                </text>
              </g>
            </svg>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              परिवर्तन गाउँपालिकाका पशु चिकित्सा प्रतिनिधिहरूको विवरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकाको पशु सेवा शाखामा कार्यरत
              कर्मचारीहरूको विस्तृत विवरण प्रस्तुत गरिएको छ। यहाँ कुल{" "}
              {formatNepaliNumber(totalRepresentatives)} जना पशु चिकित्सा
              प्रतिनिधिहरूको नाम, पद, सम्पर्क नम्बर र अन्य आवश्यक जानकारीहरू
              समावेश छन्।
            </p>
            <p>
              यी पशु चिकित्सा प्रतिनिधिहरूले स्थानीय पशुपालकहरूलाई पशु स्वास्थ्य
              सम्बन्धी सल्लाह, उपचार सेवा, र विभिन्न पशु स्वास्थ्य
              कार्यक्रमहरूको जानकारी प्रदान गर्ने काम गर्छन्। पशु स्वास्थ्य
              सम्बन्धी कुनै पनि सहयोग चाहिएमा यहाँ दिइएको सम्पर्क विवरण प्रयोग
              गर्न सकिन्छ।
            </p>

            <h2 id="representatives-list" className="scroll-m-20 border-b pb-2">
              पशु चिकित्सा प्रतिनिधिहरूको सूची
            </h2>
            <p>
              तलको तालिकामा परिवर्तन गाउँपालिकाका सबै पशु चिकित्सा
              प्रतिनिधिहरूको विस्तृत जानकारी प्रस्तुत गरिएको छ:
            </p>
          </div>

          {/* Main representatives table component */}
          <VeterinaryRepresentativesTable
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
              पशु स्वास्थ्य सम्बन्धी सेवा र सहयोगका लागि माथि दिइएका
              कर्मचारीहरूको सम्पर्क नम्बरमा सम्पर्क गर्न सकिन्छ। सबै कर्मचारीहरू
              पशु सेवा शाखामा कार्यरत छन् र विभिन्न पशु स्वास्थ्य तथा सेवा
              प्राविधिक पदमा रहेका छन्।
            </p>

            {/* Analysis component */}
            <VeterinaryRepresentativesAnalysis
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
              माथि प्रस्तुत गरिएका जानकारीहरू परिवर्तन गाउँपालिकाको पशु सेवा
              शाखाबाट संकलन गरिएको हो। यी तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>पशु स्वास्थ्य सेवा प्रदायकहरूको पहिचान र सम्पर्क</li>
              <li>पशु चिकित्सा सल्लाह र उपचार सेवा प्राप्त गर्न</li>
              <li>पशु स्वास्थ्य कार्यक्रम र योजनाहरूको जानकारी लिन</li>
              <li>पशु खोप र औषधि सम्बन्धी जानकारी</li>
              <li>पशु रोग निदान र उपचारका लागि सम्पर्क</li>
            </ul>

            <div className="bg-muted/50 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-medium mb-2">विशेष सूचना</h3>
              <p className="text-sm">
                यहाँ प्रस्तुत गरिएका सम्पर्क विवरणहरू नियमित रूपमा अद्यावधिक
                गरिन्छ। कुनै पनि परिवर्तन भएमा कृपया गाउँपालिका कार्यालयमा
                जानकारी गराउनुहोस्। पशु स्वास्थ्य सेवाका लागि कार्यालय समयमा
                सम्पर्क गर्नुहोस्। आकस्मिक अवस्थामा २४ घण्टा सेवा उपलब्ध छ।
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
