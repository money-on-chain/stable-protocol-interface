import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import { Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, Fragment } from 'react';
import TokenSummaryCard from '../../../Components/Cards/TokenSummaryCard';
import moment from 'moment';

export default function Mint(props) {
    const [daysHours, setDaysHours] = useState(null);

    const decimaltoHour = (dayBlockSpan, blocksToSettlement) => {
        const result = {};
        const num = ((blocksToSettlement * 24) / dayBlockSpan);
        const minutos = num * 60;
        const segundos = minutos * 60;
        var seconds = Number(segundos);
        var d =Math.floor(seconds /(3600*24));
        var h =Math.floor(seconds %(3600*24)/3600);
        var m =Math.floor(seconds %3600/60);
        var s =Math.floor(seconds %60);
        var dDisplay = d >0? d +(d ==1?" day ":" days "):"";
        var hDisplay = h >0? h +(h ==1?" hour ":" hours "):"";
        var mDisplay = m >0? m +(m ==1?" minute ":" minutes "):"";
        var sDisplay = s >0? s +(s ==1?" second":" seconds"):"";
        result.time = dDisplay + hDisplay;
        const today = moment().add(d, 'd').add(h, 'h').add(m, 'm').add(s, 's');
        result.date = moment(today).format('MMMM DD, YYYY HH:mm:ss');
        return result;
    };

    useEffect(() => {
        setDaysHours(decimaltoHour(props.Auth.contractStatusData.dayBlockSpan, props.Auth.contractStatusData.blocksToSettlement));
    }, []);

    return (
        <Fragment>
            <h1 className="PageTitle">BTCx</h1>
            <h3 className="PageSubTitle">Manage your BTCx Position</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard tokenName="riskprox" titleName="BTCx"/>
                </Col>
                <Col xs={24} md={12} xl={5}>
                    <Row>
                        <Col span={24}>
                            <div className="Card MintCard CardSettlement">
                                <h3 className="CardTitle">Next settlement</h3>
                                <Row>
                                    <h2>In {daysHours?.time}</h2>
                                    <div className="CaptionDateSettlement">{daysHours?.date}</div>
                                    <div>
                                        <span className="SettlementTitle">Remaining blocks: </span>
                                        {props.Auth.contractStatusData?.blocksToSettlement}
                                        <Tooltip placement="top" title={props.Auth.contractStatusData?.blockHeight}>
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
                <Col xs={24} xl={14}>
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
