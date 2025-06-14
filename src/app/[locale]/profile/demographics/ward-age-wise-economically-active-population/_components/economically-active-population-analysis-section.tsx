"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";

interface EconomicallyActivePopulationAnalysisProps {
  economicallyActiveData:
    | Array<{
        id?: string;
        wardNumber: string;
        gender: string;
        age10PlusTotal: number;
        economicallyActiveEmployed: number;
        economicallyActiveUnemployed: number;
        householdWork: number;
        economicallyActiveTotal: number;
        dependentPopulation: number;
      }>
    | null
    | undefined;
  totalAge10Plus: number;
  totalEmployed: number;
  totalUnemployed: number;
  totalEconomicallyActive: number;
}

export default function EconomicallyActivePopulationAnalysisSection({
  economicallyActiveData,
  totalAge10Plus,
  totalEmployed,
  totalUnemployed,
  totalEconomicallyActive,
}: EconomicallyActivePopulationAnalysisProps) {
  // Add null checks and ensure data is a valid array
  if (
    !economicallyActiveData ||
    !Array.isArray(economicallyActiveData) ||
    economicallyActiveData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">आर्थिक तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  // Filter ward-wise data (excluding totals)
  const wardWiseData = economicallyActiveData.filter(
    (item) => item.wardNumber !== "जम्मा" && item.gender === "जम्मा",
  );

  // Find ward with highest employment
  const highestEmploymentWard = wardWiseData.reduce((prev, current) =>
    prev.economicallyActiveEmployed > current.economicallyActiveEmployed
      ? prev
      : current,
  );

  // Find ward with highest unemployment rate
  const wardWithHighestUnemploymentRate = wardWiseData.reduce(
    (prev, current) => {
      const prevRate =
        prev.economicallyActiveTotal > 0
          ? (prev.economicallyActiveUnemployed / prev.economicallyActiveTotal) *
            100
          : 0;
      const currentRate =
        current.economicallyActiveTotal > 0
          ? (current.economicallyActiveUnemployed /
              current.economicallyActiveTotal) *
            100
          : 0;
      return prevRate > currentRate ? prev : current;
    },
  );

  // Calculate employment and unemployment rates
  const employmentRate =
    totalAge10Plus > 0
      ? ((totalEmployed / totalAge10Plus) * 100).toFixed(1)
      : "0";
  const unemploymentRate =
    totalEconomicallyActive > 0
      ? ((totalUnemployed / totalEconomicallyActive) * 100).toFixed(1)
      : "0";

  // Gender-wise analysis
  const maleData = economicallyActiveData.filter(
    (item) => item.wardNumber === "जम्मा" && item.gender === "पुरुष",
  )[0];
  const femaleData = economicallyActiveData.filter(
    (item) => item.wardNumber === "जम्मा" && item.gender === "महिला",
  )[0];

  const maleEmploymentRate =
    maleData && maleData.age10PlusTotal > 0
      ? (
          (maleData.economicallyActiveEmployed / maleData.age10PlusTotal) *
          100
        ).toFixed(1)
      : "0";
  const femaleEmploymentRate =
    femaleData && femaleData.age10PlusTotal > 0
      ? (
          (femaleData.economicallyActiveEmployed / femaleData.age10PlusTotal) *
          100
        ).toFixed(1)
      : "0";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              रोजगारी दर
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(employmentRate, "ne")}%
            </div>
            <div className="text-xs text-muted-foreground">
              कुल १० वर्ष माथिको जनसंख्याको
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              बेरोजगारी दर
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(unemploymentRate, "ne")}%
            </div>
            <div className="text-xs text-muted-foreground">
              आर्थिक रूपमा सक्रिय जनसंख्याको
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              सर्वाधिक रोजगारी
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              वडा {localizeNumber(highestEmploymentWard.wardNumber, "ne")}
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                highestEmploymentWard.economicallyActiveEmployed.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              उच्च बेरोजगारी दर
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              वडा{" "}
              {localizeNumber(wardWithHighestUnemploymentRate.wardNumber, "ne")}
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                (
                  (wardWithHighestUnemploymentRate.economicallyActiveUnemployed /
                    wardWithHighestUnemploymentRate.economicallyActiveTotal) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % बेरोजगारी दर
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-4">आर्थिक सक्रियता विश्लेषण</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-3 text-blue-700">
              लैंगिक रोजगारी दर
            </h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">पुरुष रोजगारी दर</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(maleEmploymentRate, "ne")}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">महिला रोजगारी दर</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(femaleEmploymentRate, "ne")}%
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 text-green-700">
              वडागत रोजगारी वितरण
            </h5>
            <div className="space-y-2">
              {wardWiseData
                .sort(
                  (a, b) =>
                    b.economicallyActiveEmployed - a.economicallyActiveEmployed,
                )
                .slice(0, 3)
                .map((ward) => (
                  <div
                    key={ward.wardNumber}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      वडा {localizeNumber(ward.wardNumber, "ne")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {localizeNumber(
                        ward.economicallyActiveEmployed.toLocaleString(),
                        "ne",
                      )}{" "}
                      व्यक्ति
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">मुख्य निष्कर्षहरू:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• कुल रोजगारी दर {localizeNumber(employmentRate, "ne")}% छ</li>
            <li>
              • बेरोजगारी दर {localizeNumber(unemploymentRate, "ne")}% रहेको छ
            </li>
            <li>
              • वडा {localizeNumber(highestEmploymentWard.wardNumber, "ne")}मा
              सबैभन्दा बढी रोजगारी छ
            </li>
            <li>
              •{" "}
              {parseFloat(maleEmploymentRate) > parseFloat(femaleEmploymentRate)
                ? "पुरुषको रोजगारी दर महिलाभन्दा बढी छ"
                : "महिलाको रोजगारी दर पुरुषभन्दा बढी छ"}
            </li>
            <li>
              • कुल{" "}
              {localizeNumber(totalEconomicallyActive.toLocaleString(), "ne")}{" "}
              व्यक्ति आर्थिक रूपमा सक्रिय छन्
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
