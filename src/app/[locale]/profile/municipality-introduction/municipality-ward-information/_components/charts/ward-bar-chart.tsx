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

interface WardBarChartProps {
  wardData: Array<{
    ward: string;
    जनसंख्या: number;
    क्षेत्रफल: number;
    घनत्व: number;
  }>;
  WARD_COLORS: Record<string, string>;
}

export default function WardBarChart({
  wardData,
  WARD_COLORS,
}: WardBarChartProps) {
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
                  {entry.dataKey === "जनसंख्या"
                    ? `${localizeNumber(entry.value?.toString() || "0", "ne")}`
                    : entry.dataKey === "क्षेत्रफल"
                      ? `${localizeNumber(entry.value?.toString() || "0", "ne")} वर्ग कि.मि.`
                      : `${localizeNumber(entry.value?.toString() || "0", "ne")} प्रति वर्ग कि.मि.`}
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
        margin={{ top: 30, right: 10, left: 10, bottom: 60 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 5, right: 5 }}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          yAxisId="population"
          orientation="left"
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis
          yAxisId="area"
          orientation="right"
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        <Bar
          yAxisId="population"
          dataKey="जनसंख्या"
          name="जनसंख्या"
          fill="#3B82F6"
          fillOpacity={0.8}
        />
        <Bar
          yAxisId="area"
          dataKey="क्षेत्रफल"
          name="क्षेत्रफल (वर्ग कि.मि.)"
          fill="#10B981"
          fillOpacity={0.8}
        />
        <Bar
          yAxisId="area"
          dataKey="घनत्व"
          name="जनसंख्या घनत्व"
          fill="#F59E0B"
          fillOpacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
