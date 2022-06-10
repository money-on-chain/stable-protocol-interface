/* eslint-disable default-case */
/* eslint-disable react/jsx-no-target-blank */
import { Button, Tooltip } from 'antd';
import { AuthenticateContext } from '../../../Context/Auth';
import './style.scss';
import Web3 from 'web3';
import { useState, useContext, useEffect } from 'react';
import { Modal, notification } from 'antd';
import Copy from "../../Page/Copy";
import { currencies as currenciesDetail } from '../../../Config/currentcy';
import { LargeNumber } from '../../LargeNumber';
import {formatLocalMap2} from '../../../Lib/Formats';
import { useTranslation } from "react-i18next";
import { convertAmount } from '../../../Lib/exchangeManagerHelper';
const BigNumber = require('bignumber.js');
export default function MintModal(props) {
  /* Disabled confirm button when not connected */
  const { address } = true; //window;
  var btnDisable = false;
  const isLoggedIn = true; //userAccountIsLoggedIn() && Session.get('rLoginConnected');
  if (!address || !isLoggedIn) {
    btnDisable = true;
  }
  const {
    title = '',
    handleClose = () => {},
    handleComplete = () => {},
    color,
    currencyYouExchange,
    currencyYouReceive,
    token,
    fee,
    interests,
    visible,
    onCancel,
    onConfirm,
    convertToken,
    exchanging,
    receiving,
  } = props;
  const [loading, setLoading] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transaction, setTransaction] = useState(false);
  const auth = useContext(AuthenticateContext);
  const tokenNameExchange = currencyYouExchange
    ? currenciesDetail.find((x) => x.value === currencyYouExchange).label
    : '';
  const tokenNameReceive = currencyYouReceive
    ? currenciesDetail.find((x) => x.value === currencyYouReceive).label
    : '';
  const tokenName = currencyYouReceive
    ? currenciesDetail.find((x) => x.value === token).label
    : '';
  console.log('tokenNameExchange', tokenNameExchange);
  const [currentHash, setCurrentHash] = useState(null);
  const [comment, setComment] = useState('');
  const [t, i18n]= useTranslation(["global",'moc'])
  const { appMode } = 'Moc';

  useEffect(() => {
      if (currentHash) {
          const interval = setInterval(() => {
              getTransaction(currentHash)
          }, 15000);
          return () => clearInterval(interval);
      }
  });
  useEffect(
    () => {
      setComment('');
    },
    [visible]
  );
  const handleOk = async () => {
    setLoading(true);
    switch (currencyYouReceive) {
      case 'STABLE':
        await auth.DoCMint(props.valueYouExchange, callback);
        break;
      case 'RISKPRO':
        await auth.BPROMint(props.valueYouExchange, callback);
        break;
      case 'RISKPROX':
        await auth.Bprox2Mint(props.valueYouExchange, callback);
        break;
      case 'RESERVE':
        await redeem();
        break;
    }
  };
  const redeem = async () => {
      switch (currencyYouExchange) {
          case 'STABLE':
              await auth.DoCReedem(props.valueYouExchange, callback);
              break;
          case 'RISKPRO':
              await auth.BPROReedem(props.valueYouExchange, callback);
              break;
          case 'RISKPROX':
                  await auth.Bprox2Redeem(props.valueYouExchange, callback);
                  break;
      }
  };

  const getTransaction = async (hash) => {
    await auth.getTransactionReceipt(hash, ()=> {
      setTransaction(false);
    }).then(res => {
      if (res)
      setShowTransaction(true);
      setTransaction(true);
    }).catch(e => {
      setTransaction(false);
      notification['error']({
        message: t('global.RewardsError_Title'),
        description: t('global.RewardsError_Message'),
        duration: 10
    });
    });
  } ;

  const callback = (error, transactionHash) => {
    setLoading(false);
    setCurrentHash(transactionHash);
    getTransaction(transactionHash);
  };

  const styleExchange = tokenNameExchange === tokenName ? { color } : {};
  const styleReceive = tokenNameReceive === tokenName ? { color } : {};

  return (
    <Modal
      visible={visible}
      confirmLoading={loading}
      className="ConfirmModalTransaction"
      footer={null}
      onCancel={onCancel}
    >
      <div className="TabularContent">
        <h1>{t('global.ConfirmTransactionModal_Title')}</h1>
        <div className="AlignedAndCentered Amount">
          <span className="Name">{t('global.ConfirmTransactionModal_Exchanging')}</span>
          <span className="Value" style={styleExchange}>
            <Tooltip title={Number(props.valueYouExchange)?.toLocaleString(formatLocalMap2[i18n.languages[0]], {
                minimumFractionDigits: 10,
                maximumFractionDigits: 10
            })}>
              <div>
                {Number(props.valueYouExchange).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                  minimumFractionDigits: tokenNameExchange === 'DOC' ? 2 : 6,
                  maximumFractionDigits: tokenNameExchange === 'DOC' ? 2 : 6
                })} {t(`MoC.Tokens_${tokenNameExchange === 'DOC' ? 'STABLE' : tokenNameExchange === 'RBTC' ? 'RESERVE' : tokenNameExchange}_code`, {ns: 'moc' })}
              </div>
          </Tooltip>
          </span>
        </div>
        <div className="AlignedAndCentered Amount">
          <span className="Name">{t('global.ConfirmTransactionModal_Receiving')}</span>
          <span className="Value" style={styleReceive}>
            <Tooltip title={Number(props.valueYouReceive)?.toLocaleString(formatLocalMap2[i18n.languages[0]], {
                minimumFractionDigits: 10,
                maximumFractionDigits: 10
            })}>
              <div>
                {Number(props.valueYouReceive).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                  minimumFractionDigits: tokenNameReceive === 'DOC' ? 2 : 6,
                  maximumFractionDigits: tokenNameReceive === 'DOC' ? 2 : 6
                })} {t(`MoC.Tokens_${tokenNameReceive === 'DOC' ? 'STABLE' : tokenNameReceive === 'RBTC' ? 'RESERVE' : tokenNameReceive}_code`, {ns: 'moc' })}
              </div>
          </Tooltip>
          </span>
        </div>
        <div className="USDConversion">
          <LargeNumber currencyCode={'USD'} amount={props.valueYouReceiveUSD} includeCurrency />
        </div>

        <div
          className="AlignedAndCentered"
          style={{ alignItems: 'start', marginBottom: 20 }}
        >
          <div className="Name">
            <div className="MOCFee">
              <div className={`AlignedAndCentered Amount`}>
                <span className="Name">{`${t('global.ConfirmTransactionModal_MOCFee')} (${(fee?.percentage!==undefined)? fee.percentage: 0.15}%)`}</span>
                <span className={`Value ${appMode}`}>
                  {auth.isLoggedIn &&
                  <LargeNumber
                    currencyCode={fee?.currencyCode}
                    amount={fee?.value}
                    includeCurrency
                  />}
                  {!auth.isLoggedIn && <span>0.000000 RBTC</span>}
                </span>
              </div>
            </div>
            {interests &&
              interests?.interestValue &&
              interests?.interestValue.gt(0) && (
                <div className="MOCFee">
                  <div className={`AlignedAndCentered Amount`}>
                    <span className="Name">{`${t('global.ConfirmTransactionModal_Interests')} (${interests?.interestRate}%)`}</span>
                    <span className={`Value ${appMode}`}>
                      <LargeNumber
                        currencyCode={'RESERVE' }
                        amount={interests.interestValue}
                        includeCurrency
                      />
                    </span>
                  </div>
                </div>
          )}
            <div className="Legend">
            {t('global.ConfirmTransactionModal_MOCFee_Disclaimer')}
            </div>
          </div>
          {/*<span className="Value">0.00 MOC</span>*/}
        </div>
      </div>

      <hr style={{ border: '1px solid lightgray', marginTop: 20 }} />

      <div className="AlignedAndCentered">
        <i className="Gray">
          {t('global.ConfirmTransactionModal_AmountMayDifferDisclaimer')}
        </i>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1em'}}>
        {showTransaction
          ? <div style={{ width: '100%' }}>
            <div>
              <p style={{ width: '50%', float: 'left' }}>Transaction status</p>
              <p style={{ textAlign: 'right', color: transaction ? '#09c199' : '#f1a954' }}>{transaction ? 'SUCCESSFUL' : 'PENDING'}</p>
            </div>
            <div>
              <p style={{ width: '50%', float: 'left' }}>Hash</p>
              <div style={{ textAlign: 'right' }}>
                <Copy textToShow={currentHash?.slice(0, 5)+'...'+ currentHash?.slice(-4)} textToCopy={currentHash}/>
              </div>
            </div>
            <div style={{ clear: 'both' }}>
              <a
                style={{ color: '#09c199' }}
                href={`https://explorer.testnet.rsk.co/tx/${currentHash}`}
                target="_blank"
              >View on the explorer</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
              <Button type="primary" onClick={() => {handleComplete(); setCurrentHash(null); setShowTransaction(false)}}>Close</Button>
            </div>
          </div>
          : <>
            <Button
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              disabled={!auth.isLoggedIn}
              onClick={() => handleOk()}
            >Confirm</Button>
        </>}
      </div>
    </Modal>
  );
}
