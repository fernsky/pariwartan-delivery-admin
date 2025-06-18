import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MunicipalityFacilitiesAnalysisSectionProps {
  facilitiesData: Array<{
    id: string;
    facility: string;
    population: number;
    createdAt: Date | null;
    updatedAt: Date | null;
  }>;
  totalPopulation: number;
  facilityTypeTotals: Record<string, number>;
  facilityTypePercentages: Record<string, number>;
  FACILITY_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
  digitalAccessIndex: number;
  topFacility: any;
  leastUsedFacility: any;
}

export default function MunicipalityFacilitiesAnalysisSection({
  facilitiesData,
  totalPopulation,
  facilityTypeTotals,
  facilityTypePercentages,
  FACILITY_CATEGORIES,
  digitalAccessIndex,
  topFacility,
  leastUsedFacility,
}: MunicipalityFacilitiesAnalysisSectionProps) {
  // Determine digital access level based on index score
  const digitalAccessLevel =
    digitalAccessIndex >= 75
      ? "उच्च"
      : digitalAccessIndex >= 50
        ? "राम्रो"
        : digitalAccessIndex >= 30
          ? "मध्यम"
          : "न्यून";

  // Calculate facility category groups
  const digitalFacilities = ['MOBILE_PHONE', 'COMPUTER', 'INTERNET'];
  const transportFacilities = ['BICYCLE', 'MOTORCYCLE', 'CAR_JEEP'];
  const applianceFacilities = ['REFRIGERATOR', 'WASHING_MACHINE', 'AIR_CONDITIONER', 'ELECTRICAL_FAN', 'MICROWAVE_OVEN'];
  const mediaCommunicationFacilities = ['TELEVISION', 'RADIO', 'DAILY_NATIONAL_NEWSPAPER_ACCESS'];

  const digitalPopulation = digitalFacilities.reduce((sum, facility) => {
    return sum + (facilityTypeTotals[facility] || 0);
  }, 0);

  const transportPopulation = transportFacilities.reduce((sum, facility) => {
    return sum + (facilityTypeTotals[facility] || 0);
  }, 0);

  const appliancePopulation = applianceFacilities.reduce((sum, facility) => {
    return sum + (facilityTypeTotals[facility] || 0);
  }, 0);

  const mediaPopulation = mediaCommunicationFacilities.reduce((sum, facility) => {
    return sum + (facilityTypeTotals[facility] || 0);
  }, 0);

  // Calculate access rates
  const digitalAccessRate = totalPopulation > 0 ? (digitalPopulation / (totalPopulation * digitalFacilities.length)) * 100 : 0;
  const transportAccessRate = totalPopulation > 0 ? (transportPopulation / (totalPopulation * transportFacilities.length)) * 100 : 0;
  const applianceAccessRate = totalPopulation > 0 ? (appliancePopulation / (totalPopulation * applianceFacilities.length)) * 100 : 0;
  const mediaAccessRate = totalPopulation > 0 ? (mediaPopulation / (totalPopulation * mediaCommunicationFacilities.length)) * 100 : 0;

  // Determine access levels
  const getAccessLevel = (rate: number) => {
    if (rate >= 80) return { level: "उच्च", color: "text-green-600", bgColor: "bg-green-50" };
    if (rate >= 60) return { level: "राम्रो", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (rate >= 40) return { level: "मध्यम", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    if (rate >= 20) return { level: "न्यून", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { level: "निकै न्यून", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const digitalLevel = getAccessLevel(digitalAccessRate);
  const transportLevel = getAccessLevel(transportAccessRate);
  const applianceLevel = getAccessLevel(applianceAccessRate);
  const mediaLevel = getAccessLevel(mediaAccessRate);

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / परिवर्तन गाउँपालिका",
    "data-total-population": totalPopulation.toString(),
    "data-mobile-rate": facilityTypePercentages.MOBILE_PHONE?.toFixed(2) || "0.00",
    "data-internet-rate": facilityTypePercentages.INTERNET?.toFixed(2) || "0.00",
    "data-computer-rate": facilityTypePercentages.COMPUTER?.toFixed(2) || "0.00",
    "data-digital-access-index": digitalAccessIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        id="facilities-usage-analysis"
        {...seoAttributes}
      >
        {["MOBILE_PHONE", "TELEVISION", "INTERNET", "COMPUTER"].map(
          (facilityKey) => {
            const population = facilityTypeTotals[facilityKey] || 0;
            const percentage = facilityTypePercentages[facilityKey] || 0;
            const category = FACILITY_CATEGORIES[facilityKey];

            return (
              <Card key={facilityKey} className="min-w-[200px]">
                <CardContent className="p-4 text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: category?.color || "#8884d8" }}
                  >
                    {facilityKey === "MOBILE_PHONE" && "📱"}
                    {facilityKey === "TELEVISION" && "📺"}
                    {facilityKey === "INTERNET" && "🌐"}
                    {facilityKey === "COMPUTER" && "💻"}
                  </div>
                  <h3 className="font-semibold text-sm mb-2">
                    {category?.name || facilityKey}
                  </h3>
                  <div className="text-2xl font-bold mb-1">
                    {localizeNumber(percentage.toFixed(1), "ne")}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {localizeNumber(population.toLocaleString(), "ne")} जना
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border" id="digital-access-status">
        <h3 className="text-xl font-medium mb-6">
          घरायसी सुविधाको प्रयोगको विस्तृत विश्लेषण
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">सुविधा श्रेणी अनुसार विश्लेषण</h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-md ${digitalLevel.bgColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">डिजिटल सुविधाहरू</span>
                  <Badge variant="outline" className={digitalLevel.color}>
                    {digitalLevel.level}
                  </Badge>
                </div>
                <div className={`text-sm ${digitalLevel.color}`}>
                  औसत पहुँच: {localizeNumber(digitalAccessRate.toFixed(1), "ne")}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  मोबाइल फोन, कम्प्युटर, इन्टरनेट
                </div>
              </div>

              <div className={`p-3 rounded-md ${transportLevel.bgColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">यातायात साधन</span>
                  <Badge variant="outline" className={transportLevel.color}>
                    {transportLevel.level}
                  </Badge>
                </div>
                <div className={`text-sm ${transportLevel.color}`}>
                  औसत पहुँच: {localizeNumber(transportAccessRate.toFixed(1), "ne")}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  साइकल, मोटरसाइकल, कार/जीप
                </div>
              </div>

              <div className={`p-3 rounded-md ${applianceLevel.bgColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">घरायसी उपकरणहरू</span>
                  <Badge variant="outline" className={applianceLevel.color}>
                    {applianceLevel.level}
                  </Badge>
                </div>
                <div className={`text-sm ${applianceLevel.color}`}>
                  औसत पहुँच: {localizeNumber(applianceAccessRate.toFixed(1), "ne")}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  फ्रिज, वाशिङ मेसिन, एयर कन्डिसनर, पंखा
                </div>
              </div>

              <div className={`p-3 rounded-md ${mediaLevel.bgColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">सञ्चार माध्यम</span>
                  <Badge variant="outline" className={mediaLevel.color}>
                    {mediaLevel.level}
                  </Badge>
                </div>
                <div className={`text-sm ${mediaLevel.color}`}>
                  औसत पहुँच: {localizeNumber(mediaAccessRate.toFixed(1), "ne")}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  टेलिभिजन, रेडियो, पत्रिका
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">मुख्य निष्कर्षहरू</h4>
            <div className="space-y-4">
              {topFacility && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h5 className="font-medium text-green-800 mb-2">
                    सबैभन्दा बढी प्रयोग हुने सुविधा
                  </h5>
                  <p className="text-green-700">
                    <strong>{FACILITY_CATEGORIES[topFacility.facility]?.name || topFacility.facility}</strong>
                  </p>
                  <p className="text-sm text-green-600">
                    {localizeNumber(topFacility.population.toLocaleString(), "ne")} जना ({localizeNumber(((topFacility.population / totalPopulation) * 100).toFixed(1), "ne")}%)
                  </p>
                </div>
              )}

              {leastUsedFacility && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <h5 className="font-medium text-red-800 mb-2">
                    सबैभन्दा कम प्रयोग हुने सुविधा
                  </h5>
                  <p className="text-red-700">
                    <strong>{FACILITY_CATEGORIES[leastUsedFacility.facility]?.name || leastUsedFacility.facility}</strong>
                  </p>
                  <p className="text-sm text-red-600">
                    {localizeNumber(leastUsedFacility.population.toLocaleString(), "ne")} जना ({localizeNumber(((leastUsedFacility.population / totalPopulation) * 100).toFixed(1), "ne")}%)
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h5 className="font-medium text-blue-800 mb-2">
                  डिजिटल पहुँच सूचकांक
                </h5>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {localizeNumber(digitalAccessIndex.toFixed(1), "ne")}%
                  </span>
                  <Badge variant={digitalAccessIndex >= 50 ? "default" : "secondary"}>
                    {digitalAccessLevel}
                  </Badge>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  मोबाइल फोन, कम्प्युटर र इन्टरनेट सुविधाको आधारमा
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mt-8 border" id="facilities-expansion-strategy">
        <h3 className="text-xl font-medium mb-4">सुविधा विस्तार रणनीति</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-blue-700">तत्काल प्राथमिकता</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>इन्टरनेट सुविधाको पहुँच विस्तार गर्ने</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>कम्प्युटर साक्षरता कार्यक्रम सञ्चालन गर्ने</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>डिजिटल डिभाइड कम गर्ने</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-green-700">दीर्घकालीन लक्ष्य</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>स्मार्ट गाउँपालिकाको विकास</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>सबै घरमा आधुनिक सुविधाको पहुँच</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>डिजिटल नेपालको लक्ष्य प्राप्ति</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
