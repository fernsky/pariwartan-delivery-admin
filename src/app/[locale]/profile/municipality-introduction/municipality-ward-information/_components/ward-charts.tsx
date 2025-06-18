import WardPieChart from "./charts/ward-pie-chart";
import WardBarChart from "./charts/ward-bar-chart";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { HeroDemographicsResponse } from "@/server/api/routers/profile/demographics/hero-demographics.schema";

// Define ward colors with population-appropriate palette
const WARD_COLORS = {
  ward1: "#3B82F6", // Blue
  ward2: "#10B981", // Emerald
  ward3: "#F59E0B", // Amber
  ward4: "#EF4444", // Red
  ward5: "#8B5CF6", // Violet
  ward6: "#06B6D4", // Cyan
};

interface WardChartsProps {
  wardData: HeroDemographicsResponse;
}

function getWardColorKey(wardNo: number): string {
  return `ward${wardNo}` as keyof typeof WARD_COLORS;
}

export default function WardCharts({ wardData }: WardChartsProps) {
  // Prepare pie chart data for population
  const populationPieChartData = wardData.wards.map((ward) => ({
    name: `वडा नं. ${localizeNumber(ward.wardNo.toString(), "ne")}`,
    value: ward.population,
    percentage: ((ward.population / wardData.totalPopulation) * 100).toFixed(2),
  }));

  // Prepare pie chart data for area
  const areaPieChartData = wardData.wards.map((ward) => ({
    name: `वडा नं. ${localizeNumber(ward.wardNo.toString(), "ne")}`,
    value: ward.areaSqKm,
    percentage: ((ward.areaSqKm / wardData.totalAreaSqKm) * 100).toFixed(2),
  }));

  // Prepare bar chart data
  const barChartData = wardData.wards.map((ward) => ({
    ward: `वडा ${localizeNumber(ward.wardNo.toString(), "ne")}`,
    जनसंख्या: ward.population,
    क्षेत्रफल: ward.areaSqKm,
    घनत्व:
      ward.areaSqKm > 0
        ? Math.round((ward.population / ward.areaSqKm) * 100) / 100
        : 0,
  }));

  return (
    <>
      {/* Overall ward distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward Demographics in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Ward-wise population and area distribution in Khajura with ${wardData.totalWards} wards, total population ${wardData.totalPopulation}, and total area ${wardData.totalAreaSqKm} sq. km.`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार जनसंख्या र क्षेत्रफल विवरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या:{" "}
            {localizeNumber(wardData.totalPopulation.toString(), "ne")} | कुल
            क्षेत्रफल: {localizeNumber(wardData.totalAreaSqKm.toString(), "ne")}{" "}
            वर्ग कि.मि. | जनसंख्या घनत्व:{" "}
            {localizeNumber(
              wardData.populationDensity?.toFixed(1) || "133",
              "ne",
            )}{" "}
            प्रति वर्ग कि.मि.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Population pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">
              जनसंख्या वितरण
            </h4>
            <div className="h-[400px]">
              <WardPieChart
                pieChartData={populationPieChartData}
                WARD_COLORS={WARD_COLORS}
                dataKey="population"
              />
            </div>
          </div>

          {/* Area pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">
              क्षेत्रफल वितरण
            </h4>
            <div className="h-[400px]">
              <WardPieChart
                pieChartData={areaPieChartData}
                WARD_COLORS={WARD_COLORS}
                dataKey="area"
              />
            </div>
          </div>
        </div>

        {/* Server-side pre-rendered table for SEO */}
        <div className="p-4 border-t">
          <h4 className="text-lg font-medium mb-4 text-center">
            वडाहरुको विस्तृत तालिका
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted sticky top-0">
                  <th className="border p-2 text-left">वडा नं.</th>
                  <th className="border p-2 text-left">
                    समावेश गरिएको गा.वि.स./न.पा.
                  </th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">
                    क्षेत्रफल (वर्ग कि.मि.)
                  </th>
                  <th className="border p-2 text-right">जनसंख्या घनत्व</th>
                </tr>
              </thead>
              <tbody>
                {wardData.wards.map((ward, i) => {
                  const populationDensity =
                    ward.areaSqKm > 0
                      ? Math.round((ward.population / ward.areaSqKm) * 100) /
                        100
                      : 0;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber(ward.wardNo.toString(), "ne")}
                      </td>
                      <td className="border p-2">
                        {ward.includedVdcOrMunicipality}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(ward.population.toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(ward.areaSqKm.toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(populationDensity.toString(), "ne")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2" colSpan={2}>
                    जम्मा
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(wardData.totalPopulation.toString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(wardData.totalAreaSqKm.toString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      wardData.populationDensity?.toFixed(1) || "133",
                      "ne",
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            वडा अनुसार वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wardData.wards.map((ward, i) => {
              const populationPercentage = (
                (ward.population / wardData.totalPopulation) *
                100
              ).toFixed(1);
              const colorKey = getWardColorKey(ward.wardNo);
              return (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        WARD_COLORS[colorKey as keyof typeof WARD_COLORS] ||
                        "#888",
                    }}
                  ></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        वडा {localizeNumber(ward.wardNo.toString(), "ne")}
                      </span>
                      <span className="font-medium">
                        {localizeNumber(populationPercentage, "ne")}%
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${populationPercentage}%`,
                          backgroundColor:
                            WARD_COLORS[colorKey as keyof typeof WARD_COLORS] ||
                            "#888",
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {localizeNumber(ward.population.toString(), "ne")}{" "}
                      जनसंख्या
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bar chart visualization */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward Demographics Comparison Chart in Khajura Rural Municipality"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            परिवर्तन गाउँपालिकाको वडा अनुसार तुलनात्मक चार्ट
          </h3>
          <p className="text-sm text-muted-foreground">
            जनसंख्या, क्षेत्रफल र जनसंख्या घनत्वको तुलनात्मक विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <WardBarChart wardData={barChartData} WARD_COLORS={WARD_COLORS} />
          </div>
        </div>
      </div>
    </>
  );
}
