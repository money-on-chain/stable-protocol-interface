import { sendNotification, notificationTypes, sendNotificationTx, sendNotificationError } from './notificationsHelper';
import { contractMethodMap } from '../../api/helpers/contractHelper';


/** This module decorates the node manager for the frontend,
 sends notifications and pushes pending Txs to the server */

const sendSuccessNotification = it => {
  sendNotificationTx(it);
  return it;
};
const sendErrorNotification = it => {
  sendNotificationError();
  return it;
};

const txProcessedCallback = (onError, onSuccess) => (error, transactionHash) => {
  if (error) {
    onError(error);
    return;
  }

  onSuccess(transactionHash);
};

module.exports = nodeManager => {
  // Copying the object avoids infinite recursion
  const decoratedNodeManager = Object.assign({}, nodeManager);
  Object.keys(contractMethodMap).forEach(contractMethod => {
    decoratedNodeManager[contractMethod] = async (memo, ...args) => {
      const { address } = window;
      let transactionHash = '';
      let hasNotifyError = false;

      const onError = error => {
        sendErrorNotification(error);
        hasNotifyError = true;
      };

      const onSuccess = txHash => {
        transactionHash = txHash;

        sendSuccessNotification(txHash);
      };

      try {
        // Double verification
        const user = Meteor.user();
        if (!user) throw new Meteor.Error('not-logged-in');
        if (!window.address) throw new Meteor.Error('Metamask-is-not-enabled');
        if (window.address !== user.username) throw new Meteor.Error('Metamask-user-doesnt-match');
        await nodeManager[contractMethod](...args, txProcessedCallback(onError, onSuccess));
      } catch (error) {
        if (!hasNotifyError) sendErrorNotification(error);
      }
    };
  });
  return decoratedNodeManager;
};
