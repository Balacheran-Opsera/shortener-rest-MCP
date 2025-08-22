/**
 * Update alias
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

export async function put_aliases(domainName, aliasName, metatags, snippets, destinations) {
  try {
    const config = getConfig();
    const requestBody = {
      domainName,
      aliasName,
      metatags,
      snippets,
      destinations
    };
    
    const url = `${config.baseURL}/api/unknown`;
    
    const response = await fetch(url, {
      method: 'PUT',
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

export function createPutAliasesTool() {
  return {
    definition: {
      name: 'put-aliases',
      description: 'Update alias',
      inputSchema: {
        type: 'object',
        properties: {
          domainName: {
            type: 'string',
            description: 'domain which alias belongs to (string without `http/https` or `/`)'
          },
          aliasName: {
            type: 'string',
            description: 'alias (without `/` at the beginning)'
          },
          metatags: {
            type: 'string',
            description: ''
          },
          snippets: {
            type: 'string',
            description: ''
          },
          destinations: {
            type: 'string',
            description: ''
          }
        },
        required: ["aliasName"]
      }
    },
    handler: put_aliases
  };
}