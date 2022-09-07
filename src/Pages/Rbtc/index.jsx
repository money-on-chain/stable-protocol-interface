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
import { config } from './../../Config/config';

export default function Rbtc(props) {

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;

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

            {auth.isLoggedIn && <><h1 className="PageTitle">{t(`${appMode}.fastbtc.title`, { ns: ns })}</h1>
                <h3 className="PageSubTitle">{t(`${appMode}.fastbtc.subTitle`, { ns: ns })}</h3>
                <Row gutter={15}>
                    <Col xs={24} md={12} xl={5}>
                        <Sovryn tokenName="stable" titleName="DoC" />
                    </Col>
                    <Col xs={24} md={12} xl={10}>
                        <BtcToRbtc
                            title={t(`${appMode}.fastbtc.titleCard_pegin`, { ns: ns })}
                            description={t(`${appMode}.fastbtc.getRBTC_description`, { ns: ns })}
                            btnText={t(`${appMode}.fastbtc.getRBTC`, { ns: ns })}
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
                            title={t(`${appMode}.fastbtc.titleCard_pegout`, { ns: ns })}
                            description={t(`${appMode}.fastbtc.getBTC_description`, { ns: ns })}
                            btnText={t(`${appMode}.fastbtc.getBTC`, { ns: ns })}
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
                        <h1>{t(`${appMode}.fastbtc.history.title`, { ns: ns })}</h1>
                    </div>
                    <span className="upper-summary">
                        {t(`${appMode}.fastbtc.history.upperSummary_1`, { ns: ns })}
                        <a href='https://sovryn.freshdesk.com/support/tickets/new' target='_blank'>
                            {t(`${appMode}.fastbtc.history.upperSummary_2`, { ns: ns })}
                        </a>
                        {t(`${appMode}.fastbtc.history.upperSummary_3`, { ns: ns })}
                    </span>
                    {/*<FastBtcPegOut></FastBtcPegOut>*/}
                    <Table
                        accountData={auth.accountData}
                    ></Table>
                </div></>}
        </Fragment>
    );
}