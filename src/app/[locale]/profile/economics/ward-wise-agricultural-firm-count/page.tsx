import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import AgricultureFirmCountCharts from "./_components/agriculture-firm-count-charts";
import AgricultureFirmCountAnalysisSection from "./_components/agriculture-firm-count-analysis-section";
import AgricultureFirmCountSEO from "./_components/agriculture-firm-count-seo";
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
    const agricultureFirmData =
      await api.profile.economics.wardWiseAgricultureFirmCount.getAll.query();
    const municipalityName = "परिवर्तन गाउँपालिका"; // Paribartan Rural Municipality

    // Process data for SEO
    const totalFirms = agricultureFirmData.reduce(
      (sum, item) => sum + (item.count || 0),
      0,
    );

    // Get ward with highest count
    const wardCounts = agricultureFirmData.map((item) => ({
      wardNumber: item.wardNumber,
      count: item.count || 0,
    }));

    const highestWard = wardCounts.reduce(
      (max, ward) => (ward.count > max.count ? ward : max),
      wardCounts[0] || { wardNumber: 1, count: 0 },
    );

    const lowestWard = wardCounts.reduce(
      (min, ward) => (ward.count < min.count ? ward : min),
      wardCounts[0] || { wardNumber: 1, count: 0 },
    );

    // Create rich keywords with actual data
    const keywordsNP = [
      "परिवर्तन गाउँपालिका कृषि फर्म",
      "परिवर्तन कृषि समूह संख्या",
      "वडा अनुसार कृषि फर्म",
      "कृषि उद्यम तथ्याङ्क",
      "कृषि विकास परिवर्तन",
      `परिवर्तन कुल कृषि फर्म ${totalFirms}`,
      `वडा ${highestWard.wardNumber} सर्वाधिक कृषि फर्म`,
      "नगिकरण भएका कृषि समूह",
    ];

    const keywordsEN = [
      "Paribartan Rural Municipality agriculture firms",
      "Paribartan agricultural groups count",
      "Ward-wise agriculture firms",
      "Agricultural enterprise statistics",
      "Agriculture development Paribartan",
      `Paribartan total agriculture firms ${totalFirms}`,
      `Ward ${highestWard.wardNumber} highest agriculture firms`,
      "Registered agricultural groups",
    ];

    // Create detailed description with actual data
    const descriptionNP = `परिवर्तन गाउँपालिकाको वडा अनुसार नगिकरण भएका कृषि फर्म र समूहहरूको संख्या र वितरण। कुल ${totalFirms} कृषि फर्म मध्ये वडा नं ${highestWard.wardNumber} मा सबैभन्दा धेरै (${highestWard.count}) र वडा नं ${lowestWard.wardNumber} मा सबैभन्दा कम (${lowestWard.count}) कृषि फर्म रहेका छन्। विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise count and distribution of registered agriculture firms and groups in Paribartan Rural Municipality. Out of total ${totalFirms} agriculture firms, Ward No. ${highestWard.wardNumber} has the highest count (${highestWard.count}) and Ward No. ${lowestWard.wardNumber} has the lowest count (${lowestWard.count}). Detailed statistics and visualizations.`;

    return {
      title: `नगिकरण भएका कृषि फर्मको संख्या | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/agriculture-firm-count",
        languages: {
          en: "/en/profile/economics/agriculture-firm-count",
          ne: "/ne/profile/economics/agriculture-firm-count",
        },
      },
      openGraph: {
        title: `नगिकरण भएका कृषि फर्मको संख्या | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `नगिकरण भएका कृषि फर्मको संख्या | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "नगिकरण भएका कृषि फर्मको संख्या | पालिका प्रोफाइल",
      description:
        "वडा अनुसार नगिकरण भएका कृषि फर्म र समूहहरूको संख्या, वितरण र विश्लेषण। कृषि विकास र उद्यमशीलताको विस्तृत तथ्याङ्क।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वडा अनुसार कृषि फर्म वितरण",
    slug: "ward-wise-agriculture-firms",
  },
  {
    level: 2,
    text: "कृषि फर्म संख्या तुलना",
    slug: "agriculture-firm-comparison",
  },
  {
    level: 2,
    text: "कृषि फर्म विश्लेषण",
    slug: "agriculture-firm-analysis",
  },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function AgricultureFirmCountPage() {
  // Fetch all agriculture firm count data using tRPC
  const agricultureFirmData =
    await api.profile.economics.wardWiseAgricultureFirmCount.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseAgricultureFirmCount.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = agricultureFirmData
    .map((item) => ({
      ward: `वडा ${item.wardNumber}`,
      wardNumber: item.wardNumber,
      count: item.count || 0,
      percentage: 0, // Will be calculated below
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate total firms
  const totalFirms = overallSummary.reduce((sum, item) => sum + item.count, 0);

  // Calculate percentages
  overallSummary.forEach((item) => {
    item.percentage = totalFirms > 0 ? (item.count / totalFirms) * 100 : 0;
  });

  // Prepare data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.ward,
    value: item.count,
    percentage: item.percentage.toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(agricultureFirmData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Process data for ward-wise visualization
  const wardWiseData = overallSummary.map((item) => ({
    ward: item.ward,
    wardNumber: item.wardNumber,
    count: item.count,
  }));

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <AgricultureFirmCountSEO
        overallSummary={overallSummary}
        totalFirms={totalFirms}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          {/* Inline SVG Banner */}
          <div className="relative rounded-lg overflow-hidden mb-8 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
            <svg
              width="100%"
              height="250"
              viewBox="0 0 1200 250"
              className="w-full h-[250px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Gradient */}
              <defs>
                <linearGradient
                  id="backgroundGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#e3f2fd", stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#f3e5f5", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#e8f5e8", stopOpacity: 1 }}
                  />
                </linearGradient>

                {/* Field Pattern */}
                <pattern
                  id="fieldPattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="40" height="40" fill="#c8e6c9" opacity="0.3" />
                  <path
                    d="M0,20 Q10,10 20,20 Q30,30 40,20"
                    stroke="#4caf50"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.4"
                  />
                </pattern>

                {/* Building Shadow */}
                <filter id="buildingShadow">
                  <feDropShadow
                    dx="2"
                    dy="4"
                    stdDeviation="3"
                    floodColor="#000"
                    floodOpacity="0.2"
                  />
                </filter>
              </defs>

              {/* Background */}
              <rect width="1200" height="250" fill="url(#backgroundGradient)" />

              {/* Field Background Pattern */}
              <rect
                x="0"
                y="120"
                width="1200"
                height="130"
                fill="url(#fieldPattern)"
              />

              {/* Mountains/Hills in Background */}
              <path
                d="M0,90 Q150,60 300,75 Q450,50 600,70 Q750,55 900,75 Q1050,60 1200,80 L1200,250 L0,250 Z"
                fill="#81c784"
                opacity="0.3"
              />

              {/* Agriculture Buildings/Barns */}
              {/* Barn 1 */}
              <g transform="translate(80,120)" filter="url(#buildingShadow)">
                <rect x="0" y="25" width="40" height="30" fill="#8d6e63" />
                <path d="M-3,25 L20,10 L43,25 Z" fill="#5d4037" />
                <rect x="10" y="40" width="8" height="15" fill="#3e2723" />
                <rect
                  x="23"
                  y="35"
                  width="10"
                  height="10"
                  fill="#1976d2"
                  opacity="0.7"
                />
              </g>

              {/* Barn 2 */}
              <g transform="translate(160,110)" filter="url(#buildingShadow)">
                <rect x="0" y="35" width="50" height="35" fill="#a1887f" />
                <path d="M-5,35 L25,15 L55,35 Z" fill="#6d4c41" />
                <rect x="12" y="50" width="10" height="18" fill="#3e2723" />
                <rect
                  x="30"
                  y="45"
                  width="12"
                  height="12"
                  fill="#1976d2"
                  opacity="0.7"
                />
              </g>

              {/* Modern Agriculture Facility */}
              <g transform="translate(270,100)" filter="url(#buildingShadow)">
                <rect x="0" y="45" width="60" height="40" fill="#90a4ae" />
                <rect x="0" y="40" width="60" height="8" fill="#607d8b" />
                <rect x="15" y="60" width="10" height="22" fill="#263238" />
                <rect
                  x="35"
                  y="55"
                  width="15"
                  height="12"
                  fill="#1976d2"
                  opacity="0.7"
                />
              </g>

              {/* Agricultural Vehicles/Tractors */}
              {/* Tractor 1 */}
              <g transform="translate(420,140)">
                <rect x="0" y="10" width="25" height="12" fill="#4caf50" />
                <circle cx="5" cy="25" r="5" fill="#2e7d32" />
                <circle cx="20" cy="25" r="5" fill="#2e7d32" />
                <rect x="22" y="6" width="5" height="10" fill="#1b5e20" />
              </g>

              {/* Combine Harvester */}
              <g transform="translate(550,130)" filter="url(#buildingShadow)">
                <rect x="0" y="15" width="45" height="18" fill="#ff9800" />
                <rect x="38" y="8" width="12" height="25" fill="#f57c00" />
                <circle cx="10" cy="35" r="6" fill="#bf360c" />
                <circle cx="35" cy="35" r="6" fill="#bf360c" />
                <rect x="0" y="10" width="10" height="6" fill="#e65100" />
              </g>

              {/* Agricultural Fields/Crops */}
              <g opacity="0.6">
                <path
                  d="M80,180 Q150,175 220,180 Q290,178 360,180"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M80,190 Q150,188 220,190 Q290,189 360,190"
                  stroke="#8bc34a"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M80,200 Q150,198 220,200 Q290,199 360,200"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />

                <path
                  d="M450,185 Q520,180 590,185 Q660,183 730,185"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M450,195 Q520,193 590,195 Q660,194 730,195"
                  stroke="#8bc34a"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M450,205 Q520,203 590,205 Q660,204 730,205"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />

                <path
                  d="M820,180 Q890,175 960,180 Q1030,178 1100,180"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M820,190 Q890,188 960,190 Q1030,189 1100,190"
                  stroke="#8bc34a"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M820,200 Q890,198 960,200 Q1030,199 1100,200"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />
              </g>

              {/* Trees */}
              <g transform="translate(120,70)">
                <rect x="6" y="45" width="3" height="18" fill="#5d4037" />
                <circle cx="7.5" cy="40" r="10" fill="#4caf50" opacity="0.8" />
                <circle cx="7.5" cy="37" r="8" fill="#66bb6a" opacity="0.9" />
              </g>

              <g transform="translate(700,65)">
                <rect x="8" y="50" width="4" height="25" fill="#5d4037" />
                <circle cx="10" cy="45" r="12" fill="#4caf50" opacity="0.8" />
                <circle cx="10" cy="40" r="9" fill="#66bb6a" opacity="0.9" />
              </g>

              {/* Farm Equipment Icons */}
              {/* Windmill */}
              <g transform="translate(800,80)" filter="url(#buildingShadow)">
                <rect x="12" y="45" width="3" height="50" fill="#90a4ae" />
                <circle cx="13.5" cy="50" r="2" fill="#607d8b" />
                <line
                  x1="13.5"
                  y1="50"
                  x2="13.5"
                  y2="35"
                  stroke="#37474f"
                  strokeWidth="1.5"
                />
                <line
                  x1="13.5"
                  y1="50"
                  x2="25"
                  y2="55"
                  stroke="#37474f"
                  strokeWidth="1.5"
                />
                <line
                  x1="13.5"
                  y1="50"
                  x2="2"
                  y2="55"
                  stroke="#37474f"
                  strokeWidth="1.5"
                />
              </g>

              {/* Greenhouse */}
              <g transform="translate(950,120)" filter="url(#buildingShadow)">
                <path
                  d="M0,35 Q15,20 30,35 L30,55 L0,55 Z"
                  fill="#e8f5e8"
                  opacity="0.8"
                />
                <path
                  d="M0,35 Q15,20 30,35"
                  stroke="#4caf50"
                  strokeWidth="1"
                  fill="none"
                />
                <line
                  x1="15"
                  y1="25"
                  x2="15"
                  y2="55"
                  stroke="#4caf50"
                  strokeWidth="1"
                />
                <line
                  x1="7"
                  y1="30"
                  x2="7"
                  y2="55"
                  stroke="#4caf50"
                  strokeWidth="0.5"
                />
                <line
                  x1="23"
                  y1="30"
                  x2="23"
                  y2="55"
                  stroke="#4caf50"
                  strokeWidth="0.5"
                />
              </g>

              {/* Agricultural symbols/icons scattered around */}
              {/* Wheat stalks */}
              <g transform="translate(380,160)">
                <path
                  d="M0,20 L0,0 M-2,2 L2,2 M-2,4 L2,4 M-2,6 L2,6 M-2,8 L2,8"
                  stroke="#ffc107"
                  strokeWidth="1"
                  fill="none"
                />
              </g>

              <g transform="translate(480,165)">
                <path
                  d="M0,18 L0,0 M-1.5,2 L1.5,2 M-1.5,4 L1.5,4 M-1.5,6 L1.5,6 M-1.5,8 L1.5,8"
                  stroke="#ffc107"
                  strokeWidth="1"
                  fill="none"
                />
              </g>

              <g transform="translate(680,170)">
                <path
                  d="M0,22 L0,0 M-2,2 L2,2 M-2,4 L2,4 M-2,6 L2,6 M-2,8 L2,8 M-2,10 L2,10"
                  stroke="#ffc107"
                  strokeWidth="1"
                  fill="none"
                />
              </g>

              {/* Title overlay */}
              <g transform="translate(600,125)">
                <rect
                  x="-180"
                  y="-15"
                  width="360"
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
                  नगिकरण भएका कृषि फर्मको संख्या
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
              परिवर्तन गाउँपालिकामा नगिकरण भएका कृषि फर्मको संख्या
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकाको विभिन्न वडाहरूमा स्थापना भएका र
              नगिकरण भएका कृषि फर्म तथा समूहहरूको संख्या सम्बन्धी विस्तृत
              तथ्याङ्क प्रस्तुत गरिएको छ। यो तथ्याङ्कले कृषि क्षेत्रको संगठित
              विकास, कृषि उद्यमशीलता, र सामूहिक कृषि गतिविधिहरूको अवस्थालाई
              प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              परिवर्तन गाउँपालिकामा कुल {formatNepaliNumber(totalFirms)} कृषि
              फर्म र समूहहरू नगिकरण भएका छन्। यी कृषि फर्महरूले स्थानीय कृषि
              उत्पादन, बजारीकरण, र किसानहरूको आर्थिक सशक्तिकरणमा महत्वपूर्ण
              भूमिका खेलिरहेका छन्। यस तथ्याङ्कले कृषि नीति निर्माण, कृषि विकास
              कार्यक्रम, र कृषि सहयोग वितरणमा सहायता पुर्‍याउँछ।
            </p>

            <h2
              id="ward-wise-agriculture-firms"
              className="scroll-m-20 border-b pb-2"
            >
              वडा अनुसार कृषि फर्म वितरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको विभिन्न वडाहरूमा नगिकरण भएका कृषि फर्म र
              समूहहरूको संख्या निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <AgricultureFirmCountCharts
            overallSummary={overallSummary}
            totalFirms={totalFirms}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            agricultureFirmData={agricultureFirmData}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="agriculture-firm-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              कृषि फर्म विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकामा कृषि फर्मको संख्या र वितरण विश्लेषण गर्दा
              निम्न मुख्य निष्कर्षहरू देखिन्छन्। वडा{" "}
              {formatNepaliNumber(overallSummary[0]?.wardNumber)} मा सबैभन्दा
              धेरै कृषि फर्म ({formatNepaliNumber(overallSummary[0]?.count)})
              रहेका छन्, जसले कुल कृषि फर्मको{" "}
              {overallSummary[0]?.percentage?.toFixed(2)}% ओगटेको छ।
            </p>

            {/* Client component for analysis section */}
            <AgricultureFirmCountAnalysisSection
              overallSummary={overallSummary}
              totalFirms={totalFirms}
              summaryStats={summaryData}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय कृषि जनगणना र
              परिवर्तन गाउँपालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी
              तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>कृषि क्षेत्रको संगठित विकास र संरचना बुझ्न</li>
              <li>कृषि उद्यमशीलता र सामूहिक खेतीको प्रवर्द्धन गर्न</li>
              <li>लक्षित कृषि विकास कार्यक्रमहरू तयार गर्न</li>
              <li>कृषि सहयोग र अनुदान वितरण योजना बनाउन</li>
              <li>कृषि बजारीकरण र मूल्य संवर्धन कार्यक्रम संचालन गर्न</li>
            </ul>

            <div className="bg-muted/50 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-medium mb-2">विशेष सूचना</h3>
              <p className="text-sm">
                यहाँ प्रस्तुत गरिएका तथ्याङ्कहरू नियमित रूपमा अद्यावधिक गरिन्छ।
                नवीनतम जानकारीको लागि कृपया गाउँपालिका कार्यालयमा सम्पर्क
                गर्नुहोस् वा हाम्रो वेबसाइट नियमित रूपमा हेरिरहनुहोस्।
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
