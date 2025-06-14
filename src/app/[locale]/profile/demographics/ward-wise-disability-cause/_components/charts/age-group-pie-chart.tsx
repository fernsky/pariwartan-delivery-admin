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

interface AgeGroupPieChartProps {
  disabilityData: Array<{
    id?: string;
    ageGroup: string;
    physicalDisability: number;
    visualImpairment: number;
    hearingImpairment: number;
    deafMute: number;
    speechHearingCombined: number;
    intellectualDisability: number;
    mentalPsychosocial: number;
    autism: number;
    multipleDisabilities: number;
    otherDisabilities: number;
    total: number;
  }>;
}

// Generate colors for age groups
const AGE_GROUP_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
  "#8B5A87",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DC2626",
];

export default function AgeGroupPieChart({
  disabilityData,
}: AgeGroupPieChartProps) {
  // Calculate total for percentage calculations
  const totalDisabled = disabilityData.reduce(
    (sum, item) => sum + (item.total || 0),
    0,
  );

  // Prepare pie chart data
  const pieData = disabilityData
    .map((item, index) => ({
      name: item.ageGroup,
      value: item.total,
      percentage: ((item.total / totalDisabled) * 100).toFixed(1),
      color: AGE_GROUP_COLORS[index % AGE_GROUP_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value); // Sort by value descending

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-4 border shadow-lg rounded-md max-w-xs">
          <p className="font-medium text-base mb-2">{name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-sm">कुल अपाङ्गता:</span>
              <span className="font-medium">
                {localizeNumber(value.toLocaleString(), "ne")} व्यक्ति
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t">
              <span className="text-sm">प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(percentage, "ne")}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderCustomLabel = ({ name, percentage }: any) => {
    const numPercentage = parseFloat(percentage);
    // Only show labels for slices larger than 3%
    if (numPercentage > 3) {
      return `${localizeNumber(percentage, "ne")}%`;
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
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
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
          wrapperStyle={{ paddingTop: "20px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
