import React, {useContext, useEffect} from 'react';
import 'antd/dist/antd.css';
import './style.scss';
import {Table, Progress, Result, Tooltip, Skeleton} from 'antd';
import RowDetail from "../RowDetail";
import classnames from 'classnames';
import api from '../../../services/api';
import Moment from 'react-moment';
import { useState } from 'react'
import {readJsonTable, setNumber, myParseDate, getDatasMetrics} from '../../../Helpers/helper'
import {config} from '../../../Config/config';
import Copy from "../../Page/Copy";
import { useTranslation } from "react-i18next";
import date from '../../../Config/date';
import {AuthenticateContext} from "../../../Context/Auth";
import {InfoCircleOutlined} from "@ant-design/icons";
import {DownCircleOutlined, UpCircleOutlined} from "@ant-design/icons";
import { LargeNumber } from '../../LargeNumber';


export default function ListOperations(props) {
    const { token } = props;
    const [current, setCurrent] = useState(1);
    const [bordered, setBordered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ position: 'bottom' });
    const [size, setSize] = useState('default');
    const [expandable, setExpandable] = useState({ expandedRowRender: record => <p>{record.description}</p> });

    const [title, setTitle] = useState(undefined);
    const [showHeader, setShowHeader] = useState(true);
    const [hasData, setHasData] = useState(true);
    const [tableLayout, setTableLayout] = useState(undefined);
    const [top, setTop] = useState('none');
    const [bottom, setBottom] = useState('bottomRight');
    const [yScroll, setYScroll] = useState(undefined);
    const [xScroll, setXScroll] = useState(undefined);

    const [t, i18n] = useTranslation(["global", 'moc']);
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const [currencyCode, setCurrencyCode]=  useState('MOC');
    const [dataJson, setDataJson]=  useState([]);
    const [callTable, setCallTable]=  useState(false);
    const [totalTable, setTotalTable]=  useState(0);
    const [currentHash, setCurrentHash] = useState(true);

    const [loadingSke, setLoadingSke] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);


    // window.renderTable('load', () => {
    //     transactionsList(1)
    // });

    window["renderTable"] = function() {transactionsList(1)}



        const transactionsList= (skip,call_table) => {
        if(auth.isLoggedIn){
            const datas= (token!='all')?{address: accountData.Owner,limit:20,skip:(((skip-1)+(skip-1))*10),token:token} : {address: accountData.Owner,limit:20,skip:(((skip-1)+(skip-1))*10)}
            setTimeout(() => {
                try {
                    api('get', `${config.api.operations}`+'webapp/transactions/list/', datas)
                        .then(response => {
                            setDataJson(response);
                            console.log(response);
                            setTotalTable(response.total)
                            if(call_table){
                                setCallTable(call_table)
                            }
                        })
                        .catch((response) => {
                            console.log(response);
                            if(call_table){
                                setCallTable(call_table)
                            }
                        });
                } catch (error) {
                    console.error({ error });
                    console.log(error);
                }
            }, 500);
        }
    };



    const columns = [
        {
            title: '',
            dataIndex: 'info',
        },

        {
            title: t('MoC.operations.columns.event', { ns: 'moc' }),
            dataIndex: 'event',
        },
        {
            title: t('MoC.operations.columns.type', { ns: 'moc' }),
            dataIndex: 'asset',
        },
        {
            title: t('MoC.operations.columns.amount', { ns: 'moc' }),
            dataIndex: 'platform',
        },
        {
            title: t('MoC.operations.columns.totalBtc', { ns: 'moc' }),
            dataIndex: 'wallet',
        },
        {
            title: t('MoC.operations.columns.date', { ns: 'moc' }),
            dataIndex: 'date',
        },
        {
            title: t('MoC.operations.columns.status', { ns: 'moc' }),
            dataIndex: 'status',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (accountData.Owner) {
                transactionsList(current)
            }
        }, 30000);
        return () => clearInterval(interval);
    },[accountData.Owner]);

    useEffect(() => {
        if (accountData.Owner) {
            transactionsList(current)
        }
    },[accountData.Owner]);

    var data = [];

    const onChange = (page) => {
        if( accountData!== undefined ){
            setCurrent(page);
            data_row(page);
            transactionsList(page,true)
        }
    };

    const data_row_coins2 = [];
    var json_end = []
    const data_row = () => {
        /*******************************sort descending by date lastUpdatedAt***********************************/
        if(dataJson.transactions!==undefined){
            dataJson.transactions.sort((a, b) => {
                return myParseDate(b.lastUpdatedAt) - myParseDate(a.lastUpdatedAt)
            });
        }
        /*******************************end sort descending by date lastUpdatedAt***********************************/

        /*******************************filter by type (token)***********************************/
        var pre_datas = [];
        if(dataJson.transactions!==undefined){
            pre_datas= dataJson.transactions.filter(data_j => {
                return (token !== 'all') ? data_j.tokenInvolved === token : true;
            });
        }
        /*******************************end filter by type (token)***********************************/

        /*******************************set json group according to limits***********************************/
        json_end = pre_datas
        /*******************************end set json group according to limits***********************************/

        /*******************************extraer datos del json con el json seteado por limit y skip***********************************/
        data = [];

        json_end.forEach((data_j) => {
            const datas_response = readJsonTable(data_j,t,i18n)

            const detail = {
                event:  datas_response['address'] === config.transfer[0].address ? config.transfer[0].title : datas_response['set_event']
                , created: <span><Moment format={(i18n.language === "en") ? date.DATE_EN : date.DATE_ES}>{datas_response['lastUpdatedAt']}</Moment></span>
                , details: datas_response['RBTCAmount']
                , asset: datas_response['set_asset']
                , confirmation: datas_response['confirmationTime'] ? (true) ? <span><Moment format={(i18n.language === "en") ? date.DATE_EN : date.DATE_ES}>{datas_response['confirmationTime']}</Moment></span> : <span><Moment format="YYYY-MM-DD HH:MM:SS">{datas_response['confirmationTime']}</Moment></span> : ''
                , address: (datas_response['address']!='--')? <Copy textToShow={datas_response['truncate_address']} textToCopy={datas_response['address']} /> : '--'
                , platform: datas_response['amount']
                , platform_fee: datas_response['platform_fee_value']
                , block: datas_response['blockNumber']
                , wallet: datas_response['wallet_value']
                , interests: datas_response['interests']
                , tx_hash_truncate: datas_response['tx_hash_truncate']
                , tx_hash: datas_response['tx_hash']
                , leverage: datas_response['leverage']
                , gas_fee: datas_response['gas_fee']
                , price: datas_response['price']
                , comments: '--'
            };

            data_row_coins2.push({
                key: data_j._id,
                info: '',
                event: datas_response['address'] === config.transfer[0].address ? config.transfer[0].title : datas_response['set_event'],
                asset: datas_response['set_asset'],
                // platform: `+ ${datas_response['paltform_detail']}`,
                // platform: formatVisibleValue(
                //     datas_response['paltform_detail'],
                //     'STABLE',
                //     'es'
                // ),
                platform: datas_response['paltform_detail'],
                // platform: (data_j.amount!==undefined)? <LargeNumber amount={datas_response['paltform_detail']} {...{ currencyCode }} /> : '--',
                // wallet: (data_j.RBTCAmount!==undefined)? `${wallet_detail} RBTC`:'--',
                wallet: datas_response['wallet_value_main'],
                date: datas_response['lastUpdatedAt'],
                status: { txt: datas_response['set_status_txt'], percent: datas_response['set_status_percent'] },
                detail: detail,
            });

        });
        data_row_coins2.forEach((element, index) => {
            const asset = [];

            switch (element.asset) {
                case 'STABLE':
                    asset.push({ 'image': 'icon-stable.svg', 'color': 'color-token-stable', 'txt': 'DOC' });
                    data_row_coins2[index].detail.asset = t('MoC.Tokens_STABLE_code', { ns: 'moc' });
                    break;
                case 'RISKPRO':
                    asset.push({ 'image': 'icon-riskpro.svg', 'color': 'color-token-riskpro', 'txt': 'BPRO' });
                    data_row_coins2[index].detail.asset = t('MoC.Tokens_RISKPRO_code', { ns: 'moc' });
                    break;
                case 'RISKPROX':
                    asset.push({ 'image': 'icon-riskprox.svg', 'color': 'color-token-riskprox', 'txt': 'BTCX' });
                    data_row_coins2[index].detail.asset = t('MoC.Tokens_RISKPROX_code', { ns: 'moc' });
                    break;
                default:
                    asset.push({ 'image': 'icon-stable.svg', 'color': 'color-token-stable', 'txt': 'DOC' });
                    data_row_coins2[index].detail.asset = t('MoC.Tokens_STABLE_code', { ns: 'moc' });
                    break;
            }

            data.push({
                key: element.key,
                info: '',
                event: <span className={classnames('event-action', asset[0].color)}>{element.event}</span>,
                asset: <img className="uk-preserve-width uk-border-circle" src={process.env.PUBLIC_URL + "/Moc/" + asset[0].image} alt="avatar" width={32} />,
                // platform: <span className="display-inline CurrencyTx">{element.platform} {asset[0].txt}</span>,
                platform: <span className="display-inline CurrencyTx">{element.platform}</span>,
                wallet: <span className="display-inline ">{element.wallet} </span>,
                date: <span>{element.date}</span>,
                status: <div style={{ width: '100%' }}><Progress percent={element.status.percent} /><br /><span
                    className={element.status.txt === 'confirmed' ? 'color-confirmed conf_title' : 'color-confirming conf_title'}>{element.status.txt}</span></div>,
                description: <RowDetail detail={element.detail} />,
            });

        })
        /*******************************end extraer datos del json con el json seteado por limit y skip***********************************/
    }

    data_row(current)

    //const { xScroll, yScroll, ...state } = this.state;

    const scroll = {};
    if (yScroll) {
        scroll.y = 240;
    }
    if (xScroll) {
        scroll.x = '100vw';
    }

    const tableColumns = columns.map(item => ({ ...item }));

    if (xScroll === 'fixed') {
        tableColumns[0].fixed = true;
        tableColumns[tableColumns.length - 1].fixed = 'right';
    }

    const state = {
        bordered,
        loading,
        pagination,
        size,
        expandable,
        title,
        showHeader,
        scroll,
        hasData,
        tableLayout,
        top,
        bottom,
        yScroll,
        xScroll,
    }

    useEffect(() => {
        setTimeout(() => setLoadingSke(false), timeSke)
    },[auth]);

    return (
        <>
            <div className="title">
                <h1>{t('MoC.operations.title', { ns: 'moc' })}</h1>
                <Tooltip color={'#404040'} placement="topLeft" title={t("MoC.operations.tooltip.text", { ns: 'moc' })} className='Tooltip'>
                    <InfoCircleOutlined className="Icon" />
                </Tooltip>
            </div>
            {!loadingSke ? <>
            <Table
                {...state}
                expandable={{
                    expandedRowRender: record => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                            <UpCircleOutlined onClick={e => onExpand(record, e)} />
                        ) : (
                            <DownCircleOutlined onClick={e => onExpand(record, e)} />
                        )
                }}
                pagination={
                    {pageSize:20,
                        position: [top, bottom],
                        defaultCurrent: 1,
                        onChange:onChange ,
                        total: totalTable }
                }
                columns={tableColumns}
                dataSource={hasData ? (auth.isLoggedIn == true) ? data : null : null}
                scroll={scroll}
            /></>:
                <Skeleton active={true}  paragraph={{ rows: 4 }}></Skeleton>
            }
        </>
    );
}
