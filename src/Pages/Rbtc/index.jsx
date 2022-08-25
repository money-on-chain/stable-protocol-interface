import RbtcToBtcGenerateModal from '../../Components/Modals/RbtcToBtcGenerateModal';
import BtcToRbtcGenerateModal from '../../Components/Modals/BtctoRbtcGenerateModal';
import BtcToRbtc from '../../Components/Cards/BtcToRbtc';
import {Row, Col, Alert} from 'antd';
import React, {Fragment, useState, useContext, useEffect} from 'react';
import ListOperations from "../../Components/Tables/ListOperations";
import Sovryn from "../../Components/Cards/Sovryn";
import { AuthenticateContext } from '../../Context/Auth';
import { useTranslation, Trans } from "react-i18next";
import FastBtcPegOut from "../../Components/Tables/FastBtcPegOut";
import Table from "../../Components/Tables/FastBtcPegOut/table";

export default function Rbtc(props) {

    async function loadAssets() {
        try {
                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);

    const [rbtcGenVisible, setRbtcGenVisible] = useState(false);
    const [btcGenVisible, setBtcGenVisible] = useState(false);

    const closeLogoutModal = () => {
        setRbtcGenVisible(false);
    };

    return (
        <Fragment>

            {!auth.isLoggedIn &&
            <p>Not connected! </p>
            }

            {auth.isLoggedIn && <><h1 className="PageTitle">{t('MoC.fastbtc.title', { ns: 'moc' })}</h1>
                <h3 className="PageSubTitle">{t('MoC.fastbtc.subTitle', { ns: 'moc' })}</h3>
                <Row gutter={15}>
                    <Col xs={24} md={12} xl={5}>
                        <Sovryn tokenName="stable" titleName="DoC" />
                    </Col>
                    <Col xs={24} md={12} xl={10}>
                        <BtcToRbtc
                            title={t('MoC.fastbtc.titleCard_pegin', { ns: 'moc' })}
                            description={t('MoC.fastbtc.getRBTC_description', { ns: 'moc' })}
                            btnText={t('MoC.fastbtc.getRBTC', { ns: 'moc' })}
                        btnAction={() => {setBtcGenVisible(true)}}
                    />
                    <BtcToRbtcGenerateModal
                        visible={btcGenVisible}
                        handleClose={() => setBtcGenVisible(false)}
                        accountData={auth.accountData}
                        />
                    </Col>
                    <Col xs={24} md={24} xl={9}>
                        <BtcToRbtc
                            title={t('MoC.fastbtc.titleCard_pegout', { ns: 'moc' })}
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
                <div className="Card FastBTCHistory">
                    <div className="title">
                        <h1>{t('MoC.fastbtc.history.title', { ns: 'moc' })}</h1>
                    </div>
                    <span className="upper-summary">
                        {t('MoC.fastbtc.history.upperSummary_1', { ns: 'moc' })}
                        <a href='https://sovryn.freshdesk.com/support/tickets/new' target='_blank'>
                            {t('MoC.fastbtc.history.upperSummary_2', { ns: 'moc' })}
                        </a>
                        {t('MoC.fastbtc.history.upperSummary_3', { ns: 'moc' })}
                    </span>
                    {/*<FastBtcPegOut></FastBtcPegOut>*/}
                    <Table
                        accountData={auth.accountData}
                    ></Table>
                </div></>}
        </Fragment>
    );
}