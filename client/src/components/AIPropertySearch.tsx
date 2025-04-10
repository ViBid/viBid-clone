import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function AIPropertySearch() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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
      setLocation(`/properties/ai-search`);
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
    if (!query.trim()) return;
    
    aiSearchMutation.mutate(query);
  };

  const exampleQueries = [
    "I need a 2-bedroom apartment in Dubai Marina for under 120,000 AED per year",
    "Find me a luxury villa with a pool in Palm Jumeirah",
    "Show me 3+ bedroom properties for sale in Downtown Dubai between 2-5 million AED",
    "I'm looking for office space in Business Bay around 2000 sq ft"
  ];

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setIsExpanded(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8 shadow-lg">
      <CardHeader className="bg-primary/5 rounded-t-lg">
        <CardTitle className="flex items-center">
          <span className="bg-primary text-white p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076c.54-1.11 2.12-1.11 2.66 0l1.88 3.804 4.202.612c1.264.184 1.764 1.74.851 2.63l-3.045 2.965.719 4.192c.214 1.25-1.094 2.205-2.205 1.613L10 17.207l-3.773 1.977c-1.11.578-2.41-.362-2.206-1.614l.72-4.19-3.048-2.97c-.913-.89-.409-2.445.85-2.628l4.204-.61 1.88-3.797z" clipRule="evenodd" />
            </svg>
          </span>
          AI Property Search
        </CardTitle>
        <CardDescription>
          Describe what you're looking for in natural language and our AI will find it for you
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSearch}>
          {isExpanded ? (
            <Textarea
              placeholder="Describe what you're looking for in detail. For example: 'I need a 2-bedroom apartment in Dubai Marina under 120,000 AED per year with a balcony and pool view'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px] mb-4"
            />
          ) : (
            <div className="relative">
              <Input
                type="text"
                placeholder="What kind of property are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
                onFocus={() => setIsExpanded(true)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer" onClick={() => setIsExpanded(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={aiSearchMutation.isPending}
          >
            {aiSearchMutation.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Search with AI
              </>
            )}
          </Button>
        </form>
      </CardContent>
      
      {isExpanded && (
        <CardFooter className="flex flex-col items-start border-t pt-4 pb-6">
          <p className="text-sm text-gray-500 mb-2">Try one of these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="text-xs" 
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}