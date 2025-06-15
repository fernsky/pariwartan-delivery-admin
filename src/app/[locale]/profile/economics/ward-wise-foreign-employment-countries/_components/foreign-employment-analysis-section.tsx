"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  Globe,
  MapPin,
} from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import {
  foreignEmploymentCountryOptions,
  ageGroupOptions,
  genderOptions,
} from "@/server/api/routers/profile/economics/ward-wise-foreign-employment-countries.schema";

interface ForeignEmploymentAnalysisSectionProps {
  data: Array<{
    id?: string;
    ageGroup: string;
    gender: string;
    country: string;
    population: number;
    total: number;
  }>;
  summaryData?: Array<{
    country: string;
    total_population: number;
  }>;
  isLoading?: boolean;
}

export default function ForeignEmploymentAnalysisSection({
  data,
  summaryData,
  isLoading,
}: ForeignEmploymentAnalysisSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  // Calculate key metrics
  const totalPopulation = data.reduce(
    (sum, item) => sum + (item.population || 0),
    0,
  );

  // Age group analysis
  const ageGroupStats: Record<string, number> = {};
  data.forEach((item) => {
    if (item.ageGroup !== "TOTAL") {
      ageGroupStats[item.ageGroup] =
        (ageGroupStats[item.ageGroup] || 0) + item.population;
    }
  });

  const topAgeGroup = Object.entries(ageGroupStats).sort(
    ([, a], [, b]) => b - a,
  )[0];

  // Gender analysis
  const genderStats: Record<string, number> = {};
  data.forEach((item) => {
    if (item.gender !== "TOTAL") {
      genderStats[item.gender] =
        (genderStats[item.gender] || 0) + item.population;
    }
  });

  // Country analysis
  const countryStats: Record<string, number> = {};
  data.forEach((item) => {
    countryStats[item.country] =
      (countryStats[item.country] || 0) + item.population;
  });

  const topCountries = Object.entries(countryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Calculate percentages
  const genderPercentages = Object.entries(genderStats).map(
    ([gender, count]) => ({
      gender,
      count,
      percentage: (count / totalPopulation) * 100,
    }),
  );

  const ageGroupPercentages = Object.entries(ageGroupStats)
    .map(([ageGroup, count]) => ({
      ageGroup,
      count,
      percentage: (count / totalPopulation) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Helper function to get localized labels
  const getCountryLabel = (country: string) =>
    foreignEmploymentCountryOptions.find((opt) => opt.value === country)
      ?.label || country;

  const getAgeGroupLabel = (ageGroup: string) =>
    ageGroupOptions.find((opt) => opt.value === ageGroup)?.label || ageGroup;

  const getGenderLabel = (gender: string) =>
    genderOptions.find((opt) => opt.value === gender)?.label || gender;

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              लिङ्गगत विश्लेषण
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {genderPercentages.map(({ gender, count, percentage }) => (
                <div key={gender}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      {getGenderLabel(gender)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {localizeNumber(percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {localizeNumber(count.toLocaleString(), "ne")} जना
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              मुख्य गन्तव्य
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCountries.slice(0, 3).map(([country, count], index) => (
                <div
                  key={country}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {localizeNumber((index + 1).toString(), "ne")}
                    </Badge>
                    <span className="text-sm">{getCountryLabel(country)}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {localizeNumber(count.toLocaleString(), "ne")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              मुख्य उमेर समूह
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topAgeGroup && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {getAgeGroupLabel(topAgeGroup[0])}
                </div>
                <div className="text-sm text-muted-foreground">
                  {localizeNumber(topAgeGroup[1].toLocaleString(), "ne")} जना
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  (
                  {localizeNumber(
                    ((topAgeGroup[1] / totalPopulation) * 100).toFixed(1),
                    "ne",
                  )}
                  %)
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Age Group Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            उमेर समूह अनुसार विस्तृत विश्लेषण
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {ageGroupPercentages
                .slice(0, Math.ceil(ageGroupPercentages.length / 2))
                .map(({ ageGroup, count, percentage }) => (
                  <div key={ageGroup}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {getAgeGroupLabel(ageGroup)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {localizeNumber(percentage.toFixed(1), "ne")}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        {localizeNumber(count.toLocaleString(), "ne")} जना
                      </span>
                      <span>
                        कुलको {localizeNumber(percentage.toFixed(1), "ne")}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="space-y-4">
              {ageGroupPercentages
                .slice(Math.ceil(ageGroupPercentages.length / 2))
                .map(({ ageGroup, count, percentage }) => (
                  <div key={ageGroup}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {getAgeGroupLabel(ageGroup)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {localizeNumber(percentage.toFixed(1), "ne")}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        {localizeNumber(count.toLocaleString(), "ne")} जना
                      </span>
                      <span>
                        कुलको {localizeNumber(percentage.toFixed(1), "ne")}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              मुख्य निष्कर्षहरू
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm">
                    <strong>
                      {getCountryLabel(topCountries[0]?.[0] || "")}
                    </strong>{" "}
                    सबैभन्दा लोकप्रिय गन्तव्य देश हो, जहाँ कुल{" "}
                    {localizeNumber(
                      (
                        ((topCountries[0]?.[1] || 0) / totalPopulation) *
                        100
                      ).toFixed(1),
                      "ne",
                    )}
                    % वैदेशिक कामदारहरू छन्।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm">
                    <strong>{getAgeGroupLabel(topAgeGroup?.[0] || "")}</strong>{" "}
                    उमेर समूहका सबैभन्दा बढी व्यक्तिहरू वैदेशिक रोजगारीमा छन्।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm">
                    लिङ्गगत अनुपात:{" "}
                    {genderPercentages
                      .map(
                        ({ gender, percentage }) =>
                          `${getGenderLabel(gender)} ${localizeNumber(percentage.toFixed(1), "ne")}%`,
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              क्षेत्रगत सुझावहरू
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm">
                    वैदेशिक रोजगारी सीप विकास कार्यक्रमहरू मुख्यतः{" "}
                    {getAgeGroupLabel(topAgeGroup?.[0] || "")}
                    उमेर समूहमा केन्द्रित गर्नुपर्छ।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm">
                    {getCountryLabel(topCountries[0]?.[0] || "")} र{" "}
                    {getCountryLabel(topCountries[1]?.[0] || "")}
                    जस्ता मुख्य गन्तव्य देशहरूको भाषा र सीप तालिममा जोड
                    दिनुपर्छ।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm">
                    महिला वैदेशिक रोजगारीको प्रवर्धनका लागि विशेष कार्यक्रमहरू
                    सञ्चालन गर्नुपर्छ।
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>सांख्यिकीय सारांश</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {localizeNumber(totalPopulation.toLocaleString(), "ne")}
              </div>
              <div className="text-sm text-muted-foreground">
                कुल वैदेशिक कामदार
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {localizeNumber(
                  Object.keys(countryStats).length.toString(),
                  "ne",
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                गन्तव्य देशहरू
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {localizeNumber(
                  Object.keys(ageGroupStats).length.toString(),
                  "ne",
                )}
              </div>
              <div className="text-sm text-muted-foreground">उमेर समूहहरू</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {localizeNumber(
                  Object.keys(genderStats).length.toString(),
                  "ne",
                )}
              </div>
              <div className="text-sm text-muted-foreground">लिङ्ग वर्गहरू</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
