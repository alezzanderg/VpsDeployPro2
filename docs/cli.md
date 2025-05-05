# Platform CLI Documentation

The Platform CLI is a powerful command-line tool designed to help you manage your infrastructure, applications, and services on the platform.

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [Projects](#projects)
- [Domains](#domains)
- [Databases](#databases)
- [Logs](#logs)
- [Environment Variables](#environment-variables)
- [Metrics](#metrics)
- [General Commands](#general-commands)
- [Command Structure](#command-structure)
- [Output Formats](#output-formats)
- [Global Options](#global-options)
- [Troubleshooting](#troubleshooting)

## Installation

### Using npm (recommended)

```bash
npm install -g @platform/cli
```

### Using yarn

```bash
yarn global add @platform/cli
```

### Verify Installation

```bash
platform --version
```

## Authentication

Before you can use the CLI, you need to authenticate with your platform account.

### Login with API Token

```bash
platform login --token <your-token>
```

You can find your API token in your account settings on the platform website.

### Check Login Status

```bash
platform status
```

### Logout

```bash
platform logout
```

## Projects

Projects are the core component of the platform.

### List Projects

```bash
platform projects list
```

**Options:**
- `-f, --format <format>`: Output format ('table' or 'json')

### Create a Project

```bash
platform projects create --name "My Project" --framework Next.js --repo https://github.com/user/repo
```

**Required Options:**
- `-n, --name <name>`: Project name
- `-f, --framework <framework>`: Project framework (e.g., Next.js, React, Express.js)
- `-r, --repo <repository>`: Git repository URL

**Optional Options:**
- `-b, --branch <branch>`: Git branch to deploy (default: 'main')
- `-d, --domain <domain>`: Custom domain for the project
- `--database`: Provision a database for this project

### View Project Details

```bash
platform projects info <id>
```

**Options:**
- `-f, --format <format>`: Output format ('pretty' or 'json')

### Restart a Project

```bash
platform projects restart <id>
```

### Delete a Project

```bash
platform projects delete <id>
```

**Options:**
- `-f, --force`: Skip confirmation

## Domains

Manage custom domains for your projects.

### List Domains

```bash
platform domains list
```

**Options:**
- `-f, --format <format>`: Output format ('table' or 'json')

### Add a Domain

```bash
platform domains add --domain example.com --project 123
```

**Required Options:**
- `-d, --domain <domain>`: Domain name (e.g., example.com)

**Optional Options:**
- `-p, --project <project>`: Project ID to assign the domain to

### Verify a Domain

```bash
platform domains verify <id>
```

### Delete a Domain

```bash
platform domains delete <id>
```

**Options:**
- `-f, --force`: Skip confirmation

### Assign a Domain to a Project

```bash
platform domains assign <domain-id> <project-id>
```

## Databases

Manage database instances for your projects.

### List Databases

```bash
platform databases list
```

**Options:**
- `-f, --format <format>`: Output format ('table' or 'json')

### Create a Database

```bash
platform databases create --name "production-db" --type PostgreSQL
```

**Required Options:**
- `-n, --name <name>`: Database name
- `-t, --type <type>`: Database type (PostgreSQL, MySQL, Redis, MongoDB)

**Optional Options:**
- `-p, --project <project>`: Project ID to assign the database to

### View Database Details

```bash
platform databases info <id>
```

**Options:**
- `-f, --format <format>`: Output format ('pretty' or 'json')
- `--show-credentials`: Show connection credentials in plain text

### Connect to Database CLI

```bash
platform databases connect <id>
```

### Delete a Database

```bash
platform databases delete <id>
```

**Options:**
- `-f, --force`: Skip confirmation

## Logs

View and manage logs for your projects.

### View Logs

```bash
platform logs view <project-id>
```

**Options:**
- `-l, --limit <limit>`: Number of log entries to show (default: 50)
- `-t, --type <type>`: Filter logs by type (info, warn, error, debug)
- `-f, --follow`: Follow logs in real-time
- `--format <format>`: Output format ('pretty' or 'json')

### Download Logs

```bash
platform logs download <project-id>
```

**Options:**
- `-o, --output <filename>`: Output file name (default: 'project-logs.txt')
- `-f, --format <format>`: Output format ('text' or 'json')
- `-l, --limit <limit>`: Number of log entries to download (default: 1000)
- `-t, --type <type>`: Filter logs by type (info, warn, error, debug)

### Clear Logs

```bash
platform logs clear <project-id>
```

**Options:**
- `-f, --force`: Skip confirmation

## Environment Variables

Manage environment variables for your projects.

### List Environment Variables

```bash
platform env list <project-id>
```

**Options:**
- `-e, --env <environment>`: Environment (production, development, preview) (default: 'production')
- `-f, --format <format>`: Output format ('table' or 'json')
- `--show-values`: Show actual values instead of placeholders

### Set an Environment Variable

```bash
platform env set <project-id> <key=value>
```

**Options:**
- `-e, --env <environment>`: Environment (production, development, preview) (default: 'production')

### Remove an Environment Variable

```bash
platform env unset <project-id> <key>
```

**Options:**
- `-e, --env <environment>`: Environment (production, development, preview) (default: 'production')

### Import Environment Variables from File

```bash
platform env import <project-id> <file>
```

**Options:**
- `-e, --env <environment>`: Environment (production, development, preview) (default: 'production')
- `--overwrite`: Overwrite existing variables with the same name

## Metrics

View performance metrics for your projects and system.

### System Metrics

```bash
platform metrics system
```

**Options:**
- `-f, --format <format>`: Output format ('pretty' or 'json')

### Project Metrics

```bash
platform metrics project <id>
```

**Options:**
- `-f, --format <format>`: Output format ('pretty' or 'json')

## General Commands

### View Status

```bash
platform status
```

### View Usage Examples

```bash
platform examples
```

### Get Help

```bash
platform --help
platform <command> --help
```

## Command Structure

The CLI uses a hierarchical command structure:

```
platform <command> <subcommand> [options] [arguments]
```

For example:
```
platform projects list --format json
```

## Output Formats

Most commands support different output formats:

- **Table**: Human-readable tabular format (default)
- **JSON**: Machine-readable JSON format
- **Pretty**: Detailed human-readable format

You can specify the format using the `--format` option.

## Global Options

These options can be used with any command:

- `--help`: Show help information
- `--version`: Show version number

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   If you see "You must be logged in to use this command", run:

   ```bash
   platform login --token <your-token>
   ```

2. **Command Not Found**

   Make sure the CLI is properly installed. You might need to add it to your PATH.

3. **API Connection Issues**

   If the CLI can't connect to the API, check your internet connection and verify the API URL:

   ```bash
   platform status
   ```

   You can set a custom API URL with:

   ```bash
   platform login --api-url <url> --token <your-token>
   ```

### Getting Help

For additional support:

- Run `platform --help` for general help
- Run `platform <command> --help` for command-specific help
- Visit our documentation website
- Contact support at support@yourplatform.com