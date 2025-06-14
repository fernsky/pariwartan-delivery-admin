"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgeGroupOccupationChart from "./charts/age-group-occupation-chart";
import OccupationPieChart from "./charts/occupation-pie-chart";
import OccupationBarChart from "./charts/occupation-bar-chart";
import { localizeNumber } from "@/lib/utils/localize-number";
import { familyMainOccupationLabels } from "@/server/api/routers/profile/demographics/ward-wise-major-occupation.schema";

interface OccupationChartsProps {
  occupationData:
    | Array<{
        id?: string;
        occupation: string;
        age15_19: number;
        age20_24: number;
        age25_29: number;
        age30_34: number;
        age35_39: number;
        age40_44: number;
        age45_49: number;
        totalPopulation: number;
        percentage: number;
      }>
    | null
    | undefined;
  totalPopulation: number;
}

export default function OccupationCharts({
  occupationData,
  totalPopulation,
}: OccupationChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>(
    "occupation-distribution",
  );

  // Add null checks and ensure occupationData is a valid array
  if (
    !occupationData ||
    !Array.isArray(occupationData) ||
    occupationData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">पेशागत तथ्याङ्क लोड हुँदैछ...</p>
      </div>
    );
  }

  // Calculate total age groups
  const totalAge15_19 = occupationData.reduce(
    (sum, item) => sum + (item.age15_19 || 0),
    0,
  );
  const totalAge20_24 = occupationData.reduce(
    (sum, item) => sum + (item.age20_24 || 0),
    0,
  );
  const totalAge25_29 = occupationData.reduce(
    (sum, item) => sum + (item.age25_29 || 0),
    0,
  );
  const totalAge30_34 = occupationData.reduce(
    (sum, item) => sum + (item.age30_34 || 0),
    0,
  );
  const totalAge35_39 = occupationData.reduce(
    (sum, item) => sum + (item.age35_39 || 0),
    0,
  );
  const totalAge40_44 = occupationData.reduce(
    (sum, item) => sum + (item.age40_44 || 0),
    0,
  );
  const totalAge45_49 = occupationData.reduce(
    (sum, item) => sum + (item.age45_49 || 0),
    0,
  );

  return (
    <>
      {/* Overall occupation distribution */}
      <section id="occupation-distribution">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Occupation Distribution in Khajura Rural Municipality"
          />
          <meta
            itemProp="description"
            content={`Occupational composition of Khajura with a total population of ${totalPopulation}`}
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              पेशा अनुसार जनसंख्या वितरण
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
                <TabsTrigger value="occupation-distribution">
                  पेशागत वितरण
                </TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="occupation-distribution" className="p-4">
              <div className="h-[400px]">
                <OccupationPieChart occupationData={occupationData} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  पेशा अनुसार जनसंख्या तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        पेशा
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
                    {occupationData
                      .sort((a, b) => b.totalPopulation - a.totalPopulation)
                      .map((item) => (
                        <tr key={item.id || item.occupation}>
                          <td className="border border-border px-4 py-2 font-medium">
                            {familyMainOccupationLabels[item.occupation] ||
                              item.occupation}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (item.totalPopulation || 0).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(item.percentage.toFixed(2), "ne")}%
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

      {/* Age group wise occupation distribution */}
      <section id="age-occupation-distribution">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Age-wise Occupation Distribution in Khajura Rural Municipality"
          />
          <meta
            itemProp="description"
            content="Age group-wise occupation distribution in Khajura"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              उमेर अनुसार पेशागत वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              विभिन्न उमेर समूहको पेशागत संरचना
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
                <AgeGroupOccupationChart occupationData={occupationData} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  उमेर अनुसार पेशागत जनसंख्या तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        पेशा
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        १५-१९
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        २०-२४
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        २५-२९
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        ३०-३४
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        ३५-३९
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        ४०-४४
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        ४५-४९
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        जम्मा
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {occupationData.map((item) => (
                      <tr key={item.id || item.occupation}>
                        <td className="border border-border px-4 py-2 font-medium">
                          {familyMainOccupationLabels[item.occupation] ||
                            item.occupation}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.age15_19 || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.age20_24 || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.age25_29 || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.age30_34 || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.age35_39 || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.age40_44 || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.age45_49 || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right font-medium">
                          {localizeNumber(
                            (item.totalPopulation || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-medium">
                      <td className="border border-border px-4 py-2">जम्मा</td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalAge15_19.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalAge20_24.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalAge25_29.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalAge30_34.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalAge35_39.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalAge40_44.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalAge45_49.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Occupation comparison bar chart */}
      <section>
        <div
          className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Occupation Comparison in Khajura Rural Municipality"
          />
          <meta
            itemProp="description"
            content="Comparison of different occupations by population"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              पेशागत तुलना
            </h3>
            <p className="text-sm text-muted-foreground">
              मुख्य पेशाहरूको जनसंख्या तुलना
            </p>
          </div>

          <div className="p-6">
            <div className="h-[500px]">
              <OccupationBarChart occupationData={occupationData} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
