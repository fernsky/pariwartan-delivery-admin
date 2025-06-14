"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";

interface GenderAnalysisProps {
  ageGroupData:
    | Array<{
        id?: string;
        ageGroup: string;
        maleHeads: number;
        femaleHeads: number;
        totalFamilies: number;
        updatedAt?: Date;
        createdAt?: Date;
      }>
    | null
    | undefined;
  totalMaleHeads: number;
  totalFemaleHeads: number;
  totalFamilies: number;
}

export default function GenderAnalysisSection({
  ageGroupData,
  totalMaleHeads,
  totalFemaleHeads,
  totalFamilies,
}: GenderAnalysisProps) {
  // Add null checks and ensure ageGroupData is a valid array
  if (
    !ageGroupData ||
    !Array.isArray(ageGroupData) ||
    ageGroupData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">घरमूली तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  // Filter out the 'जम्मा' row for analysis
  const dataWithoutTotal = ageGroupData.filter(
    (item) => item.ageGroup !== "जम्मा",
  );

  // Find the age group with most families
  const mostFamiliesAgeGroup = dataWithoutTotal.reduce((prev, current) =>
    prev.totalFamilies > current.totalFamilies ? prev : current,
  );

  // Find the most gender-balanced age group (closest to 50-50 ratio)
  const genderBalancedAgeGroup = dataWithoutTotal.reduce((prev, current) => {
    const prevRatio = Math.abs(
      50 - (prev.maleHeads / prev.totalFamilies) * 100,
    );
    const currentRatio = Math.abs(
      50 - (current.maleHeads / current.totalFamilies) * 100,
    );
    return prevRatio < currentRatio ? prev : current;
  });

  // Calculate gender ratio for overall household heads
  const overallGenderRatio =
    totalFemaleHeads > 0
      ? ((totalMaleHeads / totalFemaleHeads) * 100).toFixed(1)
      : "0";

  // Find age groups with male majority household heads
  const maleMajorityAgeGroups = dataWithoutTotal.filter(
    (ageGroup) => ageGroup.maleHeads > ageGroup.femaleHeads,
  );

  // Find age groups with female majority household heads
  const femaleMajorityAgeGroups = dataWithoutTotal.filter(
    (ageGroup) => ageGroup.femaleHeads > ageGroup.maleHeads,
  );

  // Find the peak age group for male household heads
  const peakMaleAgeGroup = dataWithoutTotal.reduce((prev, current) =>
    prev.maleHeads > current.maleHeads ? prev : current,
  );

  // Find the peak age group for female household heads
  const peakFemaleAgeGroup = dataWithoutTotal.reduce((prev, current) =>
    prev.femaleHeads > current.femaleHeads ? prev : current,
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              कुल परिवार
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(totalFamilies.toLocaleString(), "ne")}
            </div>
            <div className="text-xs text-muted-foreground">
              {dataWithoutTotal.length} उमेर समूह
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              सबैभन्दा धेरै परिवार
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {mostFamiliesAgeGroup.ageGroup}
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                mostFamiliesAgeGroup.totalFamilies.toLocaleString(),
                "ne",
              )}{" "}
              परिवार
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                (
                  (mostFamiliesAgeGroup.totalFamilies / totalFamilies) *
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
              घरमूली लिङ्ग अनुपात
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(overallGenderRatio, "ne")}
            </div>
            <div className="text-xs text-muted-foreground">
              प्रति १०० महिला घरमूलीमा पुरुष
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
              {genderBalancedAgeGroup.ageGroup}
            </div>
            <div className="text-xs text-muted-foreground">
              सबैभन्दा संतुलित उमेर समूह
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                (
                  (genderBalancedAgeGroup.maleHeads /
                    genderBalancedAgeGroup.totalFamilies) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % पुरुष घरमूली
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-4">घरमूली लैंगिक विश्लेषण</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-3 text-green-700">
              पुरुष बहुसंख्यक घरमूली उमेर समूह
            </h5>
            <div className="space-y-2">
              {maleMajorityAgeGroups.map((ageGroup) => (
                <div
                  key={ageGroup.id || ageGroup.ageGroup}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{ageGroup.ageGroup}</span>
                  <Badge variant="secondary" className="text-xs">
                    {localizeNumber(
                      (
                        ((ageGroup.maleHeads || 0) /
                          (ageGroup.totalFamilies || 1)) *
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
              महिला बहुसंख्यक घरमूली उमेर समूह
            </h5>
            <div className="space-y-2">
              {femaleMajorityAgeGroups.map((ageGroup) => (
                <div
                  key={ageGroup.id || ageGroup.ageGroup}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{ageGroup.ageGroup}</span>
                  <Badge variant="secondary" className="text-xs">
                    {localizeNumber(
                      (
                        ((ageGroup.femaleHeads || 0) /
                          (ageGroup.totalFamilies || 1)) *
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

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">
              पुरुष घरमूली शिखर:
            </h5>
            <p className="text-sm text-blue-700">
              {peakMaleAgeGroup.ageGroup} उमेर समूहमा सबैभन्दा धेरै पुरुष घरमूली
              छन् (
              {localizeNumber(
                peakMaleAgeGroup.maleHeads.toLocaleString(),
                "ne",
              )}{" "}
              जना)
            </p>
          </div>

          <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
            <h5 className="font-medium text-pink-800 mb-2">
              महिला घरमूली शिखर:
            </h5>
            <p className="text-sm text-pink-700">
              {peakFemaleAgeGroup.ageGroup} उमेर समूहमा सबैभन्दा धेरै महिला
              घरमूली छन् (
              {localizeNumber(
                peakFemaleAgeGroup.femaleHeads.toLocaleString(),
                "ne",
              )}{" "}
              जना)
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h5 className="font-medium text-purple-800 mb-2">
            मुख्य निष्कर्षहरू:
          </h5>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>
              • कुल घरमूलीमा{" "}
              {totalMaleHeads > totalFemaleHeads ? "पुरुष" : "महिला"}को संख्या
              बढी छ (
              {localizeNumber(
                (
                  ((totalMaleHeads > totalFemaleHeads
                    ? totalMaleHeads
                    : totalFemaleHeads) /
                    (totalMaleHeads + totalFemaleHeads)) *
                  100
                ).toFixed(1),
                "ne",
              )}
              %)
            </li>
            <li>
              • {mostFamiliesAgeGroup.ageGroup} उमेर समूहमा सबैभन्दा बढी परिवार
              छन्
            </li>
            <li>
              • {maleMajorityAgeGroups.length} उमेर समूहमा पुरुष घरमूली
              बहुसंख्यक छन्
            </li>
            <li>
              • {femaleMajorityAgeGroups.length} उमेर समूहमा महिला घरमूली
              बहुसंख्यक छन्
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
