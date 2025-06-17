import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import AgricultureFirmCountPieChart from "./charts/agriculture-firm-count-pie-chart";
import AgricultureFirmCountBarChart from "./charts/agriculture-firm-count-bar-chart";
import WardAgricultureFirmPieCharts from "./charts/ward-agriculture-firm-pie-charts";
import {
  formatNepaliNumber,
  formatNepaliPercentage,
} from "@/lib/utils/nepali-numbers";

interface AgricultureFirmCountChartsProps {
  overallSummary: Array<{
    ward: string;
    wardNumber: number;
    count: number;
    percentage: number;
  }>;
  totalFirms: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<{
    ward: string;
    wardNumber: number;
    count: number;
  }>;
  wardNumbers: number[];
  agricultureFirmData: Array<{
    id?: string;
    wardNumber: number;
    count: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
}

export default function AgricultureFirmCountCharts({
  overallSummary,
  totalFirms,
  pieChartData,
  wardWiseData,
  wardNumbers,
  agricultureFirmData,
}: AgricultureFirmCountChartsProps) {
  return (
    <>
      {/* Overall agriculture firm count distribution */}
      <div className="mb-8 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">वडा अनुसार कृषि फर्म वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल कृषि फर्म: {formatNepaliNumber(totalFirms)} फर्म
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-medium mb-3 text-center">
              पाई चार्ट
            </h4>
            <div className="h-[280px]">
              <AgricultureFirmCountPieChart pieChartData={pieChartData} />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-medium mb-3 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">वडा नं.</th>
                    <th className="border p-2 text-right">कृषि फर्म</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {formatNepaliNumber(i + 1)}
                      </td>
                      <td className="border p-2">{item.ward}</td>
                      <td className="border p-2 text-right">
                        {formatNepaliNumber(item.count)}
                      </td>
                      <td className="border p-2 text-right">
                        {formatNepaliPercentage(item.percentage, 2)}
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
                      {formatNepaliNumber(totalFirms)}
                    </td>
                    <td className="border p-2 text-right">
                      {formatNepaliPercentage(100, 2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </div>
        </div>

        {/* Top wards summary */}
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            प्रमुख वडाहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overallSummary.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: `hsl(${(i * 360) / 5}, 70%, 60%)`,
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{item.ward}</span>
                    <span className="font-medium text-sm">
                      {formatNepaliPercentage(item.percentage, 1)}
                    </span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: `hsl(${(i * 360) / 5}, 70%, 60%)`,
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
        id="ward-wise-agriculture-firms"
        className="mt-8 border rounded-lg shadow-sm overflow-hidden bg-card"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">वडा अनुसार कृषि फर्म तुलना</h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार कृषि फर्महरूको संख्यात्मक तुलना
          </p>
        </div>

        <div className="p-4">
          <div className="h-[350px]">
            <AgricultureFirmCountBarChart wardWiseData={wardWiseData} />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-8 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">
            वडा अनुसार विस्तृत कृषि फर्म विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको कृषि फर्म संख्या र वितरण
          </p>
        </div>

        <div className="p-4">
          <h4 className="text-base font-medium mb-3">वडागत कृषि फर्म तालिका</h4>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full border-collapse min-w-[500px] text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">कृषि फर्म संख्या</th>
                  <th className="border p-2 text-right">कुल प्रतिशत</th>
                  <th className="border p-2">स्थिति</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItem = agricultureFirmData.find(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const count = wardItem?.count || 0;
                  const percentage =
                    totalFirms > 0 ? (count / totalFirms) * 100 : 0;

                  // Determine status based on count
                  let status = "न्यून";
                  if (count >= 15) status = "उच्च";
                  else if (count >= 10) status = "मध्यम";

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">
                        वडा {formatNepaliNumber(wardNumber)}
                      </td>
                      <td className="border p-2 text-right">
                        {formatNepaliNumber(count)}
                      </td>
                      <td className="border p-2 text-right">
                        {formatNepaliPercentage(percentage, 2)}
                      </td>
                      <td className="border p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            status === "उच्च"
                              ? "bg-green-100 text-green-800"
                              : status === "मध्यम"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Excel डाउनलोड
            </Button>
          </div>

          {/* Ward pie charts */}
          <h4 className="text-base font-medium mt-6 mb-3">वडागत वितरण चार्ट</h4>
          <WardAgricultureFirmPieCharts
            wardNumbers={wardNumbers}
            agricultureFirmData={agricultureFirmData}
          />
        </div>
      </div>
    </>
  );
}
