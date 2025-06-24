"use client";

import HouseholdRoofPieChart from "./charts/household-roof-pie-chart";
import HouseholdRoofBarChart from "./charts/household-roof-bar-chart";
import HouseholdRoofComparisonChart from "./charts/household-roof-comparison-chart";
import WardHouseholdRoofPieCharts from "./charts/ward-household-roof-pie-charts";
import WardWiseHouseholdRoofAnalysisSection from "./ward-wise-household-roof-analysis-section";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseHouseholdRoofChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  roofCategoryTotals: Record<string, number>;
  roofMap: Record<string, string>;
  roofCategoryPercentages: Record<string, number>;
  wardWiseModernRoofing: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  worstRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  ROOF_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  housingQualityIndex: number;
}

export default function WardWiseHouseholdRoofCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  roofCategoryTotals,
  roofMap,
  roofCategoryPercentages,
  wardWiseModernRoofing,
  bestRoofingWard,
  worstRoofingWard,
  ROOF_CATEGORIES,
  housingQualityIndex,
}: WardWiseHouseholdRoofChartsProps) {
  return (
    <>
      {/* Overall roof type distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
        id="distribution-of-roof-types"
      >
        <meta
          itemProp="name"
          content="Household Roof Type Distribution in pariwartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of household roof types with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h2 className="text-xl font-semibold">
            छानाको प्रकारको वितरण
            <span className="sr-only">
              Distribution of Roof Types in pariwartan Rural Municipality
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            परिवर्तन गाउँपालिकाका{" "}
            {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरीमा
            प्रयोग हुने छानाका प्रकारहरू
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          <div className="h-[400px]">
            <h3 className="text-lg font-medium mb-4 text-center">
              समग्र वितरण (पाई चार्ट)
            </h3>
            <HouseholdRoofPieChart
              pieChartData={pieChartData}
              ROOF_CATEGORIES={ROOF_CATEGORIES}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">
              छानाको प्रकार अनुसार घरधुरी संख्या
            </h3>
            <div className="space-y-3">
              {Object.keys(ROOF_CATEGORIES).map((categoryKey) => {
                const category =
                  ROOF_CATEGORIES[categoryKey as keyof typeof ROOF_CATEGORIES];
                const total = roofCategoryTotals[categoryKey];
                const percentage = roofCategoryPercentages[categoryKey];

                if (total === 0) return null;

                return (
                  <div
                    key={categoryKey}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {localizeNumber(percentage.toFixed(1), "ne")}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <WardWiseHouseholdRoofAnalysisSection
            totalHouseholds={totalHouseholds}
            roofCategoryTotals={roofCategoryTotals}
            roofCategoryPercentages={roofCategoryPercentages}
            wardWiseModernRoofing={wardWiseModernRoofing}
            bestRoofingWard={bestRoofingWard}
            worstRoofingWard={worstRoofingWard}
            ROOF_CATEGORIES={ROOF_CATEGORIES}
            housingQualityIndex={housingQualityIndex}
          />
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-roof-types"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Household Roof Types in pariwartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of household roof types across wards in pariwartan"
        />

        <div className="border-b px-4 py-3">
          <h2 className="text-xl font-semibold">
            वडा अनुसार छानाको प्रकार
            <span className="sr-only">
              Ward-wise Household Roof Types in pariwartan Rural Municipality
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            प्रत्येक वडामा प्रयोग हुने छानाका प्रकारहरूको विस्तृत वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px] mb-8">
            <h3 className="text-lg font-medium mb-4 text-center">
              वडावार छानाको प्रकार (स्ट्याक्ड बार चार्ट)
            </h3>
            <HouseholdRoofBarChart
              wardWiseData={wardWiseData}
              ROOF_CATEGORIES={ROOF_CATEGORIES}
            />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-center">
              वडावार छानाको प्रकारको विस्तृत वितरण
            </h3>
            <WardHouseholdRoofPieCharts
              wardWiseData={wardWiseData}
              ROOF_CATEGORIES={ROOF_CATEGORIES}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise comparison */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
        id="roof-type-analysis"
      >
        <meta
          itemProp="name"
          content="Modern Roofing Comparison Across Wards in pariwartan Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of modern roofing (cement + tile) across wards in pariwartan"
        />

        <div className="border-b px-4 py-3">
          <h2 className="text-xl font-semibold">
            आधुनिक छाना तुलनात्मक विश्लेषण
            <span className="sr-only">
              Modern Roofing Comparative Analysis Across Wards
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            वडाहरूको बीचमा आधुनिक छाना (सिमेन्ट + टायल) को तुलनात्मक अध्ययन
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <HouseholdRoofComparisonChart
              wardWiseModernRoofing={wardWiseModernRoofing}
              bestRoofingWard={bestRoofingWard}
              worstRoofingWard={worstRoofingWard}
              ROOF_CATEGORIES={ROOF_CATEGORIES}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">
                उत्कृष्ट आवास गुणस्तर
              </h4>
              <p className="text-2xl font-bold text-green-600">
                वडा{" "}
                {localizeNumber(
                  bestRoofingWard?.wardNumber.toString() || "0",
                  "ne",
                )}
              </p>
              <p className="text-sm text-green-700">
                {localizeNumber(
                  bestRoofingWard?.percentage.toFixed(2) || "0",
                  "ne",
                )}
                % आधुनिक छाना
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">
                औसत आधुनिक छाना दर
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {localizeNumber(
                  (
                    wardWiseModernRoofing.reduce(
                      (sum, ward) => sum + ward.percentage,
                      0,
                    ) / wardWiseModernRoofing.length
                  ).toFixed(2),
                  "ne",
                )}
                %
              </p>
              <p className="text-sm text-blue-700">सबै वडाहरूको औसत</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">
                सुधार आवश्यक वडा
              </h4>
              <p className="text-2xl font-bold text-red-600">
                वडा{" "}
                {localizeNumber(
                  worstRoofingWard?.wardNumber.toString() || "0",
                  "ne",
                )}
              </p>
              <p className="text-sm text-red-700">
                {localizeNumber(
                  worstRoofingWard?.percentage.toFixed(2) || "0",
                  "ne",
                )}
                % आधुनिक छाना
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
