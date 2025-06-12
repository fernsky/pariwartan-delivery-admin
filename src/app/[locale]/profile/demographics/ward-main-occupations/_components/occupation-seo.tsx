import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface OccupationSEOProps {
  overallSummary: Array<{
    occupation: string;
    occupationName: string;
    population: number;
  }>;
  totalPopulation: number;
  OCCUPATION_NAMES: Record<string, string>;
  OCCUPATION_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function OccupationSEO({
  overallSummary,
  totalPopulation,
  OCCUPATION_NAMES,
  OCCUPATION_NAMES_EN,
  wardNumbers,
}: OccupationSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert occupation stats to structured data format
    const occupationStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${OCCUPATION_NAMES_EN[item.occupation] || item.occupation} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${OCCUPATION_NAMES_EN[item.occupation] || item.occupation} workers`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in Khajura Rural Municipality work in ${OCCUPATION_NAMES_EN[item.occupation] || item.occupation} (${((item.population / totalPopulation) * 100).toFixed(2)}% of total population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Occupational Distribution of Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Occupational distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()} people.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Occupational distribution",
        "Employment statistics",
        "Ward-wise occupation data",
        "Nepal workforce",
        ...Object.values(OCCUPATION_NAMES_EN).map(
          (name) => `${name} statistics`,
        ),
        ...Object.values(OCCUPATION_NAMES).map((name) => `${name} तथ्याङ्क`),
      ],
      url: "https://digital.khajuramun.gov.np/profile/demographics/ward-main-occupations",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.khajuramun.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Khajura Rural Municipality, Banke, Nepal",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.1356",
          longitude: "81.6314",
        },
      },
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${OCCUPATION_NAMES_EN[item.occupation] || item.occupation} population`,
        unitText: "people",
        value: item.population,
      })),
      observation: occupationStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="occupation-distribution-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
