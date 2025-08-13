import AspectPieChart from "./charts/aspect-pie-chart";
import AspectBarChart from "./charts/aspect-bar-chart";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { MunicipalityAspectResponse } from "@/server/api/routers/profile/municipality-introduction/municipality-aspect.schema";

// Define aspect colors with direction-appropriate palette
const ASPECT_COLORS = {
  flat: "#9CA3AF", // Gray - Flat
  north: "#3B82F6", // Blue - North
  northeast: "#06B6D4", // Cyan - Northeast
  east: "#10B981", // Emerald - East
  southeast: "#84CC16", // Lime - Southeast
  south: "#EAB308", // Yellow - South
  southwest: "#F59E0B", // Amber - Southwest
  west: "#F97316", // Orange - West
  northwest: "#EF4444", // Red - Northwest
};

interface AspectChartsProps {
  aspectData: MunicipalityAspectResponse;
}

function getAspectColorKey(direction: string): string {
  if (direction.includes("समथर")) return "flat";
  if (
    direction.includes("उत्तरी") &&
    !direction.includes("पूर्वी") &&
    !direction.includes("पश्चिम")
  )
    return "north";
  if (direction.includes("उत्तर-पूर्वी")) return "northeast";
  if (
    direction.includes("पूर्वी") &&
    !direction.includes("उत्तर") &&
    !direction.includes("दक्षिण")
  )
    return "east";
  if (direction.includes("दक्षिण-पूर्वी")) return "southeast";
  if (
    direction.includes("दक्षिणी") &&
    !direction.includes("पूर्वी") &&
    !direction.includes("पश्चिम")
  )
    return "south";
  if (direction.includes("दक्षिण-पश्चिम")) return "southwest";
  if (
    direction.includes("पश्चिमी") &&
    !direction.includes("उत्तर") &&
    !direction.includes("दक्षिण")
  )
    return "west";
  if (direction.includes("उत्तर-पश्चिम")) return "northwest";
  return "flat";
}

export default function AspectCharts({ aspectData }: AspectChartsProps) {
  // Prepare pie chart data
  const pieChartData = aspectData.data.map((item) => ({
    name: item.direction_nepali,
    value: item.area_sq_km,
    percentage: item.area_percentage.toFixed(2),
  }));

  // Prepare bar chart data
  const barChartData = aspectData.data.map((item) => ({
    direction: item.direction_nepali,
    क्षेत्रफल: item.area_sq_km,
    प्रतिशत: item.area_percentage,
  }));

  return (
    <>
      {/* Overall aspect distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Aspect Distribution in Paribartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Area distribution by aspect in Paribartan with a total area of ${aspectData.total.area_sq_km} sq. km.`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            {aspectData.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल क्षेत्रफल:{" "}
            {localizeNumber(aspectData.total.area_sq_km.toString(), "ne")} वर्ग
            कि.मि.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <AspectPieChart
                pieChartData={pieChartData}
                ASPECT_COLORS={ASPECT_COLORS}
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
                    <th className="border p-2 text-left">मोहोडा</th>
                    <th className="border p-2 text-right">
                      क्षेत्रफल (वर्ग कि.मि.)
                    </th>
                    <th className="border p-2 text-right">
                      क्षेत्रफल (प्रतिशत)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aspectData.data.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber((i + 1).toString(), "ne")}
                      </td>
                      <td className="border p-2">{item.direction_nepali}</td>
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
                        aspectData.total.area_sq_km.toString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        aspectData.total.area_percentage.toString(),
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
            मोहोडा वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aspectData.data.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      ASPECT_COLORS[
                        getAspectColorKey(
                          item.direction_nepali,
                        ) as keyof typeof ASPECT_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{item.direction_nepali}</span>
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
                          ASPECT_COLORS[
                            getAspectColorKey(
                              item.direction_nepali,
                            ) as keyof typeof ASPECT_COLORS
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
          content="Aspect Area Distribution Chart in Paribartan Rural Municipality"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            परिवर्तन गाउँपालिकाको मोहोडा अनुसार क्षेत्रफल वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न दिशा अनुसार क्षेत्रफल वितरण चार्ट
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <AspectBarChart
              aspectData={barChartData}
              ASPECT_COLORS={ASPECT_COLORS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
