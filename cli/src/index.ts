#!/usr/bin/env node

import { Command } from 'commander';
import { projectsCommands } from './commands/projects';
import { domainsCommands } from './commands/domains';
import { databasesCommands } from './commands/databases';
import { logsCommands } from './commands/logs';
import { metricsCommands } from './commands/metrics';
import { envCommands } from './commands/env';
import { ConfigManager } from './utils/config';
import { Formatter } from './utils/formatter';
import { ApiClient } from './utils/api';

// CLI version
const VERSION = '0.1.0';

// Create the program
const program = new Command();
const config = new ConfigManager();

program
  .name('platform')
  .description('A CLI tool for managing your Vercel-like platform deployment')
  .version(VERSION);

// Register commands
projectsCommands(program, config);
domainsCommands(program, config);
databasesCommands(program, config);
logsCommands(program, config);
metricsCommands(program, config);
envCommands(program, config);

// Login command
program
  .command('login')
  .description('Authenticate with the platform')
  .option('-t, --token <token>', 'API token')
  .option('--api-url <url>', 'API URL')
  .action(async (options) => {
    if (options.apiUrl) {
      config.setApiUrl(options.apiUrl);
      console.log(Formatter.info(`API URL set to ${options.apiUrl}`));
    }
    
    let token = options.token;
    
    if (!token) {
      // In a real implementation, we would prompt for token or open a browser for OAuth
      console.log(Formatter.info('Please provide your API token'));
      console.log(Formatter.dim('You can find your API token in your account settings'));
      console.log(Formatter.dim('Run again with: platform login --token <your-token>'));
      return;
    }
    
    const apiClient = new ApiClient(config.getApiUrl(), token);
    const spinner = Formatter.createSpinner();
    
    spinner.start('Authenticating...');
    
    try {
      // In a real implementation, we would validate the token
      // For this mock, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user = {
        id: 123,
        name: 'Test User',
        email: 'user@example.com'
      };
      
      config.setToken(token);
      config.setUser(user);
      
      spinner.stop('Authentication successful', 'success');
      console.log(`Welcome, ${user.name}!`);
      
    } catch (error) {
      spinner.stop('Authentication failed', 'error');
      if (error instanceof Error) {
        console.log(Formatter.error(error.message));
      }
    }
  });

// Logout command
program
  .command('logout')
  .description('Log out from the platform')
  .action(() => {
    config.clearToken();
    console.log(Formatter.success('You have been logged out.'));
  });

// Status command
program
  .command('status')
  .description('Show the current CLI status and configuration')
  .action(() => {
    console.log(Formatter.header('CLI Status'));
    
    console.log(`Version: ${VERSION}`);
    console.log(`API URL: ${config.getApiUrl()}`);
    
    const user = config.getUser();
    if (user) {
      console.log(`Logged in as: ${user.name} (${user.email})`);
    } else {
      console.log(`Authentication: ${Formatter.dim('Not logged in')}`);
      console.log(Formatter.dim('Run `platform login` to authenticate.'));
    }
  });

// Help command with examples
program
  .command('examples')
  .description('Show usage examples')
  .action(() => {
    console.log(Formatter.header('Usage Examples'));
    
    console.log(Formatter.bold('\nProjects:'));
    console.log('  List all projects:');
    console.log(Formatter.dim('  $ platform projects list'));
    console.log('  Create a new project:');
    console.log(Formatter.dim('  $ platform projects create --name "My App" --framework Next.js --repo https://github.com/user/repo'));
    
    console.log(Formatter.bold('\nDomains:'));
    console.log('  List all domains:');
    console.log(Formatter.dim('  $ platform domains list'));
    console.log('  Add a domain:');
    console.log(Formatter.dim('  $ platform domains add --domain example.com --project 123'));
    
    console.log(Formatter.bold('\nDatabases:'));
    console.log('  List all databases:');
    console.log(Formatter.dim('  $ platform databases list'));
    console.log('  Create a PostgreSQL database:');
    console.log(Formatter.dim('  $ platform databases create --name "main-db" --type PostgreSQL'));
    
    console.log(Formatter.bold('\nLogs:'));
    console.log('  View project logs:');
    console.log(Formatter.dim('  $ platform logs view 123'));
    console.log('  Follow logs in real-time:');
    console.log(Formatter.dim('  $ platform logs view 123 --follow'));
    
    console.log(Formatter.bold('\nEnvironment Variables:'));
    console.log('  List environment variables:');
    console.log(Formatter.dim('  $ platform env list 123'));
    console.log('  Set an environment variable:');
    console.log(Formatter.dim('  $ platform env set 123 API_KEY=my-secret-key'));
  });

// Global error handler for auth issues
program.hook('preAction', (thisCommand, actionCommand) => {
  const commandName = actionCommand.name();
  
  // Skip auth check for these commands
  const skipAuthCommands = ['login', 'logout', 'status', 'examples', 'help'];
  if (skipAuthCommands.includes(commandName)) {
    return;
  }
  
  // Check if user is authenticated
  if (!config.isLoggedIn()) {
    console.log(Formatter.error('Error: You must be logged in to use this command.'));
    console.log(Formatter.dim('Run `platform login` to authenticate.'));
    process.exit(1);
  }
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help();
}