# Stable protocol interface version 2.0

Open source **decentralized interface** for multi-collateral stable protocol **Money on Chain**

You can:

* Mint / Redeem Pegged Token (TP): Ex.: DoC
* Mint / Redeem Collateral Token (TC): Ex.: BPro
* Metrics
* Last operations
* Claim / Stake TG (MOC)
* FastBTC Bridge


### Money on Chain projects and tokens 

**Projects**

* Dollar on Chain (DoC) (Main project - Collateral RBTC) please review the contracts [here](https://github.com/money-on-chain/main-RBTC-contract)
* RIF on Chain (RoC) (Collateral RIF) was migrated to [V2](https://github.com/money-on-chain/stable-protocol-interface-v2) 


| Token | Token name       | Project | Token Name | Collateral |
|-------|------------------|---------|------------|------------|
| TP    | Pegged Token 1:1 | MOC     | DOC        | RBTC       |
| TC    | Collateral Token | MOC     | BPRO       | RBTC       |
| TG    | Govern Token     | MOC     | MOC        | -          |

### Releases

Each release gets deployed to IPFS automatically.

Please go to release section, there are several links to [releases](https://github.com/money-on-chain/stable-protocol-interface/releases) 

**MOC Release**: You can always get the last stable release on: [dapp.moneyonchain.com](https://dapp.moneyonchain.com)

**Notes:** The list of operations of the user is get it through an  API. We use an api also for the liquidity mining program, but is not need it to run or to exchange tokens.


## DEVELOP

### Setup: Running develop

Requires:

* Nodejs > 12

`nvm use`

Install packages

`npm install`

Run

`npm run start:moc-mainnet`

**Note:** Start the environment you want to run ex. **"start:moc-mainnet"** to start environment Moc Production Mainnet 

Then in your browser:

`http://localhost:3000`


### Environment table

Environment is our already deployed contracts. 
**Develop**: npm run start:<environment>

| Name             | Project | Main Gateway                           | Environment | Network | npm run                 |
|------------------|---------|----------------------------------------|-------------|---------|-------------------------|
| MoC TestnetAlpha | MOC     |                                        | Testnet     | RSK     | start:moc-alpha-testnet |
| MoC Testnet      | MOC     |                                        | Testnet     | RSK     | start:moc-testnet       |
| MoC Mainnet      | MOC     | [link](https://alpha.moneyonchain.com) | Mainnet     | RSK     | start:moc-mainnet       |


### Projects requirements (optional)

To fully operational this dapp requires also running:

* [Stable Protocol API](https://github.com/money-on-chain/stable-protocol-api)
* [Stable Protocol Indexer](https://github.com/money-on-chain/stable-protocol-indexer)


### Faucets

In testnet you may need some test tRIF o tRBTC

* **Faucet tRBTC**: https://faucet.rsk.co/
* **Faucet tRIF**: https://faucet.rifos.org/


### Integration

If you want to integrate Money on Chain protocols please review our Integration repository:  [https://github.com/money-on-chain/moc-integration-js](https://github.com/money-on-chain/moc-integration-js)
