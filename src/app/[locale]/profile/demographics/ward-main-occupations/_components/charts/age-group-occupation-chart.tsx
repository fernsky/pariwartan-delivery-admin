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

interface AgeGroupOccupationChartProps {
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

export default function AgeGroupOccupationChart({
  occupationData,
}: AgeGroupOccupationChartProps) {
  // Transform data for the chart
  const chartData = occupationData.map((item) => ({
    occupation: familyMainOccupationLabels[item.occupation] || item.occupation,
    "१५-१९": item.age15_19,
    "२०-२४": item.age20_24,
    "२५-२९": item.age25_29,
    "३०-३४": item.age30_34,
    "३५-३९": item.age35_39,
    "४०-४४": item.age40_44,
    "४५-४९": item.age45_49,
  }));

  // Custom tooltip component
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

  // Age group colors
  const ageGroupColors = {
    "१५-१९": "#FF6B6B",
    "२०-२४": "#4ECDC4",
    "२५-२९": "#45B7D1",
    "३०-३४": "#96CEB4",
    "३५-३९": "#FFEAA7",
    "४०-४४": "#DDA0DD",
    "४५-४९": "#98D8C8",
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="occupation"
          angle={-45}
          textAnchor="end"
          height={120}
          interval={0}
          tick={{ fontSize: 10 }}
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

        {Object.entries(ageGroupColors).map(([ageGroup, color]) => (
          <Bar key={ageGroup} dataKey={ageGroup} fill={color} name={ageGroup} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
