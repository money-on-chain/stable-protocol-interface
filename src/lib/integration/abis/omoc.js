import IRegistry from '../../../contracts/omoc/IRegistry.json';
import IStakingMachine from '../../../contracts/omoc/IStakingMachine.json';
import IDelayMachine from '../../../contracts/omoc/IDelayMachine.json';
import ISupporters from '../../../contracts/omoc/ISupporters.json';
import IVestingMachine from '../../../contracts/omoc/IVestingMachine.json';
import IVotingMachine from '../../../contracts/omoc/IVotingMachine.json';
import IVestingFactory from '../../../contracts/omoc/IVestingFactory.json';

const omocAbis = () => {
    return {
        IRegistry,
        IStakingMachine,
        IDelayMachine,
        ISupporters,
        IVestingMachine,
        IVotingMachine,
        IVestingFactory
    };
};

export { omocAbis };
