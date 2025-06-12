import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateSEOProps {
  birthCertificateData: Array<{
    id?: string;
    wardNumber: number;
    withBirthCertificate: number;
    withoutBirthCertificate: number;
    totalPopulationUnder5?: number;
  }>;
  totalWithCertificate: number;
  totalWithoutCertificate: number;
  totalPopulation: number;
  wardNumbers: number[];
}

export default function BirthCertificateSEO({
  birthCertificateData,
  totalWithCertificate,
  totalWithoutCertificate,
  totalPopulation,
  wardNumbers,
}: BirthCertificateSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert birth certificate stats to structured data format
    const wardObservations = birthCertificateData.map((item) => {
      const total = (item.withBirthCertificate || 0) + (item.withoutBirthCertificate || 0);
      const coverageRate = total > 0 
        ? ((item.withBirthCertificate / total) * 100).toFixed(2)
        : "0";
        
      return {
        "@type": "Observation",
        name: `Birth Certificate Status for Children Under 5 Years in Ward ${item.wardNumber} of Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: [
          {
            "@type": "PropertyValue",
            name: "Children With Birth Certificates",
            unitText: "children",
            value: item.withBirthCertificate
          },
          {
            "@type": "PropertyValue",
            name: "Children Without Birth Certificates",
            unitText: "children",
            value: item.withoutBirthCertificate
          },
          {
            "@type": "PropertyValue",
            name: "Birth Certificate Coverage Rate",
            unitText: "percentage",
            value: coverageRate
          }
        ],
        description: `Ward ${item.wardNumber} of Khajura Rural Municipality has ${item.withBirthCertificate} children with birth certificates and ${item.withoutBirthCertificate} without birth certificates, representing a ${coverageRate}% coverage rate.`
      }
    });

    // Find ward with highest birth certificate registration
    const highestWard = [...birthCertificateData].sort(
      (a, b) => b.withBirthCertificate - a.withBirthCertificate
    )[0] || { wardNumber: 0, withBirthCertificate: 0, withoutBirthCertificate: 0 };
    
    const overallCoverageRate = totalPopulation > 0 
      ? ((totalWithCertificate / totalPopulation) * 100).toFixed(2)
      : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Birth Certificate Status for Children Under 5 Years in Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Birth certificate data for children under 5 years across ${wardNumbers.length} wards of Khajura Rural Municipality. Total population: ${totalPopulation.toLocaleString()} children, with ${totalWithCertificate.toLocaleString()} having birth certificates (${overallCoverageRate}% coverage) and ${totalWithoutCertificate.toLocaleString()} without birth certificates.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Birth certificates",
        "Children under five",
        "Ward-wise birth registration data",
        "Nepal vital statistics",
        "Birth registration statistics",
        "Birth certificate coverage",
      ],
      url: "https://digital.khajuramun.gov.np/profile/demographics/ward-wise-birth-certificate-population",
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
        ...wardNumbers.map((wardNumber) => {
          const wardData = birthCertificateData.find((item) => item.wardNumber === wardNumber);
          return [
            {
              "@type": "PropertyValue",
              name: `Ward ${wardNumber} Children With Birth Certificates`,
              unitText: "children",
              value: wardData?.withBirthCertificate || 0,
            },
            {
              "@type": "PropertyValue",
              name: `Ward ${wardNumber} Children Without Birth Certificates`,
              unitText: "children",
              value: wardData?.withoutBirthCertificate || 0,
            }
          ];
        }).flat(),
        {
          "@type": "PropertyValue",
          name: "Total Children With Birth Certificates",
          unitText: "children",
          value: totalWithCertificate,
        },
        {
          "@type": "PropertyValue",
          name: "Total Children Without Birth Certificates",
          unitText: "children",
          value: totalWithoutCertificate,
        },
        {
          "@type": "PropertyValue",
          name: "Total Children Under 5 Years",
          unitText: "children",
          value: totalPopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Overall Birth Certificate Coverage Rate",
          unitText: "percentage",
          value: overallCoverageRate,
        }
      ],
      observation: wardObservations,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="birth-certificate-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
