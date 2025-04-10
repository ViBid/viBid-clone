import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/constants";
import { Property } from "@shared/schema";

interface NewDevelopmentProps {
  property: Property;
}

export function NewDevelopment({ property }: NewDevelopmentProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative">
        <img 
          src={property.imageUrls[0]} 
          className="w-full h-72 object-cover" 
          alt={property.title}
        />
        <span className="absolute top-3 left-3 bg-primary-dark text-white px-3 py-1 rounded text-sm font-medium">
          Off-Plan
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-xl mb-2">{property.title}</h3>
        <p className="text-text-light mb-3">
          <i className="fas fa-map-marker-alt mr-1"></i> {property.location}, {property.city}
        </p>
        
        <div className="flex justify-between mb-3">
          <div className="text-sm border border-text-light rounded-full px-3 py-1">
            {property.type}
          </div>
          <div className="text-sm border border-text-light rounded-full px-3 py-1">
            Q{Math.floor(Math.random() * 4) + 1} {property.yearBuilt}
          </div>
          <div className="text-sm border border-text-light rounded-full px-3 py-1">
            {property.agentId === 4 ? "Emaar" : "Damac"}
          </div>
        </div>
        
        <div className="border-t pt-3 flex justify-between items-center">
          <div className="font-medium">Starting from {formatPrice(Number(property.price))}</div>
          <Link href={`/properties/${property.id}`}>
            <Button className="bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition duration-300">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
