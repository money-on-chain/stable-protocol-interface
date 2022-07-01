import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { calcCommission } from './multicall';
import {toContractPrecision, BUCKET_X2, BUCKET_C0} from './utils';


const addCommissions = async (interface, reserveAmount, token, action) => {

  const { web3, contractStatusData, userBalanceData, config, environment } = interface;
  const dContracts = window.integration;

  // get reserve price from contract
  const reservePrice = new BigNumber(Web3.utils.fromWei(dataContractStatus.bitcoinPrice))

  // Get commissions from contracts
  const commissions = await calcCommission(web3, dContracts, contractStatusData, reserveAmount, token, action)

  // Calculate commissions using Reserve payment
  const commissionInReserve = new BigNumber(Web3.utils.fromWei(commissions.commission_reserve))
    .plus(new BigNumber(Web3.utils.fromWei(commissions.vendorMarkup)))

  // Calculate commissions using MoC Token payment
  const commissionInMoc = new BigNumber(Web3.utils.fromWei(commissions.commission_moc))
    .plus(new BigNumber(Web3.utils.fromWei(commissions.vendorMarkup)))
    .times(reservePrice).div(Web3.utils.fromWei(dataContractStatus.mocPrice))

  // Enough MoC to Pay commission with MoC Token
  const enoughMOCBalance = BigNumber(Web3.utils.fromWei(userBalanceStats.mocBalance)).gte(commissionInMoc)

  // Enough MoC allowance to Pay commission with MoC Token
  const enoughMOCAllowance = BigNumber(Web3.utils.fromWei(userBalanceStats.mocAllowance)).gt(0) &&
      BigNumber(Web3.utils.fromWei(userBalanceStats.mocAllowance)).gte(commissionInMoc)

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

export { addCommissions };