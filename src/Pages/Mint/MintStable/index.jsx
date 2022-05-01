import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import { Row, Col, Switch } from 'antd';
import React, { Fragment } from 'react';
import ListOperations from "../../../Components/Tables/ListOperations";

export default function Mint(props) {
    const data_row_coins = [];

    data_row_coins.push({
        key: 0,
        info: '',
        event: 'DOC',
        asset: 'DOC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });
    data_row_coins.push({
        key: 1,
        info: '',
        event: 'DOC',
        asset: 'DOC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });

    return (
        <Fragment>
            <h1 className="PageTitle">DoC</h1>
            <h3 className="PageSubTitle">Manage your DoCs</h3>
            <Row gutter={15}>
                <Col span={5}>
                    <AmountCard tokenName="stable" titleName="DoC"/>
                </Col>
                <Col span={4}>
                    <YourAddressCard/>
                </Col>
                <Col span={15}>
                    <MintCard
                        token={'STABLE'}
                        currencyOptions={['RESERVE', 'STABLE']}
                        StatusData={props.Auth.contractStatusData}
                        UserBalanceData={props.Auth.userBalanceData}
                        color="#00a651"
                        AccountData={props.Auth.accountData}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <div className="title"><h1>Last Operations</h1></div>
                <ListOperations datas={data_row_coins}></ListOperations>
            </div>
        </Fragment>
    );
}
