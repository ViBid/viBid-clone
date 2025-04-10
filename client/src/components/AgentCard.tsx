import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Agent } from "@shared/schema";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 text-center">
      <div className="pt-6">
        <img 
          src={agent.imageUrl} 
          className="w-24 h-24 rounded-full mx-auto object-cover" 
          alt={agent.name} 
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-lg mb-1">{agent.name}</h3>
        <p className="text-primary font-medium mb-2">{agent.agency}</p>
        <p className="text-text-light mb-3">{agent.specialty}</p>
        
        <div className="flex justify-center space-x-2 mb-4">
          <span className="bg-secondary rounded-full px-2 py-1 text-xs">{agent.listingsCount} listings</span>
          <span className="bg-secondary rounded-full px-2 py-1 text-xs">{agent.rating} ★</span>
        </div>
        
        <Link href={`/agents/${agent.id}`}>
          <Button className="w-full bg-primary text-white hover:bg-blue-600 transition duration-300">
            Contact Agent
          </Button>
        </Link>
      </div>
    </div>
  );
}
