# Cloudflare Workers — IPFS Proxy

Each worker sits in front of a Pinata IPFS gateway and serves the latest dapp build by reading the current CID from a KV namespace. This avoids exposing raw `/ipfs/<CID>` URLs to users, enables clean domain-based deployments, and lets the PWA update flow work correctly (the worker forces `no-cache` on `index.html`/`sw.js`/`manifest.webmanifest`, so browsers always re-check for a new service worker after each deploy).

## How it works

1. A GitHub Actions workflow (`.github/workflows/moc-release.yml` / `moc-pre-release.yml`) builds the dapp, pins it to IPFS via Pinata, and writes the resulting CID to a Cloudflare KV namespace.
2. The worker reads `current_cid` from KV on every request and proxies the content from the Pinata gateway.
3. SPA routing is handled automatically: unknown paths fall back to `index.html`.

## Environments

| Env | Worker name | Domain |
|-----|-------------|--------|
| `moc` | dapp-proxy-moc-app | dapp-classic.moneyonchain.com (+ dapp.moneyonchain.com until cutover) |
| `moc-testnet` | dapp-proxy-moc-app-testnet | dapp-classic-testnet.moneyonchain.com (+ dapp-testnet.moneyonchain.com until cutover) |

### Domain migration

This legacy (classic) dapp is moving to `dapp-classic.moneyonchain.com` / `dapp-classic-testnet.moneyonchain.com`; the `stable-protocol-interface-v3` dapp takes over `dapp.moneyonchain.com` / `dapp-testnet.moneyonchain.com`.

1. **Phase 1 (now)** — the workers serve both the new `dapp-classic*` hostnames and the old ones. Create proxied (orange-cloud) DNS records for `dapp-classic` and `dapp-classic-testnet` in the `moneyonchain.com` zone, then `npx wrangler deploy --env moc` / `--env moc-testnet`.
2. **Phase 2 (cutover)** — remove the old `dapp.moneyonchain.com/*` / `dapp-testnet.moneyonchain.com/*` routes from `wrangler.toml` and redeploy these workers **before** deploying the v3 workers with those patterns (a route pattern can only belong to one worker).

These are intentionally separate from the `dapp-proxy-moc` / `dapp-proxy-moc-testnet` workers in the `stable-protocol-interface-v3` repo, which own `manage.moneyonchain.com` / `manage-testnet.moneyonchain.com` for the Voting app.

## Prerequisites

- Node.js v22+
- Wrangler: `corepack pnpm dlx wrangler login`

## Deploy

```bash
# Deploy a single environment
corepack pnpm dlx wrangler deploy --env moc
corepack pnpm dlx wrangler deploy --env moc-testnet

# Deploy all at once
for env in moc moc-testnet; do
  corepack pnpm dlx wrangler deploy --env $env
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
corepack pnpm dlx wrangler kv namespace create legacy-DAPP_KV --env moc
corepack pnpm dlx wrangler kv namespace create legacy-DAPP_KV --env moc-testnet
```

The positional name (`legacy-DAPP_KV`) only sets the namespace's dashboard title — plain `DAPP_KV` collides with the `stable-protocol-interface-v3` repo's Voting app workers, which already own the `moc-DAPP_KV` / `moc-testnet-DAPP_KV` titles. `legacy` reflects that this repo is the legacy dapp. The `binding = "DAPP_KV"` in `wrangler.toml` is unrelated and unaffected by this name.

Copy the returned IDs into `wrangler.toml` and add them as GitHub secrets.
