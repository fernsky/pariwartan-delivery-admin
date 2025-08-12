import Script from "next/script";
import type { HeroDemographicsResponse } from "@/server/api/routers/profile/demographics/hero-demographics.schema";

interface WardSEOProps {
  wardData: HeroDemographicsResponse;
}

export default function WardSEO({ wardData }: WardSEOProps) {
  const generateStructuredData = () => {
    const wardStats = wardData.wards.map((ward) => ({
      "@type": "Observation",
      name: `Ward ${ward.wardNo} demographics in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: [
        {
          "@type": "PropertyValue",
          name: `Ward ${ward.wardNo} population`,
          unitText: "people",
          value: ward.population,
        },
        {
          "@type": "PropertyValue",
          name: `Ward ${ward.wardNo} area`,
          unitText: "square kilometers",
          value: ward.areaSqKm,
        },
      ],
      description: `Ward ${ward.wardNo} of Khajura Rural Municipality includes ${ward.includedVdcOrMunicipality} with ${ward.population} population and ${ward.areaSqKm} sq. km. area`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ward Demographics of Khajura Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Ward-wise population and area distribution data for Khajura Rural Municipality with ${wardData.totalWards} wards, total population ${wardData.totalPopulation}, and total area ${wardData.totalAreaSqKm} sq. km.`,
      keywords: [
        "Khajura Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Ward demographics",
        "Population statistics",
        "Municipality wards",
        "Nepal demographics",
        "Ward information",
        "Population distribution",
        "वडा जानकारी",
        "जनसंख्या तथ्याङ्क",
      ],
      url: "https://paribartan.digprofile.com/profile/municipality-introduction/municipality-ward-information",
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
      variableMeasured: wardData.wards.flatMap((ward) => [
        {
          "@type": "PropertyValue",
          name: `Ward ${ward.wardNo} population`,
          unitText: "people",
          value: ward.population,
        },
        {
          "@type": "PropertyValue",
          name: `Ward ${ward.wardNo} area`,
          unitText: "square kilometers",
          value: ward.areaSqKm,
        },
      ]),
      observation: wardStats,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Total Population",
          value: wardData.totalPopulation,
          unitText: "people",
        },
        {
          "@type": "PropertyValue",
          name: "Total Area",
          value: wardData.totalAreaSqKm,
          unitText: "square kilometers",
        },
        {
          "@type": "PropertyValue",
          name: "Total Wards",
          value: wardData.totalWards,
        },
        {
          "@type": "PropertyValue",
          name: "Population Density",
          value: wardData.populationDensity,
          unitText: "people per square kilometer",
        },
      ],
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="municipality-ward-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
