import React, {Fragment, useEffect, useState} from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import Web3 from 'web3'
const BigNumber = require('bignumber.js');



function RowDetailPegOut(props) {

    async function loadAssets() {
        try {

                let css1= await import('./../'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);

    return (
        <table className={'table-in'}>
            <tbody>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1"> {t('MoC.fastbtc.history.columns_headers.txHash', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {/*<span className="RenderTxHash">*/}
                    {/*    <div className="CopyableText ">*/}
                    {/*        <div>*/}
                    {/*            <img src="https://static.moneyonchain.com/moc-alphatestnet/public/images/copy.svg" className="CopyIcon"/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <button type="button" className="ant-btn ant-btn-link ant-btn-sm"> <span>0xc97e...5e72ff</span></button>*/}
                    {/*</span>*/}
                    {props.detail.transactionHash}
                </td>
                <th className="ant-descriptions-item-label__" colSpan="1">{t('MoC.fastbtc.history.columns_headers.transferId', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {/*<span className="RenderTxHash">*/}
                    {/*<div className="CopyableText ">*/}
                    {/*    <div>*/}
                    {/*        <img src="https://static.moneyonchain.com/moc-alphatestnet/public/images/copy.svg" className="CopyIcon"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<button type="button" className="ant-btn ant-btn-link ant-btn-sm"><span>0x4689...66b94b</span></button></span>*/}
                    {props.detail.transId}
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">{t('MoC.fastbtc.history.columns_headers.btcAmount', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.btcAmount}</td>
                <th className="ant-descriptions-item-label__" colSpan="1"> {t('MoC.fastbtc.history.columns_headers.feebtc', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.btcFee}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">{t('MoC.fastbtc.history.columns_headers.btcadr', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {/*<span className="RenderTxHash">*/}
                    {/*<div className="CopyableText ">*/}
                    {/*    <div>*/}
                    {/*        <img src="https://static.moneyonchain.com/moc-alphatestnet/public/images/copy.svg" className="CopyIcon"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<button type="button" className="ant-btn ant-btn-link ant-btn-sm"><span>mpqWMK...oWH8mW</span></button></span>*/}
                    {props.detail.btcAddress}
                </td>
                <th className="ant-descriptions-item-label__" colSpan="1"> {t('MoC.fastbtc.history.columns_headers.blockN', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.blockNumber}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">{t('MoC.fastbtc.history.columns_headers.web3adr', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {/*<span className="RenderTxHash">*/}
                    {/*<div className="CopyableText ">*/}
                    {/*    <div>*/}
                    {/*        <img src="https://static.moneyonchain.com/moc-alphatestnet/public/images/copy.svg" className="CopyIcon"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<button type="button" className="ant-btn ant-btn-link ant-btn-sm"><span>0x371E...eae53E</span></button></span>*/}
                    {props.detail.rskAddress}
                </td>
                <th className="ant-descriptions-item-label__" colSpan="1">{t('MoC.fastbtc.history.columns_headers.status', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    <span className={props.detail.statusColor}>{props.detail.status}</span>
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">TX</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {/*<span className="RenderTxHash">*/}
                    {/*    <div className="CopyableText ">*/}
                    {/*        <div>*/}
                    {/*            <img src="https://static.moneyonchain.com/moc-alphatestnet/public/images/copy.svg" className="CopyIcon"/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <button type="button" className="ant-btn ant-btn-link ant-btn-sm"><span>0xc97e...5e72ff</span></button></span>*/}
                    {props.detail.transactionHash}
                </td>
                <th className="ant-descriptions-item-label__" colSpan="1"> {t('MoC.fastbtc.history.columns_headers.txLastUpdated', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {/*<span className="RenderTxHash">*/}
                    {/*    <div className="CopyableText ">*/}
                    {/*        <div>*/}
                    {/*            <img src="https://static.moneyonchain.com/moc-alphatestnet/public/images/copy.svg" className="CopyIcon"/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <button type="button" className="ant-btn ant-btn-link ant-btn-sm"><span></span></button></span>*/}
                    {props.detail.transactionHashLastUpdated}
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">{t('MoC.fastbtc.history.columns_headers.dateAdded', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.timestamp}</td>
                <th className="ant-descriptions-item-label__" colSpan="1">{t('MoC.fastbtc.history.columns_headers.dateLastUpdated', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.date}</td>
            </tr>
            </tbody>
        </table>
    )
}


export default RowDetailPegOut













