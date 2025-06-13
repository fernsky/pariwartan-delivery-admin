"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenderCasteBarChart from "./charts/gender-caste-bar-chart";
import GenderPieChart from "./charts/gender-pie-chart";
import CastePopulationPieChart from "./charts/caste-population-pie-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

interface CasteChartsProps {
  casteData:
    | Array<{
        id?: string;
        casteType: string;
        casteTypeDisplay?: string;
        malePopulation: number;
        femalePopulation: number;
        totalPopulation: number;
      }>
    | null
    | undefined;
  totalMale: number;
  totalFemale: number;
  totalPopulation: number;
}

export default function CasteCharts({
  casteData,
  totalMale,
  totalFemale,
  totalPopulation,
}: CasteChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("gender-distribution");

  // Add null checks and ensure casteData is a valid array
  if (!casteData || !Array.isArray(casteData) || casteData.length === 0) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">जातीय तथ्याङ्क लोड हुँदैछ...</p>
      </div>
    );
  }

  return (
    <>
      {/* Overall gender distribution */}
      <section id="gender-distribution">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Gender Distribution in Khajura Rural Municipality"
          />
          <meta
            itemProp="description"
            content={`Gender composition of Khajura with a total population of ${totalPopulation}`}
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              लिङ्ग अनुसार जनसंख्या वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              कुल जनसंख्या: {localizeNumber(totalPopulation.toString(), "ne")}{" "}
              व्यक्ति
            </p>
          </div>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gender-distribution">
                  लिङ्ग वितरण
                </TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="gender-distribution" className="p-4">
              <div className="h-[400px]">
                <GenderPieChart
                  totalMale={totalMale}
                  totalFemale={totalFemale}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  लिङ्ग अनुसार जनसंख्या तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        लिङ्ग
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        जनसंख्या
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        प्रतिशत
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        पुरुष
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalMale.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          ((totalMale / totalPopulation) * 100).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        महिला
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalFemale.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          ((totalFemale / totalPopulation) * 100).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                    <tr className="bg-muted/30 font-medium">
                      <td className="border border-border px-4 py-2">जम्मा</td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber("100.00", "ne")}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Caste-wise population distribution */}
      <section id="caste-distribution">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Caste Population Distribution in Khajura Rural Municipality"
          />
          <meta
            itemProp="description"
            content={`Caste-wise population distribution in Khajura with total population of ${totalPopulation}`}
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              जाति अनुसार जनसंख्या वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              विभिन्न जातजातिको जनसंख्या वितरण र प्रतिशत
            </p>
          </div>

          <Tabs defaultValue="pie-chart" className="w-full">
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pie-chart">पाई चार्ट</TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pie-chart" className="p-6">
              <div className="h-[500px]">
                <CastePopulationPieChart
                  casteData={casteData}
                  totalPopulation={totalPopulation}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  जाति अनुसार जनसंख्या तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        जातजाती
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        जनसंख्या
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        प्रतिशत
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {casteData
                      .sort((a, b) => b.totalPopulation - a.totalPopulation)
                      .map((item) => (
                        <tr key={item.id || item.casteType}>
                          <td className="border border-border px-4 py-2 font-medium">
                            {item.casteTypeDisplay || item.casteType}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (item.totalPopulation || 0).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                ((item.totalPopulation || 0) /
                                  (totalPopulation || 1)) *
                                100
                              ).toFixed(2),
                              "ne",
                            )}
                            %
                          </td>
                        </tr>
                      ))}
                    <tr className="bg-muted/30 font-medium">
                      <td className="border border-border px-4 py-2">जम्मा</td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber("100.00", "ne")}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Caste-wise gender distribution */}
      <section id="caste-gender-distribution">
        <div
          className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Caste-wise Gender Distribution in Khajura Rural Municipality"
          />
          <meta
            itemProp="description"
            content="Gender distribution across different castes in Khajura"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              जाति अनुसार लिङ्गगत वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              जातजाति र लिङ्ग अनुसार जनसंख्या वितरण
            </p>
          </div>

          <Tabs defaultValue="bar-chart" className="w-full">
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bar-chart">बार चार्ट</TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="bar-chart" className="p-6">
              <div className="h-[600px]">
                <GenderCasteBarChart casteData={casteData} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  जाति अनुसार लिङ्गगत जनसंख्या तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        जातजाती
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        पुरुष
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        महिला
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        जम्मा
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        प्रतिशत
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {casteData.map((item) => (
                      <tr key={item.id || item.casteType}>
                        <td className="border border-border px-4 py-2 font-medium">
                          {item.casteTypeDisplay || item.casteType}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.malePopulation || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.femalePopulation || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right font-medium">
                          {localizeNumber(
                            (item.totalPopulation || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (
                              ((item.totalPopulation || 0) /
                                (totalPopulation || 1)) *
                              100
                            ).toFixed(2),
                            "ne",
                          )}
                          %
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-medium">
                      <td className="border border-border px-4 py-2">जम्मा</td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalMale.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalFemale.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber("100.00", "ne")}%
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
