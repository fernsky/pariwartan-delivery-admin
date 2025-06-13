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

interface CastePopulationPieChartProps {
  casteData: Array<{
    id?: string;
    casteType: string;
    casteTypeDisplay?: string;
    malePopulation: number;
    femalePopulation: number;
    totalPopulation: number;
  }>;
  totalPopulation: number;
}

// Define colors for different castes
const CASTE_COLORS: Record<string, string> = {
  chhetri: "#3B82F6", // Blue
  magar: "#10B981", // Emerald
  brahmin_hill: "#6366F1", // Indigo
  bishwakarma: "#F59E0B", // Amber
  pariyar: "#EF4444", // Red
  newar: "#84CC16", // Lime
  thakuri: "#EC4899", // Pink
  sanyasi_dasnami: "#8B5CF6", // Purple
  mallaha: "#06B6D4", // Cyan
  hajam_thakur: "#F97316", // Orange
  badi: "#A855F7", // Violet
  other: "#64748B", // Slate
};

export default function CastePopulationPieChart({
  casteData,
  totalPopulation,
}: CastePopulationPieChartProps) {
  // Add null checks
  if (!casteData || !Array.isArray(casteData) || casteData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">चार्ट डेटा उपलब्ध छैन</p>
      </div>
    );
  }

  // Prepare pie chart data
  const pieData = casteData.map((item) => ({
    name: item.casteTypeDisplay || item.casteType,
    value: item.totalPopulation,
    percentage: ((item.totalPopulation / totalPopulation) * 100).toFixed(1),
    casteType: item.casteType,
    malePopulation: item.malePopulation,
    femalePopulation: item.femalePopulation,
  }));

  // Helper function to get color for a caste
  const getCasteColor = (casteType: string): string => {
    return CASTE_COLORS[casteType] || CASTE_COLORS.other;
  };

  // Enhanced pie data with colors
  const enhancedPieData = pieData.map((item) => ({
    ...item,
    color: getCasteColor(item.casteType),
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
              <span className="text-sm">कुल जनसंख्या:</span>
              <span className="font-medium">
                {localizeNumber(data.value.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">पुरुष:</span>
              <span className="font-medium">
                {localizeNumber(data.malePopulation.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">महिला:</span>
              <span className="font-medium">
                {localizeNumber(data.femalePopulation.toLocaleString(), "ne")}
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
