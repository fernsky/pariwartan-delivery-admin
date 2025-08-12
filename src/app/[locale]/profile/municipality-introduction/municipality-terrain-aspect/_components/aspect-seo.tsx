import Script from "next/script";
import type { MunicipalityAspectResponse } from "@/server/api/routers/profile/municipality-introduction/municipality-aspect.schema";

interface AspectSEOProps {
  aspectData: MunicipalityAspectResponse;
}

export default function AspectSEO({ aspectData }: AspectSEOProps) {
  const generateStructuredData = () => {
    const aspectStats = aspectData.data.map((item) => ({
      "@type": "Observation",
      name: `${item.direction_english} aspect area in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${item.direction_english} facing terrain`,
        unitText: "square kilometers",
      },
      measuredValue: item.area_sq_km,
      description: `${item.area_sq_km} sq. km. area in Khajura Rural Municipality faces ${item.direction_english} direction (${item.area_percentage.toFixed(2)}% of total area)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Aspect Distribution of Khajura Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Area distribution by aspect (direction) data for Khajura Rural Municipality with a total area of ${aspectData.total.area_sq_km} sq. km.`,
      keywords: [
        "Khajura Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Aspect information",
        "Direction data",
        "Terrain aspect",
        "Nepal topography",
        "Municipality geography",
        "Aspect distribution",
        "मोहोडा विवरण",
        "दिशा तथ्याङ्क",
      ],
      url: "https://paribartan.digprofile.com/profile/municipality-introduction/municipality-terrain-aspect",
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
      variableMeasured: aspectData.data.map((item) => ({
        "@type": "PropertyValue",
        name: `${item.direction_english} aspect area`,
        unitText: "square kilometers",
        value: item.area_sq_km,
      })),
      observation: aspectStats,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Total Area",
          value: aspectData.total.area_sq_km,
          unitText: "square kilometers",
        },
        {
          "@type": "PropertyValue",
          name: "Dominant Aspect",
          value: aspectData.metadata.highest_area.direction_english,
        },
        {
          "@type": "PropertyValue",
          name: "Highest Area Direction",
          value: `${aspectData.metadata.highest_area.direction_english} (${aspectData.metadata.highest_area.area_percentage.toFixed(2)}%)`,
        },
        {
          "@type": "PropertyValue",
          name: "Lowest Area Direction",
          value: `${aspectData.metadata.lowest_area.direction_english} (${aspectData.metadata.lowest_area.area_percentage.toFixed(2)}%)`,
        },
      ],
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="municipality-aspect-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
