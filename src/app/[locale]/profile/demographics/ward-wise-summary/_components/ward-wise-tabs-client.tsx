"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, Table2 } from "lucide-react";
import PopulationDistributionCharts from "./charts/population-distribution-charts";
import HouseholdCharts from "./charts/household-charts";
import GenderRatioCharts from "./charts/gender-ratio-charts";

interface WardWiseTabsClientProps {
  wardPopulationData: Array<{
    ward: string;
    population: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    percentage: string;
    households: number;
  }>;
  wardHouseholdData: Array<{
    ward: string;
    households: number;
    householdSize: number;
  }>;
  wardSexRatioData: Array<{
    ward: string;
    sexRatio: number;
    population: number;
  }>;
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
  GENDER_NAMES: Record<string, string>;
}

export default function WardWiseTabsClient({
  wardPopulationData,
  wardHouseholdData,
  wardSexRatioData,
  municipalityStats,
  municipalityAverages,
  GENDER_NAMES,
}: WardWiseTabsClientProps) {
  return (
    <>
      {/* Ward-wise Population Distribution */}
      <section id="ward-population-distribution" className="mt-12">
        <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold">वडागत जनसंख्या वितरण</h3>
            <p className="text-sm text-muted-foreground">
              प्रत्येक वडाको जनसंख्या वितरण र तुलनात्मक विश्लेषण
            </p>
          </div>

          <Tabs defaultValue="bar" className="w-full">
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bar" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  बार चार्ट
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  पाई चार्ट
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table2 className="w-4 h-4" />
                  तालिका
                </TabsTrigger>
              </TabsList>
            </div>

            <PopulationDistributionCharts
              selectedTab="bar"
              wardPopulationData={wardPopulationData}
              municipalityStats={municipalityStats}
              municipalityAverages={municipalityAverages}
            />
          </Tabs>
        </div>
      </section>

      {/* Household Analysis */}
      <section id="household-analysis" className="mt-12">
        <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold">घरधुरी विश्लेषण</h3>
            <p className="text-sm text-muted-foreground">
              वडागत घरधुरी संख्या र औसत परिवार आकारको विश्लेषण
            </p>
          </div>

          <Tabs defaultValue="bar" className="w-full">
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bar">घरधुरी संख्या</TabsTrigger>
                <TabsTrigger value="household-size">परिवार आकार</TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <HouseholdCharts
              householdTab="bar"
              wardHouseholdData={wardHouseholdData}
              wardPopulationData={wardPopulationData}
              municipalityStats={municipalityStats}
              municipalityAverages={municipalityAverages}
            />
          </Tabs>
        </div>
      </section>

      {/* Gender Ratio Analysis */}
      <section id="gender-ratio-analysis" className="mt-12">
        <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold">लैंगिक अनुपात विश्लेषण</h3>
            <p className="text-sm text-muted-foreground">
              वडागत लैंगिक संरचना र अनुपातको तुलनात्मक अध्ययन
            </p>
          </div>

          <Tabs defaultValue="bar" className="w-full">
            <div className="border-b bg-muted/40">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bar">लैंगिक अनुपात</TabsTrigger>
                <TabsTrigger value="stacked">लैंगिक वितरण</TabsTrigger>
                <TabsTrigger value="table">तालिका</TabsTrigger>
              </TabsList>
            </div>

            <GenderRatioCharts
              genderTab="bar"
              wardSexRatioData={wardSexRatioData}
              wardPopulationData={wardPopulationData}
              municipalityStats={municipalityStats}
              municipalityAverages={municipalityAverages}
              GENDER_NAMES={GENDER_NAMES}
            />
          </Tabs>
        </div>
      </section>
    </>
  );
}
