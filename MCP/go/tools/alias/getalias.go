package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/shorten-rest-api-documentation/mcp-server/config"
	"github.com/shorten-rest-api-documentation/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func GetaliasHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["domainName"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("domainName=%v", val))
		}
		if val, ok := args["aliasName"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("aliasName=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/aliases%s", cfg.BaseURL, queryString)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to create request", err), nil
		}
		// Set authentication based on auth type
		// Fallback to single auth parameter
		if cfg.APIKey != "" {
			req.Header.Set("x-api-key", cfg.APIKey)
		}
		req.Header.Set("Accept", "application/json")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Request failed", err), nil
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to read response body", err), nil
		}

		if resp.StatusCode >= 400 {
			return mcp.NewToolResultError(fmt.Sprintf("API error: %s", body)), nil
		}
		// Use properly typed response
		var result models.AliasModel
		if err := json.Unmarshal(body, &result); err != nil {
			// Fallback to raw text if unmarshaling fails
			return mcp.NewToolResultText(string(body)), nil
		}

		prettyJSON, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to format JSON", err), nil
		}

		return mcp.NewToolResultText(string(prettyJSON)), nil
	}
}

func CreateGetaliasTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_aliases",
		mcp.WithDescription("Get alias"),
		mcp.WithString("domainName", mcp.Description("domain which alias belongs to (string without `http/https` or `/`)")),
		mcp.WithString("aliasName", mcp.Required(), mcp.Description("alias value (without `/` at the beginning)")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    GetaliasHandler(cfg),
	}
}
