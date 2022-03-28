import { Row, Col, Switch } from 'antd'
import './style.scss'
import React, { useEffect, useState } from 'react';
import {Button} from 'antd'
import CoinSelect from '../../Form/CoinSelect'
import MintModal from '../../Modals/MintModal'
import { convertAmount } from '../../../Lib/Formats.js'
export default function MintCard(props) {
    const {token = '', color = ''} = props;

    const [currencyYouExchange, setCurrencyYouExchange] = useState(props.currencyOptions[0]);
    const [currencyYouReceive, setCurrencyYouReceive] = useState('');
    const [valueYouExchange, setValueYouExchange] = useState('0');
    const [valueYouReceive, setValueYouReceive] = useState('0');
    const [showMintModal, setShowMintModal] = useState(false);
    const [isMint, setIsMint] = useState(true);

    const onChangeCurrencyYouExchange = newCurrencyYouExchange => {
        setCurrencyYouExchange(newCurrencyYouExchange);
    };

    useEffect(() => {
        let youReceive = props.currencyOptions.filter(x => x !== currencyYouExchange)[0];
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
        setValueYouExchange('0');
        setValueYouReceive('0');
    };

    const onValueYouExchangeChange = newValueYouExchange => {
        setValueYouExchange(newValueYouExchange);
        const newValueYouReceiveInWei = convertAmount(
            currencyYouExchange,
            currencyYouReceive,
            newValueYouExchange,
            () => {}
        );
        setValueYouReceive(newValueYouReceiveInWei);
    };

    const onFeeChange = (checked) => {};

    return (
        <div className="Card MintCard">
            <h3 className="CardTitle">Mint</h3>
            <Row gutter={15}>
                <Col span={12}>
                    <CoinSelect
                        label="You Exchange"
                        onCurrencySelect={onChangeCurrencyYouExchange}
                        onInputValueChange={onValueYouExchangeChange}
                        value={currencyYouExchange}
                        inputValueInWei={valueYouExchange}
                        currencyOptions={props.currencyOptions}
                        token={token}
                    />
                    <div className="AlignedAndCentered" style={{marginTop: 10, columnGap: 10}}>
                        <div className="Name" style={{flexGrow: 1}}>
                            <div className="Gray">Fee (0.05%)</div>
                        </div>
                        <span className="Value" style={{flexGrow: 1}}>0.00 MOC</span>
                        <Switch defaultChecked onChange={onFeeChange} />
                    </div>
                </Col>
                <Col span={12}>
                    <CoinSelect
                        label="You Receive"
                        inputValueInWei={valueYouReceive}
                        currencyOptions={props.currencyOptions}
                        value={currencyYouReceive}
                        token={token}
                        disabled
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <div style={{marginTop: 20}}>
                        <div>1 RBTC = 44,081.18 USD</div>
                        <div className="TextLegend">* Amounts may be different at<br/> transaction confirmation</div>
                    </div>
                </Col>
                <Col span={12} style={{display: 'flex', alignItems: 'end', justifyContent: 'end'}}>
                    <Row style={{marginTop: 20}} gutter={15}>
                        <Col>
                            <Button type="ghost" onClick={onClear}>Clear</Button>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={checkShowMintModal}>{isMint ? 'Mint' : 'Redeem'}</Button>
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
                token={token}
            />
        </div>
    )
}