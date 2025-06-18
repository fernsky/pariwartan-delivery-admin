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

interface WardPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  WARD_COLORS: Record<string, string>;
  dataKey: "population" | "area";
}

// Define a fallback color array for better distribution
const FALLBACK_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
  "#EC4899", // Pink
];

function getWardColorKey(wardName: string): string {
  const wardNumber = wardName.match(/\d+/)?.[0];
  return wardNumber || "1";
}

export default function WardPieChart({
  pieChartData,
  WARD_COLORS,
  dataKey,
}: WardPieChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">
              {dataKey === "population" ? "जनसंख्या:" : "क्षेत्रफल:"}
            </span>
            <span className="font-medium">
              {localizeNumber(value.toString(), "ne")}{" "}
              {dataKey === "area" ? "वर्ग कि.मि." : ""}
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
            const colorKey = getWardColorKey(entry.name);
            const color =
              WARD_COLORS[colorKey] ||
              FALLBACK_COLORS[index % FALLBACK_COLORS.length];
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend formatter={(value) => value} />
      </PieChart>
    </ResponsiveContainer>
  );
}
