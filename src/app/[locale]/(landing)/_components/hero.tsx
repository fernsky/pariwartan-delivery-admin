"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Mountain,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Users,
  Home,
} from "lucide-react";
import Head from "next/head";
import { localizeNumber } from "@/lib/utils/localize-number";
import Image from "next/image";
import { api } from "@/trpc/react";
import { ScenicNepalBackground } from "@/components/ui/scenic-nepal-background";

interface HeroProps {
  lng: string;
  municipalityName: string;
  municipalityNameEn: string;
  municipalityId?: string;
  demographicData?: {
    totalPopulation?: number | null;
    totalHouseholds?: number | null;
    areaSqKm?: string | null;
    populationDensity?: string | null;
    id?: string;
  } | null;
}

const Hero: React.FC<HeroProps> = ({
  lng,
  municipalityName,
  municipalityNameEn,
  municipalityId,
  demographicData,
}) => {
  // Fetch ward demographics data with fixed query condition
  const {
    data: wardDemographics,
    isLoading,
    error,
  } = api.profile.demographics.heroDemographics.getheroDemographicsSummary.useQuery(
    {
      municipalityId: municipalityId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    },
    {
      enabled: true, // Always enable to test with fallback data
      retry: 1,
      refetchOnWindowFocus: false,
    },
  );

  // Log for debugging
  console.log("Ward demographics data:", wardDemographics);
  console.log("Loading state:", isLoading);
  console.log("Error:", error);

  // Use ward demographics data or fallback to existing data
  const totalArea =
    wardDemographics?.totalAreaSqKm ||
    (demographicData?.areaSqKm ? parseFloat(demographicData.areaSqKm) : 163.01);

  const wardCount = wardDemographics?.totalWards || 6;
  const population =
    wardDemographics?.totalPopulation ||
    demographicData?.totalPopulation ||
    21671;
  const households =
    demographicData?.totalHouseholds || Math.round(population / 2.87); // Average household size estimation

  // SEO description with actual data
  const seoDescription = `${municipalityName} (${municipalityNameEn}) - ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि. क्षेत्रफल, ${localizeNumber(wardCount.toString(), "ne")} प्रशासनिक वडाहरू, ${localizeNumber(population.toString(), "ne")} जनसंख्या। बाँके जिल्लाको प्राकृतिक सुन्दरता र समृद्ध संस्कृति। सम्पूर्ण जानकारी र नक्सा यहाँ उपलब्ध छ।`;

  return (
    <>
      {/* SEO Structured Data */}
      <Head>
        <meta name="description" content={seoDescription} />
        <meta
          property="og:title"
          content={`${municipalityName} | आधिकारिक वेबसाइट`}
        />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentOrganization",
            name: municipalityName,
            alternateName: municipalityNameEn,
            url: `https://${lng === "en" ? "en." : ""}paribartan.digprofile.com`,
            logo: "https://paribartan.digprofile.com/logo.png",
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Paribartan",
              containedIn: "Banke District, Nepal",
              description: seoDescription,
              additionalProperty: [
                {
                  "@type": "PropertyValue",
                  name: "population",
                  value: population,
                },
                {
                  "@type": "PropertyValue",
                  name: "numberOfWards",
                  value: wardCount,
                },
                {
                  "@type": "PropertyValue",
                  name: "totalArea",
                  value: totalArea,
                  unitCode: "KMQ",
                },
              ],
            },
          })}
        </script>
      </Head>

      {/* Background Container with Image */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pariwartan_gp.jpg"
            alt="Pariwartan GP Landscape"
            fill
            className="object-cover blur-sm"
            priority
            quality={75}
          />

          {/* Enhanced overlay with better contrast and gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f42]/60 via-[#123772]/50 to-[#1a4894]/40 z-10"></div>

          {/* Additional subtle texture */}
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-3 mix-blend-overlay z-10"></div>
        </div>

        {/* Content Section */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pt-16">
          {/* Hero Content Container with improved text readability */}
          <motion.div
            className="w-full max-w-4xl mx-auto rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Municipality Name with text shadow for better contrast */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-2 text-center text-white drop-shadow-md"
              itemProp="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {municipalityName}
            </motion.h1>

            {/* Location with subtle text shadow */}
            <motion.div
              className="text-base sm:text-lg leading-relaxed mb-6 text-gray-100 max-w-2xl mx-auto text-center drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              रोल्पा जिल्ला, लुम्बिनी प्रदेश
            </motion.div>

            {/* Key Metrics Cards with ward demographics data */}
            <motion.div
              className="flex flex-wrap gap-4 items-center justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Area Card */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894]">
                <Mountain className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि.
                </span>
              </div>

              {/* Ward Count Card */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {localizeNumber(wardCount.toString(), "ne")} वडा
                </span>
              </div>

              {/* Population Card */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894]">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {localizeNumber(population.toString(), "ne")} जनसंख्या
                </span>
              </div>

              {/* Households Card */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894]">
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {localizeNumber(households.toString(), "ne")} घरधुरी
                </span>
              </div>

              {/* Population Density Card */}
              {wardDemographics?.populationDensity && (
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {localizeNumber(
                      Math.round(wardDemographics.populationDensity).toString(),
                      "ne",
                    )}{" "}
                    जनघनत्व
                  </span>
                </div>
              )}
            </motion.div>

            {/* Action Buttons with improved visibility */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Profile Button - enhanced with deeper shadow */}
              <Link href={`/profile`}>
                <motion.button
                  className="group px-8 py-4 bg-gradient-to-r from-[#0b1f42] to-[#1a4894] text-white rounded-xl shadow-xl flex items-center gap-2 relative overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></span>
                  <span className="relative">प्रोफाइल हेर्नुहोस्</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative" />
                </motion.button>
              </Link>

              {/* Map Button */}
              <Link href={`/profile`}>
                <motion.button
                  className="px-8 py-4 border-2 border-white text-white rounded-xl transition-all flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  नक्सा हेर्नुहोस्
                  <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;
