#!/usr/bin/env node
/**
 * WealthSchema MCP server (stdio).
 *
 * A small local MCP server that exposes WealthSchema's tools to any MCP client
 * that speaks stdio (Claude Desktop, Cursor, Windsurf, Cline, ...). It connects
 * to the hosted WealthSchema server over Streamable HTTP and relays tool
 * listings and tool calls, so the tools, their answers and their access rules
 * are always the hosted ones.
 *
 * Environment:
 *   WEALTHSCHEMA_API_KEY  optional. A paid Rule Sets key returns every figure;
 *                         without one you get the free sample.
 *   WEALTHSCHEMA_MCP_URL  optional. Defaults to https://www.wealthschema.com/api/mcp
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const REMOTE_URL = process.env.WEALTHSCHEMA_MCP_URL || "https://www.wealthschema.com/api/mcp";
const API_KEY = process.env.WEALTHSCHEMA_API_KEY || "";

let upstream;
async function remote() {
  if (upstream) return upstream;
  const client = new Client({ name: "wealthschema-mcp-stdio", version: "0.1.0" });
  const transport = new StreamableHTTPClientTransport(new URL(REMOTE_URL), {
    requestInit: API_KEY ? { headers: { Authorization: `Bearer ${API_KEY}` } } : undefined,
  });
  await client.connect(transport);
  upstream = client;
  return client;
}

const server = new Server(
  { name: "wealthschema", version: "0.1.0" },
  {
    capabilities: { tools: {} },
    instructions:
      "WealthSchema tools: cited 2026 and 2027 U.S. financial-planning figures (IRS, SSA, CMS) with their primary sources, small synthetic household samples, and a 50-task benchmark for AI financial-advice systems. Without a paid key, reference figures are a free sample of headline values; every figure is included in paid Rule Sets plans (https://www.wealthschema.com/rule-sets#pricing). Informational only; not tax, legal or financial advice.",
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const client = await remote();
  return client.listTools();
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const client = await remote();
  return client.callTool({ name: request.params.name, arguments: request.params.arguments ?? {} });
});

await server.connect(new StdioServerTransport());
