export interface Project {
  id: number;
  name: string;
  framework: string;
  repositoryUrl: string;
  branch: string;
  domain?: string;
  status: "idle" | "building" | "live" | "error";
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: number;
  name: string;
  projectId?: number;
  status: "pending" | "active" | "error";
  createdAt: string;
}

export interface Database {
  id: number;
  name: string;
  type: string;
  projectId?: number;
  connectionString: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  projectId?: number;
  createdAt: string;
}

export interface SystemMetric {
  id: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  timestamp: string;
}

export type Framework = 
  | "React" 
  | "Vue.js" 
  | "Angular" 
  | "Next.js" 
  | "Express.js" 
  | "Django" 
  | "Laravel" 
  | "Static HTML/CSS/JS";

export interface NewProjectFormData {
  name: string;
  framework: Framework;
  repositoryUrl: string;
  branch: string;
  domain?: string;
  createDatabase?: boolean;
}
