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

interface AgeGroupHouseheadPieChartProps {
  ageGroupData: Array<{
    id?: string;
    ageGroup: string;
    maleHeads: number;
    femaleHeads: number;
    totalFamilies: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  totalFamilies: number;
}

// Define colors for different age groups
const AGE_GROUP_COLORS: Record<string, string> = {
  "10-14": "#EF4444", // Red
  "15-19": "#F97316", // Orange
  "20-29": "#F59E0B", // Amber
  "30-39": "#10B981", // Emerald
  "40-49": "#3B82F6", // Blue
  "50-59": "#6366F1", // Indigo
  "60-69": "#8B5CF6", // Violet
  "70 वर्ष माथि": "#EC4899", // Pink
  other: "#64748B", // Slate
};

export default function AgeGroupHouseheadPieChart({
  ageGroupData,
  totalFamilies,
}: AgeGroupHouseheadPieChartProps) {
  // Add null checks
  if (
    !ageGroupData ||
    !Array.isArray(ageGroupData) ||
    ageGroupData.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">चार्ट डेटा उपलब्ध छैन</p>
      </div>
    );
  }

  // Prepare pie chart data
  const pieData = ageGroupData.map((item) => ({
    name: item.ageGroup,
    value: item.totalFamilies,
    percentage: ((item.totalFamilies / totalFamilies) * 100).toFixed(1),
    maleHeads: item.maleHeads,
    femaleHeads: item.femaleHeads,
  }));

  // Helper function to get color for an age group
  const getAgeGroupColor = (ageGroup: string): string => {
    return AGE_GROUP_COLORS[ageGroup] || AGE_GROUP_COLORS.other;
  };

  // Enhanced pie data with colors
  const enhancedPieData = pieData.map((item) => ({
    ...item,
    color: getAgeGroupColor(item.name),
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-4 border shadow-lg rounded-md max-w-xs">
          <p className="font-medium text-base mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-sm">कुल परिवार:</span>
              <span className="font-medium">
                {localizeNumber(data.value.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">पुरुष घरमूली:</span>
              <span className="font-medium">
                {localizeNumber(data.maleHeads.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">महिला घरमूली:</span>
              <span className="font-medium">
                {localizeNumber(data.femaleHeads.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t">
              <span className="text-sm">प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(data.percentage, "ne")}%
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
          data={enhancedPieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {enhancedPieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => value}
          payload={enhancedPieData.map((item) => ({
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
