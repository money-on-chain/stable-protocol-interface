import { Row, Col } from 'antd'
import './style.scss'
import React, { useEffect, useState } from 'react';
import {Button} from 'antd'
import CoinSelect from '../../Form/CoinSelect'
import MintModal from '../../Modals/MintModal'

export default function MintCard(props) {
    const {token = '', color = ''} = props;

    const [currencyYouExchange, setCurrencyYouExchange] = useState(token);
    const [showMintModal, setShowMintModal] = useState(false);
    const [currencyYouReceive, setCurrencyYouReceive] = useState('');

    const onChangeCurrencyYouExchange = newCurrencyYouExchange => {
        setCurrencyYouExchange(newCurrencyYouExchange);
    };

    useEffect(() => {
        let youReceive = props.currencyOptions.filter(x => x !== currencyYouExchange)[0];
        setCurrencyYouReceive(youReceive);
    }, [currencyYouExchange]);

    const checkShowMintModal = () => {
        setShowMintModal(true);
    };

    const closeMintModal = () => {
        setShowMintModal(false);
    };

    return (
        <div className="Card MintCard">
            <h3 className="CardTitle">Mint</h3>
            <Row gutter={15}>
                <Col span={12}>
                    <CoinSelect
                        label="You Exchange"
                        onCurrencySelect={onChangeCurrencyYouExchange}
                        value={currencyYouExchange}
                        currencyOptions={props.currencyOptions}
                        token={token}
                    />
                </Col>
                <Col span={12}>
                    <CoinSelect
                        label="You Receive"
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
                        <Col span={12}>
                            <Button type="ghost">Clear</Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" onClick={checkShowMintModal}>Mint</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <MintModal
                title="Operation Detail"
                visible={showMintModal}
                handleClose={closeMintModal}
                color={color}
                token={token}
            />
        </div>
    )
}