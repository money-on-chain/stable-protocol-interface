import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { addCommissions, calcMintInterest } from './interfaces-base';
import { toContractPrecision, getGasPrice, BUCKET_X2 } from './utils';

const mintStable = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint stable token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // get bitcoin price from contract
  const bitcoinPrice = new BigNumber(Web3.utils.fromWei(contractStatusData.bitcoinPrice))

  reserveAmount = new BigNumber(reserveAmount);

  // Stable amount in reserve
  const stableAmount = reserveAmount.times(bitcoinPrice)

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'DOC', 'MINT')

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${stableAmount} ${tokens.STABLE.name} you need > ${valueToSend.toString()} ${tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insuficient reserve balance')

  // There are suficient STABLE in the contracts to mint?
  const stableAvalaiblesToMint = new BigNumber(Web3.utils.fromWei(contractStatusData.docAvailableToMint))
  if (new BigNumber(stableAmount).gt(stableAvalaiblesToMint)) throw new Error(`Insufficient ${tokens.STABLE.name} avalaibles to mint`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .mintDocVendors(toContractPrecision(reserveAmount), vendorAddress)
    .estimateGas({ from: account, value: toContractPrecision(valueToSend) })

  // Send tx
  const receipt = moc.methods
    .mintDocVendors(toContractPrecision(reserveAmount), vendorAddress)
    .send(
            {
                from: account,
                value: toContractPrecision(valueToSend),
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt

}

const redeemStable = async (interfaceContext, stableAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem stable token receiving coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // get bitcoin price from contract
  const bitcoinPrice = new BigNumber(Web3.utils.fromWei(contractStatusData.bitcoinPrice))

  // Stable amount in reserve
  const reserveAmount = new BigNumber(stableAmount).div(bitcoinPrice)

  // Redeem function... no values sent
  const valueToSend = null

  // Verifications

  // User have suficient STABLE in balance?
  console.log(`Redeeming ${stableAmount} ${tokens.STABLE.name} ... getting aprox: ${reserveAmount} ${tokens.RESERVE.name}... `)
  const userStableBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.docBalance))
  if (new BigNumber(stableAmount).gt(userStableBalance)) throw new Error('Insufficient STABLE user balance')

  // There are suficient Free Stable in the contracts to redeem?
  const stableAvalaiblesToRedeem = new BigNumber(Web3.utils.fromWei(contractStatusData.docAvailableToRedeem))
  if (new BigNumber(stableAmount).gt(stableAvalaiblesToRedeem)) throw new Error(`Insufficient ${tokens.RESERVE.name} avalaibles to redeem in contract`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemFreeDocVendors(toContractPrecision(new BigNumber(stableAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = moc.methods
    .redeemFreeDocVendors(toContractPrecision(new BigNumber(stableAmount)), vendorAddress)
    .send(
            {
                from: account,
                value: '0x',
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}

const mintRiskPro = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint RiskPro token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of RISKPRO in RESERVE
  const riskproPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // RISKPRO amount in RESERVE
  const riskproAmount = new BigNumber(reserveAmount).div(riskproPriceInReserve)

  reserveAmount = new BigNumber(reserveAmount);

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'BPRO', 'MINT')

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${riskproAmount} ${tokens.RISKPRO.name} you need > ${valueToSend.toString()} ${tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insufficient reserve balance')

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .mintBProVendors(toContractPrecision(reserveAmount), vendorAddress)
    .estimateGas({ from: account, value: toContractPrecision(valueToSend) })

  // Send tx
  const receipt = moc.methods
    .mintBProVendors(toContractPrecision(reserveAmount), vendorAddress)
    .send(
            {
                from: account,
                value: toContractPrecision(valueToSend),
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}

const redeemRiskPro = async (interfaceContext, riskproAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem RISKPRO token receiving coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of RISKPRO in RESERVE
  const riskproPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // RISKPRO amount in reserve
  const reserveAmount = new BigNumber(riskproAmount).times(riskproPriceInReserve)

  // Verifications

  // User have suficient RISKPRO in balance?
  console.log(`Redeeming ${riskproAmount} ${tokens.RISKPRO.name} ... getting aprox: ${reserveAmount} ${tokens.RESERVE.name}... `)
  const userRiskproBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.bproBalance))
  if (new BigNumber(riskproAmount).gt(userRiskproBalance)) throw new Error(`Insufficient ${tokens.RISKPRO.name} user balance`)

  // There are suficient RISKPRO in the contracts to redeem?
  const riskproAvailableToRedeem = new BigNumber(Web3.utils.fromWei(contractStatusData.bproAvailableToRedeem))
  if (new BigNumber(riskproAmount).gt(riskproAvailableToRedeem)) throw new Error(`Insufficient ${tokens.RISKPRO.name} avalaibles to redeem in contract`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemBProVendors(toContractPrecision(new BigNumber(riskproAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = moc.methods
    .redeemBProVendors(toContractPrecision(new BigNumber(riskproAmount)), vendorAddress)
    .send(
            {
                from: account,
                value: '0x',
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}

const mintRiskProx = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint RiskproX token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of Riskprox in coinbase
  const bprox2PriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2PriceInRbtc))

  reserveAmount = new BigNumber(reserveAmount);

  // RISKPROx amount in reserve
  const riskproxAmount = reserveAmount.div(bprox2PriceInReserve)

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'BTCX', 'MINT')

  // Calc Interest to mint RISKPROX
  const mintInterest = await calcMintInterest(interfaceContext, toContractPrecision(reserveAmount))

  //valueToSend = new BigNumber(valueToSend).plus(new BigNumber(Web3.utils.fromWei(mintInterest)))
  valueToSend = new BigNumber(valueToSend).plus(new BigNumber(Web3.utils.fromWei(mintInterest)))

  console.log(`Mint RISKPROX Interest ${mintInterest}`)

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${riskproxAmount} ${tokens.RISKPROX.name} you need > ${valueToSend.toString()} ${tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insuficient reserve balance')

  // There are suficient RISKPROX in the contracts to mint?
  const riskproxAvalaiblesToMint = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2AvailableToMint))
  if (new BigNumber(riskproxAmount).gt(riskproxAvalaiblesToMint)) throw new Error(`Insuficient ${tokens.RISKPROX.name} avalaibles to mint`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .mintBProxVendors(BUCKET_X2, toContractPrecision(reserveAmount), vendorAddress)
    .estimateGas({ from: account, value: toContractPrecision(valueToSend) })

  // Send tx
  const receipt = moc.methods
    .mintBProxVendors(BUCKET_X2, toContractPrecision(reserveAmount), vendorAddress)
    .send(
            {
                from: account,
                value: toContractPrecision(valueToSend),
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}

const redeemRiskProx = async (interfaceContext, riskproxAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem RISKPROx token receiving coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of RISKPROx in RESERVE
  const riskproxPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2PriceInRbtc))

  // RISKPROx amount in reserve RESERVE
  const reserveAmount = new BigNumber(riskproxAmount).times(riskproxPriceInReserve)

  // Redeem function... no values sent
  const valueToSend = null

  // Verifications

  // User have suficient RISKPROx in balance?
  console.log(`Redeeming ${riskproxAmount} ${tokens.RISKPROX.name} ... getting aprox: ${reserveAmount} ${tokens.RESERVE.name}... `)
  const userRiskproxBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.bprox2Balance))
  if (new BigNumber(riskproxAmount).gt(userRiskproxBalance)) throw new Error(`Insuficient ${tokens.RISKPROX.name} user balance`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemBProxVendors(BUCKET_X2, toContractPrecision(new BigNumber(riskproxAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = moc.methods
    .redeemBProxVendors(BUCKET_X2, toContractPrecision(new BigNumber(riskproxAmount)), vendorAddress)
    .send(
            {
                from: account,
                value: '0x',
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt

}



export {
  mintStable,
  redeemStable,
  mintRiskPro,
  redeemRiskPro,
  mintRiskProx,
  redeemRiskProx
};