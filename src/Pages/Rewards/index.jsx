import React, { Fragment, useContext } from "react";
import { Row, Col } from 'antd';
import RewardsStakingOptions from "../../Components/Cards/RewardsStakingOptionsCard";
import YourAddressCard from '../../Components/Cards/YourAddressCard';
import MocLiquidity from "../../Components/Cards/MocLiquidity";
import MocAmount from "../../Components/Cards/MocAmount";
import ListOperations from "../../Components/Tables/ListOperations";
import { AuthenticateContext } from '../../Context/Auth';

export default function Rewards(props) {
    const auth = useContext(AuthenticateContext);
    return (
        <Fragment>
            <h1 className="PageTitle">MoC</h1>
            <h3 className="PageSubTitle">Manage your BPros</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <div className="ContainerMocAmountDatas">
                        <MocAmount />
                        <MocLiquidity rewards={true} />
                    </div>
                </Col>
                <Col xs={24} md={12} xl={4}>
                    <YourAddressCard
                        height="32.4em"
                        tokenToSend="MOC"
                        iconWallet={`${window.location.origin}/Moc/icon-moc.svg`}
                        // currencyOptions={['RESERVE', 'MOC']}
                    />
                </Col>
                <Col xs={24} md={24} xl={15}>
                    <RewardsStakingOptions
                        AccountData={auth.accountData}
                        UserBalanceData={auth.userBalanceData}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'MOC'}></ListOperations>
            </div>
        </Fragment>
    )
}