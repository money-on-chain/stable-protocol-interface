
import React, {Fragment, useState} from 'react';
import { useContext } from 'react'
import {AuthenticateContext} from "../../../Context/Auth";
import Web3 from 'web3'
const BigNumber = require('bignumber.js');



function RowDetail(props) {

    const auth = useContext(AuthenticateContext);

    return (

        <table>
            <tbody>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Event</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.event}     </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Created</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.created} </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Detail</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                    <div>{props.detail.details} </div>
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Asset</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.asset}    </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Confirmation</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.confirmation}   </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Address</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.address}  </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Platform</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                    {props.detail.platform}
                </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Platform Fee</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    {props.detail.platform_fee}
                </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Block Nº</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.block}     </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Wallet</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                    {props.detail.wallet}
                </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Interests</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1"><span>{props.detail.interests}    </span></td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">TX Hash</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                    <a className="ant-descriptions-a" href={'https://explorer.testnet.rsk.co/tx/'+props.detail.tx_hash} target="_blank">
                        <span>{props.detail.tx_hash_truncate}         </span>
                    </a>
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Leverage</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1"><span>{props.detail.leverage}      </span></td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Gas Fee</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                    {props.detail.gas_fee}
                </td>
                <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">Reserve Price</th>
                <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                    {props.detail.price}
                </td>
            </tr>
            </tbody>
        </table>

    )
}


export default RowDetail













