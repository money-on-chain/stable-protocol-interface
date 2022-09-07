import React, { useContext} from 'react';
import { Button } from 'antd';
import {useTranslation} from "react-i18next";
import {config} from '../../../../Config/config';
import { AuthenticateContext } from '../../../../Context/Auth';

export function BTCButton({ onClick, underMaintenance }) {
  const [t, i18n]= useTranslation(["global",'moc']);
  const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
  const appMode = config.environment.AppMode;
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
      return t(`${appMode}.fastbtc.topUpWalletModal.getBTCAddressButtonUnderMaintenance`, {ns: ns});
    }
    return socketConnected === false
      ? t(`${appMode}.fastbtc.topUpWalletModal.getBTCAddressButtonConnecting`, {ns: ns})
      : t(`${appMode}.fastbtc.topUpWalletModal.getBTCAddressButton`, {ns: ns});
  }
}