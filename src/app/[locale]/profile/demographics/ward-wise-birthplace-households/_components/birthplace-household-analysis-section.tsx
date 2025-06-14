"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthplaceHouseholdAnalysisSectionProps {
  overallSummary: Array<{
    birthPlace: string;
    birthPlaceName: string;
    households: number;
  }>;
  totalHouseholds: number;
  ageGroupAnalysis: Array<{
    ageGroup: string;
    totalPopulation: number;
    mostCommonBirthplace: string;
    mostCommonBirthplaceCount: number;
    mostCommonBirthplacePercentage: string;
  }>;
  BIRTH_PLACE_NAMES: Record<string, string>;
  BIRTH_PLACE_NAMES_EN: Record<string, string>;
}

export default function BirthplaceHouseholdAnalysisSection({
  overallSummary,
  totalHouseholds,
  ageGroupAnalysis,
  BIRTH_PLACE_NAMES,
  BIRTH_PLACE_NAMES_EN,
}: BirthplaceHouseholdAnalysisSectionProps) {
  // Consistent color palette for birthplace categories
  const BIRTH_PLACE_COLORS = {
    SAME_MUNICIPALITY: "#1A759F", // Blue for same municipality
    SAME_DISTRICT_ANOTHER_MUNICIPALITY: "#34A0A4", // Light blue for same district
    ANOTHER_DISTRICT: "#76C893", // Green for another district
    ABROAD: "#D9ED92", // Yellow for abroad
  };

  // Find age groups with highest and lowest local population
  const highestLocalAgeGroup = [...ageGroupAnalysis].sort((a, b) => {
    const aLocalCount =
      a.mostCommonBirthplace === "SAME_MUNICIPALITY"
        ? a.mostCommonBirthplaceCount
        : 0;
    const bLocalCount =
      b.mostCommonBirthplace === "SAME_MUNICIPALITY"
        ? b.mostCommonBirthplaceCount
        : 0;
    return bLocalCount - aLocalCount;
  })[0];

  const highestMigrationAgeGroup = [...ageGroupAnalysis].sort((a, b) => {
    const aMigrationCount =
      a.mostCommonBirthplace === "ANOTHER_DISTRICT"
        ? a.mostCommonBirthplaceCount
        : 0;
    const bMigrationCount =
      b.mostCommonBirthplace === "ANOTHER_DISTRICT"
        ? b.mostCommonBirthplaceCount
        : 0;
    return bMigrationCount - aMigrationCount;
  })[0];

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / परिवर्तन गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-households",
        totalHouseholds.toString(),
      );

      // Add most common birthplace data
      if (overallSummary.length > 0) {
        document.body.setAttribute(
          "data-most-common-birthplace",
          `${overallSummary[0].birthPlaceName} / ${BIRTH_PLACE_NAMES_EN[overallSummary[0].birthPlace as keyof typeof BIRTH_PLACE_NAMES_EN] || overallSummary[0].birthPlace}`,
        );
        document.body.setAttribute(
          "data-most-common-birthplace-percentage",
          ((overallSummary[0].households / totalHouseholds) * 100).toFixed(2),
        );
      }

      // Add age group data
      document.body.setAttribute(
        "data-highest-local-age-group",
        highestLocalAgeGroup?.ageGroup || "",
      );
      document.body.setAttribute(
        "data-highest-migration-age-group",
        highestMigrationAgeGroup?.ageGroup || "",
      );
    }
  }, [
    overallSummary,
    totalHouseholds,
    highestLocalAgeGroup,
    highestMigrationAgeGroup,
    BIRTH_PLACE_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.map((item, index) => {
          const percentage = (
            (item.households / totalHouseholds) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              data-birthplace={`${BIRTH_PLACE_NAMES_EN[item.birthPlace as keyof typeof BIRTH_PLACE_NAMES_EN] || item.birthPlace} / ${item.birthPlaceName}`}
              data-households={item.households}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.households /
                      Math.max(...overallSummary.map((i) => i.households))) *
                      100,
                    100,
                  )}%`,
                  backgroundColor:
                    BIRTH_PLACE_COLORS[
                      item.birthPlace as keyof typeof BIRTH_PLACE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.birthPlaceName}
                  <span className="sr-only">
                    {BIRTH_PLACE_NAMES_EN[
                      item.birthPlace as keyof typeof BIRTH_PLACE_NAMES_EN
                    ] || item.birthPlace}
                  </span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  जनसंख्या
                  <span className="sr-only">
                    ({item.households.toLocaleString()} population)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          जन्मस्थान विश्लेषण
          <span className="sr-only">Birthplace Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="most-common-birthplace"
            data-percentage={
              overallSummary.length > 0
                ? (
                    (overallSummary[0].households / totalHouseholds) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख जन्मस्थान
              <span className="sr-only">
                Most Common Birthplace in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {overallSummary.length > 0
                ? overallSummary[0].birthPlaceName
                : ""}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(
                overallSummary.length > 0
                  ? (
                      (overallSummary[0].households / totalHouseholds) *
                      100
                    ).toFixed(2)
                  : "0",
                "ne",
              )}
              % (
              {localizeNumber(
                overallSummary.length > 0
                  ? overallSummary[0].households.toLocaleString()
                  : "0",
                "ne",
              )}{" "}
              जनसंख्या)
              <span className="sr-only">
                {overallSummary.length > 0
                  ? (
                      (overallSummary[0].households / totalHouseholds) *
                      100
                    ).toFixed(2)
                  : "0"}
                % (
                {overallSummary.length > 0 ? overallSummary[0].households : 0}{" "}
                population)
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="local-birthplace"
          >
            <h4 className="font-medium mb-2">
              स्थानीय जन्मस्थान भएको जनसंख्या
              <span className="sr-only">
                Population with Local Birthplace in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                (
                  overallSummary.find(
                    (item) => item.birthPlace === "SAME_MUNICIPALITY",
                  )?.households || 0
                ).toString(),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(
                (
                  ((overallSummary.find(
                    (item) => item.birthPlace === "SAME_MUNICIPALITY",
                  )?.households || 0) /
                    totalHouseholds) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % जनसंख्या
              <span className="sr-only">
                {(
                  ((overallSummary.find(
                    (item) => item.birthPlace === "SAME_MUNICIPALITY",
                  )?.households || 0) /
                    totalHouseholds) *
                  100
                ).toFixed(2)}
                % of population are local
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            उमेर समूहगत जन्मस्थान विश्लेषण
            <span className="sr-only">Age-group-wise Birthplace Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display top two most common birthplaces */}
            {overallSummary.slice(0, 2).map((item, index) => (
              <div key={index}>
                <h5 className="text-sm font-medium">{item.birthPlaceName}</h5>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(
                    ((item.households / totalHouseholds) * 100).toFixed(2),
                    "ne",
                  )}
                  % ({localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  जनसंख्या)
                </p>
                <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((item.households / totalHouseholds) * 100, 100)}%`,
                      backgroundColor:
                        BIRTH_PLACE_COLORS[
                          item.birthPlace as keyof typeof BIRTH_PLACE_COLORS
                        ] || "#888",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">
                उमेर समूहगत प्रमुख जन्मस्थान
              </h5>
              <ul className="mt-2 text-sm space-y-1">
                {ageGroupAnalysis.slice(0, 3).map((ageGroup, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{ageGroup.ageGroup}:</span>
                    <span className="font-medium">
                      {BIRTH_PLACE_NAMES[
                        ageGroup.mostCommonBirthplace as keyof typeof BIRTH_PLACE_NAMES
                      ] || ageGroup.mostCommonBirthplace}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium">
                जन्मस्थान सम्बन्धी विशेषता
              </h5>
              <p className="mt-2 text-sm text-muted-foreground">
                {overallSummary.find(
                  (item) => item.birthPlace === "SAME_MUNICIPALITY",
                )
                  ? `परिवर्तन गाउँपालिकामा ${localizeNumber((((overallSummary.find((item) => item.birthPlace === "SAME_MUNICIPALITY")?.households || 0) / totalHouseholds) * 100).toFixed(2), "ne")}% जनसंख्याको जन्मस्थान यहि गाउँपालिकामा रहेको छ।`
                  : "जन्मस्थान सम्बन्धी विवरण उपलब्ध छैन।"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
