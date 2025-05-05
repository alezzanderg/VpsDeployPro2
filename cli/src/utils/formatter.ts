export class Formatter {
  // ANSI color codes
  static colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
  };

  static success(message: string): string {
    return `${this.colors.green}✓ ${message}${this.colors.reset}`;
  }

  static error(message: string): string {
    return `${this.colors.red}✗ ${message}${this.colors.reset}`;
  }

  static warn(message: string): string {
    return `${this.colors.yellow}⚠ ${message}${this.colors.reset}`;
  }

  static info(message: string): string {
    return `${this.colors.blue}ℹ ${message}${this.colors.reset}`;
  }

  static bold(message: string): string {
    return `${this.colors.bright}${message}${this.colors.reset}`;
  }

  static dim(message: string): string {
    return `${this.colors.dim}${message}${this.colors.reset}`;
  }

  static header(message: string): string {
    return `${this.colors.cyan}${this.colors.bright}${message}${this.colors.reset}`;
  }

  static createProgressBar(current: number, total: number, width: number = 30): string {
    const percentage = Math.round((current / total) * 100);
    const filledWidth = Math.round((current / total) * width);
    const emptyWidth = width - filledWidth;
    
    const filledBar = '█'.repeat(filledWidth);
    const emptyBar = '░'.repeat(emptyWidth);
    
    return `${this.colors.cyan}${filledBar}${this.colors.dim}${emptyBar}${this.colors.reset} ${percentage}%`;
  }

  static table(data: any[], options: { 
    columns?: string[],
    includeHeaders?: boolean,
    pad?: number
  } = {}): string {
    if (!data || data.length === 0) {
      return this.dim('No data available');
    }

    const defaults = {
      columns: Object.keys(data[0]),
      includeHeaders: true,
      pad: 2
    };

    const config = { ...defaults, ...options };

    // Determine column widths
    const widths: Record<string, number> = {};
    config.columns.forEach(col => {
      widths[col] = col.length;
      data.forEach(row => {
        const value = row[col] === undefined ? '' : String(row[col]);
        widths[col] = Math.max(widths[col], value.length);
      });
    });

    // Add padding
    Object.keys(widths).forEach(col => {
      widths[col] += config.pad;
    });

    // Create header row
    let output = '';
    if (config.includeHeaders) {
      const headerRow = config.columns.map(col => 
        this.bold(col.padEnd(widths[col]))
      ).join('');
      
      output += headerRow + '\n';
      output += config.columns.map(col => 
        '─'.repeat(widths[col])
      ).join('') + '\n';
    }

    // Create data rows
    data.forEach(row => {
      const dataRow = config.columns.map(col => {
        const value = row[col] === undefined ? '' : String(row[col]);
        return value.padEnd(widths[col]);
      }).join('');
      
      output += dataRow + '\n';
    });

    return output;
  }

  static createSpinner(): { 
    start: (text?: string) => void, 
    stop: (message?: string, type?: 'success' | 'error' | 'info') => void 
  } {
    const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let currentFrame = 0;
    let interval: NodeJS.Timeout | null = null;
    let text = '';

    return {
      start: (message: string = 'Loading...') => {
        text = message;
        if (!interval) {
          interval = setInterval(() => {
            process.stdout.write(`\r${this.colors.cyan}${spinnerFrames[currentFrame]}${this.colors.reset} ${text}`);
            currentFrame = (currentFrame + 1) % spinnerFrames.length;
          }, 80);
        }
      },
      stop: (message?: string, type: 'success' | 'error' | 'info' = 'success') => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        
        if (message) {
          let icon = '✓';
          let color = this.colors.green;
          
          if (type === 'error') {
            icon = '✗';
            color = this.colors.red;
          } else if (type === 'info') {
            icon = 'ℹ';
            color = this.colors.blue;
          }
          
          process.stdout.write(`\r${color}${icon}${this.colors.reset} ${message}\n`);
        } else {
          process.stdout.write('\r\x1b[K'); // Clear the line
        }
      }
    };
  }
}