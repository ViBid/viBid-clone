import { 
  users, type User, type InsertUser, 
  properties, type Property, type InsertProperty,
  agents, type Agent, type InsertAgent,
  locations, type Location, type InsertLocation,
  type SearchParams
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property operations
  getProperties(limit?: number, featured?: boolean): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  getPropertyByIdWithAgent(id: number): Promise<{ property: Property; agent: Agent } | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  searchProperties(params: SearchParams): Promise<Property[]>;
  getPropertiesByPurpose(purpose: string, limit?: number): Promise<Property[]>;
  getPropertiesByType(type: string, limit?: number): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getNewDevelopments(limit?: number): Promise<Property[]>;
  
  // Agent operations
  getAgents(limit?: number): Promise<Agent[]>;
  getAgentById(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  
  // Location operations
  getLocations(limit?: number): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private agents: Map<number, Agent>;
  private locations: Map<number, Location>;
  
  private userIdCounter: number;
  private propertyIdCounter: number;
  private agentIdCounter: number;
  private locationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.agents = new Map();
    this.locations = new Map();
    
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.agentIdCounter = 1;
    this.locationIdCounter = 1;
    
    // Initialize storage with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getProperties(limit?: number, featured?: boolean): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (featured) {
      properties = properties.filter(p => p.featured);
    }
    
    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    return properties;
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getPropertyByIdWithAgent(id: number): Promise<{ property: Property; agent: Agent } | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const agent = this.agents.get(property.agentId);
    if (!agent) return undefined;
    
    return { property, agent };
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const createdAt = new Date();
    const property: Property = { ...insertProperty, id, createdAt };
    this.properties.set(id, property);
    return property;
  }

  async searchProperties(params: SearchParams): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (params.purpose === 'buy') {
      properties = properties.filter(p => p.purpose === 'sale');
    } else if (params.purpose === 'rent') {
      properties = properties.filter(p => p.purpose === 'rent');
    } else if (params.purpose === 'commercial') {
      properties = properties.filter(p => ['Office', 'Shop', 'Warehouse'].includes(p.type));
    }
    
    if (params.type) {
      properties = properties.filter(p => p.type === params.type);
    }
    
    if (params.location) {
      properties = properties.filter(p => 
        p.location.toLowerCase().includes(params.location!.toLowerCase()) || 
        p.neighborhood.toLowerCase().includes(params.location!.toLowerCase())
      );
    }
    
    if (params.minPrice) {
      properties = properties.filter(p => Number(p.price) >= params.minPrice!);
    }
    
    if (params.maxPrice) {
      properties = properties.filter(p => Number(p.price) <= params.maxPrice!);
    }
    
    if (params.bedrooms) {
      properties = properties.filter(p => p.bedrooms ? p.bedrooms >= params.bedrooms! : false);
    }
    
    if (params.bathrooms) {
      properties = properties.filter(p => p.bathrooms ? p.bathrooms >= params.bathrooms! : false);
    }
    
    if (params.minArea) {
      properties = properties.filter(p => Number(p.area) >= params.minArea!);
    }
    
    if (params.maxArea) {
      properties = properties.filter(p => Number(p.area) <= params.maxArea!);
    }
    
    return properties;
  }
  
  async getPropertiesByPurpose(purpose: string, limit?: number): Promise<Property[]> {
    let properties = Array.from(this.properties.values())
      .filter(p => p.purpose === purpose);
    
    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    return properties;
  }
  
  async getPropertiesByType(type: string, limit?: number): Promise<Property[]> {
    let properties = Array.from(this.properties.values())
      .filter(p => p.type === type);
    
    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    return properties;
  }
  
  async getFeaturedProperties(limit?: number): Promise<Property[]> {
    return this.getProperties(limit, true);
  }
  
  async getNewDevelopments(limit?: number): Promise<Property[]> {
    const currentYear = new Date().getFullYear();
    let properties = Array.from(this.properties.values())
      .filter(p => p.yearBuilt && p.yearBuilt >= currentYear);
    
    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    return properties;
  }

  // Agent operations
  async getAgents(limit?: number): Promise<Agent[]> {
    let agents = Array.from(this.agents.values());
    
    if (limit) {
      agents = agents.slice(0, limit);
    }
    
    return agents;
  }

  async getAgentById(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = this.agentIdCounter++;
    const agent: Agent = { ...insertAgent, id };
    this.agents.set(id, agent);
    return agent;
  }

  // Location operations
  async getLocations(limit?: number): Promise<Location[]> {
    let locations = Array.from(this.locations.values());
    
    if (limit) {
      locations = locations.slice(0, limit);
    }
    
    return locations;
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.locationIdCounter++;
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }
  
  // Initialize data
  private initializeData() {
    // Create sample agents
    const agents: InsertAgent[] = [
      {
        name: "James Wilson",
        email: "james.wilson@betterhomes.com",
        phone: "+971 55 123 4567",
        agency: "Better Homes",
        bio: "Specialized in luxury properties in Dubai Marina and Palm Jumeirah with over 10 years of experience.",
        specialty: "Dubai Marina Specialist",
        rating: 4.9,
        listingsCount: 45,
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@driven.com",
        phone: "+971 55 987 6543",
        agency: "Driven Properties",
        bio: "Downtown Dubai expert with extensive knowledge of the luxury market.",
        specialty: "Downtown Dubai Expert",
        rating: 4.8,
        listingsCount: 38,
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Ahmed Al Mansouri",
        email: "ahmed@allsopp.com",
        phone: "+971 50 765 4321",
        agency: "Allsopp & Allsopp",
        bio: "Arabian Ranches specialist with deep knowledge of villa communities.",
        specialty: "Arabian Ranches Specialist",
        rating: 4.9,
        listingsCount: 52,
        imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Maria Rodriguez",
        email: "maria@gulfsothebys.com",
        phone: "+971 54 222 3333",
        agency: "Gulf Sotheby's",
        bio: "Palm Jumeirah expert specializing in high-end properties.",
        specialty: "Palm Jumeirah Expert",
        rating: 4.7,
        listingsCount: 31,
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
      }
    ];
    
    for (const agent of agents) {
      this.createAgent(agent);
    }
    
    // Create sample locations
    const locations: InsertLocation[] = [
      { name: "Dubai Marina", city: "Dubai", propertiesCount: 1285 },
      { name: "Palm Jumeirah", city: "Dubai", propertiesCount: 865 },
      { name: "Downtown Dubai", city: "Dubai", propertiesCount: 732 },
      { name: "Arabian Ranches", city: "Dubai", propertiesCount: 514 },
      { name: "Jumeirah Village Circle", city: "Dubai", propertiesCount: 978 },
      { name: "Dubai Hills Estate", city: "Dubai", propertiesCount: 647 },
    ];
    
    for (const location of locations) {
      this.createLocation(location);
    }
    
    // Create sample properties
    const properties: InsertProperty[] = [
      {
        title: "Luxury Villa in Palm Jumeirah",
        description: "Beautiful luxury villa with panoramic sea views in Palm Jumeirah. This stunning property features 5 spacious bedrooms, 6 bathrooms, a private pool, a landscaped garden, and direct beach access.",
        type: "Villa",
        purpose: "sale",
        price: 12500000,
        bedrooms: 5,
        bathrooms: 6,
        area: 6500,
        location: "Palm Jumeirah",
        city: "Dubai",
        neighborhood: "Palm Jumeirah",
        address: "Frond K, Palm Jumeirah",
        latitude: 25.1123,
        longitude: 55.1375,
        yearBuilt: 2018,
        featured: true,
        verified: true,
        agentId: 1,
        imageUrls: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Swimming Pool", "Garden", "Beach Access", "Gym", "Security", "Parking", "Balcony", "Maid's Room"]
      },
      {
        title: "Modern Apartment in Downtown",
        description: "Stylish 2-bedroom apartment in the heart of Downtown Dubai with stunning views of Burj Khalifa. Features high-end finishes, floor-to-ceiling windows, and access to premium building amenities.",
        type: "Apartment",
        purpose: "sale",
        price: 3200000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        location: "Downtown Dubai",
        city: "Dubai",
        neighborhood: "Downtown Dubai",
        address: "Boulevard Point, Downtown Dubai",
        latitude: 25.1922,
        longitude: 55.2744,
        yearBuilt: 2019,
        featured: true,
        verified: true,
        agentId: 2,
        imageUrls: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1617104678098-de229db51b92?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Swimming Pool", "Gym", "Concierge", "Parking", "Balcony", "Children's Play Area"]
      },
      {
        title: "Elegant Townhouse with Sea View",
        description: "Beautifully designed 4-bedroom townhouse in Jumeirah with stunning sea views. This property features modern architecture, spacious rooms, high-quality finishes, and a private garden.",
        type: "Townhouse",
        purpose: "sale",
        price: 5800000,
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
        location: "Jumeirah",
        city: "Dubai",
        neighborhood: "Jumeirah",
        address: "Jumeirah 1, Dubai",
        latitude: 25.2048,
        longitude: 55.2708,
        yearBuilt: 2020,
        featured: true,
        verified: true,
        agentId: 3,
        imageUrls: [
          "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1609347744403-c778cde59b2d?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Sea View", "Garden", "Gym", "Parking", "Maid's Room", "Study Room"]
      },
      {
        title: "Spacious Apartment in Dubai Marina",
        description: "Beautiful 2-bedroom apartment in Dubai Marina with amazing views of the marina and the sea. Features a modern kitchen, spacious living area, and access to premium building amenities.",
        type: "Apartment",
        purpose: "rent",
        price: 120000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1350,
        location: "Dubai Marina",
        city: "Dubai",
        neighborhood: "Dubai Marina",
        address: "Marina Promenade, Dubai Marina",
        latitude: 25.0792,
        longitude: 55.1402,
        yearBuilt: 2017,
        featured: true,
        verified: true,
        agentId: 1,
        imageUrls: [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1580216143578-3a387f6b494c?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Swimming Pool", "Gym", "24/7 Security", "Covered Parking", "Balcony", "Sauna"]
      },
      {
        title: "Family Villa in Arabian Ranches",
        description: "Spacious 4-bedroom villa in Arabian Ranches perfect for family living. Features a private pool, landscaped garden, modern kitchen, spacious living areas, and access to community amenities.",
        type: "Villa",
        purpose: "rent",
        price: 280000,
        bedrooms: 4,
        bathrooms: 5,
        area: 4200,
        location: "Arabian Ranches",
        city: "Dubai",
        neighborhood: "Arabian Ranches",
        address: "Alvorada, Arabian Ranches",
        latitude: 25.1307,
        longitude: 55.2493,
        yearBuilt: 2016,
        featured: true,
        verified: true,
        agentId: 3,
        imageUrls: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Swimming Pool", "Garden", "Gym", "Parking", "Maid's Room", "Study Room", "Community Center"]
      },
      {
        title: "Modern Loft in Business Bay",
        description: "Stylish 1-bedroom loft in Business Bay with amazing views of the Dubai skyline. Features modern design, high ceilings, and premium building amenities.",
        type: "Apartment",
        purpose: "rent",
        price: 95000,
        bedrooms: 1,
        bathrooms: 1.5,
        area: 850,
        location: "Business Bay",
        city: "Dubai",
        neighborhood: "Business Bay",
        address: "Executive Towers, Business Bay",
        latitude: 25.1851,
        longitude: 55.2722,
        yearBuilt: 2019,
        featured: false,
        verified: true,
        agentId: 2,
        imageUrls: [
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1617325710236-4a36d4d9f6ce?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1622023086844-13438597ba46?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Swimming Pool", "Gym", "Concierge", "Parking", "Balcony"]
      },
      {
        title: "Creek Harbour Residences",
        description: "Brand new luxury apartments in Dubai Creek Harbour with stunning views of the creek and the Dubai skyline. These apartments feature premium finishes, spacious layouts, and access to world-class amenities.",
        type: "Apartment",
        purpose: "sale",
        price: 1200000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        location: "Dubai Creek Harbour",
        city: "Dubai",
        neighborhood: "Dubai Creek Harbour",
        address: "Creek Rise, Dubai Creek Harbour",
        latitude: 25.2014,
        longitude: 55.3615,
        yearBuilt: 2023,
        featured: false,
        verified: true,
        agentId: 4,
        imageUrls: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Swimming Pool", "Gym", "Children's Play Area", "Retail Outlets", "Waterfront Promenade", "Jogging Track"]
      },
      {
        title: "Dubai Hills Parkside",
        description: "New luxury villas in Dubai Hills Estate surrounded by lush greenery and parks. These villas feature modern design, spacious layouts, private gardens, and access to premium community amenities.",
        type: "Villa",
        purpose: "sale",
        price: 3500000,
        bedrooms: 4,
        bathrooms: 4,
        area: 3700,
        location: "Dubai Hills Estate",
        city: "Dubai",
        neighborhood: "Dubai Hills Estate",
        address: "Parkside, Dubai Hills Estate",
        latitude: 25.1279,
        longitude: 55.2494,
        yearBuilt: 2024,
        featured: false,
        verified: true,
        agentId: 4,
        imageUrls: [
          "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Private Garden", "Golf Course View", "Community Center", "Swimming Pool", "Gym", "Playground", "BBQ Area"]
      }
    ];
    
    for (const property of properties) {
      this.createProperty(property);
    }
  }
}

export const storage = new MemStorage();
