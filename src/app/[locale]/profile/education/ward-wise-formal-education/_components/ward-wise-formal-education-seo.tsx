import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseFormalEducationSEOProps {
  wardWiseFormalEducationData: any[];
  totalPopulation: number;
  formalEducationTotals: {
    currentlyAttending: number;
    previouslyAttended: number;
    neverAttended: number;
    notMentioned: number;
  };
  formalEducationPercelages: {
    currentlyAttending: string;
    previouslyAttended: string;
    neverAttended: string;
    notMentioned: string;
  };
  bestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  FORMAL_EDUCATION_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  wardNumbers: number[];
}

export default function WardWiseFormalEducationSEO({
  wardWiseFormalEducationData,
  totalPopulation,
  formalEducationTotals,
  formalEducationPercelages,
  bestAttendanceWard,
  lowestAttendanceWard,
  FORMAL_EDUCATION_GROUPS,
  wardNumbers,
}: WardWiseFormalEducationSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise formal education to structured data format
    const educationStats = wardNumbers
      .map((wardNumber) => {
        const wardData = wardWiseFormalEducationData.filter(
          (item) =>
            item.ward === wardNumber.toString() && item.gender === "जम्मा",
        );

        if (!wardData?.length) return null;

        const totalWardPopulation = wardData[0]?.total || 0;
        const currentlyAttending = wardData[0]?.currentlyAttending || 0;
        const neverAttended = wardData[0]?.neverAttended || 0;

        const currentAttendancePercent =
          totalWardPopulation > 0
            ? ((currentlyAttending / totalWardPopulation) * 100).toFixed(2)
            : "0";

        const neverAttendedPercent =
          totalWardPopulation > 0
            ? ((neverAttended / totalWardPopulation) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Formal Education Status in Ward ${wardNumber} of Paribartan Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Current school/college attendance rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(currentAttendancePercent),
          description: `In Ward ${wardNumber} of Paribartan Rural Municipality, ${currentlyAttending.toLocaleString()} people (${currentAttendancePercent}%) are currently attending school/college and ${neverAttended.toLocaleString()} people (${neverAttendedPercent}%) have never attended school/college out of a total of ${totalWardPopulation.toLocaleString()} people.`,
        };
      })
      .filter(Boolean);

    // Calculate education access index
    const educationAccessIndex =
      (parseFloat(formalEducationPercelages.currentlyAttending) * 1.0 +
        parseFloat(formalEducationPercelages.previouslyAttended) * 0.6 +
        parseFloat(formalEducationPercelages.neverAttended) * 0.0 +
        parseFloat(formalEducationPercelages.notMentioned) * 0.1) /
      100;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Formal Education Status in Paribartan Rural Municipality (परिवर्तन गाउँपालिका)",
      description: `Analysis of formal education status across ${wardNumbers.length} wards of Paribartan Rural Municipality with a total population of ${totalPopulation.toLocaleString()}. ${formalEducationTotals.currentlyAttending.toLocaleString()} people (${formalEducationPercelages.currentlyAttending}%) are currently attending school/college, while ${formalEducationTotals.neverAttended.toLocaleString()} people (${formalEducationPercelages.neverAttended}%) have never attended formal education. The highest current attendance rate is in Ward ${bestAttendanceWard?.wardNumber || ""} with ${bestAttendanceWard?.percentage.toFixed(2) || ""}%.`,
      keywords: [
        "Paribartan Rural Municipality",
        "परिवर्तन गाउँपालिका",
        "Formal education",
        "School attendance",
        "College attendance",
        "Ward-wise education",
        "Rural education",
        "Nepal education",
        "Educational access",
        "Current attendance rate",
        "Never attended school",
        "Education status",
        "Educational distribution",
        "Education access index",
      ],
      url: "https://paribartan.digprofile.com/profile/education/ward-wise-formal-education",
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
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "Currently attending school/college",
          unitText: "people",
          value: formalEducationTotals.currentlyAttending,
        },
        {
          "@type": "PropertyValue",
          name: "Previously attended school/college",
          unitText: "people",
          value: formalEducationTotals.previouslyAttended,
        },
        {
          "@type": "PropertyValue",
          name: "Never attended school/college",
          unitText: "people",
          value: formalEducationTotals.neverAttended,
        },
        {
          "@type": "PropertyValue",
          name: "Not mentioned",
          unitText: "people",
          value: formalEducationTotals.notMentioned,
        },
        {
          "@type": "PropertyValue",
          name: "Current Attendance Rate",
          unitText: "percentage",
          value: parseFloat(formalEducationPercelages.currentlyAttending),
        },
        {
          "@type": "PropertyValue",
          name: "Never Attended Rate",
          unitText: "percentage",
          value: parseFloat(formalEducationPercelages.neverAttended),
        },
        {
          "@type": "PropertyValue",
          name: "Education Access Index",
          unitText: "index",
          value: educationAccessIndex.toFixed(2),
        },
      ],
      observation: educationStats,
      about: [
        {
          "@type": "Thing",
          name: "Formal Education",
          description: "Formal education attendance status of population",
        },
        {
          "@type": "Thing",
          name: "Educational Access",
          description:
            "Measure of educational access and attendance in a population",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Education Survey",
        provider: {
          "@type": "GovernmentOrganization",
          name: "Paribartan Rural Municipality",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Paribartan",
            addressRegion: "Banke",
            addressCountry: "Nepal",
          },
        },
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="formal-education-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
