import { toContract } from '../numberHelper';

export default async function nodeManagerStaking({ web3, contracts, gasPrice, getAccount }) {
  const { stakingMachine, supporters, mocToken, delayingMachine } = contracts;
  /* supporter API */

  const deposit = async (mocs, address, callback = () => { }) => {
    const from = await getAccount();
    const weiAmount = toContract(web3.utils.toWei(mocs, 'ether'));
    const methodCall = stakingMachine.methods.deposit(weiAmount, address);
    const gasLimit = 2 * (await methodCall.estimateGas({ from }));
    methodCall.call({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit });
    return methodCall.send({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit }, callback);
  };

  const depositFrom = async (mocs, destination, source, callback) => {
    const from = await getAccount();
    const weiAmount = toContract(web3.utils.toWei(mocs, 'ether'));
    const methodCall = stakingMachine.methods.depositFrom(weiAmount, destination, source);
    const gasLimit = 2 * (await methodCall.estimateGas({ from }));
    methodCall.call({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit });
    return methodCall.send({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit }, callback);
  };

  const unstake = async (mocs, callback = () => { }) => {
    const from = await getAccount();
    const weiAmount = toContract(web3.utils.toWei(mocs, 'ether'));
    const methodCall = stakingMachine.methods.withdraw(weiAmount);
    const gasLimit = 2 * (await methodCall.estimateGas({ from }));
    methodCall.call({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit });
    return methodCall.send({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit }, callback);
  };

  // This will be implemented in the future inside the StakingMachine, right
  // now it is a two steps hack to provide the functionality.
  const unstakeAll = async (callback = () => { }) => {
    const from = await getAccount();
    // The method getBalanceAt is added to give support to staking.withdrawAll (that is not implemented)
    // The method is not exported in the interface right now.
    const tokens = await supporters.methods.getBalanceAt(stakingMachine._address, from).call();
    if (!tokens || tokens.toString() === '0') {
      return null;
    }
    // The method withdrawTokens is added to give support to staking.withdrawAll (that is not implemented)
    // The method is not exported in the interface right now.
    const methodCall = stakingMachine.methods.withdrawTokens(tokens);
    const gasLimit = 2 * (await methodCall.estimateGas({ from }));
    methodCall.call({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit });
    return methodCall.send({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit }, callback);
  };

  const getStakedBalance = async address => {
    const anAddress = address || (await getAccount());
    return stakingMachine.methods.getBalance(anAddress).call();
  };

  const getLockedBalance = async address => {
    const anAddress = address || (await getAccount());
    return stakingMachine.methods.getLockedBalance(anAddress).call();
  };

  const getLockingInfo = async address => {
    const anAddress = address || (await getAccount());
    return stakingMachine.methods.getLockingInfo(anAddress).call();
  };

  // MoC Token
  const getMoCAllowance = async address => {
    const from = address || (await getAccount());
    return mocToken.methods.allowance(from, stakingMachine._address).call();
  };
  const approveMoCToken = async (enabled, callback = () => { }) => {
    const from = await getAccount();
    const newAllowance = enabled ? web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString()) : 0;
    return mocToken.methods
      .approve(stakingMachine._address, newAllowance)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  const withdraw = async (id, callback = () => { }) => {
    const from = await getAccount();
    const methodCall = delayingMachine.methods.withdraw(id);
    const gasLimit = 2 * (await methodCall.estimateGas({ from }));
    methodCall.call({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit });
    return methodCall.send({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit }, callback);
  };

  const cancelWithdraw = async (id, callback = () => { }) => {
    const from = await getAccount();
    const methodCall = delayingMachine.methods.cancel(id);
    const gasLimit = 2 * (await methodCall.estimateGas({ from }));
    methodCall.call({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit });
    return methodCall.send({ from, gasPrice: await gasPrice(), gas: gasLimit, gasLimit: gasLimit }, callback);
  };

  const getPendingWithdrawals = async address => {
    const from = address || (await getAccount());
    const { ids, amounts, expirations } = await delayingMachine.methods
      .getTransactions(from)
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

  const claimRewards = async (from, incentiveDestination, incentiveValue, callback = () => { }) => {
    return web3.eth.sendTransaction({ from: from, to: incentiveDestination, value: incentiveValue, gasPrice: await gasPrice() }, callback);
  };

  return {
    deposit,
    depositFrom,
    unstake,
    unstakeAll,
    getStakedBalance,
    getLockedBalance,
    getLockingInfo,
    getMoCAllowance,
    approveMoCToken,
    withdraw,
    cancelWithdraw,
    getPendingWithdrawals,
    claimRewards
  };
};
