import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Config {
  token: string;
  apiUrl: string;
  user: User | null;
}

export class ConfigManager {
  private configDir: string;
  private configFile: string;
  private config: Config;

  constructor() {
    this.configDir = path.join(os.homedir(), '.platform');
    this.configFile = path.join(this.configDir, 'config.json');
    
    // Default configuration
    this.config = {
      token: '',
      apiUrl: 'https://api.yourplatform.com',
      user: null
    };
    
    this.ensureConfigDir();
    this.loadConfig();
  }

  private ensureConfigDir(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  private loadConfig(): void {
    if (fs.existsSync(this.configFile)) {
      try {
        const fileContent = fs.readFileSync(this.configFile, 'utf8');
        this.config = { ...this.config, ...JSON.parse(fileContent) };
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }

  saveConfig(): void {
    fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
  }

  getConfig(): Config {
    return this.config;
  }

  updateConfig(updates: Partial<Config>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  getToken(): string | null {
    return this.config.token || null;
  }

  setToken(token: string): void {
    this.config.token = token;
    this.saveConfig();
  }

  clearToken(): void {
    this.config.token = '';
    this.config.user = null;
    this.saveConfig();
  }

  getUser(): User | null {
    return this.config.user;
  }

  setUser(user: User): void {
    this.config.user = user;
    this.saveConfig();
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  setApiUrl(url: string): void {
    this.config.apiUrl = url;
    this.saveConfig();
  }

  isLoggedIn(): boolean {
    return !!this.config.token && !!this.config.user;
  }
}