import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FarmersGroupAnalysisSectionProps {
  businessSummary: Array<{
    type: string;
    typeName: string;
    count: number;
    percentage: number;
    icon: string;
  }>;
  totalGroups: number;
  farmsByWard: Array<{
    wardNumber: number;
    farmCount: number;
    farms: Array<{
      id: string;
      name: string;
      type: string;
      typeName: string;
      icon: string;
    }>;
  }>;
  BUSINESS_TYPES: Record<string, string>;
  BUSINESS_TYPES_EN: Record<string, string>;
  BUSINESS_COLORS: Record<string, string>;
  statistics: {
    totalGroups: number;
    totalWards: number;
    avgGroupsPerWard: number;
    mostPopularBusinessType: string;
    mostPopularBusinessTypeName: string;
    mostPopularBusinessTypePercentage: number;
    wardWithMostGroups: number;
    maximumGroupsInAWard: number;
  };
  popularBusinessByWard: Array<{
    wardNumber: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    count: number;
    icon: string;
  }>;
}

export default function FarmersGroupAnalysisSection({
  businessSummary,
  totalGroups,
  farmsByWard,
  BUSINESS_TYPES,
  BUSINESS_TYPES_EN,
  BUSINESS_COLORS,
  statistics,
  popularBusinessByWard,
}: FarmersGroupAnalysisSectionProps) {
  // Find primary and secondary business types
  const primaryBusiness =
    businessSummary.length > 0 ? businessSummary[0] : null;
  const secondaryBusiness =
    businessSummary.length > 1 ? businessSummary[1] : null;

  // Find most concentrated ward (most groups per total municipality groups)
  const mostConcentratedWard = farmsByWard.find(
    (ward) => ward.wardNumber === statistics.wardWithMostGroups,
  );

  // Find wards with no groups
  const wardsWithNoGroups = farmsByWard.filter((ward) => ward.farmCount === 0);

  // Calculate ward distribution inequality (Gini coefficient-like measure)
  const totalFarmsDistributed = farmsByWard.reduce(
    (sum, ward) => sum + ward.farmCount,
    0,
  );
  const perfectDistribution = totalFarmsDistributed / farmsByWard.length;
  const wardDeviation = farmsByWard
    .map((ward) => Math.abs(ward.farmCount - perfectDistribution))
    .reduce((sum, deviation) => sum + deviation, 0);
  const maxPossibleDeviation =
    perfectDistribution * farmsByWard.length * (1 - 1 / farmsByWard.length);
  const inequalityIndex =
    maxPossibleDeviation > 0 ? wardDeviation / maxPossibleDeviation : 0;

  // Calculate business type diversity index (Shannon diversity index-like)
  const businessTypesCount = businessSummary.length;
  const businessEvenness =
    businessSummary.reduce((entropy, business) => {
      const proportion = business.count / totalGroups;
      return entropy - proportion * Math.log(proportion);
    }, 0) / Math.log(businessTypesCount);

  // SEO attributes to include in JSX
  const seoAttributes = {
    "data-municipality": "pariwartan Rural Municipality / परिवर्तन गाउँपालिका",
    "data-total-farms": totalGroups.toString(),
    "data-most-common-business":
      primaryBusiness &&
      `${primaryBusiness.typeName} / ${BUSINESS_TYPES_EN[primaryBusiness.type] || primaryBusiness.type}`,
    "data-ward-distribution": farmsByWard
      .map((w) => `${w.wardNumber}:${w.farmCount}`)
      .join(";"),
  };

  return (
    <>
      <h2 id="economic-impact" className="scroll-m-20 border-b pb-2 mt-12">
        आर्थिक प्रभाव
      </h2>

      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल समूह</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalGroups.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">व्यवसायिक समूह</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सक्रिय वडा</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(statistics.totalWards.toString(), "ne")}/९
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            कृषि व्यवसायिक समूह भएका वडा
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">व्यवसाय प्रकार</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(businessTypesCount.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">विभिन्न व्यवसाय</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          व्यावसायिक कृषि तथा पशुपालन समूहहरूको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Agricultural and Animal Husbandry Analysis of pariwartan
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              प्रमुख व्यवसाय
              <span className="sr-only">
                Main Business in pariwartan Rural Municipality
              </span>
            </h4>
            {primaryBusiness && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      BUSINESS_COLORS[primaryBusiness.type] || "#95a5a6",
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {primaryBusiness.icon} {primaryBusiness.typeName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {localizeNumber(primaryBusiness.count.toString(), "ne")}{" "}
                    समूह (
                    {localizeNumber(
                      primaryBusiness.percentage.toFixed(1),
                      "ne",
                    )}
                    %)
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* Top 3 business types visualization */}
              {businessSummary.slice(0, 3).map((business, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{business.icon}</span>
                      <span>{business.typeName}</span>
                    </span>
                    <span className="font-medium">
                      {localizeNumber(business.percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(business.percentage, 100)}%`,
                        backgroundColor:
                          BUSINESS_COLORS[business.type] || "#95a5a6",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">वडागत वितरण विश्लेषण</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>सबैभन्दा बढी समूह</span>
                  <span className="font-medium">
                    वडा नं.{" "}
                    {localizeNumber(
                      statistics.wardWithMostGroups.toString(),
                      "ne",
                    )}
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${(statistics.maximumGroupsInAWard / totalGroups) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {localizeNumber(
                      statistics.maximumGroupsInAWard.toString(),
                      "ne",
                    )}{" "}
                    समूह
                  </span>
                  <span>
                    कुल को{" "}
                    {localizeNumber(
                      (
                        (statistics.maximumGroupsInAWard / totalGroups) *
                        100
                      ).toFixed(1),
                      "ne",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>निष्क्रिय वडा</span>
                  <span className="font-medium">
                    {localizeNumber(wardsWithNoGroups.length.toString(), "ne")}{" "}
                    वडा
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${(wardsWithNoGroups.length / farmsByWard.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">वडागत समन्वय सूचक</h5>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold">
                    {localizeNumber((inequalityIndex * 100).toFixed(1), "ne")}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    वितरण असमानता सूचक
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {localizeNumber((businessEvenness * 100).toFixed(1), "ne")}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    व्यवसाय विविधता सूचक
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                <p>
                  वितरण असमानता सूचक {(inequalityIndex * 100).toFixed(1)}%
                  भएकोले वडागत रूपमा समूहहरू
                  {inequalityIndex > 0.5 ? " असमान " : " सन्तुलित "}
                  वितरण भएको देखाउँछ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विस्तृत विश्लेषण</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>व्यवसाय वितरण:</strong> पालिकामा सबैभन्दा बढी
                  {primaryBusiness?.typeName
                    ? ` ${primaryBusiness.typeName} `
                    : " "}
                  समूहहरू (
                  {localizeNumber(
                    primaryBusiness?.percentage.toFixed(1) || "0",
                    "ne",
                  )}
                  %) र त्यसपछि
                  {secondaryBusiness?.typeName
                    ? ` ${secondaryBusiness.typeName} `
                    : " "}
                  (
                  {localizeNumber(
                    secondaryBusiness?.percentage.toFixed(1) || "0",
                    "ne",
                  )}
                  %) समूहहरू रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>वडागत वितरण:</strong> वडा नं.{" "}
                  {localizeNumber(
                    statistics.wardWithMostGroups.toString(),
                    "ne",
                  )}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    statistics.maximumGroupsInAWard.toString(),
                    "ne",
                  )}{" "}
                  समूहहरू रहेका छन्, जुन कुल समूहहरूको{" "}
                  {localizeNumber(
                    (
                      (statistics.maximumGroupsInAWard / totalGroups) *
                      100
                    ).toFixed(1),
                    "ne",
                  )}
                  % हो।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>समग्र अवस्था:</strong> कुल ९ वडा मध्ये{" "}
                  {localizeNumber(statistics.totalWards.toString(), "ne")} वडामा
                  व्यावसायिक कृषि तथा पशुपालन समूहहरू सक्रिय रहेका छन्। औसतमा
                  प्रति वडा{" "}
                  {localizeNumber(statistics.avgGroupsPerWard.toFixed(1), "ne")}
                  समूह रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>व्यवसाय विविधता:</strong> पालिकामा{" "}
                  {localizeNumber(businessTypesCount.toString(), "ne")}
                  प्रकारका व्यवसाय रहेका छन्। समग्रमा विविधता सूचक{" "}
                  {localizeNumber((businessEvenness * 100).toFixed(1), "ne")}%
                  रहेको छ, जसले{" "}
                  {businessEvenness > 0.6
                    ? "उच्च"
                    : businessEvenness > 0.4
                      ? "मध्यम"
                      : "न्युन"}{" "}
                  विविधता देखाउँछ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">आर्थिक प्रभाव विश्लेषण</h4>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-1">रोजगारी सिर्जना</h5>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(totalGroups.toString(), "ne")} व्यावसायिक
                  समूहले अनुमानित
                  {localizeNumber((totalGroups * 4).toString(), "ne")} देखि{" "}
                  {localizeNumber((totalGroups * 7).toString(), "ne")}
                  जना व्यक्तिहरूलाई प्रत्यक्ष रोजगारी दिएको अनुमान गर्न सकिन्छ।
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">उत्पादन क्षमता</h5>
                <p className="text-sm text-muted-foreground">
                  प्रति समूह औसत वार्षिक उत्पादन मूल्य रु. २ लाखदेखि ५ लाखसम्म
                  हुने अनुमान गरिँदा, कुल वार्षिक उत्पादन मूल्य रु.{" "}
                  {localizeNumber(
                    ((totalGroups * 200000) / 1000000).toFixed(2),
                    "ne",
                  )}
                  करोडदेखि रु.{" "}
                  {localizeNumber(
                    ((totalGroups * 500000) / 1000000).toFixed(2),
                    "ne",
                  )}{" "}
                  करोडसम्म हुनसक्छ।
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित तथ्याङ्क</h5>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/profile/economics/municipality-wide-food-crops"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  खाद्यान्न बाली उत्पादन
                </Link>
                <Link
                  href="/profile/economics/agriculture-production"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
                </Link>
                <Link
                  href="/profile/demographics/occupation-distribution"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  पेशागत वितरण
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-4">समूह प्रोफाइल</h4>
          <p className="text-sm">
            परिवर्तन गाउँपालिकामा सञ्चालित व्यावसायिक कृषि तथा पशुपालन समूहहरूले
            स्थानीय अर्थतन्त्रमा उल्लेखनीय योगदान पुर्‍याइरहेका छन्।{" "}
            {primaryBusiness?.typeName} समूहहरूले बजारमा उल्लेखनीय हिस्सा ओगटेका
            छन्। वडा नं.{" "}
            {localizeNumber(statistics.wardWithMostGroups.toString(), "ne")}
            मा सबैभन्दा बढी समूह रहनुले यस क्षेत्रमा व्यावसायिक कृषि र पशुपालनको
            विकासका लागि थप अवसर रहेको देखाउँछ। आगामी दिनमा निष्क्रिय वडाहरूमा
            लक्षित कार्यक्रम र व्यवसाय विविधीकरणमा जोड दिनुपर्ने देखिन्छ।
          </p>
        </div>
      </div>

      <h2 id="group-profile" className="scroll-m-20 border-b pb-2 mt-12">
        समूह प्रोफाइल
      </h2>
      <p className="mt-4">
        परिवर्तन गाउँपालिकाका व्यावसायिक कृषि तथा पशुपालन समूहहरूले विभिन्न
        प्रकारका व्यावसायिक कृषि, पशुपालन र बागवानी क्षेत्रहरूमा काम गरिरहेका
        छन्। यी समूहहरूले उत्पादन, प्रशोधन, बजारीकरण र मूल्य श्रृंखला विकासमा
        महत्त्वपूर्ण भूमिका निर्वाह गर्दछन्।
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">
            {businessSummary[0]?.icon || "🧑‍🌾"}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {businessSummary[0]?.typeName || ""}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            परिवर्तनमा सबैभन्दा लोकप्रिय व्यावसायिक समूह, जुन कुल समूहको
            {localizeNumber(
              businessSummary[0]?.percentage.toFixed(1) || "0",
              "ne",
            )}
            % हिस्सा ओगट्छ।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              {localizeNumber(
                businessSummary[0]?.count.toString() || "0",
                "ne",
              )}{" "}
              समूह
            </span>
            <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">
              प्रमुख व्यवसाय
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">
            {businessSummary[1]?.icon || "🧑‍🌾"}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {businessSummary[1]?.typeName || ""}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            दोस्रो सबैभन्दा लोकप्रिय व्यावसायिक समूह, जुन कुल समूहको
            {localizeNumber(
              businessSummary[1]?.percentage.toFixed(1) || "0",
              "ne",
            )}
            % हिस्सा ओगट्छ।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              {localizeNumber(
                businessSummary[1]?.count.toString() || "0",
                "ne",
              )}{" "}
              समूह
            </span>
            <span className="text-sm px-2 py-1 rounded bg-secondary/10 text-secondary">
              दोस्रो व्यवसाय
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-semibold mb-2">सबैभन्दा सक्रिय वडा</h3>
          <p className="text-muted-foreground text-sm mb-4">
            वडा नं.{" "}
            {localizeNumber(statistics.wardWithMostGroups.toString(), "ne")} मा
            सबैभन्दा बढी
            {localizeNumber(
              statistics.maximumGroupsInAWard.toString(),
              "ne",
            )}{" "}
            समूह सक्रिय छन्।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              मुख्य व्यवसाय:{" "}
              {popularBusinessByWard.find(
                (w) => w.wardNumber === statistics.wardWithMostGroups,
              )?.mostCommonTypeName || ""}
            </span>
            <span className="text-sm px-2 py-1 rounded bg-blue-500/10 text-blue-600">
              अग्रणी वडा
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
