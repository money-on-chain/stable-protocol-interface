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
import {getCoinName, setToLocaleString} from "../../../Helpers/helper";
import { config } from "../../../Config/config";

import { userDocBalance, userBproBalance, userBtcxBalance } from "../../../Helpers/balances";


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

    const getUserBalance = () => {

        let result = {
            'normal': (0).toFixed(6),
            'usd': (0).toFixed(6),
            'usd_tooltip': (0).toFixed(12),
            'collateral': (0).toFixed(6),
            'collateral_tooltip': (0).toFixed(12)
        }
        if (auth.userBalanceData && auth.contractStatusData) {
            let rDecimals;
            let notFormatted;
            switch (tokenName) {
                case 'stable':
                    rDecimals = parseInt(config.environment.tokens.STABLE.decimals);
                    notFormatted = userDocBalance(auth);
                    break;
                case 'riskpro':
                    rDecimals = parseInt(config.environment.tokens.RISKPRO.decimals);
                    notFormatted = userBproBalance(auth);
                    break;
                case 'riskprox':
                    rDecimals = parseInt(config.environment.tokens.RISKPROX.decimals);
                    notFormatted = userBtcxBalance(auth);
                    break;
                default:
                    throw new Error('Invalid token name');
            }

            result = {
                'normal': setToLocaleString(notFormatted.normal.toFixed(rDecimals), rDecimals, i18n),
                'usd': setToLocaleString(notFormatted.usd.toFixed(rDecimals), rDecimals, i18n),
                'usd_tooltip': setToLocaleString(notFormatted.usd.toFixed(12), 12, i18n),
                'collateral': setToLocaleString(notFormatted.collateral.toFixed(rDecimals), rDecimals, i18n),
                'collateral_tooltip': setToLocaleString(notFormatted.collateral.toFixed(12), 12, i18n),
            }
        }
        return result;
    };
    
    const [loading, setLoading] = useState(true);
    const timeSke= 1500
    const AppProject = config.environment.AppProject;

    const userBalance = getUserBalance();

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
