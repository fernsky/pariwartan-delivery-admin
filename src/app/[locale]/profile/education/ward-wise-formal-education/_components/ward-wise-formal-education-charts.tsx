import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import FormalEducationPieChart from "./charts/formal-education-pie-chart";
import FormalEducationBarChart from "./charts/formal-education-bar-chart";
import FormalEducationComparisonChart from "./charts/formal-education-comparison-chart";
import WardFormalEducationPieCharts from "./charts/ward-formal-education-pie-charts";

interface WardWiseFormalEducationChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalPopulation: number;
  formalEducationTotals: {
    currentlyAttending: number;
    previouslyAttended: number;
    neverAttended: number;
    notMentioned: number;
  };
  formalEducationPercentages: {
    currentlyAttending: string;
    previouslyAttended: string;
    neverAttended: string;
    notMentioned: string;
  };
  wardCurrentAttendancePercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  FORMAL_EDUCATION_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function WardWiseFormalEducationCharts({
  pieChartData,
  wardWiseData,
  totalPopulation,
  formalEducationTotals,
  formalEducationPercentages,
  wardCurrentAttendancePercentages,
  bestAttendanceWard,
  lowestAttendanceWard,
  FORMAL_EDUCATION_GROUPS,
}: WardWiseFormalEducationChartsProps) {
  return (
    <>
      {/* Overall formal education distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Formal Education Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of formal education status with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            औपचारिक शिक्षा स्थिति अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या:{" "}
            {localizeNumber(totalPopulation.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <FormalEducationPieChart
                pieChartData={pieChartData}
                FORMAL_EDUCATION_GROUPS={FORMAL_EDUCATION_GROUPS}
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
                    <th className="border p-2 text-left">
                      औपचारिक शिक्षा स्थिति
                    </th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {pieChartData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-muted/40" : ""}
                    >
                      <td className="border p-2">
                        {localizeNumber((index + 1).toString(), "ne")}
                      </td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.value.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage, "ne")}%
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
            औपचारिक शिक्षा स्थिति विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage, "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${parseFloat(item.percentage)}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-formal-education"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार औपचारिक शिक्षा स्थिति
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न औपचारिक शिक्षा स्थितिको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <FormalEducationBarChart
              wardWiseData={wardWiseData}
              FORMAL_EDUCATION_GROUPS={FORMAL_EDUCATION_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise comparison */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत हाल अध्ययन दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा हाल विद्यालय/कलेज जाने जनसंख्याको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <FormalEducationComparisonChart
              wardCurrentAttendancePercentages={
                wardCurrentAttendancePercentages
              }
              bestAttendanceWard={bestAttendanceWard}
              lowestAttendanceWard={lowestAttendanceWard}
              FORMAL_EDUCATION_GROUPS={FORMAL_EDUCATION_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis table */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत औपचारिक शिक्षा स्थिति विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार औपचारिक शिक्षा स्थितिको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा जनसंख्या</th>
                  {Object.keys(FORMAL_EDUCATION_GROUPS).map((key) => (
                    <th key={key} className="border p-2 text-right">
                      {
                        FORMAL_EDUCATION_GROUPS[
                          key as keyof typeof FORMAL_EDUCATION_GROUPS
                        ].name
                      }
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wardWiseData.map((item, i) => {
                  const total = item.total;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">
                        वडा {localizeNumber(item.wardNumber, "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </td>
                      {Object.keys(FORMAL_EDUCATION_GROUPS).map((key) => {
                        const groupName =
                          FORMAL_EDUCATION_GROUPS[
                            key as keyof typeof FORMAL_EDUCATION_GROUPS
                          ].name;
                        const value = item[groupName] || 0;
                        const percentage =
                          total > 0
                            ? ((value / total) * 100).toFixed(2)
                            : "0.00";
                        return (
                          <td key={key} className="border p-2 text-right">
                            {localizeNumber(value.toLocaleString(), "ne")}
                            <div className="text-xs text-muted-foreground">
                              ({localizeNumber(percentage, "ne")}%)
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                  </td>
                  {Object.keys(FORMAL_EDUCATION_GROUPS).map((key) => {
                    const value =
                      formalEducationTotals[
                        key as keyof typeof formalEducationTotals
                      ];
                    const percentage =
                      formalEducationPercentages[
                        key as keyof typeof formalEducationPercentages
                      ];
                    return (
                      <td key={key} className="border p-2 text-right">
                        {localizeNumber(value.toLocaleString(), "ne")}
                        <div className="text-xs">
                          ({localizeNumber(percentage, "ne")}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">
            वडागत औपचारिक शिक्षा स्थिति वितरण
          </h4>
          <WardFormalEducationPieCharts
            wardWiseData={wardWiseData}
            FORMAL_EDUCATION_GROUPS={FORMAL_EDUCATION_GROUPS}
          />
        </div>
      </div>
    </>
  );
}
