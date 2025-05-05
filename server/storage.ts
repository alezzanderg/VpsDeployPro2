import { 
  users, domains, projects, databases, activities, systemMetrics,
  User, InsertUser, Project, InsertProject, Domain, InsertDomain,
  Database, InsertDatabase, Activity, InsertActivity, SystemMetric, InsertSystemMetric
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Define the storage interface with all CRUD methods needed
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Domain methods
  getDomains(): Promise<Domain[]>;
  getDomain(id: number): Promise<Domain | undefined>;
  getDomainByName(name: string): Promise<Domain | undefined>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: number, domain: Partial<Domain>): Promise<Domain | undefined>;
  deleteDomain(id: number): Promise<boolean>;

  // Database methods
  getDatabases(): Promise<Database[]>;
  getDatabase(id: number): Promise<Database | undefined>;
  getDatabaseByName(name: string): Promise<Database | undefined>;
  createDatabase(database: InsertDatabase): Promise<Database>;
  deleteDatabase(id: number): Promise<boolean>;

  // Activity methods
  getActivities(limit?: number): Promise<Activity[]>;
  getProjectActivities(projectId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // System metrics methods
  getLatestSystemMetrics(): Promise<SystemMetric | undefined>;
  createSystemMetrics(metrics: InsertSystemMetric): Promise<SystemMetric>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private domains: Map<number, Domain>;
  private databases: Map<number, Database>;
  private activities: Map<number, Activity>;
  private systemMetrics: Map<number, SystemMetric>;
  
  private userCurrentId: number;
  private projectCurrentId: number;
  private domainCurrentId: number;
  private databaseCurrentId: number;
  private activityCurrentId: number;
  private systemMetricCurrentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.domains = new Map();
    this.databases = new Map();
    this.activities = new Map();
    this.systemMetrics = new Map();
    
    this.userCurrentId = 1;
    this.projectCurrentId = 1;
    this.domainCurrentId = 1;
    this.databaseCurrentId = 1;
    this.activityCurrentId = 1;
    this.systemMetricCurrentId = 1;

    // Initialize with sample admin user
    this.createUser({
      username: "admin",
      password: "password", // In a real app, this would be hashed
      email: "admin@server.local"
    });

    // Initialize with sample system metrics
    this.createSystemMetrics({
      cpuUsage: 23,
      memoryUsage: 42,
      diskUsage: 38,
      networkUsage: 246
    });

    // Create sample projects for demo
    const portfolio = this.createProject({
      name: "Personal Portfolio",
      framework: "React",
      repositoryUrl: "https://github.com/username/portfolio",
      branch: "main",
      domain: "portfolio.example.com"
    });
    this.updateProject(portfolio.id, { status: "live" });

    const dashboard = this.createProject({
      name: "E-commerce Dashboard",
      framework: "Vue.js",
      repositoryUrl: "https://github.com/username/dashboard",
      branch: "main",
      domain: "dashboard-staging.example.com"
    });
    this.updateProject(dashboard.id, { status: "building" });

    const apiService = this.createProject({
      name: "API Service",
      framework: "Express.js",
      repositoryUrl: "https://github.com/username/api-service",
      branch: "main",
      domain: "api.example.com"
    });
    this.updateProject(apiService.id, { status: "live" });

    // Create sample domains
    this.createDomain({
      name: "portfolio.example.com",
      projectId: portfolio.id
    });
    this.createDomain({
      name: "dashboard-staging.example.com",
      projectId: dashboard.id
    });
    this.createDomain({
      name: "api.example.com",
      projectId: apiService.id
    });

    // Create sample databases
    this.createDatabase({
      name: "portfolio_db",
      type: "PostgreSQL",
      projectId: portfolio.id,
      connectionString: "postgres://user:password@localhost:5432/portfolio_db"
    });
    this.createDatabase({
      name: "api_db",
      type: "MySQL",
      projectId: apiService.id,
      connectionString: "mysql://user:password@localhost:3306/api_db"
    });

    // Create sample activities
    this.createActivity({
      type: "deployment",
      description: "Deployment completed for Personal Portfolio",
      projectId: portfolio.id
    });
    this.createActivity({
      type: "build",
      description: "Build started for E-commerce Dashboard",
      projectId: dashboard.id
    });
    this.createActivity({
      type: "database",
      description: "Database created - blog_production",
      projectId: null as any
    });
    this.createActivity({
      type: "domain",
      description: "Domain configured - api.example.com",
      projectId: apiService.id
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const now = new Date();
    
    const project: Project = {
      ...insertProject,
      id,
      status: "idle",
      createdAt: now,
      updatedAt: now
    };
    
    this.projects.set(id, project);
    
    // Create activity for project creation
    await this.createActivity({
      type: "project",
      description: `Project created - ${project.name}`,
      projectId: project.id
    });
    
    return project;
  }

  async updateProject(id: number, updateData: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    
    if (!project) return undefined;
    
    const updatedProject = {
      ...project,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.projects.set(id, updatedProject);
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const project = this.projects.get(id);
    
    if (!project) return false;
    
    // Delete associated domains
    const projectDomains = Array.from(this.domains.values())
      .filter(domain => domain.projectId === id);
    
    for (const domain of projectDomains) {
      this.domains.delete(domain.id);
    }
    
    // Delete associated databases
    const projectDatabases = Array.from(this.databases.values())
      .filter(db => db.projectId === id);
    
    for (const db of projectDatabases) {
      this.databases.delete(db.id);
    }
    
    // Create activity for project deletion
    await this.createActivity({
      type: "project",
      description: `Project deleted - ${project.name}`,
      projectId: null as any
    });
    
    return this.projects.delete(id);
  }

  // Domain methods
  async getDomains(): Promise<Domain[]> {
    return Array.from(this.domains.values());
  }

  async getDomain(id: number): Promise<Domain | undefined> {
    return this.domains.get(id);
  }

  async getDomainByName(name: string): Promise<Domain | undefined> {
    return Array.from(this.domains.values()).find(
      (domain) => domain.name === name
    );
  }

  async createDomain(insertDomain: InsertDomain): Promise<Domain> {
    const id = this.domainCurrentId++;
    const now = new Date();
    
    const domain: Domain = {
      ...insertDomain,
      id,
      status: "pending",
      createdAt: now
    };
    
    this.domains.set(id, domain);
    
    // Create activity for domain creation
    await this.createActivity({
      type: "domain",
      description: `Domain created - ${domain.name}`,
      projectId: domain.projectId
    });
    
    return domain;
  }

  async updateDomain(id: number, updateData: Partial<Domain>): Promise<Domain | undefined> {
    const domain = this.domains.get(id);
    
    if (!domain) return undefined;
    
    const updatedDomain = {
      ...domain,
      ...updateData
    };
    
    this.domains.set(id, updatedDomain);
    
    return updatedDomain;
  }

  async deleteDomain(id: number): Promise<boolean> {
    const domain = this.domains.get(id);
    
    if (!domain) return false;
    
    // Create activity for domain deletion
    await this.createActivity({
      type: "domain",
      description: `Domain deleted - ${domain.name}`,
      projectId: domain.projectId
    });
    
    return this.domains.delete(id);
  }

  // Database methods
  async getDatabases(): Promise<Database[]> {
    return Array.from(this.databases.values());
  }

  async getDatabase(id: number): Promise<Database | undefined> {
    return this.databases.get(id);
  }

  async getDatabaseByName(name: string): Promise<Database | undefined> {
    return Array.from(this.databases.values()).find(
      (db) => db.name === name
    );
  }

  async createDatabase(insertDatabase: InsertDatabase): Promise<Database> {
    const id = this.databaseCurrentId++;
    const now = new Date();
    
    const database: Database = {
      ...insertDatabase,
      id,
      createdAt: now
    };
    
    this.databases.set(id, database);
    
    // Create activity for database creation
    await this.createActivity({
      type: "database",
      description: `Database created - ${database.name}`,
      projectId: database.projectId
    });
    
    return database;
  }

  async deleteDatabase(id: number): Promise<boolean> {
    const database = this.databases.get(id);
    
    if (!database) return false;
    
    // Create activity for database deletion
    await this.createActivity({
      type: "database",
      description: `Database deleted - ${database.name}`,
      projectId: database.projectId
    });
    
    return this.databases.delete(id);
  }

  // Activity methods
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getProjectActivities(projectId: number, limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const now = new Date();
    
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: now
    };
    
    this.activities.set(id, activity);
    
    return activity;
  }

  // System metrics methods
  async getLatestSystemMetrics(): Promise<SystemMetric | undefined> {
    return Array.from(this.systemMetrics.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .shift();
  }

  async createSystemMetrics(insertMetrics: InsertSystemMetric): Promise<SystemMetric> {
    const id = this.systemMetricCurrentId++;
    const now = new Date();
    
    const metrics: SystemMetric = {
      ...insertMetrics,
      id,
      timestamp: now
    };
    
    this.systemMetrics.set(id, metrics);
    
    return metrics;
  }
}

// Create a DatabaseStorage implementation to replace MemStorage
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: number, updateData: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return result.length > 0;
  }

  async getDomains(): Promise<Domain[]> {
    return await db.select().from(domains);
  }

  async getDomain(id: number): Promise<Domain | undefined> {
    const [domain] = await db.select().from(domains).where(eq(domains.id, id));
    return domain || undefined;
  }

  async getDomainByName(name: string): Promise<Domain | undefined> {
    const [domain] = await db.select().from(domains).where(eq(domains.name, name));
    return domain || undefined;
  }

  async createDomain(insertDomain: InsertDomain): Promise<Domain> {
    const [domain] = await db
      .insert(domains)
      .values(insertDomain)
      .returning();
    return domain;
  }

  async updateDomain(id: number, updateData: Partial<Domain>): Promise<Domain | undefined> {
    const [domain] = await db
      .update(domains)
      .set(updateData)
      .where(eq(domains.id, id))
      .returning();
    return domain || undefined;
  }

  async deleteDomain(id: number): Promise<boolean> {
    const result = await db
      .delete(domains)
      .where(eq(domains.id, id))
      .returning();
    return result.length > 0;
  }

  async getDatabases(): Promise<Database[]> {
    return await db.select().from(databases);
  }

  async getDatabase(id: number): Promise<Database | undefined> {
    const [database] = await db.select().from(databases).where(eq(databases.id, id));
    return database || undefined;
  }

  async getDatabaseByName(name: string): Promise<Database | undefined> {
    const [database] = await db.select().from(databases).where(eq(databases.name, name));
    return database || undefined;
  }

  async createDatabase(insertDatabase: InsertDatabase): Promise<Database> {
    const [database] = await db
      .insert(databases)
      .values(insertDatabase)
      .returning();
    return database;
  }

  async deleteDatabase(id: number): Promise<boolean> {
    const result = await db
      .delete(databases)
      .where(eq(databases.id, id))
      .returning();
    return result.length > 0;
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async getProjectActivities(projectId: number, limit: number = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.projectId, projectId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getLatestSystemMetrics(): Promise<SystemMetric | undefined> {
    const [metric] = await db
      .select()
      .from(systemMetrics)
      .orderBy(desc(systemMetrics.timestamp))
      .limit(1);
    return metric || undefined;
  }

  async createSystemMetrics(insertMetrics: InsertSystemMetric): Promise<SystemMetric> {
    const [metric] = await db
      .insert(systemMetrics)
      .values(insertMetrics)
      .returning();
    return metric;
  }
}

export const storage = new DatabaseStorage();
