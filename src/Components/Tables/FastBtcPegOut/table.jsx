/* eslint-disable default-case */
import { Tabs, Tooltip, Button, Skeleton } from 'antd';
import React, { useEffect, useContext, useState } from 'react';
import FastBtcPegOut from "./index";
import { Table as TableAntd } from 'antd';
import { AuthenticateContext } from '../../../Context/Auth';
import {useTranslation} from "react-i18next";
import { getDepositHistory } from "../../../Lib/fastBTC/fastBTCMethods";
import { config } from '../../../Config/config';
import moment from 'moment';
import SatoshiToBTC from 'satoshi-bitcoin';
const { TabPane } = Tabs;

const onChange = (key) => {
    console.log(key);
};

const Table = ({ accountData }) => {
  const auth = useContext(AuthenticateContext);
  useEffect(() => {
    auth.socket.initialize();
  }, []);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [t, i18n]= useTranslation(["global",'moc', 'rdoc']);
  const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
  const AppProject = config.environment.AppProject;

  const address = accountData?.Owner;
  const socket = auth.socket;

  useEffect(() => {
    const updateHistory = () => {
      setLoading(true);
      getDepositHistory(socket, address)
        .then(result => {
          console.info('Got history');
          console.log(address);
          console.info(result);
          setOperations(result);
          setLoading(false);
          return result;
        })
        .catch(error => console.error(error));
    };
    socket.on('depositTx', updateHistory);
    socket.on('transferTx', updateHistory);
    console.info('Subscribed to socket from history table');
    updateHistory();
    return function cleanup() {
      if (socket === undefined) {
        return;
      }
      console.info('Cleaning up socket subscription from history table');
      socket.off('depositTx', updateHistory);
      socket.off('transferTx', updateHistory);
    };
  }, []);

  
  const dateAddedSort = (a, b) => moment(a.dateAdded).diff(moment(b.dateAdded));

  const columns = [
    {
      title: t(`${AppProject}.fastbtc.history.columns_headers.step`, {ns: ns}),
      dataIndex: 'step',
      key: 'step'
    },
    {
      title: t(`${AppProject}.fastbtc.history.columns_headers.type`, {ns: ns}),
      dataIndex: 'type',
      key: 'type',
      render: text => t(`${AppProject}.fastbtc.history.columns.type_` + text, {ns: ns}),
      responsive: ['md']
    },
    {
      title: t(`${AppProject}.fastbtc.history.columns_headers.dateAdded`, {ns: ns}),
      dataIndex: 'dateAdded',
      key: 'dateAdded',
      responsive: ['md'],
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: dateAddedSort,
      render: text =>
        text ? moment(text).format(t(`${AppProject}.fastbtc.history.columns.dateAddedFormat`, {ns: ns})) : '--'
    },
    {
      title: t(`${AppProject}.fastbtc.history.columns_headers.status`, {ns: ns}),
      key: 'status',
      dataIndex: 'status',
      render: text => <span className={setStatus(text)}>{t(`${AppProject}.fastbtc.history.columns.status_` + text, {ns: ns})}</span>
    },
    {
      title: t(`${AppProject}.fastbtc.history.columns_headers.valueBtc`, {ns: ns}),
      key: 'valueBtc',
      dataIndex: 'valueBtc',
      render: (text, record) => {
        const value = SatoshiToBTC.toBitcoin(text);
        return record.type === 'deposit'
          ? t(`${AppProject}.fastbtc.history.columns.valueBTC`, {ns: ns, value})
          : t(`${AppProject}.fastbtc.history.columns.valueRBTC`, {ns: ns, value});
      },
      responsive: ['sm']
    },
    {
      title: t(`${AppProject}.fastbtc.history.columns_headers.txHash`, {ns: ns}),
      key: 'txHash',
      dataIndex: 'txHash',
      render: (text, record) => {
        const btn = (
          <Tooltip title={record.txHash}>
            <Button
              type="link"
              size="small"
              onClick={() =>
                window.open(
                  `${record.type === 'deposit' ? config.btcExplorer : config.explorerUrl}/tx/${
                    record.txHash
                  }`
                )
              }
            >
              {record.txHash.slice(0, 6).concat('...' + record.txHash.slice(-6))}
            </Button>
          </Tooltip>
        );
        return btn;
      }
    }
  ];

  const setStatus = (status) => {
    let colorClass = '';
    switch (status) {
        case 'Initializing': {
            colorClass = "color-default";
            break;
        }
        case 'Validating': {
            colorClass = "color-default"
            break;
        }
        case 'Pending': {
            colorClass = "color-pending";
            break;
        }
        case 'Confirmed': {
            colorClass = "color-confirmed";
            break;
        }
        case 'Refunded': {
            colorClass = "color-failed";
            break;
        }
    }
    return colorClass;
};

  const locale = {
    emptyText: loading ? <Skeleton active /> : t(`${AppProject}.operations.empty`, {ns: ns}),
    triggerDesc: t(`${AppProject}.fastbtc.history.table.triggerDesc`, {ns: ns}),
    triggerAsc: t(`${AppProject}.fastbtc.history.table.triggerAsc`, {ns: ns})
  };

  return (
    <Tabs defaultActiveKey="1" onChange={onChange}>
      <TabPane tab="Peg In" key="1">
        <TableAntd
          columns={columns}
          rowKey={record => record.txHash}
          locale={locale}
          dataSource={operations.length > 0 && 
            operations.map(result => {
              const item = result;
              item.step =
                item.type === 'deposit'
                  ? t(`${AppProject}.fastbtc.history.columns.step_1`, {ns: ns})
                  : t(`${AppProject}.fastbtc.history.columns.step_2`, {ns: ns});
              return item;
            })
            .sort((a, b) => dateAddedSort(a, b) * -1)}
        />
      </TabPane>
      <TabPane tab="Peg Out" key="2">
        <FastBtcPegOut></FastBtcPegOut>
      </TabPane>
    </Tabs>
  );
};

export default Table;