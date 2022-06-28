import NodeManagerRRC20 from './nodeManager/nodeManagerRRC20';
import NodeManagerMoc from './nodeManager/nodeManagerMoc';

const nodeManagersMap = {
    MoC: NodeManagerMoc,
    RRC20: NodeManagerRRC20
};

export default async function createNodeManager(params) {
    const { appMode } = params;
    return nodeManagersMap[appMode](params);
}
