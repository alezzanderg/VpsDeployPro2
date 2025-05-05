import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { NewProjectModal } from "@/components/modals/NewProjectModal";
import { apiRequest } from "@/lib/queryClient";
import { Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Projects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [frameworkFilter, setFrameworkFilter] = useState("all");
  
  // Fetch projects
  const { 
    data: projects = [], 
    isLoading 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'],
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

  // Filter projects
  const filteredProjects = projects.filter(project => {
    // Search query filter
    const matchesSearch = searchQuery === "" || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.framework.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.domain && project.domain.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    // Framework filter
    const matchesFramework = frameworkFilter === "all" || project.framework.toLowerCase().includes(frameworkFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesFramework;
  });

  // Extract unique frameworks for filter
  const uniqueFrameworks = [...new Set(projects.map(p => p.framework))];
  
  return (
    <div className="min-h-screen flex bg-[#111111] text-white">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-gray-400">Manage and deploy your applications</p>
            </div>
            <button 
              onClick={() => setNewProjectModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-[#0070f3] text-white text-sm font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0070f3] focus:ring-offset-[#111111]"
            >
              <i className="ri-add-line mr-2"></i>
              New Project
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1e1e1e] border-gray-800 focus:border-[#0070f3]"
                prefix={<i className="ri-search-line text-gray-400 mr-2"></i>}
              />
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-[#1e1e1e] border-gray-800">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-gray-800">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="building">Building</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                <SelectTrigger className="bg-[#1e1e1e] border-gray-800">
                  <SelectValue placeholder="Filter by framework" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-gray-800">
                  <SelectItem value="all">All frameworks</SelectItem>
                  {uniqueFrameworks.map(framework => (
                    <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Projects List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-[#1e1e1e] rounded-lg border border-gray-800 h-[260px]"></div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
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
              {searchQuery || statusFilter !== "all" || frameworkFilter !== "all" ? (
                <>
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-search-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No matching projects</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Modals */}
      <NewProjectModal 
        open={newProjectModalOpen} 
        onOpenChange={setNewProjectModalOpen} 
      />
    </div>
  );
}
