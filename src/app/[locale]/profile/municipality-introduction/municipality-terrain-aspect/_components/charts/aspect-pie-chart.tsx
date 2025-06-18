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

interface AspectPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  ASPECT_COLORS: Record<string, string>;
}

function getAspectColorKey(direction: string): string {
  if (direction.includes("समथर")) return "flat";
  if (
    direction.includes("उत्तरी") &&
    !direction.includes("पूर्वी") &&
    !direction.includes("पश्चिम")
  )
    return "north";
  if (direction.includes("उत्तर-पूर्वी")) return "northeast";
  if (
    direction.includes("पूर्वी") &&
    !direction.includes("उत्तर") &&
    !direction.includes("दक्षिण")
  )
    return "east";
  if (direction.includes("दक्षिण-पूर्वी")) return "southeast";
  if (
    direction.includes("दक्षिणी") &&
    !direction.includes("पूर्वी") &&
    !direction.includes("पश्चिम")
  )
    return "south";
  if (direction.includes("दक्षिण-पश्चिम")) return "southwest";
  if (
    direction.includes("पश्चिमी") &&
    !direction.includes("उत्तर") &&
    !direction.includes("दक्षिण")
  )
    return "west";
  if (direction.includes("उत्तर-पश्चिम")) return "northwest";
  return "flat";
}

export default function AspectPieChart({
  pieChartData,
  ASPECT_COLORS,
}: AspectPieChartProps) {
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
            const colorKey = getAspectColorKey(entry.name);
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  ASPECT_COLORS[colorKey as keyof typeof ASPECT_COLORS] ||
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
