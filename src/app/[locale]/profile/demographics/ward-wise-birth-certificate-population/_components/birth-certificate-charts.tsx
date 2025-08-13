"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import BirthCertificateBarChart from "./charts/birth-certificate-bar-chart";
import BirthCertificateComparison from "./charts/birth-certificate-comparison-chart";

// Define consistent chart colors
const CHART_COLORS = {
  primary: "#0891b2", // Teal color - for with certificate
  secondary: "#f97316", // Orange color - for without certificate
  accent: "#0369a1", // Darker blue
  muted: "#e0f2fe", // Very light blue
};

interface BirthCertificateChartsProps {
  birthCertificateData: Array<{
    id?: string;
    wardNumber: number;
    withBirthCertificate: number;
    withoutBirthCertificate: number;
    totalPopulationUnder5?: number;
  }>;
  totalWithCertificate: number;
  totalWithoutCertificate: number;
  totalPopulation: number;
  wardNumbers: number[];
  wardWiseAnalysis: Array<{
    wardNumber: number;
    withCertificate: number;
    withoutCertificate: number;
    total: number;
    percentageWithCertificate: string;
    percentageOfTotal: string;
    coverageRate: string;
  }>;
  highestWard: {
    wardNumber: number;
    withCertificate: number;
    percentageWithCertificate: string;
    coverageRate: string;
  };
  lowestWard: {
    wardNumber: number;
    withCertificate: number;
    percentageWithCertificate: string;
    coverageRate: string;
  };
  highestCoverageWard: {
    wardNumber: number;
    coverageRate: string;
  };
  lowestCoverageWard: {
    wardNumber: number;
    coverageRate: string;
  };
}

