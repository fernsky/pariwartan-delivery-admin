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
        name: "Khajura Rural Municipality Agriculture Department",
        alternateName: "परिवर्तन गाउँपालिका कृषि शाखा",
        department: rep.branch,
      },
      description: `${rep.positionFull} at ${rep.branch} department of Khajura Rural Municipality`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Agriculture Representatives of Khajura Rural Municipality",
      description: `Complete list of ${totalRepresentatives} agriculture representatives working in Khajura Rural Municipality's Agriculture Department`,
      numberOfItems: totalRepresentatives,
      itemListElement: representativesList.map((rep, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: rep,
      })),
      about: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        alternateName: "परिवर्तन गाउँपालिका",
        url: "https://paribartan.digprofile.com",
        address: {
          "@type": "PostalAddress",
          addressCountry: "Nepal",
          addressRegion: "Banke",
          addressLocality: "Khajura",
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
        name: "Khajura Rural Municipality",
        url: "https://paribartan.digprofile.com",
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
