import React, { useEffect, useState } from 'react';
import {
  Modal,
  Alert,
  Button
} from 'antd';
import './style.scss';

import { initialState, Step, TxId } from '../../../Lib/fastBTC/constants';
import {useTranslation} from "react-i18next";
import QRCode from 'react-qr-code';
import Copy from '../../Page/Copy';
import { BTCButton } from './components/BTCButton';
import FastBtcSocketWrapper from '../../../Lib/FastBtcSocketWrapper';

export default function BtcToRbtcGenerateModal(props) {
  // const [socket, setSocket] = useState(null);
  /* useEffect(() => {
    const socket = new FastBtcSocketWrapper();
    console.log('socket11', socket);
  }, []); */
  const {visible = false, handleClose = () => {}} = props;
  const [t, i18n]= useTranslation(["global",'moc'])
  const [stateFBtc, setStateFBtc] = useState(initialState);
  const [headerIcon, setHeaderIcon] = useState('icon-atention.svg');
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [limits, setLimits] = useState(null);
  const [step, setStep] = useState(null);
  const [txId, setTxId] = useState(null);
  const [depositTx, setDepositTx] = useState(null);
  const [transferTx, setTransferTx] = useState(null);
  
  const cleanupState = () => {
    setStateFBtc(initialState);
  };

  useEffect(() => {
    return cleanupState;
  }, []);

  useEffect(
    () => {
      const socket = new FastBtcSocketWrapper();
      socket.initialize();
      if (socket) {
        //Get tx limits
        socket.emit('txAmount', limits => {
          setLimits(limits);
        });
      }
    },
    [step]
  );

  useEffect(
    () => {
      const socket = new FastBtcSocketWrapper();
      socket.initialize();
      if (socket) {
        const updateStateBTCtx = tx => {
          console.log('-----DETECTED DEPOSIT TX from ModalTopUp ------');
          console.log(tx);
          setStep(Step.TRANSACTION);
          setTxId(TxId.DEPOSIT);
          setDepositTx(tx);
        };
        const updateStateRBTCtx = tx => {
          console.log('-----DETECTED TRANSFER TX from ModalTopUp ------');
          console.log(tx);
          setStep(Step.TRANSACTION);
          setTxId(TxId.TRANSFER);
          setTransferTx(tx);
        };
        socket.on('depositTx', updateStateBTCtx);
        socket.on('transferTx', updateStateRBTCtx);
        console.log('Subscribed to socket from fastBTC modal');
        return function cleanup() {
          console.log('Cleaning up socket subscription from fastBTC modal');
          if (socket === undefined) {
            return;
          }
          socket.off('depositTx', updateStateBTCtx);
          socket.off('transferTx', updateStateRBTCtx);
        };
      }
    },
    []
  );

  const getModalTitle = () => (
    <div className="ModalHeaderTitle">
      <div className="CardLogo">
        <img width="32" src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-sovryn_fastbtc.svg" alt=""/>
        <h1>Sovryn<br/>FastBTC</h1>
      </div>
      <div className="title">
        <h1>BTC to rBTC</h1>
      </div>
    </div>
  );

  const ModalFooter = () => {
    return (
      <div className="AlertWarning" type="warning" icon="" >
        <img src={`${window.location.origin+'/icon-atention.svg'}`} alt=""/>
        <div>{t('MoC.fastbtc.topUpWalletModal.footer', {ns: 'moc'})}</div>
      </div>
    )
   };

  const AddressQrCode = (address) => {
    return (
    <div className="AddressQrCode">
      <div className="tw-text-lg tw-ml-8 tw-mb-2.5">
        <b className="AddressTitle">{t('MoC.fastbtc.topUpWalletModal.txactions.sendBTCTitle', {ns: 'moc'})}</b>
        <Copy textToShow='address' textToCopy={address} fastBTC={true}/>
      </div>
      <div>
        <QRCode value={address} size="128" alt="qrCode"  />
      </div>
    </div>
    );
  };
  return (
    <div className="top-up-wallet-modal-container">
      <Modal
        visible={visible}
        onCancel={handleClose}
        width={550}
        footer={
          (step === Step.MAIN) && (
            <ModalFooter />
          )
        }
        title={getModalTitle()}
        wrapClassName="ModalTopUpContainer"
      >
        <div className="ModalTopUpBody">
          {step === Step.MAIN || step === Step.WALLET ? (
            <div className="">
              <div className="ModalTopUpTitle">
                <p className="subtitle">{t('MoC.fastbtc.topUpWalletModal.subtitle', {ns: 'moc'})}</p>
              </div>
              <div className="ModalTopUpContent">
                <div className="TxLimits">
                  <div className="BlueSection">
                    <b>{t('MoC.fastbtc.topUpWalletModal.limits.header', { ns: 'moc' })}</b>
                    <ul>
                      <li>
                        Min: {parseFloat(limits?.min.toFixed(4))} BTC
                      </li>
                      <li>
                        Max: {parseFloat(limits?.max.toFixed(4))} BTC
                      </li>
                    </ul>
                  </div>
                  <b className="section-title">{t('MoC.fastbtc.topUpWalletModal.instructions.header', {ns: 'moc'})}</b>
                  <div className="TopUpInstructions">
                    <ul>
                      <li>Do not deposit anything other than BTC.</li>
                      <li>Do not send more BTC than the MAX limit</li>
                      <li>Allow up to 90 mins for the transaction to precess.</li>
                      <li>If rBTC is not visible in your destination wallet after 60 mins, open a<a href='https://sovryn.freshdesk.com/support/tickets/new'><strong> support ticket</strong></a> at Sovryn.</li>
                    </ul>
                  </div>
                </div>
                {underMaintenance ? (
                  <Alert
                    description={t('fastbtc.topUpWalletModal.underMaintenance.alertDescription')}
                    type="info"
                    className="under-maintenance-alert"
                  />
                ) : (
                  <div className="TxActions">
                    {step === Step.WALLET && stateFBtc.deposit.address !== '' ? (
                      AddressQrCode(stateFBtc.deposit.address)
                    ) : (
                      ''
                    )}

                    <div className="MainActions">
                      {step === Step.MAIN && (
                        <BTCButton
                          underMaintenance={underMaintenance}
                          onClick={() => {
                            setStep(Step.WALLET);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </Modal>
    </div>
  )
}