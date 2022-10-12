import { baseAbis } from './abis/moc-base';
import { omocAbis } from './abis/omoc';

import { addABI } from './transaction';
import { connectorAddresses, registryAddresses } from './multicall';


const readContracts = async (web3, environment) => {

  const appMode = environment.AppMode;

  const dContracts = {}
  dContracts.json = {}
  dContracts.contracts = {}
  dContracts.contractsAddresses = {}

  const {
    Multicall2,
    MoCConnector,
    MoC,
    MoCState,
    MoCExchange,
    MoCInrate,
    MoCSettlement,
    RiskProToken,
    StableToken,
    MoCToken,
    ReserveToken,
    MoCVendors
  } = baseAbis(appMode);

  const abiContracts = {}

  abiContracts.Multicall2 = Multicall2
  abiContracts.MoCConnector = MoCConnector
  abiContracts.MoC = MoC
  abiContracts.MoCState = MoCState
  abiContracts.MoCExchange = MoCExchange
  abiContracts.MoCInrate = MoCInrate
  abiContracts.MoCSettlement = MoCSettlement
  abiContracts.StableToken = StableToken
  abiContracts.RiskProToken = RiskProToken
  abiContracts.MoCToken = MoCToken
  abiContracts.ReserveToken = ReserveToken
  abiContracts.MoCVendors = MoCVendors

  console.log('Reading Multicall2 Contract... address: ', environment.Multicall2)
  const multicall = new web3.eth.Contract(Multicall2.abi, environment.Multicall2)
  dContracts.contracts.multicall = multicall

  console.log('Reading MoC Contract... address: ', environment.MoC)
  const moc = new web3.eth.Contract(MoC.abi, environment.MoC)
  dContracts.contracts.moc = moc

  const connectorAddress = await moc.methods.connector().call()

  console.log('Reading MoCConnector... address: ', connectorAddress)
  const mocconnector = new web3.eth.Contract(MoCConnector.abi, connectorAddress)
  dContracts.contracts.mocconnector = mocconnector

  // Read contracts addresses from connector
  const [
    mocStateAddress,
    mocInrateAddress,
    mocExchangeAddress,
    mocSettlementAddress,
    stableTokenAddress,
    riskproTokenAddress,
    reserveTokenAddress
  ] = await connectorAddresses(web3, dContracts, appMode)

  console.log('Reading MoC State Contract... address: ', mocStateAddress)
  const mocstate = new web3.eth.Contract(MoCState.abi, mocStateAddress)
  dContracts.contracts.mocstate = mocstate

  console.log('Reading MoC Inrate Contract... address: ', mocInrateAddress)
  const mocinrate = new web3.eth.Contract(MoCInrate.abi, mocInrateAddress)
  dContracts.contracts.mocinrate = mocinrate

  console.log('Reading MoC Exchange Contract... address: ', mocExchangeAddress)
  const mocexchange = new web3.eth.Contract(MoCExchange.abi, mocExchangeAddress)
  dContracts.contracts.mocexchange = mocexchange

  console.log('Reading MoC Settlement  Contract... address: ', mocSettlementAddress)
  const mocsettlement = new web3.eth.Contract(MoCSettlement.abi, mocSettlementAddress)
  dContracts.contracts.mocsettlement = mocsettlement

  console.log('Reading STABLE Token Contract... address: ', stableTokenAddress)
  const stabletoken = new web3.eth.Contract(StableToken.abi, stableTokenAddress)
  dContracts.contracts.stabletoken = stabletoken

  console.log('Reading RISKPRO Token Contract... address: ', riskproTokenAddress)
  const riskprotoken = new web3.eth.Contract(RiskProToken.abi, riskproTokenAddress)
  dContracts.contracts.riskprotoken = riskprotoken

  console.log("DEBUG");
  console.log(environment.LiquidityCollateralToken)
  if (environment.LiquidityCollateralToken) {
    console.log('Reading Liquidity Collateral Token Contract... address: ', riskproTokenAddress)
    const liquiditycollateraltoken = new web3.eth.Contract(RiskProToken.abi, environment.LiquidityCollateralToken)
    dContracts.contracts.liquiditycollateraltoken = liquiditycollateraltoken
  } else {
    console.log('Using Collateral token as Liquidity Collateral Token Contract... address: ', riskproTokenAddress)
    dContracts.contracts.liquiditycollateraltoken = riskprotoken
  }

  if (appMode === 'RRC20') {
    console.log('Reading RESERVE Token Contract... address: ', reserveTokenAddress)
    const reservetoken = new web3.eth.Contract(ReserveToken.abi, reserveTokenAddress)
    dContracts.contracts.reservetoken = reservetoken
  }

  const mocTokenAddress = await mocstate.methods.getMoCToken().call()
  const mocVendorsAddress = await mocstate.methods.getMoCVendors().call()

  console.log('Reading MoC Token Contract... address: ', mocTokenAddress)
  const moctoken = new web3.eth.Contract(MoCToken.abi, mocTokenAddress)
  dContracts.contracts.moctoken = moctoken

  console.log('Reading MoC Vendors Contract... address: ', mocVendorsAddress)
  const mocvendors = new web3.eth.Contract(MoCVendors.abi, mocVendorsAddress)
  dContracts.contracts.mocvendors = mocvendors

  const {
    IRegistry,
    IStakingMachine,
    IDelayMachine,
    ISupporters,
    IVestingMachine,
    IVotingMachine,
    IVestingFactory
  } = omocAbis();


  // Omoc Contracts
  abiContracts.IRegistry = IRegistry
  abiContracts.IStakingMachine = IStakingMachine
  abiContracts.IDelayMachine = IDelayMachine
  abiContracts.ISupporters = ISupporters
  abiContracts.IVestingMachine = IVestingMachine
  abiContracts.IVotingMachine = IVotingMachine
  abiContracts.IVestingFactory = IVestingFactory

  const iregistry = new web3.eth.Contract(IRegistry.abi, environment.IRegistry)
  dContracts.contracts.iregistry = iregistry

  // Read contracts addresses from registry
  const [
    mocStakingMachineAddress,
    supportersAddress,
    delayMachineAddress,
    vestingMachineAddress,
    votingMachineAddress,
    priceProviderRegistryAddress,
    oracleManagerAddress
  ] = await registryAddresses(web3, dContracts)

  console.log('Reading OMOC: IStakingMachine Contract... address: ', mocStakingMachineAddress)
  const istakingmachine = new web3.eth.Contract(IStakingMachine.abi, mocStakingMachineAddress)
  dContracts.contracts.istakingmachine = istakingmachine

  console.log('Reading OMOC: IDelayMachine Contract... address: ', delayMachineAddress)
  const idelaymachine = new web3.eth.Contract(IDelayMachine.abi, delayMachineAddress)
  dContracts.contracts.idelaymachine = idelaymachine

  console.log('Reading OMOC: ISupporters Contract... address: ', supportersAddress)
  const isupporters = new web3.eth.Contract(ISupporters.abi, supportersAddress)
  dContracts.contracts.isupporters = isupporters

  console.log('Reading OMOC: IVestingFactory Contract... address: ', vestingMachineAddress)
  const ivestingfactory = new web3.eth.Contract(IVestingFactory.abi, vestingMachineAddress)
  dContracts.contracts.ivestingfactory = ivestingfactory

  // reading vesting machine from enviroment address
  /*
  const vestingAddress = `${process.env.OMOC_VESTING_ADDRESS}`.toLowerCase()
  if (vestingAddress) {
    console.log('Reading OMOC: IVestingMachine Contract... address: ', vestingAddress)
    const ivestingmachine = new web3.eth.Contract(IVestingMachine.abi, vestingAddress)
    dContracts.contracts.ivestingmachine = ivestingmachine
  }*/

  console.log('Reading OMOC: IVotingMachine Contract... address: ', votingMachineAddress)
  const ivotingmachine = new web3.eth.Contract(IVotingMachine.abi, votingMachineAddress)
  dContracts.contracts.ivotingmachine = ivotingmachine

  // Add to abi decoder
  addABI(abiContracts, appMode)

  return dContracts
}


export { readContracts };