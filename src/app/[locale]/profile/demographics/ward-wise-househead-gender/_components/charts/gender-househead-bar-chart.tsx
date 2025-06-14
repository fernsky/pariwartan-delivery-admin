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
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface GenderHouseheadBarChartProps {
  ageGroupData:
    | Array<{
        id?: string;
        ageGroup: string;
        maleHeads: number;
        femaleHeads: number;
        totalFamilies: number;
        updatedAt?: Date;
        createdAt?: Date;
      }>
    | null
    | undefined;
}

export default function GenderHouseheadBarChart({
  ageGroupData,
}: GenderHouseheadBarChartProps) {
  // Add null checks and ensure ageGroupData is a valid array
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

  // Transform data for the chart
  const chartData = ageGroupData.map((item) => ({
    ageGroup: item.ageGroup,
    "पुरुष घरमूली": item.maleHeads || 0,
    "महिला घरमूली": item.femaleHeads || 0,
    "कुल परिवार": item.totalFamilies || 0,
  }));

  // Custom tooltip component with Nepali display names
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
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        barSize={30}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ageGroup"
          angle={-45}
          textAnchor="end"
          height={120}
          interval={0}
          tick={{ fontSize: 12 }}
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

        <Bar dataKey="पुरुष घरमूली" fill="#3B82F6" name="पुरुष घरमूली" />
        <Bar dataKey="महिला घरमूली" fill="#EC4899" name="महिला घरमूली" />
      </BarChart>
    </ResponsiveContainer>
  );
}
