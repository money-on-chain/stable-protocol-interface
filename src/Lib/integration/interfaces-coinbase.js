import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { addCommissions, calcMintInterest } from './interfaces-base';
import { toContractPrecision, getGasPrice, BUCKET_X2 } from './utils';

const mintTP = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint TP with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // get reserve price from contract
  const reservePrice = new BigNumber(Web3.utils.fromWei(contractStatusData.bitcoinPrice))

  reserveAmount = new BigNumber(reserveAmount);

  // TP amount in reserve
  const tpAmount = reserveAmount.times(reservePrice)

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'DOC', 'MINT')

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have sufficient reserve to pay?
  console.log(`To mint ${tpAmount} ${tokens.TP.name} you need > ${valueToSend.toString()} ${tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insufficient reserve balance')

  // There are sufficient TP in the contracts to mint?
  const tpAvailableToMint = new BigNumber(Web3.utils.fromWei(contractStatusData.docAvailableToMint))
  if (new BigNumber(tpAmount).gt(tpAvailableToMint)) throw new Error(`Insufficient ${tokens.TP.name} available to mint`)

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

const redeemTP = async (interfaceContext, tpAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem TP token receiving coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // get reserve price from contract
  const reservePrice = new BigNumber(Web3.utils.fromWei(contractStatusData.bitcoinPrice))

  // Stable amount in reserve
  const reserveAmount = new BigNumber(tpAmount).div(reservePrice)

  // Redeem function... no values sent
  const valueToSend = null

  // Verifications

  // User have sufficient TP in balance?
  console.log(`Redeeming ${tpAmount} ${tokens.TP.name} ... getting approx: ${reserveAmount} ${tokens.RESERVE.name}... `)
  const userTPBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.docBalance))
  if (new BigNumber(tpAmount).gt(userTPBalance)) throw new Error('Insufficient TP user balance')

  // There are sufficient TP in the contracts to redeem?
  const tpAvailableToRedeem = new BigNumber(Web3.utils.fromWei(contractStatusData.docAvailableToRedeem))
  if (new BigNumber(tpAmount).gt(tpAvailableToRedeem)) throw new Error(`Insufficient ${tokens.RESERVE.name} available to redeem in contract`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemFreeDocVendors(toContractPrecision(new BigNumber(tpAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = moc.methods
    .redeemFreeDocVendors(toContractPrecision(new BigNumber(tpAmount)), vendorAddress)
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

const mintTC = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint TC token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of TC in RESERVE
  const tcPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // TC amount in RESERVE
  const tcAmount = new BigNumber(reserveAmount).div(tcPriceInReserve)

  reserveAmount = new BigNumber(reserveAmount);

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'BPRO', 'MINT')

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have sufficient reserve to pay?
  console.log(`To mint ${tcAmount} ${tokens.TC.name} you need > ${valueToSend.toString()} ${tokens.RESERVE.name} in your balance`)
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

const redeemTC = async (interfaceContext, tcAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem TC token receiving coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of TC in RESERVE
  const tcPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bproPriceInRbtc))

  // TC amount in reserve
  const reserveAmount = new BigNumber(tcAmount).times(tcPriceInReserve)

  // Verifications

  // User have sufficient TC in balance?
  console.log(`Redeeming ${tcAmount} ${tokens.TC.name} ... getting approx: ${reserveAmount} ${tokens.RESERVE.name}... `)
  const userTCBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.bproBalance))
  if (new BigNumber(tcAmount).gt(userTCBalance)) throw new Error(`Insufficient ${tokens.TC.name} user balance`)

  // There are sufficient TC in the contracts to redeem?
  const tcAvailableToRedeem = new BigNumber(Web3.utils.fromWei(contractStatusData.bproAvailableToRedeem))
  if (new BigNumber(tcAmount).gt(tcAvailableToRedeem)) throw new Error(`Insufficient ${tokens.TC.name} available to redeem in contract`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemBProVendors(toContractPrecision(new BigNumber(tcAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = moc.methods
    .redeemBProVendors(toContractPrecision(new BigNumber(tcAmount)), vendorAddress)
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

const mintTX = async (interfaceContext, reserveAmount, mintSlippage, onTransaction, onReceipt) => {
  // Mint TX token with collateral coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of TX in coinbase
  const txPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2PriceInRbtc))

  reserveAmount = new BigNumber(reserveAmount);

  // TX amount in reserve
  const txAmount = reserveAmount.div(txPriceInReserve)

  let valueToSend = await addCommissions(interfaceContext, reserveAmount, 'BTCX', 'MINT')

  // Calc Interest to mint TX
  const mintInterest = await calcMintInterest(interfaceContext, reserveAmount)

  //valueToSend = new BigNumber(valueToSend).plus(new BigNumber(Web3.utils.fromWei(mintInterest)))
  valueToSend = new BigNumber(valueToSend).plus(new BigNumber(Web3.utils.fromWei(mintInterest)))

  console.log(`Mint TX Interest ${mintInterest}`)

  // Add Slippage plus %
  const mintSlippageAmount = new BigNumber(mintSlippage).div(100).times(reserveAmount)

  valueToSend = new BigNumber(valueToSend).plus(mintSlippageAmount)

  console.log(`Mint Slippage using ${mintSlippage} %. Slippage amount: ${mintSlippageAmount.toString()} Total to send: ${valueToSend.toString()}`)

  // Verifications

  // User have sufficient reserve to pay?
  console.log(`To mint ${txAmount} ${tokens.TX.name} you need > ${valueToSend.toString()} ${tokens.RESERVE.name} in your balance`)
  const userReserveBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.rbtcBalance))
  if (valueToSend.gt(userReserveBalance)) throw new Error('Insufficient reserve balance')

  // There are sufficient TX in the contracts to mint?
  const txAvailableToMint = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2AvailableToMint))
  if (new BigNumber(txAmount).gt(txAvailableToMint)) throw new Error(`Insufficient ${tokens.TX.name} available to mint`)

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

const redeemTX = async (interfaceContext, txAmount, mintSlippage, onTransaction, onReceipt) => {
  // Redeem TX token receiving coin base

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const { environment, tokens } = config;

  // Price of TX in RESERVE
  const txPriceInReserve = new BigNumber(Web3.utils.fromWei(contractStatusData.bprox2PriceInRbtc))

  // TX amount in reserve RESERVE
  const reserveAmount = new BigNumber(txAmount).times(txPriceInReserve)

  // Redeem function... no values sent
  const valueToSend = null

  // Verifications

  // User have sufficient TX in balance?
  console.log(`Redeeming ${txAmount} ${tokens.TX.name} ... getting approx: ${reserveAmount} ${tokens.RESERVE.name}... `)
  const userTXBalance = new BigNumber(Web3.utils.fromWei(userBalanceData.bprox2Balance))
  if (new BigNumber(txAmount).gt(userTXBalance)) throw new Error(`Insufficient ${tokens.TX.name} user balance`)

  const moc = dContracts.contracts.moc

  // Calculate estimate gas cost
  const estimateGas = await moc.methods
    .redeemBProxVendors(BUCKET_X2, toContractPrecision(new BigNumber(txAmount)), vendorAddress)
    .estimateGas({ from: account, value: '0x' })

  // Send tx
  const receipt = moc.methods
    .redeemBProxVendors(BUCKET_X2, toContractPrecision(new BigNumber(txAmount)), vendorAddress)
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
  mintTP,
  redeemTP,
  mintTC,
  redeemTC,
  mintTX,
  redeemTX
};