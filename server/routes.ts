import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { parseSearchQuery, generatePropertyInsights, processPropertyConsultantMessage, translateText } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/properties", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const featured = req.query.featured === "true";
      
      const properties = await storage.getProperties(limit, featured);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const properties = await storage.getFeaturedProperties(limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/sale", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const properties = await storage.getPropertiesByPurpose("sale", limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties for sale" });
    }
  });

  app.get("/api/properties/rent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const properties = await storage.getPropertiesByPurpose("rent", limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental properties" });
    }
  });

  app.get("/api/properties/new-developments", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 2;
      const properties = await storage.getNewDevelopments(limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new developments" });
    }
  });

  app.get("/api/properties/search", async (req, res) => {
    try {
      const searchParams = {
        purpose: req.query.purpose as string,
        type: req.query.type as string,
        location: req.query.location as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
        bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
        minArea: req.query.minArea ? Number(req.query.minArea) : undefined,
        maxArea: req.query.maxArea ? Number(req.query.maxArea) : undefined,
      };
      
      // Validate search params
      const validatedParams = searchSchema.parse(searchParams);
      
      const properties = await storage.searchProperties(validatedParams);
      res.json(properties);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to search properties" });
      }
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.getPropertyByIdWithAgent(id);
      
      if (!result) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property details" });
    }
  });

  app.get("/api/agents", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const agents = await storage.getAgents(limit);
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgentById(id);
      
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent details" });
    }
  });

  app.get("/api/locations", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const locations = await storage.getLocations(limit);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // AI-powered natural language search
  app.post("/api/properties/ai-search", async (req, res) => {
    try {
      const { query, language = 'en' } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // Parse the natural language query into structured search parameters
      const searchParams = await parseSearchQuery(query, language);
      
      // Search properties using the parsed parameters
      const properties = await storage.searchProperties(searchParams);
      
      // Return both the parsed search parameters and the results
      res.json({ 
        searchParams,
        properties 
      });
    } catch (error) {
      console.error("AI search error:", error);
      res.status(500).json({ message: "AI search failed" });
    }
  });

  // Get property insights powered by AI
  app.get("/api/properties/:id/insights", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const language = req.query.language as string || 'en';
      
      // Get the property data
      const propertyWithAgent = await storage.getPropertyByIdWithAgent(id);
      
      if (!propertyWithAgent) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Generate insights using AI
      const insights = await generatePropertyInsights(propertyWithAgent, language);
      
      res.json({ insights });
    } catch (error) {
      console.error("Property insights error:", error);
      res.status(500).json({ message: "Failed to generate property insights" });
    }
  });

  // AI Property Consultant Chatbot
  app.post("/api/consultant-chat", async (req, res) => {
    try {
      const { messages, language = 'en' } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Valid messages array is required" });
      }
      
      // Process the chat message using AI
      const response = await processPropertyConsultantMessage(messages, language);
      
      res.json({ 
        response,
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error("AI consultant error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Translation service
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, sourceLang, targetLang } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: "Text to translate is required" });
      }
      
      if (!sourceLang || !targetLang) {
        return res.status(400).json({ message: "Source and target languages are required" });
      }
      
      // Translate the text
      const translatedText = await translateText(text, sourceLang, targetLang);
      
      res.json({ translatedText });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ message: "Translation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
