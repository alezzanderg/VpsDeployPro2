# CLI Implementation Guide

This document outlines the design and implementation details of our CLI tool, intended for developers who want to understand how the CLI works or contribute to its development.

## Architecture Overview

The CLI is built with a modular architecture that follows these principles:

1. **Command Structure**: Commands are organized in a hierarchical tree structure
2. **API Abstraction**: All interactions with the platform API are abstracted
3. **Extensibility**: New commands can be added with minimal changes to existing code

## Directory Structure

```
cli/
├── bin/              # Binary entry points
├── src/
│   ├── commands/     # Command implementations
│   │   ├── projects/
│   │   ├── domains/
│   │   ├── databases/
│   │   └── ...
│   ├── lib/          # Shared libraries
│   │   ├── api.ts    # API client
│   │   ├── config.ts # Configuration management
│   │   └── output.ts # Output formatting
│   └── util/         # Utility functions
├── tests/            # Test suite
└── package.json
```

## Core Components

### Command Runner

The command runner parses command-line arguments and routes them to the appropriate command handler. It handles:

- Command registration and discovery
- Argument parsing and validation
- Help text generation
- Error handling

Implementation example:

```typescript
class CommandRunner {
  private commands: Map<string, Command> = new Map();

  register(name: string, command: Command): void {
    this.commands.set(name, command);
  }

  async run(args: string[]): Promise<void> {
    const commandName = args[0];
    const command = this.commands.get(commandName);
    
    if (!command) {
      throw new Error(`Unknown command: ${commandName}`);
    }
    
    await command.execute(args.slice(1));
  }
}
```

### API Client

The API client provides a clean interface for interacting with the platform API:

```typescript
class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(config: Config) {
    this.baseUrl = config.get('apiUrl');
    this.token = config.get('token');
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    // Implementation
  }

  async post<T>(path: string, data: any): Promise<T> {
    // Implementation
  }

  // Other HTTP methods...
}
```

### Configuration Manager

The configuration manager handles user preferences, API tokens, and other settings:

```typescript
class Config {
  private store: Record<string, any> = {};
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
  }

  get(key: string): any {
    return this.store[key];
  }

  set(key: string, value: any): void {
    this.store[key] = value;
    this.save();
  }

  private load(): void {
    // Load from file
  }

  private save(): void {
    // Save to file
  }
}
```

## Command Implementation

Commands are implemented as classes that inherit from a base Command class:

```typescript
abstract class Command {
  abstract get name(): string;
  abstract get description(): string;
  abstract execute(args: string[]): Promise<void>;
}

class ProjectsListCommand extends Command {
  get name(): string {
    return 'projects:list';
  }

  get description(): string {
    return 'List all projects';
  }

  async execute(args: string[]): Promise<void> {
    // Implementation
  }
}
```

## Authentication Flow

The CLI uses OAuth 2.0 for authentication:

1. User initiates login via `platform login`
2. CLI opens a browser to the authorization endpoint
3. User authenticates with the platform
4. Platform redirects back to the CLI with an authorization code
5. CLI exchanges the code for an access token
6. Token is stored securely in the user's configuration

## Output Formatting

The CLI supports different output formats:

- **Human-readable**: Default colorized text output
- **JSON**: Structured output for scripting
- **Quiet**: Minimal output for automation

Example implementation:

```typescript
class Output {
  private format: 'human' | 'json' | 'quiet';

  constructor(format: 'human' | 'json' | 'quiet' = 'human') {
    this.format = format;
  }

  table(data: any[], columns: string[]): void {
    if (this.format === 'json') {
      console.log(JSON.stringify(data));
      return;
    }

    if (this.format === 'quiet') {
      return;
    }

    // Format as a table for human-readable output
    // ...
  }
}
```

## Error Handling

The CLI uses a structured approach to error handling:

```typescript
class CliError extends Error {
  readonly code: string;
  readonly exitCode: number;

  constructor(message: string, code: string, exitCode: number = 1) {
    super(message);
    this.code = code;
    this.exitCode = exitCode;
  }
}

// Usage
throw new CliError('Failed to authenticate', 'AUTH_ERROR', 2);
```

## Testing

The CLI is tested using:

- **Unit tests**: Testing individual components in isolation
- **Integration tests**: Testing commands against a mock API
- **E2E tests**: Testing the entire CLI against a real API instance

## Plugin System

The CLI supports plugins to extend functionality:

```typescript
interface Plugin {
  name: string;
  commands: Command[];
  hooks: Record<string, Function>;
}

class PluginManager {
  private plugins: Plugin[] = [];

  register(plugin: Plugin): void {
    this.plugins.push(plugin);
  }

  getCommands(): Command[] {
    return this.plugins.flatMap(plugin => plugin.commands);
  }

  invokeHook(name: string, ...args: any[]): void {
    for (const plugin of this.plugins) {
      const hook = plugin.hooks[name];
      if (hook) {
        hook(...args);
      }
    }
  }
}
```

## Contributing Guidelines

1. **Code Style**: Follow the project's ESLint and Prettier configuration
2. **Testing**: Add tests for new functionality
3. **Documentation**: Update this document with any architectural changes
4. **Pull Requests**: Include a description of changes and link to related issues