import { db } from './db';
import { 
  users, agents, properties, locations,
  type InsertAgent, type InsertProperty, type InsertLocation, type InsertUser
} from '@shared/schema';

export async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // First check if we've already seeded the database
    const existingAgents = await db.select().from(agents);
    if (existingAgents.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Seed agents
    const agentsData: InsertAgent[] = [
      {
        name: "James Wilson",
        email: "james.wilson@betterhomes.com",
        phone: "+971 55 123 4567",
        agency: "Better Homes",
        bio: "Specialized in luxury properties in Dubai Marina and Palm Jumeirah with over 10 years of experience.",
        specialty: "Dubai Marina Specialist",
        rating: "4.9",
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
        rating: "4.8",
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
        rating: "4.9",
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
        rating: "4.7",
        listingsCount: 31,
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
      }
    ];
    
    const insertedAgents = await db.insert(agents).values(agentsData).returning({ id: agents.id });
    console.log(`Inserted ${insertedAgents.length} agents`);
    
    // Seed locations
    const locationsData: InsertLocation[] = [
      { name: "Dubai Marina", city: "Dubai", propertiesCount: 1285 },
      { name: "Palm Jumeirah", city: "Dubai", propertiesCount: 865 },
      { name: "Downtown Dubai", city: "Dubai", propertiesCount: 732 },
      { name: "Arabian Ranches", city: "Dubai", propertiesCount: 514 },
      { name: "Jumeirah Village Circle", city: "Dubai", propertiesCount: 978 },
      { name: "Dubai Hills Estate", city: "Dubai", propertiesCount: 647 },
    ];
    
    await db.insert(locations).values(locationsData);
    console.log(`Inserted ${locationsData.length} locations`);
    
    // Seed properties
    const propertiesData: InsertProperty[] = [
      {
        title: "Luxury Villa in Palm Jumeirah",
        description: "Beautiful luxury villa with panoramic sea views in Palm Jumeirah. This stunning property features 5 spacious bedrooms, 6 bathrooms, a private pool, a landscaped garden, and direct beach access.",
        type: "Villa",
        purpose: "sale",
        price: "12500000",
        bedrooms: 5,
        bathrooms: 6,
        area: "6500",
        location: "Palm Jumeirah",
        city: "Dubai",
        neighborhood: "Palm Jumeirah",
        address: "Frond K, Palm Jumeirah",
        latitude: "25.1123",
        longitude: "55.1375",
        yearBuilt: 2018,
        featured: true,
        verified: true,
        agentId: insertedAgents[0].id,
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
        price: "3200000",
        bedrooms: 2,
        bathrooms: 2,
        area: "1200",
        location: "Downtown Dubai",
        city: "Dubai",
        neighborhood: "Downtown Dubai",
        address: "Boulevard Point, Downtown Dubai",
        latitude: "25.1922",
        longitude: "55.2744",
        yearBuilt: 2019,
        featured: true,
        verified: true,
        agentId: insertedAgents[1].id,
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
        price: "5800000",
        bedrooms: 4,
        bathrooms: 4,
        area: "3200",
        location: "Jumeirah",
        city: "Dubai",
        neighborhood: "Jumeirah",
        address: "Jumeirah 1, Dubai",
        latitude: "25.2048",
        longitude: "55.2708",
        yearBuilt: 2020,
        featured: true,
        verified: true,
        agentId: insertedAgents[2].id,
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
        price: "120000",
        bedrooms: 2,
        bathrooms: 2,
        area: "1350",
        location: "Dubai Marina",
        city: "Dubai",
        neighborhood: "Dubai Marina",
        address: "Marina Promenade, Dubai Marina",
        latitude: "25.0792",
        longitude: "55.1402",
        yearBuilt: 2017,
        featured: true,
        verified: true,
        agentId: insertedAgents[0].id,
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
        price: "280000",
        bedrooms: 4,
        bathrooms: 5,
        area: "4200",
        location: "Arabian Ranches",
        city: "Dubai",
        neighborhood: "Arabian Ranches",
        address: "Alvorada, Arabian Ranches",
        latitude: "25.1307",
        longitude: "55.2493",
        yearBuilt: 2016,
        featured: true,
        verified: true,
        agentId: insertedAgents[2].id,
        imageUrls: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&h=500&q=80",
          "https://images.unsplash.com/photo-1576941089067-2de3c901e463?auto=format&fit=crop&w=800&h=500&q=80"
        ],
        amenities: ["Swimming Pool", "Garden", "Gym", "Parking", "Maid's Room", "Community Facilities"]
      },
    ];
    
    await db.insert(properties).values(propertiesData);
    console.log(`Inserted ${propertiesData.length} properties`);
    
    // Create a demo user
    const userData: InsertUser = {
      name: "Demo User",
      email: "demo@propertyfinder.com",
      username: "demo",
      password: "password123", // In a real app, this would be hashed
      language: "en",
    };
    
    await db.insert(users).values(userData);
    console.log('Inserted demo user');
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}