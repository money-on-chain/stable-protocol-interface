import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { toContractPrecision, getGasPrice, BUCKET_X2 } from './utils';

const stackedBalance = async (address) => {
    const dContracts = window.integration;
    const istakingmachine = dContracts.contracts.istakingmachine
    return await istakingmachine.methods.getBalance(address).call();
};

const lockedBalance = async (address) => {
    const dContracts = window.integration;
    const istakingmachine = dContracts.contracts.istakingmachine
    return await istakingmachine.methods.getLockedBalance(address).call();
};

const pendingWithdrawals = async (address) => {
    const dContracts = window.integration;
    const idelaymachine = dContracts.contracts.idelaymachine
    const { ids, amounts, expirations } = await idelaymachine.methods
        .getTransactions(address)
        .call();
    const withdraws = [];
    for (let i = 0; i < ids.length; i++) {
        withdraws.push({
            id: ids[i],
            amount: amounts[i],
            expiration: expirations[i]
        });
    }
    return withdraws;
};

const stakingDeposit = async (interfaceContext, amount, address, callback) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const istakingmachine = dContracts.contracts.istakingmachine

  amount = new BigNumber(amount);

  // Calculate estimate gas cost
  const estimateGas = await istakingmachine.methods
    .deposit(toContractPrecision(amount), address)
    .estimateGas({ from: account })

  // Send tx
  const receipt = istakingmachine.methods
    .deposit(toContractPrecision(amount), address)
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

const unStake = async (interfaceContext, amount, callback) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const istakingmachine = dContracts.contracts.istakingmachine

  amount = new BigNumber(amount);

  // Calculate estimate gas cost
  const estimateGas = await istakingmachine.methods
    .withdraw(toContractPrecision(amount))
    .estimateGas({ from: account })

  // Send tx
  const receipt = istakingmachine.methods
    .withdraw(toContractPrecision(amount))
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

const delayMachineWithdraw = async (interfaceContext, id, callback) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const idelaymachine = dContracts.contracts.idelaymachine

  // Calculate estimate gas cost
  const estimateGas = await idelaymachine.methods
    .withdraw(id)
    .estimateGas({ from: account })

  // Send tx
  const receipt = idelaymachine.methods
    .withdraw(id)
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


const delayMachineCancelWithdraw = async (interfaceContext, id, callback) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const idelaymachine = dContracts.contracts.idelaymachine

  // Calculate estimate gas cost
  const estimateGas = await idelaymachine.methods
    .cancel(id)
    .estimateGas({ from: account })

  // Send tx
  const receipt = idelaymachine.methods
    .cancel(id)
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

const approveMoCTokenStaking = async (interfaceContext, enabled, callback) => {

  const { web3, account } = interfaceContext;
  const dContracts = window.integration;

  const stakingAddress = dContracts.contracts.istakingmachine._address
  const tg = dContracts.contracts.tg

  const newAllowance = enabled
        ? Web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString())
        : 0;

  // Calculate estimate gas cost
  const estimateGas = await tg.methods
    .approve(stakingAddress, newAllowance)
    .estimateGas({ from: account })

  // Send tx
  const receipt = tg.methods
    .approve(stakingAddress, newAllowance)
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

const getMoCAllowance = async (address) => {
  const dContracts = window.integration;
  const tg = dContracts.contracts.tg;
  const stakingAddress = dContracts.contracts.istakingmachine._address
  return await tg.methods.allowance(address, stakingAddress).call();
};



export {
  stackedBalance,
  lockedBalance,
  pendingWithdrawals,
  stakingDeposit,
  unStake,
  delayMachineWithdraw,
  delayMachineCancelWithdraw,
  approveMoCTokenStaking,
  getMoCAllowance,
};