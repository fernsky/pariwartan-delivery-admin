"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";

interface CasteAnalysisProps {
  casteData:
    | Array<{
        id?: string;
        casteType: string;
        casteTypeDisplay?: string;
        malePopulation: number;
        femalePopulation: number;
        totalPopulation: number;
      }>
    | null
    | undefined;
  totalMale: number;
  totalFemale: number;
  totalPopulation: number;
}

export default function CasteAnalysisSection({
  casteData,
  totalMale,
  totalFemale,
  totalPopulation,
}: CasteAnalysisProps) {
  // Add null checks and ensure casteData is a valid array
  if (!casteData || !Array.isArray(casteData) || casteData.length === 0) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">जातीय तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  // Find the most populous caste
  const mostPopulousCaste = casteData.reduce((prev, current) =>
    prev.totalPopulation > current.totalPopulation ? prev : current,
  );

  // Find the most gender-balanced caste (closest to 50-50 ratio)
  const genderBalancedCaste = casteData.reduce((prev, current) => {
    const prevRatio = Math.abs(
      50 - (prev.malePopulation / prev.totalPopulation) * 100,
    );
    const currentRatio = Math.abs(
      50 - (current.malePopulation / current.totalPopulation) * 100,
    );
    return prevRatio < currentRatio ? prev : current;
  });

  // Calculate gender ratio for overall population
  const overallGenderRatio =
    totalFemale > 0 ? ((totalMale / totalFemale) * 100).toFixed(1) : "0";

  // Find castes with male majority
  const maleMajorityCastes = casteData.filter(
    (caste) => caste.malePopulation > caste.femalePopulation,
  );

  // Find castes with female majority
  const femaleMajorityCastes = casteData.filter(
    (caste) => caste.femalePopulation > caste.malePopulation,
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              कुल जनसंख्या
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(totalPopulation.toLocaleString(), "ne")}
            </div>
            <div className="text-xs text-muted-foreground">
              {casteData.length} जातजाति
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              सबैभन्दा धेरै जनसंख्या
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {mostPopulousCaste.casteTypeDisplay}
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                mostPopulousCaste.totalPopulation.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                (
                  (mostPopulousCaste.totalPopulation / totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              लिङ्ग अनुपात
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(overallGenderRatio, "ne")}
            </div>
            <div className="text-xs text-muted-foreground">
              प्रति १०० महिलामा पुरुष
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              लिङ्ग संतुलन
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {genderBalancedCaste.casteTypeDisplay}
            </div>
            <div className="text-xs text-muted-foreground">
              सबैभन्दा संतुलित जाति
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                (
                  (genderBalancedCaste.malePopulation /
                    genderBalancedCaste.totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % पुरुष
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-4">जातीय र लैंगिक विश्लेषण</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-3 text-green-700">
              पुरुष बहुसंख्यक जातिहरू
            </h5>
            <div className="space-y-2">
              {maleMajorityCastes.map((caste) => (
                <div
                  key={caste.id || caste.casteType}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">
                    {caste.casteTypeDisplay || caste.casteType}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {localizeNumber(
                      (
                        ((caste.malePopulation || 0) /
                          (caste.totalPopulation || 1)) *
                        100
                      ).toFixed(1),
                      "ne",
                    )}
                    % पुरुष
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 text-pink-700">
              महिला बहुसंख्यक जातिहरू
            </h5>
            <div className="space-y-2">
              {femaleMajorityCastes.map((caste) => (
                <div
                  key={caste.id || caste.casteType}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">
                    {caste.casteTypeDisplay || caste.casteType}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {localizeNumber(
                      (
                        ((caste.femalePopulation || 0) /
                          (caste.totalPopulation || 1)) *
                        100
                      ).toFixed(1),
                      "ne",
                    )}
                    % महिला
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">मुख्य निष्कर्षहरू:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • कुल जनसंख्यामा महिलाको संख्या पुरुषभन्दा बढी छ (
              {localizeNumber(
                (((totalFemale || 0) / (totalPopulation || 1)) * 100).toFixed(
                  1,
                ),
                "ne",
              )}
              %)
            </li>
            <li>
              •{" "}
              {mostPopulousCaste.casteTypeDisplay ||
                mostPopulousCaste.casteType}{" "}
              सबैभन्दा बढी जनसंख्या भएको जाति हो
            </li>
            <li>• {maleMajorityCastes.length} जातिमा पुरुष बहुसंख्यक छन्</li>
            <li>• {femaleMajorityCastes.length} जातिमा महिला बहुसंख्यक छन्</li>
          </ul>
        </div>
      </div>
    </>
  );
}
