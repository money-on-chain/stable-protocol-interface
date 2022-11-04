import React, {Fragment, useEffect, useState} from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from "../../../Context/Auth";
import { useTranslation } from "react-i18next";
import {Skeleton, Tooltip} from 'antd';
//import { InfoCircleOutlined } from '@ant-design/icons';
import InformationModal from '../../Modals/InformationModal';
import BalanceItemCard from "../BalanceItemCard/BalanceItemCard";
//import BigNumber from "bignumber.js";

function MocAmount() {

    const auth = useContext(AuthenticateContext);

    const set_moc_balance_usd = () => {
        if (auth.userBalanceData) {
            return auth.userBalanceData['mocBalance']
        } else {
            return (0).toFixed(2)
        }
    };
    const [t, i18n] = useTranslation(["global", 'moc'])
    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    return (
        <div className="ContainerMocAmountDatas height-auto">
            <div className="Card RewardsBalanceAmount withPadding hasTitle ">
                    {!loading ? <>
                        <div className="title">
                            <h1>{t("global.RewardsBalance_MocAmount", {ns: 'global'})}</h1>
                            <InformationModal currencyCode={'TG'}/>
                        </div>
                        <div className="LogoAndAmount">
                            <img className="MocLogo" srcSet={process.env.REACT_APP_PUBLIC_URL + "img/icon-tg.svg"}/>
                            <div className="TotalAmountContainer">
                                <h2>{t("global.RewardsBalance_MocsTokens", {ns: 'global'})}</h2>
                                <div className="BalanceItemCard TotalAmount">
                                    <h4>
                                        <BalanceItemCard theme="TotalAmount" amount={set_moc_balance_usd()}
                                                         currencyCode="TG"/>
                                    </h4>
                                </div>
                            </div>
                        </div> </>:
                        <Skeleton active={true}  paragraph={{ rows: 2 }}></Skeleton>
                    }
            </div>
        </div>
    )
}


export default MocAmount