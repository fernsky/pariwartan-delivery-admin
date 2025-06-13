"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Modern aesthetic color palette for religions
const RELIGION_COLOR_PALETTE = [
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#84CC16", // Lime
  "#9333EA", // Fuchsia
  "#14B8A6", // Teal
  "#EF4444", // Red
];

interface ReligionBarChartProps {
  religionData: Array<{
    religion: string;
    पुरुष: number;
    महिला: number;
    जम्मा: number;
  }>;
  RELIGION_COLORS: Record<string, string>;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionBarChart({
  religionData,
  RELIGION_COLORS,
  RELIGION_NAMES,
}: ReligionBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.dataKey}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={religionData}
        margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
        barSize={30}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="religion"
          scale="point"
          padding={{ left: 70, right: 5 }}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Bars for Male, Female, and Total */}
        <Bar dataKey="पुरुष" name="पुरुष" fill="#3B82F6" fillOpacity={0.8} />
        <Bar dataKey="महिला" name="महिला" fill="#EC4899" fillOpacity={0.8} />
        <Bar dataKey="जम्मा" name="जम्मा" fill="#10B981" fillOpacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
