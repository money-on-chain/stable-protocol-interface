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
import {setNumber} from '../../../Helpers/helper'
import config from '../../../Config/constants';
import Copy from "../../Page/Copy";


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
                var set_event= "";
                if(data_j.event.includes("Mint")){set_event='MINT'}
                if(data_j.event.includes("Settlement")){set_event='SETTLEMENT'}
                if(data_j.event.includes("Redeem")){set_event='REDEEM'}

                var set_asset= data_j.tokenInvolved;
                var set_status_txt= data_j.status;
                var set_status_percent= data_j.confirmingPercent;

                // const wallet_detail= (data_j.userAmount!==undefined)? parseFloat(Web3.utils.fromWei(Web3.utils.toWei(setNumber(data_j.userAmount), 'Kwei')), 'Kwei').toFixed(6) : '--'
                const wallet_detail= (data_j.userAmount!==undefined)? data_j.userAmount : '--'
                const wallet_detail_usd= (wallet_detail * config.coin_usd).toFixed(2)
                const paltform_detail= (data_j.amount!==undefined)? parseFloat(Web3.utils.fromWei(data_j.amount, 'ether')).toFixed(2) : '--'
                const paltform_detail_usd= (paltform_detail * config.coin_usd).toFixed(2)
                const interest_detail= (data_j.USDInterests!==undefined)? parseFloat(Web3.utils.fromWei(Web3.utils.toWei(setNumber(data_j.USDInterests), 'Kwei')), 'Kwei').toFixed(6) : 0
                const interest_detail_usd= (interest_detail * config.coin_usd).toFixed(2)
                const gasFeeUSD_detail= (data_j.gasFeeUSD!==undefined)? parseFloat(Web3.utils.fromWei(setNumber(data_j.gasFeeUSD), 'ether')).toFixed(6) : 0
                const gasFeeUSD_detail_usd= (gasFeeUSD_detail * config.coin_usd).toFixed(2)
                const truncate_address= data_j.address.substring(0, 6) + '...' + data_j.address.substring(data_j.address.length - 4, data_j.address.length);
                const truncate_txhash= (data_j.transactionHash!==undefined)? data_j.transactionHash.substring(0, 6) + '...' + data_j.transactionHash.substring(data_j.transactionHash.length - 4, data_j.transactionHash.length) : '--'


                if( wallet_detail!='--' && wallet_detail!=11){
                    const detail = {event:set_event
                        ,created:<span><Moment format="YYYY-MM-DD HH:MM:SS">{data_j.lastUpdatedAt}</Moment></span>
                        ,details: (data_j.RBTCAmount!==undefined)? `You received in your platform ${wallet_detail} RBTC` : '--'
                        ,asset:set_asset
                        ,confirmation:<span><Moment format="YYYY-MM-DD HH:MM:SS">{data_j.confirmationTime}</Moment></span>
                        ,address:<Copy textToShow={truncate_address} textToCopy={data_j.address}/>
                        ,platform: (data_j.amount!==undefined)? paltform_detail + ' ( ' + paltform_detail_usd + ' USD )' : '--'
                        ,platform_fee: ''
                        ,block: (data_j.blockNumber!==undefined)? data_j.blockNumber : '--'
                        ,wallet: (data_j.userAmount!==undefined)? `-${wallet_detail} RBTC ( ${wallet_detail_usd} USD )` : '--'
                        ,interests: (data_j.USDInterests!==undefined)? `${interest_detail} RBTC ( ${interest_detail_usd} USD )` : '--'
                        ,tx_hash_truncate: (data_j.transactionHash!==undefined)? truncate_txhash : '--'
                        ,tx_hash: (data_j.transactionHash!==undefined)? data_j.transactionHash : '--'
                        ,leverage:'--'
                        ,gas_fee:(data_j.gasFeeUSD!== undefined)? `${gasFeeUSD_detail} RBTC ( ${gasFeeUSD_detail_usd} USD )` : '--'
                        ,price:(data_j.reservePric!== undefined)? setNumber(data_j.reservePrice) +' USD' : '--'
                        ,comments:'--'
                    };


                    data_row_coins2.push({
                        key: data_j._id,
                        info: '',
                        event: set_event,
                        asset: set_asset,
                        platform: '+ '+paltform_detail,
                        // wallet: (data_j.RBTCAmount!==undefined)? `${wallet_detail} RBTC`:'--',
                        wallet: (data_j.userAmount!==undefined)? `-${wallet_detail} RBTC`:'--',
                        date: data_j.lastUpdatedAt,
                        status: {txt:set_status_txt,percent:set_status_percent},
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
                        asset: <img className="uk-preserve-width uk-border-circle"
                                    src={window.location.origin + `/Moc/` + asset[0].image} alt="avatar" width={32}/>,
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
            console.log('data-------------------***********');
            console.log(data);
            console.log('data-------------------***********');
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
