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

* Dollar on Chain (Main project - Collateral RBTC) please review the contracts [here](https://github.com/money-on-chain/main-RBTC-contract)
* RIF on Chain (Collateral RIF) please review the contracts [here](https://github.com/money-on-chain/RDOC-Contract) 


| Token generic     | Project | Token Name  | Collateral   |
|-------------------|---------|-------------|--------------|
| Stable            | MOC     | DOC         | RBTC         |
| RiskPro           | MOC     | BPRO        | RBTC         |
| RiskProx          | MOC     | BTCX        | RBTC         |
| Stable            | ROC     | RDOC        | RIF          |
| RiskPro           | ROC     | RIFP        | RIF          |
| RiskProx          | ROC     | RIFX        | RIF          |


### Setup

Install packages

`npm install`

Run

`npm run start`

**Note:** Copy content of src/Config/config.mocMainnet2.json to src/Config/config.default.json, depends on the environment you want to run.


### Environment table

Environment is our already deployed contracts. For example **mocMainnet2** is our MOC current production environment.

| Network Name      | Project | Enviroment                       | Network    |
|-------------------|---------|----------------------------------|------------|
| mocTestnetAlpha   | MOC     |                                  | Testnet    |
| mocTestnet        | MOC     | app-testnet.moneyonchain.com     | Testnet    |
| mocMainnet2       | MOC     | app.moneyonchain.com             | Mainnet    |
| rdocTestnetAlpha  | RIF     |                                  | Testnet    |
| rdocTestnet       | RIF     | app-roc-testnet.moneyonchain.com | Testnet    |
| rdocMainnet       | RIF     | app-roc.moneyonchain.com         | Mainnet    |


### Faucets

In testnet you may need some test tRIF o tRBTC

* **Faucet tRBTC**: https://faucet.rsk.co/
* **Faucet tRIF**: https://faucet.rifos.org/


### Integration

If you want to integrate Money on Chain protocols please review our Integration repository:  [https://github.com/money-on-chain/moc-integration-js](https://github.com/money-on-chain/moc-integration-js)

### IPFS notes

Each commit gets deployed to IPFS automatically

**Notes:** The list of operations of the user is get it through an  API. We use an api also for the liquidity mining program, but is not need it to run or to exchange tokens.



