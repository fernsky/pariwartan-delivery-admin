"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MunicipalityFacilitiesAnalysisSectionProps {
  facilitiesData: Array<{
    id: string;
    facility: string;
    population: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  totalPopulation: number;
  FACILITY_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function MunicipalityFacilitiesAnalysisSection({
  facilitiesData,
  totalPopulation,
  FACILITY_CATEGORIES,
}: MunicipalityFacilitiesAnalysisSectionProps) {
  // Calculate key insights
  const topFacility = facilitiesData.sort((a, b) => b.population - a.population)[0];
  const leastUsedFacility = facilitiesData.sort((a, b) => a.population - b.population)[0];
  
  // Digital facilities analysis
  const digitalFacilities = facilitiesData.filter(item => 
    ['MOBILE_PHONE', 'COMPUTER', 'INTERNET'].includes(item.facility)
  );
  const digitalPopulation = digitalFacilities.reduce((sum, item) => sum + item.population, 0);
  const digitalAccessRate = totalPopulation > 0 ? (digitalPopulation / totalPopulation * 100) : 0;
  
  // Transport facilities
  const transportFacilities = facilitiesData.filter(item => 
    ['BICYCLE', 'MOTORCYCLE', 'CAR_JEEP'].includes(item.facility)
  );
  const transportPopulation = transportFacilities.reduce((sum, item) => sum + item.population, 0);
  const transportAccessRate = totalPopulation > 0 ? (transportPopulation / totalPopulation * 100) : 0;
  
  // Home appliances
  const applianceFacilities = facilitiesData.filter(item => 
    ['REFRIGERATOR', 'WASHING_MACHINE', 'AIR_CONDITIONER', 'ELECTRICAL_FAN', 'MICROWAVE_OVEN'].includes(item.facility)
  );
  const appliancePopulation = applianceFacilities.reduce((sum, item) => sum + item.population, 0);
  const applianceAccessRate = totalPopulation > 0 ? (appliancePopulation / totalPopulation * 100) : 0;

  // Determine access levels
  const getAccessLevel = (rate: number) => {
    if (rate >= 80) return { level: "उच्च", color: "text-green-600" };
    if (rate >= 60) return { level: "राम्रो", color: "text-blue-600" };
    if (rate >= 40) return { level: "मध्यम", color: "text-yellow-600" };
    if (rate >= 20) return { level: "न्यून", color: "text-orange-600" };
    return { level: "निकै न्यून", color: "text-red-600" };
  };

  const digitalLevel = getAccessLevel(digitalAccessRate);
  const transportLevel = getAccessLevel(transportAccessRate);
  const applianceLevel = getAccessLevel(applianceAccessRate);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>पालिकाका सुविधाहरूको विस्तृत विश्लेषण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">सबैभन्दा धेरै प्रयोग हुने सुविधा</h3>
              {topFacility && (
                <div>
                  <p className="text-lg font-semibold">
                    {FACILITY_CATEGORIES[topFacility.facility]?.name || topFacility.facility}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {localizeNumber(topFacility.population.toLocaleString(), "ne")} जना 
                    ({localizeNumber(((topFacility.population / totalPopulation) * 100).toFixed(1), "ne")}%)
                  </p>
                </div>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">सबैभन्दा कम प्रयोग हुने सुविधा</h3>
              {leastUsedFacility && (
                <div>
                  <p className="text-lg font-semibold">
                    {FACILITY_CATEGORIES[leastUsedFacility.facility]?.name || leastUsedFacility.facility}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {localizeNumber(leastUsedFacility.population.toLocaleString(), "ne")} जना 
                    ({localizeNumber(((leastUsedFacility.population / totalPopulation) * 100).toFixed(1), "ne")}%)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Category Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">डिजिटल पहुँच</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {localizeNumber(digitalAccessRate.toFixed(1), "ne")}%
                </div>
                <div className={`text-sm font-medium ${digitalLevel.color}`}>
                  {digitalLevel.level}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {localizeNumber(digitalPopulation.toLocaleString(), "ne")} जना
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">यातायात पहुँच</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {localizeNumber(transportAccessRate.toFixed(1), "ne")}%
                </div>
                <div className={`text-sm font-medium ${transportLevel.color}`}>
                  {transportLevel.level}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {localizeNumber(transportPopulation.toLocaleString(), "ne")} जना
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">घरायसी उपकरण पहुँच</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {localizeNumber(applianceAccessRate.toFixed(1), "ne")}%
                </div>
                <div className={`text-sm font-medium ${applianceLevel.color}`}>
                  {applianceLevel.level}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {localizeNumber(appliancePopulation.toLocaleString(), "ne")} जना
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Category Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">श्रेणीवार विस्तृत विवरण</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600">डिजिटल सुविधाहरू</h4>
                {digitalFacilities.map((facility) => {
                  const category = FACILITY_CATEGORIES[facility.facility];
                  const percentage = totalPopulation > 0 ? (facility.population / totalPopulation * 100).toFixed(1) : "0";
                  
                  return (
                    <div key={facility.id} className="flex justify-between text-sm">
                      <span>{category?.name || facility.facility}</span>
                      <span className="font-medium">
                        {localizeNumber(percentage, "ne")}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-red-600">यातायात साधनहरू</h4>
                {transportFacilities.map((facility) => {
                  const category = FACILITY_CATEGORIES[facility.facility];
                  const percentage = totalPopulation > 0 ? (facility.population / totalPopulation * 100).toFixed(1) : "0";
                  
                  return (
                    <div key={facility.id} className="flex justify-between text-sm">
                      <span>{category?.name || facility.facility}</span>
                      <span className="font-medium">
                        {localizeNumber(percentage, "ne")}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-green-600">घरायसी उपकरणहरू</h4>
                {applianceFacilities.map((facility) => {
                  const category = FACILITY_CATEGORIES[facility.facility];
                  const percentage = totalPopulation > 0 ? (facility.population / totalPopulation * 100).toFixed(1) : "0";
                  
                  return (
                    <div key={facility.id} className="flex justify-between text-sm">
                      <span>{category?.name || facility.facility}</span>
                      <span className="font-medium">
                        {localizeNumber(percentage, "ne")}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
