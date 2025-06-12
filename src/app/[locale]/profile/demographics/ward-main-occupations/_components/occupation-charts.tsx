import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import OccupationPieChart from "./charts/occupation-pie-chart";
import OccupationBarChart from "./charts/occupation-bar-chart";
import WardOccupationPieCharts from "./charts/ward-occupation-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define occupation colors for consistency
const OCCUPATION_COLORS = {
  GOVERNMENT_SERVICE: "#FF5733", // Red-orange
  NON_GOVERNMENT_SERVICE: "#FFC300", // Yellow
  DAILY_WAGE: "#36A2EB", // Blue
  FOREIGN_EMPLOYMENT: "#4BC0C0", // Cyan
  BUSINESS: "#9966FF", // Purple
  OTHERS: "#3CB371", // Green
  STUDENT: "#FF6384", // Pink
  HOUSEHOLD_WORK: "#FFCE56", // Light orange
  UNEMPLOYED: "#607D8B", // Grey
  INDUSTRY_WORK: "#E91E63", // Magenta
  ANIMAL_HUSBANDRY: "#8BC34A", // Light green
  SELF_EMPLOYED: "#FF9F40", // Orange
};

interface OccupationChartsProps {
  overallSummary: Array<{
    occupation: string;
    occupationName: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  occupationData: Array<{
    id?: string;
    wardNumber: number;
    occupation: string;
    population: number;
  }>;
  OCCUPATION_NAMES: Record<string, string>;
}

export default function OccupationCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  occupationData,
  OCCUPATION_NAMES,
}: OccupationChartsProps) {
  return (
    <>
      {/* Overall occupation distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Occupation Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Occupational composition of Khajura with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            पेशा अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {localizeNumber(totalPopulation.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <OccupationPieChart
                pieChartData={pieChartData}
                OCCUPATION_NAMES={OCCUPATION_NAMES}
                OCCUPATION_COLORS={OCCUPATION_COLORS}
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
                    <th className="border p-2 text-left">पेशा</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.occupationName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.population / totalPopulation) * 100).toFixed(2), "ne")}%
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
                      {localizeNumber(totalPopulation.toLocaleString(), "ne")}
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
            प्रमुख पेशाहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSummary.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      OCCUPATION_COLORS[
                        item.occupation as keyof typeof OCCUPATION_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.occupationName}</span>
                    <span className="font-medium">
                      {localizeNumber(((item.population / totalPopulation) * 100).toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalPopulation) * 100}%`,
                        backgroundColor:
                          OCCUPATION_COLORS[
                            item.occupation as keyof typeof OCCUPATION_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            {overallSummary.length > 5
              ? `${localizeNumber(overallSummary.length - 5, "ne")} अन्य पेशाहरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Occupation Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Occupation distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार पेशागत वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र पेशा अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <OccupationBarChart
              wardWiseData={wardWiseData}
              OCCUPATION_COLORS={OCCUPATION_COLORS}
              OCCUPATION_NAMES={OCCUPATION_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Detailed Occupational Analysis by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed occupational composition of each ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विस्तृत पेशागत विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत पेशागत संरचना
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत पेशा तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख पेशा</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो प्रमुख पेशा</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = occupationData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0,
                  );

                  // Sort by population to find primary and secondary occupations
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.population || 0) - (a.population || 0),
                  );
                  const primaryOccupation = sortedItems[0];
                  const secondaryOccupation = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(wardNumber, "ne")}</td>
                      <td className="border p-2">
                        {primaryOccupation
                          ? OCCUPATION_NAMES[primaryOccupation.occupation] ||
                            primaryOccupation.occupation
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primaryOccupation?.population
                          ? localizeNumber(primaryOccupation.population.toLocaleString(), "ne")
                          : "०"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primaryOccupation?.population
                          ? localizeNumber(
                              ((primaryOccupation.population / wardTotal) * 100).toFixed(2),
                              "ne"
                            ) + "%"
                          : "०%"}
                      </td>
                      <td className="border p-2">
                        {secondaryOccupation
                          ? OCCUPATION_NAMES[secondaryOccupation.occupation] ||
                            secondaryOccupation.occupation
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondaryOccupation?.population
                          ? localizeNumber(secondaryOccupation.population.toLocaleString(), "ne")
                          : "०"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondaryOccupation?.population
                          ? localizeNumber(
                              ((secondaryOccupation.population / wardTotal) * 100).toFixed(2),
                              "ne"
                            ) + "%"
                          : "०%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
         

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत पाई चार्ट</h4>
          <WardOccupationPieCharts
            wardNumbers={wardNumbers}
            occupationData={occupationData}
            OCCUPATION_NAMES={OCCUPATION_NAMES}
            OCCUPATION_COLORS={OCCUPATION_COLORS}
          />
        </div>
      </div>
    </>
  );
}
