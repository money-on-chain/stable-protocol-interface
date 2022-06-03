import React, { useContext} from 'react';
import { Button } from 'antd';
import {useTranslation} from "react-i18next";

import { AuthenticateContext } from '../../../../Context/Auth';

export function BTCButton({ onClick, underMaintenance }) {
  const [t, i18n]= useTranslation(["global",'moc'])
  const auth = useContext(AuthenticateContext);
  const {web3} = auth
  const socketConnected = true; // auth === true;
  const disabled = socketConnected === false || underMaintenance === true;
  return (
    <div>
      <Button
        type="primary"
        disabled={disabled}
        text={getButtonText()}
        onClick={onClick}
        style={{ fontWeight: 'bold' }}
      >{getButtonText()}</Button>
    </div>
  );

  function getButtonText() {
    if (underMaintenance) {
      return t('MoC.fastbtc.topUpWalletModal.getBTCAddressButtonUnderMaintenance', {ns: 'moc'});
    }
    return socketConnected === false
      ? t('MoC.fastbtc.topUpWalletModal.getBTCAddressButtonConnecting', {ns: 'moc'})
      : t('MoC.fastbtc.topUpWalletModal.getBTCAddressButton', {ns: 'moc'});
  }
}