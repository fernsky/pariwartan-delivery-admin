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

interface EconomicallyActiveEmploymentChartProps {
  totalEmployed: number;
  totalUnemployed: number;
  totalEconomicallyActive: number;
}

export default function EconomicallyActiveEmploymentChart({
  totalEmployed,
  totalUnemployed,
  totalEconomicallyActive,
}: EconomicallyActiveEmploymentChartProps) {
  const pieData = [
    {
      name: "रोजगारीमा",
      value: totalEmployed,
      percentage: ((totalEmployed / totalEconomicallyActive) * 100).toFixed(1),
      color: "#10B981",
    },
    {
      name: "बेरोजगार",
      value: totalUnemployed,
      percentage: ((totalUnemployed / totalEconomicallyActive) * 100).toFixed(
        1,
      ),
      color: "#F59E0B",
    },
  ];

  // Custom tooltip component
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
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percentage }) =>
            `${name}: ${localizeNumber(percentage, "ne")}%`
          }
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => value}
          payload={pieData.map((item) => ({
            value: item.name,
            type: "circle",
            color: item.color,
          }))}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
