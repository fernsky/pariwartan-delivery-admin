import {
  ChevronRight,
  BarChart3,
  PieChart,
  Users,
  UserCheck,
  Activity,
  Skull,
  HeartPulse,
  Building,
  BabyIcon,
  Home,
  Clock,
  Mountain,
  MapPin,
} from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "परिवर्तन गाउँपालिका जनसांख्यिकी तथ्याङ्क | डिजिटल प्रोफाइल",
  description:
    "परिवर्तन गाउँपालिकाको जनसांख्यिकी तथ्याङ्क: जनसंख्या, उमेर, लिङ्ग, जात, धर्म, मातृभाषा र वैवाहिक स्थिति सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण।",
  keywords: [
    "परिवर्तन गाउँपालिका",
    "जनसांख्यिकी",
    "जनगणना",
    "जनसंख्या",
    "जात",
    "धर्म",
    "मातृभाषा",
    "वैवाहिक स्थिति",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "परिवर्तन गाउँपालिका जनसांख्यिकी तथ्याङ्क | डिजिटल प्रोफाइल",
    description:
      "परिवर्तन गाउँपालिकाको जनसांख्यिकी तथ्याङ्क: जनसंख्या, उमेर, लिङ्ग, जात, धर्म, मातृभाषा र वैवाहिक स्थिति सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण।",
    type: "article",
    locale: "ne_NP",
    siteName: "परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const demographicCategories = [
  {
    title: "उमेर र लिङ्ग अनुसार जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा उमेर समूह र लिङ्ग अनुसार जनसंख्या वितरण र वडागत विश्लेषण।",
    href: "/profile/demographics/age-wise-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "मातृभाषा अनुसार जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा बोलिने विभिन्न मातृभाषाहरू र तिनका वक्ताहरूको जनसंख्या।",
    href: "/profile/demographics/ward-wise-mother-tongue-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "धर्म अनुसार जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा मानिने विभिन्न धर्महरू र तिनका अनुयायीहरूको जनसंख्या।",
    href: "/profile/demographics/ward-wise-religion-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "जात/जनजाति अनुसार जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा विभिन्न जात र जनजातिको जनसंख्या र वितरण सम्बन्धी विस्तृत जानकारी।",
    href: "/profile/demographics/caste-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "घरमुलीको लिङ्ग अनुसार घरधुरी",
    description:
      "परिवर्तन गाउँपालिकामा वडागत घरमुली लिङ्ग वितरण र लैङ्गिक समानताको अवस्था।",
    href: "/profile/demographics/ward-wise-househead-gender",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "पेशाको आधारमा जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा मुख्य पेशा अनुसार जनसंख्याको वितरण र आर्थिक संरचना।",
    href: "/profile/demographics/ward-main-occupations",
    icon: <Building className="h-5 w-5" />,
  },
  {
    title: "आर्थिक रुपले सक्रिय जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा उमेर समूह अनुसार आर्थिक रुपले सक्रिय जनसंख्याको विश्लेषण।",
    href: "/profile/demographics/ward-age-wise-economically-active-population",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "अपाङ्गता कारणका आधारमा जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा अपाङ्गताको कारण अनुसार जनसंख्याको वितरण र विश्लेषण।",
    href: "/profile/demographics/ward-wise-disability-cause",
    icon: <HeartPulse className="h-5 w-5" />,
  },
  {
    title: "जन्म स्थानको आधारमा घरधुरी",
    description:
      "परिवर्तन गाउँपालिकामा घरपरिवारको जन्मस्थान अनुसार वितरण र बसाई सराईको प्रवृत्ति।",
    href: "/profile/demographics/ward-wise-birthplace-households",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "बालबालिकाको जन्मदर्ताको आधारमा जनसंख्या",
    description:
      "परिवर्तन गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता सम्बन्धी तथ्याङ्क।",
    href: "/profile/demographics/ward-wise-birth-certificate-population",
    icon: <BabyIcon className="h-5 w-5" />,
  },
  {
    title: "विगत १२ महिनामा मृत्यु भएकाको विवरण",
    description:
      "परिवर्तन गाउँपालिकामा उमेर तथा लिङ्ग अनुसार मृत्यु विवरण र मृत्युदर विश्लेषण।",
    href: "/profile/demographics/ward-age-gender-wise-deceased-population",
    icon: <Clock className="h-5 w-5" />,
  },
];

