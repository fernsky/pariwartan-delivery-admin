import { localizeNumber } from "@/lib/utils/localize-number";
import type { MunicipalityAspectResponse } from "@/server/api/routers/profile/municipality-introduction/municipality-aspect.schema";

const ASPECT_COLORS = {
  flat: "#9CA3AF",
  north: "#3B82F6",
  northeast: "#06B6D4",
  east: "#10B981",
  southeast: "#84CC16",
  south: "#EAB308",
  southwest: "#F59E0B",
  west: "#F97316",
  northwest: "#EF4444",
};

interface AspectAnalysisSectionProps {
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

export default function AspectAnalysisSection({
  aspectData,
}: AspectAnalysisSectionProps) {
  // Sort aspects by area for analysis
  const sortedAspects = [...aspectData.data].sort(
    (a, b) => b.area_sq_km - a.area_sq_km,
  );

  const dominantAspect = sortedAspects[0];
  const secondAspect = sortedAspects[1];
  const southFacingAspects = aspectData.data.filter((item) =>
    item.direction_english.toLowerCase().includes("south"),
  );
  const totalSouthFacingArea = southFacingAspects.reduce(
    (sum, item) => sum + item.area_percentage,
    0,
  );

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {sortedAspects.map((item, index) => {
          const colorKey = getAspectColorKey(item.direction_nepali);
          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min((item.area_sq_km / sortedAspects[0].area_sq_km) * 100, 100)}%`,
                  backgroundColor:
                    ASPECT_COLORS[colorKey as keyof typeof ASPECT_COLORS] ||
                    "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.direction_nepali}
                  <span className="sr-only">{item.direction_english}</span>
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
          परिवर्तन गाउँपालिकाको मोहोडा विश्लेषण
          <span className="sr-only">
            Aspect Analysis of Paribartan Rural Municipality
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              प्रमुख मोहोडा
              <span className="sr-only">Dominant Aspect</span>
            </h4>
            <p className="text-3xl font-bold">
              {dominantAspect ? dominantAspect.direction_nepali : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {dominantAspect
                ? `कुल क्षेत्रफलको ${localizeNumber(dominantAspect.area_percentage.toFixed(2), "ne")}% भाग`
                : ""}
              <span className="sr-only">
                {dominantAspect
                  ? `${dominantAspect.area_percentage.toFixed(2)}% of total area`
                  : ""}
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              दक्षिणमुखी क्षेत्र
              <span className="sr-only">South-facing Area</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(totalSouthFacingArea.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              दक्षिण दिशामुखी क्षेत्रहरू
              <span className="sr-only">Areas facing south direction</span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              कुल क्षेत्रफल
              <span className="sr-only">Total Area</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(aspectData.total.area_sq_km.toString(), "ne")}
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
              • सबैभन्दा बढी क्षेत्रफल (
              {localizeNumber(
                aspectData.metadata.highest_area.area_percentage.toFixed(1),
                "ne",
              )}
              %) {aspectData.metadata.highest_area.direction} मोहोडामा छ
            </li>
            <li>
              • सबैभन्दा कम क्षेत्रफल (
              {localizeNumber(
                aspectData.metadata.lowest_area.area_percentage.toFixed(1),
                "ne",
              )}
              %) {aspectData.metadata.lowest_area.direction} मोहोडामा छ
            </li>
            <li>• दक्षिणमुखी क्षेत्रले राम्रो सूर्यको प्रकाश पाउँछ</li>
            <li>
              • विविध मोहोडाले फरक प्रकारका बालीहरूको उत्पादनमा सहयोग गर्छ
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
