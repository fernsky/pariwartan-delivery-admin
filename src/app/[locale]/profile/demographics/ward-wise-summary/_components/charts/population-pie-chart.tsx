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

interface PopulationPieChartProps {
  totalMale: number;
  totalFemale: number;
  totalOther?: number;
}

export default function PopulationPieChart({
  totalMale,
  totalFemale,
  totalOther = 0,
}: PopulationPieChartProps) {
  const total = totalMale + totalFemale + totalOther;

  const pieData = [
    {
      name: "पुरुष",
      value: totalMale,
      percentage: ((totalMale / total) * 100).toFixed(1),
      color: "#3B82F6",
    },
    {
      name: "महिला",
      value: totalFemale,
      percentage: ((totalFemale / total) * 100).toFixed(1),
      color: "#EC4899",
    },
  ];

  // Add other category if it exists and has value
  if (totalOther && totalOther > 0) {
    pieData.push({
      name: "अन्य",
      value: totalOther,
      percentage: ((totalOther / total) * 100).toFixed(1),
      color: "#10B981",
    });
  }

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
