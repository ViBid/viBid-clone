import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROPERTY_TYPES, PRICE_RANGES, BEDROOM_OPTIONS } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const [useAI, setUseAI] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>("");
  const { toast } = useToast();

  const aiSearchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      return apiRequest<{ searchParams: any; properties: any[] }>(`/api/properties/ai-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });
    },
    onSuccess: (data) => {
      // Display a success toast with the parsed parameters
      toast({
        title: "Search understood!",
        description: `Found ${data.properties.length} properties matching your criteria.`,
        duration: 3000,
      });

      // Store the search results in session storage for the results page to use
      sessionStorage.setItem("aiSearchResults", JSON.stringify(data));
      
      // Navigate to the AI search results page
      setLocation(`/ai-search`);
    },
    onError: () => {
      toast({
        title: "Search failed",
        description: "Sorry, we couldn't process your search. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useAI) {
      if (!aiQuery.trim()) {
        toast({
          title: "Search query empty",
          description: "Please describe what you're looking for.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      aiSearchMutation.mutate(aiQuery);
      return;
    }
    
    // Traditional search
    // Build query params
    const params = new URLSearchParams();
    if (propertyType !== "any") params.append("type", propertyType);
    if (searchLocation) params.append("location", searchLocation);
    if (price !== "any") params.append("price", price);
    if (bedrooms !== "any") params.append("bedrooms", bedrooms);
    
    // Navigate to search results
    setLocation(`/properties/${activeTab}?${params.toString()}`);
  };

  const exampleQueries = [
    "I need a 2-bedroom apartment in Dubai Marina for under 120,000 AED per year",
    "Find me a luxury villa with a pool in Palm Jumeirah",
    "Show me 3+ bedroom properties for sale in Downtown Dubai between 2-5 million AED"
  ];

  const handleExampleClick = (example: string) => {
    setAiQuery(example);
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
      
      {/* AI Toggle */}
      <div className="flex items-center justify-end p-3 border-b">
        <div className="flex items-center space-x-2">
          <Label htmlFor="ai-toggle" className={`text-sm ${useAI ? "text-gray-400" : "font-medium"}`}>Traditional</Label>
          <Switch
            id="ai-toggle"
            checked={useAI}
            onCheckedChange={setUseAI}
          />
          <Label htmlFor="ai-toggle" className={`flex items-center ${useAI ? "font-medium" : "text-gray-400"}`}>
            <span className="mr-1">AI</span>
            {useAI && <span className="text-xs text-primary">✨</span>}
          </Label>
        </div>
      </div>
      
      <form onSubmit={handleSearch}>
        {useAI ? (
          <div className="p-4">
            <Textarea
              placeholder="Describe what you're looking for in detail. For example: 'I need a 2-bedroom apartment in Dubai Marina under 120,000 AED per year with a balcony and pool view'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="min-h-[100px] mb-4"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example.length > 30 ? example.substring(0, 30) + "..." : example}
                  </button>
                ))}
              </div>
              
              <Button 
                type="submit" 
                className="bg-primary text-white"
                disabled={aiSearchMutation.isPending}
              >
                {aiSearchMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-1">✨</span> Search with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </form>
    </div>
  );
}
