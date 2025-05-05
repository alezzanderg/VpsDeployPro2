import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className={cn("fixed inset-y-0 left-0 bg-[#1e1e1e] w-64 border-r border-gray-800 hidden md:flex flex-col z-10", className)}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#0070f3] rounded flex items-center justify-center mr-3">
            <i className="ri-terminal-box-fill text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-white">DeployHub</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">Self-hosted deployment platform</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link href="/" className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md group",
            isActive("/") 
              ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
              : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
          )}>
            <i className="ri-dashboard-line mr-3 text-lg"></i>
            <span>Dashboard</span>
        </Link>
        
        <Link href="/projects" className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md group",
            isActive("/projects") 
              ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
              : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
          )}>
            <i className="ri-code-box-line mr-3 text-lg"></i>
            <span>Projects</span>
        </Link>
        
        <Link href="/domains" className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md group",
            isActive("/domains") 
              ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
              : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
          )}>
            <i className="ri-global-line mr-3 text-lg"></i>
            <span>Domains</span>
        </Link>
        
        <Link href="/databases" className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md group",
            isActive("/databases") 
              ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
              : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
          )}>
            <i className="ri-database-2-line mr-3 text-lg"></i>
            <span>Databases</span>
        </Link>
        
        <Link href="/logs" className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md group",
            isActive("/logs") 
              ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
              : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
          )}>
            <i className="ri-file-list-3-line mr-3 text-lg"></i>
            <span>Logs</span>
        </Link>
        
        <Link href="/settings" className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md group",
            isActive("/settings") 
              ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
              : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
          )}>
            <i className="ri-settings-line mr-3 text-lg"></i>
            <span>Settings</span>
        </Link>

        <div className="mt-6 mb-2 px-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase">Documentation</h3>
        </div>
        
        <Link href="/docs/cli-reference" className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md group",
            isActive("/docs/cli-reference") 
              ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
              : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
          )}>
            <i className="ri-terminal-line mr-3 text-lg"></i>
            <span>CLI Reference</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center mb-2">
          <div className="mr-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-gray-300"></i>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@server.local</p>
          </div>
        </div>
        <button className="w-full text-xs flex items-center justify-center px-3 py-2 rounded-md border border-gray-700 text-gray-400 hover:border-gray-600">
          <i className="ri-logout-box-line mr-2"></i> Sign Out
        </button>
      </div>
    </aside>
  );
}
