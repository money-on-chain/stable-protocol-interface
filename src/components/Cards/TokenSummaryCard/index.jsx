import { ArrowRightOutlined } from '@ant-design/icons';
import {Row, Col, Tooltip, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import { useContext } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { AuthenticateContext } from '../../../context/Auth';
import { LargeNumber } from "../../LargeNumber";
import InformationModal from '../../Modals/InformationModal';
import {getCoinName} from "../../../helpers/helper";
import { config } from "../../../projects/config";
import { useProjectTranslation } from '../../../helpers/translations';
import { getUserBalance } from "../../../helpers/balances";

import { ReactComponent as LogoIconReserve } from './../../../assets/icons/icon-reserve.svg';
import { ReactComponent as LogoIconTP } from './../../../assets/icons/icon-tp.svg';
import { ReactComponent as LogoIconTC } from './../../../assets/icons/icon-tc.svg';
import { ReactComponent as LogoIconTX } from './../../../assets/icons/icon-tx.svg';
import { ReactComponent as LogoIconTG } from './../../../assets/icons/icon-tg.svg';
import { ReactComponent as LogoIconRBTC } from './../../../assets/icons/icon-tg.svg';


const amountCardLogos = {
    RESERVE: <LogoIconReserve width="45" height="45" alt="RESERVE" />,
    TP: <LogoIconTP width="45" height="45" alt="TP" />,
    TC: <LogoIconTC width="45" height="45" alt="TC" />,
    TX: <LogoIconTX width="45" height="45" alt="TX" />,
    TG: <LogoIconTG width="45" height="45" alt="TG" />,
    RBTC: <LogoIconRBTC width="45" height="45" alt="COINBASE" />
}

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
    const [t, i18n, ns] = useProjectTranslation();

    const [loading, setLoading] = useState(true);
    const timeSke= 1500
    const AppProject = config.environment.AppProject;

    const userBalance = getUserBalance(auth, i18n, tokenName);

    const logoIcon = amountCardLogos[tokenName.toUpperCase()]

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    },[auth]);

    return (
        <div className="Card TokenSummaryCard" style={{'height':'135px','display':'flex'}}>
            {!loading ? <>
            <InformationModal currencyCode={currencyCode} />
            <div
                // span={7}
                style={{
                    display: 'flex',
                    width:'210px'
                }}
            >
                <div className="" style={{display: 'flex'}}>
                    <div
                        style={{
                            display: 'flex',
                            'place-items': 'center'
                        }}
                    >
                        {logoIcon}
                    </div>
                    <div style={{
                            textAlign: 'right',
                            width: '200px',
                            display: 'flex',
                            'align-items': 'center'
                        }}
                    >
                        <span className={`Number ${AppProject}-${tokenName}`} style={{
                            'text-align': 'right',
                            'width': '100%'}} > {/* style={{ color }}> */}
                            <LargeNumber amount={balance} currencyCode={currencyCode} />
                        </span>
                    </div>
                </div>
            </div>
            <div
                // span={14}
                style={{
                    ...styleCentered,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'right'
                    ,'flexGrow':'1'
                }}
            >
                <div className="Numbers Right">
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
            </div>
            <div
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
                    icon={<ArrowRightOutlined />}
                />
            </div></>:
                <Skeleton active={true}  paragraph={{ rows: 2 }}></Skeleton>
            }
        </div>
    );
}
