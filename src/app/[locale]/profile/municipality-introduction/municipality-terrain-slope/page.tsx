import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import SlopeCharts from "./_components/slope-charts";
import SlopeAnalysisSection from "./_components/slope-analysis-section";
import SlopeSEO from "./_components/slope-seo";
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
    const slopeData =
      await api.profile.municipalityIntroduction.municipalitySlope.get.query({
        municipalityId: 1,
      });

    const municipalityName = "परिवर्तन गाउँपालिका";
    const totalArea = slopeData.total.total_area_sq_km;
    const gentleSlope = slopeData.data.find((item) =>
      item.slope_range_english.includes("0 degrees to 5 degrees"),
    );

    const descriptionNP = `परिवर्तन गाउँपालिकाको भिरालोपन विवरण र भौगोलिक विश्लेषण। कुल क्षेत्रफल ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि. मध्ये ${gentleSlope ? localizeNumber(gentleSlope.area_percentage.toFixed(1), "ne") : "७५.७"}% भाग सामान्य ढलान (०-५ डिग्री) रहेको छ।`;

    const descriptionEN = `Slope information and geographical analysis of Khajura Rural Municipality. Out of total area ${totalArea} sq. km., ${gentleSlope ? gentleSlope.area_percentage.toFixed(1) : "75.7"}% has gentle slope (0-5 degrees).`;

    return {
      title: `परिवर्तन गाउँपालिका | भिरालोपन विवरण | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [
        "परिवर्तन गाउँपालिका भिरालोपन",
        "परिवर्तन भौगोलिक विवरण",
        "Khajura slope information",
        "Municipality geographical data",
        "Slope analysis Nepal",
        "Terrain data Khajura",
        `परिवर्तन कुल क्षेत्रफल ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि.`,
      ],
      alternates: {
        canonical: "/profile/municipality-introduction",
        languages: {
          en: "/en/profile/municipality-introduction",
          ne: "/ne/profile/municipality-introduction",
        },
      },
      openGraph: {
        title: `भिरालोपन विवरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `भिरालोपन विवरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    return {
      title: "परिवर्तन गाउँपालिकाको भिरालोपन विवरण | पालिका प्रोफाइल",
      description:
        "परिवर्तन गाउँपालिकाको भिरालोपन र भौगोलिक विवरण। विभिन्न ढलानको क्षेत्रफल र प्रतिशत वितरण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "भिरालोपन विवरण", slug: "slope-information" },
  { level: 2, text: "भौगोलिक विश्लेषण", slug: "geographical-analysis" },
];

export default async function MunicipalityIntroductionPage() {
  // Fetch slope data
  const slopeData =
    await api.profile.municipalityIntroduction.municipalitySlope.get.query({
      municipalityId: 1,
    });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <SlopeSEO slopeData={slopeData} />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/municipality-terrain.svg"
              width={1200}
              height={400}
              alt="भिरालोपन विवरण - स्थलाकृति र ढलान जानकारी (Slope Information - Topography and Terrain Data)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg font-semibold">भौगोलिक स्थलाकृति</h2>
              <p className="text-sm opacity-90">
                विभिन्न ढलान क्षेत्रहरूको वितरण
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              <span className="font-bold">परिवर्तन गाउँपालिकाको</span> भिरालोपन
              विवरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा परिवर्तन गाउँपालिकाको भौगोलिक संरचना र भिरालोपन सम्बन्धी
              विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो तथ्याङ्कले परिवर्तन
              गाउँपालिकाको भू-भागीय विविधता, कृषि योग्य भूमि, र भौतिक पूर्वाधार
              विकासको सम्भावनालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              परिवर्तन गाउँपालिकाको कुल क्षेत्रफल{" "}
              {localizeNumber(
                slopeData.total.total_area_sq_km.toString(),
                "ne",
              )}{" "}
              वर्ग कि.मि. छ। यसमध्ये अधिकांश भाग (
              {localizeNumber(
                slopeData.data[0]?.area_percentage.toFixed(1) || "75.7",
                "ne",
              )}
              %) सामान्य ढलान (०-५ डिग्री) भएको छ, जसले कृषि र बसोबासका लागि
              उपयुक्त वातावरण प्रदान गर्दछ।
            </p>

            <h2 id="slope-information" className="scroll-m-20 border-b pb-2">
              भिरालोपन विवरण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको विभिन्न ढलान अनुसारको क्षेत्रफल वितरण
              निम्नानुसार छ:
            </p>
          </div>

          <SlopeCharts slopeData={slopeData} />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="geographical-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              भौगोलिक विश्लेषण
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको भौगोलिक संरचना अनुसार देख्दा यो मुख्यतः समतल
              र हल्का ढलान भएको क्षेत्र हो। {slopeData.metadata.summary}
            </p>

            <SlopeAnalysisSection slopeData={slopeData} />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
