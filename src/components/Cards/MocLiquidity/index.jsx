import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import CountUp from 'react-countup';
import { Button, Skeleton, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthenticateContext } from '../../../context/Auth';
import { getRewardedToday } from '../../../helpers/helper';
import { LargeNumber } from '../../LargeNumber';
import api from '../../../services/api';
import { config } from '../../../projects/config';
import OperationStatusModal from '../../Modals/OperationStatusModal/OperationStatusModal';
import { useProjectTranslation } from '../../../helpers/translations';
import Web3 from 'web3';

function MocLiquidity(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const [callAgent, setCallAgent] = useState(false);
    const [incentiveState, setIncentiveState] = useState(null);
    const { account, accountData, userBalanceData } = auth;

    const agent = () => {
        if (auth.isLoggedIn) {
            setTimeout(() => {
                try {
                    api(
                        'get',
                        `${config.environment.api.incentives}` + 'agent/',
                        {}
                    )
                        .then((response) => {
                            setIncentiveState(response);
                        })
                        .catch((response) => {
                            console.log(response);
                        });
                } catch (error) {
                    console.error({ error });
                    console.log(error);
                }
            }, 500);
        }
    };

    useEffect(() => {
        setCallAgent(true);
        agent();
    }, [callAgent]);

    const [modalOpen, setModalOpen] = useState(false);
    const [operationStatus, setOperationStatus] = useState('pending');
    const [txHash, setTxHash] = useState('0x00000');

    const claimRewards = async (
        from,
        incentiveDestination,
        incentiveValue,
        callback = () => {}
    ) => {
        return window.web3.eth.sendTransaction({
            from: Web3.utils.toChecksumAddress(from),
            to: Web3.utils.toChecksumAddress(incentiveDestination),
            value: '10000000000000',
            gasPrice: '65164000',
            gas: 144000
        });
    };

    const claim = () => {
        claimRewards(
            account,
            incentiveState.agent_address,
            incentiveState.gas_cost,
            (a, _txHash) => {
                setModalOpen(true);
                setTxHash(_txHash);
                console.log('_txHash', _txHash);
            }
        )
            .then(() => setOperationStatus('success'))
            .catch(() => setOperationStatus('error'));
    };

    const [claimsValue, setClaimsValue] = useState(null);
    const [rewardedToday, setRewardedToday] = useState({
        toGetToday: 0,
        toGetNow: 0,
        time_left: 0
    });
    const [enableButtonClaim, setEnableButtonClaim] = useState(false);

    const claimsCall = () => {
        if (auth.isLoggedIn) {
            setTimeout(() => {
                try {
                    api(
                        'get',
                        `${config.environment.api.incentives}balance/${accountData.Owner}`,
                        {}
                    )
                        .then((response) => {
                            setClaimsValue(response);
                            const { toGetToday, toGetNow, time_left } =
                                getRewardedToday(
                                    response.daily_moc,
                                    userBalanceData.liquidityCollateralToken,
                                    response.total_bpro,
                                    response.end_block_dt
                                );
                            setRewardedToday({
                                toGetToday: toGetToday,
                                toGetNow: toGetNow,
                                time_left: time_left
                            });
                        })
                        .catch((response) => {
                            console.log(response);
                        });
                } catch (error) {
                    console.error({ error });
                    console.log(error);
                }
            }, 500);
        }
    };

    const enableClaim = () => {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        const datas = {
            address: accountData.Owner,
            limit: 20,
            skip: (1 - 1 + (1 - 1)) * 10
        };
        setTimeout(() => {
            try {
                api(
                    'get',
                    config.environment.api.incentives +
                        'claims/' +
                        accountData.Owner,
                    datas
                )
                    .then((response) => {
                        const disabled = response.some(
                            (e) =>
                                moment.unix(e.creation).format('MM/DD/YYYY') ===
                                today
                        );
                        setEnableButtonClaim(disabled);
                    })
                    .catch((response) => {});
            } catch (error) {
                console.error({ error });
                console.log(error);
            }
        }, 500);
    };

    useEffect(() => {
        if (userBalanceData && accountData.Owner !== undefined) {
            claimsCall();
            enableClaim();
        }
    }, [auth, accountData.Owner]);

    const [loading, setLoading] = useState(true);
    const timeSke = 1500;

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    }, [auth]);

    return (
        <div className="Card RewardsBalanceLiquidity withPadding hasTitle sect__home__liquidity">
            {!loading ? (
                <>
                    <div className="title">
                        <h1>
                            {t('global.RewardsBalance_MocLiquidityMining', {
                                ns: 'global'
                            })}
                        </h1>
                        <Tooltip
                            placement="topRight"
                            title={t('global.RewardsBalance_MoreInfo', {
                                ns: 'global'
                            })}
                            className="Tooltip"
                        >
                            <InfoCircleOutlined className="Icon" />
                        </Tooltip>
                    </div>

                    <div className="Metric">
                        <h2>
                            {t('global.RewardsBalance_EarnedToday', {
                                ns: 'global'
                            })}
                        </h2>{' '}
                        <div className="IncentivesItem">
                            <h3>
                                {auth.isLoggedIn &&
                                    rewardedToday != undefined &&
                                    rewardedToday.toGetToday != 0 && (
                                        <CountUp
                                            end={rewardedToday.toGetToday.toFixed(
                                                6
                                            )}
                                            start={rewardedToday.toGetNow.toFixed(
                                                6
                                            )}
                                            useEasing={false}
                                            decimals={6}
                                            separator={
                                                i18n.languages[0] === 'es'
                                                    ? '.'
                                                    : ','
                                            }
                                            decimal={
                                                i18n.languages[0] === 'es'
                                                    ? ','
                                                    : '.'
                                            }
                                            onEnd={({
                                                pauseResume,
                                                reset,
                                                start,
                                                update
                                            }) => start()}
                                            duration={rewardedToday.time_left}
                                        />
                                    )}
                                {!auth.isLoggedIn && <span>0.000000</span>}
                            </h3>
                            {rewardedToday != 0 && <p>MOC</p>}
                        </div>
                    </div>
                    <div className="Separator"></div>
                    <div className="Metric">
                        <h2>
                            {t('global.RewardsBalance_Amount', {
                                ns: 'global'
                            })}
                        </h2>{' '}
                        <div className="IncentivesItem">
                            <h3>
                                {auth.isLoggedIn && (
                                    <LargeNumber
                                        amount={
                                            claimsValue != null
                                                ? claimsValue.moc_balance
                                                : 0
                                        }
                                        currencyCode="REWARD"
                                    />
                                )}
                                {!auth.isLoggedIn && <span>0.000000 </span>}
                            </h3>
                            <p>MOC</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {!props.rewards ? (
                            <Link to="/rewards">
                                <div className="button__arrow"></div>
                                <button
                                    type="button"
                                    className="ButtonPrimary claimButton"
                                >
                                    <span
                                        role="img"
                                        aria-label="arrow-right"
                                        className="anticon anticon-arrow-right"
                                    >
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            className=""
                                            data-icon="arrow-right"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path>
                                        </svg>
                                    </span>
                                </button>
                            </Link>
                        ) : (
                            <Button
                                style={{
                                    marginTop: '3.5em',
                                    fontFamily: 'Montserrat,sans-serif',
                                    fontSize: '1em',
                                    fontWeight: 700
                                }}
                                type="primary"
                                disabled={!auth.isLoggedIn || enableButtonClaim}
                                onClick={claim}
                            >
                                {t('global.RewardsClaimButton_Claim', {
                                    ns: 'global'
                                })}
                            </Button>
                        )}
                        <OperationStatusModal
                            className="ClaimStatusModal"
                            visible={modalOpen}
                            onCancel={() => setModalOpen(false)}
                            operationStatus={operationStatus}
                            txHash={txHash}
                        />
                    </div>
                </>
            ) : (
                <Skeleton active={true} paragraph={{ rows: 2 }}></Skeleton>
            )}
        </div>
    );
}

export default MocLiquidity;
