"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  formatNepaliNumber,
  formatNepaliPercentage,
} from "@/lib/utils/nepali-numbers";

interface AgricultureFirmCountPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

export default function AgricultureFirmCountPieChart({
  pieChartData,
}: AgricultureFirmCountPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) =>
            `${name}: ${formatNepaliPercentage(parseFloat(percentage))}`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            formatNepaliNumber(Number(value)),
            "कृषि फर्म",
          ]}
          labelFormatter={(label) => label}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
