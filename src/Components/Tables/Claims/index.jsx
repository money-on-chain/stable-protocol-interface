import React, {useContext, useEffect} from 'react';
import 'antd/dist/antd.css';
import './style.scss';
import { Table, Tooltip } from 'antd';
import RowDetail from "../RowDetailClaim";
import classnames from 'classnames';
import api from '../../../services/api';
import Moment from 'react-moment';
import { useState } from 'react'
import {
    myParseDate,
    readJsonClaims,
    dateFU
} from '../../../Helpers/helper'
import config from '../../../Config/constants';
import Copy from "../../Page/Copy";
import { useTranslation } from "react-i18next";
import date from '../../../Config/date';
import {AuthenticateContext} from "../../../Context/Auth";
import {InfoCircleOutlined} from "@ant-design/icons";
import {DownCircleOutlined, UpCircleOutlined} from "@ant-design/icons";


export default function Claims(props) {

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
    const [timer, setTimer] = useState(100);

    const transactionsList= (skip,call_table) => {
        const datas= {address: accountData.Owner,limit:20,skip:(((skip-1)+(skip-1))*10)}
        api('get', config.api_moneyonchain+'claims/'+accountData.Owner, datas)
            .then(response => {
                setDataJson(response);
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
            title: t('MoC.operations.columns.mocAmount', { ns: 'moc' }),
            dataIndex: 'amount',
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
        if(accountData.Owner!==undefined){
            if (currentHash) {
                transactionsList(current)
            }
        }
        if (accountData) {
            setTimer(30000)
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
    const data_row = (set_current) => {
        /*******************************sort descending by date lastUpdatedAt***********************************/
        if(dataJson!==undefined){
            dataJson.sort((a, b) => {
                return myParseDate(dateFU(b.creation)) - myParseDate(dateFU(a.creation))
            });
        }
        /*******************************end sort descending by date lastUpdatedAt***********************************/
        if(dataJson!==undefined){
            json_end= dataJson
        }
        /*******************************extraer datos del json con el json seteado por limit y skip***********************************/
        data = [];

        json_end.forEach((data_j) => {
            const datas_response = readJsonClaims(data_j,t,i18n)

            const date_formated= <span><Moment format={(i18n.language === "en") ? date.DATE_EN : date.DATE_ES} unix>{datas_response['creation']}</Moment></span>
            const amount_set= (datas_response['mocs']!=='--')? '+'+ datas_response['mocs'] + ' MOC': datas_response['mocs']

            const detail = {
                event: 'CLAIM'
                , created: date_formated
                , gas_fee: '--'
                , asset: datas_response['set_asset']
                , confirmation: '--'
                , address: '--'
                , amount: amount_set
                , gas_cost: datas_response['gas_cost']
                , sent_hash: (datas_response['sent_hash']!='--')? <Copy textToShow={datas_response['truncate_sent_hash']} textToCopy={datas_response['sent_hash']} /> : '--'
                , hash: (datas_response['hash']!='--')? datas_response['hash'] : '--'
                , truncate_hash: (datas_response['truncate_hash']!='--')? datas_response['truncate_hash'] : '--'
                , status: datas_response['state']
                , block: '--'
                , detail: '--'
                , transaction: '--'
                , moc_price: '--'
            };

            data_row_coins2.push({
                key: data_j.hash,
                info: '',
                event: 'CLAIM',
                asset: datas_response['set_asset'],
                amount: amount_set,
                wallet: datas_response['wallet_value_main'],
                date: date_formated,
                status: datas_response['state'],
                detail: detail,
            });

        });
        data_row_coins2.forEach((element, index) => {
            const asset = [{ 'image': 'icon-moc.svg', 'color': '', 'txt': 'CLAIM' }]
            data_row_coins2[index].detail.asset = 'MOC'

            data.push({
                key: element.key,
                info: '',
                event: <span className={classnames('event-action', asset[0].color)}>{element.event}</span>,
                asset: <img className="uk-preserve-width uk-border-circle" src={window.location.origin + `/Moc/` + asset[0].image} alt="avatar" width={32} />,
                amount: <span className="display-inline CurrencyTx">{element.amount}</span>,
                date: <span>{element.date}</span>,
                status: <span>{element.status}</span>,
                description: <RowDetail detail={element.detail} />,
            });
        })
        /*******************************end extraer datos del json con el json seteado por limit y skip***********************************/
    }

    data_row(current)

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
            <div className="title">
                <h1>{t('MoC.operations.title', { ns: 'moc' })}</h1>
                <Tooltip color={'#404040'} placement="topLeft" title={t("MoC.operations.tooltip.text", { ns: 'moc' })} className='Tooltip'>
                    <InfoCircleOutlined className="Icon" />
                </Tooltip>
            </div>
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
                pagination={{pageSize:20, position: [top, bottom], defaultCurrent: 1, onChange:onChange , total: totalTable }}
                columns={tableColumns}
                dataSource={hasData ? (auth.isLoggedIn == true) ? data : null : null}
                scroll={scroll}
            />
        </>
    );
}
