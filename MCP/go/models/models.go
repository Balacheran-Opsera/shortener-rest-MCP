package models

import (
	"context"
	"github.com/mark3labs/mcp-go/mcp"
)

type Tool struct {
	Definition mcp.Tool
	Handler    func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error)
}

// DestinationModel represents the DestinationModel schema from the OpenAPI specification
type DestinationModel struct {
	Os string `json:"os,omitempty"` // Please check the [supported OS list](#tag/OperatingSystems)
	Url string `json:"url"`
	Country string `json:"country,omitempty"` // ISO alpha-2 [country code](//en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements)
}

// GetAliasModel represents the GetAliasModel schema from the OpenAPI specification
type GetAliasModel struct {
	Createdat int64 `json:"createdAt,omitempty"`
	Domainname string `json:"domainName,omitempty"`
	Name string `json:"name,omitempty"`
	Updatedat int64 `json:"updatedAt,omitempty"`
}

// CreateAliasResponseModel represents the CreateAliasResponseModel schema from the OpenAPI specification
type CreateAliasResponseModel struct {
	Aliasname string `json:"aliasName,omitempty"`
	Domainname string `json:"domainName,omitempty"`
	Shorturl string `json:"shortUrl,omitempty"`
}

// AliasModel represents the AliasModel schema from the OpenAPI specification
type AliasModel struct {
	Snippets []SnippetModel `json:"snippets,omitempty"`
	Updatedat int64 `json:"updatedAt,omitempty"`
	Createdat int64 `json:"createdAt,omitempty"`
	Destinations []DestinationModel `json:"destinations,omitempty"`
	Domainname string `json:"domainName,omitempty"`
	Metatags []MetaTagModel `json:"metatags,omitempty"`
	Name string `json:"name"`
}

// CreateAliasModel represents the CreateAliasModel schema from the OpenAPI specification
type CreateAliasModel struct {
	Destinations []DestinationModel `json:"destinations,omitempty"`
	Metatags []MetaTagModel `json:"metatags,omitempty"`
	Snippets []SnippetModel `json:"snippets,omitempty"`
}

// GetAliasesModel represents the GetAliasesModel schema from the OpenAPI specification
type GetAliasesModel struct {
	Aliases []string `json:"aliases,omitempty"`
	Lastid string `json:"lastId,omitempty"`
}

// ClickModel represents the ClickModel schema from the OpenAPI specification
type ClickModel struct {
	Aliasid string `json:"aliasId,omitempty"`
	Useragent string `json:"userAgent,omitempty"`
	Os string `json:"os,omitempty"`
	Alias string `json:"alias,omitempty"`
	Domain string `json:"domain,omitempty"`
	Referrer string `json:"referrer,omitempty"`
	Browser string `json:"browser,omitempty"`
	Country string `json:"country,omitempty"`
	Createdat int64 `json:"createdAt,omitempty"`
	Destination string `json:"destination,omitempty"`
}

// ClicksFilterModel represents the ClicksFilterModel schema from the OpenAPI specification
type ClicksFilterModel struct {
	Domain string `json:"domain,omitempty"` // Domain name
	Lastid int `json:"lastId,omitempty"` // last Id
	Aliasid string `json:"aliasId,omitempty"` // Alias Id
	Datefrom string `json:"dateFrom,omitempty"` // date From
	Dateto string `json:"dateTo,omitempty"` // date To
}

// GetClicksModel represents the GetClicksModel schema from the OpenAPI specification
type GetClicksModel struct {
	Clicks []ClickModel `json:"clicks,omitempty"`
	Lastid string `json:"lastId,omitempty"`
}

// MetaTagModel represents the MetaTagModel schema from the OpenAPI specification
type MetaTagModel struct {
	Content string `json:"content"`
	Name string `json:"name"`
}

// SnippetModel represents the SnippetModel schema from the OpenAPI specification
type SnippetModel struct {
	Id string `json:"id"` // Please check the [supported snippets list](#tag/Snippets)
	Parameters map[string]interface{} `json:"parameters,omitempty"`
}

// ClickModelPg represents the ClickModelPg schema from the OpenAPI specification
type ClickModelPg struct {
	Aliasid string `json:"aliasId,omitempty"`
	Createdat int64 `json:"createdAt,omitempty"`
	Domain string `json:"domain,omitempty"`
	Id int `json:"id,omitempty"`
	Destination string `json:"destination,omitempty"`
	Referrer string `json:"referrer,omitempty"`
	Alias string `json:"alias,omitempty"`
	Os string `json:"os,omitempty"`
	Browser string `json:"browser,omitempty"`
	Country string `json:"country,omitempty"`
	Useragent string `json:"userAgent,omitempty"`
	Accountid string `json:"accountId,omitempty"`
}
