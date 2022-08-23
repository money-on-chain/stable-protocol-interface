/* eslint-disable no-use-before-define */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import React, { useEffect, useState, useContext } from "react";
import debounce from 'lodash.debounce';
import web3 from 'web3';
import { Row, Col, Modal, Button } from 'antd';
import CoinSelect from "../../Form/CoinSelect";
import InputAddress from "../../InputAddress";
import InputWithCurrencySelector from "../../Form/InputWithCurrencySelector";
import { getBalanceAndTransferMethodOfTokenToSend } from '../../../Config/currentcy';
import { useTranslation } from "react-i18next";
import addressHelper from '../../../Lib/addressHelper';
import { toBigNumber } from "../../../Lib/numberHelper";
import {formatLocalMap2, formatVisibleValue} from "../../../Lib/Formats";
import { AuthenticateContext } from "../../../Context/Auth";
import AlertLabel from "../../AlertLabel/AlertLabel";
import Copy from "../../Page/Copy";

const BigNumber = require('bignumber.js');

export default function SendModal(props) {
  const { token = '', tokensToSend, userState, view } = props;
  const { docBalance = 0, bproBalance = 0, bprox2Balance = 0, mocBalance = 0 } = props.UserBalanceData ? props.UserBalanceData : {};
  const [address, setAddress] = useState('');
  const [currencyYouReceive, setCurrencyYouReceive] = useState('');
  /* const [currencyYouExchange, setCurrencyYouExchange] = useState(
    props.currencyOptions[0]
  ); */

  const [addTotalSend, setAddTotalSend] = useState('0.0000');
  const [visible, setVisible] = useState(false);
  const [amountToSend, setAmountToSend] = useState(0);
  const [visibleAlertInvalidAddress, setVisibleAlertInvalidAddress] = useState(false);
  const [maxExceeded, setMaxExceeded] = useState(false);
  const [maxExceededRetries, setMaxExceededRetries] = useState(0);
  const [tokenToSend, setTokenToSend] = useState(props.tokensToSend && props.tokensToSend[0]);
  const [inputIsValid, setInputIsValid] = useState(true);

  const [t, i18n] = useTranslation(["global", 'moc']);
  const helper = addressHelper(web3);
  const auth = useContext(AuthenticateContext);

  const [showTransaction, setShowTransaction] = useState(false);
  const [currentHash, setCurrentHash] = useState(null);
  const [txType, setTxType] = useState('');
  const [txtTransaction, setTxtTransaction] = useState('');

  const getDefaultState = () => {
    setVisible(false);
    setAddress('');
    setAmountToSend(0);
    setVisibleAlertInvalidAddress(false);
    setMaxExceeded(false);
    setMaxExceededRetries(0);
    setTokenToSend(tokensToSend && tokensToSend[0]);
    setInputIsValid(true);
  };

  const changeValueYouAddTotal = () => {
    if( props.currencyOptions===undefined ){
      return  'MOC'
    }else{
      switch (props.currencyOptions[1]) {
        case 'STABLE':
          return 'DOC'
          break;
        case 'RISKPRO':
          return  'BPRO'
          break;
        case 'RISKPROX':
          return 'BPROX'
        case 'MOC':
          return 'MOC'
          break;
      }
    }
  };

  const setDefaultState = () => {
    getDefaultState();
  }

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    cancelFull();
  };

  const getMaxToSend = () => {
    const { amount } = getBalanceAndTransferMethodOfTokenToSend(userState.userBalanceData, tokenToSend);
    return amount;
  };

  const onTokenToSendSelect = newTokenToSend => {
    setTokenToSend(newTokenToSend);
  };

  const onAmountToSendChange = newAmountToSend => {
    setAmountToSend(newAmountToSend);
  };

  const onInputValidityChange = (newValidity) => {
    setInputIsValid(newValidity);
  };

  const handleOk = debounce(() => {
    // setAddress(amountToSend)
    // setAddress(address)
    const methodTransferTo = getMethodTransferTo();
    const isCheckSumAddress = (address === undefined) ? false : helper.isValidAddressChecksum(address);
    if (isCheckSumAddress) {
      if (isAmountOverMaxAllowed(amountToSend, getMaxToSend(), tokenToSend)) {
        showAlertAmountMessage(maxExceededRetries + 1);
        if (maxExceededRetries > 0) {
          doTransferAndHide(methodTransferTo, address);
        }
      } else {
        doTransferAndHide(methodTransferTo, address);
      }
    } else {
      showAlertMessageAddress();
    }
    setStatusScreen(2)
  }, 1000);

  const cancelFull = () => {
    setTimeout(function(){
      setVisible(false);
    }, 200);
    setStatusScreen(false)
  };

  const changeContent= () => {
    setStatusScreen(1)
    setShowTransaction(true);
  };

  const isAmountOverMaxAllowed = (amount, maxAvailable, currencyCode) => {
    const maxSourceAvailable = toBigNumber(maxAvailable);
    const bdInputAmount = toBigNumber(amount);
    if (bdInputAmount.isNaN()) return false;
    if (maxSourceAvailable.isNaN()) return false;
    return bdInputAmount.isGreaterThan(maxSourceAvailable);
  };

  const doTransferAndHide = (methodTransferTo, inputAddress) => {
    methodTransferTo(inputAddress, formatVisibleValue(amountToSend, tokenToSend, "en"), onTransaction, onReceipt);
  };

  const onTransaction = (transactionHash) => {
    console.log("On sent transaction");
    console.log(transactionHash);
    setCurrentHash(transactionHash);
    setStatusScreen(3)
  };

  const onReceipt = async (receipt) => {
    auth.loadContractsStatusAndUserBalance();
    setTimeout(function(){
      if (typeof window.renderTable !== "undefined") {
          window.renderTable(1)
      }
    }, 10000);
    setStatusScreen(4)
    const filteredEvents = auth.interfaceDecodeEvents(receipt);
  };

  const showAlertAmountMessage = retryNumber => {
    setMaxExceeded(true);
    setMaxExceededRetries(retryNumber);
  };

  const showAlertMessageAddress = () => {
    setVisibleAlertInvalidAddress(true);
  };

  const getMethodTransferTo = () => {
    const { methodTransferTo } = getBalanceAndTransferMethodOfTokenToSend(userState.userBalanceData, tokenToSend, auth);
    //const { methodTransferTo } = getBalanceAndTransferMethodOfTokenToSend(userState.userBalanceData, tokenToSend, auth,amountToSend,address);
    return methodTransferTo;
  }

  const maxtoSend = getMaxToSend();

  const onChangeInputAddress = (address) => {
    setAddress(address)
  };

  const [statusScreen, setStatusScreen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ width: 90, fontFamily: 'Montserrat,sans-serif', fontSize: '1em', fontWeight: view === 'moc' ? 700 : 500, marginTop: view === 'moc' && '5.9em'  }}
      >{t('MoC.wallet.send', { ns: 'moc' })}
      </Button>
      <Modal
        title={t("MoC.wallet.send", { ns: 'moc' })}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          {visibleAlertInvalidAddress && <AlertLabel />}
          {(statusScreen!=1 && statusScreen!=2 && statusScreen!=3 && statusScreen!=4) &&
          <>
          <InputAddress
            title={t("MoC.wallets.receiverAddress", { ns: 'moc' })}
            value={address}
            onChange={(event) => onChangeInputAddress(event)}
            className="separation"
            isValidChecksumAddress={auth && auth.isCheckSumAddress}
          />
          <InputWithCurrencySelector
            validate
            title={t("global.ModalSend_EnterTheAmount")}
            currencyOptions={tokensToSend}
            currencySelected={tokenToSend}
            onCurrencySelect={onTokenToSendSelect}
            inputValueInWei={amountToSend}
            onInputValueChange={onAmountToSendChange}
            maxValueAllowedInWei={maxtoSend}
            showMaxValueAllowed
            onValidationStatusChange={onInputValidityChange}
            className="separation"
          />
          <Row style={{ marginTop: '2em' }}>
            <Col span={24} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button onClick={() => handleCancel()}>Cancel</Button>
              <Button type="primary" onClick={() => changeContent()}>Confirm</Button>
            </Col>
          </Row>
          </>
          }
          {statusScreen == 1 &&
          <>
            <div className={'div-txt'}>
              <div>
                {showTransaction &&
                <>
                  <div style={{ width: '100%','display':'inline-block' }}>
                    <p className={'Transaction_ID'} style={{'float':'left'}}>Transfer</p>
                    <div style={{'float':'right'}}>
                      <p className={'copy-txt'}>{formatVisibleValue(amountToSend, tokenToSend, formatLocalMap2['en'])}&nbsp;&nbsp;&nbsp;<span>{changeValueYouAddTotal()}</span></p>
                    </div>
                  </div>
                  <br/>
                  <div style={{ width: '100%','display':'inline-block' }}>
                    <p className={'Transaction_ID'}  style={{'float':'left'}}>To</p>
                    <div style={{ float: 'right' }}>
                      <Copy textToShow={address?.slice(0, 5)+'...'+ address?.slice(-4)} textToCopy={address} />
                    </div>
                  </div>
                  <br/>
                </>
                }
              </div>
              <br/>
              <div>
                <Button type="default" onClick={() => cancelFull()} className={'width-140'} >{"Cancel"}</Button>
                <Button type="primary" onClick={() => handleOk()} className={'float-right width-140'}>{"Confirm"}</Button>
              </div>
            </div>
          </>
          }
          { statusScreen == 2 &&
          <>
              <div style={{'textAlign':'center'}}>
                <img src={process.env.PUBLIC_URL + "/global/status-pending.png"} width={50} height={50} className='img-status rotate'/>
                <br/>
                <br/>
                <p className={'Transaction_confirmation'}>{t('MoC.PleaseReviewYourWallet', {ns: 'moc'})}</p>
                <br/>
                <Button type="primary" onClick={() => cancelFull()} className={'width-140'}>{"Close"}</Button>
              </div>
          </>
          }
          {(statusScreen == 3 || statusScreen == 4 ) &&
          <>
            <div className={'div-txt'}>
              <div>
                {showTransaction &&
                <>
                  <div style={{ width: '100%','display':'inline-block' }}>
                    <p className={'Transaction_ID'}   style={{'float':'left'}}>Transaction ID</p>
                    <div style={{ float: 'right' }}>
                        <Copy textToShow={currentHash?.slice(0, 5)+'...'+ currentHash?.slice(-4)} textToCopy={currentHash} typeUrl={'tx'}/>
                    </div>
                  </div>
                  <div style={{'textAlign':'center'}}>
                  {(() => {
                    switch (statusScreen) {
                      case 3:
                        return <img src={process.env.PUBLIC_URL + "/global/status-pending.png"} width={50} height={50} className='img-status rotate'/>;
                      case 4:
                        return <img width={50} height={50} src={process.env.PUBLIC_URL + "/global/status-success.png"} alt="ssa" className={'img-status'}/>;
                    }
                  })()}
                  </div>

                  <div style={{'textAlign':'center'}}>
                    <br/>
                    {(() => {
                      switch (statusScreen) {
                        case 3:
                          return <p className={'Transaction_confirmation'}>{t('global.Transaction_confirmation', {ns: 'global'})}</p>;
                        case 4:
                          return <p className={'Operation_successful'}>{t('global.Operation_successful')}</p>;

                      }
                    })()}

                    <br/>
                    <Button type="primary" className={'width-140'} onClick={() => cancelFull()} >{"Close"}</Button>
                  </div>
                </>
                }
              </div>
            </div>
          </>
          }
        </div>
      </Modal>
    </>
  )
}