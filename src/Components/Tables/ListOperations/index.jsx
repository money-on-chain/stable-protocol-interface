import React from 'react';
import 'antd/dist/antd.css';
import './style.scss';
import { Table, Progress, Result } from 'antd';
import RowDetail from "../RowDetail";
import classnames from 'classnames';
import api from '../../../services/api';
import data_json from '../../../services/webapp_transactions_list';
import Moment from 'react-moment';
import { useState } from 'react'
import Web3 from 'web3';
import { readJsonTable, setNumber } from '../../../Helpers/helper'
import config from '../../../Config/constants';
import Copy from "../../Page/Copy";
import { adjustPrecision, formatLocalMap } from "../../../Lib/Formats";
import Tooltip from 'antd/lib/tooltip';
import NumericLabel from 'react-pretty-numbers';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import { useTranslation } from "react-i18next";

export default function ListOperations(props) {
    const { token } = props;

    const [bordered, setBordered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ position: 'bottom' });
    const [size, setSize] = useState('default');
    const [expandable, setExpandable] = useState({ expandedRowRender: record => <p>{record.description}</p> });

    const [title, setTitle] = useState(undefined);
    const [showHeader, setShowHeader] = useState(true);
    //const [scroll, setScroll] = useState(undefined);
    const [hasData, setHasData] = useState(true);
    const [tableLayout, setTableLayout] = useState(undefined);
    const [top, setTop] = useState('none');
    const [bottom, setBottom] = useState('bottomRight');



    //const [ellipsis, setEllipsis] = useState()
    const [yScroll, setYScroll] = useState(undefined);
    const [xScroll, setXScroll] = useState(undefined);
    const BigNumber = require('bignumber.js');

    const [t, i18n] = useTranslation(["global", 'moc']);


    /*const handleToggle = prop => enable => {
      this.setState({ [prop]: enable });
    };*/

    const handleSizeChange = e => {
        setSize(e.target.value);
    };

    const handleTableLayoutChange = e => {
        setTableLayout(e.target.value);
    };

    const handleExpandChange = enable => {
        setExpandable(enable ? expandable : undefined);
    };

    /*const handleEllipsisChange = enable => {
      setEllipsis(enable);
    };*/

    const handleTitleChange = enable => {
        setTitle(enable ? title : undefined);
    };

    const handleHeaderChange = enable => {
        setShowHeader(enable ? showHeader : false);
    };

    const handleYScrollChange = enable => {
        setYScroll(enable);
    };

    const handleXScrollChange = e => {
        setXScroll(e.target.value);
    };

    const handleDataChange = hasData => {
        setHasData(hasData);
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

    // const detail = {event:'MINT',created:'2022-04-18 18:23:00'
    //     ,details:'You received in your platform 0.00 DOC'
    //     ,asset:'DOC'
    //     ,confirmation:'2022-04-18 18:30:00'
    //     ,address:'--'
    //     ,platform:'+0.00DOC ( 0.00 USD )'
    //     ,platform_fee:'0.00 MOC ( 0.00 USD )'
    //     ,block:'2767182'
    //     ,wallet:'0.000032 RBTC ( 1.29 USD )'
    //     ,interests:'--'
    //     ,tx_hash:'0x449d..9c13c8'
    //     ,leverage:'--'
    //     ,gas_fee:'0.000032 RBTC ( 1.29 USD )'
    //     ,price:'40,823.54 USD'
    //     ,comments:'--'
    // };

    var data = [];
    var set_current = 1;
    const setCurrent = (current) => {
        set_current = current
        // console.log("current: ",current);
        // console.log("set_current: ",set_current);
        // getDatasTable(set_current)
        data_row(set_current)
    };

    const data_row_coins2 = [];
    var set_index = 0
    var json_end = []
    const data_row = (set_current) => {

        /*******************************primero filtra por el tipo (token)***********************************/
        if (token != 'all') {
            var pre_datas = []
            data_json.transactions.map((data_j) => {
                if (data_j.tokenInvolved == token) {
                    pre_datas.push(data_j)
                }
            });
        } else {
            var pre_datas = []
            data_json.transactions.map((data_j) => {
                pre_datas.push(data_j)
            });
        }
        /*******************************end primero filtra por el tipo (token)***********************************/


        //data=[]
        while (data.length > 0) {
            data.pop();
        }
        // console.log("1212");
        // console.log(set_current);
        // console.log("1212");


        /*******************************setear el json para manejar limit y skip***********************************/
        const limit = 10;
        if (set_current == 1) {
            console.log("===========================11111111111111111111111111");
            console.log(set_current - 1);
            console.log((set_current + limit) - 1);
            // console.log(data);
            console.log("===========================11111111111111111111111111");
            json_end = pre_datas.slice(set_current - 1, (set_current + limit) - 1);
        }

        if (set_current > 1) {
            json_end = pre_datas.slice((set_current * 10) - 10, (set_current * 10));
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>11111111111111111111111111");
            console.log((set_current * 10) - 10);
            console.log((set_current * 10));
            // console.log(data);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>11111111111111111111111111");
        }
        /*******************************end setear el json para manejar limit y skip***********************************/

        /*******************************extraer datos del json con el json seteado por limit y skip***********************************/
        data = [];

        json_end.map((data_j, index) => {
            const datas_response = readJsonTable(data_j)

            if (datas_response['wallet_detail'] != '--' && datas_response['wallet_detail'] != 11) {
                const detail = {
                    event: datas_response['set_event']
                    , created: <span><Moment format="YYYY-MM-DD HH:MM:SS">{datas_response['lastUpdatedAt']}</Moment></span>
                    , details: datas_response['RBTCAmount']
                    , asset: datas_response['set_asset']
                    , confirmation: <span><Moment format="YYYY-MM-DD HH:MM:SS">{datas_response['confirmationTime']}</Moment></span>
                    , address: <Copy textToShow={datas_response['truncate_address']} textToCopy={datas_response['address']} />
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
                    event: datas_response['set_event'],
                    asset: datas_response['set_asset'],
                    platform: `+ ${datas_response['paltform_detail']}`,
                    // wallet: (data_j.RBTCAmount!==undefined)? `${wallet_detail} RBTC`:'--',
                    wallet: datas_response['wallet_value_main'],
                    date: datas_response['lastUpdatedAt'],
                    status: { txt: datas_response['set_status_txt'], percent: datas_response['set_status_percent'] },
                    detail: detail,
                });
            }
        });

        data_row_coins2.forEach((element, index) => {
            const asset = [];
            if (element.wallet != '--' && element.wallet != 11) {
                switch (element.asset) {
                    case 'STABLE':
                        asset.push({ 'image': 'icon-stable.svg', 'color': 'color-token-stable', 'txt': 'DOC' });
                        data_row_coins2[index].detail.asset = 'DOC';
                        break;
                    case 'RISKPRO':
                        asset.push({ 'image': 'icon-riskpro.svg', 'color': 'color-token-riskpro', 'txt': 'BPRO' });
                        data_row_coins2[index].detail.asset = 'BPRO'
                        break;
                    case 'RISKPROX':
                        asset.push({ 'image': 'icon-riskprox.svg', 'color': 'color-token-riskprox', 'txt': 'BTCX' });
                        data_row_coins2[index].detail.asset = 'BTCX'
                        break;
                    default:
                        asset.push({ 'image': 'icon-stable.svg', 'color': 'color-token-stable', 'txt': 'DOC' });
                        data_row_coins2[index].detail.asset = 'DOC'
                        break;
                }

                data.push({
                    key: element.key,
                    info: '',
                    event: <span className={classnames('event-action', asset[0].color)}>{element.event}</span>,
                    asset: <img className="uk-preserve-width uk-border-circle" src={window.location.origin + `/Moc/` + asset[0].image} alt="avatar" width={32} />,
                    // platform: <span className="display-inline CurrencyTx">{element.platform} {asset[0].txt}</span>,
                    platform: <span className="display-inline CurrencyTx">{element.platform} {asset[0].txt}</span>,
                    wallet: <span className="display-inline ">{element.wallet} </span>,
                    date: <span><Moment format="YYYY-MM-DD HH:MM">{element.date}</Moment></span>,
                    status: <div style={{ width: '100%' }}><Progress percent={element.status.percent} /><br /><span
                        className="color-confirmed conf_title">{element.status.txt}</span></div>,
                    description: <RowDetail detail={element.detail} />,
                });
            }
        })
        /*******************************end extraer datos del json con el json seteado por limit y skip***********************************/
    }

    data_row(1)

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

    return (
        <>
            <div className="title"><h1>{t('MoC.operations.title', { ns: 'moc' })}</h1></div>
            <Table
                {...state}
                pagination={{ position: [top, bottom], defaultCurrent: 1, onChange: (current) => setCurrent(current), total: Object.keys(data_json.transactions).length }}
                columns={tableColumns}
                dataSource={hasData ? data : null}
                scroll={scroll}
            />
        </>
    );
}