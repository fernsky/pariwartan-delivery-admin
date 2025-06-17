"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatNepaliNumber } from "@/lib/utils/nepali-numbers";

interface AgricultureFirmCountBarChartProps {
  wardWiseData: Array<{
    ward: string;
    wardNumber: number;
    count: number;
  }>;
}

export default function AgricultureFirmCountBarChart({
  wardWiseData,
}: AgricultureFirmCountBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        barSize={30}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => formatNepaliNumber(value)}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-2 border shadow-sm rounded-md text-sm">
                  <p className="font-medium">{payload[0].payload.ward}</p>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2"
                        style={{ backgroundColor: payload[0].color }}
                      ></div>
                      <span>कृषि फर्म: </span>
                      <span className="font-medium">
                        {formatNepaliNumber(payload[0].value as number)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="count" fill="#4ECDC4" />
      </BarChart>
    </ResponsiveContainer>
  );
}
