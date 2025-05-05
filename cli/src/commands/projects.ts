import { Command } from 'commander';
import { ApiClient } from '../utils/api';
import { ConfigManager } from '../utils/config';
import { Formatter } from '../utils/formatter';

export function projectsCommands(program: Command, config: ConfigManager) {
  const projects = program.command('projects')
    .description('Manage your deployed projects');

  // List all projects
  projects.command('list')
    .description('List all your projects')
    .option('-f, --format <format>', 'Output format (table, json)', 'table')
    .action(async (options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start('Fetching projects...');
      
      try {
        const response = await apiClient.getProjects();
        spinner.stop();
        
        if (response.status !== 200 || !response.data) {
          console.log(Formatter.error('Failed to fetch projects.'));
          return;
        }
        
        const projects = response.data;
        
        if (projects.length === 0) {
          console.log(Formatter.info('You have no projects yet.'));
          console.log(Formatter.dim('Create one with `platform projects create`'));
          return;
        }
        
        if (options.format === 'json') {
          console.log(JSON.stringify(projects, null, 2));
          return;
        }
        
        // Format for display
        const formattedProjects = projects.map(project => {
          // Add status color
          let status = project.status;
          if (project.status === 'live') {
            status = Formatter.success(project.status);
          } else if (project.status === 'building') {
            status = Formatter.info(project.status);
          } else if (project.status === 'error') {
            status = Formatter.error(project.status);
          } else {
            status = Formatter.dim(project.status);
          }
          
          // Convert dates to readable format
          const created = new Date(project.createdAt).toLocaleString();
          
          return {
            ID: project.id,
            Name: project.name,
            Framework: project.framework,
            Status: status,
            Created: created,
            Domain: project.domain || Formatter.dim('none')
          };
        });
        
        console.log(Formatter.header('Your Projects'));
        console.log(Formatter.table(formattedProjects));
        
      } catch (error) {
        spinner.stop('Failed to fetch projects', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Create a new project
  projects.command('create')
    .description('Create a new project')
    .requiredOption('-n, --name <name>', 'Project name')
    .requiredOption('-f, --framework <framework>', 'Project framework (React, Vue.js, Next.js, Express.js, etc.)')
    .requiredOption('-r, --repo <repository>', 'Git repository URL')
    .option('-b, --branch <branch>', 'Git branch to deploy', 'main')
    .option('-d, --domain <domain>', 'Custom domain for the project')
    .option('--database', 'Provision a database for this project', false)
    .action(async (options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start('Creating project...');
      
      try {
        const projectData = {
          name: options.name,
          framework: options.framework,
          repositoryUrl: options.repo,
          branch: options.branch,
          domain: options.domain,
          createDatabase: options.database
        };
        
        const response = await apiClient.createProject(projectData);
        
        if (response.status !== 201 || !response.data) {
          spinner.stop('Failed to create project', 'error');
          return;
        }
        
        const project = response.data;
        spinner.stop(`Project ${project.name} created successfully!`, 'success');
        
        console.log('\nProject details:');
        console.log(`  ID: ${project.id}`);
        console.log(`  Name: ${project.name}`);
        console.log(`  Framework: ${project.framework}`);
        console.log(`  Repository: ${project.repositoryUrl}`);
        console.log(`  Branch: ${project.branch}`);
        console.log(`  Status: ${Formatter.info(project.status)}`);
        console.log(`  Created: ${new Date(project.createdAt).toLocaleString()}`);
        
        if (project.domain) {
          console.log(`  Domain: ${project.domain}`);
        }
        
        console.log('\nYour project is now building. Check deployment status with:');
        console.log(Formatter.dim(`  platform projects status ${project.id}`));
        
      } catch (error) {
        spinner.stop('Failed to create project', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // View project details
  projects.command('info <id>')
    .description('Get details about a specific project')
    .option('-f, --format <format>', 'Output format (pretty, json)', 'pretty')
    .action(async (id, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Fetching project ${id}...`);
      
      try {
        // In a real client, we would fetch specific project details
        // For this mock, we'll use getProjects and filter
        const response = await apiClient.getProjects();
        
        if (response.status !== 200 || !response.data) {
          spinner.stop('Failed to fetch project', 'error');
          return;
        }
        
        const project = response.data.find(p => p.id.toString() === id.toString());
        
        if (!project) {
          spinner.stop(`Project with ID ${id} not found`, 'error');
          return;
        }
        
        spinner.stop();
        
        if (options.format === 'json') {
          console.log(JSON.stringify(project, null, 2));
          return;
        }
        
        // Pretty format
        console.log(Formatter.header(`Project: ${project.name}`));
        console.log(`ID: ${project.id}`);
        console.log(`Name: ${project.name}`);
        console.log(`Framework: ${project.framework}`);
        console.log(`Repository: ${project.repositoryUrl}`);
        console.log(`Branch: ${project.branch}`);
        
        // Format status
        let statusText = project.status;
        if (project.status === 'live') {
          statusText = Formatter.success(project.status);
        } else if (project.status === 'building') {
          statusText = Formatter.info(project.status);
        } else if (project.status === 'error') {
          statusText = Formatter.error(project.status);
        } else {
          statusText = Formatter.dim(project.status);
        }
        console.log(`Status: ${statusText}`);
        
        console.log(`Created: ${new Date(project.createdAt).toLocaleString()}`);
        console.log(`Last Updated: ${new Date(project.updatedAt).toLocaleString()}`);
        
        if (project.domain) {
          console.log(`Domain: ${project.domain}`);
        }
        
        // Show available actions
        console.log('\nAvailable actions:');
        console.log(Formatter.dim(`  platform projects logs ${id}      # View logs`));
        console.log(Formatter.dim(`  platform projects restart ${id}   # Restart the project`));
        console.log(Formatter.dim(`  platform env list ${id}           # Manage environment variables`));
        
      } catch (error) {
        spinner.stop('Failed to fetch project', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Restart a project
  projects.command('restart <id>')
    .description('Restart a project deployment')
    .action(async (id) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Restarting project ${id}...`);
      
      try {
        // In a real implementation, we would call a restart endpoint
        // For this mock, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        spinner.stop(`Project ${id} restarted successfully`, 'success');
        console.log(Formatter.info('The project is now rebuilding. This may take a few minutes.'));
        console.log(Formatter.dim(`Check status with: platform projects status ${id}`));
        
      } catch (error) {
        spinner.stop(`Failed to restart project ${id}`, 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Delete a project
  projects.command('delete <id>')
    .description('Delete a project')
    .option('-f, --force', 'Skip confirmation', false)
    .action(async (id, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      
      // In a real implementation, we would first fetch the project to confirm
      // For this mock, we'll simulate that
      
      if (!options.force) {
        console.log(Formatter.warn('Warning: This action cannot be undone.'));
        console.log(Formatter.warn('Run with --force to skip this confirmation.'));
        
        // Here you would typically prompt for confirmation
        // For simplicity, we'll just proceed
        console.log(Formatter.info('Proceeding with deletion...'));
      }
      
      const spinner = Formatter.createSpinner();
      spinner.start(`Deleting project ${id}...`);
      
      try {
        // In a real implementation, we would call a delete endpoint
        // For this mock, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        spinner.stop(`Project ${id} has been deleted`, 'success');
        
      } catch (error) {
        spinner.stop(`Failed to delete project ${id}`, 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  return projects;
}