# Stable protocol interface

Open source **decentralized interface** for multi-collateral stable protocol **Money on Chain**

You can:

* Mint / Redeem Stable Token
* Mint / Redeem RiskPro Token
* Mint / Redeem RiskProX Token (leveraged 2X)
* Metrics
* Last operations
* Claim / Stake MoC
* FastBTC Bridge


### Money on Chain projects and tokens 

**Projects**

* Dollar on Chain (DoC) (Main project - Collateral RBTC) please review the contracts [here](https://github.com/money-on-chain/main-RBTC-contract)
* RIF on Chain (RoC) (Collateral RIF) please review the contracts [here](https://github.com/money-on-chain/RDOC-Contract) 


| Token generic     | Project | Token Name  | Collateral   | Network |
|-------------------|---------|-------------|--------------|---------|
| Stable            | MOC     | DOC         | RBTC         | RSK     |
| RiskPro           | MOC     | BPRO        | RBTC         | RSK     |
| RiskProx          | MOC     | BTCX        | RBTC         | RSK     |
| Stable            | ROC     | RDOC        | RIF          | RSK     |
| RiskPro           | ROC     | RIFP        | RIF          | RSK     |
| RiskProx          | ROC     | RIFX        | RIF          | RSK     |


### Setup: Running develop

Requires:

* Nodejs > 12

Install packages

`npm install`

Run

`npm run start:moc-testnet`

**Note:** Start the environment you want to run ex. **"start:moc-testnet"** to start environment Moc Testnet 


### Environment table

Environment is our already deployed contracts. 
**Develop**: npm run start:<environment>

| Name             | Project | Main Gateway                                 | Environment | Network | npm run                 |
|------------------|---------|----------------------------------------------|-------------|---------|-------------------------|
| MoC TestnetAlpha | MOC     |                                              | Testnet     | RSK     | start:moc-alpha-testnet |
| MoC Testnet      | MOC     | [link](https://app-testnet.moneyonchain.com) | Testnet     | RSK     | start:moc-testnet       |
| MoC Mainnet      | MOC     | [link](https://app.moneyonchain.com)         | Mainnet     | RSK     | start:moc-mainnet       |
| RoC TestnetAlpha | RIF     |                                              | Testnet     | RSK     | start:roc-alpha-testnet |
| RoC Testnet      | RIF     | [link](https://app-testnet.rifonchain.com)   | Testnet     | RSK     | start:roc-testnet       |
| RoC Mainnet      | RIF     | [link](https://app.rifonchain.com)           | Mainnet     | RSK     | start:roc-mainnet       |


### Faucets

In testnet you may need some test tRIF o tRBTC

* **Faucet tRBTC**: https://faucet.rsk.co/
* **Faucet tRIF**: https://faucet.rifos.org/


### Integration

If you want to integrate Money on Chain protocols please review our Integration repository:  [https://github.com/money-on-chain/moc-integration-js](https://github.com/money-on-chain/moc-integration-js)

### IPFS notes

Each release gets deployed to IPFS automatically.

**Notes:** The list of operations of the user is get it through an  API. We use an api also for the liquidity mining program, but is not need it to run or to exchange tokens.



