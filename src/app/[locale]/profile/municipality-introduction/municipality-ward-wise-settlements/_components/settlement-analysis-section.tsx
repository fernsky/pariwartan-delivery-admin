import { localizeNumber } from "@/lib/utils/localize-number";

interface SettlementAnalysisProps {
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

export default function SettlementAnalysisSection({
  settlementData,
}: SettlementAnalysisProps) {
  // Calculate detailed statistics
  const totalSettlements = settlementData.data.reduce(
    (sum, ward) => sum + ward.settlements.length,
    0,
  );

  const wardSettlementCounts = settlementData.data.map((ward) => ({
    wardNumber: ward.ward_number,
    count: ward.settlements.length,
  }));

  const sortedWards = [...wardSettlementCounts].sort(
    (a, b) => b.count - a.count,
  );
  const mostSettlements = sortedWards[0];
  const leastSettlements = sortedWards[sortedWards.length - 1];

  // Find interesting settlement names for analysis
  const uniqueSettlementTypes = new Set<string>();
  const settlementsByType: Record<string, number> = {};

  settlementData.data.forEach((ward) => {
    ward.settlements.forEach((settlement) => {
      // Analyze settlement types based on common Nepali suffixes
      if (settlement.includes("गाउँ")) {
        settlementsByType["गाउँ"] = (settlementsByType["गाउँ"] || 0) + 1;
      } else if (settlement.includes("टोल")) {
        settlementsByType["टोल"] = (settlementsByType["टोल"] || 0) + 1;
      } else if (settlement.includes("बजार")) {
        settlementsByType["बजार"] = (settlementsByType["बजार"] || 0) + 1;
      } else if (settlement.includes("खोला")) {
        settlementsByType["खोला"] = (settlementsByType["खोला"] || 0) + 1;
      } else if (settlement.includes("डाँडा")) {
        settlementsByType["डाँडा"] = (settlementsByType["डाँडा"] || 0) + 1;
      } else if (settlement.includes("चौर")) {
        settlementsByType["चौर"] = (settlementsByType["चौर"] || 0) + 1;
      }
    });
  });

  const topSettlementTypes = Object.entries(settlementsByType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settlementData.data.map((ward, index) => (
          <div
            key={index}
            className="bg-muted/50 rounded-lg p-4 relative overflow-hidden"
          >
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${Math.min((ward.settlements.length / mostSettlements.count) * 100, 100)}%`,
                backgroundColor: "#6366F1",
                opacity: 0.1,
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-2">
                वडा {ward.ward_number}
                <span className="sr-only">Ward {ward.ward_number_english}</span>
              </h3>
              <p className="text-2xl font-bold">
                {localizeNumber(ward.settlements.length.toString(), "ne")}{" "}
                बस्तीहरू
              </p>
              <p className="text-sm text-muted-foreground">
                {localizeNumber(
                  ((ward.settlements.length / totalSettlements) * 100).toFixed(
                    1,
                  ),
                  "ne",
                )}
                % कुल बस्तीको
                <span className="sr-only">
                  (
                  {((ward.settlements.length / totalSettlements) * 100).toFixed(
                    1,
                  )}
                  % of total settlements)
                </span>
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                <div className="max-h-16 overflow-hidden">
                  {ward.settlements.slice(0, 3).map((settlement, i) => (
                    <div key={i} className="truncate">
                      • {settlement}
                    </div>
                  ))}
                  {ward.settlements.length > 3 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      +{" "}
                      {localizeNumber(
                        (ward.settlements.length - 3).toString(),
                        "ne",
                      )}{" "}
                      अन्य
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          गाउँपालिकाको बस्ती वितरण विश्लेषण
          <span className="sr-only">
            Settlement Distribution Analysis of Rural Municipality
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सबैभन्दा धेरै बस्ती भएको वडा
              <span className="sr-only">Ward with Most Settlements</span>
            </h4>
            <p className="text-3xl font-bold">
              वडा {mostSettlements?.wardNumber || "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber((mostSettlements?.count || 0).toString(), "ne")}{" "}
              बस्तीहरू
              <span className="sr-only">
                {mostSettlements?.count || 0} settlements
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सबैभन्दा कम बस्ती भएको वडा
              <span className="sr-only">Ward with Least Settlements</span>
            </h4>
            <p className="text-3xl font-bold">
              वडा {leastSettlements?.wardNumber || "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber((leastSettlements?.count || 0).toString(), "ne")}{" "}
              बस्तीहरू
              <span className="sr-only">
                {leastSettlements?.count || 0} settlements
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              औसत बस्ती प्रति वडा
              <span className="sr-only">Average Settlements per Ward</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                (
                  totalSettlements / settlementData.metadata.total_wards
                ).toFixed(1),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              प्रति वडा औसत बस्ती संख्या
              <span className="sr-only">
                Average number of settlements per ward
              </span>
            </p>
          </div>
        </div>

        {/* Settlement type analysis */}
        {topSettlementTypes.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">
              बस्तीका प्रकारहरू
              <span className="sr-only">Types of Settlements</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {topSettlementTypes.map(([type, count], index) => (
                <div
                  key={index}
                  className="bg-card p-3 rounded border text-center"
                >
                  <p className="text-lg font-bold">
                    {localizeNumber(count.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {type} समाप्त हुने
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
