import DefaultConfig from './config.default.json';

const configFromEnvironment = () => {
    if (process.env.REACT_APP_VENDOR) DefaultConfig.environment.vendor = process.env.REACT_APP_VENDOR;
    if (process.env.REACT_APP_ENVIRONMENT_APP_MODE) DefaultConfig.environment.AppMode = process.env.REACT_APP_ENVIRONMENT_APP_MODE;
    if (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT) DefaultConfig.environment.AppProject = process.env.REACT_APP_ENVIRONMENT_APP_PROJECT;
    if (process.env.REACT_APP_ENVIRONMENT_MOC) DefaultConfig.environment.MoC = process.env.REACT_APP_ENVIRONMENT_MOC;
    if (process.env.REACT_APP_ENVIRONMENT_MULTICALL2) DefaultConfig.environment.Multicall2 = process.env.REACT_APP_ENVIRONMENT_MULTICALL2;
    if (process.env.REACT_APP_ENVIRONMENT_IREGISTRY) DefaultConfig.environment.IRegistry = process.env.REACT_APP_ENVIRONMENT_IREGISTRY;
    return DefaultConfig
}

const config = configFromEnvironment();

export {config};