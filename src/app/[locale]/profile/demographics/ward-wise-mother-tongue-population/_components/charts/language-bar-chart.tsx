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

// Modern aesthetic color palette for languages
const LANGUAGE_COLOR_PALETTE = [
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

interface LanguageBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  LANGUAGE_COLORS: Record<string, string>;
  LANGUAGE_NAMES: Record<string, string>;
}

export default function LanguageBarChart({
  wardWiseData,
  LANGUAGE_COLORS,
  LANGUAGE_NAMES,
}: LanguageBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
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
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
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
        {/* Dynamically generate bars based on available languages in wardWiseData */}
        {Object.keys(
          wardWiseData.reduce(
            (acc, ward) => {
              Object.keys(ward).forEach((key) => {
                if (key !== "ward") acc[key] = true;
              });
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        ).map((language, index) => {
          // Find the language key for color mapping
          const languageKey =
            Object.keys(LANGUAGE_NAMES).find(
              (key) => LANGUAGE_NAMES[key] === language,
            ) || "OTHER";

          return (
            <Bar
              key={language}
              dataKey={language}
              stackId="a"
              name={language}
              fill={
                LANGUAGE_COLORS[languageKey as keyof typeof LANGUAGE_COLORS] ||
                LANGUAGE_COLOR_PALETTE[index % LANGUAGE_COLOR_PALETTE.length]
              }
            >
              {wardWiseData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fill={
                    LANGUAGE_COLORS[
                      languageKey as keyof typeof LANGUAGE_COLORS
                    ] ||
                    LANGUAGE_COLOR_PALETTE[
                      index % LANGUAGE_COLOR_PALETTE.length
                    ]
                  }
                  fillOpacity={
                    0.8 + (0.2 * index) / Object.keys(LANGUAGE_NAMES).length
                  }
                />
              ))}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
