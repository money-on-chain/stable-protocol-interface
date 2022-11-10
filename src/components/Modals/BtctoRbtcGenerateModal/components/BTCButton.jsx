import React, { useContext} from 'react';
import { Button } from 'antd';
import {useTranslation} from "react-i18next";
import {config} from '../../../../projects/config';

export function BTCButton({ onClick, underMaintenance }) {
  const [t, i18n]= useTranslation(["global",'moc']);
  const ns = config.environment.AppProject.toLowerCase();
  const AppProject = config.environment.AppProject;
    
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
      return t(`${AppProject}.fastbtc.topUpWalletModal.getBTCAddressButtonUnderMaintenance`, {ns: ns});
    }
    return socketConnected === false
      ? t(`${AppProject}.fastbtc.topUpWalletModal.getBTCAddressButtonConnecting`, {ns: ns})
      : t(`${AppProject}.fastbtc.topUpWalletModal.getBTCAddressButton`, {ns: ns});
  }
}