import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Property, Agent } from "@shared/schema";

interface PropertyInsightsProps {
  propertyId: number;
  property?: Property;
  agent?: Agent;
}

interface Insight {
  title: string;
  content: string;
  type: "positive" | "negative" | "neutral";
}

interface AIInsights {
  summary: string;
  priceAnalysis: string;
  locationHighlights: string;
  investmentPotential: string;
  comparableProperties?: string;
  prosCons: {
    pros: string[];
    cons: string[];
  };
  keyFeatures: string[];
  insights: Insight[];
}

export function PropertyInsights({ propertyId, property, agent }: PropertyInsightsProps) {
  const [language, setLanguage] = useState<string>("en");
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/properties', propertyId, 'insights', language],
    enabled: !!propertyId,
  });
  
  const insights: AIInsights | null = data?.insights || null;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Insights</CardTitle>
          <CardDescription>AI-powered analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
            <h3 className="font-semibold mb-2">Insights Currently Unavailable</h3>
            <p>We're experiencing issues generating insights for this property. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate badge color based on insight type
  const getBadgeVariant = (type: string) => {
    switch(type) {
      case "positive": return "default"; // green
      case "negative": return "destructive"; // red
      case "neutral": return "secondary"; // grey
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Property Insights</CardTitle>
            <CardDescription>AI-powered analysis</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={language === "en" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setLanguage("en")}
            >
              EN
            </Badge>
            <Badge
              variant={language === "ar" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setLanguage("ar")}
            >
              AR
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-700">{insights.summary}</p>
        </div>
        
        {/* Price Analysis */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Price Analysis</h3>
          <p className="text-gray-700">{insights.priceAnalysis}</p>
        </div>
        
        {/* Location Highlights */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <p className="text-gray-700">{insights.locationHighlights}</p>
        </div>
        
        {/* Investment Potential */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Investment Potential</h3>
          <p className="text-gray-700">{insights.investmentPotential}</p>
        </div>
        
        {/* Key Features */}
        {insights.keyFeatures && insights.keyFeatures.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1">
              {insights.keyFeatures.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Pros & Cons */}
        {insights.prosCons && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Pros</h4>
              <ul className="list-disc list-inside space-y-1">
                {insights.prosCons.pros.map((pro, index) => (
                  <li key={index} className="text-green-700">{pro}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Cons</h4>
              <ul className="list-disc list-inside space-y-1">
                {insights.prosCons.cons.map((con, index) => (
                  <li key={index} className="text-red-700">{con}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Insights */}
        {insights.insights && insights.insights.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Additional Insights</h3>
            <div className="space-y-3">
              {insights.insights.map((insight, index) => (
                <div key={index} className="flex items-start">
                  <Badge variant={getBadgeVariant(insight.type)} className="mt-1 mr-2">
                    {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                  </Badge>
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-gray-700">{insight.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p>These insights are generated by AI based on property data and market trends. While we strive for accuracy, please consult with a professional for investment decisions.</p>
        </div>
      </CardContent>
    </Card>
  );
}