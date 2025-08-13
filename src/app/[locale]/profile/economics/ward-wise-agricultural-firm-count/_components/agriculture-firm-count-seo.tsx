import Script from "next/script";

interface AgricultureFirmCountSEOProps {
  overallSummary: Array<{
    ward: string;
    wardNumber: number;
    count: number;
    percentage: number;
  }>;
  totalFirms: number;
  wardNumbers: number[];
}

export default function AgricultureFirmCountSEO({
  overallSummary,
  totalFirms,
  wardNumbers,
}: AgricultureFirmCountSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward stats to structured data format
    const wardStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `Agriculture firms in ${item.ward} of Paribartan Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Agriculture firms in ${item.ward}`,
        unitText: "firms",
      },
      measuredValue: item.count,
      description: `${item.count.toLocaleString()} agriculture firms in ${item.ward} of Paribartan Rural Municipality (${item.percentage.toFixed(2)}% of total firms)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ward-wise Agriculture Firm Count of Paribartan Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Agriculture firm count distribution data across ${wardNumbers.length} wards of Paribartan Rural Municipality with a total of ${totalFirms.toLocaleString()} registered agriculture firms.`,
      keywords: [
        "Paribartan Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Agriculture firms",
        "Ward-wise agriculture data",
        "Nepal agriculture census",
        "Agricultural groups",
        "Farming cooperatives",
        "Rural agriculture",
        "कृषि फर्म",
        "कृषि समूह",
        "वडा अनुसार कृषि तथ्याङ्क",
      ],
      url: "https://paribartan.digprofile.com/profile/economics/agriculture-firm-count",
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
        name: `Agriculture firms in ${item.ward}`,
        unitText: "firms",
        value: item.count,
      })),
      observation: wardStats,
      distribution: {
        "@type": "DataDownload",
        name: "Ward-wise Agriculture Firm Count Data",
        description: "Complete dataset of agriculture firm counts by ward",
        encodingFormat: "application/json",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="agriculture-firm-count-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
