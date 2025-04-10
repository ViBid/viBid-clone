import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Location } from "@shared/schema";

export function PopularSearches() {
  const { data: locations, isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  if (isLoading) {
    return (
      <section className="py-8 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-medium mb-4">Popular searches</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-3 rounded shadow h-16 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-medium mb-4">Popular searches</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {locations?.map((location) => (
            <Link key={location.id} href={`/properties/buy?location=${encodeURIComponent(location.name)}`}>
              <a className="bg-white p-3 rounded shadow hover:shadow-md transition duration-300 text-center">
                <div className="text-text-dark font-medium">{location.name}</div>
                <div className="text-text-light text-sm">{location.propertiesCount} Properties</div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
