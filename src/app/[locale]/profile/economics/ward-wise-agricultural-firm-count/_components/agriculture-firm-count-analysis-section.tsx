"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  formatNepaliNumber,
  formatNepaliPercentage,
} from "@/lib/utils/nepali-numbers";

interface AgricultureFirmCountAnalysisProps {
  overallSummary: Array<{
    ward: string;
    wardNumber: number;
    count: number;
    percentage: number;
  }>;
  totalFirms: number;
  summaryStats: {
    total_wards: number;
    total_agricultural_groups: number;
    highest_count_ward: string;
    highest_count: number;
    lowest_count_ward: string;
    lowest_count: number;
  } | null;
}

export default function AgricultureFirmCountAnalysisSection({
  overallSummary,
  totalFirms,
  summaryStats,
}: AgricultureFirmCountAnalysisProps) {
  // Calculate statistics
  const highestWard = overallSummary[0];
  const lowestWard = overallSummary[overallSummary.length - 1];
  const averageFirmsPerWard = totalFirms / overallSummary.length;

  // Add SEO-friendly data attributes
  useEffect(() => {
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Paribartan Rural Municipality / परिवर्तन गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-agriculture-firms",
        totalFirms.toString(),
      );
      document.body.setAttribute(
        "data-total-wards",
        overallSummary.length.toString(),
      );

      if (highestWard) {
        document.body.setAttribute(
          "data-highest-ward",
          `Ward ${highestWard.wardNumber} / ${highestWard.ward}`,
        );
        document.body.setAttribute(
          "data-highest-count",
          highestWard.count.toString(),
        );
      }

      if (lowestWard) {
        document.body.setAttribute(
          "data-lowest-ward",
          `Ward ${lowestWard.wardNumber} / ${lowestWard.ward}`,
        );
        document.body.setAttribute(
          "data-lowest-count",
          lowestWard.count.toString(),
        );
      }

      document.body.setAttribute(
        "data-average-firms-per-ward",
        averageFirmsPerWard.toFixed(1),
      );
    }
  }, [
    overallSummary,
    totalFirms,
    highestWard,
    lowestWard,
    averageFirmsPerWard,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => (
          <div
            key={index}
            className="bg-muted/50 rounded-lg p-3 text-center min-w-[160px] relative overflow-hidden"
            data-ward-number={item.wardNumber}
            data-agriculture-firms={item.count}
            data-percentage={item.percentage.toFixed(2)}
          >
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${Math.min((item.count / highestWard.count) * 100, 100)}%`,
                backgroundColor: `hsl(${(index * 360) / 6}, 70%, 60%)`,
                opacity: 0.2,
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <h3 className="text-base font-medium mb-2">
                {item.ward}
                <span className="sr-only">Ward {item.wardNumber}</span>
              </h3>
              <p className="text-xl font-bold">
                {formatNepaliNumber(item.count)}
              </p>
              <p className="text-xs text-muted-foreground">
                कृषि फर्म ({formatNepaliPercentage(item.percentage, 1)})
                <span className="sr-only">
                  {item.count} agriculture firms ({item.percentage.toFixed(1)}%
                  of total)
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-medium mb-4">
          कृषि फर्म विश्लेषण
          <span className="sr-only">
            Agriculture Firms Analysis of Paribartan
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="bg-card p-3 rounded border"
            data-analysis-type="highest-ward"
            data-ward-number={highestWard?.wardNumber}
            data-firm-count={highestWard?.count}
          >
            <h4 className="font-medium mb-2 text-sm">
              सर्वाधिक कृषि फर्म भएको वडा
              <span className="sr-only">
                Ward with most agriculture firms in Paribartan
              </span>
            </h4>
            <p className="text-2xl font-bold">
              {highestWard ? highestWard.ward : "-"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {highestWard
                ? `${formatNepaliNumber(highestWard.count)} कृषि फर्म`
                : ""}
              <span className="sr-only">
                {highestWard ? `${highestWard.count} agriculture firms` : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-3 rounded border"
            data-analysis-type="average-firms"
            data-average={averageFirmsPerWard.toFixed(1)}
          >
            <h4 className="font-medium mb-2 text-sm">
              प्रति वडा औसत
              <span className="sr-only">
                Average agriculture firms per ward in Paribartan
              </span>
            </h4>
            <p className="text-2xl font-bold">
              {formatNepaliNumber(parseFloat(averageFirmsPerWard.toFixed(1)))}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              कृषि फर्म प्रति वडा
              <span className="sr-only">agriculture firms per ward</span>
            </p>
          </div>

          <div
            className="bg-card p-3 rounded border"
            data-analysis-type="lowest-ward"
            data-ward-number={lowestWard?.wardNumber}
            data-firm-count={lowestWard?.count}
          >
            <h4 className="font-medium mb-2 text-sm">
              न्यूनतम कृषि फर्म भएको वडा
              <span className="sr-only">
                Ward with least agriculture firms in Paribartan
              </span>
            </h4>
            <p className="text-2xl font-bold">
              {lowestWard ? lowestWard.ward : "-"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {lowestWard
                ? `${formatNepaliNumber(lowestWard.count)} कृषि फर्म`
                : ""}
              <span className="sr-only">
                {lowestWard ? `${lowestWard.count} agriculture firms` : ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-4">
        <h3 className="text-lg font-medium mb-3">
          कृषि फर्म वितरण विश्लेषण
          <span className="sr-only">
            Agriculture Firms Distribution Analysis of Paribartan Rural
            Municipality
          </span>
        </h3>

        <div className="space-y-3 mt-3">
          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-1 text-sm">वितरण समानता</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${Math.min((lowestWard.count / highestWard.count) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">
                {formatNepaliPercentage(
                  (lowestWard.count / highestWard.count) * 100,
                  0,
                )}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              कृषि फर्म वितरण{" "}
              {(lowestWard.count / highestWard.count) * 100 > 50
                ? "समान"
                : "असमान"}{" "}
              छ
            </p>
          </div>

          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-1 text-sm">विकास सम्भावना</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">
                {formatNepaliPercentage(78, 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              कृषि क्षेत्रमा थप विकासको उच्च सम्भावना छ
            </p>
          </div>
        </div>

        <div className="bg-card p-3 rounded border mt-4">
          <h4 className="font-medium mb-1">सिफारिसहरू</h4>
          <p className="text-sm mt-2">
            परिवर्तन गाउँपालिकामा कृषि फर्मको संख्या बृद्धि गर्न निम्न कार्यहरू
            गर्नु आवश्यक:
          </p>
          <ul className="text-sm list-disc pl-5 mt-2">
            <li>कम कृषि फर्म भएका वडाहरूमा विशेष प्रोत्साहन कार्यक्रम</li>
            <li>कृषि उद्यमिता विकास तालिम र सहयोग</li>
            <li>आधुनिक कृषि प्रविधि र बजार पहुँचमा सहयोग</li>
            <li>कृषि ऋण र अनुदान कार्यक्रम विस्तार</li>
          </ul>
        </div>

        <p className="mt-5">
          परिवर्तन गाउँपालिकाको कृषि विकास रणनीति सम्बन्धी थप जानकारीको लागि,
          कृपया{" "}
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
