import { toContract } from '../numberHelper';
import nodeManagerBase from './nodeManagerBase';
// import nodeManagerStaking from './nodeManagerStaking';
// import { Log } from 'meteor/logging'

const BigNumber = require('bignumber.js');

export default async ({
  web3,
  contracts,
  partialExecutionSteps,
  priceFeed,
  gasPrice
}) => {
  // FIXME HardCoding default gas temporarily
  // eslint-disable-next-line no-param-reassign
  web3.eth.defaultGas = 2000000;

  // TODO: try not repeat this in both nodeManagers
  const strToBytes32 = bucket => web3.utils.asciiToHex(bucket, 32);
  const bucketX2 = 'X2';

  const { moc, reserveToken } = contracts;

  // Base functions
  const base = await nodeManagerBase({
    web3,
    contracts,
    partialExecutionSteps,
    priceFeed,
    gasPrice,
    appMode: 'RRC20'
  });

  /* const staking = await nodeManagerStaking({
    web3,
    contracts,
    gasPrice,
    getAccount: base.getAccount
  }); */

  const { vendor } = {
    address: "0xf69287F5Ca3cC3C6d3981f2412109110cB8af076",
    markup: "500000000000000"
  };

  // RRC20 functions
  const rrc20Functions = {};

  // Approve
  rrc20Functions.approve = (address, balance) => {
    const weiAmount = web3.utils.toWei(balance, 'ether');
    return gasPrice().then(price => {
      return reserveToken.methods.approve(moc.options.address, weiAmount).send({ from: address, gasPrice: price });
    })
  };

  // Approve Reserve
  rrc20Functions.approveReserve = (address) => {
    const weiAmount = web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString());
    return gasPrice().then(price => {
      return reserveToken.methods.approve(moc.options.address, weiAmount).send({ from: address, gasPrice: price });
    })
  };

  // Balance
  rrc20Functions.getSpendableBalance = address => moc.methods.getAllowance(address).call();
  rrc20Functions.getReserveAllowance = address =>
    reserveToken.methods.allowance(address, moc.options.address).call();

  const addCommissionAndVendorMarkup = async (
    weiAmount,
    transactionType,
    commissionCurrencyCode
  ) => {
    let result = new BigNumber(weiAmount);
    if (commissionCurrencyCode === 'RESERVE') {
      const commissionValue = new BigNumber(
        await base.calcCommissionValue(weiAmount, transactionType)
      );
      const vendorMarkup = new BigNumber(
        await base.calculateVendorMarkup(vendor.address, weiAmount)
      );
      result = result.plus(commissionValue).plus(vendorMarkup);
    }
    return result;
  };

  // Reserve Token
  // TODO: change name according to really do
  // name issues, this should change to totalReservedAmount for both apps.

  rrc20Functions.mintBpro = async (
    btcAmount,
    transactionType,
    commissionCurrencyCode,
    callback
  ) => {
    const from = await base.getAccount();
    const weiAmount = toContract(web3.utils.toWei(btcAmount, 'ether'));
    const totalBtcAmount = await addCommissionAndVendorMarkup(
      weiAmount,
      transactionType,
      commissionCurrencyCode
    );
    const duplicateEstimateGasMintBpro = 2 * (await rrc20Functions.estimateGasMintBpro(from, weiAmount));
    const priceGas = await gasPrice();
    return moc.methods.mintRiskProVendors(weiAmount, vendor.address).send(
      {
        from,
        gasPrice: priceGas,
        gas: duplicateEstimateGasMintBpro,
        gasLimit: duplicateEstimateGasMintBpro
      },
      callback
    );
  };

  rrc20Functions.estimateGasMintBpro = async (address, weiAmount) => {
    return moc.methods.mintRiskProVendors(weiAmount, vendor.address).estimateGas({ from: address });
  };

  rrc20Functions.mintBprox2 = async (
    btcAmount,
    transactionType,
    commissionCurrencyCode,
    callback
  ) => {
    const from = await base.getAccount();
    const weiAmount = toContract(web3.utils.toWei(btcAmount, 'ether'));
    const btcInterestAmount = await base.calcMintInterestValues(weiAmount);

    // Interest Margin. TODO: Is this ok? Where did this interestFinal came from?
    const interestFinal = new BigNumber(0.01)
      .multipliedBy(btcInterestAmount)
      .plus(btcInterestAmount);

    let totalBtcAmount = await addCommissionAndVendorMarkup(
      weiAmount,
      transactionType,
      commissionCurrencyCode
    );
    totalBtcAmount = toContract(new BigNumber(totalBtcAmount).plus(interestFinal));
    const duplicateEstimateGasMintBprox2 = 2 * (await rrc20Functions.estimateGasMintBprox2(from, weiAmount));
    const priceGas = await gasPrice();
    return moc.methods.mintRiskProxVendors(strToBytes32(bucketX2), weiAmount, vendor.address).send(
      {
        from,
        gasPrice: priceGas,
        gas: duplicateEstimateGasMintBprox2,
        gasLimit: duplicateEstimateGasMintBprox2
      },
      callback
    );
  };

  rrc20Functions.estimateGasMintBprox2 = async (address, weiAmount) => {
    return moc.methods
      .mintRiskProxVendors(strToBytes32(bucketX2), weiAmount, vendor.address)
      .estimateGas({ from: address });
  };

  rrc20Functions.mintDoc = async (btcAmount, transactionType, commissionCurrencyCode, callback) => {
    const from = await base.getAccount();
    const weiAmount = toContract(web3.utils.toWei(btcAmount, 'ether'));
    const totalBtcAmount = await addCommissionAndVendorMarkup(
      weiAmount,
      transactionType,
      commissionCurrencyCode
    );
    const duplicateEstimateGasMintDoc = 2 * (await rrc20Functions.estimateGasMintDoc(from, weiAmount));
    const priceGas = await gasPrice();
    return moc.methods.mintStableTokenVendors(weiAmount, vendor.address).send(
      {
        from,
        gasPrice: priceGas,
        gas: duplicateEstimateGasMintDoc,
        gasLimit: duplicateEstimateGasMintDoc
      },
      callback
    );
  };

  rrc20Functions.estimateGasMintDoc = async (address, weiAmount) => {
    return moc.methods.mintStableTokenVendors(weiAmount, vendor.address).estimateGas({ from: address });
  };

  return { ...base, ...rrc20Functions, }; //, staking };
};
