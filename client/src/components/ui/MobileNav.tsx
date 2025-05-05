import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1e1e1e] border-b border-gray-800 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#0070f3] rounded flex items-center justify-center mr-3">
              <i className="ri-terminal-box-fill text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-white">DeployHub</h1>
          </div>
          <button 
            onClick={toggleMenu}
            className="text-gray-300"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={cn(
        "md:hidden fixed top-16 left-0 right-0 bg-[#1e1e1e] z-10 border-b border-gray-800",
        isMenuOpen ? "block" : "hidden"
      )}>
        <nav className="p-4 space-y-2">
          <Link 
            href="/"
            className={cn(
              "block px-3 py-2 text-sm rounded-md",
              isActive("/") 
                ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
                : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-dashboard-line mr-2"></i> Dashboard
          </Link>
          
          <Link 
            href="/projects"
            className={cn(
              "block px-3 py-2 text-sm rounded-md",
              isActive("/projects") 
                ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
                : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-code-box-line mr-2"></i> Projects
          </Link>
          
          <Link 
            href="/domains"
            className={cn(
              "block px-3 py-2 text-sm rounded-md",
              isActive("/domains") 
                ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
                : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-global-line mr-2"></i> Domains
          </Link>
          
          <Link 
            href="/databases"
            className={cn(
              "block px-3 py-2 text-sm rounded-md",
              isActive("/databases") 
                ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
                : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-database-2-line mr-2"></i> Databases
          </Link>
          
          <Link 
            href="/logs"
            className={cn(
              "block px-3 py-2 text-sm rounded-md",
              isActive("/logs") 
                ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
                : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-file-list-3-line mr-2"></i> Logs
          </Link>
          
          <Link 
            href="/settings"
            className={cn(
              "block px-3 py-2 text-sm rounded-md",
              isActive("/settings") 
                ? "bg-[#0070f3] bg-opacity-20 text-[#0070f3]" 
                : "text-gray-400 hover:bg-[#1e1e1e] hover:bg-opacity-40"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-settings-line mr-2"></i> Settings
          </Link>
        </nav>
      </div>
    </>
  );
}
