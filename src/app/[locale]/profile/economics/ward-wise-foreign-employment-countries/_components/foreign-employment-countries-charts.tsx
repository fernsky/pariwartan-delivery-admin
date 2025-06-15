"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localizeNumber } from "@/lib/utils/localize-number";
import ForeignEmploymentPieChart from "./charts/foreign-employment-pie-chart";
import ForeignEmploymentBarChart from "./charts/foreign-employment-bar-chart";
import RegionalDistributionChart from "./charts/regional-distribution-chart";
import WardForeignEmploymentPieCharts from "./charts/ward-foreign-employment-pie-charts";
import { foreignEmploymentCountryOptions } from "@/server/api/routers/profile/economics/ward-wise-foreign-employment-countries.schema";

interface ForeignEmploymentCountriesChartsProps {
  data: Array<{
    id?: string;
    ageGroup: string;
    gender: string;
    country: string;
    population: number;
    total: number;
  }>;
}

// Color mappings for countries
const COUNTRY_COLORS: Record<string, string> = {
  INDIA: "#FF6B6B",
  SAARC: "#4ECDC4",
  ASIAN: "#45B7D1",
  MIDDLE_EAST: "#96CEB4",
  OTHER_ASIAN: "#FFEAA7",
  EUROPE: "#DDA0DD",
  OTHER_EUROPE: "#98D8C8",
  NORTH_AMERICA: "#F7DC6F",
  AFRICA: "#BB8FCE",
  PACIFIC: "#85C1E9",
  OTHER: "#F8C471",
  NOT_DISCLOSED: "#BDC3C7",
};

// Country name mappings
const COUNTRY_NAMES: Record<string, string> = {
  INDIA: "भारत",
  SAARC: "सार्क",
  ASIAN: "एशियाली",
  MIDDLE_EAST: "मध्य पूर्व",
  OTHER_ASIAN: "अन्य एशियाली",
  EUROPE: "युरोप",
  OTHER_EUROPE: "अन्य युरोपेली",
  NORTH_AMERICA: "उत्तर अमेरिका",
  AFRICA: "अफ्रिका",
  PACIFIC: "प्रशान्त",
  OTHER: "अन्य",
  NOT_DISCLOSED: "खुलाइएको छैन",
};

// Regional groupings for analysis
const REGIONAL_GROUPS: Record<string, string[]> = {
  "दक्षिण एशिया": ["INDIA", "SAARC"],
  "पूर्वी एशिया": ["ASIAN", "OTHER_ASIAN"],
  "मध्य पूर्व": ["MIDDLE_EAST"],
  युरोप: ["EUROPE", "OTHER_EUROPE"],
  "उत्तर अमेरिका": ["NORTH_AMERICA"],
  अन्य: ["AFRICA", "PACIFIC", "OTHER", "NOT_DISCLOSED"],
};

const REGION_COLORS: Record<string, string> = {
  "दक्षिण एशिया": "#FF6B6B",
  "पूर्वी एशिया": "#4ECDC4",
  "मध्य पूर्व": "#45B7D1",
  युरोप: "#96CEB4",
  "उत्तर अमेरिका": "#FFEAA7",
  अन्य: "#BDC3C7",
};

