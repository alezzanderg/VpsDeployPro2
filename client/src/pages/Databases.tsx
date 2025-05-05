import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { apiRequest } from "@/lib/queryClient";
import { Database, Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Databases() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [newDatabaseModalOpen, setNewDatabaseModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "PostgreSQL",
    projectId: "",
    connectionString: ""
  });
  
  // Fetch databases
  const { 
    data: databases = [], 
    isLoading: databasesLoading 
  } = useQuery<Database[]>({ 
    queryKey: ['/api/databases'],
  });
  
  // Fetch projects for database assignment
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
    
    // Update the connection string based on selected project and database type
    if (value) {
      const project = projects.find(p => p.id.toString() === value);
      if (project) {
        const dbName = project.name.toLowerCase().replace(/\s+/g, '_') + '_db';
        const connectionString = formData.type === "PostgreSQL" 
          ? `postgres://user:password@localhost:5432/${dbName}`
          : `mysql://user:password@localhost:3306/${dbName}`;
        
        setFormData(prev => ({
          ...prev,
          name: dbName,
          connectionString
        }));
      }
    }
  };

  // Handle database type selection
  const handleTypeChange = (value: string) => {
    setFormData((prev) => {
      // Update connection string based on the new type
      let connectionString = prev.connectionString;
      if (connectionString) {
        const dbName = prev.name || 'database';
        connectionString = value === "PostgreSQL" 
          ? `postgres://user:password@localhost:5432/${dbName}`
          : `mysql://user:password@localhost:3306/${dbName}`;
      }
      
      return {
        ...prev,
        type: value,
        connectionString
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.connectionString) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create database
      await apiRequest("POST", "/api/databases", {
        name: formData.name,
        type: formData.type,
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        connectionString: formData.connectionString
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/databases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Success",
        description: "Database created successfully",
      });
      
      // Reset form and close modal
      setFormData({
        name: "",
        type: "PostgreSQL",
        projectId: "",
        connectionString: ""
      });
      
      setNewDatabaseModalOpen(false);
    } catch (error) {
      console.error("Error creating database:", error);
      toast({
        title: "Error",
        description: "Failed to create database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle database deletion (open confirmation dialog)
  const openDeleteDialog = (id: number) => {
    setSelectedDatabaseId(id);
    setDeleteDialogOpen(true);
  };

  // Handle database deletion (confirmed)
  const handleDeleteDatabase = async () => {
    if (!selectedDatabaseId) return;
    
    try {
      await apiRequest("DELETE", `/api/databases/${selectedDatabaseId}`);
      
      queryClient.invalidateQueries({ queryKey: ['/api/databases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Database Deleted",
        description: "The database has been deleted successfully."
      });
      
      setDeleteDialogOpen(false);
      setSelectedDatabaseId(null);
    } catch (error) {
      console.error("Error deleting database:", error);
      toast({
        title: "Error",
        description: "Failed to delete database. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter databases based on search query
  const filteredDatabases = databases.filter(database => 
    database.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    database.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get project name by ID
  const getProjectName = (projectId?: number) => {
    if (!projectId) return "None";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown";
  };

  // Get database icon based on type
  const getDatabaseIcon = (type: string) => {
    return type.toLowerCase().includes("postgres") 
      ? "ri-database-2-line text-blue-400" 
      : "ri-database-2-line text-orange-400";
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
              <h1 className="text-2xl font-bold text-white">Databases</h1>
              <p className="text-gray-400">Manage databases for your projects</p>
            </div>
            <button 
              onClick={() => setNewDatabaseModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-[#0070f3] text-white text-sm font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0070f3] focus:ring-offset-[#111111]"
            >
              <i className="ri-add-line mr-2"></i>
              Create Database
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="max-w-md">
              <Input
                placeholder="Search databases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1e1e1e] border-gray-800 focus:border-[#0070f3]"
                prefix={<i className="ri-search-line text-gray-400 mr-2"></i>}
              />
            </div>
          </div>

          {/* Databases Grid */}
          {databasesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-[#1e1e1e] rounded-lg border border-gray-800 h-[200px]"></div>
              ))}
            </div>
          ) : filteredDatabases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatabases.map((database) => {
                const createdDate = new Date(database.createdAt).toLocaleDateString();
                
                return (
                  <Card key={database.id} className="bg-[#1e1e1e] border-gray-800">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mr-3">
                            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                              <i className={getDatabaseIcon(database.type)}></i>
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-white">{database.name}</CardTitle>
                            <CardDescription className="text-gray-400">{database.type}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">Project</p>
                          <p className="text-sm font-medium">{getProjectName(database.projectId)}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400">Created</p>
                          <p className="text-sm font-medium">{createdDate}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400">Connection String</p>
                          <div className="flex items-center justify-between bg-gray-900 rounded p-2 mt-1">
                            <code className="text-xs text-gray-300 truncate w-64">
                              {database.connectionString}
                            </code>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(database.connectionString);
                                toast({
                                  title: "Copied",
                                  description: "Connection string copied to clipboard"
                                });
                              }}
                              className="text-gray-400 hover:text-white ml-2"
                            >
                              <i className="ri-clipboard-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-800 pt-3">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="ml-auto bg-red-900 hover:bg-red-800 text-white"
                        onClick={() => openDeleteDialog(database.id)}
                      >
                        <i className="ri-delete-bin-line mr-1"></i> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 p-10 text-center">
              {searchQuery ? (
                <>
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-search-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No matching databases</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-database-2-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No databases yet</h3>
                  <p className="text-gray-400 mb-6">Create a database for your projects</p>
                  <button 
                    onClick={() => setNewDatabaseModalOpen(true)}
                    className="px-4 py-2 bg-[#0070f3] text-white text-sm font-medium rounded-md hover:bg-opacity-90"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Create Database
                  </button>
                </>
              )}
            </div>
          )}

          {/* Database Usage Guide */}
          <div className="mt-8 bg-[#1e1e1e] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Database Usage</h2>
            <p className="text-gray-400 mb-4">
              Use the connection strings provided to connect your applications to the databases.
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <i className="ri-information-line text-[#0070f3] mr-2"></i>
                  PostgreSQL Example
                </h3>
                <pre className="bg-black p-3 rounded text-sm font-mono text-white overflow-x-auto whitespace-pre-wrap">
{`// Node.js with pg package
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://user:password@localhost:5432/database'
});
`}
                </pre>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <i className="ri-information-line text-[#0070f3] mr-2"></i>
                  MySQL Example
                </h3>
                <pre className="bg-black p-3 rounded text-sm font-mono text-white overflow-x-auto whitespace-pre-wrap">
{`// Node.js with mysql2 package
const mysql = require('mysql2');
const connection = mysql.createConnection('mysql://user:password@localhost:3306/database');
`}
                </pre>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-400">
              <i className="ri-alert-line text-yellow-400 mr-1"></i>
              Never hardcode database credentials in your application. Use environment variables instead.
            </p>
          </div>
        </div>
      </main>
      
      {/* New Database Modal */}
      <Dialog open={newDatabaseModalOpen} onOpenChange={setNewDatabaseModalOpen}>
        <DialogContent className="bg-[#1e1e1e] text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Database</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="databaseType">Database Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                    <SelectItem value="MySQL">MySQL</SelectItem>
                  </SelectContent>
                </Select>
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
              
              <div className="space-y-2">
                <Label htmlFor="databaseName">Database Name</Label>
                <Input
                  id="databaseName"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="my_database"
                  className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="connectionString">Connection String</Label>
                <Input
                  id="connectionString"
                  name="connectionString"
                  value={formData.connectionString}
                  onChange={handleInputChange}
                  placeholder={`${formData.type === "PostgreSQL" ? "postgres" : "mysql"}://user:password@localhost:5432/my_database`}
                  className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                />
              </div>
              
              <div className="bg-gray-900 rounded-md p-3 border border-gray-800">
                <p className="text-xs text-gray-400">
                  <i className="ri-information-line text-[#0070f3] mr-1"></i>
                  The database will be provisioned with the specified configuration.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewDatabaseModalOpen(false)}
                className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#0070f3] hover:bg-opacity-90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Database"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1e1e1e] text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete the database and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDatabase}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
