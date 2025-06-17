"use client";

import Link from "next/link";
import { formatNepaliNumber } from "@/lib/utils/nepali-numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Building, Award } from "lucide-react";

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

interface VeterinaryRepresentativesAnalysisProps {
  representativesData: Representative[];
  summaryData: {
    total_staff: number;
    department: string;
    department_english: string;
    positions: Array<{
      position: string;
      position_english: string;
      count: number;
    }>;
  } | null;
  totalRepresentatives: number;
}

export default function VeterinaryRepresentativesAnalysis({
  representativesData,
  summaryData,
  totalRepresentatives,
}: VeterinaryRepresentativesAnalysisProps) {
  // Calculate statistics
  const positionCounts = representativesData.reduce(
    (acc, rep) => {
      acc[rep.position] = (acc[rep.position] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const branchCounts = representativesData.reduce(
    (acc, rep) => {
      acc[rep.branch] = (acc[rep.branch] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      <h2 id="analysis-statistics" className="scroll-m-20 border-b pb-2">
        विश्लेषण र सांख्यिकी
      </h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल कर्मचारी</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNepaliNumber(totalRepresentatives)}
            </div>
            <p className="text-xs text-muted-foreground">
              पशु सेवा शाखामा कार्यरत
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">मुख्य पद</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">प्राविधिक</div>
            <p className="text-xs text-muted-foreground">
              पशु स्वास्थ्य प्राविधिक
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">शाखा</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">पशु सेवा</div>
            <p className="text-xs text-muted-foreground">Animal Service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              सम्पर्क उपलब्ध
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNepaliNumber(
                representativesData.filter((rep) => rep.contactNumber).length,
              )}
            </div>
            <p className="text-xs text-muted-foreground">फोन नम्बर सहित</p>
          </CardContent>
        </Card>
      </div>

      {/* Position Analysis */}
      <div className="bg-muted/50 p-4 rounded-lg my-6">
        <h3 className="text-lg font-medium mb-4">पद अनुसार विश्लेषण</h3>
        <div className="space-y-3">
          {Object.entries(positionCounts).map(([position, count]) => (
            <div key={position} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{position}</Badge>
                <span className="text-sm text-muted-foreground">
                  (
                  {
                    representativesData.find((rep) => rep.position === position)
                      ?.positionEnglish
                  }
                  )
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {formatNepaliNumber(count)} जना
                </span>
                <div className="w-16 bg-muted h-2 rounded-full">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{
                      width: `${(count / totalRepresentatives) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information Summary */}
      <div className="bg-muted/50 p-4 rounded-lg my-6">
        <h3 className="text-lg font-medium mb-4">सम्पर्क सूचना सारांश</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-2 text-sm">उपलब्ध सम्पर्क</h4>
            <div className="space-y-2">
              {representativesData.slice(0, 3).map((rep) => (
                <div key={rep.id || rep.serialNumber} className="text-xs">
                  <span className="font-medium">{rep.name}:</span>{" "}
                  <span className="text-primary">{rep.contactNumber}</span>
                </div>
              ))}
              {representativesData.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  + अन्य {formatNepaliNumber(representativesData.length - 3)}{" "}
                  जना
                </div>
              )}
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-2 text-sm">सेवा क्षेत्र</h4>
            <ul className="text-xs space-y-1">
              <li>• पशु स्वास्थ्य जाँच र उपचार</li>
              <li>• पशु खोप र औषधि सेवा</li>
              <li>• पशु प्रजनन सल्लाह</li>
              <li>• पशुपालन तालिम</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Information */}
      <div className="bg-muted/50 p-4 rounded-lg my-6">
        <h3 className="text-lg font-medium mb-3">सेवा सम्बन्धी जानकारी</h3>
        <p className="text-sm mb-4">
          परिवर्तन गाउँपालिकाको पशु सेवा शाखामा कार्यरत यी कर्मचारीहरूले निम्न
          सेवाहरू प्रदान गर्छन्:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-sm">प्रमुख सेवाहरू</h4>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>पशु स्वास्थ्य परीक्षण र रोग निदान</li>
              <li>पशु खोप र बिरामी पशुको उपचार</li>
              <li>पशु प्रजनन र कृत्रिम गर्भाधान सेवा</li>
              <li>पशुपालन सम्बन्धी प्राविधिक सल्लाह</li>
              <li>पशु आहार र पोषण सम्बन्धी जानकारी</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-sm">सम्पर्क समय</h4>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>आइतवार - बिहीवार: बिहान १० बजे - बेलुका ५ बजे</li>
              <li>शुक्रवार: बिहान १० बजे - दिउँसो ३ बजे</li>
              <li>शनिवार: बन्द</li>
              <li>आकस्मिक पशु उपचार: २४ घण्टा उपलब्ध</li>
            </ul>
          </div>
        </div>

        <div className="bg-card p-3 rounded border mt-4">
          <h4 className="font-medium mb-1">सिफारिसहरू</h4>
          <p className="text-sm mt-2">
            पशु स्वास्थ्य सेवा प्राप्त गर्नका लागि:
          </p>
          <ul className="text-sm list-disc pl-5 mt-2">
            <li>पहिले फोनमार्फत सम्पर्क गरी समय लिनुहोस्</li>
            <li>पशुको स्वास्थ्य इतिहास तयार राख्नुहोस्</li>
            <li>आकस्मिक अवस्थामा तुरुन्त सम्पर्क गर्नुहोस्</li>
            <li>नियमित पशु स्वास्थ्य जाँच गराउनुहोस्</li>
          </ul>
        </div>

        <p className="mt-5 text-sm">
          थप जानकारीको लागि कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक प्रोफाइल
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
