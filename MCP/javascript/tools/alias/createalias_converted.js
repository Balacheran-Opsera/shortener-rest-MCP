/**
 * Create alias
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

function getConfig() {
  const baseURL = process.env.API_BASE_URL;
  const bearerToken = process.env.API_BEARER_TOKEN;
  
  if (!baseURL || !bearerToken) {
    const configPath = path.join(os.homedir(), '.api', 'config.json');
    try {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return {
        baseURL: baseURL || configData.baseURL,
        bearerToken: bearerToken || configData.bearerToken
      };
    } catch (e) {
      throw new Error('Configuration not found. Please set API_BASE_URL and API_BEARER_TOKEN environment variables or create config file at ~/.api/config.json');
    }
  }
  
  return { baseURL, bearerToken };
}

export async function post_aliases(domainName, aliasName, destinations, metatags, snippets) {
  try {
    const config = getConfig();
    const requestBody = {
      domainName,
      aliasName,
      destinations,
      metatags,
      snippets
    };
    
    const url = `${config.baseURL}/api/unknown`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.bearerToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      return `Failed to read response body: ${response.status} ${response.statusText}`;
    }
    
    try {
      const result = await response.json();
      return JSON.stringify(result, null, 2);
    } catch (e) {
      return await response.text();
    }
    
  } catch (error) {
    return `Failed to create request: ${error.message}`;
  }
}

export function createPostAliasesTool() {
  return {
    definition: {
      name: 'post-aliases',
      description: 'Create alias',
      inputSchema: {
        type: 'object',
        properties: {
          domainName: {
            type: 'string',
            description: 'domain which alias will belong to (string without `http/https` or `/`)'
          },
          aliasName: {
            type: 'string',
            description: 'alias (without `/` at the beginning)'
          },
          destinations: {
            type: 'string',
            description: ''
          },
          metatags: {
            type: 'string',
            description: ''
          },
          snippets: {
            type: 'string',
            description: ''
          }
        },
        required: []
      }
    },
    handler: post_aliases
  };
}