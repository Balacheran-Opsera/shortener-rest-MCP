/**
 * Get clicks statistics
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

export async function post_clicks_pg(dateFrom, dateTo, domain, aliasId, lastId) {
  try {
    const config = getConfig();
    const requestBody = {
      dateFrom,
      dateTo,
      domain,
      aliasId,
      lastId
    };
    
    const url = `${config.baseURL}/clicks/pg`;
    
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

export function createPostClicksPgTool() {
  return {
    definition: {
      name: 'post-clicks-pg',
      description: 'Get clicks statistics',
      inputSchema: {
        type: 'object',
        properties: {
          dateFrom: {
            type: 'string',
            description: 'Input parameter: date From'
          },
          dateTo: {
            type: 'string',
            description: 'Input parameter: date To'
          },
          domain: {
            type: 'string',
            description: 'Input parameter: Domain name'
          },
          aliasId: {
            type: 'string',
            description: 'Input parameter: Alias Id'
          },
          lastId: {
            type: 'number',
            description: 'Input parameter: last Id'
          }
        },
        required: []
      }
    },
    handler: post_clicks_pg
  };
}