# Cloudflare Workers — IPFS Proxy

Each worker sits in front of a Pinata IPFS gateway and serves the latest dapp build by reading the current CID from a KV namespace. This avoids exposing raw `/ipfs/<CID>` URLs to users, enables clean domain-based deployments, and lets the PWA update flow work correctly (the worker forces `no-cache` on `index.html`/`sw.js`/`manifest.webmanifest`, so browsers always re-check for a new service worker after each deploy).

## How it works

1. A GitHub Actions workflow (`.github/workflows/moc-release.yml` / `moc-pre-release.yml`) builds the dapp, pins it to IPFS via Pinata, and writes the resulting CID to a Cloudflare KV namespace.
2. The worker reads `current_cid` from KV on every request and proxies the content from the Pinata gateway.
3. SPA routing is handled automatically: unknown paths fall back to `index.html`.

## Environments

| Env | Worker name | Domain |
|-----|-------------|--------|
| `moc` | dapp-proxy-moc-app | dapp.moneyonchain.com |
| `moc-testnet` | dapp-proxy-moc-app-testnet | dapp-testnet.moneyonchain.com |

These are intentionally separate from the `dapp-proxy-moc` / `dapp-proxy-moc-testnet` workers in the `stable-protocol-interface-v3` repo, which own `manage.moneyonchain.com` / `manage-testnet.moneyonchain.com` for the Voting app.

## Prerequisites

- Node.js v22+
- Wrangler: `npx wrangler login`

## Deploy

```bash
# Deploy a single environment
npx wrangler deploy --env moc
npx wrangler deploy --env moc-testnet

# Deploy all at once
for env in moc moc-testnet; do
  npx wrangler deploy --env $env
done
```

## GitHub Actions secrets required

| Secret | Description |
|--------|-------------|
| `CF_ACCOUNT_ID` | Cloudflare account ID |
| `CF_API_TOKEN` | API token with **Workers KV Storage:Edit** permission |
| `CF_KV_NAMESPACE_ID_MOC` | KV namespace ID for moc mainnet |
| `CF_KV_NAMESPACE_ID_MOC_TESTNET` | KV namespace ID for moc testnet |

## Creating new KV namespaces (first-time setup)

```bash
npx wrangler kv namespace create DAPP_KV --env moc
npx wrangler kv namespace create DAPP_KV --env moc-testnet
```

Copy the returned IDs into `wrangler.toml` and add them as GitHub secrets.