export default async function DemographicsPage() {
  // Fetch hero demographic summary for the municipality
  let heroData;
  try {
    heroData =
      await api.profile.demographics.heroDemographics.getheroDemographicsSummary.query(
        {
          municipalityId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // Use default municipality ID
        },
      );
  } catch (error) {
    console.error("Error fetching hero demographic summary:", error);
  }

  // Calculate estimated households if not available
  const estimatedHouseholds = heroData?.totalPopulation
    ? Math.round(heroData.totalPopulation / 2.87) // Average household size estimation
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/demographics-hero.svg"
            alt="परिवर्तन गाउँपालिका जनसांख्यिकी"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>

        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            परिवर्तन गाउँपालिकाको जनसांख्यिक विवरण
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              जनसांख्यिकी तथ्याङ्क गाउँपालिका विकास, योजना र नीति निर्माणका लागि
              अत्यन्त महत्त्वपूर्ण हुन्छ। परिवर्तन गाउँपालिकाको जनसांख्यिकी
              प्रोफाइलमा जनसंख्या, वडागत वितरण, क्षेत्रफल र अन्य महत्वपूर्ण
              तथ्याङ्कहरू समेटिएका छन्। यी तथ्याङ्कहरूले स्थानीय सरकारलाई स्रोत
              विनियोजन, विकास योजना तयारी र सेवा प्रवाहलाई लक्षित समुदायसम्म
              पुर्‍याउन सहयोग पुर्‍याउँछन्।
            </p>
          </div>
        </section>

        {/* Key Demographics Section - Only show available data */}
        {heroData && (
          <section id="key-demographics">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 mb-6">
                प्रमुख जनसांख्यिकी तथ्यहरू
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Population */}
              <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">कुल जनसंख्या</h3>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {localizeNumber(
                    heroData.totalPopulation.toLocaleString(),
                    "ne",
                  )}
                </p>
              </div>

              {/* Total Area */}
              <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">कुल क्षेत्रफल</h3>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {localizeNumber(heroData.totalAreaSqKm.toString(), "ne")}
                </p>
                <p className="text-sm text-muted-foreground">वर्ग कि.मि.</p>
              </div>

              {/* Total Wards */}
              <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">कुल वडा संख्या</h3>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {localizeNumber(heroData.totalWards.toString(), "ne")}
                </p>
              </div>

              {/* Estimated Households */}
              {estimatedHouseholds && (
                <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">अनुमानित घरधुरी</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {localizeNumber(estimatedHouseholds.toLocaleString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    (औसत ३ सदस्य प्रति घर)
                  </p>
                </div>
              )}
            </div>

            {/* Additional stats if available */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* Population Density */}
              {heroData.populationDensity && heroData.populationDensity > 0 && (
                <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium mb-2">जनसंख्या घनत्व</h3>
                  <p className="text-3xl font-bold text-primary">
                    {localizeNumber(
                      heroData.populationDensity.toFixed(1),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    (प्रति वर्ग किलोमिटर)
                  </p>
                </div>
              )}

              {/* Average Ward Population */}
              {heroData.averageWardPopulation &&
                heroData.averageWardPopulation > 0 && (
                  <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-2">
                      औसत वडा जनसंख्या
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                      {localizeNumber(
                        Math.round(
                          heroData.averageWardPopulation,
                        ).toLocaleString(),
                        "ne",
                      )}
                    </p>
                  </div>
                )}

              {/* Average Ward Area */}
              {heroData.averageWardArea && heroData.averageWardArea > 0 && (
                <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium mb-2">
                    औसत वडा क्षेत्रफल
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {localizeNumber(heroData.averageWardArea.toFixed(1), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground">वर्ग कि.मि.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ward Details Section - commented out as wards data is not available */}
        {/* TODO: Implement ward details section when ward data is available from API */}

        {/* Demographic Categories Section */}
        <section id="demographic-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              जनसांख्यिकी श्रेणीहरू
            </h2>
            <p>
              परिवर्तन गाउँपालिकाको जनसांख्यिकी सम्बन्धी विस्तृत जानकारीका लागि
              तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत तथ्याङ्क,
              चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demographicCategories.map((category, i) => (
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
      </div>
    </div>
  );
}
