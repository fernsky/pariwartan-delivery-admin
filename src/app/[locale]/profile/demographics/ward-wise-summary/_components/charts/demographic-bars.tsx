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

interface DemographicBarsProps {
  demographicData: {
    totalPopulation: number;
    populationMale: number;
    populationFemale: number;
    populationOther?: number;
    population0To14?: number;
    population15To59?: number;
    population60AndAbove?: number;
    totalHouseholds: number;
    averageHouseholdSize: number;
    sexRatio: number;
    annualGrowthRate: number;
    literacyRate: number;
    populationDensity: number;
    dataYear: string;
    dataYearEnglish: string;
  };
}

export default function DemographicBars({
  demographicData,
}: DemographicBarsProps) {
  // Transform data for the chart - create multiple categories for better visualization
  const chartData = [
    {
      category: "जनसंख्या",
      पुरुष: demographicData.populationMale,
      महिला: demographicData.populationFemale,
      अन्य: demographicData.populationOther || 0,
    },
  ];

  // Add age group data if available
  if (
    demographicData.population0To14 ||
    demographicData.population15To59 ||
    demographicData.population60AndAbove
  ) {
    chartData.push({
      category: "उमेर समूह",
      "०-१४ वर्ष": demographicData.population0To14 || 0,
      "१५-५९ वर्ष": demographicData.population15To59 || 0,
      "६०+ वर्ष": demographicData.population60AndAbove || 0,
    });
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm">{entry.dataKey}:</span>
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
        barSize={60}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="category"
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

        {/* Gender bars */}
        <Bar dataKey="पुरुष" fill="#3B82F6" name="पुरुष" />
        <Bar dataKey="महिला" fill="#EC4899" name="महिला" />
        {demographicData.populationOther && (
          <Bar dataKey="अन्य" fill="#10B981" name="अन्य" />
        )}

        {/* Age group bars */}
        <Bar dataKey="०-१४ वर्ष" fill="#F59E0B" name="०-१४ वर्ष" />
        <Bar dataKey="१५-५९ वर्ष" fill="#8B5CF6" name="१५-५९ वर्ष" />
        <Bar dataKey="६०+ वर्ष" fill="#EF4444" name="६०+ वर्ष" />
      </BarChart>
    </ResponsiveContainer>
  );
}
