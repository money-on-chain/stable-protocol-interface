import { Tabs, Tooltip, Button, Skeleton } from 'antd';
import React, { useEffect, useContext, useState } from 'react';
import FastBtcPegOut from "./index";
import { Table } from 'antd';
import { AuthenticateContext } from '../../../Context/Auth';
import {useTranslation} from "react-i18next";
import { getDepositHistory } from "../../../Lib/fastBTC/fastBTCMethods";
import moment from 'moment';
import SatoshiToBTC from 'satoshi-bitcoin';
const { TabPane } = Tabs;

const onChange = (key) => {
    console.log(key);
};

const Tabe = ({ accountData }) => {
  const auth = useContext(AuthenticateContext);
  useEffect(() => {
    auth.socket.initialize();
  }, []);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [t, i18n]= useTranslation(["global",'moc']);

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
      title: t('MoC.fastbtc.history.columns_headers.step', {ns: 'moc'}),
      dataIndex: 'step',
      key: 'step'
    },
    {
      title: t('MoC.fastbtc.history.columns_headers.type', {ns: 'moc'}),
      dataIndex: 'type',
      key: 'type',
      render: text => t('MoC.fastbtc.history.columns.type_' + text, {ns: 'moc'}),
      responsive: ['md']
    },
    {
      title: t('MoC.fastbtc.history.columns_headers.dateAdded', {ns: 'moc'}),
      dataIndex: 'dateAdded',
      key: 'dateAdded',
      responsive: ['md'],
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: dateAddedSort,
      render: text =>
        text ? moment(text).format(t('MoC.fastbtc.history.columns.dateAddedFormat', {ns: 'moc'})) : '--'
    },
    {
      title: t('MoC.fastbtc.history.columns_headers.status', {ns: 'moc'}),
      key: 'status',
      dataIndex: 'status',
      render: text => t('MoC.fastbtc.history.columns.status_' + text, {ns: 'moc'})
    },
    {
      title: t('MoC.fastbtc.history.columns_headers.valueBtc', {ns: 'moc'}),
      key: 'valueBtc',
      dataIndex: 'valueBtc',
      render: (text, record) => {
        const value = SatoshiToBTC.toBitcoin(text);
        return record.type === 'deposit'
          ? t('MoC.fastbtc.history.columns.valueBTC', { value }, {ns: 'moc'})
          : t('MoC.fastbtc.history.columns.valueRBTC', { value }, {ns: 'moc'});
      },
      responsive: ['sm']
    },
    {
      title: t('MoC.fastbtc.history.columns_headers.txHash', {ns: 'moc'}),
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
                  `${record.type === 'deposit' ? window.btcExplorer : window.explorerUrl}/tx/${
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

  const locale = {
    emptyText: loading ? <Skeleton active /> : t('MoC.operations.empty', {ns: 'moc'}),
    triggerDesc: t('MoC.fastbtc.history.table.triggerDesc', {ns: 'moc'}),
    triggerAsc: t('MoC.fastbtc.history.table.triggerAsc', {ns: 'moc'})
  };

  return (
    <Tabs defaultActiveKey="1" onChange={onChange}>
      <TabPane tab="Peg In" key="1">
        <Table
          columns={columns}
          rowKey={record => record.txHash}
          locale={locale}
          dataSource={operations && 
            operations.map(result => {
              const item = result;
              item.step =
                item.type === 'deposit'
                  ? t('MoC.fastbtc.history.columns.step_1', {ns: 'moc'})
                  : t('MoC.fastbtc.history.columns.step_2', {ns: 'moc'});
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

export default Tabe;