import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { Activity, Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function Logs() {
  const { toast } = useToast();
  const [location] = useLocation();
  
  // Extract query parameters
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const projectIdParam = searchParams.get('projectId');
  
  // State
  const [selectedProject, setSelectedProject] = useState<string>(projectIdParam || 'all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('7days');
  
  // Fetch activities
  const { 
    data: activities = [], 
    isLoading: activitiesLoading,
    refetch: refetchActivities
  } = useQuery<Activity[]>({ 
    queryKey: ['/api/activities'],
  });
  
  // Fetch projects for filtering
  const { 
    data: projects = [], 
    isLoading: projectsLoading 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'],
  });
  
  // Update selected project when projectIdParam changes
  useEffect(() => {
    if (projectIdParam) {
      setSelectedProject(projectIdParam);
    }
  }, [projectIdParam]);

  // Handle refresh
  const handleRefresh = () => {
    refetchActivities();
    toast({
      title: "Refreshed",
      description: "Activity logs have been refreshed",
    });
  };

  // Filter activities based on selected filters
  const filteredActivities = activities.filter(activity => {
    // Project filter
    const matchesProject = selectedProject === 'all' || 
      (activity.projectId?.toString() === selectedProject);
    
    // Type filter
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    
    // Search filter
    const matchesSearch = !searchQuery || 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Time range filter
    let matchesTimeRange = true;
    if (timeRange !== 'all') {
      const activityDate = new Date(activity.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case 'today':
          matchesTimeRange = daysDiff < 1;
          break;
        case '7days':
          matchesTimeRange = daysDiff < 7;
          break;
        case '30days':
          matchesTimeRange = daysDiff < 30;
          break;
      }
    }
    
    return matchesProject && matchesType && matchesSearch && matchesTimeRange;
  });

  // Get project name by ID
  const getProjectName = (projectId?: number) => {
    if (!projectId) return "System";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Get activity icon and color based on type
  const getActivityStyles = (type: string) => {
    switch (type) {
      case 'deployment':
        return {
          icon: 'git-commit-line',
          bg: 'bg-[#0070f3] bg-opacity-20',
          color: 'text-[#0070f3]'
        };
      case 'build':
        return {
          icon: 'building-line',
          bg: 'bg-yellow-500 bg-opacity-20',
          color: 'text-yellow-500'
        };
      case 'database':
        return {
          icon: 'database-2-line',
          bg: 'bg-purple-500 bg-opacity-20',
          color: 'text-purple-500'
        };
      case 'domain':
        return {
          icon: 'global-line',
          bg: 'bg-green-500 bg-opacity-20',
          color: 'text-green-500'
        };
      case 'project':
        return {
          icon: 'folder-line',
          bg: 'bg-blue-500 bg-opacity-20',
          color: 'text-blue-500'
        };
      default:
        return {
          icon: 'information-line',
          bg: 'bg-gray-500 bg-opacity-20',
          color: 'text-gray-500'
        };
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
              <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
              <p className="text-gray-400">Track activity across your projects and systems</p>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <i className="ri-refresh-line mr-2"></i>
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Project Filter */}
            <div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-[#1e1e1e] border-gray-800">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-gray-800">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Activity Type Filter */}
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-[#1e1e1e] border-gray-800">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-gray-800">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                  <SelectItem value="build">Build</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Time Range Filter */}
            <div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="bg-[#1e1e1e] border-gray-800">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-gray-800">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search */}
            <div>
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1e1e1e] border-gray-800 focus:border-[#0070f3]"
                prefix={<i className="ri-search-line text-gray-400 mr-2"></i>}
              />
            </div>
          </div>

          {/* Activity Logs Table */}
          {activitiesLoading || projectsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-[#1e1e1e] rounded-md w-full"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-[#1e1e1e] rounded-md w-full"></div>
              ))}
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Description</TableHead>
                    <TableHead className="text-gray-400">Project</TableHead>
                    <TableHead className="text-gray-400">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => {
                    const { icon, bg, color } = getActivityStyles(activity.type);
                    return (
                      <TableRow key={activity.id} className="border-gray-800">
                        <TableCell>
                          <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                            <i className={`ri-${icon} ${color}`}></i>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {activity.description}
                        </TableCell>
                        <TableCell>{getProjectName(activity.projectId)}</TableCell>
                        <TableCell>
                          <span title={formatDate(activity.createdAt)}>
                            {formatDate(activity.createdAt)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 p-10 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-file-list-3-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">No activity logs found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedProject !== 'all' || selectedType !== 'all' || timeRange !== 'all'
                  ? "Try adjusting your search filters"
                  : "Activity logs will appear here when you perform actions"
                }
              </p>
              {(searchQuery || selectedProject !== 'all' || selectedType !== 'all' || timeRange !== 'all') && (
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProject('all');
                    setSelectedType('all');
                    setTimeRange('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Logging Info */}
          <div className="mt-8 bg-[#1e1e1e] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Logging Guide</h2>
            <p className="text-gray-400 mb-4">
              DeployHub automatically logs activities for deployments, builds, database operations, and domain configuration.
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full bg-[#0070f3] bg-opacity-20 flex items-center justify-center">
                    <i className="ri-terminal-line text-[#0070f3]"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">CLI Logging</h3>
                  <p className="text-xs text-gray-400">
                    You can use the CLI to create custom logs for your projects:
                  </p>
                  <pre className="bg-black p-2 rounded text-xs font-mono text-white mt-2 overflow-x-auto">
                    deployhub-cli log create --project "api-service" --message "Database migration completed"
                  </pre>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
                    <i className="ri-file-list-3-line text-purple-500"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Log Retention</h3>
                  <p className="text-xs text-gray-400">
                    Logs are retained for 30 days by default. You can configure longer retention in the settings.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-400">
              <i className="ri-information-line text-[#0070f3] mr-1"></i>
              For detailed application logs and metrics, connect DeployHub to an external monitoring service.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
