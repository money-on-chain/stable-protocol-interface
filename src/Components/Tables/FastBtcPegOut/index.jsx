import React, { useContext } from 'react';
import 'antd/dist/antd.css';
import './style.scss';
import { Table } from 'antd';
import data_json from '../../../services/fatbts_pegout.json';
import Moment from 'react-moment';
import { useState } from 'react'
import { myParseDate, readJsonTableFastBtcPegOut} from '../../../Helpers/helper'
import { useTranslation } from "react-i18next";
import date from '../../../Config/date';
import {AuthenticateContext} from "../../../Context/Auth";
import Copy from "../../Page/Copy";
import RowDetailPegOut from "./RowDetailPegOut";
import {DownCircleOutlined, UpCircleOutlined} from "@ant-design/icons";

export default function FastBtcPegOut(props) {

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
    const BigNumber = require('bignumber.js');

    const [t, i18n] = useTranslation(["global", 'moc']);
    const auth = useContext(AuthenticateContext);

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
            title: 'Hash Id',
            dataIndex: 'hashId',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'BTC Amount',
            dataIndex: 'btcAmount',
        },
        {
            title: 'BTC Fee',
            dataIndex: 'btcFee',
        },
        {
            title: 'BTC Address',
            dataIndex: 'btcAddress',
        },
        {
            title: 'Date Added',
            dataIndex: 'date',
        },
    ];

    var data = [];
    const setPage = (page) => {
        setCurrent(page);
        data_row(page);
    };

    const data_row_coins2 = [];
    var json_end = []
    const data_row = (set_current) => {
        /*******************************sort descending by date lastUpdatedAt***********************************/
        data_json.pegout_requests.sort((a, b) => {
            return myParseDate(b.updated) - myParseDate(a.updated)
        });
        /*******************************end sort descending by date lastUpdatedAt***********************************/

        /*******************************filter by type (token)***********************************/
        var pre_datas = data_json.pegout_requests;
        // pre_datas = data_json.transactions.filter(data_j => {
        //     return (token !== 'all') ? data_j.tokenInvolved === token : true;
        // });
        /*******************************end filter by type (token)***********************************/
        while (data.length > 0) {
            data.pop();
        }
        /*******************************set json group according to limits***********************************/
        const limit = 10;
        json_end = pre_datas.slice((set_current * limit) - limit, (set_current * limit));
        /*******************************end set json group according to limits***********************************/

        /*******************************extraer datos del json con el json seteado por limit y skip***********************************/
        data = [];

        json_end.forEach((data_j) => {
            const datas_response = readJsonTableFastBtcPegOut(data_j)
            console.log('ppppppppppppppppppppppppppppppp')
            console.log(datas_response['hashId'])
            console.log('ppppppppppppppppppppppppppppppp')

                const detail = {
                    status: <span style={{color:'#478210'}}>{datas_response['status']}</span>
                    ,btcAmount: datas_response['btcAmount']
                    ,btcFee: datas_response['btcFee']
                    ,btcAddress: <Copy textToShow={datas_response['btcAddressCut']} textToCopy={datas_response['btcAddress']} />
                    ,date: <span><Moment format={(i18n.language === "en") ? date.DATE_EN : date.DATE_ES}>{datas_response['date']}</Moment></span>
                    ,timestamp: <span><Moment format={(i18n.language === "en") ? date.DATE_EN : date.DATE_ES}>{datas_response['timestamp']}</Moment></span>
                    ,transactionHash: <Copy textToShow={datas_response['transactionHashCut']} textToCopy={datas_response['transactionHash']} />
                    ,transId: <Copy textToShow={datas_response['hash_id_cut']} textToCopy={datas_response['hashId']} />
                    ,blockNumber: datas_response['blockNumber']
                    ,rskAddress: <Copy textToShow={datas_response['rskAddressCut']} textToCopy={datas_response['rskAddress']} />
                };

                data_row_coins2.push({
                    key: datas_response['hashId']
                    ,hashId: <Copy textToShow={datas_response['transactionHashCut']} textToCopy={datas_response['transactionHash']} />
                    ,status: <span style={{color:'#478210'}}>{datas_response['status']}</span>
                    ,btcAmount: datas_response['btcAmount']
                    ,btcFee: datas_response['btcFee']
                    ,btcAddress: <Copy textToShow={datas_response['btcAddressCut']} textToCopy={datas_response['btcAddress']} />
                    ,date: <span><Moment format={(i18n.language === "en") ? date.DATE_EN : date.DATE_ES}>{datas_response['date']}</Moment></span>
                    ,detail: detail
                });

        });
        data_row_coins2.forEach((element, index) => {
            data.push({
                key: element.key,
                info: '',
                hashId: <span >{element.hashId}</span>,
                status: <span >{element.status}</span>,
                btcAmount: <span >{element.btcAmount}</span>,
                btcFee: <span >{element.btcFee}</span>,
                btcAddress: <span >{element.btcAddress}</span>,
                date: <span >{element.date}</span>,
                description: <div className={'div-table-in'}><RowDetailPegOut detail={element.detail} /></div>,
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

    return (
        <>
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
                pagination={{ position: [top, bottom], defaultCurrent: 1, onChange: (page) => setPage(page), total: Object.keys(data_json.pegout_requests).length }}
                columns={tableColumns}
                dataSource={hasData ? (auth.isLoggedIn == true) ? data : null : null}
                scroll={scroll}
            />
        </>
    );
}