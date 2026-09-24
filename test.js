// Smoke test: start the stdio server, list tools, call one free and one paid figure.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "smoke", version: "0" });
await client.connect(new StdioClientTransport({ command: "node", args: ["index.js"], env: { ...process.env } }));
const { tools } = await client.listTools();
console.log("tools:", tools.map((t) => t.name).join(", "));
const free = await client.callTool({ name: "get_reference_parameter", arguments: { key: "retirement.401k.elective_deferral.under_50" } });
console.log("free sample figure:", JSON.parse(free.content[0].text).value);
const paid = await client.callTool({ name: "get_reference_parameter", arguments: { key: "medicare.irmaa" } });
console.log("paid figure without key:", JSON.parse(paid.content[0].text).available === false ? "withheld" : "RETURNED");
await client.close();
