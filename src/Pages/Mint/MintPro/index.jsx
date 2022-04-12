import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import { Row, Col, Switch } from 'antd';
import { Fragment } from 'react';

export default function Mint(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">BPro</h1>
            <h3 className="PageSubTitle">Manage your BPros</h3>
            <div className="WalletCardsContainer">
                <Row gutter={15}>
                    <Col span={5}>
                        <AmountCard tokenName="riskpro" titleName="BPro"/>
                    </Col>
                    <Col span={4}>
                        <YourAddressCard />
                    </Col>
                    <Col span={15}>
                        <MintCard
                            token={'RISKPRO'}
                            AccountData={props.Auth.accountData}
                            UserBalanceData={props.Auth.userBalanceData}
                            StatusData={props.Auth.contractStatusData}
                            currencyOptions={['RESERVE', 'RISKPRO']}
                            color="#ef8a13"
                        />
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
}
