# Platform CLI

A command-line interface for managing your Vercel-like platform deployment.

## Installation

```bash
# Install globally
npm install -g @platform/cli

# Or run directly with npx
npx @platform/cli
```

## Authentication

Before using the CLI, you need to authenticate:

```bash
# Login with your API token
platform login --token <your-token>

# Check authentication status
platform status
```

## Commands

### Projects

```bash
# List all projects
platform projects list

# Create a new project
platform projects create --name "My Project" --framework Next.js --repo https://github.com/user/repo

# View project details
platform projects info 123

# Restart a project
platform projects restart 123

# Delete a project
platform projects delete 123
```

### Domains

```bash
# List all domains
platform domains list

# Add a new domain
platform domains add --domain example.com --project 123

# Verify domain DNS configuration
platform domains verify 123

# Delete a domain
platform domains delete 123

# Assign a domain to a project
platform domains assign 123 456  # domain ID 123, project ID 456
```

### Databases

```bash
# List all databases
platform databases list

# Create a new database
platform databases create --name "production-db" --type PostgreSQL

# View database details
platform databases info 123

# Connect to database CLI
platform databases connect 123

# Delete a database
platform databases delete 123
```

### Logs

```bash
# View project logs
platform logs view 123

# Follow logs in real-time
platform logs view 123 --follow

# Filter logs by type
platform logs view 123 --type error

# Download logs to a file
platform logs download 123 --output project-logs.txt

# Clear project logs
platform logs clear 123
```

### Environment Variables

```bash
# List environment variables
platform env list 123

# Show actual values (not masked)
platform env list 123 --show-values

# Set an environment variable
platform env set 123 API_KEY=secret-value

# Remove an environment variable
platform env unset 123 API_KEY

# Import variables from a .env file
platform env import 123 .env.production
```

### Metrics

```bash
# View system-wide metrics
platform metrics system

# View project-specific metrics
platform metrics project 123
```

## Global Options

- `--help`: Show help information
- `--version`: Show version number

## Examples

For more usage examples:

```bash
platform examples
```

## Support

For support, please contact support@yourplatform.com or visit https://docs.yourplatform.com