import { ArrowRightOutlined } from '@ant-design/icons';
import {Row, Col, Tooltip, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import { useContext } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthenticateContext } from '../../../Context/Auth';
import { LargeNumber } from "../../LargeNumber";
import { useTranslation } from "react-i18next";
import InformationModal from '../../Modals/InformationModal';
import {getCoinName} from "../../../Helpers/helper";
import { config } from "../../../Config/config";

import { getUserBalance } from "../../../Helpers/balances";


const styleCentered = {
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center'
};

export default function TokenSummaryCard(props) {
    const navigate = useNavigate();
    const {
        tokenName = '',
        // color = '#000',
        page = '',
        balance = '0',
        currencyCode = ''
    } = props;

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc'])


    const [loading, setLoading] = useState(true);
    const timeSke= 1500
    const AppProject = config.environment.AppProject;

    const userBalance = getUserBalance(auth, i18n, tokenName);

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    },[auth]);

    return (
        <Row className="Card TokenSummaryCard" style={{'height':'135px','display':'flex'}}>
            {!loading ? <>
            <InformationModal currencyCode={currencyCode} />
            <Col
                // span={7}
                style={{
                    ...styleCentered,
                    textAlign: 'right',
                    'flexGrow':'0',
                    width:'160px'
                }}
            >
                <Row className="ArrowHomeIndicators arrow-center-values">
                    <Col
                        span={8}
                        style={{
                            ...styleCentered,
                            justifyContent: 'flex-start'
                        }}
                    >
                        <img
                            height={45}
                            src={auth.urlBaseFull+`icon-${tokenName}.svg` }
                            alt="icon-wallet"
                        />
                    </Col>
                    <Col
                        span={16}
                        style={{
                            ...styleCentered,
                            justifyContent: 'flex-end',
                            textAlign: 'right'
                        }}
                    >
                        <span className={`Number ${AppProject}-${tokenName}`}> {/* style={{ color }}> */}
                        <LargeNumber amount={balance} currencyCode={currencyCode} />
                        </span>
                    </Col>
                </Row>
            </Col>
            <Col
                // span={14}
                style={{
                    ...styleCentered,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'right'
                    ,'flexGrow':'1'
                }}
            >
                <div className="Numbers Left">
                    <Tooltip placement="top" title={userBalance.collateral_tooltip}>
                        <div className="Number Few">
                            {userBalance.collateral}{' '}
                            {/*{labelCoin}*/}
                            {getCoinName('RESERVE')}
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={userBalance.usd_tooltip}>
                        <div className="Number Few">{userBalance.usd} USD</div>
                    </Tooltip>
                </div>
            </Col>
            <Col
                // span={3}
                style={{
                    ...styleCentered,
                    justifyContent: 'flex-end'
                }}
            >
                <Button
                    className="ArrowButton"
                    type="primary"
                    shape="circle"
                    onClick={() => navigate(page)}
                    icon={<ArrowRightOutlined
                    />}
                />
            </Col></>:
                <Skeleton active={true}  paragraph={{ rows: 2 }}></Skeleton>
            }
        </Row>
    );
}
