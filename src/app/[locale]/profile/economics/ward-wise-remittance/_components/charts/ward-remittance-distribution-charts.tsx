"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardRemittanceDistributionChartsProps {
  wardNumbers: number[];
  remittanceData: Array<{
    id?: string;
    wardNumber: number;
    amountGroup: string;
    sendingPopulation: number;
  }>;
  AMOUNT_RANGE_MAP: Record<string, { min: number; max: number | null; color: string; label: string }>;
  remittanceAmountGroupOptions: Array<{
    value: string;
    label: string;
  }>;
}

export default function WardRemittanceDistributionCharts({
  wardNumbers,
  remittanceData,
  AMOUNT_RANGE_MAP,
  remittanceAmountGroupOptions,
}: WardRemittanceDistributionChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalPopulation }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalPopulation) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")} ({localizeNumber(percentage, "ne")}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = remittanceData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.sendingPopulation || 0),
          0,
        );

        // Sort amounts by remittance group for consistent presentation
        const amountPopulations: Record<string, number> = {};
        wardItems.forEach(item => {
          if (!amountPopulations[item.amountGroup]) amountPopulations[item.amountGroup] = 0;
          amountPopulations[item.amountGroup] += item.sendingPopulation || 0;
        });
        
        const wardData = Object.entries(amountPopulations)
          .map(([amountGroup, sendingPopulation]) => {
            const label = remittanceAmountGroupOptions.find(
              option => option.value === amountGroup
            )?.label || amountGroup;
            
            return {
              name: label,
              value: sendingPopulation,
              amountGroup: amountGroup,
              color: AMOUNT_RANGE_MAP[amountGroup]?.color || "#777"
            };
          })
          .sort((a, b) => {
            // Sort by the order in AMOUNT_RANGE_MAP
            const amountGroupOrder = Object.keys(AMOUNT_RANGE_MAP);
            return amountGroupOrder.indexOf(a.amountGroup) - amountGroupOrder.indexOf(b.amountGroup);
          });

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल रेमिट्यान्स पठाउने जनसंख्या: {localizeNumber(wardTotal.toLocaleString(), "ne")}
            </p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wardData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wardData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalPopulation={wardTotal} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {wardData.slice(0, 5).map((item, i) => {
                  const percentage = (item.value / wardTotal) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name.length > 20 ? `${item.name.substring(0, 18)}...` : item.name}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* If there are more than 5 groups, show an "Others" aggregated entry */}
                {wardData.length > 5 && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#95a5a6" }}
                    ></div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center text-xs">
                        <span className="truncate">अन्य रकम समूहहरू</span>
                        <span className="font-medium">
                          {localizeNumber(
                            wardData
                              .slice(5)
                              .reduce((sum, item) => sum + (item.value / wardTotal) * 100, 0)
                              .toFixed(1),
                            "ne"
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${wardData
                              .slice(5)
                              .reduce((sum, item) => sum + (item.value / wardTotal) * 100, 0)}%`,
                            backgroundColor: "#95a5a6",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
