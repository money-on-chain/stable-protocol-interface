import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import { Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Fragment } from 'react';
import TokenSummaryCard from '../../../Components/Cards/TokenSummaryCard';

export default function Mint(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">BTCx</h1>
            <h3 className="PageSubTitle">Manage your BTCx Position</h3>
            <Row gutter={15}>
                <Col span={5}>
                    <AmountCard tokenName="riskprox" titleName="BTCx"/>
                </Col>
                <Col span={5}>
                    <Row>
                        <Col span={24}>
                            <div className="Card MintCard CardSettlement">
                                <h3 className="CardTitle">Next settlement</h3>
                                <Row>
                                    <h2>In 1 days 9 hpurs</h2>
                                    <div className="CaptionDateSettlement">April 20th 2022, 11:39:22 pm</div>
                                    <div>
                                        <span className="SettlementTitle">Remaining blocks: </span>
                                        4004
                                        <Tooltip placement="top" title="200849">
                                            <InfoCircleOutlined className="Icon"/>
                                        </Tooltip>
                                    </div>
                                </Row>
                            </div>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <div className="Card MintCard Bprox2Metrix">
                                <h3 className="CardTitle">BTCx Leverage</h3>
                                <div>
                                    <span>2.0000</span>
                                </div>
                                <h3 className="CardTitle">Current Interest Rate</h3>
                                <div>
                                    <span>0.027379</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={14}>
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
        </Fragment>
    );
}