export default function BirthCertificateCharts({
  birthCertificateData,
  totalWithCertificate,
  totalWithoutCertificate,
  totalPopulation,
  wardNumbers,
  wardWiseAnalysis,
  highestWard,
  lowestWard,
  highestCoverageWard,
  lowestCoverageWard,
}: BirthCertificateChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("summary");

  // Add null checks and ensure data is valid
  if (
    !wardWiseAnalysis ||
    !Array.isArray(wardWiseAnalysis) ||
    wardWiseAnalysis.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">
          जन्मदर्ता तथ्याङ्क लोड हुँदैछ...
        </p>
      </div>
    );
  }

  // Calculate total population from wardWiseAnalysis if totalPopulation is 0 or invalid
  const calculatedTotalPopulation = wardWiseAnalysis.reduce((sum, ward) => {
    return sum + (ward.total || ward.withCertificate + ward.withoutCertificate);
  }, 0);

  // Use calculated total if provided total is 0 or invalid
  const actualTotalPopulation =
    totalPopulation > 0 ? totalPopulation : calculatedTotalPopulation;

  // Calculate totals from wardWiseAnalysis if the provided totals are 0 or inconsistent
  const calculatedWithCertificate = wardWiseAnalysis.reduce(
    (sum, ward) => sum + ward.withCertificate,
    0,
  );
  const calculatedWithoutCertificate = wardWiseAnalysis.reduce(
    (sum, ward) => sum + ward.withoutCertificate,
    0,
  );

  const actualTotalWithCertificate =
    totalWithCertificate > 0 ? totalWithCertificate : calculatedWithCertificate;
  const actualTotalWithoutCertificate =
    totalWithoutCertificate > 0
      ? totalWithoutCertificate
      : calculatedWithoutCertificate;

  // Calculate overall coverage rate with proper null checks
  const overallCoverageRate =
    actualTotalPopulation > 0
      ? ((actualTotalWithCertificate / actualTotalPopulation) * 100).toFixed(2)
      : "0";

  // Prepare data for stacked bar chart - ensure all values are numbers
  const barChartData = wardWiseAnalysis.map((ward) => {
    const withCertificate = ward.withCertificate || 0;
    const withoutCertificate = ward.withoutCertificate || 0;
    const total = ward.total || withCertificate + withoutCertificate;
    const coverageRate =
      ward.coverageRate ||
      (total > 0 ? ((withCertificate / total) * 100).toFixed(2) : "0");

    return {
      ward: `वडा ${ward.wardNumber}`,
      withCertificate,
      withoutCertificate,
      total,
      coverageRate,
    };
  });

  return (
    <>
      {/* Summary cards for key stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-6 flex flex-col items-center justify-center shadow-sm">
          <span className="text-sm font-medium text-muted-foreground mb-2">
            कुल बालबालिका संख्या
          </span>
          <span className="text-3xl font-bold">
            {localizeNumber(actualTotalPopulation.toLocaleString(), "ne")}
          </span>
          <span className="text-sm text-muted-foreground mt-2">
            पाँच वर्षमुनिका बालबालिकाहरू
          </span>
        </div>
        <div className="bg-card border rounded-lg p-6 flex flex-col items-center justify-center shadow-sm">
          <span className="text-sm font-medium text-muted-foreground mb-2">
            जन्मदर्ता प्रमाणपत्र भएका
          </span>
          <span className="text-3xl font-bold">
            {localizeNumber(actualTotalWithCertificate.toLocaleString(), "ne")}
          </span>
          <span className="text-sm text-muted-foreground mt-2">
            ({localizeNumber(overallCoverageRate, "ne")}% कभरेज)
          </span>
        </div>
        <div className="bg-card border rounded-lg p-6 flex flex-col items-center justify-center shadow-sm">
          <span className="text-sm font-medium text-muted-foreground mb-2">
            जन्मदर्ता प्रमाणपत्र नभएका
          </span>
          <span className="text-3xl font-bold">
            {localizeNumber(
              actualTotalWithoutCertificate.toLocaleString(),
              "ne",
            )}
          </span>
          <span className="text-sm text-muted-foreground mt-2">
            (
            {localizeNumber(
              (100 - parseFloat(overallCoverageRate)).toFixed(2),
              "ne",
            )}
            %)
          </span>
        </div>
      </div>

      {/* Birth certificate distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
        id="birth-certificate-status"
      >
        <meta
          itemProp="name"
          content="Birth Certificate Status for Children Under 5 Years in Paribartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Birth certificate distribution of children under 5 years in Paribartan showing both with and without certificates`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता स्थिति
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जन्मदर्ता कभरेज: {localizeNumber(overallCoverageRate, "ne")}% (
            {localizeNumber(actualTotalWithCertificate.toLocaleString(), "ne")}/
            {localizeNumber(actualTotalPopulation.toLocaleString(), "ne")})
          </p>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <div className="border-b bg-muted/40">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">सारांश</TabsTrigger>
              <TabsTrigger value="chart">चार्ट</TabsTrigger>
              <TabsTrigger value="table">तालिका</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  सबैभन्दा बढी जन्मदर्ता कभरेज
                </div>
                <div className="text-2xl font-bold">
                  वडा{" "}
                  {localizeNumber(
                    highestCoverageWard.wardNumber.toString(),
                    "ne",
                  )}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">कभरेज दर:</span>
                  <span className="font-medium">
                    {localizeNumber(highestCoverageWard.coverageRate, "ne")}%
                  </span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  समग्र जन्मदर्ता कभरेज दर
                </div>
                <div className="text-3xl font-bold text-center">
                  {localizeNumber(overallCoverageRate, "ne")}%
                </div>
                <div className="text-sm text-center text-muted-foreground mt-2">
                  {localizeNumber(
                    actualTotalWithCertificate.toLocaleString(),
                    "ne",
                  )}
                  /
                  {localizeNumber(actualTotalPopulation.toLocaleString(), "ne")}{" "}
                  बालबालिका
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  सबैभन्दा कम जन्मदर्ता कभरेज
                </div>
                <div className="text-2xl font-bold">
                  वडा{" "}
                  {localizeNumber(
                    lowestCoverageWard.wardNumber.toString(),
                    "ne",
                  )}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">कभरेज दर:</span>
                  <span className="font-medium">
                    {localizeNumber(lowestCoverageWard.coverageRate, "ne")}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="p-6">
            <div className="h-[500px]">
              <BirthCertificateBarChart
                barChartData={barChartData}
                CHART_COLORS={CHART_COLORS}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: CHART_COLORS.primary }}
                ></div>
                <span className="text-sm">जन्मदर्ता प्रमाणपत्र भएका</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: CHART_COLORS.secondary }}
                ></div>
                <span className="text-sm">जन्मदर्ता प्रमाणपत्र नभेका</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <h4 className="text-lg font-medium mb-4 text-center">
                वडागत जन्मदर्ता स्थिति
              </h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">वडा नं.</th>
                    <th className="border p-2 text-right">जन्मदर्ता भएका</th>
                    <th className="border p-2 text-right">जन्मदर्ता नभेका</th>
                    <th className="border p-2 text-right">जम्मा जनसंख्या</th>
                    <th className="border p-2 text-right">कभरेज दर (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {wardWiseAnalysis.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber((i + 1).toString(), "ne")}
                      </td>
                      <td className="border p-2">
                        वडा {localizeNumber(item.wardNumber.toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          item.withCertificate.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          item.withoutCertificate.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.total.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.coverageRate, "ne")}%
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
                        actualTotalWithCertificate.toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        actualTotalWithoutCertificate.toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        actualTotalPopulation.toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(overallCoverageRate, "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ward-wise coverage comparison */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-birth-certificates"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Birth Certificate Coverage in Paribartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Ward-wise coverage rates of birth certificates for children under 5 years in Paribartan"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत जन्मदर्ता कभरेज दर तुलना
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा जन्मदर्ता प्रमाणपत्र कभरेज दरको तुलनात्मक अध्ययन
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <BirthCertificateComparison
              wardWiseAnalysis={wardWiseAnalysis}
              CHART_COLORS={CHART_COLORS}
              highestWard={highestWard}
              lowestWard={lowestWard}
              highestCoverageWard={highestCoverageWard}
              lowestCoverageWard={lowestCoverageWard}
              totalWithCertificate={actualTotalWithCertificate}
              totalPopulation={actualTotalPopulation}
            />
          </div>
        </div>
      </div>
    </>
  );
}
