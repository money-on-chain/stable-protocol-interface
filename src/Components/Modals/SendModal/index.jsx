import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Button } from 'antd';
import CoinSelect from "../../Form/CoinSelect";
import InputAddress from "../../InputAddress";
const BigNumber = require('bignumber.js');

export default function SendModal(props) {
    const { token = '', visible = false, handleCancel } = props;
    const { docBalance = 0, bproBalance = 0, bprox2Balance = 0 } = props.UserBalanceData ? props.UserBalanceData : {};
    const [inputAddress, setInputAddress] = useState('');
    const [currencyYouReceive, setCurrencyYouReceive] = useState('');
    const [currencyYouExchange, setCurrencyYouExchange] = useState(
        props.currencyOptions[0]
    );
    
    const [valueYouAddTotal, setValueYouAddTotal] = useState('0.0000');

    useEffect(() => {
        let youReceive = props.currencyOptions.filter(
            (x) => x !== currencyYouExchange
        )[0];
        setCurrencyYouReceive(youReceive);
    }, [currencyYouExchange]);

    const changeValueYouAddTotal = () => {
        switch (currencyYouReceive) {
            case 'RBTC':
                setValueYouAddTotal(new BigNumber(props.AccountData.Balance).toFixed(4));
            case 'STABLE':
                setValueYouAddTotal(docBalance);
                break;
            case 'RISKPRO':
                setValueYouAddTotal(bproBalance);
                break;
            case 'RISKPROX':
                setValueYouAddTotal(bprox2Balance);
                break;
        }
    };

    return (
        <Modal
            title="Send"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <div>
                <InputAddress
                    title="Receiver address or domain"
                    value={InputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    className="separation"
                    // isValidChecksumAddress={window.nodeManager && window.nodeManager.isCheckSumAddress}
                />    
                <CoinSelect
                    label="MoC Tokens I want to stake"
                    value={currencyYouReceive}
                    UserBalanceData={props.UserBalanceData}
                    token={token}
                    AccountData={props.AccountData}
                    onInputValueChange={changeValueYouAddTotal}
                    inputValueInWei={valueYouAddTotal}
                />
                <Row style={{ marginTop: '2em' }}>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary">Confirm</Button>
                    </Col>
                </Row>
            </div>
        </Modal>
    )
}