"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import ForeignEmploymentSEO from "./_components/foreign-employment-seo";
import ForeignEmploymentCountriesCharts from "./_components/foreign-employment-countries-charts";
import ForeignEmploymentAnalysisSection from "./_components/foreign-employment-analysis-section";
import {
  foreignEmploymentCountryOptions,
  ageGroupOptions,
  genderOptions,
  type AgeGroupType,
  type GenderType,
  type CountryRegionType,
} from "@/server/api/routers/profile/economics/ward-wise-foreign-employment-countries.schema";

export default function WardWiseForeignEmploymentCountriesPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<
    AgeGroupType | undefined
  >();
  const [selectedGender, setSelectedGender] = useState<
    GenderType | undefined
  >();
  const [selectedCountry, setSelectedCountry] = useState<
    CountryRegionType | undefined
  >();
  const [activeTab, setActiveTab] = useState<
    "overview" | "analysis" | "charts"
  >("overview");

  // Fetch data with filters
  const {
    data: employmentData,
    isLoading,
    error,
  } = api.profile.economics.wardWiseForeignEmploymentCountries.getAll.useQuery({
    ageGroup: selectedAgeGroup,
    gender: selectedGender,
    country: selectedCountry,
  });

  // Fetch summary data
  const { data: summaryData, isLoading: summaryLoading } =
    api.profile.economics.wardWiseForeignEmploymentCountries.summary.useQuery();

  const clearFilters = () => {
    setSelectedAgeGroup(undefined);
    setSelectedGender(undefined);
    setSelectedCountry(undefined);
  };

  const hasFilters = selectedAgeGroup || selectedGender || selectedCountry;

  // Calculate totals
  const totalPopulation =
    employmentData?.reduce((sum, item) => sum + (item.population || 0), 0) || 0;
  const uniqueCountries = new Set(employmentData?.map((item) => item.country))
    .size;
  const uniqueAgeGroups = new Set(employmentData?.map((item) => item.ageGroup))
    .size;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <ForeignEmploymentSEO />
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">डाटा लोड गर्न समस्या भयो</div>
          <Button onClick={() => window.location.reload()}>पुनः प्रयास</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ForeignEmploymentSEO />

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">वडागत वैदेशिक रोजगारी देशहरू</h1>
          <p className="text-muted-foreground mt-2">
            विभिन्न देशहरूमा वैदेशिक रोजगारीमा गएका व्यक्तिहरूको वडागत विवरण
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="rounded-b-none"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            सिंहावलोकन
          </Button>
          <Button
            variant={activeTab === "charts" ? "default" : "ghost"}
            onClick={() => setActiveTab("charts")}
            className="rounded-b-none"
          >
            <PieChart className="w-4 h-4 mr-2" />
            चार्टहरू
          </Button>
          <Button
            variant={activeTab === "analysis" ? "default" : "ghost"}
            onClick={() => setActiveTab("analysis")}
            className="rounded-b-none"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            विश्लेषण
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            फिल्टर
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                उमेर समूह
              </label>
              <Select
                value={selectedAgeGroup || ""}
                onValueChange={(value) =>
                  setSelectedAgeGroup((value as AgeGroupType) || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="उमेर समूह छान्नुहोस्" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">सबै उमेर समूह</SelectItem>
                  {ageGroupOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">लिङ्ग</label>
              <Select
                value={selectedGender || ""}
                onValueChange={(value) =>
                  setSelectedGender((value as GenderType) || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="लिङ्ग छान्नुहोस्" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">सबै लिङ्ग</SelectItem>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                देश/क्षेत्र
              </label>
              <Select
                value={selectedCountry || ""}
                onValueChange={(value) =>
                  setSelectedCountry((value as CountryRegionType) || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="देश छान्नुहोस्" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">सबै देश</SelectItem>
                  {foreignEmploymentCountryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="w-full"
              >
                फिल्टर हटाउनुहोस्
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                सक्रिय फिल्टरहरू:
              </span>
              {selectedAgeGroup && (
                <Badge variant="secondary">
                  {
                    ageGroupOptions.find(
                      (opt) => opt.value === selectedAgeGroup,
                    )?.label
                  }
                </Badge>
              )}
              {selectedGender && (
                <Badge variant="secondary">
                  {
                    genderOptions.find((opt) => opt.value === selectedGender)
                      ?.label
                  }
                </Badge>
              )}
              {selectedCountry && (
                <Badge variant="secondary">
                  {
                    foreignEmploymentCountryOptions.find(
                      (opt) => opt.value === selectedCountry,
                    )?.label
                  }
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>डाटा लोड गर्दै...</span>
        </div>
      )}

      {/* Summary Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">कुल जनसंख्या</p>
                  <p className="text-2xl font-bold">
                    {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    देशहरूको संख्या
                  </p>
                  <p className="text-2xl font-bold">
                    {localizeNumber(uniqueCountries.toString(), "ne")}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <PieChart className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">उमेर समूह</p>
                  <p className="text-2xl font-bold">
                    {localizeNumber(uniqueAgeGroups.toString(), "ne")}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">डाटा रेकर्ड</p>
                  <p className="text-2xl font-bold">
                    {localizeNumber(
                      (employmentData?.length || 0).toString(),
                      "ne",
                    )}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <Filter className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content based on active tab */}
      {!isLoading && employmentData && (
        <>
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>डाटा तालिका</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-gray-200 p-2 text-left">
                            उमेर समूह
                          </th>
                          <th className="border border-gray-200 p-2 text-left">
                            लिङ्ग
                          </th>
                          <th className="border border-gray-200 p-2 text-left">
                            देश
                          </th>
                          <th className="border border-gray-200 p-2 text-right">
                            जनसंख्या
                          </th>
                          <th className="border border-gray-200 p-2 text-right">
                            कुल
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {employmentData.slice(0, 50).map((item, index) => (
                          <tr
                            key={item.id || index}
                            className="hover:bg-muted/50"
                          >
                            <td className="border border-gray-200 p-2">
                              {ageGroupOptions.find(
                                (opt) => opt.value === item.ageGroup,
                              )?.label || item.ageGroup}
                            </td>
                            <td className="border border-gray-200 p-2">
                              {genderOptions.find(
                                (opt) => opt.value === item.gender,
                              )?.label || item.gender}
                            </td>
                            <td className="border border-gray-200 p-2">
                              {foreignEmploymentCountryOptions.find(
                                (opt) => opt.value === item.country,
                              )?.label || item.country}
                            </td>
                            <td className="border border-gray-200 p-2 text-right">
                              {localizeNumber(
                                (item.population || 0).toLocaleString(),
                                "ne",
                              )}
                            </td>
                            <td className="border border-gray-200 p-2 text-right">
                              {localizeNumber(
                                (item.total || 0).toLocaleString(),
                                "ne",
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {employmentData.length > 50 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      पहिलो ५० रेकर्डहरू मात्र देखाइएको छ। कुल रेकर्डहरू:{" "}
                      {localizeNumber(employmentData.length.toString(), "ne")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "charts" && (
            <ForeignEmploymentCountriesCharts data={employmentData} />
          )}

          {activeTab === "analysis" && (
            <ForeignEmploymentAnalysisSection
              data={employmentData}
              summaryData={summaryData}
              isLoading={summaryLoading}
            />
          )}
        </>
      )}

      {/* No Data State */}
      {!isLoading && (!employmentData || employmentData.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              यो फिल्टरको लागि कुनै डाटा उपलब्ध छैन
            </div>
            <Button onClick={clearFilters} disabled={!hasFilters}>
              सबै डाटा हेर्नुहोस्
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
