import { localizeNumber } from "@/lib/utils/localize-number";
import type { MunicipalitySlopeResponse } from "@/server/api/routers/profile/municipality-introduction/municipality-slope.schema";

const SLOPE_COLORS = {
  "0-5": "#22C55E", // Green - Gentle slope
  "5-10": "#84CC16", // Lime - Light slope
  "10-20": "#EAB308", // Yellow - Moderate slope
  "20-30": "#F97316", // Orange - Steep slope
  "30-60": "#DC2626", // Red - Very steep slope
};

interface SlopeAnalysisSectionProps {
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

export default function SlopeAnalysisSection({
  slopeData,
}: SlopeAnalysisSectionProps) {
  // Sort slopes by area for analysis
  const sortedSlopes = [...slopeData.data].sort(
    (a, b) => b.area_sq_km - a.area_sq_km,
  );

  const dominantSlope = sortedSlopes[0];
  const secondSlope = sortedSlopes[1];
  const steepSlopes = slopeData.data.filter(
    (item) =>
      item.slope_range_english.includes("20") ||
      item.slope_range_english.includes("30") ||
      item.slope_range_english.includes("60"),
  );
  const totalSteepArea = steepSlopes.reduce(
    (sum, item) => sum + item.area_percentage,
    0,
  );

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {sortedSlopes.map((item, index) => {
          const colorKey = getSlopeColorKey(item.slope_range_english);
          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min((item.area_sq_km / sortedSlopes[0].area_sq_km) * 100, 100)}%`,
                  backgroundColor:
                    SLOPE_COLORS[colorKey as keyof typeof SLOPE_COLORS] ||
                    "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.slope_range_nepali}
                  <span className="sr-only">{item.slope_range_english}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(item.area_percentage.toFixed(2), "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.area_sq_km.toString(), "ne")} वर्ग कि.मि.
                  <span className="sr-only">({item.area_sq_km} sq. km.)</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          परिवर्तन गाउँपालिकाको भिरालोपन विश्लेषण
          <span className="sr-only">
            Slope Analysis of Paribartan Rural Municipality
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              प्रमुख ढलान प्रकार
              <span className="sr-only">Dominant Slope Type</span>
            </h4>
            <p className="text-3xl font-bold">
              {dominantSlope ? dominantSlope.slope_range_nepali : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {dominantSlope
                ? `कुल क्षेत्रफलको ${localizeNumber(dominantSlope.area_percentage.toFixed(2), "ne")}% भाग`
                : ""}
              <span className="sr-only">
                {dominantSlope
                  ? `${dominantSlope.area_percentage.toFixed(2)}% of total area`
                  : ""}
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              तीव्र ढलान क्षेत्र
              <span className="sr-only">Steep Slope Area</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(totalSteepArea.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              २० डिग्रीभन्दा बढी ढलान भएको क्षेत्र
              <span className="sr-only">
                Area with slope greater than 20 degrees
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              कुल क्षेत्रफल
              <span className="sr-only">Total Area</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                slopeData.total.total_area_sq_km.toString(),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              वर्ग कि.मि.
              <span className="sr-only">square kilometers</span>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-card rounded border">
          <h4 className="font-medium mb-2">भौगोलिक विशेषताहरू</h4>
          <ul className="space-y-2 text-sm">
            <li>
              • अधिकांश भूभाग (
              {localizeNumber(
                dominantSlope?.area_percentage.toFixed(1) || "75.7",
                "ne",
              )}
              %) सामान्य ढलान भएको छ
            </li>
            <li>• कृषि र बसोबासका लागि उपयुक्त भूभाग</li>
            <li>
              • {localizeNumber(totalSteepArea.toFixed(1), "ne")}% भाग तीव्र
              ढलान भएको छ
            </li>
            <li>• समग्रमा भौतिक पूर्वाधार विकासका लागि अनुकूल भूभाग</li>
          </ul>
        </div>
      </div>
    </>
  );
}
