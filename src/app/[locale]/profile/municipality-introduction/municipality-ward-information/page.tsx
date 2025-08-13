import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import WardCharts from "./_components/ward-charts";
import WardAnalysisSection from "./_components/ward-analysis-section";
import WardSEO from "./_components/ward-seo";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";

// Force dynamic rendering since we're using tRPC
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [{ locale: "en" }];
}

export const revalidate = 86400; // Revalidate once per day

export async function generateMetadata(): Promise<Metadata> {
  try {
    const wardData =
      await api.profile.demographics.heroDemographics.getheroDemographics.query(
        {
          municipalityId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        },
      );

    const municipalityName = "परिवर्तन गाउँपालिका";
    const totalPopulation = wardData.totalPopulation;
    const totalArea = wardData.totalAreaSqKm;
    const totalWards = wardData.totalWards;

    const descriptionNP = `परिवर्तन गाउँपालिकाको वडा अनुसारको जनसंख्या र क्षेत्रफल विवरण। कुल ${localizeNumber(totalWards.toString(), "ne")} वटा वडामा ${localizeNumber(totalPopulation.toString(), "ne")} जनसंख्या र ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि. क्षेत्रफल रहेको छ।`;

    const descriptionEN = `Ward-wise population and area distribution of Paribartan Rural Municipality. Total ${totalWards} wards with ${totalPopulation} population and ${totalArea} sq. km. area.`;

    return {
      title: `परिवर्तन गाउँपालिका | वडा अनुसार जनसंख्या विवरण | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [
        "परिवर्तन गाउँपालिका वडा विवरण",
        "परिवर्तन जनसंख्या तथ्याङ्क",
        "Paribartan ward information",
        "Municipality ward data",
        "Population statistics Nepal",
        "Ward demographics Paribartan",
        `परिवर्तन कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
      ],
      alternates: {
        canonical:
          "/profile/municipality-introduction/municipality-ward-information",
        languages: {
          en: "/en/profile/municipality-introduction/municipality-ward-information",
          ne: "/ne/profile/municipality-introduction/municipality-ward-information",
        },
      },
      openGraph: {
        title: `वडा अनुसार जनसंख्या विवरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वडा अनुसार जनसंख्या विवरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    return {
      title:
        "परिवर्तन गाउँपालिकाको वडा अनुसार जनसंख्या विवरण | पालिका प्रोफाइल",
      description:
        "परिवर्तन गाउँपालिकाको वडाहरूको जनसंख्या र क्षेत्रफल सम्बन्धी विस्तृत विवरण। प्रत्येक वडाको जनसंख्या घनत्व र क्षेत्रफल।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "वडा अनुसार जनसंख्या विवरण", slug: "ward-information" },
  { level: 2, text: "जनसांख्यिक विश्लेषण", slug: "demographic-analysis" },
];

export default async function MunicipalityWardInformationPage() {
  // Fetch ward data
  const wardData =
    await api.profile.demographics.heroDemographics.getheroDemographics.query({
      municipalityId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <WardSEO wardData={wardData} />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/agriculture.svg"
              width={1200}
              height={400}
              alt="वडा अनुसार जनसंख्या विवरण - जनसांख्यिक तथ्याङ्क (Ward-wise Population Information - Demographic Data)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg font-semibold">जनसांख्यिक विवरण</h2>
              <p className="text-sm opacity-90">वडा अनुसारको जनसंख्या वितरण</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              <span className="font-bold">परिवर्तन गाउँपालिकाको</span> वडा
              अनुसार जनसंख्या विवरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकाको वडा अनुसारको जनसंख्या र क्षेत्रफल
              सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो तथ्याङ्कले
              परिवर्तन गाउँपालिकाको जनसांख्यिक वितरण, जनसंख्या घनत्व, र प्रत्येक
              वडाको भौगोलिक विविधतालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              परिवर्तन गाउँपालिकामा कुल{" "}
              {localizeNumber(wardData.totalWards.toString(), "ne")} वटा वडा
              छन्। यसको कुल जनसंख्या{" "}
              {localizeNumber(wardData.totalPopulation.toString(), "ne")} र कुल
              क्षेत्रफल{" "}
              {localizeNumber(wardData.totalAreaSqKm.toString(), "ne")} वर्ग
              कि.मि. छ। जनसंख्या घनत्व{" "}
              {localizeNumber(
                wardData.populationDensity?.toFixed(1) || "133",
                "ne",
              )}{" "}
              प्रति वर्ग कि.मि. रहेको छ।
            </p>

            <h2 id="ward-information" className="scroll-m-20 border-b pb-2">
              वडा अनुसार जनसंख्या विवरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको विभिन्न वडाहरूको जनसंख्या र क्षेत्रफल वितरण
              निम्नानुसार छ:
            </p>
          </div>

          <WardCharts wardData={wardData} />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="demographic-analysis" className="scroll-m-20 border-b pb-2">
              जनसांख्यिक विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको जनसांख्यिक संरचना अनुसार देख्दा यसमा सबै
              वडाहरूमा जनसंख्या र क्षेत्रफलको विविधता देखिन्छ। सबैभन्दा बढी
              जनसंख्या भएको वडा र सबैभन्दा कम जनसंख्या भएको वडाको तुलना गर्दा
              महत्वपूर्ण भिन्नता देखिन्छ।
            </p>

            <WardAnalysisSection wardData={wardData} />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
