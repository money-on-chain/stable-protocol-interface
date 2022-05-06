import React, {useContext, useEffect, useState} from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import moment from "moment";
import {getDatasMetrics} from '../../../../Helpers/helper'

function NextSettlement() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;
    const [daysHours, setDaysHours] = useState(null);

    const decimaltoHour = (dayBlockSpan, blocksToSettlement) => {
        const result = {};
        const num = ((blocksToSettlement * 24) / dayBlockSpan);
        const minutos = num * 60;
        const segundos = minutos * 60;
        var seconds = Number(segundos);
        var d =Math.floor(seconds /(3600*24));
        var h =Math.floor(seconds %(3600*24)/3600);
        var m =Math.floor(seconds %3600/60);
        var s =Math.floor(seconds %60);
        var dDisplay = d >0? d +(d ==1?" days ":" days "):"";
        var hDisplay = h >0? h +(h ==1?" hour ":" hours "):"";
        var mDisplay = m >0? m +(m ==1?" minute ":" minutes "):"";
        var sDisplay = s >0? s +(s ==1?" second":" seconds"):"";
        result.time = 'In '+dDisplay + hDisplay;
        const today = moment().add(d, 'd').add(h, 'h').add(m, 'm').add(s, 's');
        result.date = moment(today).format('MMMM Do YYYY,');
        result.date_time = moment(today).format('h:mm:ss a');
        return result;
    };

    useEffect(() => {
        if (auth.userBalanceData) {
            setDaysHours(decimaltoHour(auth.contractStatusData.dayBlockSpan, auth.contractStatusData.blocksToSettlement));
        }
    }, [auth]);

    const getDatas= getDatasMetrics(auth)

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                Next Settlement
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>Date</h3>
                    {daysHours?.date} <br/> {daysHours?.date_time}
                    <h3>Remaining days</h3>
                    {daysHours?.time}
                    <h3>Current indexed block</h3>
                    2802457
                </div>
                <div className="separator" />
                <div>
                    <h3>Blocks to <br/> settlement</h3>
                    {getDatas['blocksToSettlement']}
                    <h3>Settlement will <br/> happen on block</h3>
                    2803398
                </div>
            </div>
        </div>
    );
}

export default NextSettlement;
