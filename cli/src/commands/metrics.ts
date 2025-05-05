import { Command } from 'commander';
import { ApiClient } from '../utils/api';
import { ConfigManager } from '../utils/config';
import { Formatter } from '../utils/formatter';

export function metricsCommands(program: Command, config: ConfigManager) {
  const metrics = program.command('metrics')
    .description('View performance metrics for your projects');

  // Get system metrics
  metrics.command('system')
    .description('View system-wide resource usage metrics')
    .option('-f, --format <format>', 'Output format (pretty, json)', 'pretty')
    .action(async (options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start('Fetching system metrics...');
      
      try {
        const response = await apiClient.getMetrics();
        spinner.stop();
        
        if (response.status !== 200 || !response.data) {
          console.log(Formatter.error('Failed to fetch metrics.'));
          return;
        }
        
        const metrics = response.data;
        
        if (options.format === 'json') {
          console.log(JSON.stringify(metrics, null, 2));
          return;
        }
        
        console.log(Formatter.header('System Resource Usage'));
        console.log(`Timestamp: ${new Date(metrics.timestamp).toLocaleString()}`);
        console.log();
        
        // CPU usage
        const cpuUsage = metrics.cpuUsage;
        let cpuColor = Formatter.colors.green;
        if (cpuUsage > 70) {
          cpuColor = Formatter.colors.red;
        } else if (cpuUsage > 40) {
          cpuColor = Formatter.colors.yellow;
        }
        
        console.log('CPU Usage:');
        const cpuBar = createProgressBar(cpuUsage, 100, cpuColor);
        console.log(`  ${cpuBar} ${cpuUsage}%`);
        
        // Memory usage
        const memoryUsage = metrics.memoryUsage;
        let memoryColor = Formatter.colors.green;
        if (memoryUsage > 80) {
          memoryColor = Formatter.colors.red;
        } else if (memoryUsage > 60) {
          memoryColor = Formatter.colors.yellow;
        }
        
        console.log('\nMemory Usage:');
        const memoryBar = createProgressBar(memoryUsage, 100, memoryColor);
        console.log(`  ${memoryBar} ${memoryUsage}%`);
        
        // Disk usage
        const diskUsage = metrics.diskUsage;
        let diskColor = Formatter.colors.green;
        if (diskUsage > 85) {
          diskColor = Formatter.colors.red;
        } else if (diskUsage > 70) {
          diskColor = Formatter.colors.yellow;
        }
        
        console.log('\nDisk Usage:');
        const diskBar = createProgressBar(diskUsage, 100, diskColor);
        console.log(`  ${diskBar} ${diskUsage}%`);
        
        // Network usage
        console.log('\nNetwork Usage:');
        console.log(`  Inbound: ${metrics.networkIn} KB/s`);
        console.log(`  Outbound: ${metrics.networkOut} KB/s`);
        
        if (metrics.requestCount) {
          console.log(`  Request Rate: ${metrics.requestCount} req/min`);
        }
        
        if (metrics.responseTime) {
          console.log(`  Avg Response Time: ${metrics.responseTime} ms`);
        }
        
        console.log('\nRecommendations:');
        if (cpuUsage > 70) {
          console.log(Formatter.warn('⚠ CPU usage is high. Consider scaling up your infrastructure.'));
        }
        if (memoryUsage > 80) {
          console.log(Formatter.warn('⚠ Memory usage is high. Check for memory leaks or scale up.'));
        }
        if (diskUsage > 85) {
          console.log(Formatter.warn('⚠ Disk usage is critical. Free up space or expand storage.'));
        }
        if (cpuUsage < 10 && memoryUsage < 20) {
          console.log(Formatter.info('ℹ Resource usage is low. Consider downsizing to save costs.'));
        }
        
      } catch (error) {
        spinner.stop('Failed to fetch metrics', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  // Get project metrics
  metrics.command('project <id>')
    .description('View resource usage metrics for a specific project')
    .option('-f, --format <format>', 'Output format (pretty, json)', 'pretty')
    .action(async (id, options) => {
      const apiClient = new ApiClient(config.getApiUrl(), config.getToken());
      const spinner = Formatter.createSpinner();
      
      spinner.start(`Fetching metrics for project ${id}...`);
      
      try {
        const response = await apiClient.getMetrics(parseInt(id, 10));
        spinner.stop();
        
        if (response.status !== 200 || !response.data) {
          console.log(Formatter.error('Failed to fetch metrics.'));
          return;
        }
        
        const metrics = response.data;
        
        if (options.format === 'json') {
          console.log(JSON.stringify(metrics, null, 2));
          return;
        }
        
        console.log(Formatter.header(`Metrics for Project #${id}`));
        console.log(`Timestamp: ${new Date(metrics.timestamp).toLocaleString()}`);
        console.log();
        
        // CPU usage
        const cpuUsage = metrics.cpuUsage;
        let cpuColor = Formatter.colors.green;
        if (cpuUsage > 70) {
          cpuColor = Formatter.colors.red;
        } else if (cpuUsage > 40) {
          cpuColor = Formatter.colors.yellow;
        }
        
        console.log('CPU Usage:');
        const cpuBar = createProgressBar(cpuUsage, 100, cpuColor);
        console.log(`  ${cpuBar} ${cpuUsage}%`);
        
        // Memory usage
        const memoryUsage = metrics.memoryUsage;
        let memoryColor = Formatter.colors.green;
        if (memoryUsage > 80) {
          memoryColor = Formatter.colors.red;
        } else if (memoryUsage > 60) {
          memoryColor = Formatter.colors.yellow;
        }
        
        console.log('\nMemory Usage:');
        const memoryBar = createProgressBar(memoryUsage, 100, memoryColor);
        console.log(`  ${memoryBar} ${memoryUsage}%`);
        
        // Network usage
        console.log('\nNetwork Usage:');
        console.log(`  Inbound: ${metrics.networkIn} KB/s`);
        console.log(`  Outbound: ${metrics.networkOut} KB/s`);
        
        if (metrics.requestCount) {
          console.log(`  Request Rate: ${metrics.requestCount} req/min`);
        }
        
        if (metrics.responseTime) {
          console.log(`  Avg Response Time: ${metrics.responseTime} ms`);
        }
        
        console.log('\nRecommendations:');
        if (cpuUsage > 70) {
          console.log(Formatter.warn('⚠ CPU usage is high. Consider scaling up your project.'));
        }
        if (memoryUsage > 80) {
          console.log(Formatter.warn('⚠ Memory usage is high. Check for memory leaks or increase allocation.'));
        }
        if (metrics.responseTime && metrics.responseTime > 200) {
          console.log(Formatter.warn('⚠ Response times are slow. Check for performance bottlenecks.'));
        }
        
      } catch (error) {
        spinner.stop('Failed to fetch metrics', 'error');
        if (error instanceof Error) {
          console.log(Formatter.error(error.message));
        }
      }
    });

  return metrics;
}

// Helper function to create a colored progress bar
function createProgressBar(current: number, total: number, color: string, width: number = 30): string {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100))) / 100;
  const filledWidth = Math.round(percentage * width);
  const emptyWidth = width - filledWidth;
  
  const filledBar = color + '█'.repeat(filledWidth);
  const emptyBar = Formatter.colors.dim + '░'.repeat(emptyWidth);
  
  return filledBar + emptyBar + Formatter.colors.reset;
}