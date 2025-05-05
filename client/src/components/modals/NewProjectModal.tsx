import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Framework } from "@/lib/types";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    framework: "" as Framework | "",
    repositoryUrl: "",
    branch: "main",
    domain: "",
    createDatabase: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, createDatabase: !prev.createDatabase }));
  };

  const handleFrameworkChange = (value: Framework) => {
    setFormData((prev) => ({ ...prev, framework: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.framework || !formData.repositoryUrl) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create project
      const project = await apiRequest("POST", "/api/projects", {
        name: formData.name,
        framework: formData.framework,
        repositoryUrl: formData.repositoryUrl,
        branch: formData.branch,
        domain: formData.domain || undefined
      }).then(res => res.json());
      
      // If domain is specified, create domain
      if (formData.domain) {
        await apiRequest("POST", "/api/domains", {
          name: formData.domain,
          projectId: project.id
        });
      }
      
      // If create database is checked, create database
      if (formData.createDatabase) {
        await apiRequest("POST", "/api/databases", {
          name: `${formData.name.toLowerCase().replace(/\s+/g, '_')}_db`,
          type: "PostgreSQL",
          projectId: project.id,
          connectionString: `postgres://user:password@localhost:5432/${formData.name.toLowerCase().replace(/\s+/g, '_')}_db`
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
      queryClient.invalidateQueries({ queryKey: ['/api/databases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      // Reset form and close modal
      setFormData({
        name: "",
        framework: "",
        repositoryUrl: "",
        branch: "main",
        domain: "",
        createDatabase: false
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] text-white border-gray-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Awesome Project"
                className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectFramework">Framework</Label>
              <Select value={formData.framework} onValueChange={handleFrameworkChange}>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="Vue.js">Vue.js</SelectItem>
                  <SelectItem value="Angular">Angular</SelectItem>
                  <SelectItem value="Next.js">Next.js</SelectItem>
                  <SelectItem value="Express.js">Express.js</SelectItem>
                  <SelectItem value="Django">Django</SelectItem>
                  <SelectItem value="Laravel">Laravel</SelectItem>
                  <SelectItem value="Static HTML/CSS/JS">Static HTML/CSS/JS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectRepo">GitHub Repository URL</Label>
              <Input
                id="projectRepo"
                name="repositoryUrl"
                value={formData.repositoryUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
                className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectBranch">Branch</Label>
              <Input
                id="projectBranch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDomain">Custom Domain (optional)</Label>
              <Input
                id="projectDomain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="myproject.example.com"
                className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="projectDb" 
                checked={formData.createDatabase}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-[#0070f3] data-[state=checked]:border-[#0070f3]"
              />
              <Label htmlFor="projectDb" className="text-sm">Create database for this project</Label>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#0070f3] hover:bg-opacity-90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
