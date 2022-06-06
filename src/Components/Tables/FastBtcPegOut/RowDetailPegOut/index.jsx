import './../style.scss';
import React, { Fragment, useState } from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import Web3 from 'web3'
const BigNumber = require('bignumber.js');



function RowDetailPegOut(props) {

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);

    return (
        <table className={'table-in'}>
            <tbody>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">Tx Hash</th>
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
                <th className="ant-descriptions-item-label__" colSpan="1">Transfer ID</th>
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
                <th className="ant-descriptions-item-label__" colSpan="1">Amount BTC</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.btcAmount}</td>
                <th className="ant-descriptions-item-label__" colSpan="1">Fee BTC</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.btcFee}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">BTC Address</th>
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
                <th className="ant-descriptions-item-label__" colSpan="1">Block Nº</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.blockNumber}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">RSK Address</th>
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
                <th className="ant-descriptions-item-label__" colSpan="1">Status</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    <span className="___status-confirmed">{props.detail.status}</span>
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
                <th className="ant-descriptions-item-label__" colSpan="1">TX Last Updated</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {/*<span className="RenderTxHash">*/}
                    {/*    <div className="CopyableText ">*/}
                    {/*        <div>*/}
                    {/*            <img src="https://static.moneyonchain.com/moc-alphatestnet/public/images/copy.svg" className="CopyIcon"/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <button type="button" className="ant-btn ant-btn-link ant-btn-sm"><span></span></button></span>*/}
                    --
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label__" colSpan="1">Date Added</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.timestamp}</td>
                <th className="ant-descriptions-item-label__" colSpan="1">Date Last Updated</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.date}</td>
            </tr>
            </tbody>
        </table>
    )
}


export default RowDetailPegOut













