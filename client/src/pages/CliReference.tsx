import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CliReference() {
  return (
    <div className="min-h-screen flex bg-[#111111] text-white">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Platform CLI Documentation</h1>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>VPS Installation & Setup</CardTitle>
                  <CardDescription>
                    Complete guide to install and configure the platform on your VPS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">System Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ubuntu 20.04 or newer / Debian 11 or newer</li>
                      <li>Minimum 2 CPU cores</li>
                      <li>Minimum 4GB RAM</li>
                      <li>Minimum 20GB storage</li>
                      <li>Root access or sudo privileges</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Installation Script</h3>
                    <p className="mb-2">Run the following command to install all requirements:</p>
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 mb-2 overflow-x-auto">
                      <code>curl -sSL https://install.platform.example.com | sudo bash</code>
                    </pre>
                    <p className="text-sm text-gray-300">This will install Docker, Node.js, PostgreSQL, and other dependencies.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Manual Installation</h3>
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 mb-2 overflow-x-auto">
                      <code>{`# Update system packages
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl git docker.io docker-compose nodejs npm nginx certbot python3-certbot-nginx

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Clone the platform repository
git clone https://github.com/yourusername/platform.git /opt/platform

# Install Node.js dependencies
cd /opt/platform
npm install

# Create configuration file
cp .env.example .env

# Edit configuration
nano .env

# Start the platform
npm run start`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Configuring NGINX</h3>
                    <p className="mb-2">Create a reverse proxy configuration:</p>
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 mb-2 overflow-x-auto">
                      <code>{`sudo nano /etc/nginx/sites-available/platform

# Add the following configuration:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Add SSL certificate
sudo certbot --nginx -d yourdomain.com`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Using systemd for Autostart</h3>
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 mb-2 overflow-x-auto">
                      <code>{`sudo nano /etc/systemd/system/platform.service

# Add the following content:
[Unit]
Description=Platform Deployment Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/platform
ExecStart=/usr/bin/npm run start
Restart=on-failure

[Install]
WantedBy=multi-user.target

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable platform
sudo systemctl start platform`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CLI Installation</CardTitle>
                  <CardDescription>
                    How to install and authenticate with the Platform CLI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">Installing the CLI</h3>
                  <pre className="bg-gray-800 text-gray-100 rounded-md p-4 mb-4 overflow-x-auto">
                    <code>{`# Install globally with npm
npm install -g @platform/cli

# Or run directly with npx
npx @platform/cli`}</code>
                  </pre>

                  <h3 className="text-xl font-semibold mb-2">Authentication</h3>
                  <pre className="bg-gray-800 text-gray-100 rounded-md p-4 mb-2 overflow-x-auto">
                    <code>{`# Login with your API token
platform login --token <your-token>

# Check authentication status
platform status`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Tabs defaultValue="projects">
                <TabsList className="grid grid-cols-6 mb-4">
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="domains">Domains</TabsTrigger>
                  <TabsTrigger value="databases">Databases</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="env">Environment</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Commands</CardTitle>
                      <CardDescription>
                        Manage your deployed projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">List Projects</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform projects list</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Create a Project</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform projects create --name "My Project" --framework Next.js --repo https://github.com/user/repo</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">View Project Details</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform projects info &lt;id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Restart a Project</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform projects restart &lt;id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Delete a Project</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform projects delete &lt;id&gt;</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="domains">
                  <Card>
                    <CardHeader>
                      <CardTitle>Domain Commands</CardTitle>
                      <CardDescription>
                        Manage your custom domains
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">List Domains</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform domains list</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Add a Domain</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform domains add --domain example.com --project &lt;project-id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Verify a Domain</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform domains verify &lt;id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Assign a Domain to a Project</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform domains assign &lt;domain-id&gt; &lt;project-id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Delete a Domain</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform domains delete &lt;id&gt;</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="databases">
                  <Card>
                    <CardHeader>
                      <CardTitle>Database Commands</CardTitle>
                      <CardDescription>
                        Manage your database instances
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">List Databases</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform databases list</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Create a Database</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform databases create --name "production-db" --type PostgreSQL</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Database Details</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform databases info &lt;id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Connect to Database CLI</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform databases connect &lt;id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Delete a Database</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform databases delete &lt;id&gt;</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="logs">
                  <Card>
                    <CardHeader>
                      <CardTitle>Log Commands</CardTitle>
                      <CardDescription>
                        View and manage logs for your projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">View Logs</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform logs view &lt;project-id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Follow Logs in Real-time</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform logs view &lt;project-id&gt; --follow</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Filter Logs by Type</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform logs view &lt;project-id&gt; --type error</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Download Logs</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform logs download &lt;project-id&gt; --output project-logs.txt</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Clear Logs</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform logs clear &lt;project-id&gt;</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="env">
                  <Card>
                    <CardHeader>
                      <CardTitle>Environment Variable Commands</CardTitle>
                      <CardDescription>
                        Manage environment variables for your projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">List Environment Variables</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform env list &lt;project-id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Set an Environment Variable</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform env set &lt;project-id&gt; API_KEY=secret-value</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Remove an Environment Variable</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform env unset &lt;project-id&gt; API_KEY</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Import from .env File</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform env import &lt;project-id&gt; --file .env.production</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="metrics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Metrics Commands</CardTitle>
                      <CardDescription>
                        Monitor system and project performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">View System Metrics</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform metrics view</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">View Project Metrics</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform metrics view &lt;project-id&gt;</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">View Live Metrics</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform metrics view --live</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Export Metrics</h3>
                        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                          <code>platform metrics export --format json --output metrics.json</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <Card>
                <CardHeader>
                  <CardTitle>Server Maintenance</CardTitle>
                  <CardDescription>
                    Commands for maintaining your platform server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Update Platform</h3>
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                      <code>{`# Navigate to platform directory
cd /opt/platform

# Pull latest changes
git pull

# Update dependencies
npm install

# Restart the service
sudo systemctl restart platform`}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Backup Data</h3>
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                      <code>{`# Backup databases
platform backup create --type=databases

# Backup configuration
platform backup create --type=config

# Full backup (projects, databases, and config)
platform backup create --type=full`}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">System Health Check</h3>
                    <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
                      <code>{`# Check system status
platform system check

# Check and repair issues
platform system repair

# View system logs
platform system logs`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Global Options</CardTitle>
                  <CardDescription>
                    Options that work with all commands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><code>--help</code>: Show help information</li>
                    <li><code>--version</code>: Show CLI version</li>
                    <li><code>--format &lt;format&gt;</code>: Output format (table, json) for many commands</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}