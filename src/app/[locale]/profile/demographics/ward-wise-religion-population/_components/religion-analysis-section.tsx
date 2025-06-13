import { localizeNumber } from "@/lib/utils/localize-number";

interface ReligionAnalysisProps {
  religionData: Array<{
    id?: string;
    religionType: string;
    malePopulation: number;
    femalePopulation: number;
    totalPopulation: number;
    percentage: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionAnalysisSection({
  religionData,
  RELIGION_NAMES,
}: ReligionAnalysisProps) {
  // Modern aesthetic color palette for religions
  const RELIGION_COLORS = {
    HINDU: "#6366F1", // Indigo
    BUDDHIST: "#8B5CF6", // Purple
    KIRANT: "#EC4899", // Pink
    CHRISTIAN: "#F43F5E", // Rose
    ISLAM: "#10B981", // Emerald
    NATURE: "#06B6D4", // Cyan
    BON: "#3B82F6", // Blue
    JAIN: "#F59E0B", // Amber
    BAHAI: "#84CC16", // Lime
    SIKH: "#9333EA", // Fuchsia
    OTHER: "#14B8A6", // Teal
  };

  // Calculate total population
  const totalPopulation = religionData.reduce(
    (sum, item) => sum + item.totalPopulation,
    0,
  );

  // Sort religions by population for analysis
  const sortedReligions = [...religionData].sort(
    (a, b) => b.totalPopulation - a.totalPopulation,
  );

  // Calculate top two religions ratio if both exist
  const topReligion = sortedReligions[0];
  const secondReligion = sortedReligions[1];

  const topTwoReligionRatio =
    topReligion && secondReligion && secondReligion.totalPopulation > 0
      ? (topReligion.totalPopulation / secondReligion.totalPopulation).toFixed(
          2,
        )
      : "N/A";

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {sortedReligions.slice(0, 6).map((item, index) => {
          // Define English religion name for SEO
          const religionEN =
            item.religionType === "HINDU"
              ? "Hindu"
              : item.religionType === "BUDDHIST"
                ? "Buddhist"
                : item.religionType === "KIRANT"
                  ? "Kirat"
                  : item.religionType === "CHRISTIAN"
                    ? "Christian"
                    : item.religionType === "ISLAM"
                      ? "Islam"
                      : item.religionType === "NATURE"
                        ? "Nature Worship"
                        : item.religionType === "BON"
                          ? "Bon"
                          : item.religionType === "JAIN"
                            ? "Jain"
                            : item.religionType === "BAHAI"
                              ? "Bahai"
                              : item.religionType === "SIKH"
                                ? "Sikh"
                                : "Other";

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.totalPopulation /
                      sortedReligions[0].totalPopulation) *
                      100,
                    100,
                  )}%`,
                  backgroundColor:
                    RELIGION_COLORS[
                      item.religionType as keyof typeof RELIGION_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {RELIGION_NAMES[item.religionType] || item.religionType}
                  <span className="sr-only">{religionEN}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(item.percentage.toFixed(2), "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.totalPopulation.toLocaleString(), "ne")}{" "}
                  व्यक्ति
                  <span className="sr-only">
                    ({item.totalPopulation.toLocaleString()} people)
                  </span>
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  <span>
                    पुरुष:{" "}
                    {localizeNumber(item.malePopulation.toLocaleString(), "ne")}
                  </span>
                  <span className="mx-2">|</span>
                  <span>
                    महिला:{" "}
                    {localizeNumber(
                      item.femalePopulation.toLocaleString(),
                      "ne",
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          परिवर्तन गाउँपालिकाको धार्मिक विविधता विश्लेषण
          <span className="sr-only">
            Religious Diversity Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              परिवर्तन गाउँपालिकाको प्रमुख धर्म
              <span className="sr-only">
                Main Religion in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topReligion
                ? RELIGION_NAMES[topReligion.religionType] ||
                  topReligion.religionType
                : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topReligion
                ? `कुल जनसंख्याको ${localizeNumber(topReligion.percentage.toFixed(2), "ne")}% व्यक्ति`
                : ""}
              <span className="sr-only">
                {topReligion
                  ? `${topReligion.percentage.toFixed(2)}% of total population in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              परिवर्तन गाउँपालिकाको प्रमुख-दोस्रो धर्म अनुपात
              <span className="sr-only">
                Primary to Secondary Religion Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(topTwoReligionRatio, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topReligion && secondReligion
                ? `हरेक ${localizeNumber(topTwoReligionRatio, "ne")} ${RELIGION_NAMES[topReligion.religionType] || topReligion.religionType} अवलम्बनकर्ताका लागि १ ${RELIGION_NAMES[secondReligion.religionType] || secondReligion.religionType} अवलम्बनकर्ता`
                : ""}
              <span className="sr-only">
                {topReligion && secondReligion
                  ? `For every ${topTwoReligionRatio} ${topReligion.religionType.toLowerCase()} followers, there is 1 ${secondReligion.religionType.toLowerCase()} follower in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              कुल धर्महरूको संख्या
              <span className="sr-only">Total Number of Religions</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(religionData.length, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              परिवर्तन गाउँपालिकामा विभिन्न धर्मावलम्बी बसोबास गर्छन्
              <span className="sr-only">
                Different religious communities live in Khajura Rural
                Municipality
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
