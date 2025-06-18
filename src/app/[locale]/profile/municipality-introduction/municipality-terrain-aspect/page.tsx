import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import AspectCharts from "./_components/aspect-charts";
import AspectAnalysisSection from "./_components/aspect-analysis-section";
import AspectSEO from "./_components/aspect-seo";
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
    const aspectData =
      await api.profile.municipalityIntroduction.municipalityAspect.get.query({
        municipalityId: 1,
      });

    const municipalityName = "परिवर्तन गाउँपालिका";
    const totalArea = aspectData.total.area_sq_km;
    const highestAspect = aspectData.metadata.highest_area;

    const descriptionNP = `परिवर्तन गाउँपालिकाको मोहोडा अनुसारको क्षेत्रफल विवरण र भौगोलिक विश्लेषण। कुल क्षेत्रफल ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि. मध्ये ${localizeNumber(highestAspect.area_percentage.toFixed(1), "ne")}% भाग ${highestAspect.direction} मोहोडामा रहेको छ।`;

    const descriptionEN = `Area distribution by aspect (direction) and geographical analysis of Khajura Rural Municipality. Out of total area ${totalArea} sq. km., ${highestAspect.area_percentage.toFixed(1)}% faces ${highestAspect.direction_english} direction.`;

    return {
      title: `परिवर्तन गाउँपालिका | मोहोडा अनुसार क्षेत्रफल विवरण | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [
        "परिवर्तन गाउँपालिका मोहोडा",
        "परिवर्तन दिशा विवरण",
        "Khajura aspect information",
        "Municipality directional data",
        "Aspect analysis Nepal",
        "Terrain aspect Khajura",
        `परिवर्तन कुल क्षेत्रफल ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि.`,
      ],
      alternates: {
        canonical:
          "/profile/municipality-introduction/municipality-terrain-aspect",
        languages: {
          en: "/en/profile/municipality-introduction/municipality-terrain-aspect",
          ne: "/ne/profile/municipality-introduction/municipality-terrain-aspect",
        },
      },
      openGraph: {
        title: `मोहोडा अनुसार क्षेत्रफल विवरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `मोहोडा अनुसार क्षेत्रफल विवरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    return {
      title:
        "परिवर्तन गाउँपालिकाको मोहोडा अनुसार क्षेत्रफल विवरण | पालिका प्रोफाइल",
      description:
        "परिवर्तन गाउँपालिकाको मोहोडा र दिशा अनुसारको भौगोलिक विवरण। विभिन्न दिशाको क्षेत्रफल र प्रतिशत वितरण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "मोहोडा अनुसार क्षेत्रफल विवरण",
    slug: "aspect-information",
  },
  { level: 2, text: "भौगोलिक विश्लेषण", slug: "geographical-analysis" },
];

export default async function MunicipalityAspectPage() {
  // Fetch aspect data
  const aspectData =
    await api.profile.municipalityIntroduction.municipalityAspect.get.query({
      municipalityId: 1,
    });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <AspectSEO aspectData={aspectData} />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/municipality-terrain.svg"
              width={1200}
              height={400}
              alt="मोहोडा अनुसार क्षेत्रफल विवरण - दिशा र भूभाग जानकारी (Aspect Information - Direction and Terrain Data)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg font-semibold">भौगोलिक मोहोडा</h2>
              <p className="text-sm opacity-90">
                विभिन्न दिशा अनुसारको क्षेत्रफल वितरण
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              <span className="font-bold">परिवर्तन गाउँपालिकाको</span> मोहोडा
              अनुसार क्षेत्रफल विवरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकाको भौगोलिक संरचना र मोहोडा (दिशा)
              अनुसारको विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो तथ्याङ्कले
              परिवर्तन गाउँपालिकाको भू-भागीय विविधता, सूर्यको प्रकाश पाउने
              क्षमता, र कृषि उत्पादनको सम्भावनालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              परिवर्तन गाउँपालिकाको कुल क्षेत्रफल{" "}
              {localizeNumber(aspectData.total.area_sq_km.toString(), "ne")}{" "}
              वर्ग कि.मि. छ। यसमध्ये सबैभन्दा बढी भाग (
              {localizeNumber(
                aspectData.metadata.highest_area.area_percentage.toFixed(1),
                "ne",
              )}
              %) {aspectData.metadata.highest_area.direction} मोहोडामा रहेको छ,
              जसले विविध कृषि र वन संरक्षणका लागि उपयुक्त वातावरण प्रदान गर्दछ।
            </p>

            <h2 id="aspect-information" className="scroll-m-20 border-b pb-2">
              मोहोडा अनुसार क्षेत्रफल विवरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको विभिन्न दिशा अनुसारको क्षेत्रफल वितरण
              निम्नानुसार छ:
            </p>
          </div>

          <AspectCharts aspectData={aspectData} />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="geographical-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              भौगोलिक विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको भौगोलिक संरचना अनुसार देख्दा यसमा सबै
              दिशाहरूमा भूभाग फैलिएको छ।{" "}
              {aspectData.metadata.highest_area.direction_english} दिशामा
              सबैभन्दा बढी क्षेत्रफल (
              {aspectData.metadata.highest_area.area_percentage.toFixed(1)}%)
              रहेको छ भने {aspectData.metadata.lowest_area.direction_english}{" "}
              दिशामा सबैभन्दा कम (
              {aspectData.metadata.lowest_area.area_percentage.toFixed(1)}%)
              रहेको छ।
            </p>

            <AspectAnalysisSection aspectData={aspectData} />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
