"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SlopePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  SLOPE_COLORS: Record<string, string>;
}

function getSlopeColorKey(slopeRange: string): string {
  if (slopeRange.includes("०") && slopeRange.includes("५")) return "0-5";
  if (slopeRange.includes("५") && slopeRange.includes("१०")) return "5-10";
  if (slopeRange.includes("१०") && slopeRange.includes("२०")) return "10-20";
  if (slopeRange.includes("२०") && slopeRange.includes("३०")) return "20-30";
  if (slopeRange.includes("३०") && slopeRange.includes("६०")) return "30-60";
  return "0-5";
}

export default function SlopePieChart({
  pieChartData,
  SLOPE_COLORS,
}: SlopePieChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">क्षेत्रफल:</span>
            <span className="font-medium">
              {localizeNumber(value.toString(), "ne")} वर्ग कि.मि.
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            const colorKey = getSlopeColorKey(entry.name);
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  SLOPE_COLORS[colorKey as keyof typeof SLOPE_COLORS] ||
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend formatter={(value) => value} />
      </PieChart>
    </ResponsiveContainer>
  );
}
