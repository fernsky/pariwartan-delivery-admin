"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardOccupationPieChartsProps {
  wardNumbers: number[];
  occupationData: Array<{
    id?: string;
    wardNumber: number;
    occupation: string;
    population: number;
  }>;
  OCCUPATION_NAMES: Record<string, string>;
  OCCUPATION_COLORS: Record<string, string>;
}

export default function WardOccupationPieCharts({
  wardNumbers,
  occupationData,
  OCCUPATION_NAMES,
  OCCUPATION_COLORS,
}: WardOccupationPieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalPopulation }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalPopulation) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")} ({localizeNumber(percentage, "ne")}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = occupationData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 occupations, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topOccupations = sortedItems.slice(0, 5);
        const otherOccupations = sortedItems.slice(5);
        const otherTotal = otherOccupations.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topOccupations.map((item) => ({
          name: OCCUPATION_NAMES[item.occupation] || item.occupation,
          value: item.population || 0,
          occupation: item.occupation,
        }));

        if (otherTotal > 0) {
          wardData.push({
            name: "अन्य",
            value: otherTotal,
            occupation: "OTHERS",
          });
        }

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल जनसंख्या: {localizeNumber(wardTotal.toLocaleString(), "ne")}
            </p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wardData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wardData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          OCCUPATION_COLORS[
                            entry.occupation as keyof typeof OCCUPATION_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalPopulation={wardTotal} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {wardData.map((item, i) => {
                  const percentage = (item.value / wardTotal) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            OCCUPATION_COLORS[
                              item.occupation as keyof typeof OCCUPATION_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                OCCUPATION_COLORS[
                                  item.occupation as keyof typeof OCCUPATION_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
