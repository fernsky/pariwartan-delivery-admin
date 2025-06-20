import { ChevronRight, MapPin, Home, Mountain, Globe } from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "गाउँपालिका चिनारी | डिजिटल प्रोफाइल",
  description:
    "गाउँपालिकाको चिनारी सम्बन्धी तथ्याङ्क: वडागत विवरण, मुख्य बस्तीहरूको विवरण, भूमि भिरालोपनको विवरण, भूमि मोहडाको विवरण सम्बन्धी विस्तृत जानकारी।",
  keywords: [
    "गाउँपालिका",
    "गाउँपालिकाको चिनारी",
    "वडागत विवरण",
    "मुख्य बस्तीहरू",
    "भूमि भिरालोपन",
    "भूमि मोहडा",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "गाउँपालिका चिनारी | डिजिटल प्रोफाइल",
    description:
      "गाउँपालिकाको चिनारी सम्बन्धी तथ्याङ्क: वडागत विवरण, मुख्य बस्तीहरूको विवरण, भूमि भिरालोपनको विवरण, भूमि मोहडाको विवरण सम्बन्धी विस्तृत जानकारी।",
    type: "article",
    locale: "ne_NP",
    siteName: "गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const municipalityInformationCategories = [
  {
    title: "वडागत विवरण",
    description:
      "गाउँपालिकाको वडागत विवरण, क्षेत्रफल, जनसंख्या र घरपरिवार सम्बन्धी विस्तृत तथ्याङ्क।",
    href: "/profile/municipality-introduction/municipality-ward-information",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "मुख्य बस्तीहरूको विवरण",
    description:
      "गाउँपालिकामा रहेका वडागत मुख्य बस्तीहरूको विवरण, वितरण र विश्लेषण।",
    href: "/profile/municipality-introduction/municipality-ward-wise-settlements",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "भूमि भिरालोपनको विवरण",
    description:
      "गाउँपालिकाको भूमिको भिरालोपन अनुसारको वर्गीकरण र क्षेत्रफल सम्बन्धी तथ्याङ्क।",
    href: "/profile/municipality-introduction/municipality-terrain-slope",
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    title: "भूमि मोहडाको विवरण",
    description:
      "गाउँपालिकाको भूमिको मोहडा अनुसारको वर्गीकरण र मोहडागत क्षेत्रफल विश्लेषण।",
    href: "/profile/municipality-introduction/municipality-terrain-aspect",
    icon: <Globe className="h-5 w-5" />,
  },
];

