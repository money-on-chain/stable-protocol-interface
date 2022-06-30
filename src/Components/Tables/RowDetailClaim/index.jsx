
import React, { Fragment, useState } from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from "../../../Context/Auth";
import { useTranslation } from "react-i18next";
import Web3 from 'web3'
const BigNumber = require('bignumber.js');



function RowDetail(props) {

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);

    return (

        <table>
            <tbody>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.event', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.event}     </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.created', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.created}</td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.gas', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        <div>{props.detail.gas_fee} </div>
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.asset', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.asset}    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.confirmation', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.confirmation}   </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.txRequest', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        <a className="ant-descriptions-a" href={'https://explorer.testnet.rsk.co/tx/' + props.detail.hash} target="_blank">
                            <span>{props.detail.truncate_hash}</span>
                        </a>
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.amount', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.amount}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.gasCost', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content" colSpan="1">
                        {props.detail.gas_cost}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.txSent', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.sent_hash}     </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.detail', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.detail}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.address', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1"><span>{props.detail.address}    </span></td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.status', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.status}
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.block', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1"><span>{props.detail.block}      </span></td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.transaction', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.transaction}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t('MoC.operations.columns_detailed.mocPrice', { ns: 'moc' })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.moc_price}
                    </td>
                </tr>
            </tbody>
        </table>

    )
}


export default RowDetail













