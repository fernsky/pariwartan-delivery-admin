"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface WardWiseMajorOccupationData {
  id: string;
  wardNumber: number;
  occupation: string;
  population: number;
  percentage?: number;
}

interface WardWiseMajorOccupationChartProps {
  data: WardWiseMajorOccupationData[];
}

export default function WardWiseMajorOccupationChart({
  data,
}: WardWiseMajorOccupationChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedOccupation, setSelectedOccupation] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("byWard"); // 'byWard' or 'byOccupation'

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get unique occupations
  const uniqueOccupations = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.occupation))).sort();
  }, [data]);

  // Filter by selected ward and occupation
  const filteredData = useMemo(() => {
    let result = [...data];

    if (selectedWard !== "all") {
      result = result.filter(
        (item) => item.wardNumber.toString() === selectedWard,
      );
    }

    if (selectedOccupation !== "all") {
      result = result.filter((item) => item.occupation === selectedOccupation);
    }

    return result;
  }, [data, selectedWard, selectedOccupation]);

  // Get top 5 occupations by population
  const topOccupations = useMemo(() => {
    const occupationTotals = filteredData.reduce(
      (acc, item) => {
        if (!acc[item.occupation]) {
          acc[item.occupation] = 0;
        }
        acc[item.occupation] += item.population;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(occupationTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([occupation]) => occupation);
  }, [filteredData]);

  // Prepare bar chart data based on the chartView
  const barChartData = useMemo(() => {
    if (chartView === "byWard") {
      // Group by ward
      return uniqueWards
        .filter((wardNum) => selectedWard === "all" || wardNum === selectedWard)
        .map((wardNum) => {
          const wardItems = filteredData.filter(
            (item) => item.wardNumber.toString() === wardNum,
          );

          // Create an object with ward as key and occupation populations
          const dataPoint: Record<string, any> = {
            ward: `वडा ${wardNum}`,
          };

          // If occupation filter is applied, just show that occupation
          if (selectedOccupation !== "all") {
            const occupationItem = wardItems.find(
              (item) => item.occupation === selectedOccupation,
            );
            dataPoint[selectedOccupation] = occupationItem?.population || 0;
          } else {
            // Otherwise show top 5 occupations
            topOccupations.forEach((occupation) => {
              const occupationItem = wardItems.find(
                (item) => item.occupation === occupation,
              );
              dataPoint[occupation] = occupationItem?.population || 0;
            });
          }

          return dataPoint;
        });
    } else {
      // Group by occupation
      return uniqueOccupations
        .filter(
          (occupation) =>
            selectedOccupation === "all" || occupation === selectedOccupation,
        )
        .slice(0, 10) // Limit to top 10 occupations for readability
        .map((occupation) => {
          const occupationItems = filteredData.filter(
            (item) => item.occupation === occupation,
          );

          // Create an object with occupation as key and ward populations
          const dataPoint: Record<string, any> = {
            occupation,
          };

          if (selectedWard !== "all") {
            const wardItem = occupationItems.find(
              (item) => item.wardNumber.toString() === selectedWard,
            );
            dataPoint[`वडा ${selectedWard}`] = wardItem?.population || 0;
          } else {
            // Show populations for all wards
            uniqueWards.slice(0, 8).forEach((wardNum) => {
              // Limit to 8 wards for readability
              const wardItem = occupationItems.find(
                (item) => item.wardNumber.toString() === wardNum,
              );
              dataPoint[`वडा ${wardNum}`] = wardItem?.population || 0;
            });
          }

          return dataPoint;
        });
    }
  }, [
    filteredData,
    uniqueWards,
    uniqueOccupations,
    chartView,
    selectedWard,
    selectedOccupation,
    topOccupations,
  ]);

  // Get chart keys based on the chartView
  const chartKeys = useMemo(() => {
    if (chartView === "byWard") {
      return selectedOccupation !== "all"
        ? [selectedOccupation]
        : topOccupations;
    } else {
      return selectedWard !== "all"
        ? [`वडा ${selectedWard}`]
        : uniqueWards
            .slice(0, 8) // Limit to 8 wards for readability
            .map((wardNum) => `वडा ${wardNum}`);
    }
  }, [
    chartView,
    selectedOccupation,
    topOccupations,
    selectedWard,
    uniqueWards,
  ]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (selectedWard !== "all" && chartView === "byWard") {
      // Show occupation distribution for a specific ward
      const wardData = filteredData.filter(
        (item) => item.wardNumber.toString() === selectedWard,
      );

      const totalWardPopulation = wardData.reduce(
        (sum, item) => sum + item.population,
        0,
      );

      return wardData
        .map((item, index) => ({
          id: item.occupation,
          label: item.occupation,
          value: item.population,
          percentage:
            totalWardPopulation > 0
              ? ((item.population / totalWardPopulation) * 100).toFixed(1)
              : "0",
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value);
    } else if (selectedOccupation !== "all" && chartView === "byOccupation") {
      // Show ward distribution for a specific occupation
      const occupationData = filteredData.filter(
        (item) => item.occupation === selectedOccupation,
      );

      return occupationData
        .map((item, index) => ({
          id: `वडा ${item.wardNumber}`,
          label: `वडा ${item.wardNumber}`,
          value: item.population,
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value);
    } else {
      // Show top occupations across all filtered data
      const occupationTotals = filteredData.reduce(
        (acc, item) => {
          if (!acc[item.occupation]) {
            acc[item.occupation] = 0;
          }
          acc[item.occupation] += item.population;
          return acc;
        },
        {} as Record<string, number>,
      );

      const totalPopulation = Object.values(occupationTotals).reduce(
        (sum, value) => sum + value,
        0,
      );

      return Object.entries(occupationTotals)
        .map(([occupation, population], index) => ({
          id: occupation,
          label: occupation,
          value: population,
          percentage:
            totalPopulation > 0
              ? ((population / totalPopulation) * 100).toFixed(1)
              : "0",
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); // Limit to top 8 for readability
    }
  }, [filteredData, selectedWard, selectedOccupation, chartView]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार प्रमुख पेशा डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार प्रमुख पेशा विश्लेषण</CardTitle>
        <CardDescription>
          वडा अनुसार प्रमुख पेशा र जनसंख्याको अनुपात हेर्नुहोस्
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              प्रस्तुतिकरण:
            </label>
            <Select value={chartView} onValueChange={setChartView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="प्रस्तुतिकरण चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="byWard">वडा अनुसार</SelectItem>
                <SelectItem value="byOccupation">पेशा अनुसार</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              वडा चयन गर्नुहोस्:
            </label>
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="वडा चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै वडा</SelectItem>
                {uniqueWards.map((wardNum) => (
                  <SelectItem key={wardNum} value={wardNum}>
                    वडा {wardNum}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              पेशा चयन गर्नुहोस्:
            </label>
            <Select
              value={selectedOccupation}
              onValueChange={setSelectedOccupation}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="पेशा चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै पेशा</SelectItem>
                {uniqueOccupations.map((occupation) => (
                  <SelectItem key={occupation} value={occupation}>
                    {occupation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="bar" className="mt-2">
          <TabsList>
            <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
            <TabsTrigger value="pie">पाई चार्ट</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveBar
                data={barChartData}
                keys={chartKeys}
                indexBy={chartView === "byWard" ? "ward" : "occupation"}
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "nivo" }}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 45,
                  legend: chartView === "byWard" ? "वडा" : "पेशा",
                  legendPosition: "middle",
                  legendOffset: 60,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "जनसंख्या",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsivePie
                data={pieChartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                tooltip={({ datum }) => (
                  <div
                    style={{
                      background: "white",
                      padding: "9px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  >
                    {datum.label}: {datum.value}{" "}
                    {"percentage" in datum.data &&
                      `(${datum.data.percentage}%)`}
                  </div>
                )}
                defs={[
                  {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                ]}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              कुल जनसंख्या
            </div>
            <div className="text-2xl font-bold">
              {filteredData
                .reduce((sum, item) => sum + item.population, 0)
                .toLocaleString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              वडा संख्या
            </div>
            <div className="text-2xl font-bold">
              {(selectedWard === "all" ? uniqueWards.length : 1).toString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {selectedOccupation === "all" ? "मुख्य पेशा" : selectedOccupation}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedOccupation === "all" && topOccupations.length > 0 && (
                <Badge variant="outline" className="px-2 py-1">
                  {topOccupations[0]}
                </Badge>
              )}
              {selectedOccupation !== "all" && (
                <div className="text-2xl font-bold">
                  {filteredData
                    .reduce((sum, item) => sum + item.population, 0)
                    .toLocaleString()}
                </div>
              )}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
