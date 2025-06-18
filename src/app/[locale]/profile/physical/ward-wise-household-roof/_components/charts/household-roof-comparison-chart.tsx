"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseholdRoofComparisonChartProps {
  wardWiseModernRoofing: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  worstRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  ROOF_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function HouseholdRoofComparisonChart({
  wardWiseModernRoofing,
  bestRoofingWard,
  worstRoofingWard,
  ROOF_CATEGORIES,
}: HouseholdRoofComparisonChartProps) {
  // Format data for the chart - compare modern roofing (cement + tile) rates
  const chartData = wardWiseModernRoofing.map((ward) => ({
    name: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    "ModernRoofing": ward.percentage,
  })).sort((a, b) => 
    b["ModernRoofing"] - a["ModernRoofing"]
  );

  // Calculate average modern roofing rate
  const avgModernRoofingRate =
    wardWiseModernRoofing.reduce((sum, ward) => sum + ward.percentage, 0) / wardWiseModernRoofing.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "ModernRoofing") {
                displayName = "आधुनिक छाना (सिमेन्ट + टायल)";
              }
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
                    {localizeNumber(entry.value.toFixed(2), "ne")}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[0, Math.max(Math.ceil(bestRoofingWard?.percentage || 100), 100)]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend 
          formatter={(value) => {
            if (value === "ModernRoofing") {
              return "आधुनिक छाना (सिमेन्ट + टायल)";
            }
            return value;
          }}
        />
        <Bar
          dataKey="ModernRoofing"
          fill="#4285F4"
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgModernRoofingRate}
          stroke="#4285F4"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgModernRoofingRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: "#4285F4", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
