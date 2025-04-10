import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Property } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { PROPERTY_TYPES, PRICE_RANGES, BEDROOM_OPTIONS } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, SortDesc, Search, Grid3x3, MapPin } from "lucide-react";

export default function PropertiesSearch() {
  const [location, setLocation] = useLocation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Parse the purpose from URL
  const purpose = location.split('/')[2] || 'buy';
  
  // Parse query parameters
  const params = new URLSearchParams(location.split('?')[1] || '');
  
  // Setup filters state
  const [filters, setFilters] = useState({
    purpose: purpose,
    type: params.get('type') || '',
    location: params.get('location') || '',
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    bedrooms: params.get('bedrooms') || '',
    sort: params.get('sort') || 'newest',
  });
  
  // Update query when filters change
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.set('type', filters.type);
    if (filters.location) queryParams.set('location', filters.location);
    if (filters.minPrice) queryParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) queryParams.set('bedrooms', filters.bedrooms);
    if (filters.sort) queryParams.set('sort', filters.sort);
    
    const queryString = queryParams.toString();
    setLocation(`/properties/${filters.purpose}${queryString ? `?${queryString}` : ''}`);
  }, [filters]);
  
  // Fetch properties based on filters
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/search?purpose=${filters.purpose}&type=${filters.type}&location=${filters.location}` +
      `${filters.minPrice ? `&minPrice=${filters.minPrice}` : ''}` +
      `${filters.maxPrice ? `&maxPrice=${filters.maxPrice}` : ''}` +
      `${filters.bedrooms ? `&bedrooms=${filters.bedrooms}` : ''}`
    ],
  });
  
  const getPurposeTitle = () => {
    switch (purpose) {
      case 'buy': return 'Properties for Sale';
      case 'rent': return 'Properties for Rent';
      case 'commercial': return 'Commercial Properties';
      case 'new-projects': return 'New Development Projects';
      default: return 'Properties';
    }
  };
  
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <>
      <Header />
      
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-poppins font-semibold">{getPurposeTitle()}</h1>
          {filters.location && (
            <p className="text-text-light">
              <i className="fas fa-map-marker-alt mr-1"></i> {filters.location}
            </p>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              className="mr-3 flex items-center"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter size={16} className="mr-2" /> Filters
            </Button>
            
            {/* Mobile search input */}
            <div className="relative md:hidden w-full max-w-xs">
              <Input
                type="text"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pr-8"
              />
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center ml-auto">
            <span className="text-text-light mr-2">Sort:</span>
            <Select 
              value={filters.sort} 
              onValueChange={(value) => handleFilterChange('sort', value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price (Low to High)</SelectItem>
                <SelectItem value="price_high">Price (High to Low)</SelectItem>
                <SelectItem value="beds">Beds (Most first)</SelectItem>
                <SelectItem value="area">Area (Largest first)</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-3 hidden md:flex space-x-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Grid3x3 size={16} />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MapPin size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        {filtersOpen && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <Select 
                  value={filters.minPrice ? `${filters.minPrice}-${filters.maxPrice || ''}` : ''}
                  onValueChange={(value) => {
                    if (value === '') {
                      handleFilterChange('minPrice', undefined);
                      handleFilterChange('maxPrice', undefined);
                    } else {
                      const [min, max] = value.split('-');
                      handleFilterChange('minPrice', min ? Number(min) : undefined);
                      handleFilterChange('maxPrice', max ? Number(max) : undefined);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any price</SelectItem>
                    {PRICE_RANGES.slice(1).map((range) => (
                      <SelectItem key={range.label} value={`${range.min}-${range.max || ''}`}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bedrooms</label>
                <Select 
                  value={filters.bedrooms} 
                  onValueChange={(value) => handleFilterChange('bedrooms', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any bedrooms</SelectItem>
                    {BEDROOM_OPTIONS.slice(1).map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Checkbox id="pool" />
                    <label htmlFor="pool" className="ml-2 text-sm">Swimming Pool</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="gym" />
                    <label htmlFor="gym" className="ml-2 text-sm">Gym</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="parking" />
                    <label htmlFor="parking" className="ml-2 text-sm">Parking</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="balcony" />
                    <label htmlFor="balcony" className="ml-2 text-sm">Balcony</label>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 flex items-end">
                <Button className="bg-primary text-white mr-2">Apply Filters</Button>
                <Button variant="outline" onClick={() => {
                  setFilters({
                    purpose: purpose,
                    type: '',
                    location: '',
                    minPrice: undefined,
                    maxPrice: undefined,
                    bedrooms: '',
                    sort: 'newest',
                  });
                }}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Section */}
        <div className="mb-4">
          <p className="text-text-light">
            {isLoading 
              ? 'Loading properties...' 
              : `${properties?.length || 0} properties found`
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(6)].map((_, index) => (
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
              ))
            : properties?.length === 0
              ? (
                  <div className="col-span-full p-8 text-center">
                    <div className="mb-4 text-gray-400">
                      <Search size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No properties found</h3>
                    <p className="text-text-light mb-4">Try adjusting your search criteria</p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setFilters({
                          purpose: purpose,
                          type: '',
                          location: '',
                          minPrice: undefined,
                          maxPrice: undefined,
                          bedrooms: '',
                          sort: 'newest',
                        });
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )
              : properties?.map(property => (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <a className="block">
                      <PropertyCard property={property} />
                    </a>
                  </Link>
                ))
          }
        </div>
        
        {properties && properties.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="mr-2">Previous</Button>
            <Button variant="outline" className="bg-primary text-white">1</Button>
            <Button variant="outline" className="mx-2">2</Button>
            <Button variant="outline" className="mr-2">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}
