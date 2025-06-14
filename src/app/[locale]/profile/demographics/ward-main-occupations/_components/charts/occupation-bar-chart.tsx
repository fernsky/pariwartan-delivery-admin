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
import { familyMainOccupationLabels } from "@/server/api/routers/profile/demographics/ward-wise-major-occupation.schema";

interface OccupationBarChartProps {
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

export default function OccupationBarChart({
  occupationData,
}: OccupationBarChartProps) {
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

  // Transform data for the chart - showing only top occupations for readability
  const chartData = occupationData
    .sort((a, b) => b.totalPopulation - a.totalPopulation)
    .slice(0, 8) // Show top 8 occupations
    .map((item) => ({
      occupation:
        familyMainOccupationLabels[item.occupation] || item.occupation,
      shortName: (
        familyMainOccupationLabels[item.occupation] || item.occupation
      ).split(" ")[0], // First word for shorter display
      totalPopulation: item.totalPopulation,
      percentage: item.percentage,
    }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.occupation}</p>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm">जनसंख्या:</span>
              <span className="font-medium">
                {localizeNumber(data.totalPopulation.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(data.percentage.toFixed(2), "ne")}%
              </span>
            </div>
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
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="shortName"
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
        <Bar
          dataKey="totalPopulation"
          name="जनसंख्या"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
