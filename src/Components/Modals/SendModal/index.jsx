/* eslint-disable no-use-before-define */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import React, { useEffect, useState, useContext } from "react";
import debounce from 'lodash.debounce';
import web3 from 'web3';
import { Row, Col, Modal, Button } from 'antd';
import InputAddress from "../../InputAddress";
import InputWithCurrencySelector from "../../Form/InputWithCurrencySelector";
import { getBalanceAndTransferMethodOfTokenToSend } from '../../../Helpers/currency';
import { useTranslation } from "react-i18next";
import addressHelper from '../../../Helpers/addressHelper';
import {formatLocalMap2, formatVisibleValue} from "../../../Helpers/Formats";
import { AuthenticateContext } from "../../../Context/Auth";
import AlertLabel from "../../AlertLabel/AlertLabel";
import Copy from "../../Page/Copy";
import { config } from './../../../Config/config';
import BigNumber from "bignumber.js";

import IconStatusPending from './../../../assets/icons/status-pending.png';
import IconStatusSuccess from './../../../assets/icons/status-success.png';
import IconCampana from './../../../assets/icons/campana.png';


export default function SendModal(props) {
  const { token = '', tokensToSend, userState, view } = props;
  //const { docBalance = 0, bproBalance = 0, bprox2Balance = 0, mocBalance = 0 } = props.UserBalanceData ? props.UserBalanceData : {};
  const [address, setAddress] = useState('');
  const [currencyYouReceive, setCurrencyYouReceive] = useState('');

  const [addTotalSend, setAddTotalSend] = useState('0.0000');
  const [visible, setVisible] = useState(false);
  const [amountToSend, setAmountToSend] = useState(0);
  const [visibleAlertInvalidAddress, setVisibleAlertInvalidAddress] = useState(false);
  const [maxExceeded, setMaxExceeded] = useState(false);
  const [maxExceededRetries, setMaxExceededRetries] = useState(0);
  const [tokenToSend, setTokenToSend] = useState(props.tokensToSend && props.tokensToSend[0]);
  const [inputIsValid, setInputIsValid] = useState(true);

  const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
  const ns = config.environment.AppProject.toLowerCase();
  const AppProject = config.environment.AppProject;
  const helper = addressHelper(web3);
  const auth = useContext(AuthenticateContext);

  const [showTransaction, setShowTransaction] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [currentHash, setCurrentHash] = useState(null);
  const [txType, setTxType] = useState('');
  const [txtTransaction, setTxtTransaction] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);

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
    //const isCheckSumAddress = (address === undefined) ? false : helper.isValidAddressChecksum(address);
    const isCheckSumAddress = true
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
    if(confirmModal==false){
      if( showTransactionModal ){
        if( txtTransaction!= 'SUCCESSFUL' && txtTransaction!= 'REVIEW' ){
          setConfirmModal(true)
        }else{
          setTxtTransaction('PENDING')
          partClose()
        }
      }else{
        partClose()
      }
    }else{
      partClose()
      setConfirmModal(false)
    }
  };

  const partClose=()=>{
    setCurrentHash(null);
    setShowTransactionModal(false)
    setTimeout(function(){
      setVisible(false);
    }, 200);
    setStatusScreen(false)
  }

  const changeContent= (value) => {
    if( value!=1 ){
      setShowTransaction(true);
      setStatusScreen(1)
    }
    setConfirmModal(false)
  };

  const isAmountOverMaxAllowed = (amount, maxAvailable, currencyCode) => {
    const maxSourceAvailable = new BigNumber(maxAvailable);
    const bdInputAmount = new BigNumber(amount);
    if (bdInputAmount.isNaN()) return false;
    if (maxSourceAvailable.isNaN()) return false;
    return bdInputAmount.isGreaterThan(maxSourceAvailable);
  };

  const doTransferAndHide = (methodTransferTo, inputAddress) => {
    methodTransferTo(inputAddress, formatVisibleValue(amountToSend, tokenToSend, "en"), onTransaction, onReceipt);
  };

  const onTransaction = (transactionHash) => {
    setCurrentHash(transactionHash);
    setStatusScreen(3)
    setShowTransactionModal(true);
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
        >{t(`${AppProject}.wallet.send`, { ns: ns })}
        </Button>
        <Modal
            title={t(`${AppProject}.wallet.send`, { ns: ns })}
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
          <div>
            {visibleAlertInvalidAddress && <AlertLabel />}
            {(statusScreen!==1 && statusScreen!==2 && statusScreen!==3 && statusScreen!==4) &&
            <>
              <InputAddress
                  title={t(`${AppProject}.wallets.receiverAddress`, { ns: ns })}
                  value={address}
                  onChange={(event) => onChangeInputAddress(event)}
                  className="separation"
                  isValidChecksumAddress={auth && auth.isCheckSumAddress}
              />
              <InputWithCurrencySelector
                  validate
                  title={t("global.ModalSend_Amount")}
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
                  <Button onClick={() => handleCancel()} className={'width-140'}>Cancel</Button>
                  <Button type="primary" onClick={() => changeContent(0)} className={'width-140'} disabled={address==''}>Confirm</Button>
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
                      <p className={'Transaction_ID'} style={{'float':'left'}}>Send</p>
                      <div style={{'float':'right'}}>
                        <p className={'copy-txt'}>{formatVisibleValue(amountToSend, tokenToSend, formatLocalMap2['en'])}&nbsp;&nbsp;&nbsp;<span>{t(`${AppProject}.Tokens_${tokenToSend}_code`, { ns: ns })}</span></p>
                      </div>
                    </div>
                    <br/>
                    <div style={{ width: '100%','display':'flex' }}>
                      <p className={'Transaction_ID'}  style={{marginRight: '1em'}}>To</p>
                      <div style={{ float: 'right' }}>
                        <Copy textToShow={address} />
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
            { statusScreen === 2 &&
            <>
              <div style={{'textAlign':'center'}}>
                <img src={IconStatusPending} width={50} height={50} alt="pending" className='img-status rotate'/>
                <br/>
                <br/>
                <p className={'Transaction_confirmation'}>{t(`${AppProject}.PleaseReviewYourWallet`, {ns: ns})}</p>
                <br/>
                <Button type="primary" onClick={() => cancelFull()} className={'width-140'}>{"Close"}</Button>
              </div>
            </>
            }
            {(statusScreen === 3 || statusScreen === 4 ) &&
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
                            return <img src={IconStatusPending} width={50} height={50} alt="pending" className='img-status rotate'/>;
                          case 4:
                            return <img width={50} height={50} src={IconStatusSuccess} alt="success" className={'img-status'}/>;
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
          <Modal visible={confirmModal} footer={null} width={450}>
            <img className={'img-campana'} width={27} height={30} alt="alert" src={IconCampana}/>
            <div className={'div-txt'}>
              <p className={'color-08374F'}>{t('global.ModalSend_CopyTx')}</p>
              <div>
                {showTransactionModal &&
                <>
                  <div style={{ width: '100%','display':'inline-block' }}>
                    <div>
                      <p className={'Transaction_ID'}   style={{'float':'left'}}>{t('global.Transaction_ID')}</p>
                      <div style={{ float: 'right' }}>
                        <Copy textToShow={currentHash?.slice(0, 5)+'...'+ currentHash?.slice(-4)} textToCopy={currentHash} typeUrl={'tx'}/>
                      </div>
                    </div>
                  </div>
                </>
                }
              </div>
              <br/>
              <Button type="default" onClick={() => cancelFull()} className={'width-140'} >{"Close"}</Button>
              <Button type="primary" onClick={() => changeContent(1)} className={'float-right width-140'}>{"Return"}</Button>
            </div>
          </Modal>
        </Modal>
      </>
  )
}