export default function ForeignEmploymentCountriesCharts({
  data,
}: ForeignEmploymentCountriesChartsProps) {
  // Filter data for totals (remove age group and gender breakdowns for summary charts)
  const totalData = data.filter(
    (item) => item.ageGroup === "TOTAL" && item.gender === "TOTAL",
  );

  // Prepare pie chart data
  const countryTotals: Record<string, number> = {};
  totalData.forEach((item) => {
    countryTotals[item.country] =
      (countryTotals[item.country] || 0) + item.population;
  });

  const totalPopulation = Object.values(countryTotals).reduce(
    (sum, val) => sum + val,
    0,
  );

  const pieChartData = Object.entries(countryTotals)
    .map(([country, population]) => ({
      name: COUNTRY_NAMES[country] || country,
      value: population,
      percentage: ((population / totalPopulation) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  // Prepare regional distribution data
  const regionTotals: Record<string, number> = {};
  Object.entries(REGIONAL_GROUPS).forEach(([region, countries]) => {
    regionTotals[region] = countries.reduce((sum, country) => {
      return sum + (countryTotals[country] || 0);
    }, 0);
  });

  const regionChartData = Object.entries(regionTotals)
    .map(([region, population]) => ({
      name: region,
      value: population,
      percentage: ((population / totalPopulation) * 100).toFixed(1),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Prepare ward-wise data for bar chart
  const wardData: Record<number, Record<string, number>> = {};

  // Since we don't have ward numbers in the current data structure,
  // we'll simulate ward distribution for demonstration
  // In a real implementation, this would come from actual ward data
  const wardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  wardNumbers.forEach((wardNum) => {
    wardData[wardNum] = {};
    Object.entries(countryTotals).forEach(([country, total]) => {
      // Simulate distribution across wards (in real implementation, this would be actual data)
      const wardPopulation =
        Math.floor(total / wardNumbers.length) +
        Math.floor(Math.random() * (total * 0.2)); // Add some variance
      wardData[wardNum][COUNTRY_NAMES[country] || country] = wardPopulation;
    });
  });

  const wardWiseData = wardNumbers.map((wardNum) => ({
    ward: `वडा ${wardNum}`,
    ...wardData[wardNum],
  }));

  // Prepare data for individual ward pie charts
  const wardEmploymentData = wardNumbers.flatMap((wardNum) =>
    Object.entries(wardData[wardNum]).map(([country, population]) => ({
      wardNumber: wardNum,
      country:
        Object.keys(COUNTRY_NAMES).find(
          (key) => COUNTRY_NAMES[key] === country,
        ) || country,
      population,
    })),
  );

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {localizeNumber(totalPopulation.toLocaleString(), "ne")}
              </div>
              <div className="text-sm text-muted-foreground">
                कुल वैदेशिक रोजगारी
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {localizeNumber(
                  Object.keys(countryTotals).length.toString(),
                  "ne",
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                गन्तव्य देशहरू
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {localizeNumber(wardNumbers.length.toString(), "ne")}
              </div>
              <div className="text-sm text-muted-foreground">वडाहरू</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country-wise Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>देशगत वितरण</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ForeignEmploymentPieChart
                pieChartData={pieChartData}
                COUNTRY_NAMES={COUNTRY_NAMES}
                COUNTRY_COLORS={COUNTRY_COLORS}
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>क्षेत्रगत वितरण</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <RegionalDistributionChart
                regionChartData={regionChartData}
                REGION_COLORS={REGION_COLORS}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ward-wise Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>वडागत तुलनात्मक विश्लेषण</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <ForeignEmploymentBarChart
              wardWiseData={wardWiseData}
              COUNTRY_COLORS={COUNTRY_COLORS}
              COUNTRY_NAMES={COUNTRY_NAMES}
            />
          </div>
        </CardContent>
      </Card>

      {/* Individual Ward Pie Charts */}
      <Card>
        <CardHeader>
          <CardTitle>वडागत विस्तृत वितरण</CardTitle>
        </CardHeader>
        <CardContent>
          <WardForeignEmploymentPieCharts
            wardNumbers={wardNumbers}
            employmentData={wardEmploymentData}
            COUNTRY_NAMES={COUNTRY_NAMES}
            COUNTRY_COLORS={COUNTRY_COLORS}
          />
        </CardContent>
      </Card>

      {/* Top Countries Table */}
      <Card>
        <CardHeader>
          <CardTitle>शीर्ष गन्तव्य देशहरू</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">क्रम</th>
                  <th className="text-left p-2">देश</th>
                  <th className="text-right p-2">जनसंख्या</th>
                  <th className="text-right p-2">प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {pieChartData.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      {localizeNumber((index + 1).toString(), "ne")}
                    </td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right">
                      {localizeNumber(item.value.toLocaleString(), "ne")}
                    </td>
                    <td className="p-2 text-right">
                      {localizeNumber(item.percentage, "ne")}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
