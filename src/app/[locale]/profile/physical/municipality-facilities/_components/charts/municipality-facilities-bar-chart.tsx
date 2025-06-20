"use client";

import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MunicipalityFacilitiesBarChartProps {
  facilitiesData: Array<{
    id: string;
    facility: string;
    population: number;
    createdAt: Date | null;
    updatedAt: Date | null;
  }>;
  FACILITY_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function MunicipalityFacilitiesBarChart({
  facilitiesData,
  FACILITY_CATEGORIES,
}: MunicipalityFacilitiesBarChartProps) {
  // Transform data for chart
  const chartData = facilitiesData
    .map((item) => {
      const category = FACILITY_CATEGORIES[item.facility];
      return {
        name: category?.name || item.facility,
        nameEn: category?.nameEn || item.facility,
        population: item.population,
        color: category?.color || "#8884d8",
        facility: item.facility,
      };
    })
    .sort((a, b) => b.population - a.population);

  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span>जनसংख्या:</span>
            <span className="font-medium">
              {localizeNumber(data.population.toLocaleString(), "ne")}
            </span>
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
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 11 }}
        />
        <YAxis 
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{
            value: "जनसंख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Bar 
          dataKey="population" 
          radius={[4, 4, 0, 0]}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
