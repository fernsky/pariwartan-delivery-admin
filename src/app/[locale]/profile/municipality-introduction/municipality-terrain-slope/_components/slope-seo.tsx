import Script from "next/script";
import type { MunicipalitySlopeResponse } from "@/server/api/routers/profile/municipality-introduction/municipality-slope.schema";

interface SlopeSEOProps {
  slopeData: MunicipalitySlopeResponse;
}

export default function SlopeSEO({ slopeData }: SlopeSEOProps) {
  const generateStructuredData = () => {
    const slopeStats = slopeData.data.map((item) => ({
      "@type": "Observation",
      name: `${item.slope_range_english} slope area in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${item.slope_range_english} terrain`,
        unitText: "square kilometers",
      },
      measuredValue: item.area_sq_km,
      description: `${item.area_sq_km} sq. km. area in Khajura Rural Municipality has ${item.slope_range_english} slope (${item.area_percentage.toFixed(2)}% of total area)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Slope Information of Khajura Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Geographical slope distribution data for Khajura Rural Municipality with a total area of ${slopeData.total.total_area_sq_km} sq. km.`,
      keywords: [
        "Khajura Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Slope information",
        "Geographical data",
        "Terrain analysis",
        "Nepal topography",
        "Municipality geography",
        "Slope distribution",
        "भिरालोपन विवरण",
        "भौगोलिक तथ्याङ्क",
      ],
      url: "https://digital.khajuramun.gov.np/profile/municipality-introduction",
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
      variableMeasured: slopeData.data.map((item) => ({
        "@type": "PropertyValue",
        name: `${item.slope_range_english} slope area`,
        unitText: "square kilometers",
        value: item.area_sq_km,
      })),
      observation: slopeStats,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Total Area",
          value: slopeData.total.total_area_sq_km,
          unitText: "square kilometers",
        },
        {
          "@type": "PropertyValue",
          name: "Dominant Slope Type",
          value: slopeData.data[0]?.slope_range_english || "0-5 degrees",
        },
      ],
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="municipality-slope-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
