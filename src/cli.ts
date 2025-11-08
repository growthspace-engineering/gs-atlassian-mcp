#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { startServer } from './index.js';

// Load environment variables as fallback
dotenv.config();

const program = new Command();

program
  .name('mcp-atlassian-server')
  .description('MCP Server for interacting with Atlassian Jira and Confluence')
  .version(process.env.npm_package_version || '2.1.1')
  .option('--atlassian-site-name <site>', 'Atlassian site name (e.g., your-domain.atlassian.net)')
  .option('--atlassian-user-email <email>', 'Atlassian user email')
  .option('--atlassian-api-token <token>', 'Atlassian API token')
  .option('--mcp-server-name <name>', 'MCP server name', 'kb-mcp-atlassian-server')
  .option('--mcp-server-version <version>', 'MCP server version', '1.0.0');

// Parse arguments - commander will handle --help and --version automatically and exit
program.parse(process.argv);

const options = program.opts();

// Get configuration from CLI args or environment variables
const atlassianSiteName = options.atlassianSiteName || process.env.ATLASSIAN_SITE_NAME;
const atlassianUserEmail = options.atlassianUserEmail || process.env.ATLASSIAN_USER_EMAIL;
const atlassianApiToken = options.atlassianApiToken || process.env.ATLASSIAN_API_TOKEN;
const mcpServerName = options.mcpServerName || process.env.MCP_SERVER_NAME || 'kb-mcp-atlassian-server';
const mcpServerVersion = options.mcpServerVersion || process.env.MCP_SERVER_VERSION || '1.0.0';

// Validate required parameters
if (!atlassianSiteName || !atlassianUserEmail || !atlassianApiToken) {
  console.error('Error: Missing required Atlassian credentials');
  console.error('');
  console.error('Required parameters:');
  console.error('  --atlassian-site-name <site>     Atlassian site name');
  console.error('  --atlassian-user-email <email>   Atlassian user email');
  console.error('  --atlassian-api-token <token>    Atlassian API token');
  console.error('');
  console.error('These can also be provided via environment variables:');
  console.error('  ATLASSIAN_SITE_NAME');
  console.error('  ATLASSIAN_USER_EMAIL');
  console.error('  ATLASSIAN_API_TOKEN');
  process.exit(1);
}

// Start the server with the provided configuration
startServer({
  atlassianSiteName,
  atlassianUserEmail,
  atlassianApiToken,
  mcpServerName,
  mcpServerVersion
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
