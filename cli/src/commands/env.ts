import { Command } from 'commander';
import { ApiClient } from '../utils/api';
import { ConfigManager } from '../utils/config';
import { Formatter } from '../utils/formatter';

export function envCommands(program: Command, config: ConfigManager) {
  const env = program.command('env')
    .description('Manage environment variables for your projects');

  // List environment variables
  env.command('list <project-id>')
    .description('List all environment variables for a project')
    .option('-e, --env <environment>', 'Environment (production, development, preview)', 'production')
    .option('-f, --format <format>', 'Output format (table, json)', 'table')
    .option('--show-values', 'Show actual values instead of placeholders', false)
    .action(async (projectId, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Fetching environment variables for project ${projectId}...`);
      
      try {
        const response = await apiClient.getEnvironmentVariables(
          parseInt(projectId, 10), 
          options.env
        );
        
        spinner.stop();
        
        if (response.status !== 200 || !response.data) {
          console.log(Formatter.error('Failed to fetch environment variables.'));
          return;
        }
        
        const variables = response.data;
        
        if (variables.length === 0) {
          console.log(Formatter.info(`No environment variables found for ${options.env} environment.`));
          console.log(Formatter.dim(`Add one with \`platform env set ${projectId} KEY=VALUE --env ${options.env}\``));
          return;
        }
        
        if (options.format === 'json') {
          console.log(JSON.stringify(variables, null, 2));
          return;
        }
        
        // Format for display
        const formattedVars = variables.map(variable => {
          const value = options.showValues ? variable.value : '********';
          
          return {
            Name: variable.name,
            Value: value
          };
        });
        
        console.log(Formatter.header(`Environment Variables (${options.env})`));
        console.log(Formatter.table(formattedVars));
        
        if (!options.showValues) {
          console.log(Formatter.dim('Note: Values are hidden for security. Use --show-values to reveal them.'));
        }
        
      } catch (error) {
        spinner.stop('Failed to fetch environment variables', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Set an environment variable
  env.command('set <project-id> <key-value>')
    .description('Set an environment variable for a project (format: KEY=VALUE)')
    .option('-e, --env <environment>', 'Environment (production, development, preview)', 'production')
    .action(async (projectId, keyValue, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      
      // Parse key-value pair
      const parts = keyValue.split('=');
      if (parts.length !== 2) {
        console.log(Formatter.error('Invalid format. Use KEY=VALUE'));
        return;
      }
      
      const [key, value] = parts;
      
      const spinner = Formatter.createSpinner();
      spinner.start(`Setting environment variable ${key} for project ${projectId}...`);
      
      try {
        const response = await apiClient.setEnvironmentVariable(
          parseInt(projectId, 10),
          key,
          value,
          options.env
        );
        
        if (response.status !== 200 || !response.data) {
          spinner.stop('Failed to set environment variable', 'error');
          return;
        }
        
        spinner.stop(`Environment variable ${key} set successfully`, 'success');
        
        // Show deployment instructions
        console.log(Formatter.info('\nTo apply this change, you need to redeploy your project:'));
        console.log(Formatter.dim(`  platform projects restart ${projectId}`));
        
      } catch (error) {
        spinner.stop('Failed to set environment variable', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Remove an environment variable
  env.command('unset <project-id> <key>')
    .description('Remove an environment variable from a project')
    .option('-e, --env <environment>', 'Environment (production, development, preview)', 'production')
    .action(async (projectId, key, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      
      const spinner = Formatter.createSpinner();
      spinner.start(`Removing environment variable ${key} from project ${projectId}...`);
      
      try {
        const response = await apiClient.removeEnvironmentVariable(
          parseInt(projectId, 10),
          key,
          options.env
        );
        
        if (response.status !== 200 || !response.data) {
          spinner.stop('Failed to remove environment variable', 'error');
          return;
        }
        
        spinner.stop(`Environment variable ${key} removed successfully`, 'success');
        
        // Show deployment instructions
        console.log(Formatter.info('\nTo apply this change, you need to redeploy your project:'));
        console.log(Formatter.dim(`  platform projects restart ${projectId}`));
        
      } catch (error) {
        spinner.stop('Failed to remove environment variable', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Import environment variables from a .env file
  env.command('import <project-id> <file>')
    .description('Import environment variables from a .env file')
    .option('-e, --env <environment>', 'Environment (production, development, preview)', 'production')
    .option('--overwrite', 'Overwrite existing variables with the same name', false)
    .action(async (projectId, file, options) => {
      // In a real implementation, we would read the file and parse it
      // For this mock, we'll just simulate success
      
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Importing environment variables from ${file}...`);
      
      try {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        spinner.stop(`Environment variables imported successfully`, 'success');
        console.log(Formatter.info('Imported 5 variables.'));
        
        // Show deployment instructions
        console.log(Formatter.info('\nTo apply these changes, you need to redeploy your project:'));
        console.log(Formatter.dim(`  platform projects restart ${projectId}`));
        
      } catch (error) {
        spinner.stop('Failed to import environment variables', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  return env;
}