"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardHouseholdRoofPieChartsProps {
  wardWiseData: Array<Record<string, any>>;
  ROOF_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function WardHouseholdRoofPieCharts({
  wardWiseData,
  ROOF_CATEGORIES,
}: WardHouseholdRoofPieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalHouseholds }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalHouseholds) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>घरधुरी:</span>
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
      {wardWiseData.map((wardData) => {
        const total = wardData.total || 0;
        const roofCategories = Object.values(ROOF_CATEGORIES)
          .map(category => ({
            name: category.name,
            value: wardData[category.name] || 0,
            color: category.color
          }))
          .filter(item => item.value > 0);

        return (
          <div key={wardData.wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              {localizeNumber(wardData.ward, "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल घरधुरी: {localizeNumber(total.toLocaleString(), "ne")}
            </p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roofCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roofCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalHouseholds={total} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2">
                {roofCategories.map((item, i) => {
                  if (item.value === 0) return null;
                  const percentage = total > 0 ? (item.value / total) * 100 : 0;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: item.color,
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name}</span>
                          <span className="ml-2 font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
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
