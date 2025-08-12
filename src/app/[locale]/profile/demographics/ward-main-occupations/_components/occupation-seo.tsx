import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";
import { familyMainOccupationLabels } from "@/server/api/routers/profile/demographics/ward-wise-major-occupation.schema";

interface OccupationSEOProps {
  occupationData: Array<{
    id?: string;
    occupation: string;
    age15_19: number;
    age20_24: number;
    age25_29: number;
    age30_34: number;
    age35_39: number;
    age40_44: number;
    age45_49: number;
    totalPopulation: number;
    percentage: number;
  }>;
  totalPopulation: number;
}

export default function OccupationSEO({
  occupationData,
  totalPopulation,
}: OccupationSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert occupation stats to structured data format
    const occupationStats = occupationData.map((item) => ({
      "@type": "Observation",
      name: `${familyMainOccupationLabels[item.occupation] || item.occupation} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${familyMainOccupationLabels[item.occupation] || item.occupation} workers`,
        unitText: "people",
      },
      measuredValue: item.totalPopulation,
      description: `${item.totalPopulation.toLocaleString()} people in Khajura Rural Municipality work in ${familyMainOccupationLabels[item.occupation] || item.occupation} (${item.percentage.toFixed(2)}% of total population)`,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Age 15-19",
          value: item.age15_19,
        },
        {
          "@type": "PropertyValue",
          name: "Age 20-24",
          value: item.age20_24,
        },
        {
          "@type": "PropertyValue",
          name: "Age 25-29",
          value: item.age25_29,
        },
        {
          "@type": "PropertyValue",
          name: "Age 30-34",
          value: item.age30_34,
        },
        {
          "@type": "PropertyValue",
          name: "Age 35-39",
          value: item.age35_39,
        },
        {
          "@type": "PropertyValue",
          name: "Age 40-44",
          value: item.age40_44,
        },
        {
          "@type": "PropertyValue",
          name: "Age 45-49",
          value: item.age45_49,
        },
      ],
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Family Main Occupation Distribution of Khajura Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Family main occupation distribution data of Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()} people across different age groups.`,
      keywords: [
        "Khajura Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Family main occupation",
        "Employment statistics",
        "Age-wise occupation data",
        "Nepal workforce",
        "Occupational distribution",
        ...Object.values(familyMainOccupationLabels),
      ],
      url: "https://paribartan.digprofile.com/profile/demographics/ward-main-occupations",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://paribartan.digprofile.com",
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
      variableMeasured: occupationData.map((item) => ({
        "@type": "PropertyValue",
        name: `${familyMainOccupationLabels[item.occupation] || item.occupation} population`,
        unitText: "people",
        value: item.totalPopulation,
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
