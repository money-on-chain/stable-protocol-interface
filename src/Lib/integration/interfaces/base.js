import coinbase from './abis/coinbase';
import rrc20 from './abis/rrc20';

const baseAbis = (appMode) => {
  switch (appMode.toLowerCase()) {
    case 'coinbase':
    case 'moc':
      return coinbase;
      break;
    case 'rrc20':
      return rrc20;
      break;
    default:
      throw new Error('AppMode not recognized!')
  }

};

export { baseAbis };
