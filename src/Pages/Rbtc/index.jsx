import RbtcToBtcGenerateModal from '../../Components/Modals/RbtcToBtcGenerateModal';
import BtcToRbtc from '../../Components/Cards/BtcToRbtc';
import { Row, Col } from 'antd';
import React, { Fragment, useState, useContext } from 'react';
import ListOperations from "../../Components/Tables/ListOperations";
import Sovryn from "../../Components/Cards/Sovryn";
import { AuthenticateContext } from '../../Context/Auth';
import { useTranslation } from "react-i18next";
import './style.scss'

export default function Rbtc(props) {
    const data_row_coins = [];
    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);

    data_row_coins.push({
        key: 0,
        info: '',
        event: 'DOC',
        asset: 'DOC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: { txt: 'Confirmed', percent: 100 },
    });
    data_row_coins.push({
        key: 1,
        info: '',
        event: 'DOC',
        asset: 'DOC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: { txt: 'Confirmed', percent: 100 },
    });

    const [rbtcGenVisible, setRbtcGenVisible] = useState(false);

    const closeLogoutModal = () => {
        setRbtcGenVisible(false);
    };

    return (
        <Fragment>
            <h1 className="PageTitle">{t('MoC.fastbtc.title', { ns: 'moc' })}</h1>
            <h3 className="PageSubTitle">{t('MoC.fastbtc.subTitle', { ns: 'moc' })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={4}>
                    <Sovryn tokenName="stable" titleName="DoC" />
                </Col>
                <Col xs={24} md={12} xl={10}>
                    <BtcToRbtc
                        title="BTC to rBTC Peg In"
                        description={t('MoC.fastbtc.getRBTC_description', { ns: 'moc' })}
                        btnText={t('MoC.fastbtc.getRBTC', { ns: 'moc' })}
                    />
                </Col>
                <Col xs={24} md={24} xl={10}>
                    <BtcToRbtc
                        title="BTC to rBTC Peg Out"
                        description={t('MoC.fastbtc.getBTC_description', { ns: 'moc' })}
                        btnText={t('MoC.fastbtc.getBTC', { ns: 'moc' })}
                        btnAction={() => { setRbtcGenVisible(true) }}
                    />
                    <RbtcToBtcGenerateModal
                        visible={rbtcGenVisible}
                        handleClose={closeLogoutModal}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'STABLE'}></ListOperations>
            </div>
        </Fragment>
    );
}
