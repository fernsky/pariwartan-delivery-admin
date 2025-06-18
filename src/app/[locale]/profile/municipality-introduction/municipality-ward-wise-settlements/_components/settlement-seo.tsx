import Script from "next/script";

interface SettlementSEOProps {
  settlementData: {
    title: string;
    title_english: string;
    data: Array<{
      ward_number: string;
      ward_number_english: string;
      settlements: string[];
    }>;
    metadata: {
      total_wards: number;
      column_headers: {
        nepali: string[];
        english: string[];
      };
    };
  };
}

export default function SettlementSEO({ settlementData }: SettlementSEOProps) {
  // Calculate total settlements
  const totalSettlements = settlementData.data.reduce(
    (sum, ward) => sum + ward.settlements.length,
    0,
  );

  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert settlement data to structured format
    const wardObservations = settlementData.data.map((ward) => ({
      "@type": "Observation",
      name: `Ward ${ward.ward_number_english} settlements in Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Ward ${ward.ward_number_english} settlement count`,
        unitText: "settlements",
      },
      measuredValue: ward.settlements.length,
      description: `Ward ${ward.ward_number_english} has ${ward.settlements.length} settlements`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ward-wise Settlement Data of Rural Municipality (गाउँपालिका)",
      description: `Comprehensive settlement distribution data for Rural Municipality with ${totalSettlements} settlements across ${settlementData.metadata.total_wards} wards.`,
      keywords: [
        "Rural Municipality",
        "गाउँपालिका",
        "Ward settlements",
        "Settlement distribution",
        "Nepal municipality data",
        "Rural settlements",
        "Community mapping",
        "बस्ती वितरण",
        "वडागत बस्ती",
      ],
      url: "https://example.gov.np/profile/municipality-introduction/municipality-ward-wise-settlements",
      creator: {
        "@type": "Organization",
        name: "Rural Municipality",
        url: "https://example.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Rural Municipality, Nepal",
      },
      variableMeasured: settlementData.data.map((ward) => ({
        "@type": "PropertyValue",
        name: `Ward ${ward.ward_number_english} settlements`,
        unitText: "settlements",
        value: ward.settlements.length,
      })),
      observation: wardObservations,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="settlement-data-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
