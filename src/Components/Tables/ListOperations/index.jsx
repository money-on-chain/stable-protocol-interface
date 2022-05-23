import React from 'react';
import 'antd/dist/antd.css';
import './style.scss';
import { Table, Progress,Result } from 'antd';
import RowDetail from "../RowDetail";
import classnames from 'classnames';
import api from '../../../services/api';
import data_json from '../../../services/webapp_transactions_list';
import Moment from 'react-moment';
import { useState } from 'react'
import Web3 from 'web3';
import {readJsonTable, setNumber} from '../../../Helpers/helper'
import config from '../../../Config/constants';
import Copy from "../../Page/Copy";
import {adjustPrecision,formatLocalMap} from "../../../Lib/Formats";
import Tooltip from 'antd/lib/tooltip';
import NumericLabel from 'react-pretty-numbers';
import DollarOutlined from '@ant-design/icons/DollarOutlined';

const columns = [
    {
        title: '',
        dataIndex: 'info',
    },
    {
        title: 'event',
        dataIndex: 'event',
    },
    {
        title: 'asset',
        dataIndex: 'asset',
    },
    {
        title: 'platform',
        dataIndex: 'platform',
    },
    {
        title: 'wallet',
        dataIndex: 'wallet',
    },
    {
        title: 'date',
        dataIndex: 'date',
    },
    {
        title: 'status',
        dataIndex: 'status',
    },
];

const expandable = { expandedRowRender: record => <p>{record.description}</p> };
const title = () => 'Here is title';
const showHeader = true;
const pagination = { position: 'bottom' };
const BigNumber = require('bignumber.js');

class ListOperations extends React.Component {

    state = {
        bordered: false,
        loading: false,
        pagination,
        size: 'default',
        expandable,
        title: undefined,
        showHeader,
        scroll: undefined,
        hasData: true,
        tableLayout: undefined,
        top: 'none',
        bottom: 'bottomRight',
    };



    handleToggle = prop => enable => {
        this.setState({ [prop]: enable });
    };

    handleSizeChange = e => {
        this.setState({ size: e.target.value });
    };

    handleTableLayoutChange = e => {
        this.setState({ tableLayout: e.target.value });
    };

    handleExpandChange = enable => {
        this.setState({ expandable: enable ? expandable : undefined });
    };

    handleEllipsisChange = enable => {
        this.setState({ ellipsis: enable });
    };

    handleTitleChange = enable => {
        this.setState({ title: enable ? title : undefined });
    };

    handleHeaderChange = enable => {
        this.setState({ showHeader: enable ? showHeader : false });
    };

    handleYScrollChange = enable => {
        this.setState({ yScroll: enable });
    };

    handleXScrollChange = e => {
        this.setState({ xScroll: e.target.value });
    };

    handleDataChange = hasData => {
        this.setState({ hasData });
    };


