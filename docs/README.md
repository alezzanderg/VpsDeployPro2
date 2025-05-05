# Your Platform CLI

The official command-line interface for Your Platform - the simplest way to deploy and manage your applications, domains, and databases on a VPS.

![CLI Demo](https://example.com/cli-demo.gif)

## Features

- **Project Management**: Create, deploy, and manage your projects
- **Domain Handling**: Configure custom domains for your applications
- **Database Provisioning**: Create and connect databases to your projects
- **Real-time Logs**: Stream logs from your deployed applications
- **Resource Monitoring**: Track CPU, memory, and network usage

## Installation

```bash
npm install -g @your-platform/cli
```

## Quick Start

```bash
# Log in to your account
platform login

# Initialize a new project
platform init

# Deploy your project
platform deploy
```

## Documentation

- [Getting Started Guide](./cli-getting-started.md)
- [CLI Reference](./cli-reference.md)
- [Implementation Details](./cli-implementation.md)

## Examples

### Deploying a React application

```bash
# Navigate to your project
cd my-react-app

# Initialize
platform init --framework react

# Deploy
platform deploy
```

### Adding a custom domain

```bash
platform domains add --name example.com --project my-project
```

### Creating a database

```bash
platform databases create --name my-db --type postgres --project my-project
```

## Requirements

- Node.js 14.x or higher
- npm or yarn
- A registered account on our platform

## Contributing

We welcome contributions to the CLI! Please see our [Contributing Guide](./CONTRIBUTING.md) for more details.

## License

MIT

## Support

If you need help with the CLI, please:

- Check the [documentation](https://docs.yourplatform.com/cli)
- Join our [Discord community](https://discord.gg/yourplatform)
- Open an issue on [GitHub](https://github.com/yourplatform/cli/issues)

---

Made with ❤️ by the team at Your Platform