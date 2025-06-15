import { Metadata } from "next";

interface ForeignEmploymentSEOProps {
  title?: string;
  description?: string;
}

export const metadata: Metadata = {
  title: "वडागत वैदेशिक रोजगारी देशहरू | Pariwartan Delivery Admin",
  description:
    "विभिन्न देशहरूमा वैदेशिक रोजगारीमा गएका व्यक्तिहरूको वडागत विवरण र विश्लेषण",
  keywords: [
    "वैदेशिक रोजगारी",
    "foreign employment",
    "migration data",
    "Nepal statistics",
    "ward wise data",
    "employment analysis",
  ],
  openGraph: {
    title: "वडागत वैदेशिक रोजगारी देशहरू",
    description:
      "विभिन्न देशहरूमा वैदेशिक रोजगारीमा गएका व्यक्तिहरूको वडागत विवरण र विश्लेषण",
    type: "website",
    locale: "ne_NP",
  },
  twitter: {
    card: "summary_large_image",
    title: "वडागत वैदेशिक रोजगारी देशहरू",
    description:
      "विभिन्न देशहरूमा वैदेशिक रोजगारीमा गएका व्यक्तिहरूको वडागत विवरण",
  },
};

export default function ForeignEmploymentSEO({
  title = "वडागत वैदेशिक रोजगारी देशहरू",
  description = "विभिन्न देशहरूमा वैदेशिक रोजगारीमा गएका व्यक्तिहरूको वडागत विवरण र विश्लेषण",
}: ForeignEmploymentSEOProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: title,
            description: description,
            keywords:
              "वैदेशिक रोजगारी, foreign employment, migration data, Nepal statistics",
            creator: {
              "@type": "Organization",
              name: "Pariwartan Delivery Admin",
            },
            datePublished: new Date().toISOString(),
            inLanguage: "ne",
            spatialCoverage: {
              "@type": "Place",
              name: "Nepal",
            },
          }),
        }}
      />
    </>
  );
}
