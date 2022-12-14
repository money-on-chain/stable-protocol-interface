
const configFromEnvironment = () => {

    const appProject = process.env.REACT_APP_ENVIRONMENT_APP_PROJECT;
    const projSettings = require('../projects/' + appProject.toLowerCase() + '/settings.json');

    if (process.env.REACT_APP_PUBLIC_URL) projSettings.environment.PublicUrl = process.env.REACT_APP_PUBLIC_URL;
    if (process.env.REACT_APP_ENVIRONMENT_APP_MODE) projSettings.environment.AppMode = process.env.REACT_APP_ENVIRONMENT_APP_MODE;
    if (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT) projSettings.environment.AppProject = process.env.REACT_APP_ENVIRONMENT_APP_PROJECT;
    if (process.env.REACT_APP_ENVIRONMENT_MOC) projSettings.environment.MoC = process.env.REACT_APP_ENVIRONMENT_MOC;
    if (process.env.REACT_APP_ENVIRONMENT_MULTICALL2) projSettings.environment.Multicall2 = process.env.REACT_APP_ENVIRONMENT_MULTICALL2;
    if (process.env.REACT_APP_ENVIRONMENT_IREGISTRY) projSettings.environment.IRegistry = process.env.REACT_APP_ENVIRONMENT_IREGISTRY;
    if (process.env.REACT_APP_ENVIRONMENT_FASTBTC_BRIDGE_ADDRESS) projSettings.environment.fastBtcBridgeAddress = process.env.REACT_APP_ENVIRONMENT_FASTBTC_BRIDGE_ADDRESS;
    if (process.env.REACT_APP_ENVIRONMENT_API_OPERATIONS) projSettings.environment.api.operations = process.env.REACT_APP_ENVIRONMENT_API_OPERATIONS;
    if (process.env.REACT_APP_ENVIRONMENT_API_INCENTIVES) projSettings.environment.api.incentives = process.env.REACT_APP_ENVIRONMENT_API_INCENTIVES;
    if (process.env.REACT_APP_ENVIRONMENT_CHAIN_ID) projSettings.environment.chainId = process.env.REACT_APP_ENVIRONMENT_CHAIN_ID;
    if (process.env.REACT_APP_ENVIRONMENT_VENDOR_ADDRESS) projSettings.environment.vendor.address = process.env.REACT_APP_ENVIRONMENT_VENDOR_ADDRESS;
    if (process.env.REACT_APP_ENVIRONMENT_VENDOR_MARKUP) projSettings.environment.vendor.markup = process.env.REACT_APP_ENVIRONMENT_VENDOR_MARKUP;
    if (process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL) projSettings.environment.explorerUrl = process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL;
    if (process.env.REACT_APP_ENVIRONMENT_BTC_EXPLORER) projSettings.environment.btcExplorer = process.env.REACT_APP_ENVIRONMENT_BTC_EXPLORER;
    if (process.env.REACT_APP_ENVIRONMENT_RNS_ADDRESS) projSettings.environment.rns.address = process.env.REACT_APP_ENVIRONMENT_RNS_ADDRESS;
    if (process.env.REACT_APP_ENVIRONMENT_RNS_URL) projSettings.environment.rns.url = process.env.REACT_APP_ENVIRONMENT_RNS_URL;
    if (process.env.REACT_APP_ENVIRONMENT_LIQUIDITY_COLLATERAL_TOKEN) projSettings.environment.LiquidityCollateralToken = process.env.REACT_APP_ENVIRONMENT_LIQUIDITY_COLLATERAL_TOKEN;

    return projSettings
}

const config = configFromEnvironment();

export {config};