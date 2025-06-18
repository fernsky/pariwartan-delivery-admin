import SlopePieChart from "./charts/slope-pie-chart";
import SlopeBarChart from "./charts/slope-bar-chart";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { MunicipalitySlopeResponse } from "@/server/api/routers/profile/municipality-introduction/municipality-slope.schema";

// Define slope colors with terrain-appropriate palette
const SLOPE_COLORS = {
  "0-5": "#22C55E", // Green - Gentle slope
  "5-10": "#84CC16", // Lime - Light slope
  "10-20": "#EAB308", // Yellow - Moderate slope
  "20-30": "#F97316", // Orange - Steep slope
  "30-60": "#DC2626", // Red - Very steep slope
};

interface SlopeChartsProps {
  slopeData: MunicipalitySlopeResponse;
}

function getSlopeColorKey(slopeRange: string): string {
  if (slopeRange.includes("0") && slopeRange.includes("5")) return "0-5";
  if (slopeRange.includes("5") && slopeRange.includes("10")) return "5-10";
  if (slopeRange.includes("10") && slopeRange.includes("20")) return "10-20";
  if (slopeRange.includes("20") && slopeRange.includes("30")) return "20-30";
  if (slopeRange.includes("30") && slopeRange.includes("60")) return "30-60";
  return "0-5";
}

export default function SlopeCharts({ slopeData }: SlopeChartsProps) {
  // Prepare pie chart data
  const pieChartData = slopeData.data.map((item) => ({
    name: item.slope_range_nepali,
    value: item.area_sq_km,
    percentage: item.area_percentage.toFixed(2),
  }));

  // Prepare bar chart data
  const barChartData = slopeData.data.map((item) => ({
    slope: item.slope_range_nepali,
    क्षेत्रफल: item.area_sq_km,
    प्रतिशत: item.area_percentage,
  }));

  return (
    <>
      {/* Overall slope distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Slope Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Slope composition of Khajura with a total area of ${slopeData.total.total_area_sq_km} sq. km.`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            {slopeData.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल क्षेत्रफल:{" "}
            {localizeNumber(slopeData.total.total_area_sq_km.toString(), "ne")}{" "}
            वर्ग कि.मि.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <SlopePieChart
                pieChartData={pieChartData}
                SLOPE_COLORS={SLOPE_COLORS}
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
                      भिरालोपन (डिग्रीमा)
                    </th>
                    <th className="border p-2 text-right">
                      क्षेत्रफल (वर्ग कि.मि.)
                    </th>
                    <th className="border p-2 text-right">
                      क्षेत्रफल (प्रतिशत)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slopeData.data.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber((i + 1).toString(), "ne")}
                      </td>
                      <td className="border p-2">{item.slope_range_nepali}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.area_sq_km.toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.area_percentage.toFixed(2), "ne")}%
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
                      {localizeNumber(
                        slopeData.total.total_area_sq_km.toString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        slopeData.total.total_percentage.toString(),
                        "ne",
                      )}
                      %
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            भिरालोपन वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slopeData.data.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      SLOPE_COLORS[
                        getSlopeColorKey(
                          item.slope_range_english,
                        ) as keyof typeof SLOPE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{item.slope_range_nepali}</span>
                    <span className="font-medium">
                      {localizeNumber(item.area_percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.area_percentage}%`,
                        backgroundColor:
                          SLOPE_COLORS[
                            getSlopeColorKey(
                              item.slope_range_english,
                            ) as keyof typeof SLOPE_COLORS
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

      {/* Bar chart visualization */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Slope Area Distribution Chart in Khajura Rural Municipality"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            परिवर्तन गाउँपालिकाको भिरालोपन अनुसार क्षेत्रफल वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न ढलान अनुसार क्षेत्रफल वितरण चार्ट
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <SlopeBarChart
              slopeData={barChartData}
              SLOPE_COLORS={SLOPE_COLORS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
