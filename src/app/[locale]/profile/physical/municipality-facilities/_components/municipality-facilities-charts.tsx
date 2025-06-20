import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";
import MunicipalityFacilitiesBarChart from "./charts/municipality-facilities-bar-chart";
import MunicipalityFacilitiesPieChart from "./charts/municipality-facilities-pie-chart";

interface MunicipalityFacilitiesChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  facilitiesData: Array<{
    id: string;
    facility: string;
    population: number;
    createdAt: Date | null;
    updatedAt: Date | null;
  }>;
  totalPopulation: number;
  facilityTypeTotals: Record<string, number>;
  facilityMap: Record<string, string>;
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

export default function MunicipalityFacilitiesCharts({
  pieChartData,
  facilitiesData,
  totalPopulation,
  facilityTypeTotals,
  facilityMap,
  facilityTypePercentages,
  FACILITY_CATEGORIES,
  digitalAccessIndex,
  topFacility,
  leastUsedFacility,
}: MunicipalityFacilitiesChartsProps) {
  // Calculate key statistics
  const mobilePhonePopulation = facilityTypeTotals.MOBILE_PHONE || 0;
  const internetPopulation = facilityTypeTotals.INTERNET || 0;
  const computerPopulation = facilityTypeTotals.COMPUTER || 0;
  const televisionPopulation = facilityTypeTotals.TELEVISION || 0;

  const mobilePhonePercentage = facilityTypePercentages.MOBILE_PHONE || 0;
  const internetPercentage = facilityTypePercentages.INTERNET || 0;
  const computerPercentage = facilityTypePercentages.COMPUTER || 0;
  const televisionPercentage = facilityTypePercentages.TELEVISION || 0;

  return (
    <>
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">मोबाइल फोन</p>
                <p className="text-2xl font-bold text-blue-600">
                  {localizeNumber(mobilePhonePercentage.toFixed(1), "ne")}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {localizeNumber(mobilePhonePopulation.toLocaleString(), "ne")} जना
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                📱
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">इन्टरनेट सुविधा</p>
                <p className="text-2xl font-bold text-green-600">
                  {localizeNumber(internetPercentage.toFixed(1), "ne")}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {localizeNumber(internetPopulation.toLocaleString(), "ne")} जना
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                🌐
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">कम्प्युटर/ल्यापटप</p>
                <p className="text-2xl font-bold text-purple-600">
                  {localizeNumber(computerPercentage.toFixed(1), "ne")}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {localizeNumber(computerPopulation.toLocaleString(), "ne")} जना
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                💻
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">टेलिभिजन</p>
                <p className="text-2xl font-bold text-orange-600">
                  {localizeNumber(televisionPercentage.toFixed(1), "ne")}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {localizeNumber(televisionPopulation.toLocaleString(), "ne")} जना
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                📺
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall facilities distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="distribution-of-household-facilities"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Household Facilities Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of household facilities with a total population of ${totalPopulation}`}
        />
        
        <div className="p-6 border-b bg-muted/30">
          <h2 className="text-2xl font-bold mb-2">घरायसी सुविधाको वितरण</h2>
          <p className="text-muted-foreground">
            कुल जनसंख्या {localizeNumber(totalPopulation.toLocaleString(), "ne")} को आधारमा विभिन्न सुविधाहरूको वितरण
          </p>
        </div>

        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-6 mb-0">
            <TabsTrigger value="pie">पाई चार्ट</TabsTrigger>
            <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pie" className="p-6">
            <div className="h-[400px]">
              <MunicipalityFacilitiesPieChart
                pieChartData={pieChartData}
                FACILITY_CATEGORIES={FACILITY_CATEGORIES}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="bar" className="p-6">
            <div className="h-[400px]">
              <MunicipalityFacilitiesBarChart
                facilitiesData={facilitiesData}
                FACILITY_CATEGORIES={FACILITY_CATEGORIES}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Top Facilities Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 सबैभन्दा बढी प्रयोग हुने सुविधाहरू
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">सबैभन्दा बढी प्रयोग</h4>
              {topFacility && (
                <div>
                  <p className="font-semibold">
                    {FACILITY_CATEGORIES[topFacility.facility]?.name || facilityMap[topFacility.facility]}
                  </p>
                  <p className="text-sm text-green-700">
                    {localizeNumber(topFacility.population.toLocaleString(), "ne")} जना 
                    ({localizeNumber(((topFacility.population / totalPopulation) * 100).toFixed(1), "ne")}%)
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">सबैभन्दा कम प्रयोग</h4>
              {leastUsedFacility && (
                <div>
                  <p className="font-semibold">
                    {FACILITY_CATEGORIES[leastUsedFacility.facility]?.name || facilityMap[leastUsedFacility.facility]}
                  </p>
                  <p className="text-sm text-red-700">
                    {localizeNumber(leastUsedFacility.population.toLocaleString(), "ne")} जना 
                    ({localizeNumber(((leastUsedFacility.population / totalPopulation) * 100).toFixed(1), "ne")}%)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">डिजिटल पहुँच सूचकांक</h4>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">
                {localizeNumber(digitalAccessIndex.toFixed(1), "ne")}%
              </div>
              <Badge variant={digitalAccessIndex >= 50 ? "default" : "secondary"}>
                {digitalAccessIndex >= 75 ? "उच्च" : 
                 digitalAccessIndex >= 50 ? "मध्यम" : 
                 digitalAccessIndex >= 25 ? "न्यून" : "निकै न्यून"}
              </Badge>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              मोबाइल फोन, कम्प्युटर र इन्टरनेट सुविधाको आधारमा गणना
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
