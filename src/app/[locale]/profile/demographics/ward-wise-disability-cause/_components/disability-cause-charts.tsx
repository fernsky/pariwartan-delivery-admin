"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DisabilityByAgeBarChart from "./charts/disability-by-age-bar-chart";
import DisabilityTypePieChart from "./charts/disability-type-pie-chart";
import AgeGroupPieChart from "./charts/age-group-pie-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DisabilityCauseChartsProps {
  disabilityData:
    | Array<{
        id?: string;
        ageGroup: string;
        physicalDisability: number;
        visualImpairment: number;
        hearingImpairment: number;
        deafMute: number;
        speechHearingCombined: number;
        intellectualDisability: number;
        mentalPsychosocial: number;
        autism: number;
        multipleDisabilities: number;
        otherDisabilities: number;
        total: number;
      }>
    | null
    | undefined;
  totalDisabled: number;
  totalPhysical: number;
  totalVisual: number;
  totalHearing: number;
}

export default function DisabilityCauseCharts({
  disabilityData,
  totalDisabled,
  totalPhysical,
  totalVisual,
  totalHearing,
}: DisabilityCauseChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overall-status");

  // Add null checks and ensure disabilityData is a valid array
  if (
    !disabilityData ||
    !Array.isArray(disabilityData) ||
    disabilityData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">अपाङ्गता तथ्याङ्क लोड हुँदैछ...</p>
      </div>
    );
  }

  // Filter out total row for calculations
  const dataWithoutTotal = disabilityData.filter(
    (item) => item.ageGroup !== "जम्मा",
  );

  return (
    <>
      {/* Overall disability status */}
      <section id="overall-disability-status">
        <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold">अपाङ्गताको समग्र स्थिति</h3>
            <p className="text-sm text-muted-foreground">
              कुल अपाङ्गता भएका व्यक्ति:{" "}
              {localizeNumber(totalDisabled.toString(), "ne")}
            </p>
          </div>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overall-status">समग्र स्थिति</TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overall-status" className="p-4">
              <div className="h-[400px]">
                <DisabilityTypePieChart disabilityData={dataWithoutTotal} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  अपाङ्गताको प्रकार अनुसार तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        अपाङ्गताको प्रकार
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
                        शारीरिक अपाङ्गता
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalPhysical.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          ((totalPhysical / totalDisabled) * 100).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        दृष्टि अपाङ्गता
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalVisual.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          ((totalVisual / totalDisabled) * 100).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        श्रवण अपाङ्गता
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalHearing.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          ((totalHearing / totalDisabled) * 100).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                    <tr className="bg-muted/30 font-medium">
                      <td className="border border-border px-4 py-2">जम्मा</td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalDisabled.toLocaleString(), "ne")}
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

      {/* Age-wise disability distribution */}
      <section id="age-wise-disability">
        <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold">
              उमेर अनुसार अपाङ्गता वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              विभिन्न उमेर समूहमा अपाङ्गताको वितरण
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
                <AgeGroupPieChart disabilityData={dataWithoutTotal} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  उमेर समूह अनुसार अपाङ्गता तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        उमेर समूह
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
                    {dataWithoutTotal
                      .sort((a, b) => b.total - a.total)
                      .map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="border border-border px-4 py-2 font-medium">
                            {item.ageGroup}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (item.total || 0).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                ((item.total || 0) / (totalDisabled || 1)) *
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
                        {localizeNumber(totalDisabled.toLocaleString(), "ne")}
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

      {/* Disability type distribution */}
      <section id="disability-type-distribution">
        <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold">
              उमेर र अपाङ्गताको प्रकार अनुसार वितरण
            </h3>
            <p className="text-sm text-muted-foreground">
              उमेर समूह र अपाङ्गताको प्रकार अनुसार विस्तृत वितरण
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
                <DisabilityByAgeBarChart disabilityData={dataWithoutTotal} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  उमेर र अपाङ्गताको प्रकार अनुसार विस्तृत तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-2 py-2 text-left">
                        उमेर समूह
                      </th>
                      <th className="border border-border px-2 py-2 text-right">
                        शारीरिक
                      </th>
                      <th className="border border-border px-2 py-2 text-right">
                        दृष्टि
                      </th>
                      <th className="border border-border px-2 py-2 text-right">
                        श्रवण
                      </th>
                      <th className="border border-border px-2 py-2 text-right">
                        बोली-श्रवण
                      </th>
                      <th className="border border-border px-2 py-2 text-right">
                        बौद्धिक
                      </th>
                      <th className="border border-border px-2 py-2 text-right">
                        जम्मा
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataWithoutTotal.map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="border border-border px-2 py-2 font-medium">
                          {item.ageGroup}
                        </td>
                        <td className="border border-border px-2 py-2 text-right">
                          {localizeNumber(
                            (item.physicalDisability || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-2 py-2 text-right">
                          {localizeNumber(
                            (item.visualImpairment || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-2 py-2 text-right">
                          {localizeNumber(
                            (item.hearingImpairment || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-2 py-2 text-right">
                          {localizeNumber(
                            (item.speechHearingCombined || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-2 py-2 text-right">
                          {localizeNumber(
                            (item.intellectualDisability || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border border-border px-2 py-2 text-right font-medium">
                          {localizeNumber(
                            (item.total || 0).toLocaleString(),
                            "ne",
                          )}
                        </td>
                      </tr>
                    ))}
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
