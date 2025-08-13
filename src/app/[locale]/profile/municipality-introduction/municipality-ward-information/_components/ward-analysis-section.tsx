import { localizeNumber } from "@/lib/utils/localize-number";
import type { HeroDemographicsResponse } from "@/server/api/routers/profile/demographics/hero-demographics.schema";

const WARD_COLORS = {
  "1": "#3B82F6",
  "2": "#10B981",
  "3": "#F59E0B",
  "4": "#EF4444",
  "5": "#8B5CF6",
  "6": "#06B6D4",
};

interface WardAnalysisSectionProps {
  wardData: HeroDemographicsResponse;
}

function getWardColorKey(wardNo: number): string {
  return wardNo.toString();
}

export default function WardAnalysisSection({
  wardData,
}: WardAnalysisSectionProps) {
  // Sort wards by population for analysis
  const sortedByPopulation = [...wardData.wards].sort(
    (a, b) => b.population - a.population,
  );
  const sortedByArea = [...wardData.wards].sort(
    (a, b) => b.areaSqKm - a.areaSqKm,
  );

  const mostPopulousWard = sortedByPopulation[0];
  const leastPopulousWard = sortedByPopulation[sortedByPopulation.length - 1];
  const largestWard = sortedByArea[0];
  const smallestWard = sortedByArea[sortedByArea.length - 1];

  // Calculate population densities
  const wardDensities = wardData.wards
    .map((ward) => ({
      ...ward,
      density: ward.areaSqKm > 0 ? ward.population / ward.areaSqKm : 0,
    }))
    .sort((a, b) => b.density - a.density);

  const highestDensityWard = wardDensities[0];
  const lowestDensityWard = wardDensities[wardDensities.length - 1];

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {sortedByPopulation.map((ward, index) => {
          const colorKey = getWardColorKey(ward.wardNo);
          const populationPercentage =
            (ward.population / wardData.totalPopulation) * 100;
          const density =
            ward.areaSqKm > 0 ? ward.population / ward.areaSqKm : 0;

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min((ward.population / sortedByPopulation[0].population) * 100, 100)}%`,
                  backgroundColor:
                    WARD_COLORS[colorKey as keyof typeof WARD_COLORS] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  वडा नं. {localizeNumber(ward.wardNo.toString(), "ne")}
                  <span className="sr-only">Ward No. {ward.wardNo}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(ward.population.toString(), "ne")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(ward.areaSqKm.toString(), "ne")} वर्ग कि.मि.
                  <span className="sr-only">({ward.areaSqKm} sq. km.)</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  घनत्व: {localizeNumber(density.toFixed(1), "ne")} प्रति वर्ग
                  कि.मि.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          परिवर्तन गाउँपालिकाको जनसांख्यिक विश्लेषण
          <span className="sr-only">
            Demographic Analysis of Paribartan Rural Municipality
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी जनसंख्या
              <span className="sr-only">Highest Population</span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {mostPopulousWard
                ? localizeNumber(mostPopulousWard.wardNo.toString(), "ne")
                : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {mostPopulousWard
                ? `${localizeNumber(mostPopulousWard.population.toString(), "ne")} जनसंख्या`
                : ""}
              <span className="sr-only">
                {mostPopulousWard
                  ? `${mostPopulousWard.population} population`
                  : ""}
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी क्षेत्रफल
              <span className="sr-only">Largest Area</span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {largestWard
                ? localizeNumber(largestWard.wardNo.toString(), "ne")
                : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {largestWard
                ? `${localizeNumber(largestWard.areaSqKm.toString(), "ne")} वर्ग कि.मि.`
                : ""}
              <span className="sr-only">
                {largestWard ? `${largestWard.areaSqKm} sq. km.` : ""}
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी घनत्व
              <span className="sr-only">Highest Density</span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {highestDensityWard
                ? localizeNumber(highestDensityWard.wardNo.toString(), "ne")
                : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {highestDensityWard
                ? `${localizeNumber(highestDensityWard.density.toFixed(1), "ne")} प्रति वर्ग कि.मि.`
                : ""}
              <span className="sr-only">
                {highestDensityWard
                  ? `${highestDensityWard.density.toFixed(1)} per sq. km.`
                  : ""}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-card rounded border">
          <h4 className="font-medium mb-2">जनसांख्यिक विशेषताहरू</h4>
          <ul className="space-y-2 text-sm">
            <li>
              • सबैभन्दा बढी जनसंख्या वडा नं.{" "}
              {mostPopulousWard
                ? localizeNumber(mostPopulousWard.wardNo.toString(), "ne")
                : "-"}{" "}
              मा (
              {mostPopulousWard
                ? localizeNumber(mostPopulousWard.population.toString(), "ne")
                : "-"}{" "}
              जनसंख्या)
            </li>
            <li>
              • सबैभन्दा कम जनसंख्या वडा नं.{" "}
              {leastPopulousWard
                ? localizeNumber(leastPopulousWard.wardNo.toString(), "ne")
                : "-"}{" "}
              मा (
              {leastPopulousWard
                ? localizeNumber(leastPopulousWard.population.toString(), "ne")
                : "-"}{" "}
              जनसंख्या)
            </li>
            <li>
              • सबैभन्दा ठूलो क्षेत्रफल वडा नं.{" "}
              {largestWard
                ? localizeNumber(largestWard.wardNo.toString(), "ne")
                : "-"}{" "}
              मा (
              {largestWard
                ? localizeNumber(largestWard.areaSqKm.toString(), "ne")
                : "-"}{" "}
              वर्ग कि.मि.)
            </li>
            <li>
              • सबैभन्दा सानो क्षेत्रफल वडा नं.{" "}
              {smallestWard
                ? localizeNumber(smallestWard.wardNo.toString(), "ne")
                : "-"}{" "}
              मा (
              {smallestWard
                ? localizeNumber(smallestWard.areaSqKm.toString(), "ne")
                : "-"}{" "}
              वर्ग कि.मि.)
            </li>
            <li>
              • औसत जनसंख्या घनत्व{" "}
              {localizeNumber(
                wardData.populationDensity?.toFixed(1) || "133",
                "ne",
              )}{" "}
              प्रति वर्ग कि.मि. छ
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
