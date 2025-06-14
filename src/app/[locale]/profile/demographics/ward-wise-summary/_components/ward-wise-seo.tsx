"use client";

import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseSEOProps {
  demographicData: {
    totalPopulation: number;
    populationMale: number;
    populationFemale: number;
    totalHouseholds: number;
    averageHouseholdSize: number;
    sexRatio: number;
    annualGrowthRate: number;
    literacyRate: number;
    populationDensity: number;
    dataYear: string;
    dataYearEnglish: string;
  };
  wardCount: number;
}

export default function WardWiseSEO({
  demographicData,
  wardCount,
}: WardWiseSEOProps) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Ward-wise Demographics Summary - Pariwartan Rural Municipality",
            description: `Comprehensive demographic statistics for all ${wardCount} wards of Pariwartan Rural Municipality including population distribution, gender ratios, and household information.`,
            url: typeof window !== "undefined" ? window.location.href : "",
            keywords: [
              "demographics",
              "population statistics",
              "ward-wise data",
              "Pariwartan Rural Municipality",
              "Nepal census data",
              "gender distribution",
              "household statistics",
            ],
            creator: {
              "@type": "Organization",
              name: "Pariwartan Rural Municipality",
              url: "https://pariwartan.gov.np",
            },
            spatialCoverage: {
              "@type": "Place",
              name: "Pariwartan Rural Municipality, Bagmati Province, Nepal",
            },
            temporalCoverage: demographicData.dataYearEnglish,
            variableMeasured: [
              {
                "@type": "PropertyValue",
                name: "Total Population",
                value: demographicData.totalPopulation,
                unitText: "persons",
              },
              {
                "@type": "PropertyValue",
                name: "Total Households",
                value: demographicData.totalHouseholds,
                unitText: "households",
              },
              {
                "@type": "PropertyValue",
                name: "Average Household Size",
                value: demographicData.averageHouseholdSize,
                unitText: "persons per household",
              },
              {
                "@type": "PropertyValue",
                name: "Sex Ratio",
                value: demographicData.sexRatio,
                unitText: "males per 100 females",
              },
              {
                "@type": "PropertyValue",
                name: "Literacy Rate",
                value: demographicData.literacyRate,
                unitText: "percent",
              },
            ],
          }),
        }}
      />

      {/* Additional meta tags for better SEO */}
      <meta name="geo.region" content="NP-P3" />
      <meta name="geo.placename" content="Pariwartan Rural Municipality" />
      <meta
        name="DC.title"
        content="Ward-wise Demographics Summary - Pariwartan Rural Municipality"
      />
      <meta name="DC.creator" content="Pariwartan Rural Municipality" />
      <meta
        name="DC.subject"
        content="Demographics, Population Statistics, Ward Analysis"
      />
      <meta
        name="DC.description"
        content={`Comprehensive demographic analysis of ${wardCount} wards with total population of ${localizeNumber(demographicData.totalPopulation.toLocaleString(), "en")}`}
      />
      <meta name="DC.publisher" content="Pariwartan Rural Municipality" />
      <meta name="DC.date" content={demographicData.dataYearEnglish} />
      <meta name="DC.type" content="Dataset" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="ne-NP" />
      <meta name="DC.coverage" content="Pariwartan Rural Municipality, Nepal" />
    </>
  );
}
