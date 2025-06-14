"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EconomicallyActiveEmploymentChart from "./charts/economically-active-employment-chart";
import WardWiseEconomicallyActiveChart from "./charts/ward-wise-economically-active-chart";
import GenderWiseEconomicallyActiveChart from "./charts/gender-wise-economically-active-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

interface EconomicallyActivePopulationChartsProps {
  economicallyActiveData:
    | Array<{
        id?: string;
        wardNumber: string;
        gender: string;
        age10PlusTotal: number;
        economicallyActiveEmployed: number;
        economicallyActiveUnemployed: number;
        householdWork: number;
        economicallyActiveTotal: number;
        dependentPopulation: number;
      }>
    | null
    | undefined;
  totalAge10Plus: number;
  totalEmployed: number;
  totalUnemployed: number;
  totalEconomicallyActive: number;
}

export default function EconomicallyActivePopulationCharts({
  economicallyActiveData,
  totalAge10Plus,
  totalEmployed,
  totalUnemployed,
  totalEconomicallyActive,
}: EconomicallyActivePopulationChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("employment-overview");

  // Add null checks and ensure data is a valid array
  if (
    !economicallyActiveData ||
    !Array.isArray(economicallyActiveData) ||
    economicallyActiveData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">आर्थिक तथ्याङ्क लोड हुँदैछ...</p>
      </div>
    );
  }

  // Calculate employment statistics
  const employmentRate =
    totalAge10Plus > 0
      ? ((totalEmployed / totalAge10Plus) * 100).toFixed(1)
      : "0";
  const unemploymentRate =
    totalEconomicallyActive > 0
      ? ((totalUnemployed / totalEconomicallyActive) * 100).toFixed(1)
      : "0";

  return (
    <>
      {/* Overall employment overview */}
      <section id="economically-active-overview">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Employment Overview in Pariwartan Rural Municipality"
          />
          <meta
            itemProp="description"
            content={`Employment statistics with ${totalEconomicallyActive} economically active population`}
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              रोजगारी र बेरोजगारी सिंहावलोकन
            </h3>
            <p className="text-sm text-muted-foreground">
              रोजगारी दर: {localizeNumber(employmentRate, "ne")}% | बेरोजगारी
              दर: {localizeNumber(unemploymentRate, "ne")}%
            </p>
          </div>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="employment-overview">
                  रोजगारी वितरण
                </TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="employment-overview" className="p-4">
              <div className="h-[400px]">
                <EconomicallyActiveEmploymentChart
                  totalEmployed={totalEmployed}
                  totalUnemployed={totalUnemployed}
                  totalEconomicallyActive={totalEconomicallyActive}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  रोजगारी तथ्याङ्क सिंहावलोकन
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        श्रेणी
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
                        रोजगारीमा
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalEmployed.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(employmentRate, "ne")}%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 font-medium">
                        बेरोजगार
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(totalUnemployed.toLocaleString(), "ne")}
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(unemploymentRate, "ne")}%
                      </td>
                    </tr>
                    <tr className="bg-muted/30 font-medium">
                      <td className="border border-border px-4 py-2">
                        आर्थिक रूपमा सक्रिय
                      </td>
                      <td className="border border-border px-4 py-2 text-right">
                        {localizeNumber(
                          totalEconomicallyActive.toLocaleString(),
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

      {/* Ward-wise distribution */}
      <section id="ward-wise-distribution">
        <div
          className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              वडागत आर्थिक रूपमा सक्रिय जनसंख्या
            </h3>
            <p className="text-sm text-muted-foreground">
              प्रत्येक वडाको आर्थिक रूपमा सक्रिय जनसंख्याको वितरण
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
              <div className="h-[500px]">
                <WardWiseEconomicallyActiveChart
                  economicallyActiveData={economicallyActiveData}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              {/* Ward-wise table content */}
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  वडागत आर्थिक तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        वडा नं.
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        १० वर्ष माथि
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        रोजगारीमा
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        बेरोजगार
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        आर्थिक रूपमा सक्रिय
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Show ward-wise data */}
                    {[1, 2, 3, 4, 5, 6].map((wardNum) => {
                      const wardData = economicallyActiveData.filter(
                        (item) =>
                          item.wardNumber === wardNum.toString() &&
                          item.gender === "जम्मा",
                      )[0];

                      if (!wardData) return null;

                      return (
                        <tr key={wardNum}>
                          <td className="border border-border px-4 py-2 font-medium">
                            वडा {localizeNumber(wardNum.toString(), "ne")}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (wardData.age10PlusTotal || 0).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                wardData.economicallyActiveEmployed || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                wardData.economicallyActiveUnemployed || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                wardData.economicallyActiveTotal || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Gender-wise distribution */}
      <section id="gender-distribution">
        <div
          className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              लैंगिक आर्थिक सक्रियता
            </h3>
            <p className="text-sm text-muted-foreground">
              पुरुष र महिलाको आर्थिक सक्रियताको तुलनात्मक विश्लेषण
            </p>
          </div>

          <Tabs defaultValue="comparison-chart" className="w-full">
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comparison-chart">तुलना चार्ट</TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="comparison-chart" className="p-6">
              <div className="h-[500px]">
                <GenderWiseEconomicallyActiveChart
                  economicallyActiveData={economicallyActiveData}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="p-6">
              {/* Gender-wise table content */}
              <div className="overflow-x-auto">
                <h4 className="text-lg font-medium mb-4">
                  लैंगिक आर्थिक तथ्याङ्क
                </h4>
                <table className="min-w-full border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        वडा नं.
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        लिङ्ग
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        १० वर्ष माथि
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        रोजगारीमा
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        बेरोजगार
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        घरायसी काम
                      </th>
                      <th className="border border-border px-4 py-2 text-right">
                        आर्थिक रूपमा सक्रिय
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6].map((wardNum) => {
                      return ["पुरुष", "महिला"].map((gender, genderIndex) => {
                        const wardGenderData = economicallyActiveData.filter(
                          (item) =>
                            item.wardNumber === wardNum.toString() &&
                            item.gender === gender,
                        )[0];

                        if (!wardGenderData) return null;

                        return (
                          <tr key={`${wardNum}-${gender}`}>
                            {genderIndex === 0 && (
                              <td
                                rowSpan={2}
                                className="border border-border px-4 py-2 font-medium align-middle bg-muted/20"
                              >
                                वडा {localizeNumber(wardNum.toString(), "ne")}
                              </td>
                            )}
                            <td className="border border-border px-4 py-2 font-medium">
                              {gender}
                            </td>
                            <td className="border border-border px-4 py-2 text-right">
                              {localizeNumber(
                                (
                                  wardGenderData.age10PlusTotal || 0
                                ).toLocaleString(),
                                "ne",
                              )}
                            </td>
                            <td className="border border-border px-4 py-2 text-right">
                              {localizeNumber(
                                (
                                  wardGenderData.economicallyActiveEmployed || 0
                                ).toLocaleString(),
                                "ne",
                              )}
                            </td>
                            <td className="border border-border px-4 py-2 text-right">
                              {localizeNumber(
                                (
                                  wardGenderData.economicallyActiveUnemployed ||
                                  0
                                ).toLocaleString(),
                                "ne",
                              )}
                            </td>
                            <td className="border border-border px-4 py-2 text-right">
                              {localizeNumber(
                                (
                                  wardGenderData.householdWork || 0
                                ).toLocaleString(),
                                "ne",
                              )}
                            </td>
                            <td className="border border-border px-4 py-2 text-right">
                              {localizeNumber(
                                (
                                  wardGenderData.economicallyActiveTotal || 0
                                ).toLocaleString(),
                                "ne",
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })}
                    {/* Total row for each gender */}
                    {["पुरुष", "महिला"].map((gender, genderIndex) => {
                      const genderTotalData = economicallyActiveData.filter(
                        (item) =>
                          item.wardNumber === "जम्मा" && item.gender === gender,
                      )[0];

                      if (!genderTotalData) return null;

                      return (
                        <tr
                          key={`total-${gender}`}
                          className="bg-muted/30 font-medium"
                        >
                          {genderIndex === 0 && (
                            <td
                              rowSpan={2}
                              className="border border-border px-4 py-2 font-bold align-middle bg-muted/40"
                            >
                              जम्मा
                            </td>
                          )}
                          <td className="border border-border px-4 py-2 font-medium">
                            {gender}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.age10PlusTotal || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.economicallyActiveEmployed || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.economicallyActiveUnemployed ||
                                0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.householdWork || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.economicallyActiveTotal || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="border border-border px-4 py-2 text-left font-medium">
                        लिङ्ग
                      </th>
                      <th className="border border-border px-4 py-2 text-right font-medium">
                        १० वर्ष र माथि
                      </th>
                      <th className="border border-border px-4 py-2 text-right font-medium">
                        रोजगारमा संलग्न
                      </th>
                      <th className="border border-border px-4 py-2 text-right font-medium">
                        बेरोजगार
                      </th>
                      <th className="border border-border px-4 py-2 text-right font-medium">
                        घरायसी काम
                      </th>
                      <th className="border border-border px-4 py-2 text-right font-medium">
                        जम्मा
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {["पुरुष", "महिला"].map((gender) => {
                      const genderTotalData = economicallyActiveData.filter(
                        (item) =>
                          item.wardNumber === "जम्मा" && item.gender === gender,
                      )[0];

                      if (!genderTotalData) return null;

                      return (
                        <tr key={gender}>
                          <td className="border border-border px-4 py-2 font-medium">
                            {gender}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.age10PlusTotal || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.economicallyActiveEmployed || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.economicallyActiveUnemployed ||
                                0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.householdWork || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                          <td className="border border-border px-4 py-2 text-right">
                            {localizeNumber(
                              (
                                genderTotalData.economicallyActiveTotal || 0
                              ).toLocaleString(),
                              "ne",
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
