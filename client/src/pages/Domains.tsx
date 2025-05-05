import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { apiRequest } from "@/lib/queryClient";
import { Domain, Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Domains() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [newDomainModalOpen, setNewDomainModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    projectId: ""
  });
  
  // Fetch domains
  const { 
    data: domains = [], 
    isLoading: domainsLoading 
  } = useQuery<Domain[]>({ 
    queryKey: ['/api/domains'],
  });
  
  // Fetch projects for domain assignment
  const { 
    data: projects = [], 
    isLoading: projectsLoading 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'],
  });

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle project selection
  const handleProjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, projectId: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create domain
      await apiRequest("POST", "/api/domains", {
        name: formData.name,
        projectId: formData.projectId ? parseInt(formData.projectId) : null
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Success",
        description: "Domain added successfully",
      });
      
      // Reset form and close modal
      setFormData({
        name: "",
        projectId: ""
      });
      
      setNewDomainModalOpen(false);
    } catch (error) {
      console.error("Error adding domain:", error);
      toast({
        title: "Error",
        description: "Failed to add domain. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle domain deletion
  const handleDeleteDomain = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/domains/${id}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Domain Deleted",
        description: "The domain has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting domain:", error);
      toast({
        title: "Error",
        description: "Failed to delete domain. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle domain status update
  const handleUpdateDomainStatus = async (id: number, status: string) => {
    try {
      await apiRequest("PATCH", `/api/domains/${id}`, { status });
      
      queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
      
      toast({
        title: "Status Updated",
        description: `Domain status changed to ${status}.`
      });
    } catch (error) {
      console.error("Error updating domain status:", error);
      toast({
        title: "Error",
        description: "Failed to update domain status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter domains based on search query
  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get project name by ID
  const getProjectName = (projectId?: number) => {
    if (!projectId) return "None";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown";
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-500 bg-opacity-20 text-green-400";
      case 'pending':
        return "bg-yellow-500 bg-opacity-20 text-yellow-400";
      case 'error':
        return "bg-red-500 bg-opacity-20 text-red-400";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex bg-[#111111] text-white">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">Domains</h1>
              <p className="text-gray-400">Manage custom domains for your projects</p>
            </div>
            <button 
              onClick={() => setNewDomainModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-[#0070f3] text-white text-sm font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0070f3] focus:ring-offset-[#111111]"
            >
              <i className="ri-add-line mr-2"></i>
              Add Domain
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="max-w-md">
              <Input
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1e1e1e] border-gray-800 focus:border-[#0070f3]"
                prefix={<i className="ri-search-line text-gray-400 mr-2"></i>}
              />
            </div>
          </div>

          {/* Domains Table */}
          {domainsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-[#1e1e1e] rounded-md w-full"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-[#1e1e1e] rounded-md w-full"></div>
              ))}
            </div>
          ) : filteredDomains.length > 0 ? (
            <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">Domain</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Project</TableHead>
                    <TableHead className="text-gray-400">Created</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDomains.map((domain) => {
                    const createdDate = new Date(domain.createdAt).toLocaleDateString();
                    return (
                      <TableRow key={domain.id} className="border-gray-800">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <i className="ri-global-line text-[#0070f3] mr-2"></i>
                            {domain.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getStatusColor(domain.status)}`}>
                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 bg-current`}></span>
                            {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{getProjectName(domain.projectId)}</TableCell>
                        <TableCell>{createdDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <i className="ri-more-2-fill"></i>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                              {domain.status !== 'active' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateDomainStatus(domain.id, 'active')}
                                  className="text-green-400"
                                >
                                  <i className="ri-check-line mr-2"></i> Mark as Active
                                </DropdownMenuItem>
                              )}
                              {domain.status !== 'pending' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateDomainStatus(domain.id, 'pending')}
                                  className="text-yellow-400"
                                >
                                  <i className="ri-time-line mr-2"></i> Mark as Pending
                                </DropdownMenuItem>
                              )}
                              {domain.status !== 'error' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateDomainStatus(domain.id, 'error')}
                                  className="text-red-400"
                                >
                                  <i className="ri-error-warning-line mr-2"></i> Mark as Error
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDeleteDomain(domain.id)}
                                className="text-red-400"
                              >
                                <i className="ri-delete-bin-line mr-2"></i> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 p-10 text-center">
              {searchQuery ? (
                <>
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-search-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No matching domains</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-global-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No domains yet</h3>
                  <p className="text-gray-400 mb-6">Add a custom domain for your projects</p>
                  <button 
                    onClick={() => setNewDomainModalOpen(true)}
                    className="px-4 py-2 bg-[#0070f3] text-white text-sm font-medium rounded-md hover:bg-opacity-90"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Domain
                  </button>
                </>
              )}
            </div>
          )}

          {/* DNS Configuration Guide */}
          <div className="mt-8 bg-[#1e1e1e] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">DNS Configuration</h2>
            <p className="text-gray-400 mb-4">
              To point your domain to DeployHub, add the following DNS records to your domain provider:
            </p>
            
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800">
              <h3 className="text-sm font-medium mb-2">Type A (for root domain)</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Host</p>
                  <p className="font-mono">@</p>
                </div>
                <div>
                  <p className="text-gray-400">Value</p>
                  <p className="font-mono">YOUR_SERVER_IP</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm font-medium mb-2">Type CNAME (for subdomains)</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Host</p>
                  <p className="font-mono">www</p>
                </div>
                <div>
                  <p className="text-gray-400">Value</p>
                  <p className="font-mono">@</p>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-400">
              <i className="ri-information-line text-[#0070f3] mr-1"></i>
              DNS changes can take up to 48 hours to propagate globally.
            </p>
          </div>
        </div>
      </main>
      
      {/* New Domain Modal */}
      <Dialog open={newDomainModalOpen} onOpenChange={setNewDomainModalOpen}>
        <DialogContent className="bg-[#1e1e1e] text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Domain</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="domainName">Domain Name</Label>
                <Input
                  id="domainName"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="example.com"
                  className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectId">Assign to Project (Optional)</Label>
                <Select value={formData.projectId} onValueChange={handleProjectChange}>
                  <SelectTrigger className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="">None</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-gray-900 rounded-md p-3 border border-gray-800">
                <p className="text-xs text-gray-400">
                  <i className="ri-information-line text-[#0070f3] mr-1"></i>
                  Remember to configure your DNS records after adding the domain.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewDomainModalOpen(false)}
                className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#0070f3] hover:bg-opacity-90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Domain"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
