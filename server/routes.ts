import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertDomainSchema, 
  insertDatabaseSchema,
  insertActivitySchema,
  insertSystemMetricsSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });
  
  // Projects API
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      return res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const project = await storage.createProject(result.data);
      
      return res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const projectSchema = insertProjectSchema.partial();
      const result = projectSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const updatedProject = await storage.updateProject(id, result.data);
      
      return res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete project" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting project:", error);
      return res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Domains API
  app.get("/api/domains", async (req: Request, res: Response) => {
    try {
      const domains = await storage.getDomains();
      return res.json(domains);
    } catch (error) {
      console.error("Error fetching domains:", error);
      return res.status(500).json({ message: "Failed to fetch domains" });
    }
  });

  app.post("/api/domains", async (req: Request, res: Response) => {
    try {
      const result = insertDomainSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if project exists
      if (result.data.projectId) {
        const project = await storage.getProject(result.data.projectId);
        
        if (!project) {
          return res.status(400).json({ message: "Project not found" });
        }
      }
      
      // Check if domain already exists
      const existingDomain = await storage.getDomainByName(result.data.name);
      
      if (existingDomain) {
        return res.status(400).json({ message: "Domain already exists" });
      }
      
      const domain = await storage.createDomain(result.data);
      
      return res.status(201).json(domain);
    } catch (error) {
      console.error("Error creating domain:", error);
      return res.status(500).json({ message: "Failed to create domain" });
    }
  });

  app.patch("/api/domains/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid domain ID" });
      }
      
      const domain = await storage.getDomain(id);
      
      if (!domain) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      const domainSchema = insertDomainSchema.partial();
      const result = domainSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const updatedDomain = await storage.updateDomain(id, result.data);
      
      return res.json(updatedDomain);
    } catch (error) {
      console.error("Error updating domain:", error);
      return res.status(500).json({ message: "Failed to update domain" });
    }
  });

  app.delete("/api/domains/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid domain ID" });
      }
      
      const domain = await storage.getDomain(id);
      
      if (!domain) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      const deleted = await storage.deleteDomain(id);
      
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete domain" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting domain:", error);
      return res.status(500).json({ message: "Failed to delete domain" });
    }
  });

  // Databases API
  app.get("/api/databases", async (req: Request, res: Response) => {
    try {
      const databases = await storage.getDatabases();
      return res.json(databases);
    } catch (error) {
      console.error("Error fetching databases:", error);
      return res.status(500).json({ message: "Failed to fetch databases" });
    }
  });

  app.post("/api/databases", async (req: Request, res: Response) => {
    try {
      const result = insertDatabaseSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if project exists
      if (result.data.projectId) {
        const project = await storage.getProject(result.data.projectId);
        
        if (!project) {
          return res.status(400).json({ message: "Project not found" });
        }
      }
      
      // Check if database with same name already exists
      const existingDatabase = await storage.getDatabaseByName(result.data.name);
      
      if (existingDatabase) {
        return res.status(400).json({ message: "Database with this name already exists" });
      }
      
      const database = await storage.createDatabase(result.data);
      
      return res.status(201).json(database);
    } catch (error) {
      console.error("Error creating database:", error);
      return res.status(500).json({ message: "Failed to create database" });
    }
  });

  app.delete("/api/databases/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid database ID" });
      }
      
      const database = await storage.getDatabase(id);
      
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }
      
      const deleted = await storage.deleteDatabase(id);
      
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete database" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting database:", error);
      return res.status(500).json({ message: "Failed to delete database" });
    }
  });

  // Activities API
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(limit);
      return res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      return res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/projects/:id/activities", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getProjectActivities(projectId, limit);
      
      return res.json(activities);
    } catch (error) {
      console.error("Error fetching project activities:", error);
      return res.status(500).json({ message: "Failed to fetch project activities" });
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const result = insertActivitySchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if project exists
      if (result.data.projectId) {
        const project = await storage.getProject(result.data.projectId);
        
        if (!project) {
          return res.status(400).json({ message: "Project not found" });
        }
      }
      
      const activity = await storage.createActivity(result.data);
      
      return res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      return res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // System Metrics API
  app.get("/api/system-metrics", async (req: Request, res: Response) => {
    try {
      const metrics = await storage.getLatestSystemMetrics();
      
      if (!metrics) {
        return res.status(404).json({ message: "No system metrics found" });
      }
      
      return res.json(metrics);
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      return res.status(500).json({ message: "Failed to fetch system metrics" });
    }
  });

  app.post("/api/system-metrics", async (req: Request, res: Response) => {
    try {
      const result = insertSystemMetricsSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const metrics = await storage.createSystemMetrics(result.data);
      
      return res.status(201).json(metrics);
    } catch (error) {
      console.error("Error creating system metrics:", error);
      return res.status(500).json({ message: "Failed to create system metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
