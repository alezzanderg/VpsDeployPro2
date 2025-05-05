# DeployHub: Self-Hosted Deployment Platform

DeployHub is a powerful self-hosted deployment platform providing comprehensive project management, domain handling, and database provisioning capabilities for developers. It's designed to be a Vercel-like platform for VPS management, allowing users to easily deploy and manage their applications.

## Key Features

- **Project Management**: Deploy, manage, and monitor your projects
- **Domain Management**: Configure and manage custom domains for your applications
- **Database Provisioning**: Create and connect databases to your projects
- **Monitoring & Logs**: View performance metrics and logs
- **Environment Variables**: Securely manage configuration variables
- **CLI Tools**: Powerful command-line interface for automation

## System Components

### Web Interface

The web interface provides a dashboard for managing all aspects of your deployments:

- **Dashboard**: Overview of resources and recent activity
- **Projects**: Create and manage deployments
- **Domains**: Configure custom domains
- **Databases**: Provision and manage databases
- **Logs**: Monitor application logs
- **Settings**: Configure platform settings

### Command Line Interface

The platform comes with a powerful CLI for automation and scripting:

```bash
# Authentication
platform login --token <your-token>

# Project management
platform projects list
platform projects create --name "My App" --framework Next.js --repo https://github.com/user/repo

# Domain management
platform domains add --domain example.com --project 123

# Database provisioning
platform databases create --name "production-db" --type PostgreSQL

# Viewing logs
platform logs view 123 --follow

# Environment variables
platform env set 123 API_KEY=secret-value
```

Full CLI documentation is available on the CLI Reference page in the web interface.

## Technology Stack

- **Frontend**: React with Tailwind CSS and shadcn UI components
- **Backend**: Express.js with RESTful APIs
- **Storage**: Flexible storage interface with in-memory and database options
- **CLI**: Commander.js-based command-line interface

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at http://localhost:8080

## Development

The project structure follows a clean architecture:

- `/client`: Frontend React application
- `/server`: Backend Express API
- `/shared`: Shared types and schemas
- `/cli`: Command-line interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.