import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface GenderSEOProps {
  ageGroupData: Array<{
    id?: string;
    ageGroup: string;
    maleHeads: number;
    femaleHeads: number;
    totalFamilies: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  totalMaleHeads: number;
  totalFemaleHeads: number;
  totalFamilies: number;
}

export default function GenderSEO({
  ageGroupData,
  totalMaleHeads,
  totalFemaleHeads,
  totalFamilies,
}: GenderSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert age group stats to structured data format
    const ageGroupStats = ageGroupData.map((item) => ({
      "@type": "Observation",
      name: `Age group ${item.ageGroup} household heads in Pariwartan Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Age group ${item.ageGroup} household heads by gender`,
        unitText: "families",
      },
      measuredValue: item.totalFamilies,
      description: `उमेर समूह ${item.ageGroup} मा ${localizeNumber(item.maleHeads.toLocaleString(), "ne")} पुरुष घरमूली र ${localizeNumber(item.femaleHeads.toLocaleString(), "ne")} महिला घरमूली रहेका छन्, कुल ${localizeNumber(item.totalFamilies.toLocaleString(), "ne")} परिवार।`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Age Group-wise Household Head Gender Distribution in Pariwartan Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Age group-wise gender distribution of household heads in Pariwartan Rural Municipality with a total of ${localizeNumber(totalFamilies.toLocaleString(), "ne")} families across different age groups.`,
      keywords: [
        "Pariwartan Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Age group household heads",
        "उमेर समूह घरमूली",
        "Gender distribution by age",
        "Nepal demographics",
        "Female household heads",
        "Male household heads",
        "Family structure analysis",
      ],
      url: "https://digital.pariwartan.gov.np/profile/demographics/ward-wise-househead-gender",
      creator: {
        "@type": "Organization",
        name: "Pariwartan Rural Municipality",
        url: "https://digital.pariwartan.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Pariwartan Rural Municipality, Nepal",
      },
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "पुरुष घरमूली (Male household heads)",
          unitText: "people",
          value: totalMaleHeads,
        },
        {
          "@type": "PropertyValue",
          name: "महिला घरमूली (Female household heads)",
          unitText: "people",
          value: totalFemaleHeads,
        },
        {
          "@type": "PropertyValue",
          name: "कुल परिवार (Total families)",
          unitText: "families",
          value: totalFamilies,
        },
      ],
      observation: ageGroupStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="househead-gender-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
