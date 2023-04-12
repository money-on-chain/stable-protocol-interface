import { Row, Col } from 'antd';
import React, { Fragment, useState, useContext, useEffect } from 'react';

import RbtcToBtcGenerateModal from '../../components/Modals/RbtcToBtcGenerateModal';
import BtcToRbtcGenerateModal from '../../components/Modals/BtctoRbtcGenerateModal';
import BtcToRbtc from '../../components/Cards/BtcToRbtc';
import Sovryn from '../../components/Cards/Sovryn';
import { AuthenticateContext } from '../../context/Auth';
import Table from '../../components/Tables/FastBtcPegOut/table';
import { config } from '../../projects/config';
import { useProjectTranslation } from '../../helpers/translations';

import './../../assets/css/pages.scss';

export default function Rbtc(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;

    const [rbtcGenVisible, setRbtcGenVisible] = useState(false);
    const [btcGenVisible, setBtcGenVisible] = useState(false);

    const closeLogoutModal = () => {
        setRbtcGenVisible(false);
    };

    return (
        <Fragment>
            {!auth.isLoggedIn && <p>Not connected! </p>}

            {auth.isLoggedIn && (
                <>
                    <h1 className="PageTitle">
                        {t(`${AppProject}.fastbtc.title`, { ns: ns })}
                    </h1>
                    <h3 className="PageSubTitle">
                        {t(`${AppProject}.fastbtc.subTitle`, { ns: ns })}
                    </h3>
                    <Row gutter={15}>
                        <Col xs={24} md={12} xl={5}>
                            <Sovryn tokenName="stable" titleName="DoC" />
                        </Col>
                        <Col xs={24} md={12} xl={10}>
                            <BtcToRbtc
                                title={t(
                                    `${AppProject}.fastbtc.titleCard_pegin`,
                                    { ns: ns }
                                )}
                                description={t(
                                    `${AppProject}.fastbtc.getRBTC_description`,
                                    { ns: ns }
                                )}
                                btnText={t(`${AppProject}.fastbtc.getRBTC`, {
                                    ns: ns
                                })}
                                btnAction={() => {
                                    setBtcGenVisible(true);
                                }}
                                mode={'pegin'}
                            />
                            <BtcToRbtcGenerateModal
                                visible={btcGenVisible}
                                handleClose={() => setBtcGenVisible(false)}
                                accountData={auth.accountData}
                            />
                        </Col>
                        <Col xs={24} md={24} xl={9}>
                            <BtcToRbtc
                                title={t(
                                    `${AppProject}.fastbtc.titleCard_pegout`,
                                    { ns: ns }
                                )}
                                description={t(
                                    `${AppProject}.fastbtc.getBTC_description`,
                                    { ns: ns }
                                )}
                                btnText={t(`${AppProject}.fastbtc.getBTC`, {
                                    ns: ns
                                })}
                                btnAction={() => {
                                    setRbtcGenVisible(true);
                                }}
                                mode={'pegout'}
                            />
                            <RbtcToBtcGenerateModal
                                visible={rbtcGenVisible}
                                handleClose={closeLogoutModal}
                            />
                        </Col>
                    </Row>
                    <div className="Card FastBTCHistory">
                        <div className="title">
                            <h1>
                                {t(`${AppProject}.fastbtc.history.title`, {
                                    ns: ns
                                })}
                            </h1>
                        </div>
                        <span className="upper-summary">
                            {t(`${AppProject}.fastbtc.history.upperSummary_1`, {
                                ns: ns
                            })}
                            <a
                                href="https://sovryn.freshdesk.com/support/tickets/new"
                                target="_blank"
                            >
                                {t(
                                    `${AppProject}.fastbtc.history.upperSummary_2`,
                                    { ns: ns }
                                )}
                            </a>
                            {t(`${AppProject}.fastbtc.history.upperSummary_3`, {
                                ns: ns
                            })}
                        </span>
                        {/*<FastBtcPegOut></FastBtcPegOut>*/}
                        <Table accountData={auth.accountData}></Table>
                    </div>
                </>
            )}
        </Fragment>
    );
}
