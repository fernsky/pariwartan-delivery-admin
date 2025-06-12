import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DisabilityCauseAnalysisSectionProps {
  overallSummary: Array<{
    disabilityCause: string;
    disabilityCauseName: string;
    population: number;
  }>;
  totalPopulationWithDisability: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalDisabilityPopulation: number;
    mostCommonCause: string;
    mostCommonCausePopulation: number;
    mostCommonCausePercentage: string;
  }>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
  DISABILITY_CAUSE_NAMES_EN: Record<string, string>;
}

export default function DisabilityCauseAnalysisSection({
  overallSummary,
  totalPopulationWithDisability,
  wardWiseAnalysis,
  DISABILITY_CAUSE_NAMES,
  DISABILITY_CAUSE_NAMES_EN,
}: DisabilityCauseAnalysisSectionProps) {
  // Updated modern aesthetic color palette for disability causes
  const DISABILITY_CAUSE_COLORS = {
    CONGENITAL: "#FFD166", // Yellow for congenital
    ACCIDENT: "#EF476F", // Red for accident
    MALNUTRITION: "#06D6A0", // Green for malnutrition
    DISEASE: "#118AB2", // Blue for disease
    CONFLICT: "#7B2CBF", // Purple for conflict
    OTHER: "#9D9D9D", // Gray for other
  };
  
  // Find wards with highest and lowest disability population
  const highestDisabilityWard = [...wardWiseAnalysis].sort((a, b) => b.totalDisabilityPopulation - a.totalDisabilityPopulation)[0];
  const lowestDisabilityWard = [...wardWiseAnalysis].sort((a, b) => a.totalDisabilityPopulation - b.totalDisabilityPopulation)[0];

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / खजुरा गाउँपालिका",
    "data-total-disability-population": totalPopulationWithDisability.toString(),
    "data-most-common-disability-cause": overallSummary.length > 0 ? 
      `${overallSummary[0].disabilityCauseName} / ${DISABILITY_CAUSE_NAMES_EN[overallSummary[0].disabilityCause as keyof typeof DISABILITY_CAUSE_NAMES_EN] || overallSummary[0].disabilityCause}` : "",
    "data-most-common-cause-percentage": overallSummary.length > 0 ? 
      ((overallSummary[0].population / totalPopulationWithDisability) * 100).toFixed(2) : "0",
    "data-highest-disability-ward": highestDisabilityWard?.wardNumber.toString() || "",
    "data-lowest-disability-ward": lowestDisabilityWard?.wardNumber.toString() || ""
  };

  return (
    <>
      <div 
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {overallSummary.map((item, index) => {
          // Calculate percentage
          const percentage = (
            (item.population / totalPopulationWithDisability) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-disability-cause={`${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause as keyof typeof DISABILITY_CAUSE_NAMES_EN] || item.disabilityCause} / ${item.disabilityCauseName}`}
              data-population={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.population / Math.max(...overallSummary.map(i => i.population))) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    DISABILITY_CAUSE_COLORS[
                      item.disabilityCause as keyof typeof DISABILITY_CAUSE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.disabilityCauseName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {DISABILITY_CAUSE_NAMES_EN[item.disabilityCause as keyof typeof DISABILITY_CAUSE_NAMES_EN] || item.disabilityCause}
                  </span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.population.toLocaleString(), "ne")} व्यक्ति
                  <span className="sr-only">
                    ({item.population.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          अपाङ्गताको कारण विश्लेषण
          <span className="sr-only">Disability Cause Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="most-common-disability-cause"
            data-percentage={overallSummary.length > 0 ? ((overallSummary[0].population / totalPopulationWithDisability) * 100).toFixed(2) : "0"}
          >
            <h4 className="font-medium mb-2">
              प्रमुख अपाङ्गताको कारण
              <span className="sr-only">
                Most Common Disability Cause in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {overallSummary.length > 0 ? overallSummary[0].disabilityCauseName : ""}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(overallSummary.length > 0 ? ((overallSummary[0].population / totalPopulationWithDisability) * 100).toFixed(2) : "0", "ne")}% ({localizeNumber(overallSummary.length > 0 ? overallSummary[0].population.toLocaleString() : "0", "ne")} व्यक्ति)
              <span className="sr-only">
                {overallSummary.length > 0 ? ((overallSummary[0].population / totalPopulationWithDisability) * 100).toFixed(2) : "0"}% ({overallSummary.length > 0 ? overallSummary[0].population : 0} people)
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="disability-distribution"
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी अपाङ्गता भएको वडा
              <span className="sr-only">Ward with Highest Disability Population in Khajura</span>
            </h4>
            <p className="text-3xl font-bold">
              वडा {localizeNumber(highestDisabilityWard?.wardNumber.toString() || "", "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(highestDisabilityWard?.totalDisabilityPopulation.toString() || "0", "ne")} व्यक्ति
              <span className="sr-only">
                {highestDisabilityWard?.totalDisabilityPopulation || 0} people with disabilities
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            वडागत अपाङ्गताको कारण विश्लेषण
            <span className="sr-only">Ward-wise Disability Cause Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display top two most common disability causes */}
            {overallSummary.slice(0, 2).map((item, index) => (
              <div key={index}>
                <h5 className="text-sm font-medium">{item.disabilityCauseName}</h5>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(((item.population / totalPopulationWithDisability) * 100).toFixed(2), "ne")}% 
                  ({localizeNumber(item.population.toLocaleString(), "ne")} व्यक्ति)
                </p>
                <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((item.population / totalPopulationWithDisability) * 100, 100)}%`,
                      backgroundColor: DISABILITY_CAUSE_COLORS[item.disabilityCause as keyof typeof DISABILITY_CAUSE_COLORS] || "#888",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">वडागत प्रमुख कारणहरू</h5>
              <ul className="mt-2 text-sm space-y-1">
                {wardWiseAnalysis.slice(0, 3).map((ward, index) => (
                  <li key={index} className="flex justify-between">
                    <span>वडा {localizeNumber(ward.wardNumber.toString(), "ne")}:</span>
                    <span className="font-medium">
                      {DISABILITY_CAUSE_NAMES[ward.mostCommonCause as keyof typeof DISABILITY_CAUSE_NAMES] || ward.mostCommonCause}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium">अपाङ्गताको कारण आधारित सुझाव</h5>
              <p className="mt-2 text-sm text-muted-foreground">
                सबैभन्दा बढी देखिएको अपाङ्गताको कारण, {overallSummary.length > 0 ? overallSummary[0].disabilityCauseName : ""} को
                न्यूनीकरणका लागि विशेष कार्यक्रम सञ्चालन गर्नु उपयुक्त हुनेछ।
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
