import {Row, Col, Tooltip, Skeleton} from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import { LargeNumber } from '../../LargeNumber';
import { useTranslation } from "react-i18next";
import BalanceItem from '../../BalanceItem/BalanceItem';
import InformationModal from '../../Modals/InformationModal';
import { config } from './../../../Config/config';
import { getUserBalance } from "../../../Helpers/balances";

import { ReactComponent as LogoIconReserve } from './../../../assets/icons/icon-reserve.svg';
import { ReactComponent as LogoIconTP } from './../../../assets/icons/icon-tp.svg';
import { ReactComponent as LogoIconTC } from './../../../assets/icons/icon-tc.svg';
import { ReactComponent as LogoIconTX } from './../../../assets/icons/icon-tx.svg';
import { ReactComponent as LogoIconTG } from './../../../assets/icons/icon-tg.svg';
import { ReactComponent as LogoIconRBTC } from './../../../assets/icons/icon-tg.svg';

const amountCardLogos = {
    RESERVE: <LogoIconReserve width="56" />,
    TP: <LogoIconTP width="56" alt="icon-wallet" />,
    TC: <LogoIconTC width="56" alt="icon-wallet" />,
    TX: <LogoIconTX width="56" alt="icon-wallet" />,
    TG: <LogoIconTG width="56" alt="icon-wallet" />,
    RBTC: <LogoIconRBTC width="56" alt="icon-wallet" />
}

export default function AmountCard(props) {

    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;
    const auth = useContext(AuthenticateContext);
    const [loading, setLoading] = useState(true);
    const timeSke= 2500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth.userBalanceData]);
    if (!auth) return null;
    const {
        tokenName = '',
        color = '',
        titleName = '' } = props;

    const userBalance = getUserBalance(auth, i18n, tokenName);

    const pre_label = t(`${AppProject}.Tokens_${tokenName.toUpperCase()}_name`, { ns: ns })

    const logoIcon = amountCardLogos[tokenName.toUpperCase()]

    return (
        <Fragment>
            <div className="Card CardAmount">
                {!loading ? <>
                <Row>
                    <Col span={22}>
                        <h3 className="CardTitle">{t("global.TokenSummary_Amount", { ns: 'global', tokenName: pre_label })}</h3>
                    </Col>
                    <Col span={2}>
                        <InformationModal currencyCode={tokenName} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {logoIcon}
                    </Col>
                </Row>
                <Row className="tokenAndBalance">
                    <div className="priceContainer">
                        <Tooltip title={userBalance.normal_tooltip}>
                            <div className={`Number ${auth.getAppMode}-${tokenName}`}>
                            <LargeNumber {...{ amount: userBalance.raw.normal, currencyCode: tokenName }} />
                            </div>
                        </Tooltip>
                        <div className="WalletCurrencyPrice">
                            <BalanceItem
                                amount={userBalance.raw.collateral}
                                currencyCode="RESERVE" />
                            <BalanceItem
                                amount={userBalance.raw.usd}
                                currencyCode="USD" />
                        </div>
                    </div>

                </Row></>:
                    <Skeleton active={true}  paragraph={{ rows: 4 }}></Skeleton>
                }
            </div>
        </Fragment>
    )
}