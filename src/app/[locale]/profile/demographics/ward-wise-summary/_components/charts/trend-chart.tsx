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

interface TrendChartProps {
  demographicData: {
    totalPopulation: number;
    populationMale: number;
    populationFemale: number;
    totalHouseholds: number;
    averageHouseholdSize: number;
    sexRatio: number;
    annualGrowthRate: number;
    literacyRate: number;
    populationDensity: number;
    dataYear: string;
    dataYearEnglish: string;
  };
}

// Color palette for different indicators
const INDICATOR_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
];

export default function TrendChart({ demographicData }: TrendChartProps) {
  // Transform data for the chart showing various demographic indicators
  const indicatorData = [
    {
      indicator: "साक्षरता दर",
      value: demographicData.literacyRate,
      unit: "%",
    },
    {
      indicator: "वृद्धि दर",
      value: demographicData.annualGrowthRate,
      unit: "%",
    },
    {
      indicator: "लैंगिक अनुपात",
      value: demographicData.sexRatio,
      unit: "अनुपात",
    },
    {
      indicator: "परिवार आकार",
      value: demographicData.averageHouseholdSize,
      unit: "व्यक्ति",
    },
    {
      indicator: "जनघनत्व",
      value: demographicData.populationDensity / 10, // Scale down for better visualization
      unit: "प्रति १० वर्ग कि.मी.",
    },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let displayValue = data.value;
      let displayUnit = data.unit;

      // Special handling for population density
      if (data.indicator === "जनघनत्व") {
        displayValue = demographicData.populationDensity;
        displayUnit = "प्रति वर्ग कि.मी.";
      }

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">मान:</span>
            <span className="font-medium">
              {localizeNumber(displayValue.toFixed(2), "ne")} {displayUnit}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={indicatorData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={50}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="indicator"
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toFixed(1), "ne")}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />

        <Bar dataKey="value" name="सूचक मान" radius={[4, 4, 0, 0]}>
          {indicatorData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={INDICATOR_COLORS[index % INDICATOR_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
