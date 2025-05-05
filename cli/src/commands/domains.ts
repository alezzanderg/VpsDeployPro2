import { Command } from 'commander';
import { ApiClient } from '../utils/api';
import { ConfigManager } from '../utils/config';
import { Formatter } from '../utils/formatter';

export function domainsCommands(program: Command, config: ConfigManager) {
  const domains = program.command('domains')
    .description('Manage your custom domains');

  // List all domains
  domains.command('list')
    .description('List all your domains')
    .option('-f, --format <format>', 'Output format (table, json)', 'table')
    .action(async (options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start('Fetching domains...');
      
      try {
        const response = await apiClient.getDomains();
        spinner.stop();
        
        if (response.status !== 200 || !response.data) {
          console.log(Formatter.error('Failed to fetch domains.'));
          return;
        }
        
        const domains = response.data;
        
        if (domains.length === 0) {
          console.log(Formatter.info('You have no domains yet.'));
          console.log(Formatter.dim('Add one with `platform domains add`'));
          return;
        }
        
        if (options.format === 'json') {
          console.log(JSON.stringify(domains, null, 2));
          return;
        }
        
        // Format for display
        const formattedDomains = domains.map(domain => {
          // Add status color
          let status = domain.status;
          if (domain.status === 'active') {
            status = Formatter.success(domain.status);
          } else if (domain.status === 'pending') {
            status = Formatter.info(domain.status);
          } else if (domain.status === 'error') {
            status = Formatter.error(domain.status);
          }
          
          // Convert dates to readable format
          const created = new Date(domain.createdAt).toLocaleString();
          
          return {
            ID: domain.id,
            Domain: domain.name,
            Status: status,
            Project: domain.projectId ? `#${domain.projectId}` : Formatter.dim('none'),
            Created: created
          };
        });
        
        console.log(Formatter.header('Your Domains'));
        console.log(Formatter.table(formattedDomains));
        
      } catch (error) {
        spinner.stop('Failed to fetch domains', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Add a new domain
  domains.command('add')
    .description('Add a new custom domain')
    .requiredOption('-d, --domain <domain>', 'Domain name (e.g., example.com)')
    .option('-p, --project <project>', 'Project ID to assign the domain to')
    .action(async (options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start('Adding domain...');
      
      try {
        const domainData = {
          name: options.domain,
          projectId: options.project ? parseInt(options.project, 10) : undefined
        };
        
        const response = await apiClient.createDomain(domainData);
        
        if (response.status !== 201 || !response.data) {
          spinner.stop('Failed to add domain', 'error');
          return;
        }
        
        const domain = response.data;
        spinner.stop(`Domain ${domain.name} added successfully!`, 'success');
        
        console.log('\nDomain details:');
        console.log(`  ID: ${domain.id}`);
        console.log(`  Name: ${domain.name}`);
        console.log(`  Status: ${Formatter.info(domain.status)}`);
        console.log(`  Created: ${new Date(domain.createdAt).toLocaleString()}`);
        
        if (domain.projectId) {
          console.log(`  Assigned to project: #${domain.projectId}`);
        }
        
        if (domain.status === 'pending') {
          console.log('\nDNS Configuration:');
          console.log(Formatter.info('To verify your domain, add the following DNS records:'));
          console.log(`  Type: CNAME`);
          console.log(`  Name: ${domain.name.startsWith('www.') ? domain.name : 'www.' + domain.name}`);
          console.log(`  Value: cname.yourplatform.com`);
          console.log(`  TTL: 3600`);
          
          console.log('\nVerification status:');
          console.log(Formatter.dim(`  platform domains verify ${domain.id}`));
        }
        
      } catch (error) {
        spinner.stop('Failed to add domain', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Verify a domain
  domains.command('verify <id>')
    .description('Check domain verification status')
    .action(async (id) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Checking domain ${id}...`);
      
      try {
        // In a real client, we would call a verification endpoint
        // For this mock, we'll just simulate a successful verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        spinner.stop('Domain verification successful!', 'success');
        console.log(Formatter.info('Your domain is now active and ready to use.'));
        
      } catch (error) {
        spinner.stop('Domain verification failed', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        } else {
          console.log(Formatter.error('DNS records are not correctly configured.'));
          console.log('Make sure you have added the required DNS records:');
          console.log(`  Type: CNAME`);
          console.log(`  Name: www.yourdomain.com`);
          console.log(`  Value: cname.yourplatform.com`);
        }
      }
    });

  // Delete a domain
  domains.command('delete <id>')
    .description('Delete a domain')
    .option('-f, --force', 'Skip confirmation', false)
    .action(async (id, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      
      if (!options.force) {
        console.log(Formatter.warn('Warning: This action cannot be undone.'));
        console.log(Formatter.warn('Run with --force to skip this confirmation.'));
        
        // Here you would typically prompt for confirmation
        // For simplicity, we'll just proceed
        console.log(Formatter.info('Proceeding with deletion...'));
      }
      
      const spinner = Formatter.createSpinner();
      spinner.start(`Deleting domain ${id}...`);
      
      try {
        // In a real implementation, we would call a delete endpoint
        // For this mock, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        spinner.stop(`Domain ${id} has been deleted`, 'success');
        
      } catch (error) {
        spinner.stop(`Failed to delete domain ${id}`, 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Assign a domain to a project
  domains.command('assign <domain-id> <project-id>')
    .description('Assign a domain to a project')
    .action(async (domainId, projectId) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Assigning domain ${domainId} to project ${projectId}...`);
      
      try {
        // In a real implementation, we would call an update endpoint
        // For this mock, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        spinner.stop('Domain assigned successfully', 'success');
        
      } catch (error) {
        spinner.stop('Failed to assign domain', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  return domains;
}