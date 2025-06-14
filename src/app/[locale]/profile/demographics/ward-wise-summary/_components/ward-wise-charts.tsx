"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PopulationPieChart from "./charts/population-pie-chart";
import DemographicBars from "./charts/demographic-bars";
import TrendChart from "./charts/trend-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DemographicsChartsProps {
  demographicData: {
    totalPopulation: number;
    populationMale: number;
    populationFemale: number;
    totalHouseholds: number;
    averageHouseholdSize: number;
    sexRatio: number;
    annualGrowthRate: number;
    literacyRate: number;
    populationDensity: number;
    dataYear: string;
    dataYearEnglish: string;
  };
}

export default function DemographicsCharts({
  demographicData,
}: DemographicsChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  if (!demographicData || demographicData.totalPopulation === 0) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">
          जनसांख्यिकी तथ्याङ्क लोड हुँदैछ...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Population Overview */}
      <section id="population-overview">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Demographics Overview of Pariwartan Rural Municipality"
          />
          <meta
            itemProp="description"
            content={`Complete demographic statistics of Pariwartan with population of ${demographicData.totalPopulation}`}
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              जनसांख्यिकी सिंहावलोकन
            </h3>
            <p className="text-sm text-muted-foreground">
              समग्र जनसांख्यिकी तथ्याङ्क र वितरण
            </p>
          </div>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">सिंहावलोकन</TabsTrigger>
                <TabsTrigger value="population">जनसंख्या</TabsTrigger>
                <TabsTrigger value="indicators">सूचकहरू</TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-4">
              <div className="h-[400px]">
                <PopulationPieChart
                  totalMale={demographicData.populationMale}
                  totalFemale={demographicData.populationFemale}
                />
              </div>
            </TabsContent>

            <TabsContent value="population" className="p-4">
              <div className="h-[400px]">
                <DemographicBars demographicData={demographicData} />
              </div>
            </TabsContent>

            <TabsContent value="indicators" className="p-4">
              <div className="h-[400px]">
                <TrendChart demographicData={demographicData} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  जनसांख्यिकी तथ्याङ्क तालिका
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        सूचक
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        मान
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        एकाइ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        कुल जनसंख्या
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.totalPopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        व्यक्ति
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        पुरुष जनसंख्या
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.populationMale.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        व्यक्ति
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        महिला जनसंख्या
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.populationFemale.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        व्यक्ति
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        कुल घरधुरी
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.totalHouseholds.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">घर</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        औसत परिवार आकार
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.averageHouseholdSize.toFixed(2),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        व्यक्ति प्रति घर
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        लैंगिक अनुपात
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.sexRatio.toFixed(2),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        प्रति १०० महिलामा पुरुष
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        वार्षिक वृद्धि दर
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.annualGrowthRate.toFixed(2),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        प्रतिशत
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        साक्षरता दर
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.literacyRate.toFixed(2),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        प्रतिशत
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        जनघनत्व
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          demographicData.populationDensity.toFixed(2),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2">
                        प्रति वर्ग कि.मी.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
