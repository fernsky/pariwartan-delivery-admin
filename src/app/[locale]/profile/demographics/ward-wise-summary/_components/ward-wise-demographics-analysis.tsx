"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DemographicsAnalysisProps {
  demographicData: {
    totalPopulation: number;
    populationMale: number;
    populationFemale: number;
    populationOther?: number;
    totalHouseholds: number;
    averageHouseholdSize: number;
    sexRatio: number;
    annualGrowthRate: number;
    literacyRate: number;
    populationDensity: number;
    population0To14?: number;
    population15To59?: number;
    population60AndAbove?: number;
    dataYear: string;
    dataYearEnglish: string;
  };
}

export default function DemographicsAnalysisSection({
  demographicData,
}: DemographicsAnalysisProps) {
  if (!demographicData || demographicData.totalPopulation === 0) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">
          जनसांख्यिकी विश्लेषण उपलब्ध छैन।
        </p>
      </div>
    );
  }

  // Calculate percentages and analysis
  const malePercentage =
    (demographicData.populationMale / demographicData.totalPopulation) * 100;
  const femalePercentage =
    (demographicData.populationFemale / demographicData.totalPopulation) * 100;
  const otherPercentage = demographicData.populationOther
    ? (demographicData.populationOther / demographicData.totalPopulation) * 100
    : 0;

  // Age group percentages
  const ageGroup0To14Percentage = demographicData.population0To14
    ? (demographicData.population0To14 / demographicData.totalPopulation) * 100
    : 0;
  const ageGroup15To59Percentage = demographicData.population15To59
    ? (demographicData.population15To59 / demographicData.totalPopulation) * 100
    : 0;
  const ageGroup60AndAbovePercentage = demographicData.population60AndAbove
    ? (demographicData.population60AndAbove / demographicData.totalPopulation) *
      100
    : 0;

  // Determine gender majority
  const isMaleMajority =
    demographicData.populationMale > demographicData.populationFemale;
  const genderMajorityType = isMaleMajority ? "पुरुष" : "महिला";
  const majorityPercentage = isMaleMajority ? malePercentage : femalePercentage;

  // Assess different indicators
  const assessLiteracyRate = (rate: number) => {
    if (rate >= 80)
      return { level: "उच्च", color: "text-green-700", bg: "bg-green-50" };
    if (rate >= 60)
      return { level: "मध्यम", color: "text-yellow-700", bg: "bg-yellow-50" };
    return { level: "न्यून", color: "text-red-700", bg: "bg-red-50" };
  };

  const assessGrowthRate = (rate: number) => {
    if (rate >= 3)
      return { level: "उच्च", color: "text-orange-700", bg: "bg-orange-50" };
    if (rate >= 1)
      return { level: "मध्यम", color: "text-blue-700", bg: "bg-blue-50" };
    return { level: "न्यून", color: "text-green-700", bg: "bg-green-50" };
  };

  const assessHouseholdSize = (size: number) => {
    if (size >= 5)
      return { level: "ठूलो", color: "text-purple-700", bg: "bg-purple-50" };
    if (size >= 3)
      return { level: "मध्यम", color: "text-blue-700", bg: "bg-blue-50" };
    return { level: "सानो", color: "text-green-700", bg: "bg-green-50" };
  };

  const literacyAssessment = assessLiteracyRate(demographicData.literacyRate);
  const growthAssessment = assessGrowthRate(demographicData.annualGrowthRate);
  const householdAssessment = assessHouseholdSize(
    demographicData.averageHouseholdSize,
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              जनसंख्या संरचना
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {genderMajorityType} बहुसंख्यक
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(majorityPercentage.toFixed(1), "ne")}%{" "}
              {genderMajorityType}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              साक्षरता स्थिति
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-700">
              {demographicData.literacyRate >= 80
                ? "उच्च"
                : demographicData.literacyRate >= 60
                  ? "मध्यम"
                  : "न्यून"}{" "}
              साक्षरता
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(demographicData.literacyRate.toFixed(1), "ne")}%{" "}
              साक्षर
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              जनसंख्या वृद्धि
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-700">
              {demographicData.annualGrowthRate >= 3
                ? "उच्च"
                : demographicData.annualGrowthRate >= 1
                  ? "मध्यम"
                  : "न्यून"}{" "}
              वृद्धि
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                demographicData.annualGrowthRate.toFixed(2),
                "ne",
              )}
              % वार्षिक
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              परिवार आकार
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-700">
              {demographicData.averageHouseholdSize >= 5
                ? "ठूलो"
                : demographicData.averageHouseholdSize >= 3
                  ? "मध्यम"
                  : "सानो"}{" "}
              परिवार
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                demographicData.averageHouseholdSize.toFixed(1),
                "ne",
              )}{" "}
              व्यक्ति औसत
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Age Structure Analysis */}
      {(demographicData.population0To14 ||
        demographicData.population15To59 ||
        demographicData.population60AndAbove) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {demographicData.population0To14 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  बाल जनसंख्या (०-१४)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {localizeNumber(
                    demographicData.population0To14.toLocaleString(),
                    "ne",
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {localizeNumber(ageGroup0To14Percentage.toFixed(1), "ne")}%
                  कुल जनसंख्याको
                </div>
              </CardContent>
            </Card>
          )}

          {demographicData.population15To59 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  कार्यशील जनसंख्या (१५-५९)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {localizeNumber(
                    demographicData.population15To59.toLocaleString(),
                    "ne",
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {localizeNumber(ageGroup15To59Percentage.toFixed(1), "ne")}%
                  कुल जनसंख्याको
                </div>
              </CardContent>
            </Card>
          )}

          {demographicData.population60AndAbove && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  वृद्ध जनसंख्या (६०+)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {localizeNumber(
                    demographicData.population60AndAbove.toLocaleString(),
                    "ne",
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {localizeNumber(
                    ageGroup60AndAbovePercentage.toFixed(1),
                    "ne",
                  )}
                  % कुल जनसंख्याको
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Detailed Analysis Section */}
      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-4">जनसांख्यिकी विश्लेषण</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-3 text-blue-700">
              जनसंख्या संरचना विश्लेषण
            </h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">पुरुष जनसंख्या</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(malePercentage.toFixed(1), "ne")}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">महिला जनसंख्या</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(femalePercentage.toFixed(1), "ne")}%
                </Badge>
              </div>
              {demographicData.populationOther && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">अन्य जनसंख्या</span>
                  <Badge variant="secondary" className="text-xs">
                    {localizeNumber(otherPercentage.toFixed(1), "ne")}%
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm">लैंगिक अनुपात</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(demographicData.sexRatio.toFixed(1), "ne")}{" "}
                  पुरुष प्रति १०० महिला
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 text-purple-700">
              सामाजिक सूचकहरू
            </h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">जनघनत्व</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(
                    demographicData.populationDensity.toFixed(1),
                    "ne",
                  )}{" "}
                  प्रति वर्ग कि.मी.
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">औसत परिवार आकार</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(
                    demographicData.averageHouseholdSize.toFixed(1),
                    "ne",
                  )}{" "}
                  व्यक्ति
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">वार्षिक वृद्धि दर</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(
                    demographicData.annualGrowthRate.toFixed(2),
                    "ne",
                  )}
                  %
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">साक्षरता दर</span>
                <Badge variant="secondary" className="text-xs">
                  {localizeNumber(
                    demographicData.literacyRate.toFixed(1),
                    "ne",
                  )}
                  %
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
