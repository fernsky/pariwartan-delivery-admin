import Script from "next/script";

interface ReligionSEOProps {
  religionData: Array<{
    id?: string;
    religionType: string;
    malePopulation: number;
    femalePopulation: number;
    totalPopulation: number;
    percentage: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionSEO({
  religionData,
  RELIGION_NAMES,
}: ReligionSEOProps) {
  // Calculate total population
  const totalPopulation = religionData.reduce(
    (sum, item) => sum + item.totalPopulation,
    0,
  );

  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for religions
    const RELIGION_NAMES_EN: Record<string, string> = {
      HINDU: "Hindu",
      BUDDHIST: "Buddhist",
      KIRANT: "Kirat",
      CHRISTIAN: "Christian",
      ISLAM: "Islam",
      NATURE: "Nature Worship",
      BON: "Bon",
      JAIN: "Jain",
      BAHAI: "Bahai",
      SIKH: "Sikh",
      OTHER: "Other",
    };

    // Convert religion stats to structured data format
    const religionStats = religionData.map((item) => ({
      "@type": "Observation",
      name: `${RELIGION_NAMES_EN[item.religionType] || item.religionType} population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${RELIGION_NAMES_EN[item.religionType] || item.religionType} adherents`,
        unitText: "people",
      },
      measuredValue: item.totalPopulation,
      description: `${item.totalPopulation.toLocaleString()} people in Khajura Rural Municipality follow ${RELIGION_NAMES_EN[item.religionType] || item.religionType} religion (${(item.percentage / 100).toFixed(2)}% of total population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Religious Demographics of Khajura Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Religious population distribution data for Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()} people.`,
      keywords: [
        "Khajura Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Religious demographics",
        "Religion data",
        "Nepal census",
        ...Object.values(RELIGION_NAMES_EN).map((name) => `${name} population`),
        ...Object.values(RELIGION_NAMES).map((name) => `${name} जनसंख्या`),
      ],
      url: "https://digital.khajuramun.gov.np/profile/demographics/ward-wise-religion-population",
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
      variableMeasured: religionData.map((item) => ({
        "@type": "PropertyValue",
        name: `${RELIGION_NAMES_EN[item.religionType] || item.religionType} population`,
        unitText: "people",
        value: item.totalPopulation,
      })),
      observation: religionStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="religion-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
