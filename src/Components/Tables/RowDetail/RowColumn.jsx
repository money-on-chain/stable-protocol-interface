
import React from 'react';
import { useTranslation } from "react-i18next";
import { config } from '../../../Config/config';


function RowColumn(props) {
    const [t, i18n] = useTranslation(["global", 'moc']);

    return (

        <table>
            <tbody>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.event', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.event}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.created', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.created}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.detail', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.details}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.asset', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.asset}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.confirmation', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.confirmation}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.address', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.address}
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.platform', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span className="display-inline " style={{"text-align": "left;"}}>{props.detail.platform}</span>
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.platform_fee', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.platform_fee}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.block', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.block}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.wallet', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.wallet}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.interests', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.interests}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.tx', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    <a className="ant-descriptions-a" href={`${config.explorerUrl}/tx/${props.detail.tx_hash}`} target="_blank">
                        <span>{props.detail.tx_hash_truncate}         </span>
                    </a>
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.leverage', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.leverage}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.gas', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.gas_fee}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t('MoC.operations.columns_detailed.reserve_price', { ns: 'moc' })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.price}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">Comments</th>
                <td className="ant-descriptions-item-content" colSpan="1">--</td>
            </tr>
            </tbody>
        </table>

    )
}


export default RowColumn












