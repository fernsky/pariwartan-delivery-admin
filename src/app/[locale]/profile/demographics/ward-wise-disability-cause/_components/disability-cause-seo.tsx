import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DisabilityCauseSEOProps {
  overallSummary: Array<{
    disabilityCause: string;
    disabilityCauseName: string;
    population: number;
  }>;
  totalPopulationWithDisability: number;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
  DISABILITY_CAUSE_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function DisabilityCauseSEO({
  overallSummary,
  totalPopulationWithDisability,
  DISABILITY_CAUSE_NAMES,
  DISABILITY_CAUSE_NAMES_EN,
  wardNumbers,
}: DisabilityCauseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert disability cause stats to structured data format
    const disabilityCauseStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause} disability cases`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in Khajura Rural Municipality have disabilities caused by ${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause} (${((item.population / totalPopulationWithDisability) * 100).toFixed(2)}% of total population with disabilities)`,
    }));

    // Find most common disability cause
    const mostCommonCause = overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonCauseEN = mostCommonCause ? (DISABILITY_CAUSE_NAMES_EN[mostCommonCause.disabilityCause] || mostCommonCause.disabilityCause) : "";
    const mostCommonCausePercentage = mostCommonCause && totalPopulationWithDisability > 0 
      ? ((mostCommonCause.population / totalPopulationWithDisability) * 100).toFixed(2)
      : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Disability Causes in Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Disability cause data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population with disabilities of ${totalPopulationWithDisability.toLocaleString()} people. The most common cause is ${mostCommonCauseEN} with ${mostCommonCause?.population.toLocaleString()} people (${mostCommonCausePercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Disability causes",
        "Disability distribution",
        "Ward-wise disability data",
        "Nepal demographics",
        "Disability statistics",
        ...Object.values(DISABILITY_CAUSE_NAMES_EN).map(
          (name) => `${name} disabilities statistics`,
        ),
        ...Object.values(DISABILITY_CAUSE_NAMES).map((name) => `${name} अपाङ्गता तथ्याङ्क`),
      ],
      url: "https://digital.khajuramun.gov.np/profile/demographics/ward-wise-disability-cause",
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
      variableMeasured: [
        ...overallSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause} disabilities`,
          unitText: "people",
          value: item.population,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Population with Disabilities",
          unitText: "people",
          value: totalPopulationWithDisability,
        }
      ],
      observation: disabilityCauseStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="disability-cause-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
