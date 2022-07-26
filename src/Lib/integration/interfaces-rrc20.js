import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import {toContractPrecision, getGasPrice} from './utils';


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


export {
  AllowanceUseReserveToken
};