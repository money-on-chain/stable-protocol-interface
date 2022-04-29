import React from 'react';
import 'antd/dist/antd.css';
import './style.scss';
import { Table, Progress,Result } from 'antd';
import RowDetail from "../RowDetail";
import classnames from 'classnames';


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

/*
for (let i = 1; i <= 3; i++) {
    data.push({
        key: i,
        info: '',
        event: <span className="event-action color-token-stable">MINT</span>,
        asset: <img className="uk-preserve-width uk-border-circle" src={window.location.origin + `/Moc/icon-stable.svg`} alt="avatar" width={32}/>,
        platform: <span className="display-inline CurrencyTx" >+ 0.00 DOC</span>,
        wallet: <span className="display-inline " >-0.000032 RBTC</span>,
        date: <span>2022-04-18 18:23</span>,
        status: <div style={{width:'100%'}}><Progress percent={100} /><br/><span className="color-confirmed">Confirmed</span></div>,
        description: <RowDetail/>,
    });
}*/



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

        const detail = {event:'MINT',created:'2022-04-18 18:23:00'
            ,details:'You received in your platform 0.00 DOC'
            ,asset:'DOC'
            ,confirmation:'2022-04-18 18:30:00'
            ,address:'--'
            ,platform:'+0.00DOC ( 0.00 USD )'
            ,platform_fee:'0.00 MOC ( 0.00 USD )'
            ,block:'2767182'
            ,wallet:'0.000032 RBTC ( 1.29 USD )'
            ,interests:'--'
            ,tx_hash:'0x449d..9c13c8'
            ,leverage:'--'
            ,gas_fee:'0.000032 RBTC ( 1.29 USD )'
            ,price:'40,823.54 USD'
            ,comments:'--'
        };

        const data = [];
        for (const element of this.props.datas) {
            const asset=[];
            switch (element.asset) {
                case 'DOC':
                    asset.push({'image':'icon-stable.svg','color':'color-token-stable','txt':'DOC'});
                    break;
                case 'BPRP':
                    asset.push({'image':'icon-riskpro.svg','color':'color-token-riskpro','txt':'BPRO'});
                    break;
                case 'BTC':
                    asset.push({'image':'icon-riskprox.svg','color':'color-token-riskprox','txt':'BTCX'});
                    break;
                default:
                    asset.push({'image':'icon-stable.svg','color':'color-token-stable','txt':'DOC'});
                    break;
            }

            data.push({
                key: element.key,
                info: '',
                event: <span className={classnames('event-action', asset[0].color)}>{element.event}</span>,
                asset: <img className="uk-preserve-width uk-border-circle" src={window.location.origin + `/Moc/`+asset[0].image} alt="avatar" width={32}/>,
                platform: <span className="display-inline CurrencyTx" >{element.platform} {asset[0].txt}</span>,
                wallet: <span className="display-inline " >{element.platform} RBTC</span>,
                date: <span>{element.date}</span>,
                status: <div style={{width:'100%'}}><Progress percent={element.status.percent} /><br/><span className="color-confirmed">{element.status.txt}</span></div>,
                description: <RowDetail detail={detail} />,
            });
        }

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

                <Table
                    {...this.state}
                    pagination={{ position: [this.state.top, this.state.bottom] }}
                    columns={tableColumns}
                    dataSource={state.hasData ? data: null}
                    scroll={scroll}
                />
            </>
        );
    }
}

export default ListOperations;