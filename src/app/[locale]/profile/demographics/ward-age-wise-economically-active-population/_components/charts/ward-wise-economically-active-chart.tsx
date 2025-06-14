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

interface WardWiseEconomicallyActiveChartProps {
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

export default function WardWiseEconomicallyActiveChart({
  economicallyActiveData,
}: WardWiseEconomicallyActiveChartProps) {
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

  // Transform data for the chart - get ward totals only
  const wardData = economicallyActiveData
    .filter((item) => item.wardNumber !== "जम्मा" && item.gender === "जम्मा")
    .map((item) => ({
      ward: `वडा ${localizeNumber(item.wardNumber, "ne")}`,
      रोजगारीमा: item.economicallyActiveEmployed || 0,
      बेरोजगार: item.economicallyActiveUnemployed || 0,
      "घरायसी काम": item.householdWork || 0,
      "आर्थिक रूपमा सक्रिय": item.economicallyActiveTotal || 0,
    }))
    .sort(
      (a, b) =>
        parseInt(a.ward.replace("वडा ", "")) -
        parseInt(b.ward.replace("वडा ", "")),
    );

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
        data={wardData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={60}
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

        <Bar dataKey="रोजगारीमा" fill="#10B981" name="रोजगारीमा" />
        <Bar dataKey="बेरोजगार" fill="#F59E0B" name="बेरोजगार" />
        <Bar dataKey="घरायसी काम" fill="#8B5CF6" name="घरायसी काम" />
      </BarChart>
    </ResponsiveContainer>
  );
}
