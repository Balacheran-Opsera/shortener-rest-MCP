package main

import (
	"github.com/shorten-rest-api-documentation/mcp-server/config"
	"github.com/shorten-rest-api-documentation/mcp-server/models"
	tools_click "github.com/shorten-rest-api-documentation/mcp-server/tools/click"
	tools_statistics "github.com/shorten-rest-api-documentation/mcp-server/tools/statistics"
	tools_alias "github.com/shorten-rest-api-documentation/mcp-server/tools/alias"
)

func GetAll(cfg *config.APIConfig) []models.Tool {
	return []models.Tool{
		tools_click.CreateGetclicksTool(cfg),
		tools_statistics.CreateGetstatisticsTool(cfg),
		tools_alias.CreateGetaliasTool(cfg),
		tools_alias.CreateCreatealiasTool(cfg),
		tools_alias.CreateUpdatealiasTool(cfg),
		tools_alias.CreateDeletealiasTool(cfg),
		tools_alias.CreateGetaliasesTool(cfg),
	}
}
