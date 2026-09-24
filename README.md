# WealthSchema MCP server

An [MCP](https://modelcontextprotocol.io) server that gives AI agents **current U.S. financial-planning figures with their primary-source citations**, plus small synthetic household samples and a benchmark for AI financial-advice systems.

Ask an agent "What's the 2026 401(k) limit?" and it answers from the IRS source, with the document and section, instead of from a model's memory, which is often last year's number.

## Tools

| Tool | What it returns |
|---|---|
| `get_reference_parameter` | One cited planning figure (e.g. `retirement.401k.elective_deferral.under_50`) with its value, issuer, document, section and URL |
| `list_reference_parameters` | Every figure in the 2026 federal feed, by domain, marking which are in the free sample |
| `get_sample_household` | A small synthetic household sample (banded amounts, 12-month history) |
| `list_archetypes` / `describe_household_schema` | The household archetypes and record schema |
| `list_bundles` / `get_purchase_link` | Data products and where to buy them |
| `get_planning_benchmark` | 50 benchmark tasks for AI financial-advice systems, with answer keys |

Figures cover IRS, SSA, CMS and HHS: contribution limits, tax brackets, standard deduction, RMD tables, IRMAA tiers, Social Security COLA and wage base, HSA limits, estate and gift figures, and more. 2027 figures are added as the agencies publish them ([tracker](https://www.wealthschema.com/rule-sets/2027)).

## Free and paid

Without a key you get a **free sample of 10 headline figures**. A paid [Rule Sets plan](https://www.wealthschema.com/rule-sets#pricing) (from $49/month) returns every federal and state figure. Set your key as `WEALTHSCHEMA_API_KEY`.

## Use it

### Remote (no install)

Clients that support remote MCP servers can connect directly:

```json
{ "mcpServers": { "wealthschema": { "url": "https://www.wealthschema.com/api/mcp" } } }
```

With a paid key, send `Authorization: Bearer <key>`.

### Local (stdio)

For clients that only run local servers (Claude Desktop, Cursor, Windsurf, Cline and others):

```json
{
  "mcpServers": {
    "wealthschema": {
      "command": "npx",
      "args": ["-y", "github:CapsteraSupport/wealthschema-mcp"],
      "env": { "WEALTHSCHEMA_API_KEY": "optional-paid-key" }
    }
  }
}
```

The local server relays to the hosted one, so tools and answers are always current. Requires Node.js 18+.

## Develop

```bash
npm install
npm test     # starts the server over stdio, lists tools, calls a free and a paid figure
```

## Notes

- Informational only; not tax, legal or financial advice. Every figure links to its primary source so you can check it.
- All household data is synthetic: no real people or accounts.
- Also in the [official MCP Registry](https://registry.modelcontextprotocol.io) as `com.wealthschema/mcp`.
- Questions: support@wealthschema.com · [wealthschema.com/for-agents](https://www.wealthschema.com/for-agents)

Code in this repository is MIT-licensed. Data returned by the server is licensed under the [WealthSchema terms](https://www.wealthschema.com/reference-feed-terms).
