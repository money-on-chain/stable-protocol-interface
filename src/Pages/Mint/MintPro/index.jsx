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
        asset: 'BPRP',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });
    data_row_coins.push({
        key: 1,
        info: '',
        event: 'DOC',
        asset: 'BPRP',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });

    return (
        <Fragment>
            <h1 className="PageTitle">BPro</h1>
            <h3 className="PageSubTitle">Manage your BPros</h3>
            <div className="WalletCards">
                <AmountCard tokenName="riskpro" titleName="BPro"/>
                <YourAddressCard/>
                <MintCard
                    token={'RISKPRO'}
                    AccountData={props.Auth.accountData}
                    UserBalanceData={props.Auth.userBalanceData}
                    StatusData={props.Auth.contractStatusData}
                    currencyOptions={['RESERVE', 'RISKPRO']}
                    color="#ef8a13"
                />
            </div>
            <div className="Card WalletOperations">
                <div className="title"><h1>Last Operations</h1></div>
                <ListOperations datas={data_row_coins}></ListOperations>
            </div>
        </Fragment>
    );
}
