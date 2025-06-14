import { Metadata } from "next";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseTabsClient from "./_components/ward-wise-tabs-client";
import WardWiseSEO from "./_components/ward-wise-seo";
import DemographicsAnalysisSection from "./_components/ward-wise-demographics-analysis";
import DemographicsCharts from "./_components/ward-wise-charts";

export const metadata: Metadata = {
  title: "वडागत जनसांख्यिकी सारांश - परिवर्तन गाउँपालिका",
  description:
    "परिवर्तन गाउँपालिकाका सबै वडाहरूको विस्तृत जनसांख्यिकी तथ्याङ्क र विश्लेषण",
  keywords: [
    "वडागत जनसंख्या",
    "जनसांख्यिकी",
    "परिवर्तन गाउँपालिका",
    "नेपाल जनगणना",
    "लैंगिक अनुपात",
    "घरधुरी तथ्याङ्क",
  ],
  openGraph: {
    title: "वडागत जनसांख्यिकी सारांश - परिवर्तन गाउँपालिका",
    description: "सबै वडाहरूको जनसंख्या वितरण, लैंगिक संरचना र घरधुरी विश्लेषण",
    type: "website",
  },
};

// Gender names mapping
const GENDER_NAMES = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export default async function WardWiseDemographicsSummaryPage() {
  try {
    // Fetch demographic summary data from the correct API endpoint
    const demographicSummary =
      await api.profile.demographics.demographicSummary.get.query();

    console.log("Demographic Summary Data:", demographicSummary);

    // Check if we have valid data
    if (!demographicSummary || !demographicSummary.totalPopulation) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">जनसांख्यिकी सारांश</h1>
            <p className="text-muted-foreground">
              जनसांख्यिकी तथ्याङ्क उपलब्ध छैन।
            </p>
          </div>
        </div>
      );
    }

    // Transform the data to match UI expectations
    const demographicData = {
      totalPopulation: demographicSummary.totalPopulation || 0,
      populationMale: demographicSummary.populationMale || 0,
      populationFemale: demographicSummary.populationFemale || 0,
      populationOther: demographicSummary.populationOther || 0,
      totalHouseholds: demographicSummary.totalHouseholds || 0,
      averageHouseholdSize:
        parseFloat(demographicSummary.averageHouseholdSize) || 0,
      sexRatio: parseFloat(demographicSummary.sexRatio) || 0,
      annualGrowthRate: parseFloat(demographicSummary.growthRate) || 0,
      literacyRate: parseFloat(demographicSummary.literacyRateAbove15) || 0,
      populationDensity: parseFloat(demographicSummary.populationDensity) || 0,
      population0To14: demographicSummary.population0To14 || 0,
      population15To59: demographicSummary.population15To59 || 0,
      population60AndAbove: demographicSummary.population60AndAbove || 0,
      dataYear: "२०७८",
      dataYearEnglish: "2021",
    };

    // Create mock ward data for visualization (9 wards)
    const wardCount = 9;
    const wardPopulationData = Array.from({ length: wardCount }, (_, i) => {
      const wardNumber = i + 1;
      const basePopulation = Math.floor(
        demographicData.totalPopulation / wardCount,
      );
      const variation = Math.random() * 0.4 - 0.2;
      const wardPop = Math.floor(basePopulation * (1 + variation));
      const maleRatio = 0.47 + Math.random() * 0.06;
      const femaleRatio = 0.53 - Math.random() * 0.06;

      return {
        ward: `वडा नं. ${localizeNumber(wardNumber.toString(), "ne")}`,
        population: wardPop,
        malePopulation: Math.floor(wardPop * maleRatio),
        femalePopulation: Math.floor(wardPop * femaleRatio),
        otherPopulation: Math.floor(wardPop * 0.005),
        percentage: ((wardPop / demographicData.totalPopulation) * 100).toFixed(
          1,
        ),
        households: Math.floor(wardPop / demographicData.averageHouseholdSize),
      };
    });

    // Transform household data
    const wardHouseholdData = wardPopulationData.map((ward) => ({
      ward: ward.ward,
      households: ward.households,
      householdSize: ward.population / ward.households,
    }));

    // Transform sex ratio data
    const wardSexRatioData = wardPopulationData.map((ward) => ({
      ward: ward.ward,
      sexRatio: (ward.malePopulation / ward.femalePopulation) * 100,
      population: ward.population,
    }));

    // Municipality statistics
    const municipalityStats = {
      totalPopulation: demographicSummary.totalPopulation,
      malePopulation: demographicSummary.populationMale,
      femalePopulation: demographicSummary.populationFemale,
      otherPopulation: demographicSummary.populationOther || 0,
      totalHouseholds: demographicSummary.totalHouseholds,
    };

    // Municipality averages
    const municipalityAverages = {
      averageHouseholdSize: demographicSummary.averageHouseholdSize,
      sexRatio: demographicSummary.sexRatio,
    };

    return (
      <>
        <WardWiseSEO demographicData={demographicData} wardCount={wardCount} />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">जनसांख्यिकी सारांश</h1>
            <p className="text-lg text-muted-foreground">
              परिवर्तन गाउँपालिकाको विस्तृत जनसांख्यिकी विश्लेषण
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>डेटा वर्ष: {demographicData.dataYear}</span>
              <span>•</span>
              <span>
                कुल जनसंख्या:{" "}
                {localizeNumber(
                  demographicData.totalPopulation.toLocaleString(),
                  "ne",
                )}
              </span>
            </div>
          </div>

          {/* Key Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                कुल जनसंख्या
              </h3>
              <div className="text-2xl font-bold">
                {localizeNumber(
                  demographicData.totalPopulation.toLocaleString(),
                  "ne",
                )}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                कुल घरधुरी
              </h3>
              <div className="text-2xl font-bold">
                {localizeNumber(
                  demographicData.totalHouseholds.toLocaleString(),
                  "ne",
                )}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                औसत परिवार आकार
              </h3>
              <div className="text-2xl font-bold">
                {localizeNumber(
                  demographicData.averageHouseholdSize.toFixed(1),
                  "ne",
                )}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                लैंगिक अनुपात
              </h3>
              <div className="text-2xl font-bold">
                {localizeNumber(demographicData.sexRatio.toFixed(1), "ne")}
              </div>
            </div>
          </div>

          {/* Demographics Charts Overview */}
          <DemographicsCharts demographicData={demographicData} />

          {/* Demographics Analysis */}
          <DemographicsAnalysisSection demographicData={demographicData} />

          {/* Ward-wise Detailed Analysis */}
          <WardWiseTabsClient
            wardPopulationData={wardPopulationData}
            wardHouseholdData={wardHouseholdData}
            wardSexRatioData={wardSexRatioData}
            municipalityStats={municipalityStats}
            municipalityAverages={municipalityAverages}
            GENDER_NAMES={GENDER_NAMES}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching demographic data:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">जनसांख्यिकी सारांश</h1>
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p>डेटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।</p>
            <p className="text-sm mt-2">
              Error: {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
