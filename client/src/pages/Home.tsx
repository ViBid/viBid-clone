import { useQuery } from "@tanstack/react-query";
import { Property, Agent } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { PopularSearches } from "@/components/PopularSearches";
import { AgentCard } from "@/components/AgentCard";
import { NewDevelopment } from "@/components/NewDevelopment";
import { AppDownload } from "@/components/AppDownload";
import { AIPropertySearch } from "@/components/AIPropertySearch";
import { PropertyConsultant } from "@/components/PropertyConsultant";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: saleProperties, isLoading: loadingSale } = useQuery<Property[]>({
    queryKey: ["/api/properties/sale"],
  });

  const { data: rentalProperties, isLoading: loadingRent } = useQuery<Property[]>({
    queryKey: ["/api/properties/rent"],
  });

  const { data: newDevelopments, isLoading: loadingDevelopments } = useQuery<Property[]>({
    queryKey: ["/api/properties/new-developments"],
  });

  const { data: agents, isLoading: loadingAgents } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const renderPropertySkeletons = (count: number) => {
    return [...Array(count)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full h-56" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <div className="flex justify-between mb-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-[1px] w-full mb-3" />
          <div className="flex justify-between">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-2" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-center">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-poppins font-bold mb-6 max-w-2xl">
            Find Your Perfect Property in the UAE
          </h1>
          
          <SearchBar />
        </div>
      </section>
      
      {/* AI Property Search */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-poppins font-semibold">AI-Powered Property Search</h2>
            <p className="text-gray-600 mt-2">
              Describe what you're looking for in natural language and let our AI find the perfect match
            </p>
          </div>
          <AIPropertySearch />
        </div>
      </section>
      
      {/* Popular Searches */}
      <PopularSearches />
      
      {/* Featured Properties for Sale */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-poppins font-semibold">Featured Properties for Sale</h2>
            <Link href="/properties/buy">
              <a className="text-primary font-medium">View all</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingSale 
              ? renderPropertySkeletons(3)
              : saleProperties?.map(property => (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <a className="block">
                      <PropertyCard property={property} />
                    </a>
                  </Link>
                ))
            }
          </div>
        </div>
      </section>
      
      {/* Rental Properties */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-poppins font-semibold">Popular Rental Properties</h2>
            <Link href="/properties/rent">
              <a className="text-primary font-medium">View all</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingRent 
              ? renderPropertySkeletons(3)
              : rentalProperties?.map(property => (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <a className="block">
                      <PropertyCard property={property} />
                    </a>
                  </Link>
                ))
            }
          </div>
        </div>
      </section>
      
      {/* New Developments */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-poppins font-semibold">New Developments</h2>
            <Link href="/properties/new-projects">
              <a className="text-primary font-medium">View all</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingDevelopments
              ? [...Array(2)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Skeleton className="w-full h-72" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <div className="flex justify-between mb-3">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-[1px] w-full mb-3" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-28 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))
              : newDevelopments?.map(property => (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <a className="block">
                      <NewDevelopment property={property} />
                    </a>
                  </Link>
                ))
            }
          </div>
        </div>
      </section>
      
      {/* Property Agents */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-poppins font-semibold">Top Real Estate Agents</h2>
            <Link href="/agents">
              <a className="text-primary font-medium">View all</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingAgents
              ? [...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden text-center">
                    <div className="pt-6 flex justify-center">
                      <Skeleton className="w-24 h-24 rounded-full" />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-5 w-32 mx-auto mb-1" />
                      <Skeleton className="h-4 w-24 mx-auto mb-2" />
                      <Skeleton className="h-4 w-40 mx-auto mb-3" />
                      <div className="flex justify-center space-x-2 mb-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-10 w-full rounded" />
                    </div>
                  </div>
                ))
              : agents?.map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
                ))
            }
          </div>
        </div>
      </section>
      
      {/* App Download */}
      <AppDownload />
      
      <PropertyConsultant />
      
      <Footer />
    </>
  );
}
