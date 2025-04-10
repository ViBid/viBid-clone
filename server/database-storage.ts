import { desc, eq, and, gte, lte, like, or, inArray } from "drizzle-orm";
import { db } from "./db";
import { 
  users, type User, type InsertUser, 
  properties, type Property, type InsertProperty,
  agents, type Agent, type InsertAgent,
  locations, type Location, type InsertLocation,
  type SearchParams
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Property operations
  async getProperties(limit?: number, featured?: boolean): Promise<Property[]> {
    let query = db.select().from(properties);
    
    if (featured) {
      query = query.where(eq(properties.featured, true));
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }
  
  async getPropertyByIdWithAgent(id: number): Promise<{ property: Property; agent: Agent } | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    if (!property) return undefined;
    
    const [agent] = await db.select().from(agents).where(eq(agents.id, property.agentId));
    if (!agent) return undefined;
    
    return { property, agent };
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async searchProperties(params: SearchParams): Promise<Property[]> {
    let conditions = [];
    
    if (params.purpose === 'buy') {
      conditions.push(eq(properties.purpose, 'sale'));
    } else if (params.purpose === 'rent') {
      conditions.push(eq(properties.purpose, 'rent'));
    } else if (params.purpose === 'commercial') {
      conditions.push(inArray(properties.type, ['Office', 'Shop', 'Warehouse']));
    }
    
    if (params.type) {
      conditions.push(eq(properties.type, params.type));
    }
    
    if (params.location) {
      conditions.push(or(
        like(properties.location, `%${params.location}%`),
        like(properties.neighborhood, `%${params.location}%`)
      ));
    }
    
    if (params.minPrice) {
      conditions.push(gte(properties.price, params.minPrice));
    }
    
    if (params.maxPrice) {
      conditions.push(lte(properties.price, params.maxPrice));
    }
    
    if (params.bedrooms) {
      conditions.push(gte(properties.bedrooms, params.bedrooms));
    }
    
    if (params.bathrooms) {
      conditions.push(gte(properties.bathrooms, params.bathrooms));
    }
    
    if (params.minArea) {
      conditions.push(gte(properties.area, params.minArea));
    }
    
    if (params.maxArea) {
      conditions.push(lte(properties.area, params.maxArea));
    }
    
    if (conditions.length === 0) {
      return await db.select().from(properties);
    }
    
    return await db.select().from(properties).where(and(...conditions));
  }
  
  async getPropertiesByPurpose(purpose: string, limit?: number): Promise<Property[]> {
    let query = db.select().from(properties).where(eq(properties.purpose, purpose));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async getPropertiesByType(type: string, limit?: number): Promise<Property[]> {
    let query = db.select().from(properties).where(eq(properties.type, type));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async getFeaturedProperties(limit?: number): Promise<Property[]> {
    let query = db.select().from(properties).where(eq(properties.featured, true));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async getNewDevelopments(limit?: number): Promise<Property[]> {
    const currentYear = new Date().getFullYear();
    
    let query = db.select()
      .from(properties)
      .where(gte(properties.yearBuilt, currentYear));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  // Agent operations
  async getAgents(limit?: number): Promise<Agent[]> {
    let query = db.select().from(agents);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getAgentById(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  // Location operations
  async getLocations(limit?: number): Promise<Location[]> {
    let query = db.select().from(locations);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(insertLocation).returning();
    return location;
  }
}