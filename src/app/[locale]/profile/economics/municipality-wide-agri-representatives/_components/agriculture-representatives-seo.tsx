import Script from "next/script";

interface Representative {
  id?: string;
  serialNumber: number;
  name: string;
  nameEnglish: string;
  position: string;
  positionFull: string;
  positionEnglish: string;
  contactNumber: string;
  branch: string;
  branchEnglish: string;
  remarks?: string;
}

interface AgricultureRepresentativesSEOProps {
  representativesData: Representative[];
  totalRepresentatives: number;
}

export default function AgricultureRepresentativesSEO({
  representativesData,
  totalRepresentatives,
}: AgricultureRepresentativesSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    const representativesList = representativesData.map((rep) => ({
      "@type": "Person",
      name: rep.name,
      alternateName: rep.nameEnglish,
      jobTitle: rep.positionFull,
      telephone: rep.contactNumber,
      worksFor: {
        "@type": "Organization",
        name: "pariwartan Rural Municipality Agriculture Department",
        alternateName: "परिवर्तन गाउँपालिका कृषि शाखा",
        department: rep.branch,
      },
      description: `${rep.positionFull} at ${rep.branch} department of pariwartan Rural Municipality`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Agriculture Representatives of pariwartan Rural Municipality",
      description: `Complete list of ${totalRepresentatives} agriculture representatives working in pariwartan Rural Municipality's Agriculture Department`,
      numberOfItems: totalRepresentatives,
      itemListElement: representativesList.map((rep, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: rep,
      })),
      about: {
        "@type": "Organization",
        name: "pariwartan Rural Municipality",
        alternateName: "परिवर्तन गाउँपालिका",
        url: "https://digital.pariwartanmun.gov.np",
        address: {
          "@type": "PostalAddress",
          addressCountry: "Nepal",
          addressRegion: "Banke",
          addressLocality: "pariwartan",
        },
        department: {
          "@type": "Organization",
          name: "Agriculture Department",
          alternateName: "कृषि शाखा",
          employees: representativesList,
        },
      },
      provider: {
        "@type": "Organization",
        name: "pariwartan Rural Municipality",
        url: "https://digital.pariwartanmun.gov.np",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="agriculture-representatives-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
