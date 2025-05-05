# CLI Documentation

## Overview

This document provides a comprehensive guide for using the command-line interface (CLI) to interact with our Vercel-like VPS management platform. The CLI allows you to deploy projects, manage domains, provision databases, and monitor resources directly from your terminal.

## Installation

```bash
npm install -g @your-platform/cli
```

## Authentication

Before using the CLI, you need to authenticate:

```bash
platform login
```

This command will prompt you for your credentials or open a browser window for authentication.

## Commands

### Projects

#### List all projects
```bash
platform projects list
```

#### Create a new project
```bash
platform projects create --name "My Project" --framework react --repo https://github.com/user/repo --branch main
```

#### Get project details
```bash
platform projects get <project-id>
```

#### Delete a project
```bash
platform projects delete <project-id>
```

#### Deploy a project
```bash
platform deploy --project <project-id>
```

### Domains

#### List all domains
```bash
platform domains list
```

#### Add a domain
```bash
platform domains add --name example.com --project <project-id>
```

#### Remove a domain
```bash
platform domains remove <domain-id>
```

#### Verify domain status
```bash
platform domains verify <domain-id>
```

### Databases

#### List all databases
```bash
platform databases list
```

#### Create a database
```bash
platform databases create --name "production-db" --type postgres --project <project-id>
```

#### Get database connection details
```bash
platform databases connection <database-id>
```

#### Delete a database
```bash
platform databases delete <database-id>
```

### Logs

#### View project logs
```bash
platform logs --project <project-id> --lines 100
```

#### Stream logs in real-time
```bash
platform logs --project <project-id> --follow
```

### System Metrics

#### View system resource usage
```bash
platform metrics --resource cpu,memory,disk,network
```

## Environment Variables

You can set environment variables for your projects:

```bash
platform env set --project <project-id> KEY=VALUE
```

List environment variables:

```bash
platform env list --project <project-id>
```

Remove an environment variable:

```bash
platform env unset --project <project-id> KEY
```

## Configuration

Create a configuration file in your project to define deployment settings:

```json
// platform.json
{
  "name": "my-application",
  "framework": "next",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "environment": {
    "NODE_ENV": "production"
  },
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## Examples

### Deploy a Next.js application
```bash
# Initialize your project
platform init --framework next

# Deploy to production
platform deploy --prod
```

### Create a production database and link it to your project
```bash
# Create the database
platform databases create --name prod-db --type postgres

# Link it to your project and generate environment variables
platform databases link --database prod-db --project my-app
```

## Troubleshooting

If you encounter any issues with the CLI, try the following:

1. Update to the latest version:
   ```bash
   npm update -g @your-platform/cli
   ```

2. Check your authentication status:
   ```bash
   platform whoami
   ```

3. Enable debug logs:
   ```bash
   platform --debug <command>
   ```

For additional help, run:
```bash
platform help
```

Or for help with a specific command:
```bash
platform help <command>
```