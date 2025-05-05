import { Command } from 'commander';
import { ApiClient } from '../utils/api';
import { ConfigManager } from '../utils/config';
import { Formatter } from '../utils/formatter';

export function databasesCommands(program: Command, config: ConfigManager) {
  const databases = program.command('databases')
    .description('Manage your database instances');

  // List all databases
  databases.command('list')
    .description('List all your databases')
    .option('-f, --format <format>', 'Output format (table, json)', 'table')
    .action(async (options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start('Fetching databases...');
      
      try {
        const response = await apiClient.getDatabases();
        spinner.stop();
        
        if (response.status !== 200 || !response.data) {
          console.log(Formatter.error('Failed to fetch databases.'));
          return;
        }
        
        const databases = response.data;
        
        if (databases.length === 0) {
          console.log(Formatter.info('You have no databases yet.'));
          console.log(Formatter.dim('Create one with `platform databases create`'));
          return;
        }
        
        if (options.format === 'json') {
          console.log(JSON.stringify(databases, null, 2));
          return;
        }
        
        // Format for display
        const formattedDatabases = databases.map(db => {
          // Convert dates to readable format
          const created = new Date(db.createdAt).toLocaleString();
          
          return {
            ID: db.id,
            Name: db.name,
            Type: db.type,
            Project: db.projectId ? `#${db.projectId}` : Formatter.dim('none'),
            Status: db.status ? (db.status === 'running' ? Formatter.success('running') : Formatter.error(db.status)) : Formatter.success('running'),
            Created: created
          };
        });
        
        console.log(Formatter.header('Your Databases'));
        console.log(Formatter.table(formattedDatabases));
        
      } catch (error) {
        spinner.stop('Failed to fetch databases', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Create a new database
  databases.command('create')
    .description('Create a new database')
    .requiredOption('-n, --name <name>', 'Database name')
    .requiredOption('-t, --type <type>', 'Database type (PostgreSQL, MySQL, Redis, MongoDB)')
    .option('-p, --project <project>', 'Project ID to assign the database to')
    .action(async (options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start('Creating database...');
      
      try {
        const dbData = {
          name: options.name,
          type: options.type,
          projectId: options.project ? parseInt(options.project, 10) : undefined
        };
        
        const response = await apiClient.createDatabase(dbData);
        
        if (response.status !== 201 || !response.data) {
          spinner.stop('Failed to create database', 'error');
          return;
        }
        
        const database = response.data;
        spinner.stop(`Database ${database.name} created successfully!`, 'success');
        
        console.log('\nDatabase details:');
        console.log(`  ID: ${database.id}`);
        console.log(`  Name: ${database.name}`);
        console.log(`  Type: ${database.type}`);
        console.log(`  Created: ${new Date(database.createdAt).toLocaleString()}`);
        
        if (database.projectId) {
          console.log(`  Assigned to project: #${database.projectId}`);
        }
        
        console.log('\nConnection details:');
        console.log(`  Connection string: ${Formatter.dim(database.connectionString)}`);
        
        console.log('\nEnvironment variable:');
        console.log(Formatter.dim(`  DATABASE_URL=${database.connectionString}`));
        
        console.log('\nHelp commands:');
        console.log(Formatter.dim(`  platform databases connect ${database.id}     # Connect to database CLI`));
        console.log(Formatter.dim(`  platform databases info ${database.id}        # Show connection details`));
        
      } catch (error) {
        spinner.stop('Failed to create database', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // View database details
  databases.command('info <id>')
    .description('Get details about a specific database')
    .option('-f, --format <format>', 'Output format (pretty, json)', 'pretty')
    .option('--show-credentials', 'Show connection credentials in plain text', false)
    .action(async (id, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Fetching database ${id}...`);
      
      try {
        // In a real client, we would fetch specific database details
        // For this mock, we'll use getDatabases and filter
        const response = await apiClient.getDatabases();
        
        if (response.status !== 200 || !response.data) {
          spinner.stop('Failed to fetch database', 'error');
          return;
        }
        
        const database = response.data.find(db => db.id.toString() === id.toString());
        
        if (!database) {
          spinner.stop(`Database with ID ${id} not found`, 'error');
          return;
        }
        
        spinner.stop();
        
        if (options.format === 'json') {
          console.log(JSON.stringify(database, null, 2));
          return;
        }
        
        // Pretty format
        console.log(Formatter.header(`Database: ${database.name}`));
        console.log(`ID: ${database.id}`);
        console.log(`Name: ${database.name}`);
        console.log(`Type: ${database.type}`);
        console.log(`Status: ${Formatter.success('running')}`);
        console.log(`Created: ${new Date(database.createdAt).toLocaleString()}`);
        
        if (database.projectId) {
          console.log(`Assigned to project: #${database.projectId}`);
        }
        
        console.log('\nConnection details:');
        if (options.showCredentials) {
          console.log(`Connection string: ${database.connectionString}`);
        } else {
          console.log(`Connection string: ${Formatter.dim('**** (use --show-credentials to reveal)')}`);
        }
        
        // Parse connection string to show details
        const connectionParts = database.connectionString.split('://');
        if (connectionParts.length === 2) {
          const protocol = connectionParts[0];
          const restParts = connectionParts[1].split('@');
          let host, credentials;
          
          if (restParts.length === 2) {
            [credentials, host] = restParts;
          } else {
            host = restParts[0];
            credentials = '';
          }
          
          console.log('\nEndpoint information:');
          console.log(`Protocol: ${protocol}`);
          console.log(`Host: ${host.split('/')[0]}`);
          
          if (options.showCredentials && credentials) {
            const [username, password] = credentials.split(':');
            console.log('Authentication:');
            console.log(`Username: ${username}`);
            console.log(`Password: ${password}`);
          }
        }
        
        console.log('\nUsage with environment variables:');
        console.log(Formatter.dim(`export DATABASE_URL="${database.connectionString}"`));
        
      } catch (error) {
        spinner.stop('Failed to fetch database', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Delete a database
  databases.command('delete <id>')
    .description('Delete a database')
    .option('-f, --force', 'Skip confirmation', false)
    .action(async (id, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      
      if (!options.force) {
        console.log(Formatter.warn('Warning: This action cannot be undone. ALL DATA WILL BE LOST.'));
        console.log(Formatter.warn('Run with --force to skip this confirmation.'));
        
        // Here you would typically prompt for confirmation
        // For simplicity, we'll just proceed
        console.log(Formatter.info('Proceeding with deletion...'));
      }
      
      const spinner = Formatter.createSpinner();
      spinner.start(`Deleting database ${id}...`);
      
      try {
        // In a real implementation, we would call a delete endpoint
        // For this mock, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        spinner.stop(`Database ${id} has been deleted`, 'success');
        
      } catch (error) {
        spinner.stop(`Failed to delete database ${id}`, 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Connect to a database
  databases.command('connect <id>')
    .description('Connect to a database CLI')
    .action(async (id) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Preparing connection to database ${id}...`);
      
      try {
        // In a real client, we would fetch database details
        const response = await apiClient.getDatabases();
        
        if (response.status !== 200 || !response.data) {
          spinner.stop('Failed to fetch database', 'error');
          return;
        }
        
        const database = response.data.find(db => db.id.toString() === id.toString());
        
        if (!database) {
          spinner.stop(`Database with ID ${id} not found`, 'error');
          return;
        }
        
        spinner.stop('Ready to connect', 'success');
        
        console.log(Formatter.info(`Connecting to ${database.type} database: ${database.name}`));
        console.log('Type "exit" to quit the connection\n');
        
        // In a real CLI, we would now spawn a child process with the appropriate database CLI
        // For this mock, we'll just simulate it
        console.log(Formatter.dim('Connection established. Interactive shell:'));
        
        if (database.type === 'PostgreSQL') {
          console.log(Formatter.dim('psql (14.10)'));
          console.log(Formatter.dim('Type "help" for help.'));
          console.log('');
          console.log(Formatter.dim(`${database.name}=# `));
        } else if (database.type === 'MySQL') {
          console.log(Formatter.dim('MySQL [5.7.38]'));
          console.log(Formatter.dim('Copyright (c) 2000, 2022, Oracle and/or its affiliates.'));
          console.log('');
          console.log(Formatter.dim(`mysql> `));
        } else if (database.type === 'Redis') {
          console.log(Formatter.dim('redis-cli 6.2.6'));
          console.log(Formatter.dim('Connected to Redis'));
          console.log('');
          console.log(Formatter.dim(`127.0.0.1:6379> `));
        } else if (database.type === 'MongoDB') {
          console.log(Formatter.dim('MongoDB shell version v5.0.8'));
          console.log(Formatter.dim('connecting to: mongodb://127.0.0.1:27017'));
          console.log('');
          console.log(Formatter.dim(`> `));
        }
        
        console.log(Formatter.info('\n[This is a simulated database connection for demonstration]'));
        
      } catch (error) {
        spinner.stop('Failed to connect to database', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  return databases;
}