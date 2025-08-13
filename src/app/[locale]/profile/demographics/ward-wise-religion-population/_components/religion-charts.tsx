import ReligionPieChart from "./charts/religion-pie-chart";
import ReligionBarChart from "./charts/religion-bar-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define religion colors with more modern aesthetic palette
const RELIGION_COLORS = {
  HINDU: "#6366F1", // Indigo
  BUDDHIST: "#8B5CF6", // Purple
  KIRANT: "#EC4899", // Pink
  CHRISTIAN: "#F43F5E", // Rose
  ISLAM: "#10B981", // Emerald
  NATURE: "#06B6D4", // Cyan
  BON: "#3B82F6", // Blue
  JAIN: "#F59E0B", // Amber
  BAHAI: "#84CC16", // Lime
  SIKH: "#9333EA", // Fuchsia
  OTHER: "#14B8A6", // Teal
};

interface ReligionChartsProps {
  religionData: Array<{
    id?: string;
    religionType: string;
    malePopulation: number;
    femalePopulation: number;
    totalPopulation: number;
    percentage: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionCharts({
  religionData,
  RELIGION_NAMES,
}: ReligionChartsProps) {
  // Calculate totals and prepare data for charts
  const totalPopulation = religionData.reduce(
    (sum, item) => sum + item.totalPopulation,
    0,
  );

  // Prepare pie chart data
  const pieChartData = religionData.map((item) => ({
    name: RELIGION_NAMES[item.religionType] || item.religionType,
    value: item.totalPopulation,
    percentage: item.percentage.toFixed(2),
  }));

  // Prepare bar chart data for gender comparison
  const barChartData = religionData.map((item) => ({
    religion: RELIGION_NAMES[item.religionType] || item.religionType,
    पुरुष: item.malePopulation,
    महिला: item.femalePopulation,
    जम्मा: item.totalPopulation,
  }));

  return (
    <>
      {/* Overall religion distribution - with pre-rendered table and client-side chart */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Religion Distribution in Paribartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Religious composition of Paribartan with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            परिवर्तन गाउँपालिकामा धर्म अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या:{" "}
            {localizeNumber(totalPopulation.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <ReligionPieChart
                pieChartData={pieChartData}
                RELIGION_NAMES={RELIGION_NAMES}
                RELIGION_COLORS={RELIGION_COLORS}
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
                    <th className="border p-2 text-left">धर्म</th>
                    <th className="border p-2 text-right">पुरुष</th>
                    <th className="border p-2 text-right">महिला</th>
                    <th className="border p-2 text-right">जम्मा</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {religionData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber(i + 1, "ne")}
                      </td>
                      <td className="border p-2">
                        {RELIGION_NAMES[item.religionType] || item.religionType}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          item.malePopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          item.femalePopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          item.totalPopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage.toFixed(2), "ne")}%
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
                        religionData
                          .reduce((sum, item) => sum + item.malePopulation, 0)
                          .toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        religionData
                          .reduce((sum, item) => sum + item.femalePopulation, 0)
                          .toLocaleString(),
                        "ne",
                      )}
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
            प्रमुख धर्महरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {religionData.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      RELIGION_COLORS[
                        item.religionType as keyof typeof RELIGION_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>
                      {RELIGION_NAMES[item.religionType] || item.religionType}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor:
                          RELIGION_COLORS[
                            item.religionType as keyof typeof RELIGION_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            {religionData.length > 5
              ? `${localizeNumber(religionData.length - 5, "ne")} अन्य धर्महरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Gender-wise distribution by religion - pre-rendered table with client-side chart */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Gender-wise Religion Distribution in Paribartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Gender distribution across religions in Paribartan"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            परिवर्तन गाउँपालिकाको धर्म अनुसार लैंगिक वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            धर्म र लिंग अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ReligionBarChart
              religionData={barChartData}
              RELIGION_COLORS={RELIGION_COLORS}
              RELIGION_NAMES={RELIGION_NAMES}
            />
          </div>
        </div>
      </div>
    </>
  );
}
