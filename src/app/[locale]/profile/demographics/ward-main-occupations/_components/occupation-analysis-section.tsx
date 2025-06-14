"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";
import { familyMainOccupationLabels } from "@/server/api/routers/profile/demographics/ward-wise-major-occupation.schema";

interface OccupationAnalysisProps {
  occupationData:
    | Array<{
        id?: string;
        occupation: string;
        age15_19: number;
        age20_24: number;
        age25_29: number;
        age30_34: number;
        age35_39: number;
        age40_44: number;
        age45_49: number;
        totalPopulation: number;
        percentage: number;
      }>
    | null
    | undefined;
  totalPopulation: number;
}

export default function OccupationAnalysisSection({
  occupationData,
  totalPopulation,
}: OccupationAnalysisProps) {
  // Add null checks and ensure occupationData is a valid array
  if (
    !occupationData ||
    !Array.isArray(occupationData) ||
    occupationData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">पेशागत तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  // Find the most populous occupation
  const mostPopulousOccupation = occupationData.reduce((prev, current) =>
    prev.totalPopulation > current.totalPopulation ? prev : current,
  );

  // Find occupation with highest youth participation (15-24 age group)
  const youthOccupation = occupationData.reduce((prev, current) => {
    const prevYouth = prev.age15_19 + prev.age20_24;
    const currentYouth = current.age15_19 + current.age20_24;
    return prevYouth > currentYouth ? prev : current;
  });

  // Calculate age group totals
  const totalYouth = occupationData.reduce(
    (sum, item) => sum + item.age15_19 + item.age20_24,
    0,
  );
  const totalMiddleAge = occupationData.reduce(
    (sum, item) => sum + item.age25_29 + item.age30_34 + item.age35_39,
    0,
  );
  const totalMature = occupationData.reduce(
    (sum, item) => sum + item.age40_44 + item.age45_49,
    0,
  );

  // Find economically active vs inactive
  const economicallyActive = occupationData.filter(
    (item) =>
      item.occupation !== "ECONOMICALLY_INACTIVE" &&
      item.occupation !== "NOT_SPECIFIED",
  );
  const economicallyInactive = occupationData.filter(
    (item) => item.occupation === "ECONOMICALLY_INACTIVE",
  );

  const activePopulation = economicallyActive.reduce(
    (sum, item) => sum + item.totalPopulation,
    0,
  );
  const inactivePopulation = economicallyInactive.reduce(
    (sum, item) => sum + item.totalPopulation,
    0,
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
              {occupationData.length} पेशा वर्ग
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              प्रमुख पेशा
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {familyMainOccupationLabels[mostPopulousOccupation.occupation]}
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                mostPopulousOccupation.totalPopulation.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                mostPopulousOccupation.percentage.toFixed(1),
                "ne",
              )}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              आर्थिक सक्रियता दर
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(
                ((activePopulation / totalPopulation) * 100).toFixed(1),
                "ne",
              )}
              %
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(activePopulation.toLocaleString(), "ne")} व्यक्ति
              सक्रिय
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              युवा बहुल पेशा
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {familyMainOccupationLabels[youthOccupation.occupation]}
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                (
                  youthOccupation.age15_19 + youthOccupation.age20_24
                ).toLocaleString(),
                "ne",
              )}{" "}
              युवा
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-4">
          पेशागत र उमेर समूह विश्लेषण
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-medium mb-3 text-blue-700">
              युवा समूह (१५-२४ वर्ष)
            </h5>
            <div className="space-y-2">
              {occupationData
                .map((item) => ({
                  ...item,
                  youthCount: item.age15_19 + item.age20_24,
                }))
                .sort((a, b) => b.youthCount - a.youthCount)
                .slice(0, 5)
                .map((occupation) => (
                  <div
                    key={occupation.id || occupation.occupation}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {familyMainOccupationLabels[occupation.occupation] ||
                        occupation.occupation}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {localizeNumber(
                        occupation.youthCount.toLocaleString(),
                        "ne",
                      )}{" "}
                      व्यक्ति
                    </Badge>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 text-green-700">
              मध्यम उमेर (२५-३९ वर्ष)
            </h5>
            <div className="space-y-2">
              {occupationData
                .map((item) => ({
                  ...item,
                  middleAgeCount: item.age25_29 + item.age30_34 + item.age35_39,
                }))
                .sort((a, b) => b.middleAgeCount - a.middleAgeCount)
                .slice(0, 5)
                .map((occupation) => (
                  <div
                    key={occupation.id || occupation.occupation}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {familyMainOccupationLabels[occupation.occupation] ||
                        occupation.occupation}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {localizeNumber(
                        occupation.middleAgeCount.toLocaleString(),
                        "ne",
                      )}{" "}
                      व्यक्ति
                    </Badge>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 text-purple-700">
              परिपक्व उमेर (४०-४९ वर्ष)
            </h5>
            <div className="space-y-2">
              {occupationData
                .map((item) => ({
                  ...item,
                  matureCount: item.age40_44 + item.age45_49,
                }))
                .sort((a, b) => b.matureCount - a.matureCount)
                .slice(0, 5)
                .map((occupation) => (
                  <div
                    key={occupation.id || occupation.occupation}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {familyMainOccupationLabels[occupation.occupation] ||
                        occupation.occupation}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {localizeNumber(
                        occupation.matureCount.toLocaleString(),
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
            <li>
              • {familyMainOccupationLabels[mostPopulousOccupation.occupation]}{" "}
              सबैभन्दा बढी व्यक्तिले अपनाएको पेशा हो (
              {localizeNumber(
                mostPopulousOccupation.percentage.toFixed(1),
                "ne",
              )}
              %)
            </li>
            <li>
              • आर्थिक रूपमा सक्रिय जनसंख्या{" "}
              {localizeNumber(
                ((activePopulation / totalPopulation) * 100).toFixed(1),
                "ne",
              )}
              % छ
            </li>
            <li>
              • युवाहरू मुख्यतः{" "}
              {familyMainOccupationLabels[youthOccupation.occupation]} पेशामा
              संलग्न छन्
            </li>
            <li>
              • कुल {occupationData.length} फरक पेशा वर्गहरू पहिचान गरिएको छ
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
