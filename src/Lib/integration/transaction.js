import abiDecoder from 'abi-decoder';
import Web3 from 'web3';
import { toContractPrecision, getAppMode } from './utils';

const addABI = (abiContracts, appMode) => {

  // Abi decoder
  abiDecoder.addABI(abiContracts.MoC.abi)
  abiDecoder.addABI(abiContracts.MoCState.abi)
  abiDecoder.addABI(abiContracts.MoCExchange.abi)
  abiDecoder.addABI(abiContracts.MoCInrate.abi)
  abiDecoder.addABI(abiContracts.MoCSettlement.abi)
  abiDecoder.addABI(abiContracts.StableToken.abi)
  abiDecoder.addABI(abiContracts.RiskProToken.abi)
  abiDecoder.addABI(abiContracts.MoCToken.abi)
  abiDecoder.addABI(abiContracts.MoCVendors.abi)
  if (appMode === 'RRC20') {
    abiDecoder.addABI(abiContracts.ReserveToken.abi)
  }

  abiDecoder.addABI(abiContracts.IRegistry.abi)
  abiDecoder.addABI(abiContracts.IStakingMachine.abi)
  abiDecoder.addABI(abiContracts.IDelayMachine.abi)
  abiDecoder.addABI(abiContracts.ISupporters.abi)
  abiDecoder.addABI(abiContracts.IVestingMachine.abi)
  abiDecoder.addABI(abiContracts.IVotingMachine.abi)

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