
import React from 'react';
import { useTranslation } from "react-i18next";
import { config } from '../../../Config/config';


function RowColumn(props) {
    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;
    
    return (

        <table>
            <tbody>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.event`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.event}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.created`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.created}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.detail`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.details}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.asset`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.asset}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.confirmation`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.confirmation}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.address`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.address}
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.platform`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span className="display-inline " style={{"text-align": "left;"}}>{props.detail.platform}</span>
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.platform_fee`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.platform_fee}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.block`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">{props.detail.block}</td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.wallet`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.wallet}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.interests`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.interests}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.tx`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1">
                    <a className="ant-descriptions-a" href={`${config.environment.explorerUrl}/tx/${props.detail.tx_hash}`} target="_blank">
                        <span>{props.detail.tx_hash_truncate}         </span>
                    </a>
                </td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.leverage`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.leverage}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.gas`, { ns: ns })}</th>
                <td className="ant-descriptions-item-content" colSpan="1"><span>{props.detail.gas_fee}</span></td>
            </tr>
            <tr className="ant-descriptions-row">
                <th className="ant-descriptions-item-label-th" colSpan="1">{t(`${AppProject}.operations.columns_detailed.reserve_price`, { ns: ns })}</th>
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













