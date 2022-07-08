import coinbase from './moc-coinbase';
import rrc20 from './moc-rrc20';

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
