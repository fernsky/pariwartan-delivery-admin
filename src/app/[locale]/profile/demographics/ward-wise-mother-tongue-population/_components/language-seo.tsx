import Script from "next/script";

interface LanguageSEOProps {
  overallSummary: Array<{
    language: string;
    languageName: string;
    population: number;
  }>;
  totalPopulation: number;
  LANGUAGE_NAMES: Record<string, string>;
  wardIds: number[];
}

export default function LanguageSEO({
  overallSummary,
  totalPopulation,
  LANGUAGE_NAMES,
  wardIds,
}: LanguageSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for languages
    const LANGUAGE_NAMES_EN: Record<string, string> = {
      NEPALI: "Nepali",
      MAITHILI: "Maithili",
      BHOJPURI: "Bhojpuri",
      THARU: "Tharu",
      TAMANG: "Tamang",
      NEWARI: "Newari",
      MAGAR: "Magar",
      BAJJIKA: "Bajjika",
      URDU: "Urdu",
      HINDI: "Hindi",
      LIMBU: "Limbu",
      RAI: "Rai",
      GURUNG: "Gurung",
      SHERPA: "Sherpa",
      DOTELI: "Doteli",
      AWADI: "Awadhi",
      OTHER: "Other",
    };

    // Convert language stats to structured data format
    const languageStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${LANGUAGE_NAMES_EN[item.language] || item.language} speakers in Paribartan Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${LANGUAGE_NAMES_EN[item.language] || item.language} speakers`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in Paribartan Rural Municipality speak ${LANGUAGE_NAMES_EN[item.language] || item.language} as their mother tongue (${((item.population / totalPopulation) * 100).toFixed(2)}% of total population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Linguistic Demographics of Paribartan Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Mother tongue distribution data across ${wardIds.length} wards of Paribartan Rural Municipality with a total population of ${totalPopulation.toLocaleString()} people.`,
      keywords: [
        "Paribartan Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Linguistic demographics",
        "Mother tongue statistics",
        "Ward-wise language data",
        "Nepal census",
        ...Object.values(LANGUAGE_NAMES_EN).map((name) => `${name} speakers`),
        ...Object.values(LANGUAGE_NAMES).map((name) => `${name} वक्ता`),
      ],
      url: "https://paribartan.digprofile.com/profile/demographics/ward-wise-mother-tongue-population",
      creator: {
        "@type": "Organization",
        name: "Paribartan Rural Municipality",
        url: "https://paribartan.digprofile.com",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Paribartan Rural Municipality, Banke, Nepal",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.1356",
          longitude: "81.6314",
        },
      },
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${LANGUAGE_NAMES_EN[item.language] || item.language} speakers`,
        unitText: "people",
        value: item.population,
      })),
      observation: languageStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="language-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
