interface MunicipalityFacilitiesSEOProps {
  facilitiesData: any[];
  totalPopulation: number;
  facilityTypeTotals: Record<string, number>;
  facilityTypePercentages: Record<string, number>;
  FACILITY_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  digitalAccessIndex: number;
  topFacility: any;
  leastUsedFacility: any;
}

export default function MunicipalityFacilitiesSEO({
  facilitiesData,
  totalPopulation,
  facilityTypeTotals,
  facilityTypePercentages,
  FACILITY_CATEGORIES,
  digitalAccessIndex,
  topFacility,
  leastUsedFacility,
}: MunicipalityFacilitiesSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert facilities to structured data format
    const facilityStats = facilitiesData
      .map((facility) => {
        const category = FACILITY_CATEGORIES[facility.facility];
        const percentage = totalPopulation > 0 
          ? ((facility.population / totalPopulation) * 100).toFixed(2) 
          : "0.00";

        return {
          "@type": "PropertyValue",
          "name": category?.name || facility.facility,
          "value": facility.population.toString(),
          "unitText": "जना",
          "description": `${category?.name || facility.facility} प्रयोग गर्ने जनसंख्या: ${facility.population} जना (${percentage}%)`,
        };
      })
      .filter(Boolean);

    // Calculate key metrics
    const mobilePercentage = facilityTypePercentages.MOBILE_PHONE?.toFixed(2) || "0.00";
    const internetPercentage = facilityTypePercentages.INTERNET?.toFixed(2) || "0.00";
    const computerPercentage = facilityTypePercentages.COMPUTER?.toFixed(2) || "0.00";
    const televisionPercentage = facilityTypePercentages.TELEVISION?.toFixed(2) || "0.00";

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "परिवर्तन गाउँपालिका घरायसी सुविधाको अवस्था",
      "description": `परिवर्तन गाउँपालिकामा घरायसी सुविधाको वितरण र प्रयोगको विस्तृत तथ्याङ्क। कुल जनसंख्या ${totalPopulation.toLocaleString()} को आधारमा विभिन्न सुविधाहरूको विश्लेषण।`,
      "url": "https://khajura.digital-profile.gov.np/profile/physical/municipality-facilities",
      "sameAs": [
        "https://en.khajura.digital-profile.gov.np/profile/physical/municipality-facilities",
      ],
      "creator": {
        "@type": "Organization",
        "name": "परिवर्तन गाउँपालिका",
        "alternateName": "Khajura Rural Municipality",
        "url": "https://khajura.digital-profile.gov.np",
      },
      "publisher": {
        "@type": "Organization",
        "name": "परिवर्तन गाउँपालिका डिजिटल प्रोफाइल",
        "alternateName": "Khajura Rural Municipality Digital Profile",
        "url": "https://khajura.digital-profile.gov.np",
      },
      "dateModified": new Date().toISOString(),
      "datePublished": new Date().toISOString(),
      "inLanguage": "ne",
      "spatialCoverage": {
        "@type": "Place",
        "name": "परिवर्तन गाउँपालिका, बाँके, लुम्बिनी प्रदेश, नेपाल",
        "alternateName": "Khajura Rural Municipality, Banke, Lumbini Province, Nepal",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "28.1167",
          "longitude": "81.6167",
        },
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "लुम्बिनी प्रदेश",
          "alternateName": "Lumbini Province",
        },
      },
      "measurementTechnique": "जनगणना र घरेलु सर्वेक्षण",
      "variableMeasured": facilityStats,
      "distribution": [
        {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": "https://khajura.digital-profile.gov.np/api/municipality-facilities",
        },
      ],
      "keywords": [
        "परिवर्तन गाउँपालिका",
        "घरायसी सुविधा",
        "डिजिटल पहुँच",
        "मोबाइल फोन",
        "इन्टरनेट सुविधा",
        "कम्प्युटर",
        "टेलिभिजन",
        "यातायात साधन",
        "Khajura Rural Municipality",
        "household facilities",
        "digital access",
        "mobile phone",
        "internet access",
        "computer",
        "television",
        "transportation",
      ],
      "about": [
        {
          "@type": "Thing",
          "name": "मोबाइल फोन पहुँच",
          "description": `${mobilePercentage}% जनसंख्यामा मोबाइल फोनको पहुँच`,
        },
        {
          "@type": "Thing", 
          "name": "इन्टरनेट पहुँच",
          "description": `${internetPercentage}% जनसंख्यामा इन्टरनेट सुविधाको पहुँच`,
        },
        {
          "@type": "Thing",
          "name": "कम्प्युटर पहुँच", 
          "description": `${computerPercentage}% जनसंख्यामा कम्प्युटरको पहुँच`,
        },
        {
          "@type": "Thing",
          "name": "टेलिभिजन पहुँच",
          "description": `${televisionPercentage}% जनसंख्यामा टेलिभिजनको पहुँच`,
        },
        {
          "@type": "Thing",
          "name": "डिजिटल पहुँच सूचकांक",
          "description": `${digitalAccessIndex.toFixed(2)}% समग्र डिजिटल पहुँच दर`,
        },
      ],
      "mainEntity": {
        "@type": "StatisticalPopulation",
        "populationType": "घरायसी सुविधा प्रयोगकर्ता",
        "numConstraints": facilitiesData.length,
        "constrainingProperty": facilityStats,
      },
    };

    return structuredData;
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />
      
      {/* Hidden semantic markup for enhanced SEO */}
      <div className="sr-only" aria-hidden="true">
        <h2>परिवर्तन गाउँपालिका घरायसी सुविधाको तथ्याङ्क</h2>
        <p>
          कुल जनसंख्या: {totalPopulation.toLocaleString()} जना
        </p>
        <p>
          मोबाइल फोन पहुँच: {(facilityTypePercentages.MOBILE_PHONE || 0).toFixed(2)}%
        </p>
        <p>
          इन्टरनेट सुविधा पहुँच: {(facilityTypePercentages.INTERNET || 0).toFixed(2)}%
        </p>
        <p>
          कम्प्युटर पहुँच: {(facilityTypePercentages.COMPUTER || 0).toFixed(2)}%
        </p>
        <p>
          टेलिभिजन पहुँच: {(facilityTypePercentages.TELEVISION || 0).toFixed(2)}%
        </p>
        <p>
          डिजिटल पहुँच सूचकांक: {digitalAccessIndex.toFixed(2)}%
        </p>
        
        {topFacility && (
          <p>
            सबैभन्दा बढी प्रयोग हुने सुविधा: {FACILITY_CATEGORIES[topFacility.facility]?.name || topFacility.facility} 
            ({topFacility.population.toLocaleString()} जना)
          </p>
        )}
        
        {leastUsedFacility && (
          <p>
            सबैभन्दा कम प्रयोग हुने सुविधा: {FACILITY_CATEGORIES[leastUsedFacility.facility]?.name || leastUsedFacility.facility} 
            ({leastUsedFacility.population.toLocaleString()} जना)
          </p>
        )}

        <ul>
          {facilitiesData.map((facility) => {
            const category = FACILITY_CATEGORIES[facility.facility];
            const percentage = totalPopulation > 0 
              ? ((facility.population / totalPopulation) * 100).toFixed(2) 
              : "0.00";
            
            return (
              <li key={facility.id}>
                {category?.name || facility.facility}: {facility.population.toLocaleString()} जना ({percentage}%)
              </li>
            );
          })}
        </ul>
        
        <p>डेटा स्रोत: परिवर्तन गाउँपालिका</p>
        <p>अन्तिम अपडेट: {new Date().toLocaleDateString('ne-NP')}</p>
      </div>
    </>
  );
}
