import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/constants";

interface SearchParam {
  key: string;
  value: string | number;
  label: string;
}

export default function AIPropertiesSearch() {
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<{ searchParams: any; properties: any[] } | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParam[]>([]);

  useEffect(() => {
    // Retrieve search results from session storage
    const storedResults = sessionStorage.getItem("aiSearchResults");
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);

      // Transform search parameters for display
      const paramsToDisplay: SearchParam[] = [];
      const params = parsedResults.searchParams || {};
      
      if (params.purpose) {
        paramsToDisplay.push({
          key: "purpose",
          value: params.purpose,
          label: params.purpose === "rent" ? "For Rent" : "For Sale"
        });
      }
      
      if (params.type) {
        paramsToDisplay.push({
          key: "type",
          value: params.type,
          label: `Type: ${params.type}`
        });
      }
      
      if (params.location) {
        paramsToDisplay.push({
          key: "location",
          value: params.location,
          label: `Location: ${params.location}`
        });
      }
      
      if (params.minPrice && params.maxPrice) {
        paramsToDisplay.push({
          key: "price",
          value: `${params.minPrice}-${params.maxPrice}`,
          label: `Price: ${formatPrice(params.minPrice)} - ${formatPrice(params.maxPrice)}`
        });
      } else if (params.minPrice) {
        paramsToDisplay.push({
          key: "minPrice",
          value: params.minPrice,
          label: `Price: Min ${formatPrice(params.minPrice)}`
        });
      } else if (params.maxPrice) {
        paramsToDisplay.push({
          key: "maxPrice",
          value: params.maxPrice,
          label: `Price: Max ${formatPrice(params.maxPrice)}`
        });
      }
      
      if (params.bedrooms) {
        paramsToDisplay.push({
          key: "bedrooms",
          value: params.bedrooms,
          label: `${params.bedrooms} Bedroom${params.bedrooms > 1 ? 's' : ''}`
        });
      }
      
      if (params.bathrooms) {
        paramsToDisplay.push({
          key: "bathrooms",
          value: params.bathrooms,
          label: `${params.bathrooms} Bathroom${params.bathrooms > 1 ? 's' : ''}`
        });
      }
      
      if (params.minArea && params.maxArea) {
        paramsToDisplay.push({
          key: "area",
          value: `${params.minArea}-${params.maxArea}`,
          label: `Area: ${params.minArea} - ${params.maxArea} sq.ft`
        });
      } else if (params.minArea) {
        paramsToDisplay.push({
          key: "minArea",
          value: params.minArea,
          label: `Area: Min ${params.minArea} sq.ft`
        });
      } else if (params.maxArea) {
        paramsToDisplay.push({
          key: "maxArea",
          value: params.maxArea,
          label: `Area: Max ${params.maxArea} sq.ft`
        });
      }
      
      setSearchParams(paramsToDisplay);
    } else {
      // If no results in session storage, redirect to home
      setLocation("/");
    }
  }, [setLocation]);

  if (!results) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading search results...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">AI Property Search Results</h1>
        
        <AIPropertySearch />
        
        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {searchParams.map((param) => (
              <Badge key={param.key} variant="outline" className="px-3 py-1 text-sm">
                {param.label}
              </Badge>
            ))}
            
            {searchParams.length === 0 && (
              <p className="text-gray-500 italic">No specific search parameters were identified</p>
            )}
          </div>
          
          <p className="text-gray-700">Found {results.properties.length} properties matching your search</p>
        </div>
      </div>
      
      {results.properties.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No properties found</h2>
          <p className="text-gray-600 mb-4">We couldn't find any properties matching your search criteria.</p>
          <Button onClick={() => setLocation("/")}>Return to Home</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}