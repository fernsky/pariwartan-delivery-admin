import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import DisabilityCausePieChart from "./charts/disability-cause-pie-chart";
import DisabilityCauseBarChart from "./charts/disability-cause-bar-chart";
import WardDisabilityCausePieCharts from "./charts/ward-disability-cause-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define disability cause colors for consistency
const DISABILITY_CAUSE_COLORS = {
  CONGENITAL: "#FFD166", // Yellow for congenital
  ACCIDENT: "#EF476F", // Red for accident
  MALNUTRITION: "#06D6A0", // Green for malnutrition
  DISEASE: "#118AB2", // Blue for disease
  CONFLICT: "#7B2CBF", // Purple for conflict
  OTHER: "#9D9D9D", // Gray for other
};

interface DisabilityCauseChartsProps {
  overallSummary: Array<{
    disabilityCause: string;
    disabilityCauseName: string;
    population: number;
  }>;
  totalPopulationWithDisability: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  disabilityData: Array<{
    id?: string;
    wardNumber: number;
    disabilityCause: string;
    population: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalDisabilityPopulation: number;
    mostCommonCause: string;
    mostCommonCausePopulation: number;
    mostCommonCausePercentage: string;
  }>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
}

export default function DisabilityCauseCharts({
  overallSummary,
  totalPopulationWithDisability,
  pieChartData,
  wardWiseData,
  wardNumbers,
  disabilityData,
  wardWiseAnalysis,
  DISABILITY_CAUSE_NAMES,
}: DisabilityCauseChartsProps) {
  return (
    <>
      {/* Overall disability cause distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Disability Causes in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Disability cause distribution of Khajura with a total population with disabilities of ${totalPopulationWithDisability}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            अपाङ्गताका कारण अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल अपाङ्गता भएका जनसंख्या: {localizeNumber(totalPopulationWithDisability.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <DisabilityCausePieChart
                pieChartData={pieChartData}
                DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
                DISABILITY_CAUSE_COLORS={DISABILITY_CAUSE_COLORS}
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">अपाङ्गताको कारण</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.disabilityCauseName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.population / totalPopulationWithDisability) * 100).toFixed(2), "ne")}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalPopulationWithDisability.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            अपाङ्गताका कारण विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      DISABILITY_CAUSE_COLORS[
                        item.disabilityCause as keyof typeof DISABILITY_CAUSE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.disabilityCauseName}</span>
                    <span className="font-medium">
                      {localizeNumber(((item.population / totalPopulationWithDisability) * 100).toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalPopulationWithDisability) * 100}%`,
                        backgroundColor:
                          DISABILITY_CAUSE_COLORS[
                            item.disabilityCause as keyof typeof DISABILITY_CAUSE_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-disability-causes"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Disability Causes in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Disability cause distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार अपाङ्गताका कारण वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र अपाङ्गताका कारण अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <DisabilityCauseBarChart
              wardWiseData={wardWiseData}
              DISABILITY_CAUSE_COLORS={DISABILITY_CAUSE_COLORS}
              DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Disability Cause Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Most common disability causes by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत अपाङ्गताको प्रमुख कारणहरू
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार अपाङ्गताको प्रमुख कारणहरू र वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">अपाङ्गता भएका जनसंख्या</th>
                  <th className="border p-2">प्रमुख कारण</th>
                  <th className="border p-2 text-right">प्रमुख कारणको जनसंख्या</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseAnalysis.map((item, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.totalDisabilityPopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2">
                        {DISABILITY_CAUSE_NAMES[item.mostCommonCause as keyof typeof DISABILITY_CAUSE_NAMES] || item.mostCommonCause}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonCausePopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonCausePercentage, "ne")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalPopulationWithDisability.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2">
                    {DISABILITY_CAUSE_NAMES[overallSummary[0]?.disabilityCause as keyof typeof DISABILITY_CAUSE_NAMES] || overallSummary[0]?.disabilityCause}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber((overallSummary[0]?.population || 0).toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(((overallSummary[0]?.population || 0) / totalPopulationWithDisability * 100).toFixed(2), "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत अपाङ्गताका कारणहरू</h4>
          <WardDisabilityCausePieCharts
            wardNumbers={wardNumbers}
            disabilityData={disabilityData}
            DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
            DISABILITY_CAUSE_COLORS={DISABILITY_CAUSE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
