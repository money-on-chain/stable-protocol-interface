import React from 'react';
//import 'antd/dist/antd.css';
//import './index.css';
import { Table } from 'antd';


const columns = [
    {
        title: 'Token',
        dataIndex: 'token',
        width: 380,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        width: 200,
    },
    {
        title: 'Variation 24hs',
        dataIndex: 'variation',
        width: 200,
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        width: 190,
    },
    {
        title: 'USD',
        dataIndex: 'usd'
        /*width: 190,*/
    }
];

const data = [
    {
        key: 0,
        token: <div className="item-token"><i className="icon-token-coinbase"></i> <span className="token-description">RBTC</span></div>,
        price: "0.00",
        variation: "+0.00%",
        balance: "0.000000000000",
        usd: "0.00"
    },
    {
        key: 1,
        token: <div className="item-token"><i className="icon-token-ca_0"></i> <span className="token-description">Dollar on Chain (DOC)</span></div>,
        price: "0.00",
        variation: "+0.00%",
        balance: "0.000000000000",
        usd: "0.00"
    },
    {
        key: 2,
        token: <div className="item-token"><i className="icon-token-ca_1"></i> <span className="token-description">Rif on Chain (RDOC)</span></div>,
        price: "0.00",
        variation: "+0.00%",
        balance: "0.000000000000",
        usd: "0.00"
    },
    {
        key: 3,
        token: <div className="item-token"><i className="icon-token-tg"></i> <span className="token-description">Flip (FFLIP)</span></div>,
        price: "0.00",
        variation: "+0.00%",
        balance: "0.000000000000",
        usd: "0.00"
    },
    {
        key: 4,
        token: <div className="item-token"><i className="icon-token-tc"></i> <span className="token-description">FlipMega (FFLIP)</span></div>,
        price: "0.00",
        variation: "+0.00%",
        balance: "0.000000000000",
        usd: "0.00"
    },
    {
        key: 5,
        token: <div className="item-token"><i className="icon-token-tp_0"></i> <span className="token-description">FlipARS (FFLIP)</span></div>,
        price: "0.00",
        variation: "+0.00%",
        balance: "0.000000000000",
        usd: "0.00"
    },
    {
        key: 6,
        token: <div className="item-token"><i className="icon-token-tp_1"></i> <span className="token-description">FlipMXN (FFLIP)</span></div>,
        price: "0.00",
        variation: "+0.00%",
        balance: "0.000000000000",
        usd: "0.00"
    }
];

export default function Tokens(props) {
    return (<Table columns={columns} dataSource={data} pagination={false} scroll={{y: 240}} />)
};
