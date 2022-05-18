/* eslint-disable no-use-before-define */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Button } from 'antd';
import CoinSelect from "../../Form/CoinSelect";
import InputAddress from "../../InputAddress";
import InputWithCurrencySelector from "../../Form/InputWithCurrencySelector";
import { getBalanceAndTransferMethodOfTokenToSend } from '../../../Config/currentcy';
import { useTranslation } from "react-i18next";
const BigNumber = require('bignumber.js');

export default function SendModal(props) {
  console.log('props', props);
  const { token = '', tokensToSend, userState } = props;
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
  const [comment, setComment] = useState('');
  const [inputIsValid, setInputIsValid] = useState(true);

  const [t, i18n]= useTranslation(["global",'moc'])

  const getDefaultState = () => {
    setVisible(false);
    setAddress('');
    setAmountToSend(0);
    setVisibleAlertInvalidAddress(false);
    setMaxExceeded(false);
    setMaxExceededRetries(0);
    setTokenToSend(tokensToSend && tokensToSend[0]);
    setComment('');
    setInputIsValid(true);
  };

  /* useEffect(() => {
    let youReceive = props.currencyOptions.filter(
      (x) => x !== currencyYouExchange
    )[0];
    setCurrencyYouReceive(youReceive);
  }, [currencyYouExchange]); */

  const changeValueYouAddTotal = () => {
    switch (currencyYouReceive) {
      case 'RBTC':
        setAddTotalSend(new BigNumber(props.AccountData.Balance).toFixed(4));
      case 'STABLE':
        setAddTotalSend(docBalance);
        break;
      case 'RISKPRO':
        setAddTotalSend(bproBalance);
        break;
      case 'RISKPROX':
        setAddTotalSend(bprox2Balance);
      case 'MOC':
        setAddTotalSend(mocBalance);
        break;
    }
  };

  const setDefaultState = () => {
    getDefaultState();
  }

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setDefaultState();
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

  const maxtoSend = getMaxToSend();

  return (
    <>
      <Button type="primary" onClick={showModal}>Send</Button>
      <Modal
        title="Send"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <InputAddress
            title="Receiver address or domain"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="separation"
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
          {/* <CoinSelect
            label="MoC Tokens I want to stake"
            value={currencyYouReceive}
            UserBalanceData={props.UserBalanceData}
            token={token}
            AccountData={props.AccountData}
            onInputValueChange={changeValueYouAddTotal}
            inputValueInWei={addTotalSend}
          /> */}
          <Row style={{ marginTop: '2em' }}>
            <Col span={24} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary">Confirm</Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}