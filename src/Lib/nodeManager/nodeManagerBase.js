import addressHelper from '../addressHelper';
import { ContractFunctions } from './contractFunctions';
import { toContract } from '../numberHelper';

export default async function nodeManagerBase ({ web3, contracts, partialExecutionSteps, gasPrice, appMode }) {
  const bucketX2 = 'X2';
  const bucketC0 = 'C0';

  const helper = addressHelper(web3);
  const {
    bproToken,
    docToken,
    mocState,
    mocInrate,
    mocExchange,
    mocSettlement,
    moc,
    mocToken,
    fastBtcBridge
  } = contracts;

  const contractFunctions = ContractFunctions(appMode, { moc, mocState, mocInrate });
  const vendor = {
    address: "0xdda74880d638451e6d2c8d3fc19987526a7af730",
    markup: "500000000000000"
  };

  // Address
  module.getBproAddress = () => Promise.resolve(bproToken.address);
  module.getDocAddress = () => Promise.resolve(docToken.address);

  // Contracts
  module.getMoc = () => moc;
  module.getDocToken = () => docToken;
  module.getBproToken = () => bproToken;
  module.getMocState = () => mocState;
  module.getMocInrate = () => mocInrate;
  module.getAllContracts = () =>
    Promise.resolve([moc, docToken, bproToken, mocState, mocInrate, mocSettlement, mocExchange]);

  // MoC Token
  module.getMoCAllowance = async () => {
    const spender = await module.getAccount();
    return mocToken.methods.allowance(spender, moc._address).call();
  };
  module.approveMoCToken = async (enabled, callback = () => { }) => {
    const spender = await module.getAccount();
    const newAllowance = enabled ? web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString()) : 0;
    return mocToken.methods.approve(moc._address, newAllowance).send({ from: spender }, callback);
  };
  module.getMoCBalance = async address => {
    const spender = address || (await module.getAccount());
    return mocToken.methods.balanceOf(spender).call();
  };

  module.getAccount = async () => {
    const [owner] = await web3.eth.getAccounts();
    return owner;
  };
  module.sign = (stringToSign, address) => web3.eth.personal.sign(stringToSign, address, '');

  module.transferDocTo = async (to, amount, callback) => {
    const toWithChecksum = helper.toWeb3CheckSumAddress(to);
    const from = await module.getAccount();
    const contractAmount = web3.utils.toWei(amount, 'ether');
    console.info({
      message: `Calling transfer STABLE with account: ${from}, to account: ${toWithChecksum}.`
    });
    return docToken.methods
      .transfer(toWithChecksum, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  module.transferBproTo = async (to, amount, callback) => {
    const toWithChecksum = helper.toWeb3CheckSumAddress(to);
    const from = await module.getAccount();
    const contractAmount = web3.utils.toWei(amount, 'ether');
    console.info({
      message: `Calling transfer RISKPRO with account: ${from}, to account: ${toWithChecksum}.`
    });
    return bproToken.methods
      .transfer(toWithChecksum, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  module.transferMocTo = async (to, amount, callback) => {
    const toWithChecksum = helper.toWeb3CheckSumAddress(to);
    const from = await module.getAccount();
    const contractAmount = web3.utils.toWei(amount, 'ether');
    console.info({
      message: `Calling transfer MOC with account: ${from}, to account: ${toWithChecksum}.`
    });
    return mocToken.methods
      .transfer(toWithChecksum, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  // MoC transactions
  module.runSettlement = async () => {
    const steps = partialExecutionSteps.settlement;
    const from = await module.getAccount();
    console.info({ message: `Calling settlement with account: ${from}.` });
    const estimateGas = (await moc.methods.runSettlement(steps).estimateGas({ from }) * 2);
    // TODO: Fix estimation
    return moc.methods.runSettlement(steps).send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() });
  };

  module.dailyInratePayment = async () => {
    const from = await module.getAccount();
    console.info({ message: `Calling dailyInRatePayment with account: ${from}.` });
    const estimateGas = (await moc.methods.dailyInratePayment().estimateGas({ from }) * 2);
    return moc.methods.dailyInratePayment().send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() });
  };

  module.payBitProHoldersInterestPayment = async () => {
    const from = await module.getAccount();
    console.info({ message: `Calling payRiskProHoldersInterestPayment with account: ${from}.` });
    const estimateGas = (await contractFunctions.payBitProHoldersInterestPayment().estimateGas({ from }) * 2);
    return contractFunctions
      .payBitProHoldersInterestPayment()
      .send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() });
  };

  module.calcCommissionValue = (amount, transactionType) =>
    mocInrate.methods.calcCommissionValue(amount, transactionType).call();
  module.calculateVendorMarkup = (vendorAccount, amount) =>
    mocInrate.methods.calculateVendorMarkup(vendorAccount, amount).call();

  module.calcMintInterestValues = amount =>
    mocInrate.methods.calcMintInterestValues(strToBytes32(bucketX2), amount).call();

  module.redeemBpro = async (bproAmount, callback) => {
    const from = await module.getAccount();
    const weiAmount = web3.utils.toWei(bproAmount, 'ether');
    console.info({ message: `Calling redeem Bpro with account: ${from}, amount: ${weiAmount}.` });
    const estimateGas = (await contractFunctions.redeemBpro(weiAmount, vendor.address).estimateGas({ from }) * 2);
    return contractFunctions
      .redeemBpro(weiAmount, vendor.address)
      .send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  module.redeemBprox2 = async (bprox2Amount, callback) => {
    const from = await module.getAccount();
    const weiAmount = web3.utils.toWei(bprox2Amount, 'ether');
    console.info({ message: `Calling redeem Bprox2 with account: ${from}, amount: ${weiAmount}.` });
    const estimateGas = (await contractFunctions.redeemBprox2(strToBytes32(bucketX2), weiAmount, vendor.address).estimateGas({ from }) * 2);
    return contractFunctions
      .redeemBprox2(strToBytes32(bucketX2), weiAmount, vendor.address)
      .send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  module.alterRedeemRequestAmount = async (docAmount, callback) => {
    const from = await module.getAccount();
    const contractAmount = web3.utils.toWei(docAmount, 'ether');
    console.info({ message: `Calling redeem Doc alter, account: ${from}, amount: ${contractAmount}.` });
    return moc.methods
      .alterRedeemRequestAmount(false, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  module.redeemDoc = async (docAmount, callback) => {
    const from = await module.getAccount();
    const contractAmount = web3.utils.toWei(docAmount, 'ether');
    console.info({
      message: `Calling redeem Doc request, account: ${from}, amount: ${contractAmount}.`
    });
    const estimateGas = (await contractFunctions.redeemDoc(contractAmount).estimateGas({ from }) * 2);
    return contractFunctions.redeemDoc(contractAmount).send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  module.redeemFreeDoc = async (docAmount, tolerance, callback) => {
    const from = await module.getAccount();
    const contractAmount = web3.utils.toWei(docAmount, 'ether');
    console.info({ message: `Calling redeem free Doc, account: ${from}, amount: ${contractAmount}.` });
    const estimateGas = (await contractFunctions.redeemFreeDoc(contractAmount, vendor.address).estimateGas({ from })) * 2;
    let params = { from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() };
    console.log('redeemFreeDoc', params, contractAmount, callback);
    return contractFunctions
      .redeemFreeDoc(contractAmount, vendor.address)
      .send(params, callback);
  };

  module.redeemAllDoc = async callback => {
    const from = await module.getAccount();
    console.info({ message: 'Calling redeem all Doc.' });
    const estimateGas = (await contractFunctions.redeemAllDoc().estimateGas({ from }) * 2);
    return contractFunctions.redeemAllDoc().send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  module.toCheckSumAddress = address => helper.toCheckSumAddress(address);

  module.isCheckSumAddress = address => {
    if (address === undefined) return false;

    return helper.isValidAddressChecksum(address);
  };

  const strToBytes32 = bucket => web3.utils.asciiToHex(bucket, 32);

  // Fastbtc Pegout
  window.fastBtcBridge = fastBtcBridge;

  module.fastBtcBridge = async (address, btcAddress, amount) => {

    const weiAmount = toContract(web3.utils.toWei(`${parseFloat(amount)}`, 'ether'));

    const fixEstimatedGas = 2 * (await fastBtcBridge.methods.transferToBtc(btcAddress).estimateGas(
        [btcAddress],
        {
          from: address,
          value: weiAmount
        }
    ));

    return await fastBtcBridge.methods.transferToBtc(btcAddress).send(
        [btcAddress],
        {
          from: address,
          value: weiAmount,
          gasPrice: await gasPrice(),
          gas: fixEstimatedGas,
          gasLimit: fixEstimatedGas
        }
    );

  };

  module.fastBtcBridgeGetFees = () => {
    return new Promise((resolve, reject) => {
      fastBtcBridge.methods.currentFeeStructureIndex()
        .call().then(async feeIndex => {
        const minTransfer = await fastBtcBridge.methods.minTransferSatoshi().call();
        const maxTransfer = await fastBtcBridge.methods.maxTransferSatoshi().call();
        fastBtcBridge.methods.feeStructures(feeIndex)
          .call().then(result => resolve({
          min: minTransfer, max: maxTransfer, baseFee: result.baseFeeSatoshi, dynamicFee: result.dynamicFee
        }))
          .catch(error => {
            console.log(error);
            reject(error);
          });
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  };

  module.calculateCurrentFeeWei = amount => {
    return new Promise((resolve, reject) => {
      window.fastBtcBridge.methods.calculateCurrentFeeWei(web3.utils.toWei(`${parseFloat(amount)}`, 'ether'))
        .call()
        .then(response => resolve(response))
        .catch(error => reject(error))
    });
  };

  module.getTransferByTransferId = transferId => {
    return new Promise((resolve, reject) => {
      window.fastBtcBridge.methods.getTransferByTransferId(transferId)
        .call()
        .then(btcResponse => {
          resolve(btcResponse);
        })
        .catch(error => reject(error))
    });
  };

  return module;
};