export default async function MunicipalityIntroductionPage() {
  // Fetch general demographic data from hero-demographics procedure
  let heroData = null;
  try {
    heroData =
      await api.profile.demographics.heroDemographics.getheroDemographicsSummary.query(
        {
          municipalityId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // Use default municipality ID
        },
      );
  } catch (error) {
    console.error("Error fetching municipality summary data:", error);
  }

  // Try to fetch some basic data from different modules
  let slopeData = null;
  let aspectData = null;
  let wardData = null;
  let settlementData = null;

  try {
    // Fetch basic data from different modules
    slopeData = await api.profile.municipalityIntroduction.municipalitySlope.get
      .query({
        municipalityId: 1,
      })
      .catch(() => null);

    aspectData =
      await api.profile.municipalityIntroduction.municipalityAspect.get
        .query({
          municipalityId: 1,
        })
        .catch(() => null);

    // Try to get settlement data
    settlementData =
      await api.profile.municipalityIntroduction.municipalityWardWiseSettlement.get
        .query({
          municipalityId: 1,
        })
        .catch(() => null);

    // Try to get ward information using the hero-demographics procedure instead of a separate call
    wardData = await api.profile.demographics.heroDemographics.getWardTable
      .query({
        municipalityId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      })
      .catch(() => null);
  } catch (error) {
    console.error("Error fetching additional data:", error);
  }

  // Extract key metrics for the hero section
  const totalWards = heroData?.totalWards || 0;
  const totalArea = heroData?.totalAreaSqKm || 0;
  const totalSettlements = settlementData
    ? settlementData.data.reduce(
        (sum, ward) => sum + ward.settlements.length,
        0,
      )
    : 0;
  const prominentSlope = slopeData
    ? slopeData.data.sort((a, b) => b.area_percentage - a.area_percentage)[0]
        ?.slope_range_nepali
    : "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/ward-settlement-diversity.svg"
            alt="गाउँपालिका चिनारी"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>

        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">गाउँपालिकाको चिनारी</h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              गाउँपालिकाको चिनारी खण्डमा गाउँपालिकाको भौगोलिक, प्रशासनिक र भौतिक
              संरचना सम्बन्धी महत्त्वपूर्ण जानकारी समावेश गरिएको छ। यस खण्डमा
              वडागत विवरण, प्रमुख बस्तीहरू, भूमिको भिरालोपन र मोहडा विवरण जस्ता
              तथ्याङ्कहरू प्रस्तुत गरिएका छन्। यी जानकारीहरूले गाउँपालिकाको
              भू-बनावट र बसोबास व्यवस्था सम्बन्धी महत्त्वपूर्ण तथ्य उजागर
              गर्दछन्, जुन भौतिक विकास योजना, प्राकृतिक स्रोत व्यवस्थापन र आवास
              क्षेत्र विकासका लागि अत्यन्त महत्त्वपूर्ण हुन्छ।
            </p>
          </div>
        </section>

        {/* Key Facts Section */}
        <section id="key-facts">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 mb-6">
              प्रमुख तथ्यहरू
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Wards */}
            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">कुल वडा संख्या</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {localizeNumber(totalWards.toString(), "ne")}
              </p>
              <p className="text-sm text-muted-foreground">प्रशासनिक इकाईहरू</p>
            </div>

            {/* Total Area */}
            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">कुल क्षेत्रफल</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {localizeNumber(totalArea.toFixed(2), "ne")}
              </p>
              <p className="text-sm text-muted-foreground">वर्ग किलोमिटर</p>
            </div>

            {/* Total Settlements */}
            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">प्रमुख बस्तीहरू</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {localizeNumber(totalSettlements.toString(), "ne")}
              </p>
              <p className="text-sm text-muted-foreground">वडागत बस्तीहरू</p>
            </div>

            {/* Prominent Slope */}
            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">प्रमुख भिरालोपन</h3>
              </div>
              <p className="text-2xl font-bold text-primary">
                {prominentSlope || "तथ्याङ्क उपलब्ध छैन"}
              </p>
              <p className="text-sm text-muted-foreground">
                बढी क्षेत्रफल भएको भिरालोपन
              </p>
            </div>
          </div>
        </section>

        {/* Municipality Introduction Categories Section */}
        <section id="municipality-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              गाउँपालिकाको चिनारी श्रेणीहरू
            </h2>
            <p>
              गाउँपालिकाको चिनारी सम्बन्धी विस्तृत जानकारीका लागि तलका श्रेणीहरू
              हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत तथ्याङ्क, चार्ट र विश्लेषण
              प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {municipalityInformationCategories.map((category, i) => (
              <Link
                key={i}
                href={category.href}
                className="flex flex-col h-full group hover:shadow-md transition-all duration-200 bg-background border rounded-lg overflow-hidden"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-muted/20 flex items-center justify-end">
                  <span className="text-sm text-primary font-medium flex items-center">
                    हेर्नुहोस् <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Important Information Section */}
        <section id="important-information" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              महत्त्वपूर्ण जानकारी
            </h2>

            <p>
              गाउँपालिकाको चिनारी सम्बन्धी तथ्याङ्कहरूले निम्न क्षेत्रहरूमा
              महत्त्वपूर्ण भूमिका खेल्दछन्:
            </p>

            <div className="pl-6 space-y-4 mt-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>भौतिक विकास योजना:</strong> वडागत विवरण र प्रमुख
                  बस्तीहरूको जानकारी भौतिक पूर्वाधार विकासका लागि आधारभूत
                  तथ्याङ्क प्रदान गर्दछ।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>प्राकृतिक स्रोत व्यवस्थापन:</strong> भूमिको भिरालोपन र
                  मोहडा सम्बन्धी तथ्याङ्कले प्राकृतिक स्रोत, कृषि योग्य भूमि र
                  संरक्षण क्षेत्रहरू पहिचान गर्न मद्दत गर्दछ।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>जोखिम न्यूनीकरण:</strong> भू-बनावटको विवरणले भूक्षय,
                  पहिरो र बाढी जस्ता प्राकृतिक प्रकोपका जोखिमपूर्ण क्षेत्रहरू
                  पहिचान गर्न सहयोग गर्दछ।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>सेवा वितरण:</strong> बस्तीको विवरण र वडागत जानकारीले
                  सेवा वितरणलाई प्रभावकारी बनाउन र सबै नागरिकसम्म पहुँच
                  सुनिश्चित गर्न मद्दत गर्दछ।
                </div>
              </div>
            </div>

            <p className="mt-6">
              विस्तृत तथ्याङ्क र विश्लेषणका लागि माथि उल्लेखित विभिन्न श्रेणीहरू
              अन्तर्गतका पृष्ठहरू हेर्नुहोस्।
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
