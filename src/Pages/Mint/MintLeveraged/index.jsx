import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import { Row, Col, Switch } from 'antd';
import { Fragment } from 'react';
import TokenSummaryCard from '../../../Components/Cards/TokenSummaryCard';

export default function Mint(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">BTCx</h1>
            <h3 className="PageSubTitle">Manage your BTCx Position</h3>
            <div className="WalletCardsContainer">
                <Row gutter={15}>
                    <Col span={5}>
                        <AmountCard tokenName="riskprox" titleName="BTCx"/>
                    </Col>
                    <Col span={4}>
                        <YourAddressCard />
                    </Col>
                    <Col span={15}>
                        <MintCard
                            token={'RISKPROX'}
                            AccountData={props.Auth.accountData}
                            UserBalanceData={props.Auth.userBalanceData}
                            StatusData={props.Auth.contractStatusData}
                            currencyOptions={['RESERVE', 'RISKPROX']}
                            color="#ed1c24"
                        />
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
}
