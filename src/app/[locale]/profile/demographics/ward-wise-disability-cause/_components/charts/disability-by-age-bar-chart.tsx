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

interface DisabilityByAgeBarChartProps {
  disabilityData: Array<{
    id?: string;
    ageGroup: string;
    physicalDisability: number;
    visualImpairment: number;
    hearingImpairment: number;
    deafMute: number;
    speechHearingCombined: number;
    intellectualDisability: number;
    mentalPsychosocial: number;
    autism: number;
    multipleDisabilities: number;
    otherDisabilities: number;
    total: number;
  }>;
}

export default function DisabilityByAgeBarChart({
  disabilityData,
}: DisabilityByAgeBarChartProps) {
  // Transform data for the chart
  const chartData = disabilityData.map((item) => ({
    ageGroup: item.ageGroup,
    "शारीरिक अपाङ्गता": item.physicalDisability || 0,
    "दृष्टि अपाङ्गता": item.visualImpairment || 0,
    "श्रवण अपाङ्गता": item.hearingImpairment || 0,
    "बोली-श्रवण अपाङ्गता": item.speechHearingCombined || 0,
    "बौद्धिक अपाङ्गता": item.intellectualDisability || 0,
    "मानसिक-मनोसामाजिक अपाङ्गता": item.mentalPsychosocial || 0,
  }));

  // Custom tooltip component with Nepali display names
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md max-w-sm">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm">{entry.dataKey}: </span>
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
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        barSize={15}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ageGroup"
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

        <Bar dataKey="शारीरिक अपाङ्गता" stackId="a" fill="#DC2626" />
        <Bar dataKey="दृष्टि अपाङ्गता" stackId="a" fill="#2563EB" />
        <Bar dataKey="श्रवण अपाङ्गता" stackId="a" fill="#16A34A" />
        <Bar dataKey="बोली-श्रवण अपाङ्गता" stackId="a" fill="#CA8A04" />
        <Bar dataKey="बौद्धिक अपाङ्गता" stackId="a" fill="#7C3AED" />
        <Bar dataKey="मानसिक-मनोसामाजिक अपाङ्गता" stackId="a" fill="#DC2626" />
      </BarChart>
    </ResponsiveContainer>
  );
}
