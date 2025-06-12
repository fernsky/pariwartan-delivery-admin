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

interface DisabilityCausePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
  DISABILITY_CAUSE_COLORS: Record<string, string>;
}

export default function DisabilityCausePieChart({
  pieChartData,
  DISABILITY_CAUSE_NAMES,
  DISABILITY_CAUSE_COLORS,
}: DisabilityCausePieChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
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
            // Find the original disability cause key for color mapping
            const disabilityCauseKey =
              Object.keys(DISABILITY_CAUSE_NAMES).find(
                (key) => DISABILITY_CAUSE_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  DISABILITY_CAUSE_COLORS[
                    disabilityCauseKey as keyof typeof DISABILITY_CAUSE_COLORS
                  ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
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
