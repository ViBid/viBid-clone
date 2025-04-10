import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROPERTY_TYPES, PRICE_RANGES, BEDROOM_OPTIONS } from "@/lib/constants";

interface SearchBarProps {
  initialTab?: "buy" | "rent" | "commercial" | "new-projects";
}

export function SearchBar({ initialTab = "buy" }: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [propertyType, setPropertyType] = useState<string>("any");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [price, setPrice] = useState<string>("any");
  const [bedrooms, setBedrooms] = useState<string>("any");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (propertyType !== "any") params.append("type", propertyType);
    if (searchLocation) params.append("location", searchLocation);
    if (price !== "any") params.append("price", price);
    if (bedrooms !== "any") params.append("bedrooms", bedrooms);
    
    // Navigate to search results
    setLocation(`/properties/${activeTab}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-t-lg shadow-lg max-w-4xl">
      <div className="flex border-b overflow-x-auto">
        <button 
          className={`px-6 py-3 text-text-light font-medium whitespace-nowrap ${activeTab === "buy" ? "text-primary border-b-2 border-primary" : ""}`}
          onClick={() => setActiveTab("buy")}
        >
          Buy
        </button>
        <button 
          className={`px-6 py-3 text-text-light font-medium whitespace-nowrap ${activeTab === "rent" ? "text-primary border-b-2 border-primary" : ""}`}
          onClick={() => setActiveTab("rent")}
        >
          Rent
        </button>
        <button 
          className={`px-6 py-3 text-text-light font-medium whitespace-nowrap ${activeTab === "commercial" ? "text-primary border-b-2 border-primary" : ""}`}
          onClick={() => setActiveTab("commercial")}
        >
          Commercial
        </button>
        <button 
          className={`px-6 py-3 text-text-light font-medium whitespace-nowrap ${activeTab === "new-projects" ? "text-primary border-b-2 border-primary" : ""}`}
          onClick={() => setActiveTab("new-projects")}
        >
          New Projects
        </button>
      </div>
      
      <form onSubmit={handleSearch}>
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Residential for Sale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Residential {activeTab === "buy" ? "for Sale" : "for Rent"}</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-grow relative">
            <Input
              type="text"
              placeholder="Location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full"
            />
            <i className="fas fa-map-marker-alt absolute right-3 top-1/2 -translate-y-1/2 text-text-light"></i>
          </div>
          
          <Button type="submit" className="bg-primary text-white">
            Find
          </Button>
        </div>
        
        {/* Advanced filters */}
        <div className="px-4 pb-4 flex flex-wrap gap-3">
          <div className="flex items-center">
            <span className="mr-2 text-text-light">Price (AED):</span>
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="border rounded p-2 h-9">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.label} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-text-light">Beds:</span>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="border rounded p-2 h-9">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-text-light">More:</span>
            <Button variant="outline" className="h-9 flex items-center">
              <i className="fas fa-sliders-h mr-1"></i> Filters
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
