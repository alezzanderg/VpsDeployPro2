import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  onRestart?: (id: number) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

export function ProjectCard({ project, onRestart, onDelete, className }: ProjectCardProps) {
  // Helper function to determine framework icon
  const getFrameworkIcon = (framework: string): string => {
    const frameworkLower = framework.toLowerCase();
    if (frameworkLower.includes('react')) return 'reactjs-line text-blue-400';
    if (frameworkLower.includes('vue')) return 'vuejs-line text-green-400';
    if (frameworkLower.includes('angular')) return 'angularjs-line text-red-400';
    if (frameworkLower.includes('express') || frameworkLower.includes('node')) return 'server-line text-purple-400';
    if (frameworkLower.includes('next')) return 'nextjs-line text-gray-200';
    if (frameworkLower.includes('django')) return 'python-line text-green-500';
    if (frameworkLower.includes('laravel') || frameworkLower.includes('php')) return 'code-s-slash-line text-pink-500';
    return 'code-box-line text-blue-400';
  };

  // Function to format relative time
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  };

  // Determine status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'live':
        return {
          bg: 'bg-green-500 bg-opacity-20',
          text: 'text-green-400',
          dot: 'bg-green-500'
        };
      case 'building':
        return {
          bg: 'bg-yellow-500 bg-opacity-20',
          text: 'text-yellow-400',
          dot: 'bg-yellow-500'
        };
      case 'error':
        return {
          bg: 'bg-red-500 bg-opacity-20',
          text: 'text-red-400',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-500 bg-opacity-20',
          text: 'text-gray-400',
          dot: 'bg-gray-500'
        };
    }
  };

  const statusStyles = getStatusStyles(project.status);
  const isDeploymentReady = project.status === 'live';
  const relativeTime = getRelativeTime(project.updatedAt);

  return (
    <div className={cn("bg-[#1e1e1e] rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-all", className)}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center mr-3">
              <i className={cn("ri-", getFrameworkIcon(project.framework))}></i>
            </div>
            <div>
              <h3 className="font-medium text-white">{project.name}</h3>
              <div className="flex items-center mt-1">
                <span className={cn("flex items-center text-xs px-2 py-0.5 rounded", statusStyles.bg, statusStyles.text)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", statusStyles.dot)}></span>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <span className="text-xs text-gray-400 ml-2">{relativeTime}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-400 hover:text-white p-1">
              <i className="ri-more-2-fill"></i>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRestart?.(project.id)}>
                <i className="ri-restart-line mr-2"></i> Restart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(project.id)}>
                <i className="ri-delete-bin-line mr-2 text-red-400"></i> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-gray-400">Framework</p>
            <p className="mt-1 font-medium text-white">{project.framework}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Environment</p>
            <p className="mt-1 font-medium text-white">
              {project.status === 'live' ? 'Production' : project.status === 'building' ? 'Staging' : 'Development'}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-gray-400">Domain</p>
          <div className="flex items-center mt-1">
            <i className={cn(
              "ri-link mr-1.5",
              isDeploymentReady ? "text-green-400" : "text-yellow-400"
            )}></i>
            <a 
              href={`https://${project.domain}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0070f3] text-sm hover:underline"
            >
              {project.domain || 'No domain configured'}
            </a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 p-4 flex justify-between items-center bg-gray-900 bg-opacity-50">
        <div className="flex space-x-2">
          <button 
            className={cn(
              "p-1.5 text-sm text-white bg-gray-700 rounded hover:bg-gray-600",
              !isDeploymentReady && "opacity-50 cursor-not-allowed"
            )} 
            title="Open deployment"
            disabled={!isDeploymentReady}
            onClick={() => {
              if (project.domain) {
                window.open(`https://${project.domain}`, '_blank');
              }
            }}
          >
            <i className="ri-external-link-line"></i>
          </button>
          <Link 
            href={`/logs?projectId=${project.id}`} 
            className="p-1.5 text-sm text-white bg-gray-700 rounded hover:bg-gray-600" 
            title="View logs"
          >
            <i className="ri-file-list-line"></i>
          </Link>
          <button 
            className={cn(
              "p-1.5 text-sm text-white bg-gray-700 rounded hover:bg-gray-600",
              project.status === 'building' && "opacity-50 cursor-not-allowed"
            )} 
            title="Restart deployment"
            disabled={project.status === 'building'}
            onClick={() => onRestart?.(project.id)}
          >
            <i className="ri-restart-line"></i>
          </button>
        </div>
        <Link 
          href={`/projects/${project.id}`}
          className="text-xs flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:border-gray-600"
        >
          <i className="ri-settings-line mr-1.5"></i> Settings
        </Link>
      </div>
    </div>
  );
}
