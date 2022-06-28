/*
const abiDecoder = require('abi-decoder')
const Web3 = require('web3')
*/

import abiDecoder from 'abi-decoder';
import Web3 from 'web3';
import { toContractPrecision, getAppMode } from './utils';

const addABI = (dContracts, appMode) => {

  // Abi decoder
  abiDecoder.addABI(dContracts.json.MoC.abi)
  abiDecoder.addABI(dContracts.json.MoCState.abi)
  abiDecoder.addABI(dContracts.json.MoCExchange.abi)
  abiDecoder.addABI(dContracts.json.MoCInrate.abi)
  abiDecoder.addABI(dContracts.json.MoCSettlement.abi)
  abiDecoder.addABI(dContracts.json.StableToken.abi)
  abiDecoder.addABI(dContracts.json.RiskProToken.abi)
  abiDecoder.addABI(dContracts.json.MoCToken.abi)
  abiDecoder.addABI(dContracts.json.MoCVendors.abi)
  if (appMode === 'RRC20') {
    abiDecoder.addABI(dContracts.json.ReserveToken.abi)
  }
  /*
  abiDecoder.addABI(dContracts.json.IRegistry.abi)
  abiDecoder.addABI(dContracts.json.IStakingMachine.abi)
  abiDecoder.addABI(dContracts.json.IDelayMachine.abi)
  abiDecoder.addABI(dContracts.json.ISupporters.abi)
  abiDecoder.addABI(dContracts.json.IVestingMachine.abi)
  abiDecoder.addABI(dContracts.json.IVotingMachine.abi)
  */
}

const renderEventField = (eveName, eveValue) => {
  const formatItemsWei = new Set([
    'amount',
    'reserveTotal',
    'reservePrice',
    'mocCommissionValue',
    'mocPrice',
    'commission',
    'mocCommissionValue',
    'mocPrice',
    'btcMarkup',
    'mocMarkup',
    'interests',
    'leverage',
    'value',
    'paidMoC',
    'paidReserveToken',
    'paidRBTC',
    'staking'])

  if (formatItemsWei.has(eveName)) { eveValue = Web3.utils.fromWei(eveValue) }

  console.log('\x1b[32m%s\x1b[0m', `${eveName}: ${eveValue}`)
}

const renderEvent = (evente) => {
  console.log('')
  console.log('\x1b[35m%s\x1b[0m', `Event: ${evente.name}`)
  console.log('')
  evente.events.forEach(eve => renderEventField(eve.name, eve.value))
}

const decodeEvents = (receipt) => {
  const decodedLogs = abiDecoder.decodeLogs(receipt.logs)

  const filterIncludes = [
    'StableTokenMint',
    'StableTokenRedeem',
    'FreeStableTokenRedeem',
    'RiskProWithDiscountMint',
    'RiskProMint',
    'RiskProRedeem',
    'RiskProxMint',
    'RiskProxRedeem',
    'Transfer',
    'Approval',
    'VendorReceivedMarkup',
    'VendorStakeAdded',
    'VendorStakeRemoved'
  ]

  const filteredEvents = decodedLogs.filter(event =>
    filterIncludes.includes(event.name)
  )

  filteredEvents.forEach(evente => renderEvent(evente))

  return filteredEvents
}

const sendTransaction = async (web3, value, estimateGas, encodedCall, toContract) => {
  const userAddress = `${process.env.USER_ADDRESS}`.toLowerCase()
  const privateKey = process.env.USER_PK
  const gasMultiplier = process.env.GAS_MULTIPLIER

  console.log('Please wait... sending transaction... Wait until blockchain mine transaction!')

  let valueToSend
  if ((typeof value === 'undefined') || value === null) {
    valueToSend = '0x'
  } else {
    valueToSend = toContractPrecision(value)
  }

  // Get gas price from node
  const gasPrice = await web3.eth.getGasPrice()

  // Sign transaction need it PK
  const transaction = await web3.eth.accounts.signTransaction(
    {
      from: userAddress,
      to: toContract,
      value: valueToSend,
      gas: estimateGas * gasMultiplier,
      gasPrice,
      gasLimit: estimateGas * gasMultiplier,
      data: encodedCall
    },
    privateKey
  )

  // Send transaction and get recipt
  const receipt = await web3.eth.sendSignedTransaction(
    transaction.rawTransaction
  )

  // Print decode events
  const filteredEvents = decodeEvents(receipt)

  return { receipt, filteredEvents }
}

export { sendTransaction, addABI };