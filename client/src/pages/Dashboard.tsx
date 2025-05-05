import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { ResourceUsage } from "@/components/ui/ResourceUsage";
import { NewProjectModal } from "@/components/modals/NewProjectModal";
import { InstallationModal } from "@/components/modals/InstallationModal";
import { apiRequest } from "@/lib/queryClient";
import { Project, Activity, SystemMetric, Database } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [installationModalOpen, setInstallationModalOpen] = useState(false);
  
  // Check if this is first visit to show installation modal
  useEffect(() => {
    const installationCompleted = localStorage.getItem("installationCompleted");
    if (!installationCompleted) {
      // Short delay before showing the modal
      const timer = setTimeout(() => {
        setInstallationModalOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Fetch projects
  const { 
    data: projects = [], 
    isLoading: projectsLoading 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'],
  });
  
  // Fetch activities
  const {
    data: activities = [],
    isLoading: activitiesLoading
  } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });
  
  // Fetch system metrics
  const {
    data: metrics,
    isLoading: metricsLoading
  } = useQuery<SystemMetric>({
    queryKey: ['/api/system-metrics'],
  });
  
  // Fetch databases
  const {
    data: databases = [],
    isLoading: databasesLoading
  } = useQuery<Database[]>({
    queryKey: ['/api/databases'],
  });
  
  // Function to restart a project
  const handleRestartProject = async (id: number) => {
    try {
      await apiRequest("PATCH", `/api/projects/${id}`, { status: "building" });
      
      // Create activity for restart
      await apiRequest("POST", "/api/activities", {
        type: "deployment",
        description: "Deployment restarted",
        projectId: id
      });
      
      // Simulate build completion after 3 seconds
      setTimeout(async () => {
        await apiRequest("PATCH", `/api/projects/${id}`, { status: "live" });
        
        // Create activity for successful deployment
        await apiRequest("POST", "/api/activities", {
          type: "deployment",
          description: "Deployment completed",
          projectId: id
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
        queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
        
        toast({
          title: "Deployment Successful",
          description: "The project has been redeployed successfully."
        });
      }, 3000);
      
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
      toast({
        title: "Building",
        description: "Project build started. This may take a few minutes."
      });
    } catch (error) {
      console.error("Error restarting project:", error);
      toast({
        title: "Error",
        description: "Failed to restart project. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Function to delete a project
  const handleDeleteProject = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/projects/${id}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
      queryClient.invalidateQueries({ queryKey: ['/api/databases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate stats
  const liveProjects = projects.filter(p => p.status === "live").length;
  const buildingProjects = projects.filter(p => p.status === "building").length;
  
  return (
    <div className="min-h-screen flex bg-[#111111] text-white">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Manage your projects, domains, and databases</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setNewProjectModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-[#0070f3] text-white text-sm font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0070f3] focus:ring-offset-[#111111]"
              >
                <i className="ri-add-line mr-2"></i>
                New Project
              </button>
              <Link 
                href="/docs/cli-reference" 
                className="inline-flex items-center px-3 py-2 border border-gray-700 text-sm text-gray-400 rounded-md hover:border-gray-500"
              >
                <i className="ri-terminal-line mr-2"></i>
                CLI Docs
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Projects"
              value={projects.length}
              icon="code-box-line"
              iconColor="text-[#0070f3]"
              iconBgColor="bg-blue-500 bg-opacity-20"
              trend={{
                value: `${projects.length} total`,
                positive: projects.length > 0
              }}
            />
            
            <StatCard
              title="Domains"
              value={projects.filter(p => p.domain).length}
              icon="global-line"
              iconColor="text-[#6366f1]"
              iconBgColor="bg-indigo-500 bg-opacity-20"
              trend={{
                value: projects.filter(p => p.domain).length > 0 ? 
                  "All domains active" : 
                  "No domains configured",
                positive: projects.filter(p => p.domain).length > 0
              }}
            />
            
            <StatCard
              title="Databases"
              value={databases.length.toString()}
              icon="database-2-line"
              iconColor="text-[#10b981]"
              iconBgColor="bg-green-500 bg-opacity-20"
              trend={{
                value: databases.length > 0 
                  ? `${databases.map(db => db.type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}` 
                  : "No databases",
                positive: databases.length > 0
              }}
            />
            
            <StatCard
              title="Server Status"
              value="Good"
              icon="server-line"
              iconColor="text-[#f59e0b]"
              iconBgColor="bg-yellow-500 bg-opacity-20"
              trend={{
                value: metrics ? `CPU: ${metrics.cpuUsage}% | RAM: ${metrics.memoryUsage}% | Disk: ${metrics.diskUsage}%` : "Loading...",
                positive: true
              }}
            />
          </div>

          {/* Recent Projects Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Link href="/projects" className="text-[#0070f3] text-sm">
                View all projects
              </Link>
            </div>

            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-[#1e1e1e] rounded-lg border border-gray-800 h-[260px]"></div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    onRestart={handleRestartProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 p-10 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-code-box-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                <p className="text-gray-400 mb-6">Start by creating your first project</p>
                <button 
                  onClick={() => setNewProjectModalOpen(true)}
                  className="px-4 py-2 bg-[#0070f3] text-white text-sm font-medium rounded-md hover:bg-opacity-90"
                >
                  <i className="ri-add-line mr-2"></i>
                  New Project
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity & Resource Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 bg-[#1e1e1e] rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              
              <ActivityFeed 
                activities={activities} 
                loading={activitiesLoading} 
              />
            </div>

            {/* Resource Usage */}
            <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Resource Usage</h2>
              </div>
              
              <ResourceUsage 
                metrics={metrics} 
                loading={metricsLoading} 
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <NewProjectModal 
        open={newProjectModalOpen} 
        onOpenChange={setNewProjectModalOpen} 
      />
      
      <InstallationModal 
        open={installationModalOpen} 
        onOpenChange={setInstallationModalOpen} 
      />
    </div>
  );
}
