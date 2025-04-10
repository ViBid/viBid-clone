import { useQuery } from "@tanstack/react-query";
import { Agent } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgentCard } from "@/components/AgentCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useState } from "react";

export default function AgentsList() {
  const [searchName, setSearchName] = useState("");
  const [searchAgency, setSearchAgency] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  
  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });
  
  const filteredAgents = agents?.filter(agent => {
    const nameMatch = agent.name.toLowerCase().includes(searchName.toLowerCase());
    const agencyMatch = !searchAgency || agent.agency.toLowerCase() === searchAgency.toLowerCase();
    const specialtyMatch = !searchSpecialty || agent.specialty.toLowerCase().includes(searchSpecialty.toLowerCase());
    return nameMatch && agencyMatch && specialtyMatch;
  });

  return (
    <>
      <Header />
      
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-poppins font-semibold">Top Real Estate Agents in Dubai</h1>
          <p className="text-text-light">
            Find and connect with the best real estate professionals in the UAE
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Agent Name</label>
              <Input
                type="text"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Agency</label>
              <Select value={searchAgency} onValueChange={setSearchAgency}>
                <SelectTrigger>
                  <SelectValue placeholder="All agencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All agencies</SelectItem>
                  <SelectItem value="Better Homes">Better Homes</SelectItem>
                  <SelectItem value="Driven Properties">Driven Properties</SelectItem>
                  <SelectItem value="Allsopp & Allsopp">Allsopp & Allsopp</SelectItem>
                  <SelectItem value="Gulf Sotheby's">Gulf Sotheby's</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <Select value={searchSpecialty} onValueChange={setSearchSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All specializations</SelectItem>
                  <SelectItem value="Dubai Marina">Dubai Marina</SelectItem>
                  <SelectItem value="Downtown Dubai">Downtown Dubai</SelectItem>
                  <SelectItem value="Palm Jumeirah">Palm Jumeirah</SelectItem>
                  <SelectItem value="Arabian Ranches">Arabian Ranches</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Agents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
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
            ))}
          </div>
        ) : filteredAgents?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4 text-gray-400">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">No agents found</h3>
            <p className="text-text-light mb-4">Please try adjusting your search criteria</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchName("");
                setSearchAgency("");
                setSearchSpecialty("");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAgents?.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}
