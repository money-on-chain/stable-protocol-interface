import DefaultConfig from './config.default.json';

const configFromEnvironment = () => {
    if (process.env.REACT_APP_VENDOR) DefaultConfig.environment.vendor = process.env.REACT_APP_VENDOR;
    if (process.env.REACT_APP_ENVIRONMENT_APP_MODE) DefaultConfig.environment.AppMode = process.env.REACT_APP_ENVIRONMENT_APP_MODE;
    if (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT) DefaultConfig.environment.AppProject = process.env.REACT_APP_ENVIRONMENT_APP_PROJECT;
    if (process.env.REACT_APP_ENVIRONMENT_MOC) DefaultConfig.environment.MoC = process.env.REACT_APP_ENVIRONMENT_MOC;
    if (process.env.REACT_APP_ENVIRONMENT_MULTICALL2) DefaultConfig.environment.Multicall2 = process.env.REACT_APP_ENVIRONMENT_MULTICALL2;
    if (process.env.REACT_APP_ENVIRONMENT_IREGISTRY) DefaultConfig.environment.IRegistry = process.env.REACT_APP_ENVIRONMENT_IREGISTRY;
    if (process.env.REACT_APP_ENVIRONMENT_FASTBTC_BRIDGE_ADDRESS) DefaultConfig.environment.fastBtcBridgeAddress = process.env.REACT_APP_ENVIRONMENT_FASTBTC_BRIDGE_ADDRESS;
    if (process.env.REACT_APP_API_OPERATIONS) DefaultConfig.api.operations = process.env.REACT_APP_API_OPERATIONS;
    if (process.env.REACT_APP_API_INCENTIVES) DefaultConfig.api.incentives = process.env.REACT_APP_API_INCENTIVES;
    if (process.env.REACT_APP_CHAIN_ID) DefaultConfig.chainId = process.env.REACT_APP_CHAIN_ID;
    if (process.env.REACT_APP_VENDOR_ADDRESS) DefaultConfig.vendor.address = process.env.REACT_APP_VENDOR_ADDRESS;
    if (process.env.REACT_APP_VENDOR_MARKUP) DefaultConfig.vendor.markup = process.env.REACT_APP_VENDOR_MARKUP;
    if (process.env.REACT_APP_MINIMUM_BALANCE_TO_OPERATE) DefaultConfig.minimumUserBalanceToOperate = process.env.REACT_APP_MINIMUM_BALANCE_TO_OPERATE;
    if (process.env.REACT_APP_EXPLORER_URL) DefaultConfig.explorerUrl = process.env.REACT_APP_EXPLORER_URL;
    if (process.env.REACT_APP_BTC_EXPLORER) DefaultConfig.btcExplorer = process.env.REACT_APP_BTC_EXPLORER;

    return DefaultConfig
}

const config = configFromEnvironment();

export {config};