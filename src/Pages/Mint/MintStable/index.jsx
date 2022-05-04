import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import { Row, Col, Switch } from 'antd';
import { Fragment } from 'react';

export default function Mint(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">DoC</h1>
            <h3 className="PageSubTitle">Manage your DoCs</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard tokenName="stable" titleName="DoC"/>
                </Col>
                <Col xs={24} md={12} xl={4}>
                    <YourAddressCard height="23.4em" tokenName="STABLE" currencyOptions={['RESERVE', 'STABLE']} />
                </Col>
                <Col xs={24} xl={15}>
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
        </Fragment>
    );
}
