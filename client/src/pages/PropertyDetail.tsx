import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Property, Agent } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, formatArea } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyInsights } from "@/components/PropertyInsights";
import { PropertyConsultant } from "@/components/PropertyConsultant";
import { 
  Map, 
  Phone, 
  Mail, 
  Heart, 
  Share2, 
  Printer, 
  Home, 
  Bath, 
  Bed, 
  ArrowRight, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data, isLoading } = useQuery<{ property: Property; agent: Agent }>({
    queryKey: [`/api/properties/${id}`],
  });
  
  const property = data?.property;
  const agent = data?.agent;
  
  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === property.imageUrls.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.imageUrls.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-[400px] mb-4" />
              <div className="flex justify-between mb-6">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="w-full h-[300px] mb-4" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-full mb-6" />
              
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-20 w-full rounded-lg mb-4" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!property || !agent) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="mb-6">The property you are looking for does not exist or has been removed.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
          <p className="text-text-light">
            <i className="fas fa-map-marker-alt mr-1"></i> {property.location}, {property.city}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Property Images Slider */}
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img 
                src={property.imageUrls[currentImageIndex]} 
                alt={property.title} 
                className="w-full h-[400px] object-cover"
              />
              
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold text-primary">
                {property.purpose === "rent" 
                  ? `${formatPrice(Number(property.price))}/yr` 
                  : formatPrice(Number(property.price))
                }
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Heart size={16} className="mr-1" /> Save
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 size={16} className="mr-1" /> Share
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Printer size={16} /> Print
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center">
                  <Sparkles size={16} className="mr-1 text-amber-500" />
                  AI Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Property Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <Home size={18} className="mr-2 text-primary" />
                      <span>Type: {property.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Bed size={18} className="mr-2 text-primary" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                      <Bath size={18} className="mr-2 text-primary" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-vector-square mr-2 text-primary"></i>
                      <span>Area: {formatArea(Number(property.area))}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-calendar mr-2 text-primary"></i>
                      <span>Built: {property.yearBuilt}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={18} className="mr-2 text-green-500" />
                      <span>{property.verified ? 'Verified' : 'Not Verified'}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-text-light whitespace-pre-line">{property.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="amenities">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Location</h2>
                  <div className="bg-gray-200 rounded-lg h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <Map size={32} className="mx-auto text-primary mb-2" />
                      <p>{property.address}</p>
                      <p>{property.neighborhood}, {property.city}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insights">
                <PropertyInsights propertyId={property.id} property={property} agent={agent} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            {/* Agent Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <img 
                  src={agent.imageUrl} 
                  alt={agent.name} 
                  className="w-16 h-16 rounded-full mr-4" 
                />
                <div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <p className="text-primary">{agent.agency}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Phone size={16} className="mr-2 text-primary" />
                  <a href={`tel:${agent.phone}`} className="text-primary">{agent.phone}</a>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-primary" />
                  <a href={`mailto:${agent.email}`} className="text-primary">{agent.email}</a>
                </div>
              </div>
              
              <Button className="w-full bg-primary text-white mb-3">
                Request a Call Back
              </Button>
              <Button variant="outline" className="w-full">
                Email Agent
              </Button>
            </div>
            
            {/* Mortgage Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3">Mortgage Calculator</h3>
              <p className="text-text-light mb-3">Estimate your monthly payments for this property.</p>
              
              <Button className="w-full bg-secondary text-text-dark hover:bg-gray-200">
                Calculate Mortgage <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <PropertyConsultant />
      
      <Footer />
    </>
  );
}
