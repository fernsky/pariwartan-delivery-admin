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

interface SlopeBarChartProps {
  slopeData: Array<{
    slope: string;
    क्षेत्रफल: number;
    प्रतिशत: number;
  }>;
  SLOPE_COLORS: Record<string, string>;
}

function getSlopeColorKey(slopeRange: string): string {
  if (slopeRange.includes("०") && slopeRange.includes("५")) return "0-5";
  if (slopeRange.includes("५") && slopeRange.includes("१०")) return "5-10";
  if (slopeRange.includes("१०") && slopeRange.includes("२०")) return "10-20";
  if (slopeRange.includes("२०") && slopeRange.includes("३०")) return "20-30";
  if (slopeRange.includes("३०") && slopeRange.includes("६०")) return "30-60";
  return "0-5";
}

export default function SlopeBarChart({
  slopeData,
  SLOPE_COLORS,
}: SlopeBarChartProps) {
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
                  {entry.dataKey === "क्षेत्रफल"
                    ? `${localizeNumber(entry.value?.toString() || "0", "ne")} वर्ग कि.मि.`
                    : `${localizeNumber(entry.value?.toString() || "0", "ne")}%`}
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
        data={slopeData}
        margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="slope"
          scale="point"
          padding={{ left: 20, right: 20 }}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          yAxisId="area"
          orientation="left"
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis
          yAxisId="percentage"
          orientation="right"
          tickFormatter={(value) =>
            `${localizeNumber(value.toString(), "ne")}%`
          }
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        <Bar
          yAxisId="area"
          dataKey="क्षेत्रफल"
          name="क्षेत्रफल (वर्ग कि.मि.)"
          fill="#3B82F6"
          fillOpacity={0.8}
        />
        <Bar
          yAxisId="percentage"
          dataKey="प्रतिशत"
          name="प्रतिशत (%)"
          fill="#10B981"
          fillOpacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
