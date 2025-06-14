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
import { familyMainOccupationLabels } from "@/server/api/routers/profile/demographics/ward-wise-major-occupation.schema";

interface OccupationPieChartProps {
  occupationData: Array<{
    id?: string;
    occupation: string;
    age15_19: number;
    age20_24: number;
    age25_29: number;
    age30_34: number;
    age35_39: number;
    age40_44: number;
    age45_49: number;
    totalPopulation: number;
    percentage: number;
  }>;
}

// Define colors for different occupations
const OCCUPATION_COLORS: Record<string, string> = {
  MILITARY_OFFICERS: "#FF5733", // Red-orange
  MANAGERS: "#FFC300", // Yellow
  PROFESSIONALS: "#36A2EB", // Blue
  TECHNICIANS_AND_ASSOCIATE_PROFESSIONALS: "#4BC0C0", // Cyan
  CLERICAL_SUPPORT_WORKERS: "#9966FF", // Purple
  SERVICE_AND_SALES_WORKERS: "#3CB371", // Green
  SKILLED_AGRICULTURAL_WORKERS: "#FF6384", // Pink
  CRAFT_AND_RELATED_TRADES_WORKERS: "#FFCE56", // Light orange
  PLANT_AND_MACHINE_OPERATORS: "#607D8B", // Grey
  ELEMENTARY_OCCUPATIONS: "#E91E63", // Magenta
  NOT_SPECIFIED: "#8BC34A", // Light green
  ECONOMICALLY_INACTIVE: "#FF9F40", // Orange
};

export default function OccupationPieChart({
  occupationData,
}: OccupationPieChartProps) {
  // Add null checks
  if (
    !occupationData ||
    !Array.isArray(occupationData) ||
    occupationData.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">चार्ट डेटा उपलब्ध छैन</p>
      </div>
    );
  }

  // Prepare pie chart data
  const pieData = occupationData.map((item) => ({
    name: familyMainOccupationLabels[item.occupation] || item.occupation,
    value: item.totalPopulation,
    percentage: item.percentage.toFixed(1),
    occupation: item.occupation,
    age15_19: item.age15_19,
    age20_24: item.age20_24,
    age25_29: item.age25_29,
    age30_34: item.age30_34,
    age35_39: item.age35_39,
    age40_44: item.age40_44,
    age45_49: item.age45_49,
  }));

  // Enhanced pie data with colors
  const enhancedPieData = pieData.map((item) => ({
    ...item,
    color:
      OCCUPATION_COLORS[item.occupation] || OCCUPATION_COLORS.NOT_SPECIFIED,
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
              <span className="text-sm">प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(data.percentage, "ne")}%
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="text-xs text-muted-foreground mb-1">
                उमेर समूह:
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>
                  १५-१९: {localizeNumber(data.age15_19.toString(), "ne")}
                </div>
                <div>
                  २०-२४: {localizeNumber(data.age20_24.toString(), "ne")}
                </div>
                <div>
                  २५-२९: {localizeNumber(data.age25_29.toString(), "ne")}
                </div>
                <div>
                  ३०-३४: {localizeNumber(data.age30_34.toString(), "ne")}
                </div>
                <div>
                  ३५-३९: {localizeNumber(data.age35_39.toString(), "ne")}
                </div>
                <div>
                  ४०-४४: {localizeNumber(data.age40_44.toString(), "ne")}
                </div>
                <div>
                  ४५-४९: {localizeNumber(data.age45_49.toString(), "ne")}
                </div>
              </div>
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
