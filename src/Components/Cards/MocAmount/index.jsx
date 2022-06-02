import './style.scss'
import React, { Fragment } from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from "../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const BigNumber = require('bignumber.js');

function MocAmount() {

    const auth = useContext(AuthenticateContext);

    const set_moc_balance_usd = () =>{
        if ( auth.userBalanceData ) {
            return Number(new BigNumber(auth.userBalanceData['mocBalance']).c[0]/10000).toFixed(2)
        }else{
            return (0).toFixed(2)
        }
    };

    const [t, i18n] = useTranslation(["global", 'moc'])

    return (
        <div className="ContainerMocAmountDatas">
            <div className="Card RewardsBalanceAmount withPadding hasTitle padding-1-2">
                <div className="title">
                    <h1>{t("global.RewardsBalance_MocAmount", { ns: 'global' })}</h1>
                    <div>
                        <Tooltip placement="top" title={`${t("MoC.tokenInformationTooltip", { ns: 'moc' })} ${t("MoC.Tokens_MOC_name", { ns: 'moc' })}`} className='Tooltip' >
                            <InfoCircleOutlined className="Icon" />
                        </Tooltip>
                    </div>
                </div>
                {/*<div >*/}
                {/*    <span role="img" aria-label="info-circle" tabIndex="-1" className="anticon anticon-info-circle InfoIcon TooltipMoC">*/}
                {/*        <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="info-circle" width="1em"*/}
                {/*      height="1em" fill="currentColor" aria-hidden="true"><path*/}
                {/*    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path*/}
                {/*    d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path></svg></span>*/}
                {/*</div>*/}
                <div className="LogoAndAmount">
                    <img className="MocLogo" srcSet={`${window.location.origin}/Moc/icon-moc.svg`} />
                    <div className="TotalAmountContainer"><h2>{t("global.RewardsBalance_MocsTokens", { ns: 'global' })}</h2>
                        <div className="BalanceItemCard TotalAmount">
                            <h4>
                                <div><span className="" >{set_moc_balance_usd()}</span></div>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default MocAmount