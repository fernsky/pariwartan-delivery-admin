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
import {
  ReligionTypeEnum,
  type ReligionType,
} from "@/server/api/routers/profile/demographics/ward-wise-religion-population.schema";

interface ReligionPopulationData {
  id: string;
  religionType: ReligionType;
  malePopulation: number;
  femalePopulation: number;
  totalPopulation: number;
  percentage?: number | null;
}

interface WardWiseReligionPopulationChartProps {
  data: ReligionPopulationData[];
}

export default function WardWiseReligionPopulationChart({
  data,
}: WardWiseReligionPopulationChartProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<string>("totalPopulation");

  // Get unique religions
  const uniqueReligions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.religionType))).sort();
  }, [data]);

  // Get religion display name
  const getReligionDisplayName = (religionType: ReligionType) => {
    const religionNames: Record<ReligionType, string> = {
      HINDU: "हिन्दु",
      BUDDHIST: "बौद्ध",
      KIRANT: "किरात",
      CHRISTIAN: "क्रिश्चियन",
      ISLAM: "इस्लाम",
      NATURE: "प्रकृति",
      BON: "बोन",
      JAIN: "जैन",
      BAHAI: "बहाई",
      SIKH: "सिख",
      OTHER: "अन्य",
    };
    return religionNames[religionType] || religionType;
  };

  // Prepare bar chart data - show all religions with their populations
  const barChartData = useMemo(() => {
    return data
      .sort((a, b) => {
        const valueA =
          selectedMetric === "percentage"
            ? a.percentage || 0
            : (a[selectedMetric as keyof ReligionPopulationData] as number) ||
              0;

        const valueB =
          selectedMetric === "percentage"
            ? b.percentage || 0
            : (b[selectedMetric as keyof ReligionPopulationData] as number) ||
              0;

        return valueB - valueA;
      })
      .map((item, index) => {
        const hue = (index * 137.5) % 360;
        const value =
          selectedMetric === "percentage"
            ? item.percentage || 0
            : (item[
                selectedMetric as keyof ReligionPopulationData
              ] as number) || 0;

        return {
          religion: getReligionDisplayName(item.religionType),
          [selectedMetric]: value,
          color: `hsl(${hue}, 70%, 50%)`,
        };
      });
  }, [data, selectedMetric]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    const religionGroups = data
      .map((item) => {
        const value =
          selectedMetric === "percentage"
            ? item.percentage || 0
            : (item[
                selectedMetric as keyof ReligionPopulationData
              ] as number) || 0;

        return {
          id: item.religionType,
          label: getReligionDisplayName(item.religionType),
          value: value,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
        };
      })
      .filter((item) => item.value > 0);

    return religionGroups.sort((a, b) => b.value - a.value);
  }, [data, selectedMetric]);

  // Define metrics options
  const metrics = [
    { value: "totalPopulation", label: "कुल जनसंख्या" },
    { value: "malePopulation", label: "पुरुष जनसंख्या" },
    { value: "femalePopulation", label: "महिला जनसंख्या" },
    { value: "percentage", label: "प्रतिशत" },
  ];

  // Get human-readable metric name
  const getMetricLabel = () => {
    return (
      metrics.find((m) => m.value === selectedMetric)?.label || selectedMetric
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले धर्म जनसंख्या डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>धर्म जनसंख्या विश्लेषण</CardTitle>
        <CardDescription>धर्म अनुसार जनसंख्या डाटा हेर्नुहोस्</CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              मेट्रिक चयन गर्नुहोस्:
            </label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="मेट्रिक चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
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
                keys={[selectedMetric]}
                indexBy="religion"
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={({ data }) => String(data.color)}
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
                  legend: "धर्म",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: getMetricLabel(),
                  legendPosition: "middle",
                  legendOffset: -40,
                  format: (value) =>
                    selectedMetric === "percentage"
                      ? `${value.toFixed(1)}%`
                      : value.toString(),
                }}
                labelFormat={(value) =>
                  selectedMetric === "percentage"
                    ? `${value}%`
                    : value.toString()
                }
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
      </CardContent>
    </Card>
  );
}
