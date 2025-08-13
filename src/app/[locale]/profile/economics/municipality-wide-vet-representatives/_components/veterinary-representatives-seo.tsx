import Script from "next/script";

interface Representative {
  id?: string;
  serialNumber: number;
  name: string;
  nameEnglish: string;
  position: string;
  positionEnglish: string;
  contactNumber: string;
  branch: string;
  branchEnglish: string;
  remarks?: string;
}

interface VeterinaryRepresentativesSEOProps {
  representativesData: Representative[];
  totalRepresentatives: number;
}

export default function VeterinaryRepresentativesSEO({
  representativesData,
  totalRepresentatives,
}: VeterinaryRepresentativesSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    const representativesList = representativesData.map((rep) => ({
      "@type": "Person",
      name: rep.name,
      alternateName: rep.nameEnglish,
      jobTitle: rep.position,
      telephone: rep.contactNumber,
      worksFor: {
        "@type": "Organization",
        name: "Paribartan Rural Municipality Animal Service Branch",
        alternateName: "परिवर्तन गाउँपालिका पशु सेवा शाखा",
        department: rep.branch,
      },
      description: `${rep.position} at ${rep.branch} department of Paribartan Rural Municipality`,
      specialty: "Veterinary Services",
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Veterinary Representatives of Paribartan Rural Municipality",
      description: `Complete list of ${totalRepresentatives} veterinary representatives working in Paribartan Rural Municipality's Animal Service Department`,
      numberOfItems: totalRepresentatives,
      itemListElement: representativesList.map((rep, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: rep,
      })),
      about: {
        "@type": "Organization",
        name: "Paribartan Rural Municipality",
        alternateName: "परिवर्तन गाउँपालिका",
        url: "https://paribartan.digprofile.com",
        address: {
          "@type": "PostalAddress",
          addressCountry: "Nepal",
          addressRegion: "Banke",
          addressLocality: "Paribartan",
        },
        department: {
          "@type": "Organization",
          name: "Animal Service Branch",
          alternateName: "पशु सेवा शाखा",
          employees: representativesList,
          serviceType: "Veterinary Services",
        },
      },
      provider: {
        "@type": "Organization",
        name: "Paribartan Rural Municipality",
        url: "https://paribartan.digprofile.com",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="veterinary-representatives-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
