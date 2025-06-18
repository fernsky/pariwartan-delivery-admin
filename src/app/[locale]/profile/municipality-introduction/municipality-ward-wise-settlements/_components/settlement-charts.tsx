import { localizeNumber } from "@/lib/utils/localize-number";

interface SettlementChartsProps {
  settlementData: {
    title: string;
    title_english: string;
    data: Array<{
      ward_number: string;
      ward_number_english: string;
      settlements: string[];
    }>;
    metadata: {
      total_wards: number;
      column_headers: {
        nepali: string[];
        english: string[];
      };
    };
  };
}

export default function SettlementCharts({
  settlementData,
}: SettlementChartsProps) {
  // Calculate settlement statistics
  const totalSettlements = settlementData.data.reduce(
    (sum, ward) => sum + ward.settlements.length,
    0,
  );

  const avgSettlementsPerWard = (
    totalSettlements / settlementData.metadata.total_wards
  ).toFixed(1);

  // Find ward with most and least settlements
  const wardWithMostSettlements = settlementData.data.reduce((max, ward) =>
    ward.settlements.length > max.settlements.length ? ward : max,
  );

  const wardWithLeastSettlements = settlementData.data.reduce((min, ward) =>
    ward.settlements.length < min.settlements.length ? ward : min,
  );

  return (
    <>
      {/* Settlement overview statistics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">कुल बस्तीहरू</h3>
          <p className="text-3xl font-bold text-primary">
            {localizeNumber(totalSettlements.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground">
            {settlementData.metadata.total_wards} वडामा फैलिएको
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">औसत बस्ती प्रति वडा</h3>
          <p className="text-3xl font-bold text-primary">
            {localizeNumber(avgSettlementsPerWard, "ne")}
          </p>
          <p className="text-sm text-muted-foreground">
            प्रति वडा औसत बस्ती संख्या
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">सबैभन्दा धेरै बस्ती</h3>
          <p className="text-3xl font-bold text-primary">
            वडा {wardWithMostSettlements.ward_number}
          </p>
          <p className="text-sm text-muted-foreground">
            {localizeNumber(
              wardWithMostSettlements.settlements.length.toString(),
              "ne",
            )}{" "}
            बस्तीहरू
          </p>
        </div>
      </div>

      {/* Ward-wise settlement table */}
      <div className="border rounded-lg shadow-sm overflow-hidden bg-card mb-8">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">{settlementData.title}</h3>
          <p className="text-sm text-muted-foreground">
            कुल {localizeNumber(totalSettlements.toString(), "ne")} बस्तीहरूको
            विस्तृत विवरण
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold">
                  {settlementData.metadata.column_headers.nepali[0]}
                </th>
                <th className="border p-3 text-left font-semibold">
                  {settlementData.metadata.column_headers.nepali[1]}
                </th>
                <th className="border p-3 text-center font-semibold">
                  बस्ती संख्या
                </th>
              </tr>
            </thead>
            <tbody>
              {settlementData.data.map((ward, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-muted/40" : ""}
                >
                  <td className="border p-3 text-center font-medium">
                    वडा {ward.ward_number}
                  </td>
                  <td className="border p-3">
                    <div className="space-y-1">
                      {ward.settlements.map((settlement, settlementIndex) => (
                        <span
                          key={settlementIndex}
                          className="inline-block bg-muted px-2 py-1 rounded text-sm mr-1 mb-1"
                        >
                          {settlement}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="border p-3 text-center font-medium">
                    {localizeNumber(ward.settlements.length.toString(), "ne")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-muted/70">
                <td className="border p-3 text-center">जम्मा</td>
                <td className="border p-3 text-center">
                  {localizeNumber(
                    settlementData.metadata.total_wards.toString(),
                    "ne",
                  )}{" "}
                  वडा
                </td>
                <td className="border p-3 text-center">
                  {localizeNumber(totalSettlements.toString(), "ne")} बस्ती
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Ward-wise settlement count bar chart visualization */}
      <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार बस्ती वितरण</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडामा रहेका बस्तीहरूको संख्या
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {settlementData.data.map((ward, index) => {
              const percentage =
                (ward.settlements.length /
                  wardWithMostSettlements.settlements.length) *
                100;

              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">
                    वडा {ward.ward_number}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">
                        {localizeNumber(
                          ward.settlements.length.toString(),
                          "ne",
                        )}{" "}
                        बस्तीहरू
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {localizeNumber(
                          (
                            (ward.settlements.length / totalSettlements) *
                            100
                          ).toFixed(1),
                          "ne",
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
