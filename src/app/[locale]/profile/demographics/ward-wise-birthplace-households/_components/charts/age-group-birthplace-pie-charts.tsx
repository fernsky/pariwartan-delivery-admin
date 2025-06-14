"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgeGroupBirthplacePieChartsProps {
  ageGroups: string[];
  birthplaceData: Array<{
    id?: string;
    birthPlace: string;
    households: number;
    ageGroup: string;
  }>;
  BIRTH_PLACE_NAMES: Record<string, string>;
  BIRTH_PLACE_COLORS: Record<string, string>;
}

export default function AgeGroupBirthplacePieCharts({
  ageGroups,
  birthplaceData,
  BIRTH_PLACE_NAMES,
  BIRTH_PLACE_COLORS,
}: AgeGroupBirthplacePieChartsProps) {
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
              {localizeNumber(value.toLocaleString(), "ne")} (
              {localizeNumber(percentage, "ne")}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Sort age groups for consistent display
  const sortedAgeGroups = [...ageGroups].sort((a, b) => {
    const ageOrder = [
      "०-४ वर्ष",
      "५-९ वर्ष",
      "१०-१४ वर्ष",
      "१५-१९ वर्ष",
      "२०-२४ वर्ष",
      "२५-२९ वर्ष",
      "३०-३४ वर्ष",
      "३५-३९ वर्ष",
      "४०-४४ वर्ष",
      "४५-४९ वर्ष",
      "५०-५४ वर्ष",
      "५५-५९ वर्ष",
      "६०-६४ वर्ष",
      "६५-६९ वर्ष",
      "७०-७४ वर्ष",
      "७५- वर्षमाथि",
    ];
    return ageOrder.indexOf(a) - ageOrder.indexOf(b);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedAgeGroups.map((ageGroup) => {
        const ageGroupItems = birthplaceData.filter(
          (item) => item.ageGroup === ageGroup,
        );

        // Calculate age group total for percentages
        const ageGroupTotal = ageGroupItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Skip if no data for this age group
        if (ageGroupTotal === 0) return null;

        // Sort birthplaces for consistent presentation
        const birthplaceOrder = {
          SAME_MUNICIPALITY: 1,
          SAME_DISTRICT_ANOTHER_MUNICIPALITY: 2,
          ANOTHER_DISTRICT: 3,
          ABROAD: 4,
        };

        const ageGroupData = ageGroupItems
          .map((item) => ({
            name: BIRTH_PLACE_NAMES[item.birthPlace] || item.birthPlace,
            value: item.households || 0,
            birthPlace: item.birthPlace,
            sortOrder:
              birthplaceOrder[
                item.birthPlace as keyof typeof birthplaceOrder
              ] || 99,
          }))
          .filter((item) => item.value > 0) // Only show birthplaces with data
          .sort((a, b) => a.sortOrder - b.sortOrder);

        // Skip if no valid data
        if (ageGroupData.length === 0) return null;

        return (
          <div key={ageGroup} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">{ageGroup}</h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल जनसंख्या:{" "}
              {localizeNumber(ageGroupTotal.toLocaleString(), "ne")}
            </p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageGroupData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          BIRTH_PLACE_COLORS[
                            entry.birthPlace as keyof typeof BIRTH_PLACE_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalPopulation={ageGroupTotal} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {ageGroupData.map((item, i) => {
                  const percentage = (item.value / ageGroupTotal) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            BIRTH_PLACE_COLORS[
                              item.birthPlace as keyof typeof BIRTH_PLACE_COLORS
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
                                BIRTH_PLACE_COLORS[
                                  item.birthPlace as keyof typeof BIRTH_PLACE_COLORS
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
