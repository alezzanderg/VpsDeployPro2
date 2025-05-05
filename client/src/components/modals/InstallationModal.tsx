import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface InstallationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstallationModal({ open, onOpenChange }: InstallationModalProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    
    // Simulate setup completion
    setTimeout(() => {
      setIsCompleting(false);
      onOpenChange(false);
      
      // Store in localStorage that the installation has been completed
      localStorage.setItem("installationCompleted", "true");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] text-white border-gray-800 sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Welcome to DeployHub</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Quick Installation Guide</h4>
              <p className="text-gray-400 mb-4">Follow these steps to complete setting up DeployHub on your VPS.</p>
              
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h5 className="font-medium text-sm mb-2 flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0070f3] rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                    Prerequisites
                  </h5>
                  <p className="text-sm text-gray-400 mb-2">Make sure you have the following installed:</p>
                  <ul className="text-sm text-gray-400 list-disc list-inside ml-2 space-y-1">
                    <li>Docker (20.10+)</li>
                    <li>Docker Compose (2.0+)</li>
                    <li>Git (2.20+)</li>
                    <li>Node.js (16.0+)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h5 className="font-medium text-sm mb-2 flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0070f3] rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                    Configure Services
                  </h5>
                  <p className="text-sm text-gray-400 mb-2">Run the configuration script:</p>
                  <pre className="bg-black p-3 rounded text-sm font-mono text-white overflow-x-auto">
                    curl -fsSL https://example.com/deployhub/setup.sh | bash
                  </pre>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h5 className="font-medium text-sm mb-2 flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0070f3] rounded-full flex items-center justify-center mr-2 text-xs">3</span>
                    Set Environment Variables
                  </h5>
                  <p className="text-sm text-gray-400 mb-2">Create a <code>.env</code> file with your configuration:</p>
                  <pre className="bg-black p-3 rounded text-sm font-mono text-white overflow-x-auto">
                    DB_PASSWORD=secure_password{"\n"}
                    DOMAIN=deployhub.yourdomain.com{"\n"}
                    GITHUB_CLIENT_ID=your_github_client_id{"\n"}
                    GITHUB_CLIENT_SECRET=your_github_client_secret
                  </pre>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h5 className="font-medium text-sm mb-2 flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0070f3] rounded-full flex items-center justify-center mr-2 text-xs">4</span>
                    Start Services
                  </h5>
                  <p className="text-sm text-gray-400 mb-2">Launch DeployHub services:</p>
                  <pre className="bg-black p-3 rounded text-sm font-mono text-white overflow-x-auto">
                    docker-compose up -d
                  </pre>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h5 className="font-medium text-sm mb-2 flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0070f3] rounded-full flex items-center justify-center mr-2 text-xs">5</span>
                    Configure CLI
                  </h5>
                  <p className="text-sm text-gray-400 mb-2">Install and set up the CLI tool:</p>
                  <pre className="bg-black p-3 rounded text-sm font-mono text-white overflow-x-auto">
                    npm install -g deployhub-cli{"\n"}
                    deployhub-cli login --server https://deployhub.yourdomain.com
                  </pre>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Next Steps</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <i className="ri-check-line text-green-400 mt-0.5 mr-2"></i>
                  <span>Create your first project using the dashboard</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-400 mt-0.5 mr-2"></i>
                  <span>Configure your custom domains in DNS settings</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-400 mt-0.5 mr-2"></i>
                  <span>Set up a database for your applications</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-400 mt-0.5 mr-2"></i>
                  <span>Check out the documentation for advanced configuration</span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            Skip for now
          </Button>
          <Button 
            type="button"
            className="bg-[#0070f3] hover:bg-opacity-90 text-white"
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? "Completing..." : "Complete Setup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
