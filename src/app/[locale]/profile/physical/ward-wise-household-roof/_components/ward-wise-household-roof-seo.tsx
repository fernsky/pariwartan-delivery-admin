import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseHouseholdRoofSEOProps {
  householdRoofData: any[];
  totalHouseholds: number;
  roofCategoryTotals: Record<string, number>;
  roofCategoryPercentages: Record<string, number>;
  bestRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  worstRoofingWard: {
    wardNumber: number;
    percentage: number;
  };
  ROOF_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  wardNumbers: number[];
  housingQualityIndex: number;
}

export default function WardWiseHouseholdRoofSEO({
  householdRoofData,
  totalHouseholds,
  roofCategoryTotals,
  roofCategoryPercentages,
  bestRoofingWard,
  worstRoofingWard,
  ROOF_CATEGORIES,
  wardNumbers,
  housingQualityIndex,
}: WardWiseHouseholdRoofSEOProps) {
  // Calculate modern roofing percentage (cement + tile)
  const modernRoofingTotal =
    roofCategoryTotals.CEMENT + roofCategoryTotals.TILE;
  const modernRoofingPercentage = (
    (modernRoofingTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise roof data to structured data format
    const roofStats = wardNumbers
      .map((wardNumber) => {
        const wardData = householdRoofData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (wardData.length === 0) return null;

        const wardTotal = wardData.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        const roofTypeDistribution = Object.keys(ROOF_CATEGORIES).map(
          (roofType) => {
            const roofData = wardData.find(
              (item) => item.roofType === roofType,
            );
            const households = roofData ? roofData.households : 0;
            const percentage =
              wardTotal > 0 ? (households / wardTotal) * 100 : 0;

            return {
              "@type": "PropertyValue",
              name: ROOF_CATEGORIES[roofType as keyof typeof ROOF_CATEGORIES]
                .nameEn,
              value: households,
              unitText: "households",
              description: `${percentage.toFixed(2)}% of households in Ward ${wardNumber}`,
            };
          },
        );

        return {
          "@type": "Place",
          name: `Ward ${wardNumber}`,
          geo: {
            "@type": "GeoCoordinates",
            addressRegion: "pariwartan Rural Municipality",
            addressCountry: "Nepal",
          },
          additionalProperty: roofTypeDistribution,
        };
      })
      .filter(Boolean);

    return {
      "@context": "https://schema.org",
      "@type": ["Dataset", "GovernmentService"],
      name: "Ward-wise Household Roof Types in pariwartan Rural Municipality",
      description: `Comprehensive analysis of household roof types across ${wardNumbers.length} wards in pariwartan Rural Municipality, covering ${totalHouseholds} households with detailed breakdown by roof material including cement, tin, tile, straw, wood, stone, and other materials.`,
      keywords: [
        "pariwartan Rural Municipality",
        "household roof types",
        "housing quality",
        "building materials",
        "cement roofing",
        "tin roofing",
        "tile roofing",
        "traditional roofing",
        "ward-wise statistics",
        "infrastructure development",
        "Nepal local government data",
      ],
      creator: {
        "@type": "Organization",
        name: "pariwartan Rural Municipality",
        alternateName: "परिवर्तन गाउँपालिका",
        url: "https://pariwartan.gov.np",
      },
      publisher: {
        "@type": "Organization",
        name: "pariwartan Rural Municipality Digital Profile",
        alternateName: "परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
      },
      spatialCoverage: {
        "@type": "Place",
        name: "pariwartan Rural Municipality",
        alternateName: "परिवर्तन गाउँपालिका",
        geo: {
          "@type": "GeoCoordinates",
          addressRegion: "Banke District",
          addressCountry: "Nepal",
        },
        containsPlace: roofStats,
      },
      temporalCoverage: new Date().getFullYear().toString(),
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "Total Households",
          value: totalHouseholds,
          unitText: "households",
          description: "Total number of households surveyed across all wards",
        },
        {
          "@type": "PropertyValue",
          name: "Modern Roofing Rate",
          value: parseFloat(modernRoofingPercentage),
          unitText: "percent",
          description:
            "Percentage of households with modern roofing (cement + tile)",
        },
        {
          "@type": "PropertyValue",
          name: "Housing Quality Index",
          value: parseFloat(housingQualityIndex.toFixed(2)),
          unitText: "index score",
          description:
            "Housing quality index based on roof type distribution (0-100 scale)",
        },
        ...Object.keys(ROOF_CATEGORIES).map((roofType) => ({
          "@type": "PropertyValue",
          name: `${ROOF_CATEGORIES[roofType as keyof typeof ROOF_CATEGORIES].nameEn} Roofing`,
          value: roofCategoryTotals[roofType],
          unitText: "households",
          description: `Number of households with ${ROOF_CATEGORIES[roofType as keyof typeof ROOF_CATEGORIES].nameEn.toLowerCase()} roofing`,
        })),
      ],
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: "/api/profile/physical/ward-wise-household-roof",
        },
      ],
      isAccessibleForFree: true,
      license: "https://creativecommons.org/licenses/by/4.0/",
      inLanguage: ["ne", "en"],
      about: [
        {
          "@type": "Thing",
          name: "Housing Infrastructure",
          sameAs: "https://en.wikipedia.org/wiki/Housing",
        },
        {
          "@type": "Thing",
          name: "Building Materials",
          sameAs: "https://en.wikipedia.org/wiki/Building_material",
        },
        {
          "@type": "Thing",
          name: "Rural Development",
          sameAs: "https://en.wikipedia.org/wiki/Rural_development",
        },
      ],
      mainEntity: {
        "@type": "StatisticalVariable",
        name: "Household Roof Type Distribution",
        description:
          "Distribution of different roof types across households in pariwartan Rural Municipality",
        measurementTechnique: "Household survey and census data collection",
        unitText: "households",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Additional SEO meta tags */}
      <meta name="geo.region" content="NP-P1" />
      <meta
        name="geo.placename"
        content="pariwartan Rural Municipality, Banke District, Nepal"
      />
      <meta name="ICBM" content="28.1667, 81.6167" />
      <meta
        name="DC.title"
        content="Ward-wise Household Roof Types Analysis - pariwartan Rural Municipality"
      />
      <meta
        name="DC.description"
        content={`Analysis of ${totalHouseholds} households across ${wardNumbers.length} wards showing distribution of roof types including modern (${modernRoofingPercentage}% cement/tile) and traditional materials`}
      />
      <meta
        name="DC.subject"
        content="Housing Infrastructure, Building Materials, Rural Development, Local Government Statistics"
      />
      <meta
        name="DC.coverage"
        content="pariwartan Rural Municipality, Banke District, Lumbini Province, Nepal"
      />
      <meta name="DC.type" content="Dataset" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="ne, en" />
      <meta
        name="DC.rights"
        content="Creative Commons Attribution 4.0 International License"
      />

      {/* OpenGraph structured properties */}
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="ne_NP" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="article:section" content="Housing Infrastructure" />
      <meta property="article:tag" content="household roof types" />
      <meta property="article:tag" content="housing quality" />
      <meta property="article:tag" content="building materials" />
      <meta property="article:tag" content="infrastructure development" />

      {/* Twitter Card metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Ward-wise Household Roof Types - pariwartan Rural Municipality"
      />
      <meta
        name="twitter:description"
        content={`Analysis of ${totalHouseholds} households showing roof type distribution: ${modernRoofingPercentage}% modern roofing across ${wardNumbers.length} wards`}
      />

      {/* Microdata for local business/organization */}
      <div
        itemScope
        itemType="https://schema.org/GovernmentOrganization"
        style={{ display: "none" }}
      >
        <span itemProp="name">pariwartan Rural Municipality</span>
        <span itemProp="alternateName">परिवर्तन गाउँपालिका</span>
        <div
          itemProp="address"
          itemScope
          itemType="https://schema.org/PostalAddress"
        >
          <span itemProp="addressRegion">Banke District</span>
          <span itemProp="addressCountry">Nepal</span>
        </div>
        <span itemProp="url">https://pariwartan.gov.np</span>
      </div>

      {/* Performance hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </>
  );
}
