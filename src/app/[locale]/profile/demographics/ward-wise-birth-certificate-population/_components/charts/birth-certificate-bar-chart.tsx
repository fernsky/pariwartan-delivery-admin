"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateBarChartProps {
  barChartData: Array<{
    ward: string;
    withCertificate: number;
    withoutCertificate: number;
    total: number;
    coverageRate: string;
  }>;
  CHART_COLORS: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
}

export default function BirthCertificateBarChart({
  barChartData,
  CHART_COLORS,
}: BirthCertificateBarChartProps) {
  // Add null checks and ensure barChartData is a valid array
  if (
    !barChartData ||
    !Array.isArray(barChartData) ||
    barChartData.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">चार्ट डेटा उपलब्ध छैन</p>
      </div>
    );
  }

  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Get the data from the payload - the data structure includes all ward info
      const data = payload[0]?.payload;

      if (data) {
        const withCertificate = data.withCertificate || 0;
        const withoutCertificate = data.withoutCertificate || 0;
        const total = data.total || withCertificate + withoutCertificate;
        const coverageRate =
          data.coverageRate ||
          (total > 0 ? ((withCertificate / total) * 100).toFixed(2) : "0");

        return (
          <div className="bg-background p-3 border shadow-sm rounded-md">
            <p className="font-medium">{localizeNumber(label, "ne")}</p>
            <div className="flex justify-between gap-4 mt-1">
              <span className="text-sm">जन्मदर्ता भएका:</span>
              <span className="font-medium">
                {localizeNumber(withCertificate.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">जन्मदर्ता नभेका:</span>
              <span className="font-medium">
                {localizeNumber(withoutCertificate.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">जम्मा जनसंख्या:</span>
              <span className="font-medium">
                {localizeNumber(total.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">कभरेज दर:</span>
              <span className="font-medium">
                {localizeNumber(coverageRate.toString(), "ne")}%
              </span>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={barChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={40}
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
          label={{
            value: "संख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => {
            if (value === "withCertificate") return "जन्मदर्ता भएका";
            if (value === "withoutCertificate") return "जन्मदर्ता नभेका";
            return value;
          }}
        />
        <Bar
          dataKey="withCertificate"
          name="withCertificate"
          stackId="a"
          fill={CHART_COLORS.primary}
        />
        <Bar
          dataKey="withoutCertificate"
          name="withoutCertificate"
          stackId="a"
          fill={CHART_COLORS.secondary}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
