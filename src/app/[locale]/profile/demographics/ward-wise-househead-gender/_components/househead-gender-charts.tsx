"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenderHouseheadBarChart from "./charts/gender-househead-bar-chart";
import GenderHouseheadPieChart from "./charts/gender-househead-pie-chart";
import AgeGroupHouseheadPieChart from "./charts/age-group-househead-pie-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseheadGenderChartsProps {
  ageGroupData:
    | Array<{
        id?: string;
        ageGroup: string;
        maleHeads: number;
        femaleHeads: number;
        totalFamilies: number;
        updatedAt?: Date;
        createdAt?: Date;
      }>
    | null
    | undefined;
  totalMaleHeads: number;
  totalFemaleHeads: number;
  totalFamilies: number;
}

export default function HouseheadGenderCharts({
  ageGroupData,
  totalMaleHeads,
  totalFemaleHeads,
  totalFamilies,
}: HouseheadGenderChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("gender-distribution");

  // Add null checks and ensure ageGroupData is a valid array
  if (
    !ageGroupData ||
    !Array.isArray(ageGroupData) ||
    ageGroupData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">घरमूली तथ्याङ्क लोड हुँदैछ...</p>
      </div>
    );
  }

  // Filter out the 'जम्मा' row for display
  const dataWithoutTotal = ageGroupData.filter(
    (item) => item.ageGroup !== "जम्मा",
  );

  return (
    <>
      {/* Overall gender distribution of household heads */}
      <section id="gender-distribution">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Household Head Gender Distribution in Pariwartan Rural Municipality"
          />
          <meta
            itemProp="description"
            content={`Gender composition of household heads in Pariwartan with a total of ${totalFamilies} families`}
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              लिङ्ग अनुसार घरमूली वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              कुल परिवार: {localizeNumber(totalFamilies.toString(), "ne")}{" "}
              परिवार
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
                <GenderHouseheadPieChart
                  totalMaleHeads={totalMaleHeads}
                  totalFemaleHeads={totalFemaleHeads}
                  totalFamilies={totalFamilies}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  लिङ्ग अनुसार घरमूली तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        लिङ्ग
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        घरमूली संख्या
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        प्रतिशत
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        पुरुष घरमूली
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalMaleHeads.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          (
                            (totalMaleHeads /
                              (totalMaleHeads + totalFemaleHeads)) *
                            100
                          ).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        महिला घरमूली
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          totalFemaleHeads.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          (
                            (totalFemaleHeads /
                              (totalMaleHeads + totalFemaleHeads)) *
                            100
                          ).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                    <tr className="bg-muted/30 font-medium">
                      <td className="border border-border px-4 py-2">जम्मा</td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          (totalMaleHeads + totalFemaleHeads).toLocaleString(),
                          "ne",
                        )}
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

      {/* Age group-wise household head distribution */}
      <section id="age-group-distribution">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Age Group Household Head Distribution in Pariwartan Rural Municipality"
          />
          <meta
            itemProp="description"
            content={`Age group-wise household head distribution in Pariwartan with total families of ${totalFamilies}`}
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              उमेर समूह अनुसार घरमूली वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              विभिन्न उमेर समूहका घरमूली वितरण र प्रतिशत
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
                <AgeGroupHouseheadPieChart
                  ageGroupData={dataWithoutTotal}
                  totalFamilies={totalFamilies}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  उमेर समूह अनुसार घरमूली तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        उमेर समूह
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        परिवार संख्या
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        प्रतिशत
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataWithoutTotal
                      .sort((a, b) => b.totalFamilies - a.totalFamilies)
                      .map((item) => (
                        <tr key={item.id || item.ageGroup}>
                          <td className="border border-border px-4 py-2 font-medium">
                            {item.ageGroup}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (item.totalFamilies || 0).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                ((item.totalFamilies || 0) /
                                  (totalFamilies || 1)) *
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
                        {localizeNumber(totalFamilies.toLocaleString(), "ne")}
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

      {/* Age group-wise gender distribution */}
      <section id="age-gender-distribution">
        <div
          className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Age Group-wise Gender Distribution of Household Heads in Pariwartan Rural Municipality"
          />
          <meta
            itemProp="description"
            content="Gender distribution across different age groups of household heads in Pariwartan"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              उमेर समूह अनुसार लिङ्गगत घरमूली वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              उमेर समूह र लिङ्ग अनुसार घरमूली वितरण
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
                <GenderHouseheadBarChart ageGroupData={dataWithoutTotal} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  उमेर समूह अनुसार लिङ्गगत घरमूली तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        उमेर समूह
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        पुरुष घरमूली
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        महिला घरमूली
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        जम्मा परिवार
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        प्रतिशत
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataWithoutTotal.map((item) => (
                      <tr key={item.id || item.ageGroup}>
                        <td className="border border-border px-4 py-2 font-medium">
                          {item.ageGroup}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.maleHeads || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (item.femaleHeads || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right font-medium">
                          {localizeNumber(
                            (item.totalFamilies || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-4 py-2 text-right">
                          {localizeNumber(
                            (
                              ((item.totalFamilies || 0) /
                                (totalFamilies || 1)) *
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
                        {localizeNumber(totalMaleHeads.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          totalFemaleHeads.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalFamilies.toLocaleString(), "ne")}
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
