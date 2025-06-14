"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DisabilityTypePieChartProps {
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

const DISABILITY_TYPE_COLORS = {
  "शारीरिक अपाङ्गता": "#DC2626",
  "दृष्टि अपाङ्गता": "#2563EB",
  "श्रवण अपाङ्गता": "#16A34A",
  "बोली-श्रवण अपाङ्गता": "#CA8A04",
  "बौद्धिक अपाङ्गता": "#7C3AED",
  "मानसिक-मनोसामाजिक अपाङ्गता": "#DC2626",
  अटिज्म: "#EA580C",
  "बहुविध अपाङ्गता": "#0891B2",
  "अन्य अपाङ्गता": "#6B7280",
};

export default function DisabilityTypePieChart({
  disabilityData,
}: DisabilityTypePieChartProps) {
  // Calculate totals for each disability type
  const totalPhysical = disabilityData.reduce(
    (sum, item) => sum + (item.physicalDisability || 0),
    0,
  );
  const totalVisual = disabilityData.reduce(
    (sum, item) => sum + (item.visualImpairment || 0),
    0,
  );
  const totalHearing = disabilityData.reduce(
    (sum, item) => sum + (item.hearingImpairment || 0),
    0,
  );
  const totalDeafMute = disabilityData.reduce(
    (sum, item) => sum + (item.deafMute || 0),
    0,
  );
  const totalSpeechHearing = disabilityData.reduce(
    (sum, item) => sum + (item.speechHearingCombined || 0),
    0,
  );
  const totalIntellectual = disabilityData.reduce(
    (sum, item) => sum + (item.intellectualDisability || 0),
    0,
  );
  const totalMentalPsychosocial = disabilityData.reduce(
    (sum, item) => sum + (item.mentalPsychosocial || 0),
    0,
  );
  const totalAutism = disabilityData.reduce(
    (sum, item) => sum + (item.autism || 0),
    0,
  );
  const totalMultiple = disabilityData.reduce(
    (sum, item) => sum + (item.multipleDisabilities || 0),
    0,
  );
  const totalOther = disabilityData.reduce(
    (sum, item) => sum + (item.otherDisabilities || 0),
    0,
  );

  const totalAll =
    totalPhysical +
    totalVisual +
    totalHearing +
    totalDeafMute +
    totalSpeechHearing +
    totalIntellectual +
    totalMentalPsychosocial +
    totalAutism +
    totalMultiple +
    totalOther;

  // Prepare pie chart data
  const pieData = [
    {
      name: "शारीरिक अपाङ्गता",
      value: totalPhysical,
      percentage: ((totalPhysical / totalAll) * 100).toFixed(1),
    },
    {
      name: "दृष्टि अपाङ्गता",
      value: totalVisual,
      percentage: ((totalVisual / totalAll) * 100).toFixed(1),
    },
    {
      name: "श्रवण अपाङ्गता",
      value: totalHearing,
      percentage: ((totalHearing / totalAll) * 100).toFixed(1),
    },
    {
      name: "बोली-श्रवण अपाङ्गता",
      value: totalSpeechHearing,
      percentage: ((totalSpeechHearing / totalAll) * 100).toFixed(1),
    },
    {
      name: "बौद्धिक अपाङ्गता",
      value: totalIntellectual,
      percentage: ((totalIntellectual / totalAll) * 100).toFixed(1),
    },
    {
      name: "मानसिक-मनोसामाजिक अपाङ्गता",
      value: totalMentalPsychosocial,
      percentage: ((totalMentalPsychosocial / totalAll) * 100).toFixed(1),
    },
  ].filter((item) => item.value > 0); // Only show items with values > 0

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderCustomLabel = ({ name, percentage }: any) => {
    const numPercentage = parseFloat(percentage);
    // Only show labels for slices larger than 5%
    if (numPercentage > 5) {
      return `${localizeNumber(percentage, "ne")}%`;
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                DISABILITY_TYPE_COLORS[
                  entry.name as keyof typeof DISABILITY_TYPE_COLORS
                ] || "#6B7280"
              }
            />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => value}
          payload={pieData.map((item) => ({
            value: item.name,
            type: "circle",
            color:
              DISABILITY_TYPE_COLORS[
                item.name as keyof typeof DISABILITY_TYPE_COLORS
              ] || "#6B7280",
          }))}
          wrapperStyle={{ paddingTop: "20px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
