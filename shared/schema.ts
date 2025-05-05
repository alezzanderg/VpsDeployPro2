import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  framework: text("framework").notNull(),
  repositoryUrl: text("repository_url").notNull(),
  branch: text("branch").notNull(),
  domain: text("domain"),
  status: text("status").notNull().default("idle"), // idle, building, live, error
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  framework: true,
  repositoryUrl: true,
  branch: true,
  domain: true,
});

// Domain schema
export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  projectId: integer("project_id").references(() => projects.id),
  status: text("status").notNull().default("pending"), // pending, active, error
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDomainSchema = createInsertSchema(domains).pick({
  name: true,
  projectId: true,
});

// Database schema
export const databases = pgTable("databases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // postgres, mysql
  projectId: integer("project_id").references(() => projects.id),
  connectionString: text("connection_string").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDatabaseSchema = createInsertSchema(databases).pick({
  name: true,
  type: true,
  projectId: true,
  connectionString: true,
});

// Activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // deployment, build, database, domain
  description: text("description").notNull(),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  description: true,
  projectId: true,
});

// System Metrics schema
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  cpuUsage: integer("cpu_usage").notNull(),
  memoryUsage: integer("memory_usage").notNull(),
  diskUsage: integer("disk_usage").notNull(),
  networkUsage: integer("network_usage").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSystemMetricsSchema = createInsertSchema(systemMetrics).pick({
  cpuUsage: true,
  memoryUsage: true,
  diskUsage: true,
  networkUsage: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Domain = typeof domains.$inferSelect;
export type InsertDomain = z.infer<typeof insertDomainSchema>;

export type Database = typeof databases.$inferSelect;
export type InsertDatabase = z.infer<typeof insertDatabaseSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = z.infer<typeof insertSystemMetricsSchema>;
