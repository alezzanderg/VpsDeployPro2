# Getting Started with the CLI

This guide will walk you through deploying your first application using our command-line interface (CLI).

## Prerequisites

- Node.js 14.x or higher
- npm or yarn
- A registered account on our platform
- A Git repository with your application code

## Installation

Install the CLI globally on your machine:

```bash
npm install -g @your-platform/cli
```

Verify the installation was successful:

```bash
platform --version
```

You should see the version number of the CLI.

## Authentication

Before you can deploy your application, you need to authenticate with your account:

```bash
platform login
```

This command will open a browser window where you can log in to your account. After successful authentication, you will be redirected back to your terminal.

You can verify that you're properly authenticated by running:

```bash
platform whoami
```

## Deploying Your First Application

### Step 1: Navigate to your project directory

```bash
cd ~/my-project
```

### Step 2: Initialize your project

```bash
platform init
```

This command will guide you through setting up your project for deployment. You'll be asked to:

1. Choose a name for your project
2. Select the framework your project uses (React, Vue, Next.js, etc.)
3. Specify your build command and output directory
4. Set up environment variables (if needed)

The answers will be saved to a `platform.json` file in your project directory.

### Step 3: Deploy your application

```bash
platform deploy
```

The CLI will:
1. Package your application
2. Upload it to our platform
3. Build it according to your configuration
4. Deploy it to a production environment

You'll see detailed logs during the deployment process. When it's complete, you'll receive a URL where your application is hosted.

## Working with Environments

You can deploy to different environments:

```bash
# Deploy to production
platform deploy --prod

# Deploy to staging
platform deploy --env staging

# Deploy to development
platform deploy --env development
```

## Adding a Custom Domain

To add a custom domain to your deployed application:

```bash
# First, get your project ID
platform projects list

# Then add your domain
platform domains add --name yourdomain.com --project your-project-id
```

After adding your domain, you'll need to configure DNS settings. The CLI will provide the necessary information.

## Setting Up Environment Variables

To set environment variables for your application:

```bash
platform env set --project your-project-id NODE_ENV=production
platform env set --project your-project-id API_KEY=your-api-key
```

You can also set multiple variables at once:

```bash
platform env set --project your-project-id NODE_ENV=production API_KEY=your-api-key
```

## Creating a Database

To provision a database for your application:

```bash
# Create a database
platform databases create --name my-database --type postgres

# Link it to your project
platform databases link --database my-database --project your-project-id
```

Linking the database automatically adds the necessary environment variables to your project.

## Viewing Logs

You can view logs for your deployed application:

```bash
platform logs --project your-project-id
```

To stream logs in real-time:

```bash
platform logs --project your-project-id --follow
```

## Next Steps

- Check out the [CLI Reference](./cli-reference.md) for a complete list of commands
- Set up [continuous deployment](./ci-cd-integration.md) from your Git repository
- Learn about [scaling your application](./scaling.md) as your traffic grows