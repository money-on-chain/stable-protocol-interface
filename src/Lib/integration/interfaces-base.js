import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { calcCommission } from './multicall';
import {toContractPrecision, BUCKET_X2, BUCKET_C0, getGasPrice} from './utils';


const addCommissions = async (interfaceContext, reserveAmount, token, action) => {

  const { web3, contractStatusData, userBalanceData, config, account, vendorAddress } = interfaceContext;
  const dContracts = window.integration;
  const {environment} = config;

  // get reserve price from contract
  const reservePrice = new BigNumber(Web3.utils.fromWei(contractStatusData.bitcoinPrice))

  // Get commissions from contracts
  const commissions = await calcCommission(web3, dContracts, contractStatusData, reserveAmount, token, action, vendorAddress)

  // Calculate commissions using Reserve payment
  const commissionInReserve = new BigNumber(Web3.utils.fromWei(commissions.commission_reserve))
    .plus(new BigNumber(Web3.utils.fromWei(commissions.vendorMarkup)))

  // Calculate commissions using MoC Token payment
  const commissionInMoc = new BigNumber(Web3.utils.fromWei(commissions.commission_moc))
    .plus(new BigNumber(Web3.utils.fromWei(commissions.vendorMarkup)))
    .times(reservePrice).div(Web3.utils.fromWei(contractStatusData.mocPrice))

  // Enough MoC to Pay commission with MoC Token
  const enoughMOCBalance = BigNumber(Web3.utils.fromWei(userBalanceData.mocBalance)).gte(commissionInMoc)

  // Enough MoC allowance to Pay commission with MoC Token
  const enoughMOCAllowance = BigNumber(Web3.utils.fromWei(userBalanceData.mocAllowance)).gt(0) &&
      BigNumber(Web3.utils.fromWei(userBalanceData.mocAllowance)).gte(commissionInMoc)

  // add commission to value send
  let valueToSend

  if (enoughMOCBalance && enoughMOCAllowance) {
    valueToSend = reserveAmount
    console.log(`Paying commission with MoC Tokens: ${commissionInMoc} MOC`)
  } else {
    valueToSend = reserveAmount.plus(commissionInReserve)
    console.log(`Paying commission with RBTC: ${commissionInReserve} RBTC`)
  }

  return valueToSend
}

const calcMintInterest = async (interfaceContext, amount) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  amount = new BigNumber(amount);

  const mocinrate = dContracts.contracts.mocinrate
  const calcMintInterest = await mocinrate.methods.calcMintInterestValues(BUCKET_X2, toContractPrecision(amount)).call()
  return calcMintInterest
}

const transferStableTo = async (interfaceContext, to, amount, onTransaction, onReceipt) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const stabletoken = dContracts.contracts.stabletoken;

  amount = new BigNumber(amount);

  // Calculate estimate gas cost
  const estimateGas = await stabletoken.methods
    .transfer(to, toContractPrecision(amount))
    .estimateGas({ from: account });

  // Send tx
  const receipt = stabletoken.methods
    .transfer(to, toContractPrecision(amount))
    .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
          }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}

const transferRiskProTo = async (interfaceContext, to, amount, onTransaction, onReceipt) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const riskprotoken = dContracts.contracts.riskprotoken

  amount = new BigNumber(amount);

  // Calculate estimate gas cost
  const estimateGas = await riskprotoken.methods
    .transfer(to, toContractPrecision(amount))
    .estimateGas({ from: account })

  // Send tx
  const receipt = riskprotoken.methods
    .transfer(to, toContractPrecision(amount))
    .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
          }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}

const transferMocTo = async (interfaceContext, to, amount, onTransaction, onReceipt) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const moctoken = dContracts.contracts.moctoken

  amount = new BigNumber(amount);

  // Calculate estimate gas cost
  const estimateGas = await moctoken.methods
    .transfer(to, toContractPrecision(amount))
    .estimateGas({ from: account })

  // Send tx
  const receipt = moctoken.methods
    .transfer(to, toContractPrecision(amount))
    .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
          }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}

const transferRBTCTo = async (interfaceContext, to, amount, callback) => {
  const { web3, account } = interfaceContext;
  const receipt = await web3.eth.sendTransaction(
  {
    from: account.toLowerCase(),
    to: to.toLowerCase(),
    value: amount,
    gasPrice: await getGasPrice(web3),
    gas: 72000
  });

  return receipt;
}


const approveMoCTokenCommission = async (interfaceContext, enabled, onTransaction, onReceipt) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const mocAddress = dContracts.contracts.moc._address
  const moctoken = dContracts.contracts.moctoken

  const newAllowance = enabled
        ? Web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString())
        : 0;

  // Calculate estimate gas cost
  const estimateGas = await moctoken.methods
    .approve(mocAddress, newAllowance)
    .estimateGas({ from: account })

  // Send tx
  const receipt = moctoken.methods
    .approve(mocAddress, newAllowance)
    .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
          }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

  return receipt
}


export { addCommissions, calcMintInterest, transferStableTo, transferRiskProTo, transferMocTo, transferRBTCTo, approveMoCTokenCommission };