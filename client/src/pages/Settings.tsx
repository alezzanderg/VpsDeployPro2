import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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

export default function Settings() {
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState("general");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  // Mock settings (would be fetched from API in a real app)
  const [generalSettings, setGeneralSettings] = useState({
    serverName: "DeployHub Server",
    serverDomain: "deployhub.example.com",
    serverPort: "5000",
    adminEmail: "admin@server.local"
  });
  
  const [deploymentSettings, setDeploymentSettings] = useState({
    deploymentTimeoutSeconds: "300",
    maxConcurrentDeployments: "3",
    enableAutoDeploy: true,
    enableRollback: true,
    defaultBranch: "main"
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    enableGithubAuth: false,
    githubClientId: "",
    githubClientSecret: "",
    enableSsl: true,
    sessionTimeoutMinutes: "60",
    adminIpAllowlist: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: false,
    smtpServer: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    notifyOnDeployment: true,
    notifyOnError: true
  });
  
  // Handle input change for general settings
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle input change for deployment settings
  const handleDeploymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeploymentSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle switch change for deployment settings
  const handleDeploymentSwitchChange = (name: string, checked: boolean) => {
    setDeploymentSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle input change for security settings
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSecuritySettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle switch change for security settings
  const handleSecuritySwitchChange = (name: string, checked: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle input change for notification settings
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle switch change for notification settings
  const handleNotificationSwitchChange = (name: string, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  // Save settings
  const handleSaveSettings = () => {
    // In a real app, this would save to the server
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully."
    });
  };
  
  // Reset platform
  const handleResetPlatform = () => {
    // In a real app, this would reset the platform
    setResetDialogOpen(false);
    
    toast({
      title: "Platform Reset",
      description: "DeployHub has been reset to default settings.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen flex bg-[#111111] text-white">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Configure your DeployHub platform</p>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#1e1e1e] border border-gray-800 grid grid-cols-4 mb-6">
              <TabsTrigger 
                value="general"
                className="data-[state=active]:bg-[#0070f3] data-[state=active]:text-white"
              >
                General
              </TabsTrigger>
              <TabsTrigger 
                value="deployment"
                className="data-[state=active]:bg-[#0070f3] data-[state=active]:text-white"
              >
                Deployment
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-[#0070f3] data-[state=active]:text-white"
              >
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-[#0070f3] data-[state=active]:text-white"
              >
                Notifications
              </TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general">
              <Card className="bg-[#1e1e1e] border-gray-800">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your server settings and basic configuration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input
                      id="serverName"
                      name="serverName"
                      value={generalSettings.serverName}
                      onChange={handleGeneralChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serverDomain">Server Domain</Label>
                    <Input
                      id="serverDomain"
                      name="serverDomain"
                      value={generalSettings.serverDomain}
                      onChange={handleGeneralChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                    <p className="text-xs text-gray-400">
                      The primary domain for your DeployHub installation.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serverPort">Server Port</Label>
                    <Input
                      id="serverPort"
                      name="serverPort"
                      value={generalSettings.serverPort}
                      onChange={handleGeneralChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={handleGeneralChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                    <p className="text-xs text-gray-400">
                      Email for system notifications and alerts.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-4 border-t border-gray-800">
                  <Button 
                    className="bg-[#0070f3] hover:bg-opacity-90 text-white"
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Deployment Settings */}
            <TabsContent value="deployment">
              <Card className="bg-[#1e1e1e] border-gray-800">
                <CardHeader>
                  <CardTitle>Deployment Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure how projects are deployed and managed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deploymentTimeoutSeconds">Deployment Timeout (seconds)</Label>
                    <Input
                      id="deploymentTimeoutSeconds"
                      name="deploymentTimeoutSeconds"
                      type="number"
                      value={deploymentSettings.deploymentTimeoutSeconds}
                      onChange={handleDeploymentChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                    <p className="text-xs text-gray-400">
                      Maximum time allowed for deployments before they time out.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxConcurrentDeployments">Max Concurrent Deployments</Label>
                    <Input
                      id="maxConcurrentDeployments"
                      name="maxConcurrentDeployments"
                      type="number"
                      value={deploymentSettings.maxConcurrentDeployments}
                      onChange={handleDeploymentChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                    <p className="text-xs text-gray-400">
                      Maximum number of deployments that can run simultaneously.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultBranch">Default Branch</Label>
                    <Input
                      id="defaultBranch"
                      name="defaultBranch"
                      value={deploymentSettings.defaultBranch}
                      onChange={handleDeploymentChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableAutoDeploy">Auto Deploy on Push</Label>
                      <p className="text-xs text-gray-400">
                        Automatically deploy when changes are pushed to the repository.
                      </p>
                    </div>
                    <Switch
                      id="enableAutoDeploy"
                      checked={deploymentSettings.enableAutoDeploy}
                      onCheckedChange={(checked) => 
                        handleDeploymentSwitchChange("enableAutoDeploy", checked)
                      }
                      className="data-[state=checked]:bg-[#0070f3]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableRollback">Enable Rollback</Label>
                      <p className="text-xs text-gray-400">
                        Allow rolling back to previous versions if deployment fails.
                      </p>
                    </div>
                    <Switch
                      id="enableRollback"
                      checked={deploymentSettings.enableRollback}
                      onCheckedChange={(checked) => 
                        handleDeploymentSwitchChange("enableRollback", checked)
                      }
                      className="data-[state=checked]:bg-[#0070f3]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-4 border-t border-gray-800">
                  <Button 
                    className="bg-[#0070f3] hover:bg-opacity-90 text-white"
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security">
              <Card className="bg-[#1e1e1e] border-gray-800">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure security and authentication settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableGithubAuth">GitHub Authentication</Label>
                      <p className="text-xs text-gray-400">
                        Allow users to log in with GitHub credentials.
                      </p>
                    </div>
                    <Switch
                      id="enableGithubAuth"
                      checked={securitySettings.enableGithubAuth}
                      onCheckedChange={(checked) => 
                        handleSecuritySwitchChange("enableGithubAuth", checked)
                      }
                      className="data-[state=checked]:bg-[#0070f3]"
                    />
                  </div>
                  
                  {securitySettings.enableGithubAuth && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="githubClientId">GitHub Client ID</Label>
                        <Input
                          id="githubClientId"
                          name="githubClientId"
                          value={securitySettings.githubClientId}
                          onChange={handleSecurityChange}
                          className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="githubClientSecret">GitHub Client Secret</Label>
                        <Input
                          id="githubClientSecret"
                          name="githubClientSecret"
                          type="password"
                          value={securitySettings.githubClientSecret}
                          onChange={handleSecurityChange}
                          className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableSsl">Enable SSL</Label>
                      <p className="text-xs text-gray-400">
                        Use HTTPS for secure connections.
                      </p>
                    </div>
                    <Switch
                      id="enableSsl"
                      checked={securitySettings.enableSsl}
                      onCheckedChange={(checked) => 
                        handleSecuritySwitchChange("enableSsl", checked)
                      }
                      className="data-[state=checked]:bg-[#0070f3]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeoutMinutes">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeoutMinutes"
                      name="sessionTimeoutMinutes"
                      type="number"
                      value={securitySettings.sessionTimeoutMinutes}
                      onChange={handleSecurityChange}
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminIpAllowlist">Admin IP Allowlist</Label>
                    <Textarea
                      id="adminIpAllowlist"
                      name="adminIpAllowlist"
                      value={securitySettings.adminIpAllowlist}
                      onChange={handleSecurityChange}
                      placeholder="Enter IPs separated by commas"
                      className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                    />
                    <p className="text-xs text-gray-400">
                      Only these IPs can access the admin area. Leave blank to allow all.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-4 border-t border-gray-800">
                  <Button 
                    className="bg-[#0070f3] hover:bg-opacity-90 text-white"
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="bg-[#1e1e1e] border-gray-800">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure how and when notifications are sent.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                      <p className="text-xs text-gray-400">
                        Send notifications via email.
                      </p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => 
                        handleNotificationSwitchChange("enableEmailNotifications", checked)
                      }
                      className="data-[state=checked]:bg-[#0070f3]"
                    />
                  </div>
                  
                  {notificationSettings.enableEmailNotifications && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="smtpServer">SMTP Server</Label>
                        <Input
                          id="smtpServer"
                          name="smtpServer"
                          value={notificationSettings.smtpServer}
                          onChange={handleNotificationChange}
                          className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                          placeholder="smtp.example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          name="smtpPort"
                          type="number"
                          value={notificationSettings.smtpPort}
                          onChange={handleNotificationChange}
                          className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtpUsername">SMTP Username</Label>
                        <Input
                          id="smtpUsername"
                          name="smtpUsername"
                          value={notificationSettings.smtpUsername}
                          onChange={handleNotificationChange}
                          className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          name="smtpPassword"
                          type="password"
                          value={notificationSettings.smtpPassword}
                          onChange={handleNotificationChange}
                          className="bg-gray-900 border-gray-700 focus:border-[#0070f3]"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnDeployment">Deployment Notifications</Label>
                      <p className="text-xs text-gray-400">
                        Send notifications when deployments start and complete.
                      </p>
                    </div>
                    <Switch
                      id="notifyOnDeployment"
                      checked={notificationSettings.notifyOnDeployment}
                      onCheckedChange={(checked) => 
                        handleNotificationSwitchChange("notifyOnDeployment", checked)
                      }
                      className="data-[state=checked]:bg-[#0070f3]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnError">Error Notifications</Label>
                      <p className="text-xs text-gray-400">
                        Send notifications when errors occur.
                      </p>
                    </div>
                    <Switch
                      id="notifyOnError"
                      checked={notificationSettings.notifyOnError}
                      onCheckedChange={(checked) => 
                        handleNotificationSwitchChange("notifyOnError", checked)
                      }
                      className="data-[state=checked]:bg-[#0070f3]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-4 border-t border-gray-800">
                  <Button 
                    className="bg-[#0070f3] hover:bg-opacity-90 text-white"
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <div className="mt-8 bg-[#1e1e1e] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-2 text-red-500">Danger Zone</h2>
            <p className="text-gray-400 mb-4">
              These actions are destructive and cannot be undone. Please proceed with caution.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-900 bg-red-900 bg-opacity-10 rounded-md">
                <div>
                  <h3 className="font-medium text-white">Reset Platform</h3>
                  <p className="text-sm text-gray-400">
                    Reset DeployHub to its default state. All projects, domains, and databases will be removed.
                  </p>
                </div>
                <Button 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setResetDialogOpen(true)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Reset Platform Confirmation Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-[#1e1e1e] text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Reset Platform</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete all projects, domains, databases, and settings.
              This action cannot be undone. Are you absolutely sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetPlatform}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset Platform
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
