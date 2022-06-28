import Environments from './environments.json';
import DefaultConfig from './config.default.json';

const Environment = () => {
    const environment = Environments[DefaultConfig.environment]
    return environment
}

const environment = Environment();
const config = DefaultConfig;

export {config, environment};