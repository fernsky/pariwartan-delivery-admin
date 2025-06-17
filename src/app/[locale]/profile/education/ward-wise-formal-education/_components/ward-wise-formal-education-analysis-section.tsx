import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseFormalEducationAnalysisSectionProps {
  totalPopulation: number;
  formalEducationTotals: {
    currentlyAttending: number;
    previouslyAttended: number;
    neverAttended: number;
    notMentioned: number;
  };
  formalEducationPercentages: {
    currentlyAttending: string;
    previouslyAttended: string;
    neverAttended: string;
    notMentioned: string;
  };
  wardCurrentAttendancePercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestAttendanceWard: {
    wardNumber: number;
    percentage: number;
  };
  FORMAL_EDUCATION_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function WardWiseFormalEducationAnalysisSection({
  totalPopulation,
  formalEducationTotals,
  formalEducationPercentages,
  wardCurrentAttendancePercentages,
  bestAttendanceWard,
  lowestAttendanceWard,
  FORMAL_EDUCATION_GROUPS,
}: WardWiseFormalEducationAnalysisSectionProps) {
  // Calculate education access index based on formal education status
  // Higher weight for currently attending, moderate for previously attended
  const educationAccessIndex =
    (parseFloat(formalEducationPercentages.currentlyAttending) * 1.0 +
      parseFloat(formalEducationPercentages.previouslyAttended) * 0.6 +
      parseFloat(formalEducationPercentages.neverAttended) * 0.0 +
      parseFloat(formalEducationPercentages.notMentioned) * 0.1) /
    100;

  // Determine education access level based on index score
  const educationAccessLevel =
    educationAccessIndex >= 0.8
      ? "उत्कृष्ट"
      : educationAccessIndex >= 0.6
        ? "राम्रो"
        : educationAccessIndex >= 0.4
          ? "मध्यम"
          : "कम";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / परिवर्तन गाउँपालिका",
    "data-total-population": totalPopulation.toString(),
    "data-current-attendance-rate":
      formalEducationPercentages.currentlyAttending,
    "data-never-attended-rate": formalEducationPercentages.neverAttended,
    "data-best-attendance-ward":
      bestAttendanceWard?.wardNumber.toString() || "",
    "data-lowest-attendance-ward":
      lowestAttendanceWard?.wardNumber.toString() || "",
    "data-education-access-index": educationAccessIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.keys(FORMAL_EDUCATION_GROUPS).map((groupKey) => {
          const group =
            FORMAL_EDUCATION_GROUPS[
              groupKey as keyof typeof FORMAL_EDUCATION_GROUPS
            ];
          const percentage = parseFloat(
            formalEducationPercentages[
              groupKey as keyof typeof formalEducationPercentages
            ],
          );
          const total =
            formalEducationTotals[
              groupKey as keyof typeof formalEducationTotals
            ];

          return (
            <div
              key={groupKey}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: group.color,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              ></div>
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {group.name}
                  <span className="sr-only">{group.nameEn}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage.toFixed(2), "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(total.toLocaleString(), "ne")} जना
                  <span className="sr-only">
                    ({total.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          औपचारिक शिक्षा विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Formal Education Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-attendance"
            data-ward-number={bestAttendanceWard?.wardNumber}
            data-percentage={bestAttendanceWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी अध्ययन दर भएको वडा
              <span className="sr-only">
                Ward with Highest Current Attendance Rate in Khajura Rural
                Municipality
              </span>
            </h4>
            {bestAttendanceWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      bestAttendanceWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    हाल अध्ययन दर:{" "}
                    {localizeNumber(
                      bestAttendanceWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {bestAttendanceWard.percentage.toFixed(2)}% current
                      attendance rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा हाल विद्यालय/कलेज जाने जनसंख्याको प्रतिशत सबैभन्दा
                  बढी रहेको छ, जुन पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (
                      bestAttendanceWard.percentage -
                      parseFloat(formalEducationPercentages.currentlyAttending)
                    ).toFixed(2),
                    "ne",
                  )}
                  % ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा शैक्षिक संस्थाहरूको राम्रो पहुँच, परिवारको
                  शिक्षाप्रति सकारात्मक दृष्टिकोण र शैक्षिक वातावरण रहेको संकेत
                  गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="lowest-attendance"
            data-ward-number={lowestAttendanceWard?.wardNumber}
            data-percentage={lowestAttendanceWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              कम अध्ययन दर भएको वडा
              <span className="sr-only">
                Ward with Low Current Attendance Rate in Khajura
              </span>
            </h4>
            {lowestAttendanceWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      FORMAL_EDUCATION_GROUPS.NEVER_ATTENDED.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      lowestAttendanceWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    हाल अध्ययन दर:{" "}
                    {localizeNumber(
                      lowestAttendanceWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {lowestAttendanceWard.percentage.toFixed(2)}% current
                      attendance rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेष ध्यान दिनुपर्ने</h5>
              <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm">
                  यस वडामा हाल अध्ययनरत जनसंख्याको दर कम रहेको छ। यसले शैक्षिक
                  संस्थाहरूको पहुँच, आर्थिक समस्या, वा अन्य सामाजिक कारणहरूले
                  शिक्षामा पहुँच कम भएको संकेत गर्दछ। यस वडामा शिक्षा पहुँच
                  बढाउने विशेष कार्यक्रम सञ्चालन गर्नुपर्ने देखिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">शिक्षा पहुँच सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-100 to-blue-50 border-4 border-green-200">
                <span className="text-2xl font-bold text-green-600">
                  {localizeNumber(
                    (educationAccessIndex * 100).toFixed(1),
                    "ne",
                  )}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                {educationAccessLevel} पहुँच
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> शिक्षा पहुँचको यो सूचकाङ्क
                  हाल अध्ययनरत र पहिला अध्ययन गरेका जनसंख्याको भारित औसतमा
                  आधारित छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(
                    (educationAccessIndex * 100).toFixed(1),
                    "ne",
                  )}
                  अंकले {educationAccessLevel} शिक्षा पहुँच दर्शाउँछ। यसमा
                  सुधारका लागि शैक्षिक पूर्वाधार र पहुँच बढाउने कार्यक्रमहरू
                  आवश्यक छन्।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">औपचारिक शिक्षा विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium mb-2">
                हाल अध्ययनरत जनसंख्या
              </h5>
              <div className="flex justify-between text-sm">
                <span>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.color,
                    }}
                  ></span>
                  हाल विद्यालय/कलेज जाने
                </span>
                <span className="font-medium">
                  {localizeNumber(
                    formalEducationPercentages.currentlyAttending,
                    "ne",
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${parseFloat(formalEducationPercentages.currentlyAttending)}%`,
                    backgroundColor:
                      FORMAL_EDUCATION_GROUPS.CURRENTLY_ATTENDING.color,
                  }}
                ></div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">पहिला अध्ययन गरेका</h5>
                <div className="flex justify-between text-sm">
                  <span>
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          FORMAL_EDUCATION_GROUPS.PREVIOUSLY_ATTENDED.color,
                      }}
                    ></span>
                    पहिला विद्यालय/कलेज गएका
                  </span>
                  <span className="font-medium">
                    {localizeNumber(
                      formalEducationPercentages.previouslyAttended,
                      "ne",
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${parseFloat(formalEducationPercentages.previouslyAttended)}%`,
                      backgroundColor:
                        FORMAL_EDUCATION_GROUPS.PREVIOUSLY_ATTENDED.color,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <h5 className="font-medium mb-2 text-red-600">
                  चुनौती क्षेत्र
                </h5>
                <div className="flex justify-between text-sm">
                  <span>
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          FORMAL_EDUCATION_GROUPS.NEVER_ATTENDED.color,
                      }}
                    ></span>
                    कहिल्यै विद्यालय/कलेज नगएका
                  </span>
                  <span className="font-medium">
                    {localizeNumber(
                      formalEducationPercentages.neverAttended,
                      "ne",
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${parseFloat(formalEducationPercentages.neverAttended)}%`,
                      backgroundColor:
                        FORMAL_EDUCATION_GROUPS.NEVER_ATTENDED.color,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  यो समूहमा विशेष ध्यान दिई शिक्षा पहुँच बढाउने आवश्यकता छ।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
