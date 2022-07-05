// import { sendNotification, notificationTypes, sendNotificationTx, sendNotificationError } from './notificationsHelper';
// import { contractMethodMap } from '../../api/helpers/contractHelper';

const contractMethodMap = {
  mintDoc: { event: 'StableTokenMint' },
  redeemDoc: { event: 'RedeemRequestAlter' },
  redeemFreeDoc: { event: 'FreeStableTokenRedeem' },
  redeemAllDoc: { event: 'StableTokenRedeem' },
  mintBpro: { event: 'RiskProMint' },
  redeemBpro: { event: 'RiskProRedeem' },
  mintBprox2: { event: 'RiskProxMint' },
  redeemBprox2: { event: 'RiskProxRedeem' },
  transferDocTo: { event: 'Transfer', tokenInvolved: 'STABLE' },
  transferBproTo: { event: 'Transfer', tokenInvolved: 'RISKPRO' },
  transferMocTo: { event: 'Transfer', tokenInvolved: 'MOC' },
  alterRedeemRequestAmount: { event: 'RedeemRequestAlter' }
};

/** This module decorates the node manager for the frontend,
 sends notifications and pushes pending Txs to the server */




const sendSuccessNotification = it => {
  // sendNotificationTx(it);
  return it;
};
const sendErrorNotification = it => {
  // sendNotificationError();
  return it;
};

const txProcessedCallback = (onError, onSuccess) => (error, transactionHash) => {
  if (error) {
    onError(error);
    return;
  }

  onSuccess(transactionHash);
};

export default async function nodeManagerDecorator (nodeManager) {
  // Copying the object avoids infinite recursion
  const decoratedNodeManager = Object.assign({}, nodeManager);
  Object.keys(contractMethodMap).forEach(contractMethod => {
    /*decoratedNodeManager[contractMethod] = async (...args) => {
      // const { address } = window;
      let transactionHash = '';
      let hasNotifyError = false;

      const onError = error => {
        // sendErrorNotification(error);
        // hasNotifyError = true;
      };

      const onSuccess = txHash => {
        // transactionHash = txHash;
        //
        // sendSuccessNotification(txHash);
      };

      // try {
      //   // Double verification
      //   const user = Meteor.user();
      //   if (!user) throw new Meteor.Error('not-logged-in');
      //   if (!window.address) throw new Meteor.Error('Metamask-is-not-enabled');
      //   if (window.address !== user.username) throw new Meteor.Error('Metamask-user-doesnt-match');
        await nodeManager[contractMethod](...args, ()=>{});
      // } catch (error) {
      //   if (!hasNotifyError) sendErrorNotification(error);
      // }
    };*/

    decoratedNodeManager[contractMethod] = async (memo, ...args) => {
      const { address } = window;
      let transactionHash = '';
      let hasNotifyError = false;

      const onError = error => {
        sendErrorNotification(error);
        // Log.error({
        //   method: 'onError',
        //   message: 'Transaction Failed.',
        //   error
        // });
        hasNotifyError = true;
      };

      const onSuccess = txHash => {
        transactionHash = txHash;
        // Log.info({message: "Success!, txHash: " + txHash + " and memo is: " + memo});
        // Meteor.call('transaction.pushTxHash', {
        //   contractMethod,
        //   args,
        //   transactionHash,
        //   address,
        //   memo
        // });

        sendSuccessNotification(txHash);
      };

      try {

        // Double verification
        /*const user = Meteor.user();
        if (!user) throw new Meteor.Error('not-logged-in');
        if (!window.address) throw new Meteor.Error('Metamask-is-not-enabled');
        if (window.address !== user.username) throw new Meteor.Error('Metamask-user-doesnt-match');*/
        await nodeManager[contractMethod](...args, txProcessedCallback(onError, onSuccess));
      } catch (error) {
        if (!hasNotifyError) sendErrorNotification(error);
        // Log.error({ message: `Transaction Failed with message ${error.message}.`, error });
      }
    };
  });
  return decoratedNodeManager;
};


