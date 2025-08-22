/**
 * Get aliases by domain
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

export async function get_aliases_all(domainName, continueFrom, limit) {
  try {
    const config = getConfig();
    const params = new URLSearchParams();
      if (domainName) params.append("domainName", domainName);
      if (continueFrom) params.append("continueFrom", continueFrom);
      if (limit) params.append("limit", limit);
    const queryString = params.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;
    
    const url = `${config.baseURL}/api/unknown`;
    
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.bearerToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return `Failed to format JSON: ${response.status} ${response.statusText}`;
    }
    
    try {
      const result = await response.json();
      return JSON.stringify(result, null, 2);
    } catch (e) {
      return await response.text();
    }
    
  } catch (error) {
    return `Request failed: ${error.message}`;
  }
}

export function createGetAliasesAllTool() {
  return {
    definition: {
      name: 'get-aliases-all',
      description: 'Get aliases by domain',
      inputSchema: {
        type: 'object',
        properties: {
          domainName: {
            type: 'string',
            description: 'The domain name to get the aliases for (string without `http/https` or `/`)'
          },
          continueFrom: {
            type: 'string',
            description: 'An ID returned by a previous query to continue aliases retrieval (see lastId in response)'
          },
          limit: {
            type: 'number',
            description: 'Number of results to return per request'
          }
        },
        required: []
      }
    },
    handler: get_aliases_all
  };
}