    render() {

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
        const setCurrent= (current) => {
            set_current= current
            // console.log("current: ",current);
            // console.log("set_current: ",set_current);
            // getDatasTable(set_current)
            data_row(set_current)
        };



        const data_row_coins2= [];
        var set_index=0
        var json_end= []
        const data_row= (set_current)=> {

            /*******************************primero filtra por el tipo (token)***********************************/
            if( this.props.token != 'all'){
                var  pre_datas=[]
                data_json.transactions.map((data_j)=>{
                    if( data_j.tokenInvolved == this.props.token){
                        pre_datas.push(data_j)
                    }
                });
            }else{
                var  pre_datas=[]
                data_json.transactions.map((data_j)=>{
                    pre_datas.push(data_j)
                });
            }
            /*******************************end primero filtra por el tipo (token)***********************************/


            //data=[]
            while(data.length > 0) {
                data.pop();
            }
            // console.log("1212");
            // console.log(set_current);
            // console.log("1212");


            /*******************************setear el json para manejar limit y skip***********************************/
            const limit = 10;
            if(set_current==1){
                console.log("===========================11111111111111111111111111");
                console.log(set_current-1);
                console.log((set_current+limit)-1);
                // console.log(data);
                console.log("===========================11111111111111111111111111");
                json_end= pre_datas.slice(set_current-1, (set_current+limit)-1);
            }

            if(set_current>1){
                json_end= pre_datas.slice((set_current*10)-10, (set_current*10));
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>11111111111111111111111111");
                console.log((set_current*10)-10);
                console.log((set_current*10));
                // console.log(data);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>11111111111111111111111111");
            }
            /*******************************end setear el json para manejar limit y skip***********************************/

            /*******************************extraer datos del json con el json seteado por limit y skip***********************************/
            data = [];

            json_end.map((data_j, index)=>{
                const datas_response= readJsonTable(data_j)

                if( datas_response['wallet_detail']!='--' && datas_response['wallet_detail']!=11){
                    const detail = {event:datas_response['set_event']
                        ,created:<span><Moment format="YYYY-MM-DD HH:MM:SS">{datas_response['lastUpdatedAt']}</Moment></span>
                        ,details:datas_response['RBTCAmount']
                        ,asset:datas_response['set_asset']
                        ,confirmation:<span><Moment format="YYYY-MM-DD HH:MM:SS">{datas_response['confirmationTime']}</Moment></span>
                        ,address:<Copy textToShow={datas_response['truncate_address']} textToCopy={datas_response['address']}/>
                        ,platform:datas_response['amount']
                        ,platform_fee: datas_response['platform_fee_value']
                        ,block: datas_response['blockNumber']
                        ,wallet: datas_response['wallet_value']
                        ,interests: datas_response['interests']
                        ,tx_hash_truncate: datas_response['tx_hash_truncate']
                        ,tx_hash: datas_response['tx_hash']
                        ,leverage:datas_response['leverage']
                        ,gas_fee:datas_response['gas_fee']
                        ,price:datas_response['price']
                        ,comments:'--'
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
                        status: {txt:datas_response['set_status_txt'],percent:datas_response['set_status_percent']},
                        detail: detail,
                    });
                }
            });

            data_row_coins2.forEach((element, index) => {
                const asset=[];
                if( element.wallet!='--' && element.wallet!=11 ) {
                    switch (element.asset) {
                        case 'STABLE':
                            asset.push({'image': 'icon-stable.svg', 'color': 'color-token-stable', 'txt': 'DOC'});
                            data_row_coins2[index].detail.asset = 'DOC';
                            break;
                        case 'RISKPRO':
                            asset.push({'image': 'icon-riskpro.svg', 'color': 'color-token-riskpro', 'txt': 'BPRO'});
                            data_row_coins2[index].detail.asset = 'BPRO'
                            break;
                        case 'RISKPROX':
                            asset.push({'image': 'icon-riskprox.svg', 'color': 'color-token-riskprox', 'txt': 'BTCX'});
                            data_row_coins2[index].detail.asset = 'BTCX'
                            break;
                        default:
                            asset.push({'image': 'icon-stable.svg', 'color': 'color-token-stable', 'txt': 'DOC'});
                            data_row_coins2[index].detail.asset = 'DOC'
                            break;
                    }

                    data.push({
                        key: element.key,
                        info: '',
                        event: <span className={classnames('event-action', asset[0].color)}>{element.event}</span>,
                        asset: <img className="uk-preserve-width uk-border-circle" src={window.location.origin + `/Moc/` + asset[0].image} alt="avatar" width={32}/>,
                        // platform: <span className="display-inline CurrencyTx">{element.platform} {asset[0].txt}</span>,
                        platform: <span className="display-inline CurrencyTx">{element.platform} {asset[0].txt}</span>,
                        wallet: <span className="display-inline ">{element.wallet} </span>,
                        date: <span><Moment format="YYYY-MM-DD HH:MM">{element.date}</Moment></span>,
                        status: <div style={{width: '100%'}}><Progress percent={element.status.percent}/><br/><span
                            className="color-confirmed conf_title">{element.status.txt}</span></div>,
                        description: <RowDetail detail={element.detail}/>,
                    });
                }
            })
            /*******************************end extraer datos del json con el json seteado por limit y skip***********************************/
        }



        data_row(1)

        const { xScroll, yScroll, ...state } = this.state;

        const scroll = {};
        if (yScroll) {
            scroll.y = 240;
        }
        if (xScroll) {
            scroll.x = '100vw';
        }

        const tableColumns = columns.map(item => ({ ...item, ellipsis: state.ellipsis }));
        if (xScroll === 'fixed') {
            tableColumns[0].fixed = true;
            tableColumns[tableColumns.length - 1].fixed = 'right';
        }

        return (
            <>
                <div className="title"><h1>Last Operations</h1></div>
                <Table
                    {...this.state}
                    pagination={{ position: [this.state.top, this.state.bottom], defaultCurrent:1,onChange:(current) =>  setCurrent(current),total:Object.keys(data_json.transactions).length }}
                    columns={tableColumns}
                    dataSource={state.hasData ? data: null}
                    scroll={scroll}
                />
            </>
        );
    }
}

export default ListOperations;
