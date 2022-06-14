import React, { useEffect, useState, useContext } from 'react';
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
import { getBtcAddress } from '../../../Lib/fastBTC/fastBTCMethods';
import { AuthenticateContext } from '../../../Context/Auth';
import TransactionScreen from './TransactionScreen';

export default function BtcToRbtcGenerateModal(props) {
  const auth = useContext(AuthenticateContext);
  useEffect(() => {
    auth.socket.initialize();
  }, []);
  const {visible = false, handleClose = () => {}, accountData} = props;
  const [t, i18n]= useTranslation(["global",'moc'])
  const [stateFBtc, setStateFBtc] = useState(initialState);
  const [headerIcon, setHeaderIcon] = useState('icon-atention.svg');
  const [underMaintenance, setUnderMaintenance] = useState(false);

  const address = accountData?.Owner;
  const socket = auth.socket;
  
  const cleanupState = () => {
    setStateFBtc(initialState);
  };

  useEffect(() => {
    return cleanupState;
  }, []);

  useEffect(
    () => {
      if (socket) {
        //Get tx limits
        socket.emit('txAmount', limits => {
          setStateFBtc(prevState => ({
            ...prevState,
            limits
          }));
        });
      }
    },
    [socket, stateFBtc.step]
  );

  useEffect(
    () => {
      if (socket) {
        const updateStateBTCtx = tx => {
          console.log('-----DETECTED DEPOSIT TX from ModalTopUp ------');
          console.log(tx);
          setStateFBtc(prevState => ({
            ...prevState,
            step: Step.TRANSACTION,
            txId: TxId.DEPOSIT,
            depositTx: tx
          }));
        };
        const updateStateRBTCtx = tx => {
          console.log('-----DETECTED TRANSFER TX from ModalTopUp ------');
          console.log(tx);
          setStateFBtc(prevState => ({
            ...prevState,
            step: Step.TRANSACTION,
            txId: TxId.TRANSFER,
            transferTx: tx
          }));
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
    [socket]
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
  return (
    <div className="top-up-wallet-modal-container">
      <Modal
        visible={visible}
        onCancel={handleClose}
        width={550}
        footer={
          (stateFBtc.step === Step.MAIN) && (
            <ModalFooter />
          )
        }
        title={getModalTitle()}
        wrapClassName="ModalTopUpContainer"
      >
        <div className="ModalTopUpBody">
          {stateFBtc.step === Step.MAIN || stateFBtc.step === Step.WALLET ? (
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
                      {t('MoC.fastbtc.topUpWalletModal.limits.min', {
                          ns: 'moc',
                          minValue: parseFloat(stateFBtc.limits.min.toFixed(4))
                        })}
                      </li>
                      <li>
                        {t('MoC.fastbtc.topUpWalletModal.limits.max', {
                          ns: 'moc',
                          maxValue: parseFloat(stateFBtc.limits.max.toFixed(4))
                        })}
                      </li>
                      <li>
                        <p>Fee: 5k satoshis + 0.2%</p>
                      </li>
                    </ul>
                  </div>
                  <b className="section-title">{t('MoC.fastbtc.topUpWalletModal.instructions.header', {ns: 'moc'})}</b>
                  <div className="TopUpInstructions">
                    <ul>
                      <li>{t('MoC.fastbtc.topUpWalletModal.instructions.items.0', { ns: 'moc' })}</li>
                      <li>{t('MoC.fastbtc.topUpWalletModal.instructions.items.1', { ns: 'moc' })}</li>
                      <li>{t('MoC.fastbtc.topUpWalletModal.instructions.items.2', { ns: 'moc' })}</li>
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
                  <>
                    <MainScreen
                      state={stateFBtc}
                      setState={setStateFBtc}
                      address={address}
                      underMaintenance={underMaintenance}
                      socket={socket}
                    />
                  </>
                )}
              </div>
            </div>
          ) : (
           <TransactionScreen state={stateFBtc} setState={setStateFBtc} />
          )}
        </div>
      </Modal>
    </div>
  )
}

const MainScreen = ({ state, setState, socket, address, underMaintenance }) => {
  const [t, i18n]= useTranslation(["global",'moc'])
  useEffect(
    () => {
      if (!address) console.log('--- USER IS NOT LOGGED IN ----');
      if (!socket) console.log('---- SOCKET IS NOT CONNECTED ---');
      getBtcAddress(socket, address)
        .then(res => {
          if (res.error != null) {
            console.log('----- ERROR ----');
            console.log(res.error);
          }
          console.log('------ EVERYTHING OK -------');
          const result = res.res;
          setState(prevState => ({
            ...prevState,
            deposit: {
              ...prevState.deposit,
              address: result.btcadr,
              receiver: result.web3adr
            }
          }));
          return res;
        })
        .catch(e => {
          console.log('------ ERRROR ------');
          console.log(e);
        });
    },
    [state.deposit.address]
  );

  return (
    <div className="TxActions">
      {state.step === Step.WALLET && state.deposit.address !== '' ? (
        <div className="AddressQrCode">
          <div className="tw-text-lg tw-ml-8 tw-mb-2.5">
            <b className="AddressTitle">{t('MoC.fastbtc.topUpWalletModal.txactions.sendBTCTitle', {ns: 'moc'})}</b>
            <Copy
              textToShow={state.deposit.address.substring(0, 6) + '...' + state.deposit.address.substring(state.deposit.address.length - 4, state.deposit.address.lenght)}
              textToCopy={state.deposit.address} fastBTC={true}
            />
          </div>
          <div>
            <QRCode value={address} size="128" alt="qrCode"  />
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="MainActions">
        {state.step === Step.MAIN && (
          <BTCButton
            underMaintenance={underMaintenance}
            onClick={() => {
              setState(prevState => ({
                ...prevState,
                step: Step.WALLET
              }));
            }}
          />
        )}
      </div>
    </div>
  );
};