"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  formatNepaliNumber,
  formatNepaliPercentage,
} from "@/lib/utils/nepali-numbers";

interface WardAgricultureFirmPieChartsProps {
  wardNumbers: number[];
  agricultureFirmData: Array<{
    id?: string;
    wardNumber: number;
    count: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

export default function WardAgricultureFirmPieCharts({
  wardNumbers,
  agricultureFirmData,
}: WardAgricultureFirmPieChartsProps) {
  // Calculate total for percentage calculation
  const totalFirms = agricultureFirmData.reduce(
    (sum, item) => sum + (item.count || 0),
    0,
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {wardNumbers.map((wardNumber) => {
        const wardItem = agricultureFirmData.find(
          (item) => item.wardNumber === wardNumber,
        );

        const wardData = wardItem
          ? [
              {
                name: `वडा ${wardNumber}`,
                value: wardItem.count || 0,
              },
            ]
          : [];

        return (
          <div
            key={wardNumber}
            className="h-[200px] bg-muted/30 rounded-lg p-2"
          >
            <h3 className="text-sm font-medium mb-1 text-center">
              वडा {formatNepaliNumber(wardNumber)}
            </h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={wardData}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={45}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {wardData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[wardNumber % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${formatNepaliNumber(Number(value))} फर्म`,
                    "कृषि फर्म संख्या",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-xs">
              <p className="text-muted-foreground">
                कुल: {formatNepaliNumber(wardItem?.count || 0)} फर्म
              </p>
              <p className="text-muted-foreground">
                (
                {totalFirms > 0
                  ? formatNepaliPercentage(
                      ((wardItem?.count || 0) / totalFirms) * 100,
                      1,
                    )
                  : formatNepaliPercentage(0)}
                %)
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
