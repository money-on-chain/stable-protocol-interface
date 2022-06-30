import React, { useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import moment from "moment";
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";
import { Skeleton } from 'antd';

function NextSettlement() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;
    const [daysHours, setDaysHours] = useState(null);
    const [crono, setCrono] = useState(2);
    const [t, i18n] = useTranslation(["global", 'moc']);

    const decimaltoHour = (dayBlockSpan, blocksToSettlement) => {
        const result = {};
        const num = ((blocksToSettlement * 24) / dayBlockSpan);
        const minutos = num * 60;
        const segundos = minutos * 60;
        var seconds = Number(segundos);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " days " : " days ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        result.time = 'In ' + dDisplay + hDisplay;
        const today = moment().add(d, 'd').add(h, 'h').add(m, 'm').add(s, 's');
        result.date = moment(today).format('MMMM Do YYYY,');
        result.date_time = moment(today).format('h:mm:ss a');
        return result;
    };

    const getDatas = getDatasMetrics(auth)

    const [blocksToSettlement, setBlocksToSettlement] = useState(getDatas['blocksToSettlement']);
    const [blockHeight, setBlockHeight] = useState(getDatas['blockHeight']);
    const [settlementBlock, setSettlementBlock] = useState(Number(getDatas['blockHeight']) + Number(getDatas['blocksToSettlement']));
    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    useEffect(() => {
        setTimeout(function () {
            if (auth.contractStatusData) {
                setDaysHours(decimaltoHour(auth.contractStatusData.dayBlockSpan, auth.contractStatusData.blocksToSettlement));
                setCrono(30000)
                setBlocksToSettlement(getDatasMetrics(auth)['blocksToSettlement'])
                setBlockHeight(getDatasMetrics(auth)['blockHeight'])
                setSettlementBlock(Number(getDatasMetrics(auth)['blockHeight']) + Number(getDatasMetrics(auth)['blocksToSettlement']))
            }
        }, crono);
    }, [auth, daysHours]);

    useEffect(() => {
        setBlocksToSettlement(getDatasMetrics(auth)['blocksToSettlement'])
    }, [getDatas['blocksToSettlement']]);

    useEffect(() => {
        setBlockHeight(getDatasMetrics(auth)['blockHeight'])
    }, [getDatas['blockHeight']]);

    useEffect(() => {
        setSettlementBlock(Number(getDatasMetrics(auth)['blockHeight']) + Number(getDatasMetrics(auth)['blocksToSettlement']))
    }, [getDatas['blockHeight'], getDatas['blocksToSettlement']]);


    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                {t('MoC.metrics.Settlement.title', { ns: 'moc' })}
            </h3>
            {/*<h2>{position}</h2>*/}

            <div className="CardMetricContent">
               {!loading 
                ? <>
                    <div>
                        <h3>{t('MoC.metrics.Settlement.date', { ns: 'moc' })}</h3>
                        {daysHours?.date} <br /> {daysHours?.date_time}
                        <h3>{t('MoC.metrics.Settlement.remainingDaysTitle', { ns: 'moc' })}</h3>
                        {daysHours?.time}
                        <h3>{t('MoC.metrics.Settlement.lastUpdateHeight', { ns: 'moc' })}</h3>
                        {blockHeight}
                    </div>
                    <div className="separator" /><div>
                        {/*<h3>Blocks to <br /> settlement</h3>*/}
                        <h3>{t('MoC.metrics.Settlement.blocksToSettlement', { ns: 'moc' })}</h3>
                        {blocksToSettlement}
                        {/*<h3>Settlement will <br /> happen on block</h3>*/}
                        <h3>{t('MoC.metrics.Settlement.blockSettlement', { ns: 'moc' })}</h3>
                        {settlementBlock}
                    </div></>
            : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default NextSettlement;
