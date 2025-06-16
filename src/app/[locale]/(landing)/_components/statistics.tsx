"use client";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  MapPinned,
  Users,
  Home,
  Trees,
  TrendingUp,
  UserX,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";
import { api } from "@/trpc/react";

interface StatisticsProps {
  municipalityId?: string;
  municipalityName: string;
  lng?: string;
}

const Statistics = ({
  municipalityId,
  municipalityName,
  lng = "ne",
}: StatisticsProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Fetch ward demographics data with fixed query condition
  const { data: wardDemographics, isLoading } =
    api.profile.demographics.heroDemographics.getheroDemographicsSummary.useQuery(
      {
        municipalityId:
          municipalityId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      },
      {
        enabled: true, // Always enable to test with fallback data
        retry: 1,
      },
    );

  // Calculate statistics from ward demographics data
  const totalArea = wardDemographics?.totalAreaSqKm || 163.01;
  const totalPopulation = wardDemographics?.totalPopulation || 21671;
  const averageHouseholdSize = 2.87; // Standard household size used in calculations
  const estimatedHouseholds = Math.round(
    totalPopulation / averageHouseholdSize,
  );
  const populationDensity = wardDemographics?.populationDensity || 133.0;

  // Define stats based on the ward demographics data
  const stats = [
    {
      label: "कुल क्षेत्रफल",
      value: totalArea,
      suffix: "वर्ग कि.मि.",
      icon: <MapPinned className="w-5 h-5" />,
      description: "कुल भूमि क्षेत्रफल",
      color: "from-[#123772] to-[#0b1f42]",
    },
    {
      label: "जनसंख्या",
      value: totalPopulation,
      suffix: "+",
      icon: <Users className="w-5 h-5" />,
      description: "बासिन्दा संख्या",
      color: "from-[#1a4894] to-[#123772]",
    },
    {
      label: "घरधुरी",
      value: estimatedHouseholds,
      suffix: "",
      icon: <Home className="w-5 h-5" />,
      description: `प्रति घर ${localizeNumber(averageHouseholdSize.toFixed(1), "ne")} व्यक्ति`,
      color: "from-[#0b1f42] to-[#123772]",
    },
    {
      label: "जनघनत्व",
      value: populationDensity,
      suffix: "/वर्ग कि.मि.",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "प्रति वर्ग किलोमिटर",
      color: "from-[#123772] to-[#0b1f42]",
    },
  ];

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${municipalityName} जनसांख्यिकीय तथ्याङ्क`,
    description: `${municipalityName}को प्रमुख जनसांख्यिकीय तथ्याङ्क, वडाअनुसार`,
    url: `https://digital.khajuramun.gov.np/${lng}`,
    keywords: [
      `${municipalityName} जनसंख्या`,
      "ward demographics",
      `${municipalityName} जनगणना`,
      "रोल्पा जनसंख्या",
      "नेपालको जनसंख्या",
    ],
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "कुल जनसंख्या",
        value: totalPopulation,
      },
      {
        "@type": "PropertyValue",
        name: "कुल घरधुरी",
        value: estimatedHouseholds,
      },
      {
        "@type": "PropertyValue",
        name: "क्षेत्रफल",
        value: totalArea,
        unitText: "square kilometers",
      },
      {
        "@type": "PropertyValue",
        name: "जनघनत्व",
        value: populationDensity,
        unitText: "per square kilometer",
      },
      {
        "@type": "PropertyValue",
        name: "कुल वडा संख्या",
        value: wardDemographics?.totalWards || 6,
      },
    ],
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
    <>
      {/* Add structured data for SEO */}
      <Script
        id="demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <section
        ref={ref}
        className="relative overflow-hidden"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <div className="py-16 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-3"
          >
            <Badge
              variant="outline"
              className="mb-2 px-3 py-1 bg-white/80 backdrop-blur-sm border-[#123772]/20 shadow-sm inline-flex items-center"
            >
              <TrendingUp className="w-3 h-3 mr-1 text-[#1a4894]" />
              <span className="text-xs text-[#0b1f42] font-medium">
                गाउँपालिका अवलोकन
              </span>
            </Badge>

            <h2
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0b1f42] to-[#1a4894] bg-clip-text text-transparent"
              itemProp="name"
            >
              प्रमुख जनसांख्यिकी
            </h2>

            <p
              className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm"
              itemProp="description"
            >
              हाम्रो स्थानीय शासन र समुदाय विकासलाई परिभाषित गर्ने आवश्यक आँकडा
              र तथ्याङ्क
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <Card className="border-0 overflow-hidden group hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm">
                  <div className="relative h-full">
                    {/* Gradient header */}
                    <div
                      className={`p-2 bg-gradient-to-r ${stat.color} relative`}
                    >
                      <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></div>
                      <div className="relative z-10 flex items-center">
                        <div className="p-1.5 rounded-full bg-white/20 text-white">
                          {stat.icon}
                        </div>
                        <h3 className="ml-2 font-bold text-white text-sm">
                          {stat.label}
                        </h3>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-1">
                          {isLoading ? (
                            <Skeleton className="h-8 w-24" />
                          ) : (
                            <>
                              <span
                                className="text-3xl font-bold text-gray-900"
                                itemProp="value"
                              >
                                {inView && (
                                  <CountUp
                                    end={parseFloat(stat.value.toString())}
                                    duration={2}
                                    decimals={
                                      stat.label === "कुल क्षेत्रफल" ||
                                      stat.label === "जनघनत्व"
                                        ? 2
                                        : 0
                                    }
                                    formattingFn={(value) =>
                                      localizeNumber(value.toString(), "ne")
                                    }
                                  />
                                )}
                              </span>
                              <span className="text-sm font-medium text-[#123772]">
                                {stat.suffix}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {stat.description}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional ward information */}
          {!isLoading && wardDemographics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <div className="overflow-hidden rounded-xl shadow-sm bg-white/90 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#123772]/10">
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <MapPinned className="w-3 h-3 mr-1 opacity-70" />
                      कुल वडा संख्या
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {localizeNumber(
                        (wardDemographics.totalWards || 6).toString(),
                        "ne",
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <Users className="w-3 h-3 mr-1 opacity-70" />
                      औसत वडा जनसंख्या
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {localizeNumber(
                        Math.round(
                          wardDemographics.averageWardPopulation || 0,
                        ).toString(),
                        "ne",
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <MapPinned className="w-3 h-3 mr-1 opacity-70" />
                      औसत वडा क्षेत्रफल
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {localizeNumber(
                        (wardDemographics.averageWardArea || 0).toFixed(2),
                        "ne",
                      )}{" "}
                      <span className="text-sm font-normal text-gray-600">
                        वर्ग कि.मि.
                      </span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <Home className="w-3 h-3 mr-1 opacity-70" />
                      औसत घरधुरी आकार
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {localizeNumber(averageHouseholdSize.toFixed(2), "ne")}{" "}
                      <span className="text-sm font-normal text-gray-600">
                        व्यक्ति
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Statistics;
