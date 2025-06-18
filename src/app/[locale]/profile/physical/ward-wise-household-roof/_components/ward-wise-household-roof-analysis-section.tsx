import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseHouseholdRoofAnalysisSectionProps {
  totalHouseholds: number;
  roofCategoryTotals: Record<string, number>;
  roofCategoryPercentages: Record<string, number>;
  wardWiseModernRoofing: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  worstRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  ROOF_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  housingQualityIndex: number;
}

export default function WardWiseHouseholdRoofAnalysisSection({
  totalHouseholds,
  roofCategoryTotals,
  roofCategoryPercentages,
  wardWiseModernRoofing,
  bestRoofingWard,
  worstRoofingWard,
  ROOF_CATEGORIES,
  housingQualityIndex,
}: WardWiseHouseholdRoofAnalysisSectionProps) {
  // Determine housing quality level based on index score
  const housingQualityLevel =
    housingQualityIndex >= 75
      ? "उत्तम"
      : housingQualityIndex >= 60
        ? "राम्रो"
        : housingQualityIndex >= 40
          ? "मध्यम"
          : "निम्न";

  // Calculate how many households have modern roofing (cement + tile)
  const modernRoofingTotal =
    roofCategoryTotals.CEMENT + roofCategoryTotals.TILE;
  const modernRoofingPercentage = (
    (modernRoofingTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // Calculate how many households have traditional roofing (straw + wood)
  const traditionalRoofingTotal = roofCategoryTotals.STRAW + roofCategoryTotals.WOOD;
  const traditionalRoofingPercentage = (
    (traditionalRoofingTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / परिवर्तन गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-modern-roofing-rate": modernRoofingPercentage,
    "data-best-roofing-ward": bestRoofingWard?.wardNumber.toString() || "",
    "data-worst-roofing-ward": worstRoofingWard?.wardNumber.toString() || "",
    "data-housing-quality-index": housingQualityIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.keys(ROOF_CATEGORIES).map((categoryKey) => {
          const category =
            ROOF_CATEGORIES[categoryKey as keyof typeof ROOF_CATEGORIES];
          const percentage = roofCategoryPercentages[categoryKey];
          const total = roofCategoryTotals[categoryKey];

          return (
            <div
              key={categoryKey}
              className="bg-card p-4 rounded-lg border min-w-[160px]"
              data-roof-type={categoryKey}
              data-households={total}
              data-percentage={percentage.toFixed(2)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="font-medium text-sm">{category.name}</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {localizeNumber(total.toLocaleString(), "ne")}
              </div>
              <div className="text-sm text-muted-foreground">
                {localizeNumber(percentage.toFixed(1), "ne")}% घरधुरी
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          घरको छानाको प्रकारको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Household Roof Type Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-roofing-quality"
            data-ward-number={bestRoofingWard?.wardNumber}
            data-percentage={bestRoofingWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium text-green-700 mb-2">
              सबैभन्दा राम्रो छाना गुणस्तर
            </h4>
            <p className="text-2xl font-bold text-green-600">
              वडा {localizeNumber(bestRoofingWard?.wardNumber.toString() || "0", "ne")}
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(bestRoofingWard?.percentage.toFixed(2) || "0", "ne")}% घरधुरीमा आधुनिक छाना
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              (सिमेन्ट + टायल छाना)
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-roofing-quality"
            data-ward-number={worstRoofingWard?.wardNumber}
            data-percentage={worstRoofingWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium text-red-700 mb-2">
              सुधार आवश्यक वडा
            </h4>
            <p className="text-2xl font-bold text-red-600">
              वडा {localizeNumber(worstRoofingWard?.wardNumber.toString() || "0", "ne")}
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(worstRoofingWard?.percentage.toFixed(2) || "0", "ne")}% घरधुरीमा आधुनिक छाना
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              छाना सुधार कार्यक्रम आवश्यक
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium text-blue-700 mb-2">आधुनिक छाना दर</h4>
            <p className="text-2xl font-bold text-blue-600">
              {localizeNumber(modernRoofingPercentage, "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(modernRoofingTotal.toLocaleString(), "ne")} घरधुरीमा सिमेन्ट वा टायल छाना
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span>लक्ष्य: ८०%</span>
                <span>{localizeNumber(modernRoofingPercentage, "ne")}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(parseFloat(modernRoofingPercentage), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium text-orange-700 mb-2">आवास गुणस्तर सूचकांक</h4>
            <p className="text-2xl font-bold text-orange-600">
              {localizeNumber(housingQualityIndex.toFixed(1), "ne")}/१००
            </p>
            <p className="text-sm text-muted-foreground">
              गुणस्तर स्तर: <span className="font-medium">{housingQualityLevel}</span>
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span>निम्न</span>
                <span>उत्तम</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${housingQualityIndex}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-card p-4 rounded border">
          <h4 className="font-medium mb-3">मुख्य निष्कर्षहरू</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-green-600 mb-2">सकारात्मक पक्षहरू:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {localizeNumber(modernRoofingPercentage, "ne")}% घरधुरीमा आधुनिक छाना</li>
                <li>• सिमेन्ट छाना सबैभन्दा लोकप्रिय ({localizeNumber(roofCategoryPercentages.CEMENT.toFixed(1), "ne")}%)</li>
                <li>• वडा {localizeNumber(bestRoofingWard?.wardNumber.toString() || "0", "ne")} मा उत्कृष्ट छाना गुणस्तर</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-red-600 mb-2">चुनौतीहरू:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {localizeNumber(traditionalRoofingPercentage, "ne")}% घरधुरीमा पारम्परिक छाना</li>
                <li>• वडा {localizeNumber(worstRoofingWard?.wardNumber.toString() || "0", "ne")} मा सुधारको आवश्यकता</li>
                <li>• मौसमी प्रभावबाट जोगिन छाना सुधार आवश्यक</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
