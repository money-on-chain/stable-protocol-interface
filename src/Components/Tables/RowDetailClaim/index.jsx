
import React from 'react';
import { useTranslation } from "react-i18next";
import { config } from '../../../Config/config';

function RowDetail(props) {

    const [t, i18n] = useTranslation(["global", 'moc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;

    return (

        <table>
            <tbody>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.event`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.event}     </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.created`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.created}</td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.gas`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        <div>{props.detail.gas_fee} </div>
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.asset`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.asset}    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.confirmation`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">{props.detail.confirmation}   </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.txRequest`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        <a className="ant-descriptions-a" href={`${config.environment.explorerUrl}/tx/${props.detail.hash}`} target="_blank">
                            <span>{props.detail.truncate_hash}</span>
                        </a>
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.amount`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.amount}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.gasCost`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content" colSpan="1">
                        {props.detail.gas_cost}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.txSent`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        <a className="ant-descriptions-a" href={`${config.environment.explorerUrl}/tx/${props.detail.sent_hash}`} target="_blank">
                            <span>{props.detail.truncate_sent_hash}</span>
                        </a>
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.detail`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.detail}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.address`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1"><span>{props.detail.address}    </span></td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.status`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.status}
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.block`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1"><span>{props.detail.block}      </span></td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.transaction`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.transaction}
                    </td>
                    <th className="ant-descriptions-item-label-th ant-descriptions-border-bottom" colSpan="1">{t(`${AppProject}.operations.columns_detailed.mocPrice`, { ns: ns })}</th>
                    <td className="ant-descriptions-item-content ant-descriptions-border-bottom" colSpan="1">
                        {props.detail.moc_price}
                    </td>
                </tr>
            </tbody>
        </table>

    )
}


export default RowDetail













