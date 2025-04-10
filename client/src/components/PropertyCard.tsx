import { Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { formatPrice, formatArea } from "@/lib/constants";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative">
        <img 
          src={property.imageUrls[0]} 
          className="w-full h-56 object-cover" 
          alt={property.title} 
        />
        {property.featured && (
          <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded text-sm font-medium">
            Featured
          </span>
        )}
        <button 
          className="absolute top-3 right-3 bg-white p-2 rounded-full text-text-light hover:text-primary"
          onClick={toggleFavorite}
        >
          <Heart className={isFavorite ? "fill-primary text-primary" : ""} size={18} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-poppins font-semibold text-lg">{property.title}</h3>
          <span className="font-poppins font-bold text-lg text-primary">
            {property.purpose === "rent" 
              ? `${formatPrice(Number(property.price))}/yr` 
              : formatPrice(Number(property.price))
            }
          </span>
        </div>
        
        <p className="text-text-light mb-3">
          <i className="fas fa-map-marker-alt mr-1"></i> {property.location}, {property.city}
        </p>
        
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <i className="fas fa-bed mr-1 text-text-light"></i>
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-bath mr-1 text-text-light"></i>
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-vector-square mr-1 text-text-light"></i>
            <span>{formatArea(Number(property.area))}</span>
          </div>
        </div>
        
        <div className="border-t pt-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href={`/agents/${property.agentId}`}>
              <img 
                src={`https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80&q=80`} 
                className="w-8 h-8 rounded-full mr-2" 
                alt="Agent" 
              />
            </Link>
            <span className="text-sm">Better Homes</span>
          </div>
          <span className="text-sm text-text-light">Listed: 2 days ago</span>
        </div>
      </div>
    </div>
  );
}
