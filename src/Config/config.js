
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
    if (process.env.REACT_APP_API_OPERATIONS) projSettings.api.operations = process.env.REACT_APP_API_OPERATIONS;
    if (process.env.REACT_APP_API_INCENTIVES) projSettings.api.incentives = process.env.REACT_APP_API_INCENTIVES;
    if (process.env.REACT_APP_CHAIN_ID) projSettings.chainId = process.env.REACT_APP_CHAIN_ID;
    if (process.env.REACT_APP_VENDOR_ADDRESS) projSettings.vendor.address = process.env.REACT_APP_VENDOR_ADDRESS;
    if (process.env.REACT_APP_VENDOR_MARKUP) projSettings.vendor.markup = process.env.REACT_APP_VENDOR_MARKUP;
    if (process.env.REACT_APP_EXPLORER_URL) projSettings.explorerUrl = process.env.REACT_APP_EXPLORER_URL;
    if (process.env.REACT_APP_BTC_EXPLORER) projSettings.btcExplorer = process.env.REACT_APP_BTC_EXPLORER;
    if (process.env.REACT_APP_RNS_ADDRESS) projSettings.rns.address = process.env.REACT_APP_RNS_ADDRESS;
    if (process.env.REACT_APP_RNS_URL) projSettings.rns.url = process.env.REACT_APP_RNS_URL;

    return projSettings
}

const config = configFromEnvironment();

export {config};