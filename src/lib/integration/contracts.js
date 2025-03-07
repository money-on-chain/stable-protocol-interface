import {
    Multicall2,
    MoCConnector,
    MoC,
    MoCState,
    MoCExchange,
    MoCInrate,
    MoCSettlement,
    TC,
    TP,
    TG,
    ReserveToken,
    MoCVendors,
    TokenMigrator } from './abis/moc-base';
import { omocAbis } from './abis/omoc';

import { addABI } from './transaction';
import { connectorAddresses, registryAddresses } from './multicall';

const readContracts = async (web3, environment) => {
    const appMode = environment.AppMode;

    const dContracts = {};
    dContracts.json = {};
    dContracts.contracts = {};
    dContracts.contractsAddresses = {};

    /*
  const {
    Multicall2,
    MoCConnector,
    MoC,
    MoCState,
    MoCExchange,
    MoCInrate,
    MoCSettlement,
    TC,
    TP,
    TG,
    ReserveToken,
    MoCVendors
  } = baseAbis(appMode);*/

    const abiContracts = {};

    abiContracts.Multicall2 = Multicall2;
    abiContracts.MoCConnector = MoCConnector;
    abiContracts.MoC = MoC;
    abiContracts.MoCState = MoCState;
    abiContracts.MoCExchange = MoCExchange;
    abiContracts.MoCInrate = MoCInrate;
    abiContracts.MoCSettlement = MoCSettlement;
    abiContracts.TP = TP;
    abiContracts.TC = TC;
    abiContracts.TG = TG;
    abiContracts.ReserveToken = ReserveToken;
    abiContracts.MoCVendors = MoCVendors;
    abiContracts.TokenMigrator = TokenMigrator;

    console.log(
        'Reading Multicall2 Contract... address: ',
        environment.Multicall2
    );
    const multicall = new web3.eth.Contract(
        Multicall2.abi,
        environment.Multicall2
    );
    dContracts.contracts.multicall = multicall;

    console.log('Reading MoC Contract... address: ', environment.MoC);
    const moc = new web3.eth.Contract(MoC.abi, environment.MoC);
    dContracts.contracts.moc = moc;

    const connectorAddress = await moc.methods.connector().call();

    console.log('Reading MoCConnector... address: ', connectorAddress);
    const mocconnector = new web3.eth.Contract(
        MoCConnector.abi,
        connectorAddress
    );
    dContracts.contracts.mocconnector = mocconnector;

    // Read contracts addresses from connector
    const [
        mocStateAddress,
        mocInrateAddress,
        mocExchangeAddress,
        mocSettlementAddress,
        tpTokenAddress,
        tcTokenAddress,
        reserveTokenAddress
    ] = await connectorAddresses(web3, dContracts, appMode);

    console.log('Reading MoC State Contract... address: ', mocStateAddress);
    const mocstate = new web3.eth.Contract(MoCState.abi, mocStateAddress);
    dContracts.contracts.mocstate = mocstate;

    console.log('Reading MoC Inrate Contract... address: ', mocInrateAddress);
    const mocinrate = new web3.eth.Contract(MoCInrate.abi, mocInrateAddress);
    dContracts.contracts.mocinrate = mocinrate;

    console.log(
        'Reading MoC Exchange Contract... address: ',
        mocExchangeAddress
    );
    const mocexchange = new web3.eth.Contract(
        MoCExchange.abi,
        mocExchangeAddress
    );
    dContracts.contracts.mocexchange = mocexchange;

    console.log(
        'Reading MoC Settlement  Contract... address: ',
        mocSettlementAddress
    );
    const mocsettlement = new web3.eth.Contract(
        MoCSettlement.abi,
        mocSettlementAddress
    );
    dContracts.contracts.mocsettlement = mocsettlement;

    console.log('Reading TP Contract... address: ', tpTokenAddress);
    const tp = new web3.eth.Contract(TP.abi, tpTokenAddress);
    dContracts.contracts.tp = tp;

    console.log('Reading TC Token Contract... address: ', tcTokenAddress);
    const tc = new web3.eth.Contract(TC.abi, tcTokenAddress);
    dContracts.contracts.tc = tc;

    if (environment.LiquidityCollateralToken) {
        console.log(
            'Reading Liquidity Collateral Token Contract... address: ',
            environment.LiquidityCollateralToken
        );
        const liquiditycollateraltoken = new web3.eth.Contract(
            TC.abi,
            environment.LiquidityCollateralToken
        );
        dContracts.contracts.liquiditycollateraltoken =
            liquiditycollateraltoken;
    } else {
        console.log(
            'Using Collateral token as Liquidity Collateral Token Contract... address: ',
            tcTokenAddress
        );
        dContracts.contracts.liquiditycollateraltoken = tc;
    }

    if (appMode === 'RRC20') {
        console.log(
            'Reading RESERVE Token Contract... address: ',
            reserveTokenAddress
        );
        const reservetoken = new web3.eth.Contract(
            ReserveToken.abi,
            reserveTokenAddress
        );
        dContracts.contracts.reservetoken = reservetoken;
    }

    const tgTokenAddress = await mocstate.methods.getMoCToken().call();
    const mocVendorsAddress = await mocstate.methods.getMoCVendors().call();

    console.log('Reading TG Token Contract... address: ', tgTokenAddress);
    const tg = new web3.eth.Contract(TG.abi, tgTokenAddress);
    dContracts.contracts.tg = tg;

    console.log('Reading MoC Vendors Contract... address: ', mocVendorsAddress);
    const mocvendors = new web3.eth.Contract(MoCVendors.abi, mocVendorsAddress);
    dContracts.contracts.mocvendors = mocvendors;

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
    abiContracts.IRegistry = IRegistry;
    abiContracts.IStakingMachine = IStakingMachine;
    abiContracts.IDelayMachine = IDelayMachine;
    abiContracts.ISupporters = ISupporters;
    abiContracts.IVestingMachine = IVestingMachine;
    abiContracts.IVotingMachine = IVotingMachine;
    abiContracts.IVestingFactory = IVestingFactory;

    const iregistry = new web3.eth.Contract(
        IRegistry.abi,
        environment.IRegistry
    );
    dContracts.contracts.iregistry = iregistry;

    // Read contracts addresses from registry
    const [
        mocStakingMachineAddress,
        supportersAddress,
        delayMachineAddress,
        vestingMachineAddress,
        votingMachineAddress,
        priceProviderRegistryAddress,
        oracleManagerAddress
    ] = await registryAddresses(web3, dContracts);

    console.log(
        'Reading OMOC: IStakingMachine Contract... address: ',
        mocStakingMachineAddress
    );
    const istakingmachine = new web3.eth.Contract(
        IStakingMachine.abi,
        mocStakingMachineAddress
    );
    dContracts.contracts.istakingmachine = istakingmachine;

    console.log(
        'Reading OMOC: IDelayMachine Contract... address: ',
        delayMachineAddress
    );
    const idelaymachine = new web3.eth.Contract(
        IDelayMachine.abi,
        delayMachineAddress
    );
    dContracts.contracts.idelaymachine = idelaymachine;

    console.log(
        'Reading OMOC: ISupporters Contract... address: ',
        supportersAddress
    );
    const isupporters = new web3.eth.Contract(
        ISupporters.abi,
        supportersAddress
    );
    dContracts.contracts.isupporters = isupporters;

    console.log(
        'Reading OMOC: IVestingFactory Contract... address: ',
        vestingMachineAddress
    );
    const ivestingfactory = new web3.eth.Contract(
        IVestingFactory.abi,
        vestingMachineAddress
    );
    dContracts.contracts.ivestingfactory = ivestingfactory;

    // reading vesting machine from enviroment address
    /*
  const vestingAddress = `${process.env.OMOC_VESTING_ADDRESS}`.toLowerCase()
  if (vestingAddress) {
    console.log('Reading OMOC: IVestingMachine Contract... address: ', vestingAddress)
    const ivestingmachine = new web3.eth.Contract(IVestingMachine.abi, vestingAddress)
    dContracts.contracts.ivestingmachine = ivestingmachine
  }*/

    console.log(
        'Reading OMOC: IVotingMachine Contract... address: ',
        votingMachineAddress
    );
    const ivotingmachine = new web3.eth.Contract(
        IVotingMachine.abi,
        votingMachineAddress
    );
    dContracts.contracts.ivotingmachine = ivotingmachine;

    // Add to abi decoder
    addABI(abiContracts, appMode);

    return dContracts;
};

export { readContracts };
