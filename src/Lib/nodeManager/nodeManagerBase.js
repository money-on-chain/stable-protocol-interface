import addressHelper from '../addressHelper';
import { ContractFunctions } from './contractFunctions';


export default function nodeManagerBase ({ web3, contracts, partialExecutionSteps, gasPrice, appMode }) {
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
    mocToken
  } = contracts;

  const contractFunctions = ContractFunctions(appMode, { moc, mocState, mocInrate });
  const { vendor } = {
    address: "0xf69287F5Ca3cC3C6d3981f2412109110cB8af076",
    markup: "500000000000000"
  };


  // Address
  const getBproAddress = () => Promise.resolve(bproToken.address);
  const getDocAddress = () => Promise.resolve(docToken.address);

  // Contracts
  const getMoc = () => moc;
  const getDocToken = () => docToken;
  const getBproToken = () => bproToken;
  const getMocState = () => mocState;
  const getMocInrate = () => mocInrate;
  const getAllContracts = () =>
    Promise.resolve([moc, docToken, bproToken, mocState, mocInrate, mocSettlement, mocExchange]);

  // MoC Token
  const getMoCAllowance = async () => {
    const spender = getAccount();
    return mocToken.methods.allowance(spender, moc._address).call();
  };
  const approveMoCToken = async (enabled, callback = () => { }) => {
    const spender = getAccount();
    const newAllowance = enabled ? web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString()) : 0;
    return mocToken.methods.approve(moc._address, newAllowance).send({ from: spender }, callback);
  };
  const getMoCBalance = async address => {
    const spender = address || (await getAccount());
    return mocToken.methods.balanceOf(spender).call();
  };

  const getAccount = async () => {
    const [owner] = await web3.eth.getAccounts();
    return owner;
  };
  const sign = (stringToSign, address) => web3.eth.personal.sign(stringToSign, address, '');

  const transferDocTo = async (to, amount, callback) => {
    const toWithChecksum = helper.toWeb3CheckSumAddress(to);
    const from = getAccount();
    const contractAmount = web3.utils.toWei(amount, 'ether');
    return docToken.methods
      .transfer(toWithChecksum, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  const transferBproTo = async (to, amount, callback) => {
    const toWithChecksum = helper.toWeb3CheckSumAddress(to);
    const from = getAccount();
    const contractAmount = web3.utils.toWei(amount, 'ether');
    return bproToken.methods
      .transfer(toWithChecksum, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  const transferMocTo = async (to, amount, callback) => {
    const toWithChecksum = helper.toWeb3CheckSumAddress(to);
    const from = getAccount();
    const contractAmount = web3.utils.toWei(amount, 'ether');
    return mocToken.methods
      .transfer(toWithChecksum, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  // MoC transactions
  const runSettlement = async () => {
    const steps = partialExecutionSteps.settlement;
    const from = getAccount();
    const estimateGas = (await moc.methods.runSettlement(steps).estimateGas({ from }) * 2);
    // TODO: Fix estimation
    return moc.methods.runSettlement(steps).send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() });
  };

  const dailyInratePayment = async () => {
    const from = getAccount();
    const estimateGas = (await moc.methods.dailyInratePayment().estimateGas({ from }) * 2);
    return moc.methods.dailyInratePayment().send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() });
  };

  const payBitProHoldersInterestPayment = async () => {
    const from = getAccount();
    const estimateGas = (await contractFunctions.payBitProHoldersInterestPayment().estimateGas({ from }) * 2);
    return contractFunctions
      .payBitProHoldersInterestPayment()
      .send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() });
  };

  const calcCommissionValue = (amount, transactionType) =>
    mocInrate.methods.calcCommissionValue(amount, transactionType).call();
    const calculateVendorMarkup = (vendorAccount, amount) =>
    mocInrate.methods.calculateVendorMarkup(vendorAccount, amount).call();

    const calcMintInterestValues = amount =>
    mocInrate.methods.calcMintInterestValues(strToBytes32(bucketX2), amount).call();

    const redeemBpro = async (bproAmount, callback) => {
    const from = getAccount();
    const weiAmount = web3.utils.toWei(bproAmount, 'ether');
    const estimateGas = (await contractFunctions.redeemBpro(weiAmount, vendor.address).estimateGas({ from }) * 2);
    return contractFunctions
      .redeemBpro(weiAmount, vendor.address)
      .send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  const redeemBprox2 = async (bprox2Amount, callback) => {
    const from = getAccount();
    const weiAmount = web3.utils.toWei(bprox2Amount, 'ether');
    const estimateGas = (await contractFunctions.redeemBprox2(strToBytes32(bucketX2), weiAmount, vendor.address).estimateGas({ from }) * 2);
    return contractFunctions
      .redeemBprox2(strToBytes32(bucketX2), weiAmount, vendor.address)
      .send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  const alterRedeemRequestAmount = async (docAmount, callback) => {
    const from = getAccount();
    const contractAmount = web3.utils.toWei(docAmount, 'ether');
    return moc.methods
      .alterRedeemRequestAmount(false, contractAmount)
      .send({ from, gasPrice: await gasPrice() }, callback);
  };

  const redeemDoc = async (docAmount, callback) => {
    const from = getAccount();
    const contractAmount = web3.utils.toWei(docAmount, 'ether');
    const estimateGas = (await contractFunctions.redeemDoc(contractAmount).estimateGas({ from }) * 2);
    return contractFunctions.redeemDoc(contractAmount).send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  const redeemFreeDoc = async (docAmount, callback) => {
    const from = getAccount();
    const contractAmount = web3.utils.toWei(docAmount, 'ether');
    const estimateGas = (await contractFunctions.redeemFreeDoc(contractAmount, vendor.address).estimateGas({ from })) * 2;
    return contractFunctions
      .redeemFreeDoc(contractAmount, vendor.address)
      .send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  const redeemAllDoc = async callback => {
    const from = getAccount();
    const estimateGas = (await contractFunctions.redeemAllDoc().estimateGas({ from }) * 2);
    return contractFunctions.redeemAllDoc().send({ from, gas: estimateGas, gasLimit: estimateGas, gasPrice: await gasPrice() }, callback);
  };

  const toCheckSumAddress = address => helper.toCheckSumAddress(address);

  const isCheckSumAddress = address => {
    if (address === undefined) return false;

    return helper.isValidAddressChecksum(address);
  };

  const strToBytes32 = bucket => web3.utils.asciiToHex(bucket, 32);
};
