"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Search, User } from "lucide-react";
import { useState, useMemo } from "react";
import { formatNepaliNumber } from "@/lib/utils/nepali-numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface VeterinaryRepresentativesTableProps {
  representativesData: Representative[];
  totalRepresentatives: number;
}

export default function VeterinaryRepresentativesTable({
  representativesData,
  totalRepresentatives,
}: VeterinaryRepresentativesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");

  // Filter and search functionality
  const filteredData = useMemo(() => {
    return representativesData.filter((representative) => {
      const matchesSearch =
        representative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        representative.nameEnglish
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        representative.contactNumber.includes(searchTerm);

      const matchesPosition =
        selectedPosition === "all" ||
        representative.position === selectedPosition;

      return matchesSearch && matchesPosition;
    });
  }, [representativesData, searchTerm, selectedPosition]);

  // Get unique positions for filter
  const positions = useMemo(() => {
    const uniquePositions = Array.from(
      new Set(representativesData.map((rep) => rep.position)),
    );
    return uniquePositions;
  }, [representativesData]);

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-6 border rounded-lg shadow-sm bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">खोज र फिल्टर</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="नाम वा सम्पर्क नम्बरले खोज्नुहोस्..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">सबै पद</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              कुल {formatNepaliNumber(filteredData.length)} मध्ये{" "}
              {formatNepaliNumber(totalRepresentatives)} जना प्रतिनिधि
            </span>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Excel डाउनलोड
            </Button>
          </div>
        </div>
      </div>

      {/* Representatives Cards - Mobile View */}
      <div className="block md:hidden mb-6">
        <div className="grid gap-4">
          {filteredData.map((representative) => (
            <Card
              key={representative.id || representative.serialNumber}
              className="w-full"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {representative.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {representative.nameEnglish}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {formatNepaliNumber(representative.serialNumber)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {representative.position}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {representative.positionEnglish}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      सम्पर्क:
                    </span>
                    <span className="text-sm font-medium">
                      {representative.contactNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      शाखा:
                    </span>
                    <div>
                      <p className="text-sm">{representative.branch}</p>
                      <p className="text-xs text-muted-foreground">
                        {representative.branchEnglish}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Representatives Table - Desktop View */}
      <div className="hidden md:block border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">
            पशु चिकित्सा प्रतिनिधिहरूको विस्तृत तालिका
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल {formatNepaliNumber(filteredData.length)} जना पशु चिकित्सा
            प्रतिनिधि
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                <th className="border p-3 text-left">क्र.सं.</th>
                <th className="border p-3 text-left min-w-[200px]">नाम</th>
                <th className="border p-3 text-left min-w-[200px]">पद</th>
                <th className="border p-3 text-left min-w-[120px]">
                  सम्पर्क नम्बर
                </th>
                <th className="border p-3 text-left min-w-[100px]">शाखा</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((representative, index) => (
                  <tr
                    key={representative.id || representative.serialNumber}
                    className={
                      index % 2 === 0
                        ? "bg-muted/40"
                        : "bg-background hover:bg-muted/20"
                    }
                  >
                    <td className="border p-3">
                      <Badge variant="outline" className="text-xs">
                        {formatNepaliNumber(representative.serialNumber)}
                      </Badge>
                    </td>
                    <td className="border p-3">
                      <div>
                        <p className="font-medium">{representative.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {representative.nameEnglish}
                        </p>
                      </div>
                    </td>
                    <td className="border p-3">
                      <div>
                        <p className="font-medium">{representative.position}</p>
                        <p className="text-xs text-muted-foreground">
                          {representative.positionEnglish}
                        </p>
                      </div>
                    </td>
                    <td className="border p-3">
                      <span className="font-medium">
                        {representative.contactNumber}
                      </span>
                    </td>
                    <td className="border p-3">
                      <div>
                        <p className="font-medium">{representative.branch}</p>
                        <p className="text-xs text-muted-foreground">
                          {representative.branchEnglish}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border p-8 text-center text-muted-foreground"
                  >
                    खोजिएको जानकारी फेला परेन। कृपया अर्को खोज शब्द प्रयोग
                    गर्नुहोस्।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with summary */}
        <div className="border-t p-4 bg-muted/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              कुल {formatNepaliNumber(filteredData.length)} जना प्रतिनिधि
              देखाइएको छ
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                PDF डाउनलोड
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Section */}
      <div className="mt-6 border rounded-lg shadow-sm bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">द्रुत सम्पर्क</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {representativesData.slice(0, 4).map((representative) => (
              <div
                key={representative.id || representative.serialNumber}
                className="bg-muted/30 rounded-lg p-3 text-center"
              >
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="h-6 w-6 text-cyan-600" />
                </div>
                <h4 className="font-medium text-sm mb-1">
                  {representative.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {representative.position}
                </p>
                <div className="text-xs font-medium text-muted-foreground">
                  {representative.contactNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
