"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FormalEducationComparisonChartProps {
  wardCurrentAttendancePercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  FORMAL_EDUCATION_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function FormalEducationComparisonChart({
  wardCurrentAttendancePercentages,
  bestAttendanceWard,
  lowestAttendanceWard,
  FORMAL_EDUCATION_GROUPS,
}: FormalEducationComparisonChartProps) {
  // Format data for the chart - compare current attendance rates
  const chartData = wardCurrentAttendancePercentages
    .map((ward) => ({
      name: `वडा ${ward.wardNumber}`,
      "Current Attendance": ward.percentage,
    }))
    .sort((a, b) => b["Current Attendance"] - a["Current Attendance"]);

  // Calculate average current attendance rate
  const avgCurrentAttendanceRate =
    wardCurrentAttendancePercentages.reduce(
      (sum, ward) => sum + ward.percentage,
      0,
    ) / wardCurrentAttendancePercentages.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "Current Attendance") {
                displayName = "हाल अध्ययन दर";
              }

              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
                    {localizeNumber(entry.value.toFixed(2), "ne")}%
                  </span>
                </div>
              );
            })}
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${localizeNumber(value, "ne")}`}
        />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[
            0,
            Math.max(Math.ceil(bestAttendanceWard?.percentage || 80), 80),
          ]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            if (value === "Current Attendance") {
              return "हाल अध्ययन दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="Current Attendance"
          fill={FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgCurrentAttendanceRate}
          stroke={FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.color}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgCurrentAttendanceRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.color,
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
