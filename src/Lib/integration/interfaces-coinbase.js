import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { addCommissions } from './interfaces-base';
import { toContractPrecision, getGasPrice } from './utils';

const mintRiskPro = async (interfaceContext, reserveAmount, mintSlippage, callback) => {
  // Mint RiskPro token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, environment, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;

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
  console.log(`To mint ${riskproAmount} ${environment.tokens.RISKPRO.name} you need > ${valueToSend.toString()} ${environment.tokens.RESERVE.name} in your balance`)
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
            },
            callback
        );

  return receipt
}

const redeemRiskPro = async (interfaceContext, riskproAmount, callback) => {
  // Redeem RISKPRO token receiving coin base

  /*
  const userAddress = `${process.env.USER_ADDRESS}`.toLowerCase()
  const vendorAddress = `${process.env.VENDOR_ADDRESS}`.toLowerCase()
  */

  const { web3, contractStatusData, userBalanceData, config, environment, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;

  // Price of RISKPRO in RESERVE
  const riskproPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // RISKPRO amount in reserve
  const reserveAmount = new BigNumber(riskproAmount).times(riskproPriceInReserve)

  // Verifications

  // User have suficient RISKPRO in balance?
  console.log(`Redeeming ${riskproAmount} ${environment.tokens.RISKPRO.name} ... getting aprox: ${reserveAmount} ${environment.tokens.RESERVE.name}... `)
  const userRiskproBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.bproBalance))
  if (new BigNumber(riskproAmount).gt(userRiskproBalance)) throw new Error(`Insufficient ${environment.tokens.RISKPRO.name} user balance`)

  // There are suficient RISKPRO in the contracts to redeem?
  const riskproAvailableToRedeem = new BigNumber(Web3.utils.fromWei(contractStatusData.bproAvailableToRedeem))
  if (new BigNumber(riskproAmount).gt(riskproAvailableToRedeem)) throw new Error(`Insufficient ${environment.tokens.RISKPRO.name} avalaibles to redeem in contract`)

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
                gasPrice: await getGasPrice(),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            },
            callback
        );

  return receipt
}


export { mintRiskPro, redeemRiskPro };