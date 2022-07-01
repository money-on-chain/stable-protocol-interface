import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { addCommissions } from './interface-base';
import {toContractPrecision } from './utils';

const mintRiskpro = async (interface, riskproAmount, mintSlippage, callback) => {
  // Mint RiskPro token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, environment } = interface;
  const dContracts = window.integration;

  const userAddress = `${process.env.USER_ADDRESS}`.toLowerCase()
  const vendorAddress = `${process.env.VENDOR_ADDRESS}`.toLowerCase()
  const mintSlippage = `${process.env.MINT_SLIPPAGE}`

  // Price of RISKPRO in RESERVE
  const riskproPriceInReserve = new BigNumber(Web3.utils.fromWei(dataContractStatus.bproPriceInRbtc))

  // RISKPRO amount in RESERVE
  const reserveAmount = new BigNumber(riskproAmount).times(riskproPriceInReserve)

  let valueToSend = await addCommissions(web3, dContracts, contractStatusData, userBalanceData, reserveAmount, 'BPRO', 'MINT')

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${riskproAmount} ${config.tokens.RISKPRO.name} you need > ${valueToSend.toString()} ${config.tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceStats.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insuficient reserve balance')

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .mintBProVendors(toContractPrecision(reserveAmount), vendorAddress)
    .estimateGas({ from: userAddress, value: toContractPrecision(valueToSend) })

  // Send tx
  const receipt = moc.methods
    .mintBProVendors(toContractPrecision(reserveAmount), vendorAddress)
    .send(
            {
                from,
                value: totalBtcAmount,
                gasPrice: await gasPrice(),
                gas: estimateGas,
                gasLimit: estimateGas
            },
            callback
        );

  return receipt
}

export { mintRiskpro };