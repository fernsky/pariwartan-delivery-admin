"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GridIcon,
  Home,
  Users,
  MapPin,
  PieChart,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";
import { api } from "@/trpc/react";

interface WardInfoProps {
  municipalityId?: string;
  lng: string;
  municipalityName?: string;
}

const WardInfo: React.FC<WardInfoProps> = ({
  municipalityId,
  lng,
  municipalityName = "परिवर्तन गाउँपालिका",
}) => {
  // State to track selected ward for mobile view
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  // Fetch ward table data with fixed query condition
  const { data: wardTableData, isLoading } =
    api.profile.demographics.heroDemographics.getWardTable.useQuery(
      {
        municipalityId:
          municipalityId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      },
      {
        enabled: true, // Always enable to test with fallback data
        retry: 1,
      },
    );

  // Process ward data for display
  const processedWards = useMemo(() => {
    if (!wardTableData?.wards || wardTableData.wards.length === 0) {
      return [];
    }

    return wardTableData.wards.map((ward) => {
      const colorMap: Record<number, string> = {
        1: "from-[#0b1f42] via-[#123772] to-[#1a4894]",
        2: "from-[#123772] via-[#1a4894] to-[#0b1f42]",
        3: "from-[#1a4894] via-[#0b1f42] to-[#123772]",
        4: "from-[#123772] via-[#0b1f42] to-[#1a4894]",
        5: "from-[#0b1f42] via-[#1a4894] to-[#123772]",
        6: "from-[#1a4894] via-[#123772] to-[#0b1f42]",
      };

      return {
        number: ward.wardNo,
        name: ward.includedVdcOrMunicipality,
        households: ward.estimatedHouseholds,
        population: ward.population,
        area: ward.areaSqKm,
        density: ward.populationDensity,
        color:
          colorMap[ward.wardNo] || "from-[#123772] via-[#1a4894] to-[#0b1f42]",
      };
    });
  }, [wardTableData]);

  // Use totals from API response
  const wardTotals = useMemo(() => {
    if (!wardTableData?.totals) {
      return {
        totalPopulation: 0,
        totalHouseholds: 0,
        totalArea: 0,
        avgDensity: 0,
      };
    }

    return {
      totalPopulation: wardTableData.totals.totalPopulation,
      totalHouseholds: wardTableData.totals.totalEstimatedHouseholds,
      totalArea: wardTableData.totals.totalAreaSqKm,
      avgDensity: wardTableData.totals.averagePopulationDensity,
    };
  }, [wardTableData]);

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${municipalityName}का वडाहरू - जनसांख्यिकीय तथ्याङ्क`,
    description: `${municipalityName}का वडाहरूको जनसंख्या, घरधुरी, क्षेत्रफल र अन्य महत्वपूर्ण तथ्याङ्क`,
    url: `https://digital.khajuramun.gov.np/${lng}/profile/demographics`,
    keywords: [
      `${municipalityName} वडा`,
      `${municipalityName} वडा विवरण`,
      "ward demographics",
    ],
    variableMeasured: processedWards.map((ward) => ({
      "@type": "PropertyValue",
      name: `वडा ${ward.number}`,
      value: {
        जनसंख्या: ward.population,
        घरधुरी: ward.households,
        क्षेत्रफल: ward.area,
        जनघनत्व: ward.density,
        "समावेश गरिएको क्षेत्र": ward.name,
      },
    })),
    creator: {
      "@type": "Organization",
      name: municipalityName,
    },
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div
      id="ward-info"
      className="relative overflow-hidden"
      itemScope
      itemType="https://schema.org/Dataset"
    >
      {/* Add structured data for SEO */}
      <Script
        id="wards-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="py-16 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-2 px-3 py-1 bg-white/80 backdrop-blur-sm border-[#123772]/20 shadow-sm inline-flex items-center"
          >
            <GridIcon className="w-3 h-3 mr-1 text-[#1a4894]" />
            <span className="text-xs text-[#0b1f42] font-medium">
              प्रशासनिक विभाजन
            </span>
          </Badge>

          <h2
            className="text-2xl md:text-3xl font-bold mb-1.5 bg-gradient-to-r from-[#0b1f42] to-[#1a4894] bg-clip-text text-transparent"
            itemProp="name"
          >
            वडा जानकारी
          </h2>

          <p
            className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm"
            itemProp="description"
          >
            {municipalityName}को प्रत्येक वडाको आधारभूत जानकारी र समावेश गरिएका
            क्षेत्रहरू
          </p>
        </motion.div>

        {isLoading ? (
          <WardInfoSkeleton />
        ) : processedWards.length === 0 ? (
          <EmptyWardState />
        ) : (
          <>
            {/* Desktop/Tablet Layout - Enhanced Table View */}
            <div className="hidden md:block overflow-hidden rounded-xl shadow-sm bg-white/90 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#123772]/5 text-left">
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        वडा नं.
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        समावेश गरिएको क्षेत्र
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>जनसंख्या</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5" />
                          <span>घरधुरी</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>क्षेत्रफल (वर्ग कि.मि.)</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <PieChart className="w-3.5 h-3.5" />
                          <span>जनघनत्व</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedWards.map((ward, idx) => (
                      <motion.tr
                        key={ward.number}
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: idx * 0.1 }}
                        className={`hover:bg-[#123772]/5 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#123772]/5"}`}
                      >
                        <td className="py-3 px-4 border-b border-[#123772]/5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r ${ward.color} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}
                            >
                              {localizeNumber(ward.number.toString(), "ne")}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-[#123772]/5">
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 text-sm leading-relaxed">
                              {ward.name}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-[#123772]/5">
                          <span className="font-semibold text-gray-900">
                            {localizeNumber(
                              ward.population.toLocaleString(),
                              "ne",
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-[#123772]/5">
                          <span className="font-semibold text-gray-900">
                            {localizeNumber(
                              ward.households.toLocaleString(),
                              "ne",
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-[#123772]/5">
                          <span className="font-semibold text-gray-900">
                            {localizeNumber(ward.area.toString(), "ne")}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-[#123772]/5">
                          <span className="font-semibold text-gray-900">
                            {localizeNumber(ward.density.toString(), "ne")}
                          </span>
                        </td>
                      </motion.tr>
                    ))}

                    {/* Totals Row */}
                    <tr className="bg-[#123772]/10 font-medium border-t-2 border-[#123772]/20">
                      <td className="py-4 px-4">
                        <div className="text-[#0b1f42] font-bold text-sm">
                          जम्मा
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#0b1f42] font-bold text-sm">
                          {processedWards.length} वडा
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#0b1f42] font-bold">
                          {localizeNumber(
                            wardTotals.totalPopulation.toLocaleString(),
                            "ne",
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#0b1f42] font-bold">
                          {localizeNumber(
                            wardTotals.totalHouseholds.toLocaleString(),
                            "ne",
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#0b1f42] font-bold">
                          {localizeNumber(
                            wardTotals.totalArea.toFixed(2),
                            "ne",
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#0b1f42] font-bold">
                          {localizeNumber(
                            wardTotals.avgDensity.toFixed(2),
                            "ne",
                          )}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Layout - Enhanced Cards */}
            <div className="md:hidden">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-2.5"
              >
                {processedWards.map((ward) => (
                  <MobileWardCard
                    key={ward.number}
                    ward={ward}
                    isSelected={selectedWard === ward.number}
                    onSelect={() =>
                      setSelectedWard(
                        selectedWard === ward.number ? null : ward.number,
                      )
                    }
                    lng={lng}
                  />
                ))}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Enhanced Mobile Card with Ward Name
const MobileWardCard = ({
  ward,
  isSelected,
  onSelect,
  lng,
}: {
  ward: any;
  isSelected: boolean;
  onSelect: () => void;
  lng: string;
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      className="relative"
    >
      <Card className="border-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
        {/* Card Header with basic info */}
        <div
          className={`bg-gradient-to-r ${ward.color} p-3 flex items-center justify-between relative cursor-pointer`}
          onClick={onSelect}
        >
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></div>

          <div className="flex-1 z-10 relative">
            <div className="flex items-center mb-1">
              <h3 className="font-bold text-white text-base mr-2">
                वडा {localizeNumber(ward.number.toString(), "ne")}
              </h3>
              <div className="bg-white/20 w-px h-4 mr-2"></div>
              <div className="text-white/90">
                <Users className="inline-block w-3 h-3 mr-1" />
                <span className="font-medium text-sm">
                  {localizeNumber(ward.population.toLocaleString(), "ne")}
                </span>
              </div>
            </div>
            <p className="text-white/80 text-xs line-clamp-1">{ward.name}</p>
          </div>

          <motion.div
            animate={{ rotate: isSelected ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="z-10 relative"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-2">
                {/* Ward Name */}
                <div className="p-2 bg-[#123772]/5 rounded-md">
                  <span className="text-xs text-gray-500 block">
                    समावेश गरिएको क्षेत्र
                  </span>
                  <p className="font-medium text-gray-900 text-sm">
                    {ward.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {/* Households */}
                  <div className="flex items-center p-1.5 bg-[#123772]/5 rounded-md">
                    <Home className="w-3 h-3 text-[#1a4894] mr-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">घरधुरी</span>
                      <p className="font-medium text-gray-900">
                        {localizeNumber(ward.households.toLocaleString(), "ne")}
                      </p>
                    </div>
                  </div>

                  {/* Area */}
                  <div className="flex items-center p-1.5 bg-[#123772]/5 rounded-md">
                    <MapPin className="w-3 h-3 text-[#1a4894] mr-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">क्षेत्रफल</span>
                      <p className="font-medium text-gray-900">
                        {localizeNumber(ward.area.toString(), "ne")}{" "}
                        <span className="text-xs">वर्ग कि.मि.</span>
                      </p>
                    </div>
                  </div>

                  {/* Population Density */}
                  <div className="flex items-center p-1.5 bg-[#123772]/5 rounded-md col-span-2">
                    <PieChart className="w-3 h-3 text-[#1a4894] mr-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">जनघनत्व</span>
                      <p className="font-medium text-gray-900">
                        {localizeNumber(ward.density.toString(), "ne")}{" "}
                        <span className="text-xs">व्यक्ति/वर्ग कि.मि.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Skeleton loader with a table layout - updated to blue scheme
const WardInfoSkeleton = () => (
  <div className="overflow-hidden rounded-xl shadow-sm bg-white/90">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#123772]/5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <th
                key={i}
                className="py-3 px-4 text-left border-b border-[#123772]/10"
              >
                <Skeleton className="h-5 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#123772]/5"}>
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <td key={j} className="py-3 px-4 border-b border-[#123772]/5">
                  {j === 1 ? (
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                    </div>
                  ) : (
                    <Skeleton className="h-5 w-16" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Empty state with updated blue styling
const EmptyWardState = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-8 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-[#123772]/10"
  >
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="p-3 rounded-full bg-[#123772]/10 text-[#0b1f42]">
        <GridIcon className="w-5 h-5" />
      </div>
      <p className="text-gray-500 text-sm">वडा सम्बन्धी जानकारी उपलब्ध छैन</p>
    </div>
  </motion.div>
);

export default WardInfo;
