import { pgTable, text, serial, integer, boolean, numeric, timestamp, primaryKey, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User Account system
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified"),
  username: text("username").unique(),
  password: text("password"),
  image: text("image"),
  language: text("language").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  role: text("role").default("user").notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

// Property types
export const propertyTypes = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Duplex",
  "Office",
  "Shop",
  "Warehouse",
  "Land",
];

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  purpose: text("purpose").notNull(), // "sale" or "rent"
  price: numeric("price").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: numeric("area").notNull(), // in square feet
  location: text("location").notNull(),
  city: text("city").notNull(),
  neighborhood: text("neighborhood").notNull(),
  address: text("address").notNull(),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  yearBuilt: integer("year_built"),
  featured: boolean("featured").default(false),
  verified: boolean("verified").default(false),
  agentId: integer("agent_id").notNull(),
  imageUrls: text("image_urls").array(),
  amenities: text("amenities").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  agency: text("agency").notNull(),
  bio: text("bio"),
  specialty: text("specialty"),
  rating: numeric("rating"),
  listingsCount: integer("listings_count").default(0),
  imageUrl: text("image_url"),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  propertiesCount: integer("properties_count").default(0),
});

// User favorites
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userPropertyIdx: primaryKey({ columns: [table.userId, table.propertyId] }),
  };
});

// AI Features
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiConversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Search history
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  query: json("query").notNull(), // Store full search parameters
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Property Insights
export const propertyInsights = pgTable("property_insights", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  marketTrends: json("market_trends"),
  investmentPotential: text("investment_potential"),
  neighborhoodAnalysis: json("neighborhood_analysis"),
  pricePrediction: json("price_prediction"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define all relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  favorites: many(favorites),
  searches: many(searchHistory),
  conversations: many(aiConversations),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(agents, {
    fields: [properties.agentId],
    references: [agents.id],
  }),
  favorites: many(favorites),
}));

export const agentsRelations = relations(agents, ({ many }) => ({
  properties: many(properties),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
  messages: many(aiMessages),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id],
  }),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

export const propertyInsightsRelations = relations(propertyInsights, ({ one }) => ({
  property: one(properties, {
    fields: [propertyInsights.propertyId],
    references: [properties.id],
  }),
}));

// Create schema definitions
export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  username: true,
  password: true,
  image: true,
  language: true,
}).partial({ 
  password: true,
  username: true 
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

// Search schema
export const searchSchema = z.object({
  purpose: z.enum(["buy", "rent", "commercial"]).optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;
export type SearchParams = z.infer<typeof searchSchema>;