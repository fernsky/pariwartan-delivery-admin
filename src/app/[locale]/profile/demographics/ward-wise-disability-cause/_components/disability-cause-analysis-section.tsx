"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DisabilityCauseAnalysisProps {
  disabilityData:
    | Array<{
        id?: string;
        ageGroup: string;
        physicalDisability: number;
        visualImpairment: number;
        hearingImpairment: number;
        deafMute: number;
        speechHearingCombined: number;
        intellectualDisability: number;
        mentalPsychosocial: number;
        autism: number;
        multipleDisabilities: number;
        otherDisabilities: number;
        total: number;
      }>
    | null
    | undefined;
  totalDisabled: number;
  totalPhysical: number;
  totalVisual: number;
  totalHearing: number;
}

export default function DisabilityCauseAnalysisSection({
  disabilityData,
  totalDisabled,
  totalPhysical,
  totalVisual,
  totalHearing,
}: DisabilityCauseAnalysisProps) {
  // Add null checks and ensure disabilityData is a valid array
  if (
    !disabilityData ||
    !Array.isArray(disabilityData) ||
    disabilityData.length === 0
  ) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">अपाङ्गता तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  // Filter out total row for calculations
  const dataWithoutTotal = disabilityData.filter(
    (item) => item.ageGroup !== "जम्मा",
  );

  // Find the age group with most disabilities
  const mostAffectedAgeGroup = dataWithoutTotal.reduce((prev, current) =>
    prev.total > current.total ? prev : current,
  );

  // Calculate disability type totals
  const totalDeafMute = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.deafMute || 0),
    0,
  );
  const totalSpeechHearing = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.speechHearingCombined || 0),
    0,
  );
  const totalIntellectual = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.intellectualDisability || 0),
    0,
  );
  const totalMentalPsychosocial = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.mentalPsychosocial || 0),
    0,
  );
  const totalAutism = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.autism || 0),
    0,
  );
  const totalMultiple = dataWithoutTotal.reduce(
    (sum, item) => sum + (item.multipleDisabilities || 0),
    0,
  );

  // Find dominant disability type
  const disabilityTypeData = [
    { name: "शारीरिक अपाङ्गता", value: totalPhysical },
    { name: "दृष्टि अपाङ्गता", value: totalVisual },
    { name: "श्रवण अपाङ्गता", value: totalHearing },
    { name: "बोली-श्रवण अपाङ्गता", value: totalSpeechHearing },
    { name: "बौद्धिक अपाङ्गता", value: totalIntellectual },
    { name: "मानसिक-मनोसामाजिक अपाङ्गता", value: totalMentalPsychosocial },
  ];

  const dominantDisabilityType = disabilityTypeData.reduce((prev, current) =>
    prev.value > current.value ? prev : current,
  );

  // Age groups with high disability rates
  const highDisabilityAgeGroups = dataWithoutTotal
    .filter((item) => item.total > totalDisabled / dataWithoutTotal.length)
    .sort((a, b) => b.total - a.total);

  // Age groups with low disability rates
  const lowDisabilityAgeGroups = dataWithoutTotal
    .filter((item) => item.total < totalDisabled / dataWithoutTotal.length)
    .sort((a, b) => a.total - b.total);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              कुल अपाङ्गता भएका
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(totalDisabled.toLocaleString(), "ne")}
            </div>
            <div className="text-xs text-muted-foreground">
              {dataWithoutTotal.length} उमेर समूह
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              सबैभन्दा प्रभावित उमेर समूह
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {mostAffectedAgeGroup.ageGroup}
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                mostAffectedAgeGroup.total.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                ((mostAffectedAgeGroup.total / totalDisabled) * 100).toFixed(1),
                "ne",
              )}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              प्रमुख अपाङ्गताको प्रकार
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {dominantDisabilityType.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {localizeNumber(
                dominantDisabilityType.value.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
            <div className="text-xs text-muted-foreground">
              {localizeNumber(
                ((dominantDisabilityType.value / totalDisabled) * 100).toFixed(
                  1,
                ),
                "ne",
              )}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              औसत प्रति उमेर समूह
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localizeNumber(
                Math.round(totalDisabled / dataWithoutTotal.length).toString(),
                "ne",
              )}
            </div>
            <div className="text-xs text-muted-foreground">प्रति उमेर समूह</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-4">अपाङ्गता वितरण विश्लेषण</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-3 text-red-700">
              उच्च अपाङ्गता दर भएका उमेर समूहहरू
            </h5>
            <div className="space-y-2">
              {highDisabilityAgeGroups.slice(0, 5).map((ageGroup) => (
                <div
                  key={ageGroup.id || ageGroup.ageGroup}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{ageGroup.ageGroup}</span>
                  <Badge variant="secondary" className="text-xs">
                    {localizeNumber(ageGroup.total.toLocaleString(), "ne")}{" "}
                    व्यक्ति
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 text-green-700">
              कम अपाङ्गता दर भएका उमेर समूहहरू
            </h5>
            <div className="space-y-2">
              {lowDisabilityAgeGroups.slice(0, 5).map((ageGroup) => (
                <div
                  key={ageGroup.id || ageGroup.ageGroup}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{ageGroup.ageGroup}</span>
                  <Badge variant="secondary" className="text-xs">
                    {localizeNumber(ageGroup.total.toLocaleString(), "ne")}{" "}
                    व्यक्ति
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">मुख्य निष्कर्षहरू:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • कुल जनसंख्यामा {localizeNumber(totalDisabled.toString(), "ne")}{" "}
              व्यक्तिमा अपाङ्गता छ
            </li>
            <li>
              • {mostAffectedAgeGroup.ageGroup} उमेर समूहमा सबैभन्दा धेरै
              अपाङ्गता भएका व्यक्ति छन्
            </li>
            <li>
              • {dominantDisabilityType.name} सबैभन्दा सामान्य अपाङ्गताको प्रकार
              हो
            </li>
            <li>
              • शारीरिक अपाङ्गता कुल अपाङ्गताको{" "}
              {localizeNumber(
                ((totalPhysical / totalDisabled) * 100).toFixed(1),
                "ne",
              )}
              % हो
            </li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h5 className="font-medium text-yellow-800 mb-2">सुझावहरू:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • विशेष आवश्यकता भएका उमेर समूहका लागि विशेष कार्यक्रम सञ्चालन
              गर्नुपर्छ
            </li>
            <li>
              • अपाङ्गता भएका व्यक्तिहरूका लागि पहुँचयोग्य सुविधाहरू विकास
              गर्नुपर्छ
            </li>
            <li>
              • प्रारम्भिक हस्तक्षेप र रोकथाम कार्यक्रमहरू सञ्चालन गर्नुपर्छ
            </li>
            <li>• अपाङ्गता भएका व्यक्तिहरूको क्षमता विकासमा जोड दिनुपर्छ</li>
          </ul>
        </div>
      </div>
    </>
  );
}
