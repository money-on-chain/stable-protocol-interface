import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { addCommissions } from './interfaces-base';
import { toContractPrecision, getGasPrice } from './utils';

const mintRiskPro = async (interfaceContext, reserveAmount, mintSlippage, callback) => {
  // Mint RiskPro token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, environment, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;

  console.log("RISKPRO AMOUNT");
  console.log(reserveAmount);

  // Price of RISKPRO in RESERVE
  //const riskproPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // RISKPRO amount in RESERVE
  //const reserveAmount = new BigNumber(riskproAmount).times(riskproPriceInReserve)

  reserveAmount = new BigNumber(reserveAmount);

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'BPRO', 'MINT')

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have suficient reserve to pay?
  console.log(`To mint ${reserveAmount} ${environment.tokens.RISKPRO.name} you need > ${valueToSend.toString()} ${environment.tokens.RESERVE.name} in your balance`)
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
                gasPrice: await getGasPrice(),
                gas: estimateGas,
                gasLimit: estimateGas
            },
            callback
        );

  return receipt
}

export { mintRiskPro };