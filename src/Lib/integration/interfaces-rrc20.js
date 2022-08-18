import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { addCommissions, calcMintInterest } from './interfaces-base';
import { toContractPrecision, getGasPrice, BUCKET_X2 } from './utils';


const AllowanceUseReserveToken = async (interfaceContext, enabled, callback) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;
  const reservetoken = dContracts.contracts.reservetoken

  const newAllowance = enabled
        ? Web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString())
        : 0;

  // Calculate estimate gas cost
  const estimateGas = await reservetoken.methods
    .approve(dContracts.contracts.moc._address, toContractPrecision(newAllowance))
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = reservetoken.methods
    .approve(dContracts.contracts.moc._address, toContractPrecision(newAllowance))
    .send(
            {
                from: account,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            },
            callback
        );

  return receipt
}


const mintStableRRC20 = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint stable token with collateral RRC20

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment } = config;

  // get bitcoin price from contract
  const bitcoinPrice = new BigNumber(Web3.utils.fromWei(contractStatusData.bitcoinPrice))

  reserveAmount = new BigNumber(reserveAmount);

  // Stable amount in reserve
  const stableAmount = reserveAmount.times(bitcoinPrice)

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'STABLE', 'MINT')

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${stableAmount} ${environment.tokens.STABLE.name} you need > ${valueToSend.toString()} ${environment.tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insuficient reserve balance')

  // Allowance    reserveAllowance
  console.log(`Allowance: To mint ${stableAmount} ${environment.tokens.STABLE.name} you need > ${valueToSend.toString()} ${environment.tokens.RESERVE.name} in your spendable balance`)
  const userSpendableBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.reserveAllowance))
  if (valueToSend.gt(userSpendableBalance)) throw new Error('Insuficient spendable balance... please make an allowance to the MoC contract')

  // There are suficient STABLE in the contracts to mint?
  const stableAvalaiblesToMint = new BigNumber(Web3.utils.fromWei(contractStatusData.docAvailableToMint))
  if (new BigNumber(stableAmount).gt(stableAvalaiblesToMint)) throw new Error(`Insuficient ${environment.tokens.STABLE.name} avalaibles to mint`)

  // Mint STABLE RRC20 function... no values sent
  valueToSend = null

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .mintStableTokenVendors(toContractPrecision(reserveAmount), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // encode function
  const receipt = moc.methods
    .mintStableTokenVendors(toContractPrecision(reserveAmount), vendorAddress)
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

const redeemStableRRC20 = async (interfaceContext, stableAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem stable token receiving coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment } = config;

  // get bitcoin price from contract
  const bitcoinPrice = new BigNumber(Web3.utils.fromWei(contractStatusData.bitcoinPrice))

  // Stable amount in reserve
  const reserveAmount = new BigNumber(stableAmount).div(bitcoinPrice)

  // Redeem function... no values sent
  const valueToSend = null

  // Verifications

  // User have suficient STABLE in balance?
  console.log(`Redeeming ${stableAmount} ${environment.tokens.STABLE.name} ... getting aprox: ${reserveAmount} ${environment.tokens.RESERVE.name}... `)
  const userStableBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.docBalance))
  if (new BigNumber(stableAmount).gt(userStableBalance)) throw new Error(`Insuficient ${environment.tokens.STABLE.name}  user balance`)

  // There are suficient Free Stable in the contracts to redeem?
  const stableAvalaiblesToRedeem = new BigNumber(Web3.utils.fromWei(contractStatusData.docAvailableToRedeem))
  if (new BigNumber(stableAmount).gt(stableAvalaiblesToRedeem)) throw new Error(`Insuficient ${environment.tokens.STABLE.name}  avalaibles to redeem in contract`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemFreeStableTokenVendors(toContractPrecision(new BigNumber(stableAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send TX
  const receipt = moc.methods
    .redeemFreeStableTokenVendors(toContractPrecision(new BigNumber(stableAmount)), vendorAddress)
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

const mintRiskProRRC20 = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint RiskPro token with collateral RRC20

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment } = config;

  // Price of RISKPRO in RESERVE
  const riskproPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // RISKPRO amount in RESERVE
  const riskproAmount = new BigNumber(reserveAmount).div(riskproPriceInReserve)

  reserveAmount = new BigNumber(reserveAmount);

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'RISKPRO', 'MINT')

  // Add Slippage plus %

  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${riskproAmount} ${environment.tokens.RISKPRO.name} you need > ${valueToSend.toString()} ${environment.tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insuficient reserve balance')

  // Allowance    reserveAllowance
  console.log(`Allowance: To mint ${riskproAmount} ${environment.tokens.RISKPRO.name} you need > ${valueToSend.toString()} ${environment.tokens.RESERVE.name} in your spendable balance`)
  const userSpendableBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.reserveAllowance))
  if (valueToSend.gt(userSpendableBalance)) throw new Error('Insuficient spendable balance... please make an allowance to the MoC contract')

  valueToSend = null
  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .mintRiskProVendors(toContractPrecision(reserveAmount), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // encode function
  const receipt = moc.methods
    .mintRiskProVendors(toContractPrecision(reserveAmount), vendorAddress)
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

const redeemRiskProRRC20 = async (interfaceContext, riskproAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem Riskpro token receiving RRC20

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment } = config;


  // Price of RISKPRO in RESERVE
  const riskproPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // RISKPRO amount in reserve
  const reserveAmount = new BigNumber(riskproAmount).times(riskproPriceInReserve)

  // Redeem function... no values sent
  const valueToSend = null

  // Verifications

  // User have suficient RISKPRO in balance?
  console.log(`Redeeming ${riskproAmount} ${environment.tokens.RISKPRO.name} ... getting aprox: ${reserveAmount} ${environment.tokens.RESERVE.name}... `)
  const userRiskproBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.bproBalance))
  if (new BigNumber(riskproAmount).gt(userRiskproBalance)) throw new Error(`Insuficient ${environment.tokens.RISKPRO.name} user balance`)

  // There are suficient RISKPRO in the contracts to redeem?
  const riskproAvailableToRedeem = new BigNumber(Web3.utils.fromWei(contractStatusData.bproAvailableToRedeem))
  if (new BigNumber(riskproAmount).gt(riskproAvailableToRedeem)) throw new Error(`Insuficient ${environment.tokens.RISKPRO.name} avalaibles to redeem in contract`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemRiskProVendors(toContractPrecision(new BigNumber(riskproAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // encode function
  const receipt = moc.methods
    .redeemRiskProVendors(toContractPrecision(new BigNumber(riskproAmount)), vendorAddress)
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

const mintRiskProxRRC20 = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint RiskproX token with collateral RRC20

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment } = config;

  // Price of Riskprox in coinbase
  const bprox2PriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2PriceInRbtc))

  reserveAmount = new BigNumber(reserveAmount);

  // RISKPROx amount in reserve
  const riskproxAmount = reserveAmount.div(bprox2PriceInReserve)

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'RISKPROX', 'MINT')

  // Calc Interest to mint RISKPROx
  const mintInterest = await calcMintInterest(dContracts, reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(new BigNumber(Web3.utils.fromWei(mintInterest)))

  console.log(`Mint RISKPROx Interest ${mintInterest}`)

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${riskproxAmount}  ${environment.tokens.RISKPROX.name} you need > ${valueToSend.toString()} ${environment.tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insuficient reserve balance')

  // There are suficient RISKPROX in the contracts to mint?
  const riskproxAvalaiblesToMint = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2AvailableToMint))
  if (new BigNumber(riskproxAmount).gt(riskproxAvalaiblesToMint)) throw new Error(`Insuficient ${environment.tokens.RISKPROX.name} avalaibles to mint`)

  valueToSend = null
  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .mintRiskProxVendors(BUCKET_X2, toContractPrecision(reserveAmount), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = moc.methods
    .mintRiskProxVendors(BUCKET_X2, toContractPrecision(reserveAmount), vendorAddress)
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

const redeemRiskProxRRC20 = async (interfaceContext, riskproxAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem Riskprox token receiving RRC20

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment } = config;

  // Price of Riskprox in RESERVE
  const riskproxPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2PriceInRbtc))

  // Riskprox amount in reserve RESERVE
  const reserveAmount = new BigNumber(riskproxAmount).times(riskproxPriceInReserve)

  // Redeem function... no values sent
  const valueToSend = null

  // Verifications

  // User have suficient RISKPROx in balance?
  console.log(`Redeeming ${riskproxAmount} ${environment.tokens.RISKPROX.name}  ... getting aprox: ${reserveAmount} ${environment.tokens.RESERVE.name} ... `)
  const userRiskproxBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.bprox2Balance))
  if (new BigNumber(riskproxAmount).gt(userRiskproxBalance)) throw new Error(`Insuficient ${environment.tokens.RISKPROX.name}  user balance`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemRiskProxVendors(BUCKET_X2, toContractPrecision(new BigNumber(riskproxAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // encode function
  const receipt = moc.methods
    .redeemRiskProxVendors(BUCKET_X2, toContractPrecision(new BigNumber(riskproxAmount)), vendorAddress)
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
  AllowanceUseReserveToken,
  mintStableRRC20,
  redeemStableRRC20,
  mintRiskProRRC20,
  redeemRiskProRRC20,
  mintRiskProxRRC20,
  redeemRiskProxRRC20
};