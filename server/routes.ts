import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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

  const httpServer = createServer(app);
  return httpServer;
}
