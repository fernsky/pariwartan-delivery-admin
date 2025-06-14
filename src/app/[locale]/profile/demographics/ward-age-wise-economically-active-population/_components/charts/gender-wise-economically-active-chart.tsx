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

interface GenderWiseEconomicallyActiveChartProps {
  economicallyActiveData:
    | Array<{
        id?: string;
        wardNumber: string;
        gender: string;
        age10PlusTotal: number;
        economicallyActiveEmployed: number;
        economicallyActiveUnemployed: number;
        householdWork: number;
        economicallyActiveTotal: number;
        dependentPopulation: number;
      }>
    | null
    | undefined;
}

export default function GenderWiseEconomicallyActiveChart({
  economicallyActiveData,
}: GenderWiseEconomicallyActiveChartProps) {
  // Add null checks and ensure data is a valid array
  if (
    !economicallyActiveData ||
    !Array.isArray(economicallyActiveData) ||
    economicallyActiveData.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">चार्ट डेटा उपलब्ध छैन</p>
      </div>
    );
  }

  // Transform data for the chart - get ward-wise gender data
  const wardNumbers = [1, 2, 3, 4, 5, 6];

  const chartData = wardNumbers.map((wardNum) => {
    const maleData = economicallyActiveData.find(
      (item) =>
        item.wardNumber === wardNum.toString() && item.gender === "पुरुष",
    );
    const femaleData = economicallyActiveData.find(
      (item) =>
        item.wardNumber === wardNum.toString() && item.gender === "महिला",
    );

    return {
      ward: `वडा ${localizeNumber(wardNum.toString(), "ne")}`,
      "पुरुष - रोजगारीमा": maleData?.economicallyActiveEmployed || 0,
      "महिला - रोजगारीमा": femaleData?.economicallyActiveEmployed || 0,
      "पुरुष - बेरोजगार": maleData?.economicallyActiveUnemployed || 0,
      "महिला - बेरोजगार": femaleData?.economicallyActiveUnemployed || 0,
      "पुरुष - घरायसी काम": maleData?.householdWork || 0,
      "महिला - घरायसी काम": femaleData?.householdWork || 0,
    };
  });

  // Custom tooltip component with Nepali display names
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md max-w-xs">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs">{entry.dataKey}: </span>
                <span className="font-medium text-xs">
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
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
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

        {/* Employment bars */}
        <Bar
          dataKey="पुरुष - रोजगारीमा"
          fill="#3B82F6"
          name="पुरुष - रोजगारीमा"
        />
        <Bar
          dataKey="महिला - रोजगारीमा"
          fill="#EC4899"
          name="महिला - रोजगारीमा"
        />

        {/* Unemployment bars */}
        <Bar
          dataKey="पुरुष - बेरोजगार"
          fill="#F59E0B"
          name="पुरुष - बेरोजगार"
        />
        <Bar
          dataKey="महिला - बेरोजगार"
          fill="#F97316"
          name="महिला - बेरोजगार"
        />

        {/* Household work bars */}
        <Bar
          dataKey="पुरुष - घरायसी काम"
          fill="#8B5CF6"
          name="पुरुष - घरायसी काम"
        />
        <Bar
          dataKey="महिला - घरायसी काम"
          fill="#A855F7"
          name="महिला - घरायसी काम"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
