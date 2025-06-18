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

interface AspectBarChartProps {
  aspectData: Array<{
    direction: string;
    क्षेत्रफल: number;
    प्रतिशत: number;
  }>;
  ASPECT_COLORS: Record<string, string>;
}

export default function AspectBarChart({
  aspectData,
  ASPECT_COLORS,
}: AspectBarChartProps) {
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
        data={aspectData}
        margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="direction"
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
