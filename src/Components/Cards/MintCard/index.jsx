import { Row, Col, Switch } from 'antd';
import './style.scss';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import CoinSelect from '../../Form/CoinSelect';
import MintModal from '../../Modals/MintModal';
import { convertAmount } from '../../../Lib/Formats.js';
export default function MintCard(props) {
    const { token = '', color = '' } = props;

    const [currencyYouExchange, setCurrencyYouExchange] = useState(
        props.currencyOptions[0]
    );
    const [currencyYouReceive, setCurrencyYouReceive] = useState('');
    const [valueYouExchange, setValueYouExchange] = useState('0.0000');
    const [valueYouReceive, setValueYouReceive] = useState('0.0000');
    const [valueYouReceiveUSD, setValueYouReceiveUSD] = useState('0.0000');
    const [showMintModal, setShowMintModal] = useState(false);
    const [isMint, setIsMint] = useState(true);

    const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
        setCurrencyYouExchange(newCurrencyYouExchange);
    };

    useEffect(() => {
        let youReceive = props.currencyOptions.filter(
            (x) => x !== currencyYouExchange
        )[0];
        setCurrencyYouReceive(youReceive);
        setIsMint(youReceive === token);
    }, [currencyYouExchange]);

    const checkShowMintModal = () => {
        setShowMintModal(true);
    };

    const closeMintModal = () => {
        setShowMintModal(false);
    };

    const onClear = () => {
        setCurrencyYouExchange(token);
        setValueYouExchange('0.0000');
        setValueYouReceive('0.0000');
    };

    const onValueYouExchangeChange = (newValueYouExchange) => {
        const reservePrice = props.StatusData['bitcoinPrice'];
        switch (currencyYouReceive) {
            case 'STABLE':
                setValueYouReceive(
                    parseFloat(newValueYouExchange) * parseFloat(reservePrice)
                );
                setValueYouReceiveUSD(
                    parseFloat(newValueYouExchange) * parseFloat(reservePrice)
                );
                break;
            case 'RESERVE':
                switch (currencyYouExchange) {
                    case 'STABLE':
                        setValueYouReceive(
                            parseFloat(newValueYouExchange) /
                                parseFloat(reservePrice)
                        );
                        setValueYouReceiveUSD(parseFloat(newValueYouExchange));
                        break;
                    case 'RISKPRO':
                        setValueYouReceive(
                            (newValueYouExchange *
                                props.StatusData['bitcoinPrice']) /
                                reservePrice
                        );
                        setValueYouReceiveUSD(
                            parseFloat(newValueYouExchange) *
                                parseFloat(props.StatusData['bitcoinPrice'])
                        );
                        break;
                    case 'RISKPROX':
                        setValueYouReceive(newValueYouExchange);
                        setValueYouReceiveUSD(
                            parseFloat(newValueYouExchange) *
                                (parseFloat(
                                    props.StatusData['bprox2PriceInRbtc']
                                ) *
                                    parseFloat(reservePrice))
                        );
                        break;
                }
                break;

            case 'RISKPRO':
                setValueYouReceive(
                    (newValueYouExchange * reservePrice) /
                        props.StatusData['bproPriceInUsd']
                );
                setValueYouReceiveUSD(
                    parseFloat(newValueYouExchange) *
                        parseFloat(props.StatusData['bproPriceInUsd'])
                );
                break;
            case 'RISKPROX':
                setValueYouReceive(newValueYouExchange);
                setValueYouReceiveUSD(
                    parseFloat(newValueYouExchange) *
                        (parseFloat(props.StatusData['bprox2PriceInRbtc']) *
                            parseFloat(reservePrice))
                );
                break;
        }
        setValueYouExchange(newValueYouExchange);
    };

    const onFeeChange = (checked) => {};

    return (
        <div className="Card MintCard">
            <h3 className="CardTitle">Mint</h3>
            <Row className="MintSelectsContainer" gutter={15}>
                <Col span={12}>
                    <CoinSelect
                        label="You Exchange"
                        onCurrencySelect={onChangeCurrencyYouExchange}
                        onInputValueChange={onValueYouExchangeChange}
                        value={currencyYouExchange}
                        inputValueInWei={valueYouExchange}
                        currencyOptions={props.currencyOptions}
                        AccountData={props.AccountData}
                        UserBalanceData={props.UserBalanceData}
                        token={token}
                    />
                    <div
                        className="AlignedAndCentered"
                        style={{ marginTop: 10, columnGap: 10 }}
                    >
                        <div className="Name" style={{ flexGrow: 1 }}>
                            <div className="Gray">Fee (0.05%)</div>
                        </div>
                        <span className="Value" style={{ flexGrow: 1 }}>
                            {props.UserBalanceData['mocAllowance']} MOC
                        </span>
                        <Switch
                            disabled={props.UserBalanceData['mocAllowance'] > 0}
                            onChange={onFeeChange}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <CoinSelect
                        label="You Receive"
                        inputValueInWei={valueYouReceive}
                        currencyOptions={props.currencyOptions}
                        value={currencyYouReceive}
                        token={token}
                        UserBalanceData={props.UserBalanceData}
                        AccountData={props.AccountData}
                        disabled
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <div style={{ marginTop: 20 }}>
                        <div>
                            1 RBTC = {props.StatusData['bitcoinPrice']} USD
                        </div>
                        <div className="TextLegend">
                            * Amounts may be different at transaction
                            confirmation
                        </div>
                    </div>
                </Col>
                <Col
                    span={12}
                    style={{
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'end'
                    }}
                >
                    <Row style={{ marginTop: 20 }} gutter={15}>
                        <Col span={12}>
                            <Button type="ghost" onClick={onClear}>
                                Clear
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" onClick={checkShowMintModal}>
                                {isMint ? 'Mint' : 'Redeem'}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <MintModal
                title="Operation Detail"
                visible={showMintModal}
                handleClose={closeMintModal}
                handleComplete={closeMintModal}
                color={color}
                currencyYouExchange={currencyYouExchange}
                currencyYouReceive={currencyYouReceive}
                valueYouExchange={valueYouExchange}
                valueYouReceive={valueYouReceive}
                valueYouReceiveUSD={valueYouReceiveUSD}
                token={token}
            />
        </div>
    );
}
