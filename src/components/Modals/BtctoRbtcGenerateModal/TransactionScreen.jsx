import React, {useContext} from 'react';
import { Tooltip, Button } from 'antd';
import { TxId } from '../../../lib/fastBTC/constants';
import {useTranslation} from "react-i18next";
import './transactionscreen.scss';
import { urlBtcExplorer, urlExplorerUrl } from '../../../lib/fastBTC/fastBTCMethods';
import {AuthenticateContext} from "../../../context/Auth";
import { config } from '../../../projects/config';
import { ReactComponent as btcLogo } from '../../../assets/icons/icon-btclogo.svg';
import { ReactComponent as greenLogo } from '../../../assets/icons/greenreload.svg';
import { ReactComponent as rbtcLogo } from '../../../assets/icons/icon-rbtclogo.svg';


const TransactionInfo = ({ txId, txName, state}) => {
const [t, i18n]= useTranslation(["global",'moc','rdoc']);
const ns = config.environment.AppProject.toLowerCase();
const AppProject = config.environment.AppProject;
const tx = txId === TxId.DEPOSIT ? state.depositTx : state.transferTx;
  const txBtn = (
    <Tooltip title={tx.txHash}>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={
          (txId === TxId.DEPOSIT ? `${urlBtcExplorer}` : `${urlExplorerUrl}`) +
          '/tx/' +
          (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).txHash
        }
      >
        {(txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).txHash
          ? (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).txHash
              .slice(0, 6)
              .concat(
                '...' +
                  (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).txHash.slice(-6)
              )
          : ''}
      </a>
    </Tooltip>
  );
  return (
    <div>
      {txId === TxId.DEPOSIT && (
        <p className="transaction-btc-sections-p font-size-12">
          {t(
            `${AppProject}.fastbtc.topUpWalletModal.transactionInfo.status_` +
              (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).status,
            {
              ns: ns,
              statusIndex:
                (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).status === 'confirmed'
                  ? 2
                  : 1
            }
          )}
        </p>
      )}
        {txId === TxId.TRANSFER && (
            <p className="transaction-btc-sections-p font-size-12">
                {t(
                    `${AppProject}.fastbtc.topUpWalletModal.transactionInfo.status_` +
                    (txId === TxId.TRANSFER ? state.depositTx : state.transferTx).status,
                    {
                      ns: ns,
                      statusIndex:2
                    }
                )}
            </p>
        )}
      <p className="transaction-btc-sections-p font-size-12">
        {t(`${AppProject}.fastbtc.topUpWalletModal.transactionInfo.valueDeposited`, {
          ns: ns,
          value:
            txId === TxId.DEPOSIT
              ? t(`${AppProject}.fastbtc.topUpWalletModal.valueBTC`, {
                  ns: ns,
                  value: (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).value
                })
              : t(`${AppProject}.fastbtc.topUpWalletModal.valueRBTC`, {
                  ns: ns,
                  value: (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).value
                })
        })}
      </p>
        <p className="transaction-btc-sections-p font-size-12">
            {t(`${AppProject}.fastbtc.topUpWalletModal.transactionInfo.fromLabel`, {
                ns: ns,
                value:
                    txId === TxId.DEPOSIT
                        ? t('fastbtc.topUpWalletModal.valueBTC', {
                            value: (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).value
                        })
                        : t('fastbtc.topUpWalletModal.valueRBTC', {
                            value: (txId === TxId.DEPOSIT ? state.depositTx : state.transferTx).value
                        })
            })}
        </p>
      {state.deposit && (
        <span>
          {/*<TransactionArrow />*/}

          <p className="transaction-btc-sections-p font-size-12">
            {t(`${AppProject}.fastbtc.topUpWalletModal.transactionInfo.toLabel`, { ns: ns })}{' '}
            {(txId === TxId.DEPOSIT ? state.deposit.address : state.deposit.receiver)
              .slice(0, 6)
              .concat( (txId === TxId.DEPOSIT ? state.deposit.address : state.deposit.receiver).slice(-4) )}
          </p>
        </span>
      )}
      <p className="transaction-btc-sections-p font-size-12">
        {t(`${AppProject}.fastbtc.topUpWalletModal.transactionInfo.txHashLabel`, {ns: ns})} {txBtn}
      </p>
    </div>
  );
}

export default function TransactionScreen({ state, setState }) {
  const [t, i18n]= useTranslation(["global",'moc', 'rdoc']);
  const ns = config.environment.AppProject.toLowerCase();
  const AppProject = config.environment.AppProject;
    const auth = useContext(AuthenticateContext);
  const mockBtcDeposit = () => {
    setState(prevState => ({
      ...prevState,
      depositTx: {
        ...prevState.depositTx,
        status: 'pending'
      },
      txId: TxId.DEPOSIT
    }));
  };
  const mockBtcDepositConfirmed = () => {
    setState(prevState => ({
      ...prevState,
      depositTx: {
        ...prevState.depositTx,
        status: 'confirmed'
      },
      txId: TxId.DEPOSIT
    }));
  };
  return (
    <div className="ModalSendContainer">
      {state.depositTx.status === '' ? (
        <div className="no-transaction-detected-container">
          <p>We have not detected any transaction yet</p>
          <div style={{ display: 'flex', flexDirection:'column' }}>
            <Button
              style={{fontWeight: 'bold' }}
              type="primary"
              onClick={mockBtcDeposit}
              textClassName="tw-inline-block tw-text-lg"
            >BTC DEPOSIT</Button>
            <Button
              style={{fontWeight: 'bold' }}
              type="primary"
              onClick={mockBtcDepositConfirmed}
              textClassName="tw-inline-block tw-text-lg"
            >BTC DEPOSIT CONFIRMED</Button>
          </div>
        </div>
      ) : (
        <div className="transactions-details-container">
          <div className="transaction-details mrb-4">
            <h3 className="transaction-btc-title font-size-12">{t(`${AppProject}.fastbtc.topUpWalletModal.transaction1DetailsTitle`, {ns: ns})}</h3>
            <TransactionInfo txId={TxId.DEPOSIT} txName="BTC" state={state} />
              <btcLogo className="logo-img img-set1" width={128} height={128} alt=""/>
          </div>
          <hr />
          <div className='transaction-details mrb-35 mrt-25'>
              <h3 className="transaction-btc-title font-size-12">{t(`${AppProject}.fastbtc.topUpWalletModal.transaction2DetailsTitle`, {ns: ns})}</h3>
            <TransactionInfo txId={TxId.TRANSFER} txName="RBTC" state={state} />
              <greenLogo className="logo-img img-reload" width={17} height={17}  alt=""/>
              <rbtcLogo className="logo-img img-set2" width={128} height={128} alt=""/>
          </div>
        </div>
      )}
    </div>
  );
}
