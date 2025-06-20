import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import MunicipalityFacilitiesCharts from "./_components/municipality-facilities-charts";
import MunicipalityFacilitiesAnalysisSection from "./_components/municipality-facilities-analysis-section";
import { facilityOptions } from "@/server/api/routers/profile/physical/municipality-facilities.schema";

// Facility categories with display names and colors
const FACILITY_CATEGORIES = {
  MOBILE_PHONE: {
    name: "मोबाइल फोन",
    nameEn: "Mobile Phone",
    color: "#1E88E5", // Blue
  },
  TELEVISION: {
    name: "टेलिभिजन",
    nameEn: "Television",
    color: "#43A047", // Green
  },
  COMPUTER: {
    name: "कम्प्युटर/ल्यापटप",
    nameEn: "Computer/Laptop",
    color: "#8E24AA", // Purple
  },
  INTERNET: {
    name: "इन्टरनेट सुविधा",
    nameEn: "Internet service",
    color: "#E53935", // Red
  },
  BICYCLE: {
    name: "साइकल",
    nameEn: "Bicycle",
    color: "#FF7043", // Deep Orange
  },
  MOTORCYCLE: {
    name: "मोटरसाइकल/स्कुटर",
    nameEn: "Motorcycle/Scooter",
    color: "#5D4037", // Brown
  },
  CAR_JEEP: {
    name: "कार/जीप/भ्यान",
    nameEn: "Car/Jeep/Van",
    color: "#00ACC1", // Cyan  
  },
  REFRIGERATOR: {
    name: "रेफ्रिजेरेटर/फ्रिज",
    nameEn: "Refrigerator",
    color: "#7CB342", // Light Green
  },
  WASHING_MACHINE: {
    name: "वासिङ मेसिन",
    nameEn: "Washing machine",
    color: "#FB8C00", // Orange
  },
  AIR_CONDITIONER: {
    name: "एयर कन्डिसनर",
    nameEn: "Air conditioner",
    color: "#3949AB", // Indigo
  },
  ELECTRICAL_FAN: {
    name: "विद्युतीय पंखा",
    nameEn: "Electrical fan",
    color: "#8D6E63", // Brown grey
  },
  MICROWAVE_OVEN: {
    name: "माइक्रोवेभ ओभन",
    nameEn: "Microwave oven",
    color: "#546E7A", // Blue grey
  },
  RADIO: {
    name: "रेडियो",
    nameEn: "Radio",
    color: "#6D4C41", // Brown
  },
  DAILY_NATIONAL_NEWSPAPER_ACCESS: {
    name: "दैनिक राष्ट्रिय पत्रिकाको पहुँच",
    nameEn: "Daily national newspaper access",
    color: "#78909C", // Blue grey
  },
  NONE: {
    name: "कुनै पनि सुविधा नभएको",
    nameEn: "None of the above",
    color: "#757575", // Grey
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
    const facilitiesData = await api.profile.physical.municipalityFacilities.getAll.query();
    let summaryData: any = null;
    try {
      summaryData = await api.profile.physical.municipalityFacilities.summary.query();
    } catch (error) {
      console.warn("Could not fetch municipality facilities summary:", error);
    }

    const municipalityName = "परिवर्तन गाउँपालिका"; // Khajura Rural Municipality
    const totalPopulation = summaryData?.total_population || 0;

    // Calculate key statistics
    const mobilePhoneData = facilitiesData.find((f: any) => f.facility === "MOBILE_PHONE");
    const internetData = facilitiesData.find((f: any) => f.facility === "INTERNET");
    const computerData = facilitiesData.find((f: any) => f.facility === "COMPUTER");
    
    const mobilePhonePercentage = mobilePhoneData && totalPopulation > 0 
      ? ((mobilePhoneData.population / totalPopulation) * 100).toFixed(2) 
      : "0";
    const internetPercentage = internetData && totalPopulation > 0 
      ? ((internetData.population / totalPopulation) * 100).toFixed(2) 
      : "0";

    // Create rich keywords
    const keywordsNP = [
      "परिवर्तन गाउँपालिका घरायसी सुविधा",
      "घरायसी सुविधाको अवस्था",
      "पालिकाका सुविधाहरू",
      "डिजिटल सुविधा पहुँच",
      `मोबाइल फोन ${mobilePhonePercentage}%`,
      `इन्टरनेट सुविधा ${internetPercentage}%`,
      "घरायसी सुविधा विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality household facilities",
      "Household facilities status",
      "Municipality facilities",
      "Digital facility access",
      `Mobile phone ${mobilePhonePercentage}%`,
      `Internet access ${internetPercentage}%`,
      "Household facilities analysis",
    ];

    // Create description
    const descriptionNP = `परिवर्तन गाउँपालिकामा घरायसी सुविधाको अवस्था र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toLocaleString(), "ne")} मध्ये मोबाइल फोनको पहुँच ${localizeNumber(mobilePhonePercentage, "ne")}% र इन्टरनेट सुविधाको पहुँच ${localizeNumber(internetPercentage, "ne")}% रहेको छ।`;

    const descriptionEN = `Analysis of household facilities status in Khajura Rural Municipality. Among the total population of ${totalPopulation.toLocaleString()}, mobile phone access is ${mobilePhonePercentage}% and internet facility access is ${internetPercentage}%.`;

    return {
      title: `घरायसी सुविधाको अवस्था | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/physical/municipality-facilities",
        languages: {
          en: "/en/profile/physical/municipality-facilities",
          ne: "/ne/profile/physical/municipality-facilities",
        },
      },
      openGraph: {
        title: `घरायसी सुविधाको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरायसी सुविधाको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरायसी सुविधाको अवस्था | परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      description: "पालिकामा उपलब्ध विभिन्न घरायसी सुविधाहरूको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "घरायसी सुविधाको वितरण",
    slug: "distribution-of-household-facilities",
  },
  {
    level: 2,
    text: "सुविधा प्रयोगको विश्लेषण",
    slug: "facilities-usage-analysis",
  },
  {
    level: 2,
    text: "डिजिटल पहुँचको अवस्था",
    slug: "digital-access-status",
  },
  {
    level: 2,
    text: "सुविधा विस्तार रणनीति",
    slug: "facilities-expansion-strategy",
  },
];

export default async function MunicipalityFacilitiesPage() {
  // Fetch all municipality facilities data using tRPC
  const facilitiesData = await api.profile.physical.municipalityFacilities.getAll.query();

  // Try to fetch summary data
  let summaryData: any = null;
  try {
    summaryData = await api.profile.physical.municipalityFacilities.summary.query();
  } catch (error) {
    console.warn("Could not fetch municipality facilities summary:", error);
  }

  const totalPopulation = summaryData?.total_population || 0;

  // Create a mapping of facility to its human-readable name
  const facilityMap: Record<string, string> = {};
  facilityOptions.forEach((option) => {
    facilityMap[option.value] = option.label;
  });

  // Calculate totals by facility type
  const facilityTypeTotals: Record<string, number> = {};
  const facilityTypePercentages: Record<string, number> = {};

  facilitiesData.forEach((item: any) => {
    facilityTypeTotals[item.facility] = item.population;
    facilityTypePercentages[item.facility] = totalPopulation > 0 
      ? (item.population / totalPopulation) * 100 
      : 0;
  });

  // Transform data for pie chart
  const pieChartData = facilitiesData
    .map((item: any) => {
      const category = FACILITY_CATEGORIES[item.facility as keyof typeof FACILITY_CATEGORIES];
      const percentage = totalPopulation > 0 
        ? ((item.population / totalPopulation) * 100).toFixed(1) 
        : "0";
      
      return {
        name: category?.name || facilityMap[item.facility] || item.facility,
        nameEn: category?.nameEn || item.facility,
        value: item.population,
        percentage,
        color: category?.color || "#8884d8",
      };
    })
    .filter((item: any) => item.value > 0)
    .sort((a: any, b: any) => b.value - a.value);

  // Calculate digital access metrics
  const digitalFacilities = ['MOBILE_PHONE', 'COMPUTER', 'INTERNET'];
  const digitalPopulation = digitalFacilities.reduce((sum, facility) => {
    return sum + (facilityTypeTotals[facility] || 0);
  }, 0);
  const digitalAccessIndex = totalPopulation > 0 
    ? (digitalPopulation / (totalPopulation * digitalFacilities.length)) * 100 
    : 0;

  // Find top and least used facilities
  const sortedFacilities = facilitiesData.sort((a: any, b: any) => b.population - a.population);
  const topFacility = sortedFacilities[0];
  const leastUsedFacility = sortedFacilities[sortedFacilities.length - 1];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="space-y-8">
        <div id="introduction">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Image
                src="/images/household-facilities.svg"
                alt="घरायसी सुविधाको चिन्ह"
                width={32}
                height={32}
                className="text-white"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">घरायसी सुविधाको वितरण</h1>
              <p className="text-muted-foreground">
                परिवर्तन गाउँपालिकामा उपलब्ध विभिन्न घरायसी सुविधाहरूको अवस्था र विश्लेषण
              </p>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p>
              यस खण्डमा परिवर्तन गाउँपालिका भित्रका घरधुरीहरूमा उपलब्ध विभिन्न सुविधाहरूको विस्तृत विवरण प्रस्तुत गरिएको छ। 
              यसमा संचार सुविधा (मोबाइल फोन, इन्टरनेट), यातायात साधन (साइकल, मोटरसाइकल, कार), 
              घरायसी उपकरणहरू (टेलिभिजन, फ्रिज, वाशिङ मेसिन) र अन्य आवश्यक सुविधाहरूको अवस्था समावेश छ।
            </p>
            <p>
              कुल जनसंख्या: <strong className="text-primary">{localizeNumber(totalPopulation.toLocaleString(), "ne")}</strong> को आधारमा यी तथ्याङ्कहरू तयार गरिएको छ।
            </p>
          </div>
        </div>

        {facilitiesData && facilitiesData.length > 0 && (
          <>
            <MunicipalityFacilitiesCharts
              pieChartData={pieChartData}
              facilitiesData={facilitiesData}
              totalPopulation={totalPopulation}
              facilityTypeTotals={facilityTypeTotals}
              facilityMap={facilityMap}
              facilityTypePercentages={facilityTypePercentages}
              FACILITY_CATEGORIES={FACILITY_CATEGORIES}
              digitalAccessIndex={digitalAccessIndex}
              topFacility={topFacility}
              leastUsedFacility={leastUsedFacility}
            />
            
            <MunicipalityFacilitiesAnalysisSection
              facilitiesData={facilitiesData}
              totalPopulation={totalPopulation}
              facilityTypeTotals={facilityTypeTotals}
              facilityTypePercentages={facilityTypePercentages}
              FACILITY_CATEGORIES={FACILITY_CATEGORIES}
              digitalAccessIndex={digitalAccessIndex}
              topFacility={topFacility}
              leastUsedFacility={leastUsedFacility}
            />
          </>
        )}

        {(!facilitiesData || facilitiesData.length === 0) && (
          <div className="text-center py-16">
            <div className="relative w-24 h-24 mx-auto mb-4 opacity-50">
              <Image
                src="/images/household-facilities.svg"
                alt="डेटा उपलब्ध छैन"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-medium mb-2">डेटा उपलब्ध छैन</h3>
            <p className="text-muted-foreground">
              घरायसी सुविधासम्बन्धी कुनै डेटा उपलब्ध छैन।
            </p>
          </div>
        )}
      </div>
    </DocsLayout>
  );
}
